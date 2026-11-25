import { useEffect, useMemo, useRef, useState } from "react";
import type { Lesson } from "../data/lessons";
import {
  clockLabel,
  durationLabel,
  figuresIn,
  formulaIn,
  isTrack,
  lineAt,
  partLabel,
  partProgress,
  partsOf,
  videoQuestions,
  wordsSaid,
  type LearningMode,
  type VoiceTrack,
} from "../lib/lessonVideo";
import { isStoryboard, type Storyboard } from "../lib/lessonScenes";
import { Icon } from "./Icon";
import { LessonScenes } from "./LessonScenes";
import { Terrain } from "./Terrain";

type Props = {
  lesson: Lesson;
  mode: LearningMode;
  onMode: (mode: LearningMode) => void;
  /** Après l'exercice de fin de vidéo : le quiz. */
  onQuiz: () => void;
  /** Le brouillon de l'exercice, partagé avec l'onglet « Pratiquer ». */
  exerciseText: string;
  onExerciseText: (text: string) => void;
};

const SPEEDS = [1, 1.25, 1.5, 0.85];
const base = import.meta.env.BASE_URL ?? "/";
const positionKey = (id: string) => `bouse-voix-position-${id}`;

function readPosition(id: string): number {
  try {
    return Number(localStorage.getItem(positionKey(id))) || 0;
  } catch {
    return 0;
  }
}
function savePosition(id: string, seconds: number) {
  try {
    if (seconds > 1) localStorage.setItem(positionKey(id), seconds.toFixed(1));
    else localStorage.removeItem(positionKey(id));
  } catch {
    /* navigation privée : on ne garde simplement pas la position */
  }
}

/**
 * La leçon en vidéo (image animée qui suit la voix) ou en podcast (la voix
 * seule). La lecture reste juste en dessous, inchangée (« Lire »).
 */
