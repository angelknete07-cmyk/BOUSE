import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { lessons } from "../src/data/lessons.ts";
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
  type VoiceTrack,
} from "../src/lib/lessonVideo.ts";
import { spoken } from "../scripts/voix-lecons.ts";
import { emptyState, parseState } from "../src/lib/storage.ts";

const track: VoiceTrack = {
  lesson: "x",
  version: "1.0.0",
  voice: "Thomas",
  duration: 20,
  lines: [
    { part: -1, kind: "title", text: "Titre", start: 0.3, end: 1 },
    { part: 0, kind: "title", text: "Partie A", start: 2, end: 3 },
    { part: 0, kind: "line", text: "Une phrase", start: 3.5, end: 5 },
    { part: 1, kind: "title", text: "Partie B", start: 6, end: 7 },
    {
      part: 1,
      kind: "line",
      text: "CA = prix × quantité.",
      start: 7.5,
      end: 10,
    },
    { part: 2, kind: "title", text: "Exemple", start: 11, end: 12 },
  ],
};

test("la phrase dite suit le temps", () => {
  assert.equal(lineAt(track, 0), -1);
  assert.equal(lineAt(track, 0.3), 0);
  assert.equal(lineAt(track, 4), 2);
  assert.equal(lineAt(track, 19), 5);
  assert.deepEqual(partsOf(track), [-1, 0, 1, 2]);
  assert.equal(partProgress(track, 0, 1), 0);
  assert.equal(partProgress(track, 0, 3.5), 0.5);
  assert.equal(partProgress(track, 0, 9), 1);
});

test("les mots s'allument au fil de la phrase", () => {
  const line = track.lines[2]!;
  assert.equal(wordsSaid(line, 10, 3), 0);
  assert.equal(wordsSaid(line, 10, 4.25), 5);
  assert.equal(wordsSaid(line, 10, 6), 10);
});

test("formules et montants deviennent des cartes et des pastilles", () => {
  assert.deepEqual(
    formulaIn(
      "Dans nos exemples, tous les montants sont hors taxes : CA = prix unitaire HT × quantité vendue.",
    ),
    { left: "CA", right: "prix unitaire HT × quantité vendue" },
  );
  assert.equal(formulaIn("Aucune formule ici."), null);
  assert.deepEqual(
    figuresIn("L’atelier vend 10 bureaux à 500 € HT : CA de 5 000 €."),
    ["500 €", "5 000 €"],
  );
});

test("la question arrive après la deuxième partie, les libellés sont clairs", () => {
  assert.equal(askAfter(track), 10.2);
  assert.equal(
    askAfter({ ...track, lines: track.lines.filter((l) => l.part < 2) }),
    null,
  );
  assert.equal(partLabel(-1, 4), "Leçon");
  assert.equal(partLabel(1, 4), "Partie 2 / 4");
  assert.equal(partLabel(4, 4), "Exemple");
  assert.equal(clockLabel(212.4), "3:32");
  assert.equal(durationLabel(212.4), "3 min 32");
  assert.equal(isTrack(track), true);
  assert.equal(isTrack({ ...track, lines: [] }), false);
  assert.equal(isTrack(null), false);
});

test("la voix lit les signes et les sigles en français", () => {
  assert.equal(
    spoken("À 45 places, résultat simplifié = −200 €."),
    "À 45 places, résultat simplifié égale moins 200 euros.",
  );
  assert.equal(
    spoken("Le chiffre d’affaires (CA) est"),
    "Le chiffre d’affaires, C A, est",
  );
  assert.equal(spoken("Depuis le 1er janvier"), "Depuis le premier janvier");
  assert.equal(spoken("10 000 € HT"), "10000 euros hors taxes");
});

test("la façon d'apprendre se garde dans la sauvegarde", () => {
  for (const mode of ["lire", "regarder", "ecouter"] as const)
    assert.equal(
      parseState(JSON.stringify({ ...emptyState, learningMode: mode }))
        .learningMode,
      mode,
    );
  assert.equal(parseState(JSON.stringify(emptyState)).learningMode, undefined);
  assert.throws(
    () => parseState(JSON.stringify({ ...emptyState, learningMode: "video" })),
    /Façon d’apprendre invalide/,
  );
});

test("chaque leçon a sa voix, à jour de sa version", () => {
  for (const lesson of lessons) {
    const file = new URL(
      `../public/lecons-voix/${lesson.id}.json`,
      import.meta.url,
    );
    assert.ok(existsSync(file), `voix manquante : ${lesson.id}`);
    assert.ok(
      existsSync(
        new URL(`../public/lecons-voix/${lesson.id}.m4a`, import.meta.url),
      ),
      `son manquant : ${lesson.id}`,
    );
    const track = JSON.parse(readFileSync(file, "utf8"));
    assert.ok(isTrack(track), lesson.id);
    assert.equal(track.lesson, lesson.id);
    assert.equal(
      track.version,
      lesson.version,
      `voix à refaire : ${lesson.id}`,
    );
  }
});
