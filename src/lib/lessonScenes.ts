/* La vidéo animée d'une leçon : un scénario (« storyboard ») calé sur le
   minutage de la voix. Chaque scène couvre un moment de la voix ; chaque
   élément apparaît à l'instant `at` (en secondes). Tout se calcule d'après
   le temps de la voix : on peut avancer, reculer, accélérer, l'image suit.
   Format détaillé pour écrire un scénario : docs/SCENES.md. */

import { ICONS, CHARACTERS } from "./sceneArt.ts";
import type { VoiceTrack } from "./lessonVideo.ts";

export type Tone = "gain" | "loss" | "accent" | "muted";

type Base = {
  /** Instant d'apparition (secondes de la voix). */
  at: number;
  /** Instant où l'élément s'efface (facultatif). */
  out?: number;
  /** Disparaît complètement à `out` (sinon il reste en retrait). */
  hide?: boolean;
  /** Nom pour les pièces qui volent (`fly`). */
  id?: string;
};

export type TextItem = Base & {
  type: "text";
  /** `[[mot]]` colore le mot (lavande) ; `[[mot|gain]]`, `[[mot|loss]]`. */
  text: string;
  size?: "title" | "big" | "mid" | "small";
  tone?: Tone;
  /** Souligne ce passage du texte quand la voix le dit. */
  mark?: { text: string; at: number };
};
export type IconItem = Base & {
  type: "icon";
  icon: string;
  label?: string;
  size?: "s" | "m" | "l";
  tone?: Tone;
};
export type IconsItem = Base & {
  type: "icons";
  icon: string;
  count: number;
  /** Écart entre deux apparitions (0,3 s par défaut). */
  step?: number;
  label?: string;
};
export type ChipsItem = Base & {
  type: "chips";
  /** Un `text` d'un seul signe (+ − × ÷ = → ≠) s'affiche comme opérateur. */
  items: { text: string; at: number; tone?: Tone }[];
};
export type CardsItem = Base & {
  type: "cards";
  items: {
    icon?: string;
    title: string;
    sub?: string;
    at: number;
    subAt?: number;
    tone?: Tone;
    accent?: boolean;
  }[];
};
export type CounterItem = Base & {
  type: "counter";
  label: string;
  from?: number;
  to: number;
  until: number;
  unit?: string;
  tone?: Tone;
  /** Ajoute une jauge qui se vide ou se remplit (sur `max`). */
  bar?: boolean;
  max?: number;
};
export type StatsItem = Base & {
  type: "stats";
  items: {
    label: string;
    value: number;
    unit?: string;
    at: number;
    until?: number;
    tone?: Tone;
    accent?: boolean;
  }[];
};
export type BarsItem = Base & {
  type: "bars";
  unit?: string;
  items: { label: string; value: number; at: number; tone?: Tone }[];
};
export type WaterfallItem = Base & {
  type: "waterfall";
  unit?: string;
  rows: {
    label: string;
    value: number;
    kind: "start" | "plus" | "minus" | "total";
    at: number;
    tone?: Tone;
  }[];
};
export type AccountItem = Base & {
  type: "account";
  label?: string;
  start: number;
  unit?: string;
  flows: {
    label: string;
    amount: number;
    dir: "in" | "out";
    at: number;
    note?: string;
  }[];
};
export type TimelineItem = Base & {
  type: "timeline";
  points: { label: string; sub?: string; at: number; pos: number }[];
  span?: { label: string; from: number; to: number; at: number };
};
export type ChartItem = Base & {
  type: "chart";
  lines: {
    label: string;
    values: number[];
    at: number;
    until: number;
    tone?: Tone;
  }[];
  /** Ligne de repère (par exemple 0 €). */
  baseline?: { value: number; label: string };
};
export type ListItem = Base & {
  type: "list";
  style?: "num" | "check" | "cross" | "dot";
  items: { text: string; at: number; style?: "num" | "check" | "cross" | "dot" }[];
};
export type StepsItem = Base & {
  type: "steps";
  items: { text: string; icon?: string; at: number }[];
};
export type SplitItem = Base & {
  type: "split";
  label?: string;
  total: number;
  unit?: string;
  parts: { label: string; value: number; at: number; tone?: Tone }[];
};
export type GaugeItem = Base & {
  type: "gauge";
  label: string;
  value: number;
  until: number;
  tone?: Tone;
};
export type CompareItem = Base & {
  type: "compare";
  left: { title: string; icon?: string; items: { text: string; at: number }[] };
  right: { title: string; icon?: string; items: { text: string; at: number }[] };
};
export type DialogItem = Base & {
  type: "dialog";
  items: {
    character: string;
    name?: string;
    text: string;
    at: number;
    side?: "left" | "right";
  }[];
};
export type ActorItem = Base & {
  type: "actor";
  character: string;
  name?: string;
  think?: { text: string; at: number };
};
export type FlyItem = Base & {
  type: "fly";
  from: string;
  to: string;
  until: number;
  count?: number;
  dir?: "in" | "out";
};
export type RowItem = Base & {
  type: "row";
  items: Exclude<SceneItem, RowItem>[];
};

