import type { SkillContent } from "./types";

/** Ton argent au quotidien : les compétences sans leçon longue. */
export const skills: SkillContent[] = [
  {
    id: "fp-fiche-paie",
    idea: [
      "Ta fiche de paie part de ton salaire brut : ce que ton employeur s’engage à te payer. On en retire les cotisations sociales (retraite, chômage, santé) : il reste le net. C’est ce net, moins l’impôt prélevé à la source, qui arrive sur ton compte : le « net à payer ».",
      "Les cotisations ne sont pas perdues : elles financent ta retraite, tes remboursements de santé et ton chômage si tu perds ton emploi. Le « net imposable » sert, lui, à calculer ton impôt sur le revenu.",
      "Trois lignes suffisent pour vérifier chaque mois : les heures payées, le net à payer, et le cumul des congés. Une erreur se signale par écrit à ton employeur.",
    ],
    keys: [
      "Brut − cotisations = net.",
      "Net − impôt à la source = net à payer, versé sur ton compte.",
      "Les cotisations financent retraite, santé et chômage.",
      "Garde tes fiches de paie toute ta vie : elles servent pour ta retraite.",
    ],
    gesture: {
      intro:
        "Prends ta dernière fiche de paie (ou celle d’un proche, avec son accord) et recopie les lignes clés. Tu sauras où regarder chaque mois.",
      fields: [
        { label: "Salaire brut du mois", example: "2 000 €" },
        { label: "Total des cotisations salariales", example: "440 €" },
        { label: "Net avant impôt", example: "1 560 €" },
        { label: "Impôt prélevé à la source", example: "45 €" },
        { label: "Net à payer (sur ton compte)", example: "1 515 €" },
        { label: "Jours de congés restants", example: "12,5 jours" },
      ],
      tip: "Compare le net à payer avec le virement reçu sur ton compte : ils doivent être identiques.",
    },
    check: [
      {
        q: "Ton brut est de 2 000 € et tes cotisations de 440 €. Ton net avant impôt est de :",
        options: ["2 440 €", "1 560 €", "2 000 €"],
        answer: 1,
        why: "Le net, c’est le brut moins les cotisations : 2 000 − 440 = 1 560 €.",
      },
      {
        q: "Le montant viré sur ton compte correspond à :",
        options: [
          "le salaire brut",
          "le net à payer, après l’impôt à la source",
          "le total des cotisations",
        ],
        answer: 1,
        why: "Le net à payer est ce qui reste une fois les cotisations et l’impôt prélevés.",
      },
      {
        q: "Combien de temps garder ses fiches de paie ?",
        options: ["Un an", "Cinq ans", "Toute sa vie"],
        answer: 2,
        why: "Elles prouvent tes droits à la retraite : garde-les jusqu’à ce que ta retraite soit calculée.",
      },
    ],
  },
  {
    id: "fp-comptes-auto",
    idea: [
      "Le meilleur moyen d’épargner, c’est de ne pas avoir à y penser. Le jour où ta paie arrive, des virements programmés envoient d’abord l’argent là où il doit aller : épargne, factures, projets. Tu vis ensuite avec ce qui reste.",
      "On appelle ça « se payer en premier » : l’épargne part avant les envies, pas après. Un petit montant régulier bat un gros effort qu’on oublie.",
      "Garde une marge sur le compte courant pour les prélèvements qui tombent plus tard dans le mois : un découvert coûte cher.",
    ],
    keys: [
      "Programme les virements le jour de la paie, ou le lendemain.",
      "L’épargne part en premier, les envies en dernier.",
      "Un petit montant régulier vaut mieux qu’un gros effort ponctuel.",
      "Garde une marge pour éviter le découvert.",
    ],
    gesture: {
      intro:
        "Écris le plan de tes virements du mois. Il ne restera qu’à les programmer dans ton appli bancaire.",
      fields: [
        { label: "Jour d’arrivée de la paie", example: "le 28" },
        {
          label: "Virement vers l’épargne de précaution",
          example: "100 € le 29",
        },
        { label: "Virement vers un projet", example: "50 € le 29 (vacances)" },
        {
          label: "Factures prélevées (loyer, énergie…)",
          example: "loyer 650 € le 5, électricité 60 € le 10",
        },
        { label: "Reste pour vivre le mois", example: "≈ 640 €" },
        { label: "Marge gardée sur le compte", example: "100 €" },
      ],
      tip: "Commence petit : 20 € par mois programmés valent mieux que 200 € « si je peux ».",
    },
    check: [
      {
        q: "« Se payer en premier », c’est :",
        options: [
          "épargner ce qui reste en fin de mois",
          "mettre l’épargne de côté dès l’arrivée de la paie",
          "s’offrir un cadeau le jour de la paie",
        ],
        answer: 1,
        why: "L’épargne part avant les dépenses : il n’en reste jamais « en fin de mois ».",
      },
      {
        q: "Le meilleur jour pour programmer le virement d’épargne :",
        options: [
          "juste après l’arrivée de la paie",
          "le 31 du mois",
          "quand on y pense",
        ],
        answer: 0,
        why: "Juste après la paie, l’argent est là : le virement passe sans effort.",
      },
      {
        q: "Pourquoi garder une marge sur le compte courant ?",
        options: [
          "Pour gagner des intérêts",
          "Pour éviter un découvert si un prélèvement tombe plus tard",
          "La banque l’impose",
        ],
        answer: 1,
        why: "Une petite marge évite les frais et les agios d’un découvert.",
      },
    ],
  },
  {
    id: "fp-dettes",
    idea: [
      "Quand on a plusieurs dettes, la première étape est de toutes les écrire : à qui, combien il reste, le taux, la mensualité. Sans cette liste, on rembourse au hasard.",
      "Deux méthodes marchent. L’avalanche : rembourser d’abord la dette au taux le plus élevé (souvent un crédit renouvelable) ; c’est la moins chère. La boule de neige : solder d’abord la plus petite, pour se motiver. Dans les deux cas, on paie le minimum partout et on met tout le reste sur une seule dette.",
      "Si tu n’y arrives plus, n’attends pas : la Banque de France peut étudier un dossier de surendettement, gratuitement.",
    ],
    keys: [
      "Liste toutes tes dettes : reste dû, taux, mensualité.",
      "Avalanche : le taux le plus élevé d’abord (le moins cher).",
      "Boule de neige : la plus petite d’abord (le plus motivant).",
      "Le minimum partout, le surplus sur une seule dette.",
      "En difficulté : le dossier de surendettement à la Banque de France est gratuit.",
    ],
    gesture: {
      intro:
        "Fais ton plan de remboursement : la liste de tes dettes, puis l’ordre dans lequel tu vas les solder.",
      fields: [
        {
          label: "Dette 1 : à qui, reste dû, taux",
          example: "Crédit renouvelable : 1 200 € à 19 %",
        },
        {
          label: "Dette 2 : à qui, reste dû, taux",
          example: "Prêt auto : 6 000 € à 5 %",
        },
        {
          label: "Dette 3 : à qui, reste dû, taux",
          example: "Prêt d’un ami : 300 € à 0 %",
        },
        { label: "Méthode choisie", example: "Avalanche" },
        {
          label: "Dette à attaquer en premier",
          example: "Crédit renouvelable",
        },
        { label: "Montant en plus chaque mois", example: "80 €" },
      ],
      tip: "Une dette soldée libère sa mensualité : ajoute-la à la suivante, l’effet s’accélère.",
    },
    check: [
      {
        q: "Avec la méthode « avalanche », on rembourse d’abord :",
        options: [
          "la plus petite dette",
          "la dette au taux le plus élevé",
          "la plus récente",
        ],
        answer: 1,
        why: "Le taux le plus élevé coûte le plus cher chaque mois : le solder d’abord économise des intérêts.",
      },
      {
        q: "Sur les autres dettes, pendant ce temps :",
        options: [
          "on arrête de payer",
          "on paie au moins la mensualité minimum",
          "on rembourse tout en même temps",
        ],
        answer: 1,
        why: "Ne jamais rater une mensualité : les retards coûtent cher et abîment ton dossier.",
      },
      {
        q: "Tu n’arrives plus à payer tes dettes. Le dossier de surendettement :",
        options: [
          "coûte 500 €",
          "se dépose gratuitement à la Banque de France",
          "n’existe que pour les entreprises",
        ],
        answer: 1,
        why: "La Banque de France étudie gratuitement les dossiers des particuliers.",
      },
    ],
  },
  {
    id: "fp-objectifs",
    idea: [
      "Un grand projet (voyage, voiture, apport pour un logement) devient faisable quand on le transforme en trois chiffres : combien, pour quand, et donc combien par mois. 3 000 € dans 15 mois, c’est 200 € par mois.",
      "Chaque projet a sa poche à part, pour ne pas le mélanger avec l’épargne de précaution, qui reste réservée aux imprévus. Moins de deux ou trois ans : on garde l’argent sur un livret, sans risque. Au-delà, on peut envisager des placements plus dynamiques.",
      "Si le montant mensuel est trop lourd, on joue sur la date ou sur le montant, pas sur la sécurité.",
    ],
    keys: [
      "Montant ÷ nombre de mois = effort mensuel.",
      "Une poche par projet, séparée de l’épargne de précaution.",
      "Projet proche (moins de 2-3 ans) : pas de risque, livret.",
      "Trop lourd ? Décale la date ou réduis le montant.",
    ],
    gesture: {
      intro: "Remplis ton plan d’épargne pour un projet qui te tient à cœur.",
      fields: [
        { label: "Mon projet", example: "Voyage au Japon" },
        { label: "Montant total", example: "3 000 €" },
        { label: "Date visée", example: "dans 15 mois (février 2028)" },
        { label: "Déjà mis de côté", example: "0 €" },
        { label: "Effort par mois", example: "200 €" },
        {
          label: "Où je range cet argent",
          example: "Livret A, sous-compte « Japon »",
        },
      ],
      tip: "Donne un nom à la poche dans ton appli bancaire : on y touche beaucoup moins.",
    },
    check: [
      {
        q: "Tu veux 2 400 € dans 12 mois, en partant de zéro. Il faut mettre :",
        options: ["100 € par mois", "200 € par mois", "240 € par mois"],
        answer: 1,
        why: "2 400 ÷ 12 = 200 € par mois.",
      },
      {
        q: "Pour un projet dans un an, on range l’argent :",
        options: [
          "en actions",
          "sur un livret sans risque",
          "sur le compte courant avec le reste",
        ],
        answer: 1,
        why: "À court terme, une baisse des marchés pourrait faire rater le projet ; un livret protège le capital.",
      },
      {
        q: "L’effort mensuel est trop lourd. La meilleure option :",
        options: [
          "puiser dans l’épargne de précaution",
          "décaler la date ou réduire le montant",
          "prendre un crédit renouvelable",
        ],
        answer: 1,
        why: "L’épargne de précaution reste pour les imprévus ; on ajuste le projet, pas la sécurité.",
      },
    ],
  },
  {
    id: "fp-patrimoine",
    idea: [
      "Ton patrimoine, c’est ce que tu possèdes moins ce que tu dois. On additionne l’actif (comptes, livrets, placements, logement, voiture à sa valeur de revente) puis on retire le passif (le reste à rembourser de chaque crédit).",
      "Le chiffre compte moins que sa tendance : refais ton bilan une ou deux fois par an. S’il monte, ta stratégie marche. Regarde aussi la répartition : tout sur un seul livret, ou tout dans un seul bien, c’est fragile.",
      "Ce bilan sert aussi pour parler à un banquier, préparer un achat ou organiser une succession.",
    ],
    keys: [
      "Patrimoine net = actif − passif.",
      "L’actif à sa valeur d’aujourd’hui, pas au prix d’achat.",
      "Le passif = le reste à rembourser, pas les mensualités.",
      "Un bilan une ou deux fois par an : regarde la tendance.",
    ],
    gesture: {
      intro:
        "Remplis ton tableau de patrimoine. Des montants arrondis suffisent.",
      fields: [
        { label: "Comptes et livrets", example: "8 500 €" },
        { label: "Placements (PEA, assurance-vie…)", example: "12 000 €" },
        { label: "Immobilier (valeur estimée)", example: "180 000 €" },
        { label: "Autres biens (voiture…)", example: "6 000 €" },
        { label: "Crédits : reste à rembourser", example: "142 000 €" },
        { label: "Patrimoine net", example: "64 500 €" },
      ],
      tip: "Note la date du bilan : dans six mois, tu compareras.",
    },
    check: [
      {
        q: "Tu as 200 000 € d’actifs et 150 000 € de crédits à rembourser. Ton patrimoine net :",
        options: ["350 000 €", "200 000 €", "50 000 €"],
        answer: 2,
        why: "Patrimoine net = actif − passif = 200 000 − 150 000 = 50 000 €.",
      },
      {
        q: "Ta voiture se compte :",
        options: [
          "à son prix d’achat",
          "à sa valeur de revente aujourd’hui",
          "elle ne compte pas",
        ],
        answer: 1,
        why: "Le bilan mesure ce que tu possèdes aujourd’hui : la valeur actuelle.",
      },
      {
        q: "Dans le passif, on inscrit :",
        options: [
          "les mensualités",
          "le reste à rembourser de chaque crédit",
          "les dépenses du mois",
        ],
        answer: 1,
        why: "Le passif, c’est ce que tu dois encore, pas ce que tu paies chaque mois.",
      },
    ],
  },
];
