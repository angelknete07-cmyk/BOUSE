/**
 * La leçon en vidéo et en podcast (idées 1, 36, 37, 38 ; maquette
 * maquette/video.html). La voix est un fichier par leçon, avec un minutage
 * phrase par phrase (scripts/voix-lecons.ts) ; l'image est animée en direct
 * d'après ce minutage. Calcul pur, testé dans tests/lessonVideo.test.ts.
 */

export type VoiceLine = {
  /** -1 : ouverture ; 0..n-1 : parties de la leçon ; n : l'exemple. */
  part: number;
  kind: "title" | "line";
  text: string;
  start: number;
  end: number;
};
export type VoiceTrack = {
  lesson: string;
  version: string;
  voice: string;
  duration: number;
  lines: VoiceLine[];
};
export type LearningMode = "lire" | "regarder" | "ecouter";
export const LEARNING_MODES: LearningMode[] = ["lire", "regarder", "ecouter"];
export const isLearningMode = (value: unknown): value is LearningMode =>
  LEARNING_MODES.includes(value as LearningMode);

/** Un minutage reçu du réseau : vérifié avant usage. */
export function isTrack(value: unknown): value is VoiceTrack {
  if (!value || typeof value !== "object") return false;
  const t = value as Record<string, unknown>;
  return (
    typeof t.lesson === "string" &&
    typeof t.duration === "number" &&
    t.duration > 0 &&
    Array.isArray(t.lines) &&
    t.lines.length > 0 &&
    t.lines.every(
      (l) =>
        !!l &&
        typeof l.text === "string" &&
        typeof l.start === "number" &&
        typeof l.end === "number" &&
        l.end >= l.start &&
        Number.isInteger(l.part) &&
        (l.kind === "title" || l.kind === "line"),
    )
  );
}

/** La phrase dite à l'instant t (-1 avant la première). */
export function lineAt(track: VoiceTrack, t: number): number {
  let found = -1;
  for (let i = 0; i < track.lines.length; i++) {
    if (track.lines[i]!.start <= t + 0.05) found = i;
    else break;
  }
  return found;
}

export const partsOf = (track: VoiceTrack) => [
  ...new Set(track.lines.map((l) => l.part)),
];

/** Avancée d'une partie, de 0 à 1. */
export function partProgress(
  track: VoiceTrack,
  part: number,
  t: number,
): number {
  const lines = track.lines.filter((l) => l.part === part);
  if (!lines.length) return 0;
  const start = lines[0]!.start;
  const end = lines.at(-1)!.end;
  return Math.max(0, Math.min(1, (t - start) / Math.max(0.01, end - start)));
}

/** Combien de mots de la phrase sont déjà dits (approché d'après la durée). */
export function wordsSaid(line: VoiceLine, words: number, t: number): number {
  if (t <= line.start) return 0;
  if (t >= line.end) return words;
  return Math.min(
    words,
    Math.floor(((t - line.start) / (line.end - line.start)) * words + 0.5),
  );
}

/** « CA = prix unitaire HT × quantité vendue » devient une carte. */
export function formulaIn(
  text: string,
): { left: string; right: string } | null {
  const match = text.match(/([^.:;]{2,60}?)\s=\s([^.;]{2,90})/);
  if (!match) return null;
  const left = match[1]!.replace(/^.*[:,]\s*/, "").trim();
  const right = match[2]!.replace(/[.\s]+$/, "").trim();
  return left && right ? { left, right } : null;
}

/** Les montants d'une phrase (au moins deux pour faire des pastilles). */
export function figuresIn(text: string): string[] {
  return [
    ...text.matchAll(/[−-]?\d[\d\s  ]*(?:,\d+)?\s?(?:€|%|jours|mois|ans)/g),
  ]
    .map((m) => m[0].trim())
    .filter((v, i, all) => all.indexOf(v) === i)
    .slice(0, 5);
}

/**
 * Le moment de la question dans la vidéo : à la fin de la deuxième partie
 * (le cœur de la leçon), si la leçon en a au moins trois.
 */
export function askAfter(track: VoiceTrack): number | null {
  const lines = track.lines.filter((l) => l.part === 1);
  if (!lines.length || !track.lines.some((l) => l.part === 2)) return null;
  return lines.at(-1)!.end + 0.2;
}

const STOP = new Set(
  "avec dans pour plus moins sont cette celui celle leurs votre vous nous elle elles mais donc alors aussi entre comme quand toute toutes tous tout faut peut sans sous chez avant apres encore leur deux trois"
    .split(" "),
);
/** Les mots qui portent le sens (sans accents, au moins 5 lettres). */
export function meaningWords(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length >= 5 && !STOP.has(w)),
  );
}

export type VideoQuestion = {
  /** « quiz » : trois réponses à toucher ; « card » : une carte à retourner. */
  kind: "quiz" | "card";
  index: number;
  part: number;
  at: number;
};

type QuizItem = { question: string; options: string[]; answer: number; explanation: string };
type CardItem = { front: string; back: string };

/**
 * Une question rapide après chaque partie de la vidéo (idée d'Angel, 25/11).
 * D'abord les questions du quiz, puis les cartes de révision pour les parties
 * restantes. Chacune va après la partie dont elle parle le plus, pour ne
 * jamais demander ce qui n'a pas encore été dit. Une question au plus par
 * partie ; une partie sans question proche n'arrête pas la vidéo.
 */
export function videoQuestions(
  track: VoiceTrack,
  sections: { title: string; body: string[] }[],
  quiz: QuizItem[],
  cards: CardItem[] = [],
): VideoQuestion[] {
  const partWords = sections.map((s) => meaningWords([s.title, ...s.body].join(" ")));
  const scoreOf = (text: string) => {
    const words = meaningWords(text);
    return partWords.map((pw) => [...words].filter((w) => pw.has(w)).length);
  };
  const items = [
    ...quiz.map((q, index) => ({
      kind: "quiz" as const,
      index,
      row: scoreOf([q.question, q.options[q.answer] ?? "", q.explanation].join(" ")),
    })),
    ...cards.map((c, index) => ({
      kind: "card" as const,
      index,
      row: scoreOf(`${c.front} ${c.back}`),
    })),
  ];
  const stops = sections.map((_, part) => {
    const last = track.lines.filter((l) => l.part === part).at(-1);
    return last && track.lines.some((l) => l.start > last.end) ? last.end + 0.2 : null;
  });
  const chosen = new Map<number, VideoQuestion>();
  const used = new Set<(typeof items)[number]>();
  for (const kind of ["quiz", "card"] as const) {
    stops.forEach((at, part) => {
      if (at === null || chosen.has(part)) return;
      let best: (typeof items)[number] | null = null;
      let bestScore = 0;
      for (const item of items) {
        if (item.kind !== kind || used.has(item)) continue;
        // La question doit parler surtout de cette partie, pas d'une suivante.
        const later = Math.max(0, ...item.row.slice(part + 1));
        const score = item.row[part] ?? 0;
        if (score > bestScore && score >= later) {
          best = item;
          bestScore = score;
        }
      }
      if (!best) return;
      used.add(best);
      chosen.set(part, { kind, index: best.index, part, at });
    });
  }
  return [...chosen.values()].sort((a, b) => a.at - b.at);
}

/** « Leçon », « Partie 2 / 4 » ou « Exemple ». */
export function partLabel(part: number, sections: number): string {
  if (part < 0) return "Leçon";
  if (part >= sections) return "Exemple";
  return `Partie ${part + 1} / ${sections}`;
}

export function clockLabel(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function durationLabel(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m ? `${m} min ${String(s).padStart(2, "0")}` : `${s} s`;
}