export type SceneItem =
  | TextItem
  | IconItem
  | IconsItem
  | ChipsItem
  | CardsItem
  | CounterItem
  | StatsItem
  | BarsItem
  | WaterfallItem
  | AccountItem
  | TimelineItem
  | ChartItem
  | ListItem
  | StepsItem
  | SplitItem
  | GaugeItem
  | CompareItem
  | DialogItem
  | ActorItem
  | FlyItem
  | RowItem;

export type Scene = { from: number; to: number; items: SceneItem[] };
export type Storyboard = {
  lesson: string;
  /** Même version que la voix (`lecons-voix/<id>.json`). */
  version: string;
  scenes: Scene[];
};

/* ---------------- Calculs partagés ---------------- */

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
/** Progression adoucie (sortie en douceur) entre `a` et `b`. */
export function progress(t: number, a: number, b: number): number {
  if (b <= a) return t >= a ? 1 : 0;
  const x = clamp01((t - a) / (b - a));
  return 1 - Math.pow(1 - x, 3);
}
export function money(value: number, unit = " €"): string {
  const sign = value < 0 ? "−" : "";
  const abs = Math.abs(value);
  const digits = Number.isInteger(abs) ? 0 : 1;
  return `${sign}${abs.toLocaleString("fr-FR", { maximumFractionDigits: digits, minimumFractionDigits: digits })}${unit}`;
}

/** Découpe `[[mot]]` / `[[mot|ton]]` en morceaux colorés. */
export function richText(text: string): { text: string; tone?: Tone }[] {
  const parts: { text: string; tone?: Tone }[] = [];
  const re = /\[\[([^\]|]+)(?:\|(gain|loss|accent|muted))?\]\]/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index! > last) parts.push({ text: text.slice(last, m.index) });
    parts.push({ text: m[1]!, tone: (m[2] as Tone) ?? "accent" });
    last = m.index! + m[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last) });
  return parts;
}
export const plainText = (text: string) =>
  richText(text)
    .map((p) => p.text)
    .join("");

/** Positions des barres d'une cascade : départ, ajouts, retraits, totaux. */
export function waterfallLayout(rows: WaterfallItem["rows"]) {
  let run = 0;
  const out = rows.map((r) => {
    let x0 = 0;
    let x1 = 0;
    if (r.kind === "start" || r.kind === "total") {
      if (r.kind === "start") run = r.value;
      x0 = Math.min(0, run);
      x1 = Math.max(0, run);
    } else if (r.kind === "plus") {
      x0 = run;
      run += r.value;
      x1 = run;
    } else {
      x1 = run;
      run -= r.value;
      x0 = run;
    }
    return { x0: Math.min(x0, x1), x1: Math.max(x0, x1), running: run };
  });
  const lo = Math.min(0, ...out.map((o) => o.x0));
  const hi = Math.max(...out.map((o) => o.x1), 1);
  return out.map((o) => ({
    ...o,
    left: (o.x0 - lo) / (hi - lo),
    width: (o.x1 - o.x0) / (hi - lo),
  }));
}

/** Solde du compte à l'instant t (chaque flux compte à son arrivée). */
export const FLY_TIME = 0.7;
export function accountAt(item: AccountItem, t: number): number {
  return item.flows.reduce(
    (sum, f) =>
      t >= f.at + FLY_TIME ? sum + (f.dir === "in" ? f.amount : -f.amount) : sum,
    item.start,
  );
}

/** Tracé lisse d'une courbe dans une boîte 600 × 200. */
export function chartPaths(item: ChartItem) {
  const all = item.lines.flatMap((l) => l.values);
  if (item.baseline) all.push(item.baseline.value);
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  const span = hi - lo || 1;
  const y = (v: number) => 190 - ((v - lo) / span) * 180;
  const lines = item.lines.map((l) => {
    const n = l.values.length;
    const pts = l.values.map((v, i) => [n === 1 ? 300 : (i / (n - 1)) * 600, y(v)] as const);
    let d = `M${pts[0]![0].toFixed(1)} ${pts[0]![1].toFixed(1)}`;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1]!;
      const [x1, y1] = pts[i]!;
      const mx = (x0 + x1) / 2;
      d += ` C${mx.toFixed(1)} ${y0.toFixed(1)}, ${mx.toFixed(1)} ${y1.toFixed(1)}, ${x1.toFixed(1)} ${y1.toFixed(1)}`;
    }
    return { d, end: pts[pts.length - 1]! };
  });
  return { lines, baseline: item.baseline ? y(item.baseline.value) : null };
}

