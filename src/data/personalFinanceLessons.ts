import type { Lesson } from "./lessons";

/**
 * Module « Finance personnelle ». Pédagogique : exemples fictifs, aucun taux
 * réglementé ni plafond chiffré (ils changent ; à vérifier à la date d'une
 * décision), aucune recommandation d'établissement ou de produit.
 */
const editorialStatus =
  "Module pédagogique initial · exemples fictifs · taux réglementés, plafonds et règles bancaires à vérifier auprès des sources officielles · aucun conseil personnalisé";

const servicePublic = {
  title: "Service-public.fr · espace particuliers (argent, crédit, épargne)",
  url: "https://www.service-public.fr/particuliers",
};
const banqueDeFrance = {
  title: "Banque de France · Mes questions d’argent",
  url: "https://www.mesquestionsdargent.fr/",
};
const financePourTous = {
  title: "La finance pour tous (IEFP) · budget et crédit",
  url: "https://www.lafinancepourtous.com/",
};
const inseeInflation = {
  title: "Insee · indice des prix à la consommation",
  url: "https://www.insee.fr/",
};

export const personalFinanceLessons: Lesson[] = [
  {
    id: "fp-budget",
    title: "Construire son budget : revenus, charges, reste à vivre",
    domain: "Finance personnelle",
    level: 0,
    minutes: 16,
    summary:
      "Savoir ce qui entre, ce qui sort et ce qui reste. Se payer en premier plutôt qu’épargner ce qui traîne en fin de mois.",
    skills: [
      "Revenus nets",
      "Charges fixes et variables",
      "Reste à vivre",
      "Se payer en premier",
    ],
    prerequisites: [],
    sections: [
      {
        title: "Pourquoi apprendre ça ?",
        body: [
          "Un budget n’est pas une punition : c’est une carte. Sans elle, on découvre à la fin du mois où l’argent est parti ; avec elle, on décide avant.",
          "La même logique que pour une entreprise s’applique : distinguer ce qui entre, ce qui sort à coup sûr, ce qui varie, et ce qui reste disponible.",
        ],
      },
      {
        title: "Les mécanismes",
        body: [
          "Les revenus nets sont ce qui arrive réellement sur le compte : salaire net, aides, revenus d’activité. Pour un revenu irrégulier, partir d’un mois prudent plutôt que d’une moyenne optimiste.",
          "Les charges fixes reviennent chaque mois pour un montant connu : loyer, abonnements, assurances, remboursement de crédit. Les dépenses variables changent : courses, sorties, carburant. Les dépenses ponctuelles (réparation, cadeaux, impôts) se lissent en mettant de côté un peu chaque mois.",
          "Le reste à vivre est ce qui reste après les charges fixes. Se payer en premier consiste à programmer un virement d’épargne en début de mois, puis à vivre avec le reste, plutôt que d’épargner ce qui reste en fin de mois — souvent rien.",
        ],
      },
      {
        title: "Le vocabulaire professionnel",
        body: [
          "Les banques parlent de reste à vivre et de taux d’endettement (part des revenus consacrée aux remboursements de crédits). Ces repères servent à évaluer une demande de crédit ; les seuils appliqués varient et se vérifient au moment d’emprunter.",
          "Une règle de répartition comme « besoins / envies / épargne » donne un point de départ, pas une norme : un loyer élevé ou des revenus modestes imposent d’autres proportions.",
        ],
      },
      {
        title: "Le piège des petites dépenses invisibles",
        body: [
          "Les abonnements oubliés et les petites dépenses répétées pèsent lourd parce qu’elles sont régulières : 4 € par jour font environ 120 € par mois.",
          "Un budget trop serré casse vite. Mieux vaut prévoir une ligne « imprévus et plaisirs » réaliste qu’un plan parfait abandonné au bout de trois semaines.",
          "Limites : cette leçon ne traite ni la fiscalité du foyer, ni les situations de surendettement. En cas de difficulté, des dispositifs publics existent : se renseigner auprès de sa banque ou de la Banque de France.",
        ],
      },
    ],
    example: {
      title: "Exemple fictif · le budget de Léa",
      body: "Léa, personnage fictif, reçoit 1 800 € nets par mois. Ses charges fixes (loyer, assurances, téléphone, transport) font 1 100 €. Elle programme 150 € d’épargne le jour de sa paie. Il lui reste 550 € pour les dépenses variables. Si ses courses et sorties montent à 450 €, il lui reste 100 € de marge. Son taux d’épargne est d’environ 8 %.",
    },
    exercise: {
      prompt:
        "Cas fictif : 1 800 € de revenus nets, 1 100 € de charges fixes, 450 € de dépenses variables. Combien reste-t-il en fin de mois, en euros, avant toute épargne ?",
      hint: "Retire les charges fixes puis les dépenses variables des revenus.",
      answer: "250",
      explanation:
        "1 800 − 1 100 − 450 = 250 €. En programmant une partie de ces 250 € en épargne dès le début du mois, on évite de la dépenser par défaut.",
    },
    quiz: [
      {
        id: "fp-budget-1",
        question: "Que signifie « se payer en premier » ?",
        options: [
          "Programmer l’épargne en début de mois, puis vivre avec le reste",
          "Épargner ce qui reste éventuellement en fin de mois",
          "Payer ses envies avant ses factures",
        ],
        answer: 0,
        explanation:
          "L’épargne programmée en premier ne dépend plus de la discipline de fin de mois, où il reste souvent peu.",
      },
      {
        id: "fp-budget-2",
        question: "Lequel est une charge fixe ?",
        options: [
          "Le loyer",
          "Les sorties au restaurant",
          "Une réparation imprévue",
        ],
        answer: 0,
        explanation:
          "Le loyer revient chaque mois pour un montant connu. Les sorties varient ; une réparation est ponctuelle et se prévoit en lissant.",
      },
    ],
    application:
      "Pour ton projet, fais le même exercice à l’échelle de l’activité : revenus attendus, charges fixes, dépenses variables, et la part que tu mets de côté avant tout pour les imprévus.",
    idea: {
      title: "Détecteur d’abonnements oubliés",
      description:
        "Un outil qui repère dans un relevé les prélèvements récurrents et chiffre leur coût annuel. Première validation : demander à cinq personnes combien d’abonnements elles pensent avoir, puis compter avec elles.",
    },
    sources: [banqueDeFrance, financePourTous, servicePublic],
    version: "1.0.0",
    editorialStatus,
    flashcards: [
      {
        front: "Qu’est-ce que le reste à vivre ?",
        back: "Ce qui reste des revenus après les charges fixes, pour les dépenses variables et l’épargne.",
      },
      {
        front: "Pourquoi se payer en premier ?",
        back: "L’épargne programmée en début de mois ne dépend plus de ce qui reste en fin de mois.",
      },
    ],
  },
  {
    id: "fp-epargne-precaution",
    title: "L’épargne de précaution",
    domain: "Finance personnelle",
    level: 1,
    minutes: 14,
    summary:
      "Un matelas disponible et sans risque de perte pour encaisser les imprévus, avant d’investir ou d’emprunter.",
    skills: [
      "Mois de dépenses",
      "Disponibilité",
      "Livrets réglementés",
      "Ordre des priorités",
    ],
    prerequisites: ["fp-budget"],
    sections: [
      {
        title: "Pourquoi apprendre ça ?",
        body: [
          "Une panne de voiture, une période sans revenus, une facture inattendue : sans réserve, l’imprévu se finance par un découvert ou un crédit coûteux, ou force à vendre un placement au mauvais moment.",
          "L’épargne de précaution est la base de toute stratégie : elle rend le reste possible.",
        ],
      },
      {
        title: "Les mécanismes",
        body: [
          "On l’exprime en mois de dépenses essentielles. Un repère courant va de trois à six mois ; il se module selon la stabilité des revenus, la situation familiale et les risques propres (indépendant, véhicule indispensable, logement ancien).",
          "Elle doit être disponible rapidement et sans risque de perte en capital. Les livrets réglementés (comme le Livret A ou le LDDS) répondent à ces critères : leur taux est fixé par les pouvoirs publics et leurs plafonds sont encadrés — à vérifier à la date de votre décision.",
          "Elle ne vise pas le rendement. Placer sa réserve en bourse expose à devoir vendre après une baisse, précisément quand on a besoin de l’argent.",
        ],
      },
      {
        title: "Le vocabulaire professionnel",
        body: [
          "La liquidité désigne la rapidité d’accès à l’argent sans perte. Le rendement réel d’un livret peut être négatif si l’inflation dépasse son taux : c’est le prix de la sécurité et de la disponibilité.",
          "L’ordre généralement conseillé : réserve de précaution, puis remboursement des dettes coûteuses, puis projets et investissement à long terme.",
        ],
      },
      {
        title: "Le piège de la réserve qui sert à tout",
        body: [
          "Une réserve utilisée pour les vacances ou les achats plaisir cesse d’être une précaution. Séparer les comptes (réserve d’un côté, projets de l’autre) aide à ne pas la grignoter.",
          "Après un imprévu, reconstituer la réserve devient la priorité de l’épargne.",
          "Limites : les montants et durées sont des repères pédagogiques. Les taux et plafonds des livrets changent : consulter service-public.fr avant d’ouvrir ou d’alimenter un produit.",
        ],
      },
    ],
    example: {
      title: "Exemple fictif · combien mettre de côté",
      body: "Karim, personnage fictif, dépense 1 500 € par mois pour l’essentiel (logement, nourriture, transport, assurances). Salarié en CDI, il vise trois mois : 4 500 €. Sa sœur, indépendante aux revenus irréguliers, vise six mois de ses propres dépenses. Tous deux gardent cette réserve sur un livret disponible, séparé du compte courant.",
    },
    exercise: {
      prompt:
        "Cas fictif : 1 500 € de dépenses essentielles par mois. Quel montant représente une réserve de trois mois, en euros ?",
      hint: "Multiplie les dépenses mensuelles par le nombre de mois de couverture.",
      answer: "4500",
      explanation:
        "1 500 × 3 = 4 500 €. Avec des revenus irréguliers, viser six mois donnerait 9 000 €.",
    },
    quiz: [
      {
        id: "fp-precaution-1",
        question:
          "Quelle qualité est indispensable pour une épargne de précaution ?",
        options: [
          "Être disponible rapidement sans risque de perte",
          "Offrir le rendement le plus élevé possible",
          "Être bloquée plusieurs années pour éviter la tentation",
        ],
        answer: 0,
        explanation:
          "La réserve doit pouvoir être mobilisée tout de suite, sans dépendre de la valeur d’un marché.",
      },
      {
        id: "fp-precaution-2",
        question:
          "Pourquoi éviter de placer sa réserve de précaution en actions ?",
        options: [
          "On risque de devoir vendre après une baisse, au moment du besoin",
          "Les actions sont interdites aux particuliers",
          "Les actions ne rapportent jamais rien",
        ],
        answer: 0,
        explanation:
          "Un imprévu peut tomber pendant une baisse des marchés : la réserve doit être indépendante de ce risque.",
      },
    ],
    application:
      "Pour ton projet, chiffre la réserve qui te permettrait de traverser trois mois sans revenu de l’activité. Cette réserve conditionne le risque que tu peux prendre.",
    idea: {
      title: "Jauge de sécurité financière",
      description:
        "Un indicateur simple : « ma réserve couvre N mois de mes dépenses essentielles ». Première validation : demander à des proches s’ils connaissent ce chiffre pour eux-mêmes.",
    },
    sources: [servicePublic, banqueDeFrance, financePourTous],
    version: "1.0.0",
    editorialStatus,
    flashcards: [
      {
        front: "Comment dimensionner une épargne de précaution ?",
        back: "En mois de dépenses essentielles : un repère de trois à six mois, selon la stabilité des revenus.",
      },
      {
        front: "Dans quel ordre épargner ?",
        back: "Réserve de précaution, puis dettes coûteuses, puis projets et investissement à long terme.",
      },
    ],
  },
  {
    id: "fp-credit-taux",
    title: "Crédit : taux, TAEG et coût total",
    domain: "Finance personnelle",
    level: 1,
    minutes: 20,
    summary:
      "Lire une offre de crédit : mensualité, durée, taux nominal, TAEG et ce que l’emprunt coûte vraiment.",
    skills: ["Mensualité", "Taux nominal et TAEG", "Coût total", "Durée"],
    prerequisites: ["fp-epargne-precaution"],
    sections: [
      {
        title: "Pourquoi apprendre ça ?",
        body: [
          "Un crédit se vend souvent par sa mensualité : « seulement 150 € par mois ». La vraie question est ailleurs : combien coûte-t-il au total, et pendant combien de temps engage-t-il le budget ?",
          "Savoir lire une offre évite les crédits chers et permet de comparer des propositions différentes.",
        ],
      },
      {
        title: "Les mécanismes",
        body: [
          "Un crédit amortissable se rembourse par mensualités constantes. Chaque mensualité contient des intérêts (plus élevés au début) et une part de capital. Mensualité = capital × taux mensuel ÷ (1 − (1 + taux mensuel)^−nombre de mois).",
          "Le coût total du crédit = somme des mensualités − capital emprunté, auquel s’ajoutent les frais et l’assurance exigée. Allonger la durée baisse la mensualité mais augmente le coût total.",
          "Le taux nominal sert à calculer les intérêts. Le TAEG (taux annuel effectif global) intègre aussi les frais obligatoires et l’assurance exigée : c’est l’indicateur légal pour comparer des offres. Il doit figurer dans l’offre.",
        ],
      },
      {
        title: "Le vocabulaire professionnel",
        body: [
          "Le tableau d’amortissement détaille chaque échéance. Le taux d’endettement rapporte les remboursements aux revenus ; les seuils appliqués par les banques sont encadrés et se vérifient au moment d’emprunter.",
          "Le crédit renouvelable (réserve d’argent) a en général un taux plus élevé et un remboursement qui peut s’étirer : à manier avec prudence. Un délai de rétractation existe pour les crédits à la consommation ; sa durée se vérifie sur service-public.fr.",
        ],
      },
      {
        title: "Le piège de la mensualité basse",
        body: [
          "Comparer deux crédits sur la seule mensualité est trompeur : le moins cher par mois peut être le plus cher au total, parce qu’il dure plus longtemps.",
          "Regrouper ou allonger ses crédits soulage le mois, mais coûte souvent plus cher et prolonge l’engagement.",
          "Limites : le simulateur de la leçon ignore l’assurance et les frais (donc le TAEG) et arrondit les échéances. Il ne représente l’offre d’aucun établissement.",
        ],
      },
    ],
    example: {
      title: "Exemple fictif · 3 000 € sur un an",
      body: "Pour financer un ordinateur, Inès, personnage fictif, emprunte 3 000 € sur 12 mois à un taux nominal fictif de 6 %. Sa mensualité est d’environ 258,20 € et les intérêts totaux d’environ 98 €, hors assurance et frais. Sur 24 mois, la mensualité baisserait vers 133 €, mais les intérêts doubleraient presque.",
    },
    exercise: {
      prompt:
        "Cas fictif : tu rembourses 12 mensualités de 260 € pour un emprunt de 3 000 €. Quel est le coût total du crédit, en euros, hors frais ?",
      hint: "Additionne les mensualités puis retire le capital emprunté.",
      answer: "120",
      explanation:
        "12 × 260 = 3 120 € remboursés. 3 120 − 3 000 = 120 € de coût. Le TAEG, qui inclut frais et assurance exigée, permet de comparer avec une autre offre.",
    },
    quiz: [
      {
        id: "fp-credit-1",
        question:
          "Allonger la durée d’un crédit, à taux identique, a quel effet ?",
        options: [
          "Mensualité plus basse, coût total plus élevé",
          "Mensualité plus basse, coût total plus bas",
          "Aucun effet sur le coût total",
        ],
        answer: 0,
        explanation:
          "On paie des intérêts plus longtemps : la mensualité diminue, le coût total augmente.",
      },
      {
        id: "fp-credit-2",
        question:
          "Quel indicateur utiliser pour comparer deux offres de crédit ?",
        options: [
          "Le TAEG, qui inclut les frais et l’assurance exigée",
          "La mensualité seule",
          "Le montant de la première échéance",
        ],
        answer: 0,
        explanation:
          "Le TAEG regroupe le coût du crédit dans un taux annuel comparable d’une offre à l’autre.",
      },
    ],
    application:
      "Si ton projet doit emprunter, compare deux durées pour le même montant : note la mensualité et le coût total de chacune, puis vérifie que la mensualité tient dans ta trésorerie prévisionnelle.",
    idea: {
      title: "Comparateur d’offres en coût total",
      description:
        "Un outil qui traduit plusieurs offres de crédit en coût total et en mois d’engagement. Première validation : demander à des emprunteurs récents s’ils connaissaient le coût total de leur crédit.",
    },
    sources: [servicePublic, banqueDeFrance, financePourTous],
    version: "1.0.0",
    editorialStatus,
    flashcards: [
      {
        front: "Coût total d’un crédit ?",
        back: "Somme des mensualités − capital emprunté, plus frais et assurance exigée.",
      },
      {
        front: "Taux nominal ou TAEG ?",
        back: "Le nominal calcule les intérêts ; le TAEG inclut aussi frais et assurance exigée et sert à comparer.",
      },
    ],
  },
  {
    id: "fp-inflation-quotidien",
    title: "Inflation, pouvoir d’achat et salaire réel",
    domain: "Finance personnelle",
    level: 1,
    minutes: 15,
    summary:
      "Pourquoi le même salaire achète moins quand les prix montent, comment lire un taux d’inflation et quoi en tirer pour son budget.",
    skills: [
      "Indice des prix",
      "Pouvoir d’achat",
      "Salaire réel",
      "Inflation personnelle",
    ],
    prerequisites: ["fp-credit-taux"],
    sections: [
      {
        title: "Pourquoi apprendre ça ?",
        body: [
          "Une hausse de salaire de 2 % n’enrichit pas si les prix montent de 3 % : on peut gagner plus d’euros et vivre moins bien.",
          "Comprendre l’inflation aide à négocier, à ajuster son budget et à juger l’intérêt réel d’une épargne.",
        ],
      },
      {
        title: "Les mécanismes",
        body: [
          "L’inflation est la hausse générale des prix sur une période. En France, l’Insee la mesure avec l’indice des prix à la consommation, calculé sur un panier représentatif de dépenses.",
          "Le pouvoir d’achat est la quantité de biens et services qu’un revenu permet d’acheter. Salaire réel ≈ hausse du salaire − inflation ; plus précisément (1 + hausse) ÷ (1 + inflation) − 1.",
          "Une somme d’argent qui ne rapporte rien perd de la valeur réelle avec l’inflation. Une dette à taux fixe, à l’inverse, pèse un peu moins lourd en termes réels quand les prix et les revenus montent.",
        ],
      },
      {
        title: "Le vocabulaire professionnel",
        body: [
          "On distingue l’inflation sur un an (glissement annuel) de la moyenne annuelle. L’inflation sous-jacente exclut les prix les plus volatils, comme l’énergie.",
          "L’inflation personnelle peut différer de la moyenne : un ménage qui dépense beaucoup en carburant ou en loyer subit davantage certaines hausses que d’autres.",
        ],
      },
      {
        title: "Le piège de l’illusion monétaire",
        body: [
          "Raisonner en euros courants plutôt qu’en pouvoir d’achat fait croire à des gains qui n’existent pas. Comparer toujours une hausse de revenu ou un rendement à l’inflation de la même période.",
          "Réagir à l’inflation ne veut pas dire acheter vite par peur des hausses : cela consiste à revoir les postes qui augmentent le plus et à garder des marges dans le budget.",
          "Limites : les chiffres d’inflation se consultent sur le site de l’Insee à la date voulue. Les exemples de la leçon utilisent des taux fictifs.",
        ],
      },
    ],
    example: {
      title: "Exemple fictif · une hausse qui n’en est pas une",
      body: "Tom, personnage fictif, obtient une augmentation de 2 % sur un salaire de 2 000 € : 2 040 €. Sur la même année, les prix montent de 3 % (taux fictif). Pour garder son pouvoir d’achat, il lui aurait fallu 2 060 €. Son salaire réel baisse d’environ 1 % : ses 2 040 € achètent un peu moins que ses 2 000 € de l’an passé.",
    },
    exercise: {
      prompt:
        "Cas fictif : ton salaire augmente de 4 % pendant que les prix augmentent de 1 %. De combien, en pourcentage environ, ton salaire réel progresse-t-il ?",
      hint: "Fais la différence entre la hausse du salaire et l’inflation.",
      answer: "3",
      explanation:
        "Environ 4 − 1 = 3 %. Le calcul exact donne (1,04 ÷ 1,01) − 1 ≈ 2,97 %.",
    },
    quiz: [
      {
        id: "fp-inflation-1",
        question:
          "Ton salaire augmente de 2 % et les prix de 3 %. Que devient ton pouvoir d’achat ?",
        options: [
          "Il baisse d’environ 1 %",
          "Il augmente d’environ 2 %",
          "Il augmente d’environ 5 %",
        ],
        answer: 0,
        explanation:
          "Salaire réel ≈ 2 % − 3 % = −1 % : le revenu en euros monte, mais il achète moins.",
      },
      {
        id: "fp-inflation-2",
        question: "Qui mesure l’inflation officielle en France ?",
        options: [
          "L’Insee",
          "Chaque banque pour ses clients",
          "Les supermarchés",
        ],
        answer: 0,
        explanation:
          "L’Insee publie l’indice des prix à la consommation, calculé sur un panier représentatif.",
      },
    ],
    application:
      "Pour ton projet, regarde quels coûts risquent d’augmenter le plus (matières, énergie, loyers) et comment tes prix de vente suivraient. Une marge qui ne suit pas l’inflation se réduit sans bruit.",
    idea: {
      title: "Calculateur d’inflation personnelle",
      description:
        "Un outil qui pondère l’inflation par catégorie selon le budget réel d’un ménage. Première validation : comparer avec quelques personnes leur ressenti de hausse des prix et le chiffre officiel.",
    },
    sources: [inseeInflation, banqueDeFrance, financePourTous],
    version: "1.0.0",
    editorialStatus,
    flashcards: [
      {
        front: "Salaire réel approximatif ?",
        back: "Hausse du salaire − inflation. Exactement : (1 + hausse) ÷ (1 + inflation) − 1.",
      },
      {
        front: "Qu’est-ce que l’inflation personnelle ?",
        back: "L’inflation qui correspond à ses propres dépenses, différente de la moyenne si son panier diffère.",
      },
    ],
  },
];
