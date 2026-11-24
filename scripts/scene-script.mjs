#!/usr/bin/env node
/* Affiche le texte minuté de la voix d'une leçon, pour écrire son scénario
   animé (docs/SCENES.md).
   Usage : node scripts/scene-script.mjs <id-de-la-leçon> */
import { readFileSync } from "node:fs";

const id = process.argv[2];
if (!id) {
  console.error("Usage : node scripts/scene-script.mjs <id-de-la-leçon>");
  process.exit(1);
}
const track = JSON.parse(
  readFileSync(new URL(`../public/lecons-voix/${id}.json`, import.meta.url), "utf8"),
);
console.log(`leçon ${track.lesson} · version ${track.version} · durée ${track.duration} s`);
console.log("(partie -1 = introduction ; 0, 1, … = parties ; la dernière = l'exemple)\n");
let part = null;
for (const l of track.lines) {
  if (l.part !== part) {
    part = l.part;
    console.log(`\n=== partie ${part}`);
  }
  const t = `${l.start.toFixed(1)}–${l.end.toFixed(1)}`.padEnd(13);
  console.log(`${t} ${l.kind === "title" ? "# " : ""}${l.text}`);
}