/* ---------------- Vérification d'un scénario ---------------- */

const LIMITS = { title: 70, big: 80, mid: 110, small: 140, chip: 42, card: 32, sub: 70, list: 80 };
const TONES = ["gain", "loss", "accent", "muted", undefined];

function times(item: SceneItem): number[] {
  const own = [item.at];
  const sub = (xs: { at: number }[]) => xs.map((x) => x.at);
  switch (item.type) {
    case "chips":
    case "cards":
    case "stats":
    case "bars":
    case "list":
    case "steps":
    case "dialog":
      return own.concat(sub((item as { items: { at: number }[] }).items));
    case "waterfall":
      return own.concat(sub(item.rows));
    case "account":
      return own.concat(sub(item.flows));
    case "timeline":
      return own.concat(sub(item.points), item.span ? [item.span.at] : []);
    case "chart":
      return own.concat(sub(item.lines));
    case "split":
      return own.concat(sub(item.parts));
    case "compare":
      return own.concat(sub(item.left.items), sub(item.right.items));
    case "row":
      return own.concat(item.items.flatMap(times));
    default:
      return own;
  }
}

function ids(item: SceneItem): string[] {
  const own = item.id ? [item.id] : [];
  if (item.type === "icons" && item.id)
    return own.concat(Array.from({ length: item.count }, (_, i) => `${item.id}-${i}`));
  if (item.type === "row") return own.concat(item.items.flatMap(ids));
  return own;
}

function checkItem(item: SceneItem, where: string, errors: string[]) {
  const len = (text: string, max: number, what: string) => {
    if (plainText(text).length > max)
      errors.push(`${where} : ${what} trop long (${plainText(text).length} > ${max}) « ${plainText(text)} »`);
  };
  const icon = (name: string | undefined) => {
    if (name && !ICONS[name]) errors.push(`${where} : icône inconnue « ${name} »`);
  };
  const tone = (t: string | undefined) => {
    if (!TONES.includes(t)) errors.push(`${where} : ton inconnu « ${t} »`);
  };
  if (typeof item.at !== "number" || Number.isNaN(item.at)) errors.push(`${where} : « at » manquant`);
  switch (item.type) {
    case "text":
      len(item.text, LIMITS[item.size ?? "mid"], "texte");
      tone(item.tone);
      if (item.mark && !plainText(item.text).includes(item.mark.text))
        errors.push(`${where} : « mark » absent du texte`);
      break;
    case "icon":
      icon(item.icon);
      if (item.label) len(item.label, LIMITS.sub, "étiquette");
      break;
    case "icons":
      icon(item.icon);
      if (item.count < 1 || item.count > 12) errors.push(`${where} : de 1 à 12 icônes`);
      break;
    case "chips":
      item.items.forEach((c) => (len(c.text, LIMITS.chip, "pastille"), tone(c.tone)));
      if (item.items.length > 7) errors.push(`${where} : 7 pastilles au plus`);
      break;
    case "cards":
      item.items.forEach((c) => {
        icon(c.icon);
        len(c.title, LIMITS.card, "titre de carte");
        if (c.sub) len(c.sub, LIMITS.sub, "sous-titre de carte");
      });
      if (item.items.length > 4) errors.push(`${where} : 4 cartes au plus`);
      break;
    case "counter":
      if (item.until < item.at) errors.push(`${where} : « until » avant « at »`);
      break;
    case "stats":
      if (item.items.length > 4) errors.push(`${where} : 4 chiffres au plus`);
      item.items.forEach((s) => len(s.label, LIMITS.card, "libellé"));
      break;
    case "bars":
      if (item.items.length > 6) errors.push(`${where} : 6 barres au plus`);
      break;
    case "waterfall":
      if (item.rows.length > 6) errors.push(`${where} : 6 lignes au plus`);
      if (item.rows[0]?.kind !== "start") errors.push(`${where} : une cascade commence par « start »`);
      {
        const layout = waterfallLayout(item.rows);
        item.rows.forEach((r, i) => {
          if (r.kind === "total" && Math.abs(layout[i]!.running - r.value) > 0.5)
            errors.push(`${where} : total « ${r.label} » faux (${r.value} au lieu de ${layout[i]!.running})`);
        });
      }
      break;
    case "account":
      if (item.flows.length > 4) errors.push(`${where} : 4 flux au plus`);
      item.flows.forEach((f) => len(f.label, LIMITS.card, "flux"));
      break;
    case "timeline":
      item.points.forEach((p) => {
        if (p.pos < 0 || p.pos > 100) errors.push(`${where} : « pos » de 0 à 100`);
        len(p.label, LIMITS.card, "point");
      });
      break;
    case "chart":
      item.lines.forEach((l) => {
        if (l.values.length < 2) errors.push(`${where} : au moins 2 valeurs par courbe`);
        if (l.until <= l.at) errors.push(`${where} : « until » avant « at »`);
      });
      if (item.lines.length > 3) errors.push(`${where} : 3 courbes au plus`);
      break;
    case "list":
      item.items.forEach((l) => len(l.text, LIMITS.list, "ligne"));
      if (item.items.length > 5) errors.push(`${where} : 5 lignes au plus`);
      break;
    case "steps":
      item.items.forEach((s) => (len(s.text, 28, "étape"), icon(s.icon)));
      if (item.items.length > 5) errors.push(`${where} : 5 étapes au plus`);
      break;
    case "split": {
      const sum = item.parts.reduce((s, p) => s + p.value, 0);
      if (Math.abs(sum - item.total) > 0.5)
        errors.push(`${where} : les parts (${sum}) ne font pas le total (${item.total})`);
      break;
    }
    case "gauge":
      if (item.value < 0 || item.value > 100) errors.push(`${where} : jauge de 0 à 100`);
      break;
    case "compare":
      for (const side of [item.left, item.right]) {
        icon(side.icon);
        len(side.title, LIMITS.card, "titre");
        side.items.forEach((x) => len(x.text, 48, "ligne"));
        if (side.items.length > 4) errors.push(`${where} : 4 lignes par colonne au plus`);
      }
      break;
    case "dialog":
      item.items.forEach((d) => {
        if (!CHARACTERS[d.character]) errors.push(`${where} : personnage inconnu « ${d.character} »`);
        len(d.text, 60, "réplique");
      });
      if (item.items.length > 3) errors.push(`${where} : 3 répliques au plus`);
      break;
    case "actor":
      if (!CHARACTERS[item.character]) errors.push(`${where} : personnage inconnu « ${item.character} »`);
      if (item.think) len(item.think.text, 4, "pensée");
      break;
    case "fly":
      if (item.until <= item.at) errors.push(`${where} : « until » avant « at »`);
      break;
    case "row":
      if (item.items.length > 5) errors.push(`${where} : 5 éléments par rangée au plus`);
      item.items.forEach((x, i) => {
        if ((x as SceneItem).type === "row") errors.push(`${where} : pas de rangée dans une rangée`);
        checkItem(x, `${where} > ${i + 1}`, errors);
      });
      break;
    default:
      errors.push(`${where} : type inconnu « ${(item as { type: string }).type} »`);
  }
}

