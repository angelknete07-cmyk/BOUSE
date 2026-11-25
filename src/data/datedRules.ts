/**
 * Idée 33 : les règles qui changent avec la loi (taux, plafonds, calendriers),
 * telles que les leçons les enseignent. Chaque valeur reprend mot pour mot ce
 * que dit la leçon ; rien n'est ajouté ici.
 *
 * Quand une règle change :
 * 1. corriger le texte de la leçon (src/data/…Lessons.ts) ;
 * 2. ici, mettre l'ancienne valeur dans `before`, la nouvelle dans `now`,
 *    et la date du jour dans `checkedAt` et `changedAt`.
 * Les personnes qui avaient réussi la leçon avant `changedAt` sont prévenues
 * sur leur accueil et dans la leçon (src/lib/ruleWatch.ts).
 */
export interface DatedRule {
  id: string;
  /** La leçon qui enseigne cette règle. */
  lesson: string;
  /** De quoi il s'agit, en quelques mots. */
  topic: string;
  /** La règle en vigueur, telle que la leçon la dit. */
  now: string;
  /** L'ancienne règle, quand la leçon la cite. */
  before?: string;
  /** Depuis quand, ou quel texte. */
  since?: string;
  /** Date (AAAA-MM-JJ) où BOOST a vérifié la règle. */
  checkedAt: string;
  /** Date (AAAA-MM-JJ) où BOOST a mis la leçon à jour pour cette règle. */
  changedAt?: string;
  /** Où la vérifier soi-même (site officiel cité par la leçon). */
  where: { label: string; url: string };
}

export const DATED_RULES: DatedRule[] = [
  {
    id: "pfu",
    lesson: "inv-fiscalite-placements",
    topic: "Prélèvement forfaitaire unique (« flat tax »)",
    now: "31,4 %",
    before: "30 %",
    since: "loi de financement de la sécurité sociale pour 2026",
    checkedAt: "2026-11-06",
    changedAt: "2026-11-06",
    where: { label: "impots.gouv.fr", url: "https://www.impots.gouv.fr" },
  },
  {
    id: "prelevements-sociaux",
    lesson: "inv-fiscalite-placements",
    topic: "Prélèvements sociaux sur les revenus du capital",
    now: "18,6 % (l’assurance-vie reste à 17,2 %)",
    before: "17,2 %",
    since: "loi de financement de la sécurité sociale pour 2026",
    checkedAt: "2026-11-06",
    changedAt: "2026-11-06",
    where: { label: "impots.gouv.fr", url: "https://www.impots.gouv.fr" },
  },
  {
    id: "acre-micro",
    lesson: "ent-creer-etapes",
    topic: "ACRE des micro-entrepreneurs",
    now: "exonération de 25 %, demande à l’Urssaf obligatoire",
    before: "exonération de 50 %",
    since: "1er juillet 2026",
    checkedAt: "2026-11-06",
    changedAt: "2026-11-06",
    where: {
      label: "entreprendre.service-public.gouv.fr",
      url: "https://entreprendre.service-public.gouv.fr",
    },
  },
  {
    id: "micro-plafonds",
    lesson: "ent-micro-entreprise",
    topic: "Plafonds de chiffre d’affaires de la micro-entreprise",
    now: "203 100 € (vente, hébergement) · 83 600 € (services)",
    since: "2026, révisés tous les trois ans",
    checkedAt: "2026-11-06",
    where: {
      label: "entreprendre.service-public.gouv.fr",
      url: "https://entreprendre.service-public.gouv.fr",
    },
  },
  {
    id: "tva-franchise",
    lesson: "ent-micro-entreprise",
    topic: "Seuils de franchise de TVA",
    now: "85 000 € (vente) · 37 500 € (services)",
    since: "2026",
    checkedAt: "2026-11-06",
    where: {
      label: "entreprendre.service-public.gouv.fr",
      url: "https://entreprendre.service-public.gouv.fr",
    },
  },
  {
    id: "facture-electronique",
    lesson: "ent-facturer-declarer",
    topic: "Facturation électronique entre entreprises",
    now: "réception obligatoire depuis le 1er septembre 2026 ; émission pour les PME et micro-entreprises au 1er septembre 2027",
    since: "calendrier confirmé par la loi de finances 2026",
    checkedAt: "2026-11-06",
    where: {
      label: "impots.gouv.fr",
      url: "https://www.impots.gouv.fr/facturation-electronique",
    },
  },
  {
    id: "mica",
    lesson: "inv-crypto-actifs",
    topic: "Plateformes de crypto-actifs (MiCA)",
    now: "agrément européen de prestataire (PSCA) obligatoire",
    before: "anciens enregistrements nationaux (période transitoire)",
    since: "juillet 2026",
    checkedAt: "2026-11-06",
    changedAt: "2026-11-06",
    where: { label: "amf-france.org", url: "https://www.amf-france.org" },
  },
  {
    id: "retraite-age",
    lesson: "fp-retraite",
    topic: "Âge légal de départ à la retraite",
    now: "relèvement suspendu : 62 ans et 9 mois et 170 trimestres pour les départs de septembre 2026 à fin 2027",
    before: "relèvement progressif (réforme de 2023)",
    since: "loi de financement de la sécurité sociale pour 2026",
    checkedAt: "2026-11-06",
    changedAt: "2026-11-06",
    where: { label: "info-retraite.fr", url: "https://www.info-retraite.fr" },
  },
  {
    id: "ia-haut-risque",
    lesson: "ia-cadre-legal",
    topic: "AI Act : obligations des systèmes à haut risque",
    now: "reportées au 2 décembre 2027 (usages de l’annexe III) et au 2 août 2028 (produits réglementés)",
    before: "calendrier initial de l’AI Act",
    since: "règlement de simplification adopté en 2026 (« omnibus numérique »)",
    checkedAt: "2026-11-06",
    changedAt: "2026-11-06",
    where: {
      label: "eur-lex.europa.eu",
      url: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
    },
  },
];
