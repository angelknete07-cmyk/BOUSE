/** Domain functions have no browser, network or storage dependencies. */
export function normalizeSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/œ/g, "oe")
    .replace(/Œ/g, "oe")
    .toLocaleLowerCase("fr")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Relevance of a search entry for an already-normalised query.
 * Lower is better; -1 means no match. Titles outrank descriptions so that a
 * lesson named after the query appears before a space that only mentions it.
 */
export function searchRank(
  title: string,
  description: string,
  query: string,
): number {
  if (!query) return 0;
  const name = normalizeSearch(title);
  if (name === query) return 0;
  if (name.startsWith(query)) return 1;
  if (name.split(/[^a-z0-9]+/).some((word) => word.startsWith(query))) return 2;
  if (name.includes(query)) return 3;
  // Descriptions now hold whole lessons: a short query such as « ia » must
  // start a word there, or it would match « social » and « financier ».
  const text = normalizeSearch(description);
  if (wordStarts(text, query)) return 4;
  return query.length >= 4 && text.includes(query) ? 5 : -1;
}

function wordStarts(text: string, query: string): boolean {
  let from = text.indexOf(query);
  while (from !== -1) {
    if (from === 0 || !/[a-z0-9]/.test(text[from - 1]!)) return true;
    from = text.indexOf(query, from + 1);
  }
  return false;
}

/**
 * The sentence of a long text that contains the query, shortened around the
 * match, so a result found inside a lesson shows why it was found.
 */
export function searchExcerpt(
  paragraphs: string[],
  query: string,
  normalize: (text: string) => string = normalizeSearch,
  maxLength = 110,
): string | null {
  if (!query) return null;
  for (const paragraph of paragraphs) {
    for (const sentence of paragraph.split(/(?<=[.!?…])\s+/)) {
      const at = normalize(sentence).indexOf(query);
      if (at === -1) continue;
      const text = sentence.trim();
      if (text.length <= maxLength) return text;
      const start = Math.max(0, Math.min(at - 30, text.length - maxLength));
      const cut = text.slice(start, start + maxLength);
      const from = start > 0 ? cut.indexOf(" ") + 1 : 0;
      const to =
        start + maxLength < text.length ? cut.lastIndexOf(" ") : cut.length;
      return `${start > 0 ? "…" : ""}${cut.slice(from, to)}${to < cut.length ? "…" : ""}`;
    }
  }
  return null;
}

/** Stable relevance ordering: equal ranks keep their declared order. */
export function rankSearchResults<T>(
  items: T[],
  query: string,
  fields: (item: T) => { title: string; description: string },
): T[] {
  return items
    .map((item, index) => {
      const { title, description } = fields(item);
      return { item, index, rank: searchRank(title, description, query) };
    })
    .filter((entry) => entry.rank >= 0)
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .map((entry) => entry.item);
}

export interface EconomicsInput {
  price: number;
  unitCost: number;
  units: number;
  fixedCosts: number;
}

export interface EconomicsResult {
  revenue: number;
  variableCosts: number;
  contribution: number;
  /** Fraction of revenue, e.g. 0.4 means 40%. */
  contributionRate: number;
  profit: number;
  /** Whole units required; null means unit contribution is not positive. */
  breakEvenUnits: number | null;
}

export function calculateEconomics(input: EconomicsInput): EconomicsResult {
  for (const [name, value] of Object.entries(input)) {
    if (!Number.isFinite(value) || value < 0) {
      throw new RangeError(`${name} doit être un nombre fini positif ou nul.`);
    }
  }
  if (!(input.price > 0)) {
    throw new RangeError("Le prix de vente doit être strictement positif.");
  }
  const { price, unitCost, units, fixedCosts } = input;
  const unitContribution = price - unitCost;
  const revenue = price * units;
  const variableCosts = unitCost * units;
  const contribution = unitContribution * units;
  const result = {
    revenue,
    variableCosts,
    contribution,
    contributionRate: unitContribution / price,
    profit: contribution - fixedCosts,
    breakEvenUnits:
      unitContribution > 0 ? Math.ceil(fixedCosts / unitContribution) : null,
  };
  if (
    Object.values(result).some(
      (value) => value !== null && !Number.isFinite(value),
    )
  ) {
    throw new RangeError(
      "Ces valeurs sont trop grandes pour produire un calcul fiable.",
    );
  }
  return result;
}

export interface QuizQuestion {
  id: string;
  answer: number;
}

