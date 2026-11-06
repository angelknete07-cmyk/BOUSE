/**
 * Practical sheets to download from a lesson: a checklist, a template or a
 * spreadsheet to fill in. Fictitious examples, dated rules to check.
 */
export interface PracticalSheet {
  title: string;
  filename: string;
  mime: string;
  content: string;
}

const checklist = `# Créer son entreprise : liste de contrôle

Fiche BOUSE · repères vérifiés en novembre 2026, à revérifier sur entreprendre.service-public.gouv.fr.

## Avant l'immatriculation
- [ ] Problème vérifié auprès d'au moins cinq clients potentiels
- [ ] Offre et prix testés (précommandes, devis acceptés, ventes test)
- [ ] Prévisionnel en trois scénarios, BFR compris
- [ ] Statut choisi (micro, EI au réel, EURL, SASU, SAS) et fiscalité comprise
- [ ] Plan de financement équilibré (apport, prêt, aides)
- [ ] Nom vérifié (marque, domaine, réseaux)
- [ ] Pour une société : statuts rédigés, capital déposé

## L'immatriculation
- [ ] Dossier déposé sur le guichet unique (procedures.inpi.fr)
- [ ] SIREN reçu, inscription au registre national des entreprises

## Juste après
- [ ] Compte bancaire dédié (obligatoire en micro au-delà de deux années de chiffre d'affaires supérieur à 10 000 €)
- [ ] Espace Urssaf activé, échéances de déclaration notées
- [ ] Assurances adaptées (responsabilité civile professionnelle, décennale si bâtiment)
- [ ] Logiciel de facturation conforme, numérotation chronologique
- [ ] Facturation électronique : réception depuis septembre 2026, émission prévue en septembre 2027 pour les PME et micro-entreprises
`;

const invoice = `# Modèle de facture (exemple fictif)

**Facture n° 2026-0042** · Date d'émission : 6 novembre 2026 · Date d'échéance : 6 décembre 2026

**Vendeur** : Atelier Exemple, entrepreneur individuel · 12 rue Fictive, 75000 Paris · SIREN 000 000 000
**Client** : SARL Démo · 3 avenue Modèle, 69000 Lyon · SIREN 111 111 111
**Adresse de livraison** (si différente) : —
**Nature de l'opération** : prestation de services

| Désignation | Quantité | Prix unitaire HT | Total HT |
| --- | --- | --- | --- |
| Refonte du site vitrine | 1 | 1 000,00 € | 1 000,00 € |
| Formation à l'outil (2 h) | 2 | 100,00 € | 200,00 € |

**Total HT** : 1 200,00 €
**TVA** : TVA non applicable, article 293 B du CGI (franchise en base)
**Total à payer** : 1 200,00 €

Conditions de paiement : virement à 30 jours. Escompte pour paiement anticipé : néant.
En cas de retard : pénalités au taux de trois fois le taux d'intérêt légal, et indemnité forfaitaire de 40 € pour frais de recouvrement (clients professionnels).

---
Mentions à vérifier selon votre situation sur entreprendre.service-public.gouv.fr. Avec TVA : indiquer le taux, le montant de TVA par taux et le total TTC.
`;

const cashPlan = [
  "Plan de trésorerie (exemple fictif à adapter);Mois 1;Mois 2;Mois 3;Mois 4;Mois 5;Mois 6",
  "Trésorerie de début de mois;2000;;;;;",
  "Encaissements clients;3000;4000;4500;5000;5000;5500",
  "Apport ou prêt;0;0;0;0;0;0",
  "Total encaissements;3000;4000;4500;5000;5000;5500",
  "Achats et fournisseurs;1200;1500;1700;1800;1800;2000",
  "Loyer et abonnements;800;800;800;800;800;800",
  "Cotisations et impôts;600;700;800;850;850;900",
  "Remboursement d'emprunt;0;0;0;0;0;0",
  "Total décaissements;2600;3000;3300;3450;3450;3700",
  "Trésorerie de fin de mois (début + encaissements - décaissements);;;;;;",
].join("\n");

const budget = [
  "Budget mensuel (exemple fictif à adapter);Montant",
  "Revenus nets;1800",
  "Épargne programmée (se payer en premier);150",
  "Loyer et charges;700",
  "Énergie, internet, téléphone;150",
  "Transports;120",
  "Assurances;60",
  "Abonnements;40",
  "Courses;300",
  "Loisirs et imprévus;200",
  "Reste en fin de mois (revenus - épargne - dépenses);",
].join("\n");

export const practicalSheets: Record<string, PracticalSheet> = {
  "ent-creer-etapes": {
    title: "Liste de contrôle de création",
    filename: "bouse-creation-entreprise.md",
    mime: "text/markdown;charset=utf-8",
    content: checklist,
  },
  "ent-facturer-declarer": {
    title: "Modèle de facture",
    filename: "bouse-modele-facture.md",
    mime: "text/markdown;charset=utf-8",
    content: invoice,
  },
  "fin-bfr-tresorerie": {
    title: "Plan de trésorerie sur six mois",
    filename: "bouse-plan-tresorerie.csv",
    mime: "text/csv;charset=utf-8",
    content: cashPlan,
  },
  "fp-budget": {
    title: "Budget mensuel",
    filename: "bouse-budget-mensuel.csv",
    mime: "text/csv;charset=utf-8",
    content: budget,
  },
};
