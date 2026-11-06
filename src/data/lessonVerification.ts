/**
 * When the dated facts of a lesson (thresholds, rates, calendars) were last
 * checked. Only lessons whose rules change by law are listed; the others
 * teach mechanisms that do not expire.
 */
export const lessonVerifiedAt: Record<string, string> = {
  "ent-statut-juridique": "2026-11-06",
  "ent-creer-etapes": "2026-11-06",
  "ent-micro-entreprise": "2026-11-06",
  "ent-facturer-declarer": "2026-11-06",
  "ent-financer-projet": "2026-11-06",
  "fp-impot-revenu": "2026-11-06",
  "fp-logement": "2026-11-06",
  "fp-retraite": "2026-11-06",
  "fp-epargne-precaution": "2026-11-06",
  "inv-fiscalite-placements": "2026-11-06",
  "inv-crypto-actifs": "2026-11-06",
  "inv-immobilier-scpi": "2026-11-06",
  "ia-cadre-legal": "2026-11-06",
  "ia-donnees-confidentialite": "2026-11-06",
};

/** Dated rules older than a year must be checked again (finance law). */
export function verificationStatus(lessonId: string, now: Date) {
  const date = lessonVerifiedAt[lessonId];
  if (!date) return null;
  const checked = new Date(`${date}T00:00:00Z`);
  const ageDays = (now.getTime() - checked.getTime()) / 86_400_000;
  return {
    label: new Intl.DateTimeFormat("fr-FR", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(checked),
    stale: ageDays > 365,
  };
}