/** Liste des problèmes d'un scénario (vide = bon). */
export function checkBoard(board: Storyboard, track?: VoiceTrack): string[] {
  const errors: string[] = [];
  if (!board || !Array.isArray(board.scenes) || board.scenes.length === 0)
    return ["aucune scène"];
  if (track) {
    if (board.lesson !== track.lesson) errors.push("leçon différente de la voix");
    if (board.version !== track.version) errors.push("version différente de la voix");
  }
  const end = track?.duration ?? board.scenes[board.scenes.length - 1]!.to;
  if (board.scenes[0]!.from !== 0) errors.push("la première scène doit commencer à 0");
  if (board.scenes[board.scenes.length - 1]!.to < end)
    errors.push(`la dernière scène doit aller jusqu'à la fin (${end})`);
  board.scenes.forEach((scene, s) => {
    const where = `scène ${s + 1} (${scene.from}–${scene.to})`;
    if (!(scene.to > scene.from)) errors.push(`${where} : fin avant début`);
    const next = board.scenes[s + 1];
    if (next && Math.abs(next.from - scene.to) > 0.01)
      errors.push(`${where} : la scène suivante doit commencer à ${scene.to}`);
    if (scene.to - scene.from < 2) errors.push(`${where} : scène trop courte (moins de 2 s)`);
    const flow = scene.items.filter((i) => i.type !== "actor" && i.type !== "fly");
    if (flow.length > 6) errors.push(`${where} : 6 éléments au plus (${flow.length})`);
    const known = new Set(scene.items.flatMap(ids));
    scene.items.forEach((item, i) => {
      const w = `${where} > ${i + 1} (${item.type})`;
      checkItem(item, w, errors);
      for (const t of times(item)) {
        if (t < scene.from - 0.6 || t > scene.to)
          errors.push(`${w} : instant ${t} hors de la scène`);
      }
      if (item.type === "fly") {
        for (const ref of [item.from, item.to])
          if (!known.has(ref)) errors.push(`${w} : « ${ref} » introuvable dans la scène`);
      }
    });
  });
  return errors;
}

export function isStoryboard(value: unknown): value is Storyboard {
  const b = value as Storyboard;
  return (
    !!b &&
    typeof b.lesson === "string" &&
    typeof b.version === "string" &&
    Array.isArray(b.scenes) &&
    b.scenes.every((s) => typeof s.from === "number" && typeof s.to === "number" && Array.isArray(s.items))
  );
}
