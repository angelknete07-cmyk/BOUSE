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
