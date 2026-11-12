import type { SkillContent } from "./types";

/** Finances de l’entreprise : les compétences sans leçon longue. */
export const skills: SkillContent[] = [
  {
    id: "fin-tva",
    idea: [
      "La TVA est une taxe ajoutée au prix de vente. Elle est payée par le client final, mais c’est l’entreprise qui l’encaisse et la reverse à l’État. HT veut dire « hors taxes » : le prix sans la TVA. TTC veut dire « toutes taxes comprises » : le prix payé par le client.",
      "Calcul de base avec un taux de 20 % : un prix de 100 € HT donne 100 × 1,20 = 120 € TTC, dont 20 € de TVA. Pour retrouver le HT à partir du TTC, divise par 1,20 : 120 ÷ 1,20 = 100 €. Le taux dépend du produit ou du service : vérifie celui de ton activité sur service-public.fr.",
      "Tu reverses à l’État la TVA que tu as encaissée moins la TVA que tu as payée sur tes achats professionnels. Certaines petites entreprises en sont dispensées : la règle dépend de ton statut, vérifie-la sur service-public.fr.",
    ],
    keys: [
      "HT = sans la TVA, TTC = avec la TVA.",
      "TTC = HT × (1 + taux). Avec 20 % : HT × 1,20.",
      "HT = TTC ÷ (1 + taux).",
      "TVA à reverser = TVA encaissée − TVA payée sur tes achats pros.",
    ],
    gesture: {
      intro:
        "Entraîne-toi à passer du HT au TTC et inversement avec un vrai prix de ton activité. Utilise le taux qui correspond à ton produit.",
      fields: [
        { label: "Prix HT", example: "500 €" },
        { label: "Taux de TVA applicable", example: "20 %" },
        { label: "Montant de la TVA", example: "100 €" },
        { label: "Prix TTC", example: "600 €" },
        { label: "TVA payée sur mes achats pros", example: "40 €" },
        { label: "TVA à reverser à l’État", example: "60 €" },
      ],
      tip: "Fais toujours tes devis en HT et en TTC : un client particulier ne regarde que le TTC.",
    },
    check: [
      {
        q: "Un prix est de 200 € HT avec 20 % de TVA. Le prix TTC est de :",
        options: ["220 €", "240 €", "204 €"],
        answer: 1,
        why: "200 × 1,20 = 240 €, dont 40 € de TVA.",
      },
      {
        q: "Un client paie 120 € TTC avec 20 % de TVA. Le prix HT est de :",
        options: ["100 €", "96 €", "110 €"],
        answer: 0,
        why: "On divise par 1,20 : 120 ÷ 1,20 = 100 €. Soustraire 20 % de 120 donnerait 96 €, ce qui est faux.",
      },
      {
        q: "Tu as encaissé 300 € de TVA et payé 120 € de TVA sur tes achats pros. Tu reverses :",
        options: ["300 €", "420 €", "180 €"],
        answer: 2,
        why: "On reverse la TVA encaissée moins la TVA déductible : 300 − 120 = 180 €.",
      },
    ],
  },
  {
    id: "fin-tableau-bord",
    idea: [
      "Un tableau de bord, c’est la page unique qui te dit si ton entreprise va bien. Pas besoin de vingt chiffres : cinq suffisent pour un petit entrepreneur. Chaque mois, tu les notes, tu les compares au mois précédent et tu vois tout de suite si quelque chose cloche.",
      "Les cinq chiffres : ton chiffre d’affaires (ce que tu as facturé), tes dépenses (ce que tu as payé), ta marge (ce qu’il te reste après les coûts directs), ta trésorerie (l’argent réellement en banque) et tes impayés (l’argent que tes clients te doivent).",
      "Le plus utile est la tendance : un chiffre isolé ne dit rien, mais une trésorerie qui baisse trois mois de suite est un signal. Prends vingt minutes à la fin de chaque mois, toujours le même jour.",
    ],
    keys: [
      "Cinq chiffres suffisent : chiffre d’affaires, dépenses, marge, trésorerie, impayés.",
      "Compare toujours avec le mois d’avant.",
      "La tendance compte plus qu’un chiffre isolé.",
      "Fais-le chaque mois, le même jour, en vingt minutes.",
    ],
    gesture: {
      intro:
        "Recopie ce tableau chaque mois. Remplis le mois en cours et le mois précédent pour voir la tendance.",
      fields: [
        {
          label: "Chiffre d’affaires du mois",
          example: "4 000 € (mois dernier : 3 500 €)",
        },
        {
          label: "Dépenses du mois",
          example: "1 500 € (mois dernier : 1 400 €)",
        },
        { label: "Marge", example: "2 500 €" },
        { label: "Trésorerie en banque en fin de mois", example: "3 200 €" },
        { label: "Impayés clients", example: "800 €" },
        {
          label: "Ce que je retiens",
          example: "mon activité progresse mais les impayés augmentent",
        },
      ],
      tip: "Un tableau simple tenu chaque mois vaut mieux qu’un tableau parfait jamais rempli.",
    },
    check: [
      {
        q: "Combien de chiffres faut-il pour un tableau de bord utile ?",
        options: [
          "Une trentaine",
          "Cinq bien choisis",
          "Un seul : le chiffre d’affaires",
        ],
        answer: 1,
        why: "Peu de chiffres, suivis régulièrement, valent mieux qu’une avalanche qu’on ne lit pas.",
      },
      {
        q: "Ta trésorerie baisse trois mois de suite. Que fais-tu ?",
        options: [
          "Rien, un chiffre isolé ne compte pas",
          "Tu regardes pourquoi : dépenses, impayés, activité",
          "Tu arrêtes ton tableau de bord",
        ],
        answer: 1,
        why: "C’est une tendance, donc un signal d’alerte à analyser tôt.",
      },
      {
        q: "Que mesure la trésorerie ?",
        options: [
          "Ce que tu as facturé ce mois-ci",
          "L’argent réellement disponible sur tes comptes",
          "Le total de tes clients",
        ],
        answer: 1,
        why: "Une facture non payée n’est pas de la trésorerie : seule compte la somme en banque.",
      },
    ],
  },
  {
    id: "fin-valoriser",
    idea: [
      "Estimer la valeur d’une entreprise sert dans trois cas : la vendre, en racheter une, ou faire entrer un associé. Il n’existe pas un prix unique. La valeur dépend de ce que l’entreprise gagne, de ce qu’elle possède et de ce qu’un acheteur est prêt à payer.",
      "Trois approches simples. Un multiple du bénéfice : par exemple trois à cinq fois le bénéfice annuel, selon le métier. La valeur de ce que l’entreprise possède : matériel, stock, trésorerie, moins les dettes. Et les ventes comparables : combien d’entreprises semblables se sont vendues.",
      "Ces calculs donnent une fourchette, pas un chiffre exact. Les multiples varient selon l’activité et l’époque : fais-toi aider par un expert-comptable ou une chambre de métiers avant de fixer un prix, et ne te base pas seulement sur un multiple trouvé sur internet.",
    ],
    keys: [
      "La valeur dépend de ce que l’entreprise gagne, possède et d’un prix de marché.",
      "Le résultat est une fourchette, pas un prix exact.",
      "Un multiple du bénéfice est la méthode la plus courante pour une petite entreprise.",
      "Fais-toi accompagner avant de vendre ou de racheter.",
    ],
    gesture: {
      intro:
        "Remplis cette fiche avec les chiffres d’une entreprise réelle ou imaginaire pour obtenir une première fourchette de valeur. Les chiffres sont des exemples ronds.",
      fields: [
        { label: "Bénéfice annuel moyen sur 3 ans", example: "40 000 €" },
        {
          label: "Multiple raisonnable pour ce métier",
          example: "entre 3 et 4",
        },
        {
          label: "Valeur selon le bénéfice (fourchette)",
          example: "120 000 € à 160 000 €",
        },
        { label: "Matériel, stock et trésorerie", example: "50 000 €" },
        { label: "Dettes à déduire", example: "20 000 €" },
        { label: "Valeur de ce que l’entreprise possède", example: "30 000 €" },
        {
          label: "Ma fourchette finale",
          example: "autour de 120 000 € à 160 000 €",
        },
      ],
      tip: "Compare toujours deux méthodes : si les résultats sont très éloignés, cherche pourquoi.",
    },
    check: [
      {
        q: "Une entreprise gagne 50 000 € par an. Avec un multiple de 3, la valeur estimée est de :",
        options: ["150 000 €", "53 000 €", "16 667 €"],
        answer: 0,
        why: "On multiplie le bénéfice par le multiple : 50 000 × 3 = 150 000 €.",
      },
      {
        q: "Une estimation de valeur donne :",
        options: [
          "Un prix exact et définitif",
          "Une fourchette qui sert de base à la discussion",
          "Un prix imposé par la loi",
        ],
        answer: 1,
        why: "La valeur dépend de l’acheteur, du métier et du moment : on obtient une fourchette.",
      },
      {
        q: "Pourquoi comparer deux méthodes d’estimation ?",
        options: [
          "Pour savoir si les résultats se rejoignent et repérer une erreur",
          "Pour choisir la plus élevée sans réfléchir",
          "Parce que la loi l’exige",
        ],
        answer: 0,
        why: "Deux méthodes proches rassurent ; un grand écart oblige à vérifier les hypothèses.",
      },
    ],
  },
];
