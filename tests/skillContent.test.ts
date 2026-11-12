import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { CATALOGUE_SKILLS } from "../src/data/catalogue.ts";
import { WRITTEN_SKILLS } from "../src/data/skills/written.ts";
import type { SkillContent } from "../src/data/skills/types.ts";

/* Le contenu court des compétences « bientôt » : un fichier par domaine. */

const dir = new URL("../src/data/skills/", import.meta.url);
const files = readdirSync(dir).filter(
  (f) =>
    f.endsWith(".ts") && !["types.ts", "index.ts", "written.ts"].includes(f),
);
const index = readFileSync(new URL("index.ts", dir), "utf8");
const byId = new Map(CATALOGUE_SKILLS.map((s) => [s.id, s]));

test("chaque fichier de compétences est bien formé", async () => {
  const seen = new Set<string>();
  for (const file of files) {
    const domain = file.slice(0, -3);
    assert.ok(
      index.includes(`${domain}: () => import("./${domain}")`),
      `${domain} chargé par index.ts`,
    );
    const { skills } = (await import(new URL(file, dir).href)) as {
      skills: SkillContent[];
    };
    assert.ok(skills.length > 0, file);
    for (const s of skills) {
      const where = `${file} › ${s.id}`;
      const skill = byId.get(s.id);
      assert.ok(skill, `${where} : compétence inconnue du catalogue`);
      assert.equal(skill!.domain, domain, `${where} : mauvais domaine`);
      assert.equal(skill!.lesson, undefined, `${where} : a déjà sa leçon`);
      assert.ok(!seen.has(s.id), `${where} : en double`);
      seen.add(s.id);
      assert.ok(WRITTEN_SKILLS.has(s.id), `${where} : absente de written.ts`);
      assert.ok(s.idea.length >= 2 && s.idea.length <= 3, `${where} : idée`);
      for (const p of s.idea)
        assert.ok(p.length >= 60 && p.length <= 520, `${where} : paragraphe`);
      assert.ok(
        s.keys.length >= 3 && s.keys.length <= 5,
        `${where} : à retenir`,
      );
      assert.ok(s.gesture.intro.length > 20, `${where} : geste`);
      assert.ok(
        s.gesture.fields.length >= 3 && s.gesture.fields.length <= 7,
        `${where} : cases du modèle`,
      );
      for (const f of s.gesture.fields)
        assert.ok(f.label.trim() && f.example.trim(), `${where} : case vide`);
      assert.equal(s.check.length, 3, `${where} : trois questions`);
      for (const q of s.check) {
        assert.ok(
          q.options.length >= 2 && q.options.length <= 4,
          `${where} : options`,
        );
        assert.equal(
          new Set(q.options).size,
          q.options.length,
          `${where} : options en double`,
        );
        assert.ok(
          Number.isInteger(q.answer) &&
            q.answer >= 0 &&
            q.answer < q.options.length,
          `${where} : bonne réponse hors des options`,
        );
        assert.ok(
          q.q.trim() && q.why.trim(),
          `${where} : question ou explication vide`,
        );
      }
      // Pas de « toujours la même place » pour la bonne réponse.
    }
  }
  assert.deepEqual([...WRITTEN_SKILLS].sort(), [...seen].sort());
});
