import type { SkillContent } from "./types";

/** Investir : les compétences sans leçon longue. */
export const skills: SkillContent[] = [
  {
    id: "inv-livrets",
    idea: [
      "Un livret est un compte d’épargne simple : tu mets de l’argent, il rapporte un petit intérêt, et tu peux le reprendre quand tu veux. Le Livret A, le LDDS et le LEP sont des livrets réglementés : leur taux est fixé par l’État, et l’argent placé est garanti.",
      "Le LEP est réservé aux personnes dont les revenus sont modestes : il rapporte en général plus, mais il faut remplir la condition de revenus. Le PEL est différent : tu t’engages à laisser l’argent plusieurs années, et le taux dépend de la date d’ouverture du plan.",
      "Les taux et les plafonds changent : vérifie toujours les chiffres à jour sur service-public.fr avant de choisir. Un livret ne sert pas à faire fortune : il sert à garder de l’argent disponible et à l’abri, comme ton épargne de précaution.",
    ],
    keys: [
      "Livret A, LDDS et LEP : argent disponible à tout moment, garanti, intérêts sans impôt.",
      "Le LEP est réservé à ceux dont les revenus sont sous un certain seuil.",
      "Le PEL demande de laisser l’argent longtemps ; son taux dépend de la date d’ouverture.",
      "Taux et plafonds changent : vérifie-les sur service-public.fr.",
    ],
    gesture: {
      intro:
        "Fais le point sur tes livrets : ce que tu as déjà, ce que tu pourrais ouvrir, et à quoi chacun sert. Les montants ci-dessous sont des exemples.",
      fields: [
        {
          label: "Livrets que je possède déjà",
          example: "Livret A à la banque X",
        },
        { label: "Somme actuelle sur chaque livret", example: "1 200 €" },
        {
          label: "Livret dont je remplis les conditions mais que je n’ai pas",
          example: "LDDS (ouverture gratuite)",
        },
        {
          label: "Taux actuel (vérifié sur service-public.fr)",
          example: "à vérifier, à noter avec la date",
        },
        {
          label: "Rôle de cet argent",
          example: "épargne de précaution : 3 mois de dépenses",
        },
        {
          label: "Prochaine date pour revérifier mes taux",
          example: "chaque janvier",
        },
      ],
      tip: "Note la date à côté de chaque taux : un taux sans date ne veut plus rien dire dans un an.",
    },
    check: [
      {
        q: "Quelle est la principale qualité d’un Livret A ?",
        options: [
          "Il rapporte beaucoup plus que la Bourse",
          "L’argent est disponible et garanti",
          "On ne peut y mettre que de petites sommes",
        ],
        answer: 1,
        why: "Un livret réglementé offre de la sécurité et de la disponibilité, pas un gros rendement.",
      },
      {
        q: "Qui peut ouvrir un LEP ?",
        options: [
          "Tout le monde",
          "Seulement les personnes dont les revenus sont sous un seuil",
          "Seulement les retraités",
        ],
        answer: 1,
        why: "Le LEP est réservé aux foyers aux revenus modestes, selon un seuil fixé chaque année.",
      },
      {
        q: "Où trouver les taux et plafonds à jour ?",
        options: [
          "Sur service-public.fr ou le site de ta banque",
          "Dans un article vieux de cinq ans",
          "Ils ne changent jamais",
        ],
        answer: 0,
        why: "Les taux et plafonds évoluent : seule une source officielle récente est fiable.",
      },
    ],
  },
  {
    id: "inv-premier-etf",
    idea: [
      "Un ETF est un panier d’entreprises qui se négocie en Bourse comme une action. En achetant une part, tu possèdes un tout petit morceau de centaines d’entreprises à la fois. Les frais d’un ETF sont en général bien plus bas que ceux d’un fonds classique.",
      "Pour en acheter, il faut un compte qui permet d’acheter en Bourse : un PEA, un compte-titres ou une assurance-vie qui propose des ETF. Chacun a ses règles et sa fiscalité. Compare les frais de courtage, c’est-à-dire ce que prend l’intermédiaire à chaque achat.",
      "Passer l’ordre est simple : tu choisis l’ETF grâce à son code (appelé ISIN), la quantité, et le type d’ordre. L’ordre « à cours limité » fixe le prix maximum que tu acceptes de payer. Un ETF peut baisser comme monter : n’investis que de l’argent dont tu n’as pas besoin avant plusieurs années.",
    ],
    keys: [
      "Un ETF regroupe de nombreuses entreprises dans une seule part, à frais bas.",
      "Il faut d’abord un compte adapté : PEA, compte-titres ou assurance-vie.",
      "Compare les frais de courtage et les frais de gestion de l’ETF avant d’acheter.",
      "Un ordre à cours limité te protège d’un prix inattendu.",
      "Ne mets que de l’argent dont tu n’as pas besoin avant des années.",
    ],
    gesture: {
      intro:
        "Remplis cette checklist avant ton premier achat. Elle t’évite les erreurs classiques : mauvais compte, frais cachés, argent dont tu as besoin demain.",
      fields: [
        {
          label: "Ma réserve de précaution est constituée",
          example: "oui : 3 mois de dépenses sur un livret",
        },
        {
          label: "Le compte que j’ouvre",
          example: "PEA chez un courtier en ligne",
        },
        {
          label: "Frais de courtage par achat",
          example: "à relever dans la grille tarifaire",
        },
        {
          label: "L’ETF visé et son code ISIN",
          example: "ETF monde, ISIN recopié depuis le site officiel",
        },
        {
          label: "Frais annuels de l’ETF",
          example: "à relever dans le document d’information",
        },
        {
          label: "Type d’ordre et montant",
          example: "ordre à cours limité, 100 €",
        },
        {
          label: "Durée pendant laquelle je ne touche pas à cet argent",
          example: "au moins 5 ans",
        },
      ],
      tip: "Fais ton premier achat avec un petit montant : tu apprends le geste sans prendre de risque important.",
    },
    check: [
      {
        q: "Qu’est-ce qu’un ETF ?",
        options: [
          "Un livret garanti par l’État",
          "Un panier d’entreprises négocié en Bourse",
          "Un prêt accordé à une banque",
        ],
        answer: 1,
        why: "Un ETF réunit de nombreuses entreprises dans une seule part cotée en Bourse.",
      },
      {
        q: "Que fait un ordre « à cours limité » ?",
        options: [
          "Il fixe le prix maximum que tu acceptes de payer à l’achat",
          "Il garantit que le cours ne baissera pas",
          "Il achète au prix le plus élevé",
        ],
        answer: 0,
        why: "Avec un cours limité, l’ordre ne s’exécute pas au-dessus du prix que tu as fixé.",
      },
      {
        q: "Avant d’acheter un ETF, il vaut mieux :",
        options: [
          "Y mettre l’argent du loyer pour aller plus vite",
          "Avoir une réserve de précaution et accepter que la valeur puisse baisser",
          "Attendre une garantie de gain",
        ],
        answer: 1,
        why: "Un ETF n’est pas garanti : on investit de l’argent dont on n’a pas besoin à court terme.",
      },
    ],
  },
  {
    id: "inv-reequilibrer",
    idea: [
      "Avec le temps, les placements ne bougent pas au même rythme. Si tu as choisi 60 % d’actions et 40 % de placements plus sûrs, et que les actions montent, tu te retrouves avec 70 % d’actions : ton portefeuille est devenu plus risqué sans que tu aies rien décidé.",
      "Rééquilibrer, c’est remettre le portefeuille à la répartition de départ. Deux manières : vendre un peu de ce qui a monté pour acheter ce qui a moins monté, ou mieux, diriger tes nouveaux versements vers la partie devenue trop petite. La deuxième évite de payer des frais et des impôts.",
      "Une fois par an suffit, à date fixe, par exemple chaque janvier. Ce rendez-vous évite de réagir aux émotions du moment. Pense à vérifier les frais et la fiscalité avant de vendre.",
    ],
    keys: [
      "Les placements dérivent : ton risque change sans que tu t’en rendes compte.",
      "Rééquilibrer = revenir à sa répartition de départ.",
      "Le plus simple : orienter les nouveaux versements vers la partie trop petite.",
      "Une fois par an, à date fixe, suffit.",
    ],
    gesture: {
      intro:
        "Compare ta répartition voulue à ta répartition actuelle, puis décide quoi faire. Les chiffres sont un exemple.",
      fields: [
        {
          label: "Ma répartition cible",
          example: "60 % actions, 40 % placements sûrs",
        },
        {
          label: "Ma répartition actuelle",
          example: "70 % actions, 30 % placements sûrs",
        },
        { label: "Écart à corriger", example: "10 points d’actions en trop" },
        {
          label: "Action choisie",
          example:
            "diriger les 6 prochains versements vers les placements sûrs",
        },
        {
          label: "Frais ou impôts à vérifier avant de vendre",
          example: "frais de courtage, fiscalité du compte",
        },
        {
          label: "Date de mon prochain rééquilibrage",
          example: "janvier prochain",
        },
      ],
      tip: "Évite de rééquilibrer en pleine panique : la date fixe est là pour te protéger de tes émotions.",
    },
    check: [
      {
        q: "Pourquoi rééquilibrer son portefeuille ?",
        options: [
          "Pour gagner plus à coup sûr",
          "Pour revenir au niveau de risque choisi au départ",
          "Parce que la loi l’impose",
        ],
        answer: 1,
        why: "Les placements dérivent ; rééquilibrer remet le risque à la hauteur voulue.",
      },
      {
        q: "Quelle méthode évite souvent des frais et des impôts ?",
        options: [
          "Tout vendre et tout racheter",
          "Diriger les nouveaux versements vers la partie devenue trop petite",
          "Ne jamais regarder son portefeuille",
        ],
        answer: 1,
        why: "Acheter sans vendre ne déclenche ni frais de vente ni impôt sur les gains.",
      },
      {
        q: "À quelle fréquence rééquilibrer, en général ?",
        options: [
          "Une fois par an, à date fixe",
          "Chaque jour",
          "Dès que les journaux parlent de la Bourse",
        ],
        answer: 0,
        why: "Une fois par an suffit, et une date fixe évite les décisions dictées par l’émotion.",
      },
    ],
  },
];
