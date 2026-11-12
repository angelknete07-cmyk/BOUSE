/**
 * Le contenu d'une compétence courte du catalogue (≈ 10 minutes) :
 * 1. l'idée (2 min), 2. le geste, un vrai modèle à remplir (6 min),
 * 3. le contrôle, trois questions (2 min). Trois bonnes réponses valident
 * la compétence dans l'arbre. Données pures, vérifiées par
 * tests/skillContent.test.ts.
 */
export type SkillContent = {
  /** L'identifiant de la compétence dans src/data/catalogue.ts. */
  id: string;
  /** Deux ou trois paragraphes courts, en « tu », sans jargon non expliqué. */
  idea: string[];
  /** Trois à cinq choses à retenir. */
  keys: string[];
  gesture: {
    /** Ce qu'on remplit et pourquoi, en une ou deux phrases. */
    intro: string;
    /** Trois à sept cases du modèle ; l'exemple s'affiche en gris. */
    fields: { label: string; example: string }[];
    /** Un conseil pour bien le remplir. */
    tip?: string;
  };
  /** Trois questions ; `answer` est l'indice de la bonne option. */
  check: { q: string; options: string[]; answer: number; why: string }[];
};
