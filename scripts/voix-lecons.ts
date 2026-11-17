/**
 * Fabrique la voix des leçons (idée 1/38 : vidéo de chaque leçon).
 *
 * Depuis le 17 nov. 2026, les fichiers en ligne sont les vraies voix
 * ElevenLabs (voix « BOUSE »), fabriquées par ~/claude/bouse-voix et
 * copiées dans public/lecons-voix. Ce script ne sert plus qu'en secours
 * (voix du Mac), pour une leçon nouvelle ou modifiée.
 *
 *   node --experimental-strip-types scripts/voix-lecons.ts [id…]
 *   (les leçons déjà faites sont gardées ; BOUSE_VOICE_FORCE=1 refait tout)
 *
 * Pour chaque leçon : un texte parlé (titre, résumé, parties, exemple), lu
 * phrase par phrase par une voix du Mac (`say`, gratuite, provisoire), puis
 * assemblé en un seul fichier m4a (afconvert, fourni avec macOS) et un
 * minutage JSON : l'image suit exactement la voix. Changer de voix plus tard
 * = changer VOICE (ou brancher un service payant ici) et relancer.
 *
 * Sortie : public/lecons-voix/<id>.m4a et <id>.json
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { lessons } from "../src/data/lessons.ts";

const VOICE = process.env.BOUSE_VOICE ?? "Thomas";
const RATE = 22050;
const OUT = join(import.meta.dirname, "..", "public", "lecons-voix");
const GAP_LINE = 0.35;
const GAP_PART = 0.9;

export type VoiceLine = {
  /** Partie : -1 = ouverture, 0..n = parties de la leçon, n = l'exemple. */
  part: number;
  kind: "title" | "line";
  text: string;
  start: number;
  end: number;
};

/** Sigles épelés lettre par lettre (les autres se lisent comme un mot). */
const SPELL = new Set(
  "IA CA BFR ETF PEA TVA AMF SCPI EURL SAS SASU SARL TAEG RGPD PME EBE PFU LLM API LDDS OPCVM OPC FCP MVP EI CGI PER ACPR CSG CDI DIC CFD LTV TNS CCI RNE APE CFE ROI SMS HT TTC".split(
    " ",
  ),
);

/** Ce que la voix doit dire à la place des signes et abréviations. */
export function spoken(text: string): string {
  return text
    .replace(/(\d)[\s\u00a0\u202f](?=\d{3}\b)/g, "$1")
    .replace(/\bHT\b/g, "hors taxes")
    .replace(/\bTTC\b/g, "toutes taxes comprises")
    .replace(/\b1er\b/g, "premier")
    .replace(/\s?×\s?/g, " fois ")
    .replace(/\s?÷\s?/g, " divisé par ")
    .replace(/\s?\^\s?/g, " puissance ")
    .replace(/\s?≈\s?/g, " environ ")
    .replace(/[−-](?=\d)/g, " moins ")
    .replace(/\s[−–-]\s/g, " moins ")
    .replace(/\+(?=\d)/g, " plus ")
    .replace(/\s=\s/g, " égale ")
    .replace(/\s\+\s/g, " plus ")
    .replace(/\s?—\s?/g, ", ")
    .replace(/\s·\s/g, ", ")
    .replace(/\s\/\s/g, ", ")
    .replace(/(\d)\s?€/g, "$1 euros")
    .replace(/\s?%/g, " pour cent")
    .replace(/\s?\(([A-Z]{2,6})\)/g, ", $1,")
    .replace(/\b[A-ZÀ-Ý]{2,}\b/g, (word) =>
      SPELL.has(word)
        ? word.split("").join(" ")
        : word.length > 1
          ? word[0] + word.slice(1).toLowerCase()
          : word,
    )
    .replace(/«\s?|\s?»/g, "")
    .replace(/,(\s*[,;:])+/g, "$1")
    .replace(/\s+([,;:.])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

/** Découpe un paragraphe en phrases (sans couper « 1,5 » ni « etc. »). */
export function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!?…])\s+(?=[A-ZÀ-ÝÉ«0-9])/u)
    .map((s) => s.trim())
    .filter(Boolean);
}

type Part = { title: string; lines: string[] };

export function script(lesson: (typeof lessons)[number]): Part[] {
  return [
    { title: lesson.title, lines: sentences(lesson.summary) },
    ...lesson.sections.map((s) => ({
      title: s.title,
      lines: s.body.flatMap(sentences),
    })),
    ...(lesson.example
      ? [{ title: lesson.example.title, lines: sentences(lesson.example.body) }]
      : []),
  ];
}