export function evaluateQuiz(
  questions: QuizQuestion[],
  answers: Record<string, number>,
) {
  const seen = new Set<string>();
  let correct = 0;
  let answered = 0;
  for (const question of questions) {
    if (!question.id || seen.has(question.id)) {
      throw new Error(
        "Chaque question doit avoir un identifiant unique et non vide.",
      );
    }
    if (!Number.isInteger(question.answer) || question.answer < 0) {
      throw new RangeError(
        "La réponse attendue doit être un indice positif ou nul.",
      );
    }
    seen.add(question.id);
    const selectedAnswer = answers[question.id];
    if (
      Object.hasOwn(answers, question.id) &&
      typeof selectedAnswer === "number" &&
      Number.isInteger(selectedAnswer) &&
      selectedAnswer >= 0
    ) {
      answered += 1;
      if (selectedAnswer === question.answer) correct += 1;
    }
  }
  const total = questions.length;
  const percent = total === 0 ? 0 : Math.round((correct / total) * 100);
  return {
    correct,
    total,
    percent,
    passed: total > 0 && answered === total && correct / total >= 0.8,
  };
}

export interface PromptCheck {
  label: string;
  passed: boolean;
  tip: string;
}

/** A transparent keyword checklist; this does not call or simulate an AI model. */
export function reviewPrompt(text: string): {
  score: number;
  checks: PromptCheck[];
  suggestion: string;
} {
  const normalized = normalizeSearch(text);
  const rules = [
    {
      label: "Objectif",
      expression:
        /\b(objectif|but|redige|analyse|compare|resume|extrais|classe|explique|construis|identifie)\b/,
      tip: "Décris une action et le résultat utile attendu.",
    },
    {
      label: "Contexte et public",
      expression:
        /\b(contexte|public|destinataire|debutant|client|entreprise|lecteur|utilisateur)\b/,
      tip: "Indique à qui la réponse est destinée et dans quelle situation elle sera utilisée.",
    },
    {
      label: "Données de départ",
      expression:
        /\b(donnees|document|texte suivant|source|fichier|exemple|entree|ci-dessous)\b/,
      tip: "Précise les informations à utiliser et sépare-les des instructions.",
    },
    {
      label: "Contraintes",
      expression:
        /\b(contrainte|maximum|minimum|limite|sans|uniquement|ne pas|evite|interdit)\b/,
      tip: "Définis les limites : longueur, périmètre, confidentialité ou actions interdites.",
    },
    {
      label: "Format de sortie",
      expression: /\b(format|tableau|json|liste|markdown|colonnes|structure)\b/,
      tip: "Demande une structure adaptée à la tâche et donne un exemple si nécessaire.",
    },
    {
      label: "Critères de réussite",
      expression:
        /\b(critere|verifie|verification|incertitude|hypothese|n.invente|citation|mesurable|reussite)\b/,
      tip: "Explique comment vérifier la réponse et comment signaler les informations manquantes.",
    },
  ];
  const checks = rules.map(({ label, expression, tip }) => ({
    label,
    passed: expression.test(normalized),
    tip,
  }));
  const score = Math.round(
    (checks.filter((check) => check.passed).length / checks.length) * 100,
  );
  const suggestion = [
    "OBJECTIF : [action précise et résultat attendu]",
    "CONTEXTE ET PUBLIC : [situation, destinataire, niveau]",
    "DONNÉES : [informations disponibles, clairement délimitées]",
    "CONTRAINTES : [périmètre, longueur, limites]",
    "FORMAT : [structure attendue]",
    "VÉRIFICATION : distingue les faits des hypothèses, signale les incertitudes et les données manquantes.",
    ...(text.trim() ? [`\nPROMPT À RETRAVAILLER :\n${text.trim()}`] : []),
  ].join("\n");
  return { score, checks, suggestion };
}

export const projectStages = [
  "Idée",
  "Recherche",
  "Validation",
  "Business model",
  "MVP",
  "Test",
  "Premiers utilisateurs",
  "Premiers revenus",
  "Croissance",
] as const;

/** Advancing records the user's decision; it does not certify validation. */
export function nextProjectStage(
  stage: string,
): (typeof projectStages)[number] {
  const index = projectStages.findIndex((candidate) => candidate === stage);
  if (index === -1) throw new RangeError("Étape de projet inconnue.");
  return projectStages[Math.min(index + 1, projectStages.length - 1)]!;
}