export function LessonMedia({
  lesson,
  mode,
  onMode,
  onQuiz,
  exerciseText,
  onExerciseText,
}: Props) {
  const [track, setTrack] = useState<VoiceTrack | null>(null);
  const [board, setBoard] = useState<Storyboard | null>(null);
  const [failed, setFailed] = useState(false);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [captions, setCaptions] = useState(false);
  const [askingAt, setAskingAt] = useState<number | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [ended, setEnded] = useState(false);
  const [hint, setHint] = useState(false);
  const [solution, setSolution] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  const asked = useRef(new Set<number>());
  const saved = useRef(0);

  useEffect(() => {
    let live = true;
    setTrack(null);
    setFailed(false);
    setEnded(false);
    setHint(false);
    setSolution(false);
    setAskingAt(null);
    fetch(`${base}lecons-voix/${lesson.id}.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (!live) return;
        if (isTrack(json) && json.lesson === lesson.id) setTrack(json);
        else setFailed(true);
      })
      .catch(() => live && setFailed(true));
    return () => {
      live = false;
    };
  }, [lesson.id]);

  // Le scénario animé (s'il manque, la vidéo affiche les phrases de la voix).
  useEffect(() => {
    let live = true;
    setBoard(null);
    fetch(`${base}lecons-scenes/${lesson.id}.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (live && isStoryboard(json) && json.lesson === lesson.id) setBoard(json);
      })
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, [lesson.id]);

  // L'image suit la voix image par image pendant la lecture.
  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    const tick = () => {
      const el = audio.current;
      if (el) setTime(el.currentTime);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  // En quittant « Regarder » ou « Écouter », la voix s'arrête.
  useEffect(() => {
    if (mode === "lire") audio.current?.pause();
  }, [mode]);

  // Une question rapide après chaque partie (quiz ou carte de révision).
  const stops = useMemo(
    () =>
      track
        ? videoQuestions(track, lesson.sections, lesson.quiz, lesson.flashcards)
        : [],
    [track, lesson],
  );
  const asking = askingAt !== null;
  const stop = askingAt !== null ? stops[askingAt] : undefined;
  const question = stop?.kind === "quiz" ? lesson.quiz[stop.index] : undefined;
  const card = stop?.kind === "card" ? lesson.flashcards[stop.index] : undefined;
  useEffect(() => {
    const el = audio.current;
    if (!el || !playing || mode !== "regarder") return;
    const next = stops.findIndex(
      (s, i) => !asked.current.has(i) && time >= s.at,
    );
    if (next < 0) return;
    asked.current.add(next);
    el.pause();
    setPicked(null);
    setFlipped(false);
    setAskingAt(next);
  }, [time, playing, mode, stops]);
  /** Les arrêts déjà dépassés ne se rouvrent pas quand on saute plus loin. */
  function passedUntil(at: number) {
    asked.current = new Set(
      stops.flatMap((s, i) => (s.at < at ? [i] : [])),
    );
  }

  function onLoaded() {
    const el = audio.current;
    if (!el || !track) return;
    const at = readPosition(lesson.id);
    if (at > 0 && at < track.duration - 3) {
      el.currentTime = at;
      setTime(at);
      passedUntil(at);
    }
  }
  function onTime() {
    const el = audio.current;
    if (!el) return;
    if (!playing) setTime(el.currentTime);
    if (Math.abs(el.currentTime - saved.current) > 2) {
      saved.current = el.currentTime;
      savePosition(lesson.id, el.currentTime);
    }
  }
  function onPlay() {
    setPlaying(true);
    setEnded(false);
    if ("mediaSession" in navigator && typeof MediaMetadata !== "undefined") {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: lesson.title,
        artist: "BOOST",
        album: lesson.domain,
      });
    }
  }
  function toggle() {
    const el = audio.current;
    if (!el || asking) return;
    if (el.paused) {
      if (ended) {
        el.currentTime = 0;
        asked.current = new Set();
      }
      el.play().catch(() => setFailed(true));
    } else el.pause();
  }
  function seek(to: number) {
    const el = audio.current;
    if (!el || !track) return;
    const at = Math.max(0, Math.min(track.duration, to));
    el.currentTime = at;
    setTime(at);
    setEnded(false);
    passedUntil(at);
  }
  function resume() {
    setAskingAt(null);
    setPicked(null);
    setFlipped(false);
    audio.current?.play().catch(() => setFailed(true));
  }

  const modes: { id: LearningMode; label: string; hint: string }[] = [
    { id: "lire", label: "Lire", hint: "à votre rythme" },
    {
      id: "regarder",
      label: "Regarder",
      hint: track ? durationLabel(track.duration) : "vidéo",
    },
    { id: "ecouter", label: "Écouter", hint: "podcast" },
  ];
  const picker = (
    <div
      className="lm-modes"
      role="group"
      aria-label="Votre façon d’apprendre cette leçon"
    >
      {modes.map((m) => (
        <button
          key={m.id}
          type="button"
          aria-pressed={mode === m.id}
          onClick={() => onMode(m.id)}
        >
          <Icon
            name={
              m.id === "lire"
                ? "book"
                : m.id === "regarder"
                  ? "play"
                  : "headphones"
            }
            size={15}
          />
          {m.label} <small>{m.hint}</small>
        </button>
      ))}
    </div>
  );
  if (mode === "lire") return <div className="lesson-media">{picker}</div>;
  if (failed && !track)
    return (
      <div className="lesson-media">
        {picker}
        <p className="lm-missing" role="status">
          La vidéo de cette leçon n’est pas encore prête. La lecture reste juste
          en dessous.
        </p>
      </div>
    );

  const sections = lesson.sections.length;
  const index = track ? lineAt(track, time) : -1;
  const line = track && index >= 0 ? track.lines[index]! : null;
  const part = line?.part ?? -1;
  const partTitle =
    track?.lines.find((l) => l.part === part && l.kind === "title")?.text ??
    lesson.title;
  const kicker = partLabel(part, sections);
  const words = line?.kind === "line" ? line.text.split(/\s+/) : [];
  const lit = line ? wordsSaid(line, words.length, time) : 0;
  const before = index > 0 ? track!.lines[index - 1]! : null;
  const formula = line?.kind === "line" ? formulaIn(line.text) : null;
  const figures = line?.kind === "line" && !formula ? figuresIn(line.text) : [];
  const podcast = mode === "ecouter";
  const animated =
    !podcast && board !== null && track !== null && board.version === track.version;

  return (
    <div className="lesson-media">
      {picker}
      <div
        className={`lm-player${podcast ? " is-podcast" : ""}${playing ? " is-playing" : ""}${animated ? " is-animated" : ""}`}
      >
        <div
          className="lm-stage"
          role="region"
          aria-label={podcast ? "Podcast de la leçon" : "Vidéo de la leçon"}
          data-open={ended || undefined}
          onClick={toggle}
        >
          {!podcast && (
            <div className="lm-waves" aria-hidden="true">
              <Terrain />
            </div>
          )}
          {track && (
            <div className="lm-chapters" aria-hidden="true">
              {partsOf(track).map((p) => (
                <i key={p}>
                  <b
                    style={
                      {
                        "--p": partProgress(track, p, time),
                      } as React.CSSProperties
                    }
                  />
                </i>
              ))}
            </div>
          )}
          <div className="lm-brand" aria-hidden="true">
            BOOST · {podcast ? "Podcast" : "Leçon en vidéo"}
          </div>
          {animated && (
            <LessonScenes
              board={board}
              time={time}
              kicker={
                !line || part < 0 ? kicker : `${kicker} · ${partTitle}`
              }
            />
          )}
          <div
            className={`lm-scene${animated ? " is-hidden-by-scenes" : ""}`}
            key={podcast ? part : index}
            aria-live="off"
          >
            {!line || line.kind === "title" || podcast ? (
              <>
                <div className="lm-kicker lm-enter">{kicker}</div>
                <p className="lm-big lm-enter-2">{partTitle}</p>
                {podcast && (
                  <p className="lm-prev lm-hint">
                    Vous pouvez éteindre l’écran : la voix continue.
                  </p>
                )}
              </>
            ) : (
              <>
                <div className="lm-kicker">
                  {kicker} · {partTitle}
                </div>
                {before?.kind === "line" && before.part === part && (
                  <p className="lm-prev">{before.text}</p>
                )}
                <p className="lm-line lm-enter">
                  {words.map((w, i) => (
                    <span key={i} className={i < lit ? "is-on" : undefined}>
                      {w}{" "}
                    </span>
                  ))}
                </p>
                {formula && (
                  <div className="lm-formula lm-pop">
                    <span>{formula.left}</span>
                    <span className="lm-eq">=</span>
                    <span>{formula.right}</span>
                  </div>
                )}
                {figures.length >= 2 && (
                  <div className="lm-chips">
                    {figures.map((f, i) => (
                      <span
                        key={f}
                        className="lm-pop"
                        style={{ animationDelay: `${i * 90}ms` }}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
          {captions && line && <p className="lm-caption">{line.text}</p>}
          {!playing && !asking && !ended && (
            <div className="lm-bigplay" aria-hidden="true">
              <span>
                <Icon name="play" size={28} />
              </span>
            </div>
          )}
          {asking && stop && (
            <div className="lm-ask" onClick={(e) => e.stopPropagation()}>
              <div
                className="lm-ask-card"
                role="dialog"
                aria-label="Question rapide"
              >
                <p className="lm-kicker lm-ask-head">
                  <span>
                    {question ? "Question" : "Rappel"} · Partie {stop.part + 1}
                  </span>
                  <span className="lm-ask-count">
                    {askingAt! + 1} / {stops.length}
                  </span>
                </p>
                {question && (
                  <>
                    <p className="lm-ask-q">{question.question}</p>
                    {question.options.map((option, i) => (
                      <button
                        key={i}
                        type="button"
                        className="lm-opt"
                        disabled={picked !== null}
                        data-r={
                          picked === null
                            ? undefined
                            : i === question.answer
                              ? "ok"
                              : i === picked
                                ? "ko"
                                : undefined
                        }
                        onClick={() => setPicked(i)}
                      >
                        {option}
                      </button>
                    ))}
                    {picked !== null && (
                      <p className="lm-why" role="status">
                        {picked === question.answer
                          ? "Juste. "
                          : "Pas tout à fait. "}
                        {question.explanation}
                      </p>
                    )}
                  </>
                )}
                {card && (
                  <>
                    <p className="lm-ask-q">{card.front}</p>
                    {flipped ? (
                      <p className="lm-why" role="status">
                        {card.back}
                      </p>
                    ) : (
                      <p className="lm-ask-think">
                        Répondez dans votre tête, puis retournez la carte.
                      </p>
                    )}
                  </>
                )}
                <div className="lm-ask-actions">
                  {card && !flipped ? (
                    <>
                      <button
                        type="button"
                        className="lm-ctl lm-main lm-wide"
                        onClick={() => setFlipped(true)}
                      >
                        Voir la réponse
                      </button>
                      <button
                        type="button"
                        className="lm-ctl lm-wide"
                        onClick={resume}
                      >
                        Passer
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="lm-ctl lm-main lm-wide"
                      onClick={resume}
                    >
                      {question && picked === null
                        ? "Passer"
                        : "Reprendre la vidéo"}{" "}
                      <Icon name="arrow" size={15} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
          {ended && (
            <div className="lm-ask" onClick={(e) => e.stopPropagation()}>
              <div
                className="lm-ask-card lm-end"
                role="dialog"
                aria-label="Exercice de la leçon"
              >
                <p className="lm-kicker">À vous de jouer · l’exercice</p>
                <p className="lm-ask-q">{lesson.exercise.prompt}</p>
                <label className="lm-ex-field">
                  <span className="sr-only">Votre réponse</span>
                  <textarea
                    rows={2}
                    value={exerciseText}
                    onChange={(e) => onExerciseText(e.target.value)}
                    placeholder="Votre réponse, votre calcul…"
                  />
                </label>
                {hint && !solution && (
                  <p className="lm-why" role="status">
                    <b>Indice. </b>
                    {lesson.exercise.hint}
                  </p>
                )}
                {solution && (
                  <div className="lm-why lm-solution" role="status">
                    <strong>{lesson.exercise.answer}</strong>
                    <span>{lesson.exercise.explanation}</span>
                  </div>
                )}
                <div className="lm-ask-actions">
                  {solution ? (
                    <button
                      type="button"
                      className="lm-ctl lm-main lm-wide"
                      onClick={onQuiz}
                    >
                      Passer au quiz <Icon name="arrow" size={15} />
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="lm-ctl lm-main lm-wide"
                        onClick={() => setSolution(true)}
                      >
                        Voir la solution
                      </button>
                      {!hint && (
                        <button
                          type="button"
                          className="lm-ctl lm-wide"
                          onClick={() => setHint(true)}
                        >
                          Un indice
                        </button>
                      )}
                    </>
                  )}
                  <button
                    type="button"
                    className="lm-ctl lm-wide"
                    onClick={() => {
                      setEnded(false);
                      seek(0);
                    }}
                  >
                    Revoir
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="lm-bar">
          <button
            type="button"
            className="lm-ctl lm-main"
            onClick={toggle}
            disabled={!track}
            aria-label={playing ? "Pause" : "Lecture"}
          >
            {playing ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <Icon name="play" size={16} />
            )}
          </button>
          <button
            type="button"
            className="lm-ctl lm-hide-s"
            onClick={() => seek(time - 10)}
            disabled={!track}
            aria-label="Reculer de 10 secondes"
          >
            −10
          </button>
          <input
            className="lm-seek"
            type="range"
            min={0}
            max={track ? Math.round(track.duration) : 1}
            step={1}
            value={Math.round(time)}
            disabled={!track}
            aria-label="Position dans la leçon"
            aria-valuetext={`${clockLabel(time)} sur ${clockLabel(track?.duration ?? 0)}`}
            style={
              {
                "--t": `${track ? (time / track.duration) * 100 : 0}%`,
              } as React.CSSProperties
            }
            onChange={(e) => seek(Number(e.target.value))}
          />
          <span className="lm-time">
            {clockLabel(time)} / {clockLabel(track?.duration ?? 0)}
          </span>
          <button
            type="button"
            className="lm-ctl"
            aria-label={`Vitesse : ${String(speed).replace(".", ",")} fois`}
            onClick={() => {
              const next = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length]!;
              setSpeed(next);
              if (audio.current) audio.current.playbackRate = next;
            }}
          >
            {String(speed).replace(".", ",")}×
          </button>
          {!podcast && (
            <button
              type="button"
              className="lm-ctl"
              aria-pressed={captions}
              onClick={() => setCaptions((c) => !c)}
            >
              CC <span className="sr-only">sous-titres</span>
            </button>
          )}
        </div>
        {failed && (
          <p className="lm-missing" role="status">
            Le son ne se charge pas (connexion ?). La lecture reste juste en
            dessous.
          </p>
        )}
      </div>
      {track && (
        <audio
          ref={audio}
          src={`${base}lecons-voix/${lesson.id}.m4a`}
          preload="metadata"
          onLoadedMetadata={onLoaded}
          onTimeUpdate={onTime}
          onPlay={onPlay}
          onPause={() => {
            setPlaying(false);
            if (audio.current) setTime(audio.current.currentTime);
          }}
          onEnded={() => {
            setPlaying(false);
            setAskingAt(null);
            setEnded(true);
            savePosition(lesson.id, 0);
          }}
          onError={() => setFailed(true)}
          onRateChange={(e) => setSpeed(e.currentTarget.playbackRate)}
        />
      )}
    </div>
  );
}
