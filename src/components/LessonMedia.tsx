import { useEffect, useRef, useState } from "react";
import type { Lesson } from "../data/lessons";
import {
  askAfter,
  clockLabel,
  durationLabel,
  figuresIn,
  formulaIn,
  isTrack,
  lineAt,
  partLabel,
  partProgress,
  partsOf,
  wordsSaid,
  type LearningMode,
  type VoiceTrack,
} from "../lib/lessonVideo";
import { Icon } from "./Icon";
import { Terrain } from "./Terrain";

type Props = {
  lesson: Lesson;
  mode: LearningMode;
  onMode: (mode: LearningMode) => void;
  onExercise: () => void;
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
export function LessonMedia({ lesson, mode, onMode, onExercise }: Props) {
  const [track, setTrack] = useState<VoiceTrack | null>(null);
  const [failed, setFailed] = useState(false);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [captions, setCaptions] = useState(false);
  const [asking, setAsking] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const [ended, setEnded] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  const asked = useRef(false);
  const saved = useRef(0);

  useEffect(() => {
    let live = true;
    setTrack(null);
    setFailed(false);
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

  const ask = track ? askAfter(track) : null;
  const question = lesson.quiz[0];
  useEffect(() => {
    const el = audio.current;
    if (!el || !playing || mode !== "regarder" || asked.current) return;
    if (ask !== null && question && time >= ask) {
      asked.current = true;
      el.pause();
      setAsking(true);
    }
  }, [time, playing, mode, ask, question]);

  function onLoaded() {
    const el = audio.current;
    if (!el || !track) return;
    const at = readPosition(lesson.id);
    if (at > 0 && at < track.duration - 3) {
      el.currentTime = at;
      setTime(at);
      if (ask !== null && at >= ask) asked.current = true;
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
        asked.current = false;
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
    if (ask !== null && at < ask) asked.current = false;
  }
  function resume() {
    setAsking(false);
    setPicked(null);
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

  return (
    <div className="lesson-media">
      {picker}
      <div
        className={`lm-player${podcast ? " is-podcast" : ""}${playing ? " is-playing" : ""}`}
      >
        <div
          className="lm-stage"
          role="region"
          aria-label={podcast ? "Podcast de la leçon" : "Vidéo de la leçon"}
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
          <div
            className="lm-scene"
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
          {asking && question && (
            <div className="lm-ask" onClick={(e) => e.stopPropagation()}>
              <div
                className="lm-ask-card"
                role="dialog"
                aria-label="Question rapide"
              >
                <p className="lm-kicker">La question de départ</p>
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
                <div className="lm-ask-actions">
                  <button
                    type="button"
                    className="lm-ctl lm-main lm-wide"
                    onClick={resume}
                  >
                    {picked === null ? "Passer" : "Reprendre la vidéo"}{" "}
                    <Icon name="arrow" size={15} />
                  </button>
                </div>
              </div>
            </div>
          )}
          {ended && (
            <div className="lm-ask" onClick={(e) => e.stopPropagation()}>
              <div className="lm-ask-card lm-end">
                <p className="lm-kicker">Leçon écoutée</p>
                <p className="lm-ask-q">
                  À vous de jouer : un petit exercice, puis le quiz.
                </p>
                <div className="lm-ask-actions">
                  <button
                    type="button"
                    className="lm-ctl lm-main lm-wide"
                    onClick={onExercise}
                  >
                    Passer à l’exercice <Icon name="arrow" size={15} />
                  </button>
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
