import test from "node:test";
import assert from "node:assert/strict";
import { lessons } from "../src/data/lessons.ts";
import {
  addDays,
  budgetTotals,
  buildDoc,
  buildSheet,
  exampleValues,
  fileStem,
  findTemplate,
  forecastYears,
  frenchDate,
  invoiceTotals,
  lineCount,
  templateProblems,
  TEMPLATES,
} from "../src/lib/templates.ts";
import { buildXlsx, columnName, crc32 } from "../src/lib/xlsx.ts";
import { ICONS } from "../src/lib/sceneArt.ts";
import { emptyState, parseState } from "../src/lib/storage.ts";

/* Idée 22 : la boîte à modèles (devis, facture, budget, prévisionnel). */

const def = (id: string) => findTemplate(id)!;

test("les quatre modèles existent, avec des leçons et des icônes réelles", () => {
  assert.deepEqual(
    TEMPLATES.map((t) => t.id),
    ["devis", "facture", "budget", "previsionnel"],
  );
  const ids = new Set(lessons.map((l) => l.id));
  for (const t of TEMPLATES) {
    assert.ok(ICONS[t.icon], `icône ${t.icon}`);
    for (const id of t.lessons) assert.ok(ids.has(id), `leçon ${id}`);
  }
});

test("une facture calcule le HT, la TVA et le TTC", () => {
  const values = {
    "l0.designation": "Site",
    "l0.quantite": "1",
    "l0.prix": "1 000",
    "l1.designation": "Formation",
    "l1.quantite": "2",
    "l1.prix": "100,50",
    tva: "20",
  };
  const t = invoiceTotals(values);
  assert.equal(t.ht, 1201);
  assert.equal(t.tva, 240.2);
  assert.equal(t.ttc, 1441.2);
  assert.equal(lineCount(values), 2);
  const doc = buildDoc(def("facture"), values);
  assert.deepEqual(
    doc.totals.map((x) => x.value),
    ["1 201 €", "240,20 €", "1 441,20 €"],
  );
});

test("en franchise de TVA, la mention 293 B apparaît et un seul total", () => {
  const doc = buildDoc(def("facture"), {
    ...exampleValues(def("facture")),
    tva: "franchise",
  });
  assert.equal(doc.totals.length, 1);
  assert.equal(doc.totals[0]!.value, "1 200 €");
  assert.match(doc.notes.join(" "), /293 B/);
  assert.match(doc.notes.join(" "), /40 €/);
});

test("l'échéance et la validité se calculent depuis la date", () => {
  assert.equal(addDays("2026-11-25", 30), "2026-12-25");
  assert.equal(frenchDate("2026-12-25"), "25 décembre 2026");
  const doc = buildDoc(def("devis"), exampleValues(def("devis")));
  assert.deepEqual(doc.meta.find(([k]) => k === "Valable jusqu’au"), [
    "Valable jusqu’au",
    "25 décembre 2026",
  ]);
});

test("ce qui manque est dit, sans bloquer", () => {
  assert.match(templateProblems(def("facture"), {}).join(" "), /ton SIREN/);
  assert.deepEqual(
    templateProblems(def("facture"), exampleValues(def("facture"))),
    [],
  );
  assert.match(
    templateProblems(def("budget"), { revenu: "1000", logement: "1200" })[0]!,
    /Il manque 200 €/,
  );
});

test("le budget : se payer d'abord, puis le reste", () => {
  const t = budgetTotals(exampleValues(def("budget")));
  assert.equal(t.income, 1800);
  assert.equal(t.left, 1800 - 150 - 1070 - 500);
  assert.ok(Math.abs(t.savingRate - 150 / 1800) < 1e-9);
});

test("le prévisionnel : marge, résultat et seuil de rentabilité", () => {
  const [y1] = forecastYears(exampleValues(def("previsionnel")));
  assert.equal(y1!.marge, 28000);
  assert.equal(y1!.resultat, 4000);
  assert.ok(Math.abs(y1!.seuil! - 24000 / 0.7) < 1e-6);
});

test("le classeur Excel garde de vraies formules", () => {
  const sheet = buildSheet(def("facture"), exampleValues(def("facture")));
  const formulas = sheet.rows
    .flat()
    .filter((c) => c && typeof c === "object" && "formula" in c && c.formula)
    .map((c) => (c as { formula: string }).formula);
  assert.ok(formulas.some((f) => /^B\d+\*C\d+$/.test(f)));
  assert.ok(formulas.some((f) => f.startsWith("SUM(D")));
  const forecast = buildSheet(def("previsionnel"), exampleValues(def("previsionnel")));
  assert.equal(forecast.rows[3]![0], "Chiffre d’affaires");
});

test("le fichier xlsx est un zip valide", () => {
  assert.equal(crc32(new TextEncoder().encode("123456789")), 0xcbf43926);
  assert.equal(columnName(0), "A");
  assert.equal(columnName(27), "AB");
  const bytes = buildXlsx(buildSheet(def("budget"), exampleValues(def("budget"))));
  assert.equal(String.fromCharCode(bytes[0]!, bytes[1]!), "PK");
  const view = new DataView(bytes.buffer);
  assert.equal(view.getUint32(bytes.length - 22, true), 0x06054b50);
  assert.equal(view.getUint16(bytes.length - 12, true), 6);
  const text = new TextDecoder().decode(bytes);
  assert.match(text, /xl\/worksheets\/sheet1\.xml/);
  assert.match(text, /<f>SUM\(B5:B6\)-SUM\(B8:B8\)/);
});

test("un nom de fichier propre", () => {
  assert.equal(
    fileStem(def("facture"), { numero: "2026-0042" }),
    "boost-facture-2026-0042",
  );
  assert.equal(
    fileStem(def("previsionnel"), { projet: "Atelier vélos à Lyon" }),
    "boost-previsionnel-atelier-velos-a-lyon",
  );
});

test("les modèles remplis se sauvegardent, bornés", () => {
  const saved = parseState(
    JSON.stringify({ ...emptyState, templates: { facture: { numero: "2026-1" } } }),
  );
  assert.equal(saved.templates?.facture?.numero, "2026-1");
  assert.throws(() =>
    parseState(JSON.stringify({ ...emptyState, templates: { facture: { x: 3 } } })),
  );
  assert.throws(() =>
    parseState(
      JSON.stringify({ ...emptyState, templates: { facture: { x: "a".repeat(2001) } } }),
    ),
  );
});