/** Lit un WAV 16 bits mono produit par `say` : renvoie les échantillons. */
function pcm(file: string): Buffer {
  const wav = readFileSync(file);
  let at = 12;
  while (at < wav.length) {
    const id = wav.toString("ascii", at, at + 4);
    const size = wav.readUInt32LE(at + 4);
    if (id === "data") return wav.subarray(at + 8, at + 8 + size);
    at += 8 + size + (size % 2);
  }
  throw new Error(`WAV sans données : ${file}`);
}

function wavHeader(bytes: number): Buffer {
  const h = Buffer.alloc(44);
  h.write("RIFF", 0);
  h.writeUInt32LE(36 + bytes, 4);
  h.write("WAVE", 8);
  h.write("fmt ", 12);
  h.writeUInt32LE(16, 16);
  h.writeUInt16LE(1, 20);
  h.writeUInt16LE(1, 22);
  h.writeUInt32LE(RATE, 24);
  h.writeUInt32LE(RATE * 2, 28);
  h.writeUInt16LE(2, 32);
  h.writeUInt16LE(16, 34);
  h.write("data", 36);
  h.writeUInt32LE(bytes, 40);
  return h;
}

const silence = (seconds: number) =>
  Buffer.alloc(Math.round(seconds * RATE) * 2);

function build(lesson: (typeof lessons)[number]) {
  const work = join(tmpdir(), `bouse-voix-${lesson.id}`);
  rmSync(work, { recursive: true, force: true });
  mkdirSync(work, { recursive: true });
  const chunks: Buffer[] = [silence(0.3)];
  const lines: VoiceLine[] = [];
  let time = 0.3;
  let n = 0;
  const say = (text: string) => {
    const file = join(work, `${n++}.wav`);
    // `say` se fige parfois sur une phrase : on l'arrête au bout de 45 s
    // et on recommence (trois essais).
    for (let attempt = 1; ; attempt++) {
      try {
        execFileSync(
          "say",
          [
            "-v",
            VOICE,
            "--file-format=WAVE",
            `--data-format=LEI16@${RATE}`,
            "-o",
            file,
            spoken(text),
          ],
          { timeout: 45_000, killSignal: "SIGKILL" },
        );
        return pcm(file);
      } catch (error) {
        if (attempt >= 3) throw error;
        console.warn(`  nouvel essai (${attempt}) : ${text.slice(0, 60)}…`);
      }
    }
  };
  script(lesson).forEach((part, p) => {
    const index = p - 1;
    for (const [kind, text] of [
      ["title", part.title] as const,
      ...part.lines.map((l) => ["line", l] as const),
    ]) {
      const audio = say(text);
      const length = audio.length / 2 / RATE;
      lines.push({
        part: index,
        kind,
        text,
        start: +time.toFixed(2),
        end: +(time + length).toFixed(2),
      });
      chunks.push(audio, silence(kind === "title" ? 0.5 : GAP_LINE));
      time += length + (kind === "title" ? 0.5 : GAP_LINE);
    }
    chunks.push(silence(GAP_PART));
    time += GAP_PART;
  });
  const data = Buffer.concat(chunks);
  const wav = join(work, "lecon.wav");
  writeFileSync(wav, Buffer.concat([wavHeader(data.length), data]));
  mkdirSync(OUT, { recursive: true });
  execFileSync("afconvert", [
    "-f",
    "m4af",
    "-d",
    "aac",
    "-b",
    "40000",
    wav,
    join(OUT, `${lesson.id}.m4a`),
  ]);
  writeFileSync(
    join(OUT, `${lesson.id}.json`),
    JSON.stringify({
      lesson: lesson.id,
      version: lesson.version,
      voice: VOICE,
      duration: +time.toFixed(2),
      lines,
    }),
  );
  rmSync(work, { recursive: true, force: true });
  return time;
}

if (import.meta.main) {
  const wanted = process.argv.slice(2);
  const list = wanted.length
    ? lessons.filter((l) => wanted.includes(l.id))
    : lessons;
  const force = process.env.BOUSE_VOICE_FORCE === "1";
  for (const lesson of list) {
    // Une leçon déjà faite avec la même voix et la même version est gardée.
    try {
      const done = JSON.parse(
        readFileSync(join(OUT, `${lesson.id}.json`), "utf8"),
      );
      // Les vraies voix (ElevenLabs, voix « BOUSE », fabriquées dans
      // ~/claude/bouse-voix) ne sont jamais écrasées par la voix du Mac.
      if (
        !force &&
        done.version === lesson.version &&
        (done.voice === VOICE || String(done.voice).includes("ElevenLabs"))
      )
        continue;
    } catch {
      /* pas encore faite */
    }
    const seconds = build(lesson);
    console.log(
      `${lesson.id} · ${Math.floor(seconds / 60)} min ${Math.round(seconds % 60)} s`,
    );
  }
}
