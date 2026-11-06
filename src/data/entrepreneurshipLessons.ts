import type { Lesson } from "./lessons";

/**
 * Parcours « Entrepreneuriat » de A à Z, après « Valider un problème ».
 * Pédagogique : exemples fictifs ; les seuils, taux et calendriers cités sont
 * datés (sources concordantes consultées en novembre 2026) et doivent être
 * vérifiés sur les sites officiels avant toute décision. Aucun conseil
 * juridique, fiscal ou social personnalisé.
 */
const editorialStatus =
  "Parcours pédagogique · exemples fictifs · seuils, taux et calendriers datés de novembre 2026, à vérifier sur les sites officiels · aucun conseil juridique ou fiscal personnalisé";

const bpiCreation = {
  title: "Bpifrance Création · guides du créateur",
  url: "https://bpifrance-creation.fr/",
};
const entreprendre = {
  title: "Entreprendre.service-public.fr · fiches officielles",
  url: "https://entreprendre.service-public.gouv.fr/",
};
const urssafMicro = {
  title: "Urssaf · espace micro-entrepreneur",
  url: "https://www.autoentrepreneur.urssaf.fr/",
};
const guichetUnique = {
  title: "Guichet unique des formalités d’entreprises (INPI)",
  url: "https://formalites.entreprises.gouv.fr/",
};
const impotsPro = {
  title: "impots.gouv.fr · espace professionnel",
  url: "https://www.impots.gouv.fr/professionnel",
};

export const entrepreneurshipLessons: Lesson[] = [
  {
    id: "ent-modele-economique",
    title: "De l’idée au modèle économique",
    domain: "Entrepreneuriat",
    level: 1,
    minutes: 18,
    summary:
      "Un problème validé ne fait pas encore une entreprise. Décrire qui paie, pour quoi, par quel canal et avec quels coûts : c’est le modèle économique.",
    skills: [
      "Proposition de valeur",
      "Modèle de revenus",
      "Économie unitaire",
      "Produit minimum viable",
    ],
    prerequisites: ["validation-client"],
    sections: [
      {
        title: "Pourquoi apprendre ça ?",
        body: [
          "Beaucoup de projets échouent avec un bon produit : personne ne paie assez, trop tard ou trop cher à convaincre. Le modèle économique répond à une question simple : comment l’activité crée de la valeur pour un client et en garde une partie pour vivre.",
          "Le décrire sur une page avant de dépenser permet de repérer l’hypothèse la plus fragile et de la tester en premier.",
        ],
      },
      {
        title: "Les neuf blocs d’un modèle",
        body: [
          "Le Business Model Canvas, popularisé par Alexander Osterwalder, découpe un modèle en neuf blocs. Côté client : les segments de clients, la proposition de valeur, les canaux (comment le client découvre, achète et reçoit), la relation client et les sources de revenus.",
          "Côté entreprise : les ressources clés (compétences, matériel, données), les activités clés, les partenaires clés et la structure de coûts. On commence toujours par un segment précis et sa proposition de valeur ; le reste en découle.",
          "Les modèles de revenus les plus courants : vente à l’unité, abonnement, commission sur une transaction, licence, freemium (une version gratuite et une version payante), publicité. Un même produit peut changer de modèle : le choix modifie la trésorerie, la fidélité et le travail commercial.",
        ],
      },
      {
        title: "L’économie d’un client",
        body: [
          "L’économie unitaire regarde un seul client ou une seule vente. Le coût d’acquisition client (CAC) est ce qu’il faut dépenser en moyenne pour obtenir un client : publicité, temps commercial, salons, remises de bienvenue.",
          "La valeur vie client (souvent notée LTV) estime la marge totale qu’un client laisse pendant toute sa relation avec l’entreprise : marge par achat × nombre d’achats attendus. Un modèle sain dégage une valeur vie client nettement supérieure au coût d’acquisition, et récupère ce coût assez vite pour ne pas manquer de trésorerie.",
          "Le produit minimum viable (MVP) est la plus petite version qui permet d’apprendre si les clients utilisent et paient. Ce peut être un service fait à la main, une page de précommande ou un prototype : l’important est la mesure, pas la finition.",
        ],
      },
      {
        title: "Le point de vigilance",
        body: [
          "Un canvas rempli n’est pas une preuve : chaque case est une hypothèse. Note à côté de chacune ce qui la confirme déjà (entretiens, ventes, chiffres) et ce qui reste supposé.",
          "Attention aux moyennes : un CAC calculé sur les premiers clients, souvent venus du réseau personnel, sous-estime le coût des suivants. Et une valeur vie client calculée sur des années que l’on n’a pas encore vécues reste une projection.",
        ],
      },
    ],
    example: {
      title: "Exemple fictif · un service de repas pour crèches",
      body: "Une cuisinière veut livrer des repas aux crèches privées. Segment : directrices de crèches de 20 à 40 places. Proposition de valeur : des menus équilibrés conformes, livrés chaque matin, sans gérer de cuisine. Revenus : abonnement mensuel par enfant. Coûts : matières, livraison, cuisine louée. En entretien, les directrices citent la conformité réglementaire avant le prix : la proposition de valeur met donc en avant la traçabilité. Le MVP : trois crèches pilotes pendant un mois, préparées dans une cuisine louée à l’heure, avant tout investissement.",
    },
    exercise: {
      prompt:
        "Une application coûte 300 € de publicité pour obtenir 10 clients. Chaque client paie 12 € par mois, avec 8 € de marge, et reste en moyenne 15 mois. Calcule le coût d’acquisition client et la valeur vie client. Le modèle tient-il ?",
      hint: "Coût d’acquisition = dépense ÷ clients obtenus. Valeur vie client = marge mensuelle × durée moyenne.",
      answer:
        "Coût d’acquisition = 300 ÷ 10 = 30 €. Valeur vie client = 8 × 15 = 120 €. La valeur vie client vaut quatre fois le coût d’acquisition : le modèle est prometteur, et la dépense est récupérée en un peu moins de quatre mois.",
      explanation:
        "Le rapport entre valeur vie client et coût d’acquisition dit si acquérir un client rapporte. Le délai de récupération dit si la trésorerie supportera la croissance. Les deux reposent sur des hypothèses (durée de 15 mois) à vérifier dans la durée.",
    },
    quiz: [
      {
        id: "ent-modele-1",
        question:
          "Par quel bloc faut-il commencer pour décrire un modèle économique ?",
        options: [
          "La structure de coûts, pour savoir combien investir.",
          "Un segment de clients précis et la proposition de valeur qui lui répond.",
          "Le choix du statut juridique.",
        ],
        answer: 1,
        explanation:
          "Tout le modèle découle de « pour qui » et « quelle valeur » : canaux, revenus et coûts se décident ensuite.",
      },
      {
        id: "ent-modele-2",
        question:
          "Un client coûte 50 € à acquérir et laisse 40 € de marge sur toute sa relation. Que conclure ?",
        options: [
          "Chaque nouveau client fait perdre de l’argent : il faut revoir l’acquisition, le prix ou la fidélisation.",
          "Le modèle est rentable car le chiffre d’affaires augmente.",
          "Il suffit d’acquérir davantage de clients pour compenser.",
        ],
        answer: 0,
        explanation:
          "Quand la valeur vie client est inférieure au coût d’acquisition, croître accélère les pertes.",
      },
    ],
    application:
      "Remplis les neuf blocs pour ton projet, puis souligne l’hypothèse la plus fragile et le test qui la confirmerait ou la contredirait.",
    idea: {
      title: "Décrire le modèle économique de mon projet",
      description:
        "Segment, proposition de valeur, revenus, coûts : un canvas d’une page et l’hypothèse à tester en premier.",
    },
    sources: [
      bpiCreation,
      {
        title: "Strategyzer · Business Model Canvas (A. Osterwalder)",
        url: "https://www.strategyzer.com/library/the-business-model-canvas",
      },
    ],
    version: "1.0.0",
    editorialStatus,
    flashcards: [
      {
        front: "Coût d’acquisition client (CAC)",
        back: "Dépense moyenne nécessaire pour obtenir un client.",
      },
      {
        front: "Valeur vie client",
        back: "Marge totale laissée par un client pendant toute sa relation avec l’entreprise.",
      },
      {
        front: "Produit minimum viable",
        back: "Plus petite version qui permet d’apprendre si les clients utilisent et paient.",
      },
    ],
  },
  {
    id: "ent-trouver-clients",
    title: "Trouver ses premiers clients",
    domain: "Entrepreneuriat",
    level: 1,
    minutes: 18,
    summary:
      "Les premiers clients ne viennent pas seuls. Choisir un canal, construire un message clair et mesurer chaque étape, de l’inconnu au client fidèle.",
    skills: [
      "Canaux d’acquisition",
      "Message et positionnement",
      "Entonnoir de conversion",
    ],
    prerequisites: ["ent-modele-economique"],
    sections: [
      {
        title: "Pourquoi apprendre ça ?",
        body: [
          "« Si le produit est bon, les clients viendront » est l’une des croyances les plus coûteuses. Un bon produit que personne ne connaît ne se vend pas.",
          "Les dix premiers clients s’obtiennent rarement par de la publicité : ils viennent d’efforts directs, d’un réseau, d’une communauté. Ils apprennent aussi beaucoup sur l’offre.",
        ],
      },
      {
        title: "Les mécanismes",
        body: [
          "Un canal d’acquisition est le chemin par lequel un client te découvre : prospection directe (appel, message, visite), recommandation, contenu et référencement naturel, réseaux sociaux, publicité payante, partenariats, salons, plateformes et places de marché.",
          "Au début, mieux vaut un ou deux canaux bien travaillés que dix essayés à moitié. Choisis-les là où ton segment passe déjà du temps : une directrice de crèche ne se trouve pas au même endroit qu’un développeur.",
          "Le positionnement résume en une phrase pour qui est l’offre, quel problème elle résout et ce qui la distingue des alternatives. Exemple : « Pour les artisans du bâtiment qui perdent des heures en devis, un modèle de devis prêt en dix minutes, sans logiciel à installer. »",
        ],
      },
      {
        title: "Mesurer l’entonnoir",
        body: [
          "L’entonnoir de conversion suit les étapes d’un prospect : découvre l’offre, s’y intéresse (visite, demande d’information), essaie (rendez-vous, devis, essai gratuit), achète, revient ou recommande.",
          "Le taux de conversion d’une étape = nombre de personnes à l’étape suivante ÷ nombre à l’étape actuelle. Mesurer chaque étape montre où le parcours casse : beaucoup de visites mais peu de demandes signale un message flou ; beaucoup de devis mais peu de signatures, un prix ou une confiance à travailler.",
          "La fidélisation coûte souvent moins cher que l’acquisition : un client satisfait rachète et recommande. Un suivi après la vente, une demande d’avis et une offre de réachat sont des actions simples.",
        ],
      },
      {
        title: "Le point de vigilance",
        body: [
          "La prospection est encadrée. Le démarchage commercial doit respecter le droit des données personnelles (RGPD) et, par téléphone vers les particuliers, les règles sur l’opposition au démarchage (liste Bloctel). Ne collecte que les données utiles et laisse toujours un moyen simple de refuser.",
          "Méfie-toi des métriques flatteuses : abonnés, mentions « j’aime » et visites ne paient pas les factures. Suis les étapes qui mènent à l’achat.",
        ],
      },
    ],
    example: {
      title: "Exemple fictif · une photographe culinaire",
      body: "Une photographe vise les restaurants indépendants qui publient de mauvaises photos de leurs plats. Elle choisit un canal : la visite directe, menu en main, dans son quartier. Message : « Des photos de vos plats qui donnent faim, prêtes pour vos réseaux en 48 heures. » Sur 40 restaurants visités, 12 acceptent un rendez-vous, 5 demandent un devis, 3 signent. L’étape la plus faible est le passage du rendez-vous au devis : elle prépare un exemple réalisé sur un plat du restaurant pendant le rendez-vous.",
    },
    exercise: {
      prompt:
        "Sur 200 visiteurs d’une page, 20 demandent un essai, 8 l’utilisent vraiment et 2 achètent. Calcule le taux de conversion de chaque étape et indique où agir en premier.",
      hint: "Divise chaque étape par la précédente : 20 ÷ 200, 8 ÷ 20, 2 ÷ 8.",
      answer:
        "Visite → essai : 10 %. Demande → utilisation réelle : 40 %. Utilisation → achat : 25 %. Le taux global est de 1 %. Le passage visite → essai est le plus faible : clarifier le message et la promesse de la page est l’action prioritaire, avant d’acheter plus de trafic.",
      explanation:
        "Augmenter le trafic avec une page qui convertit mal multiplie surtout la dépense. On corrige d’abord l’étape qui perd le plus.",
    },
    quiz: [
      {
        id: "ent-clients-1",
        question:
          "Au lancement, quelle approche est généralement la plus efficace pour obtenir les premiers clients ?",
        options: [
          "Être présent sur tous les canaux en même temps.",
          "Choisir un ou deux canaux là où le segment se trouve déjà, et les mesurer.",
          "Attendre que le bouche-à-oreille fasse son œuvre.",
        ],
        answer: 1,
        explanation:
          "Concentrer l’effort permet d’apprendre vite ce qui marche et de ne pas disperser un temps limité.",
      },
      {
        id: "ent-clients-2",
        question:
          "Beaucoup de visites, très peu de demandes de devis. Que suggère cet entonnoir ?",
        options: [
          "Le prix est trop élevé.",
          "Le message ou la promesse de la page n’est pas assez clair pour ce public.",
          "Il faut acheter davantage de publicité.",
        ],
        answer: 1,
        explanation:
          "Le prix n’est souvent vu qu’au devis. Une page visitée mais sans demande signale d’abord un message qui ne parle pas au visiteur.",
      },
    ],
    application:
      "Écris le positionnement de ton offre en une phrase, choisis un canal et fixe trois chiffres à suivre pendant un mois.",
    idea: {
      title: "Plan d’acquisition des dix premiers clients",
      description:
        "Un canal, un message, un entonnoir mesuré : qui contacter cette semaine et quoi suivre.",
    },
    sources: [
      bpiCreation,
      {
        title: "CNIL · prospection commerciale et RGPD",
        url: "https://www.cnil.fr/fr/la-prospection-commerciale",
      },
    ],
    version: "1.0.0",
    editorialStatus,
    flashcards: [
      {
        front: "Canal d’acquisition",
        back: "Chemin par lequel un client découvre l’offre : prospection, recommandation, contenu, publicité…",
      },
      {
        front: "Taux de conversion",
        back: "Part des personnes qui passent d’une étape de l’entonnoir à la suivante.",
      },
      {
        front: "Positionnement",
        back: "Pour qui, quel problème, quelle différence : l’offre résumée en une phrase.",
      },
    ],
  },
  {
    id: "ent-fixer-prix",
    title: "Fixer son prix sans se tromper",
    domain: "Entrepreneuriat",
    level: 1,
    minutes: 18,
    summary:
      "Un prix se construit à partir de trois repères : ce que coûte l’offre, ce que valent les alternatives et ce que le client est prêt à payer.",
    skills: ["Coût de revient", "Prix HT et TTC", "Valeur perçue"],
    prerequisites: ["ent-modele-economique", "seuil-rentabilite"],
    sections: [
      {
        title: "Pourquoi apprendre ça ?",
        body: [
          "Le prix est le levier le plus puissant du résultat : quelques pour cent de plus ou de moins changent la marge bien davantage que le volume. Les créateurs se sous-évaluent souvent par peur de perdre le client.",
          "Un prix trop bas épuise : il faut vendre beaucoup plus pour couvrir les mêmes charges fixes, et il est difficile à remonter ensuite.",
        ],
      },
      {
        title: "Trois repères",
        body: [
          "Le plancher, c’est le coût. Le coût de revient d’une unité additionne les coûts variables (matière, sous-traitance, commission) et une part des charges fixes. Pour un service, le temps compte : estime les heures vendables dans l’année, une fois retirés prospection, administration, congés et formation.",
          "Le repère du marché, ce sont les alternatives : concurrents, mais aussi « faire soi-même » ou « ne rien faire ». Le plafond, c’est la valeur perçue : ce que l’offre fait gagner ou éviter au client (temps, argent, risque).",
          "Prix hors taxes (HT) et toutes taxes comprises (TTC) : TTC = HT × (1 + taux de TVA). Entre professionnels, on raisonne en HT, la TVA étant en général récupérable ; un particulier compare des prix TTC. Une entreprise en franchise de TVA facture sans TVA.",
        ],
      },
      {
        title: "Calculer un tarif de service",
        body: [
          "Pour un indépendant : revenu souhaité + charges de l’activité + cotisations et impôts estimés, le tout divisé par le nombre d’heures réellement facturables. Un indépendant qui vise 1 500 heures facturables par an en travaillant 1 600 heures se trompe : prospection et gestion occupent une part importante du temps.",
          "Une remise se paie sur la marge, pas sur le prix. Avec un prix de 100 € et un coût de 60 €, une remise de 10 % fait passer la marge de 40 € à 30 € : elle baisse de 25 %. Pour garder la même marge totale, il faudrait vendre un tiers de plus.",
          "Tester un prix est possible : proposer deux formules, annoncer le prix tôt dans les entretiens et observer les objections, augmenter progressivement pour les nouveaux clients.",
        ],
      },
      {
        title: "Le point de vigilance",
        body: [
          "Des règles encadrent le prix : obligation d’affichage pour les consommateurs, interdiction de la revente à perte de produits en l’état, et règles sur les annonces de réduction (le prix de référence doit être réel). Vérifie les règles propres à ton secteur.",
          "Copier le prix du concurrent sans connaître ses coûts revient à copier ses erreurs. Il peut avoir une autre structure de coûts, un autre volume, ou perdre de l’argent.",
        ],
      },
    ],
    example: {
      title: "Exemple fictif · une graphiste indépendante",
      body: "Une graphiste vise 30 000 € de revenu avant impôt. Elle estime 8 000 € de frais (logiciels, matériel, comptable, assurance) et environ 9 000 € de cotisations sociales selon son régime. Il lui faut donc 47 000 € de chiffre d’affaires. Sur 1 600 heures de travail, elle estime pouvoir en facturer 1 000. Son tarif plancher est de 47 € de l’heure. Les agences de sa ville facturent 65 à 90 € : elle se positionne à 60 € et prévoit de remonter à 70 € pour les nouveaux clients après six mois.",
    },
    exercise: {
      prompt:
        "Un produit coûte 24 € à fabriquer et se vend 40 € HT. Le vendeur envisage une remise de 15 %. Calcule la marge par unité avant et après remise, puis le nombre de ventes nécessaires pour garder la même marge totale qu’avec 100 ventes.",
      hint: "Prix après remise = 40 × 0,85. Marge = prix − coût.",
      answer:
        "Marge avant remise : 40 − 24 = 16 €. Prix remisé : 34 €, marge : 10 €. Avec 100 ventes, la marge totale était de 1 600 € ; il faut désormais 160 ventes, soit 60 % de plus, pour la retrouver.",
      explanation:
        "Une remise de 15 % sur le prix fait ici baisser la marge de 37,5 %. La remise est un outil, pas un réflexe.",
    },
    quiz: [
      {
        id: "ent-prix-1",
        question:
          "Un indépendant calcule son tarif horaire. Que doit-il diviser par ses heures facturables ?",
        options: [
          "Uniquement le revenu qu’il souhaite se verser.",
          "Son revenu souhaité, ses charges d’activité et ses cotisations et impôts estimés.",
          "Le tarif moyen de ses concurrents.",
        ],
        answer: 1,
        explanation:
          "Le chiffre d’affaires doit couvrir le revenu, les charges et les prélèvements obligatoires, répartis sur les heures réellement vendues.",
      },
      {
        id: "ent-prix-2",
        question:
          "Prix 100 €, coût 70 €. Une remise de 10 % réduit la marge de combien ?",
        options: ["10 %", "Environ 33 %", "70 %"],
        answer: 1,
        explanation:
          "La marge passe de 30 € à 20 € : 10 € de moins sur 30, soit une baisse d’un tiers.",
      },
    ],
    application:
      "Calcule ton prix plancher, note le prix de trois alternatives et écris ce que ton offre fait gagner au client. Ton prix doit se situer entre le plancher et cette valeur.",
    idea: {
      title: "Construire la grille de prix de mon offre",
      description:
        "Coût de revient, alternatives, valeur pour le client : un prix justifié et une formule à tester.",
    },
    sources: [
      bpiCreation,
      {
        title: "DGCCRF · information sur les prix et annonces de réduction",
        url: "https://www.economie.gouv.fr/dgccrf",
      },
    ],
    version: "1.0.0",
    editorialStatus,
    flashcards: [
      {
        front: "Coût de revient",
        back: "Coûts variables d’une unité plus sa part des charges fixes.",
      },
      {
        front: "Prix TTC",
        back: "Prix HT × (1 + taux de TVA). Le particulier compare des prix TTC.",
      },
      {
        front: "Effet d’une remise",
        back: "Elle se paie sur la marge : 10 % de remise peut réduire la marge de bien plus de 10 %.",
      },
    ],
  },
  {
    id: "ent-statut-juridique",
    title: "Choisir son statut : EI, micro, EURL, SASU…",
    domain: "Entrepreneuriat",
    level: 1,
    minutes: 22,
    summary:
      "Entreprise individuelle ou société, seul ou à plusieurs, impôt sur le revenu ou sur les sociétés : comparer les statuts selon le projet, pas selon la mode.",
    skills: [
      "Entreprise individuelle et société",
      "Protection sociale du dirigeant",
      "Impôt sur le revenu ou sur les sociétés",
    ],
    prerequisites: ["validation-client"],
    sections: [
      {
        title: "Pourquoi apprendre ça ?",
        body: [
          "Le statut juridique fixe qui est responsable des dettes, comment le dirigeant est protégé socialement, comment les bénéfices sont imposés et ce qu’il est possible de faire à plusieurs. Il n’existe pas de meilleur statut dans l’absolu : il existe un statut adapté à un projet, à un moment.",
          "Bonne nouvelle : on peut en changer plus tard. Commencer simple pour tester une activité, puis créer une société quand elle grandit, est un parcours fréquent.",
        ],
      },
      {
        title: "Les grandes familles",
        body: [
          "L’entreprise individuelle (EI) : l’entrepreneur exerce en son nom, sans créer de personne morale. Depuis le 15 mai 2022, son patrimoine personnel est en principe séparé de son patrimoine professionnel : les créanciers professionnels ne peuvent saisir que les biens utiles à l’activité, sauf exceptions (renonciation écrite, fraude, certaines dettes fiscales et sociales). Les bénéfices sont soumis à l’impôt sur le revenu, avec une option possible pour l’impôt sur les sociétés.",
          "La micro-entreprise n’est pas une forme juridique : c’est un régime simplifié, fiscal et social, de l’entreprise individuelle. Cotisations calculées sur le chiffre d’affaires encaissé, comptabilité allégée, mais impossibilité de déduire les charges réelles.",
          "Les sociétés créent une personne morale distincte, avec des statuts. À un associé : l’EURL (société à responsabilité limitée unipersonnelle) ou la SASU (société par actions simplifiée unipersonnelle). À plusieurs : la SARL ou la SAS. La responsabilité des associés est limitée à leurs apports, et le capital minimum est libre (un euro est possible, mais un capital trop faible inspire peu confiance).",
        ],
      },
      {
        title: "Ce qui change vraiment",
        body: [
          "La protection sociale du dirigeant. Le gérant majoritaire d’EURL ou de SARL et l’entrepreneur individuel sont des travailleurs indépendants (TNS) : cotisations proportionnellement plus faibles, protection plus réduite. Le président de SASU ou de SAS est assimilé salarié : il cotise au régime général (sans assurance chômage), ce qui coûte plus cher pour une meilleure couverture, notamment en retraite et en prévoyance.",
          "La fiscalité. À l’impôt sur le revenu, le bénéfice s’ajoute aux revenus du foyer, qu’il soit prélevé ou non. À l’impôt sur les sociétés, la société paie l’impôt sur son bénéfice ; le dirigeant est imposé sur la rémunération qu’il se verse et, s’il y en a, sur les dividendes. Le taux de l’impôt sur les sociétés comporte un taux réduit pour les PME sur une première tranche de bénéfice : vérifie les montants en vigueur.",
          "La rémunération. En SAS, les dividendes ne supportent pas de cotisations sociales (ils subissent prélèvements sociaux et impôt), ce qui pousse certains dirigeants à combiner petit salaire et dividendes, au prix d’une moindre protection. En EURL ou SARL, une partie des dividendes du gérant majoritaire peut être soumise aux cotisations sociales. Ces arbitrages se calculent au cas par cas, avec un expert-comptable.",
        ],
      },
      {
        title: "Le point de vigilance",
        body: [
          "Les critères qui comptent : seul ou à plusieurs, chiffre d’affaires et charges attendus, besoin d’investissement ou de levée de fonds (la SAS est plus souple pour accueillir des investisseurs), protection sociale recherchée, crédibilité vis-à-vis des clients, coût et temps de gestion (une société impose comptabilité complète et formalités annuelles).",
          "Les comparatifs en ligne simplifient beaucoup. Avant de signer des statuts, utilise les simulateurs officiels de l’Urssaf et fais relire ton choix par un professionnel (expert-comptable, avocat, chambre consulaire).",
        ],
      },
    ],
    example: {
      title: "Exemple fictif · trois profils, trois choix",
      body: "Sami teste des cours de guitare le soir, à côté de son emploi : peu de charges, chiffre d’affaires modeste. La micro-entreprise lui permet de démarrer en quelques jours. Léa ouvre un atelier de menuiserie avec un local, des machines et des achats importants : ses charges réelles sont élevées, une EURL au régime réel lui permet de les déduire. Ines et Marc lancent une application et prévoient d’accueillir des investisseurs : une SAS, avec des statuts organisant l’entrée de nouveaux associés.",
    },
    exercise: {
      prompt:
        "Une consultante prévoit 60 000 € de chiffre d’affaires et seulement 3 000 € de frais réels. Un artisan prévoit 70 000 € de chiffre d’affaires et 45 000 € d’achats et de frais. Pour lequel le régime micro, qui ne déduit pas les charges réelles, est-il le plus risqué ?",
      hint: "En micro, l’impôt se calcule après un abattement forfaitaire, et les cotisations sur le chiffre d’affaires, quelles que soient les charges réelles.",
      answer:
        "Pour l’artisan : ses charges réelles représentent près des deux tiers de son chiffre d’affaires. En micro, il paierait des cotisations sur 70 000 € alors que son bénéfice réel n’est que d’environ 25 000 €. Pour la consultante, aux charges faibles, le régime micro reste simple et souvent adapté, à condition de rester sous le plafond.",
      explanation:
        "Plus les charges réelles sont élevées, plus un régime qui les ignore devient coûteux. Le régime réel, en entreprise individuelle ou en société, permet de les déduire.",
    },
    quiz: [
      {
        id: "ent-statut-1",
        question: "Qu’est-ce que la micro-entreprise ?",
        options: [
          "Une forme de société à capital réduit.",
          "Un régime fiscal et social simplifié de l’entreprise individuelle.",
          "Un statut réservé aux étudiants.",
        ],
        answer: 1,
        explanation:
          "La micro-entreprise est une entreprise individuelle qui bénéficie d’un régime simplifié de calcul des cotisations et de l’impôt.",
      },
      {
        id: "ent-statut-2",
        question:
          "Quelle différence principale sépare le président de SASU du gérant majoritaire d’EURL ?",
        options: [
          "Le président de SASU est assimilé salarié ; le gérant majoritaire d’EURL est travailleur indépendant.",
          "Seul le gérant d’EURL peut se verser une rémunération.",
          "Le président de SASU est responsable des dettes sur ses biens personnels.",
        ],
        answer: 0,
        explanation:
          "Le régime social diffère : régime général pour le président de SAS ou SASU, régime des indépendants pour le gérant majoritaire.",
      },
    ],
    application:
      "Note tes réponses à six critères (seul ou à plusieurs, charges, investisseurs, protection sociale, crédibilité, temps de gestion), puis compare deux statuts avec le simulateur officiel de l’Urssaf.",
    idea: {
      title: "Choisir le statut de mon projet",
      description:
        "Six critères notés, deux statuts comparés et les questions à poser à un expert-comptable.",
    },
    sources: [
      entreprendre,
      bpiCreation,
      {
        title: "Urssaf · simulateurs officiels (mon-entreprise.urssaf.fr)",
        url: "https://mon-entreprise.urssaf.fr/",
      },
    ],
    version: "1.0.0",
    editorialStatus,
    flashcards: [
      {
        front: "Entreprise individuelle depuis 2022",
        back: "Patrimoine personnel séparé du professionnel par défaut, sauf exceptions.",
      },
      {
        front: "TNS ou assimilé salarié",
        back: "Gérant majoritaire et EI : indépendants. Président de SAS ou SASU : assimilé salarié, mieux couvert, plus coûteux.",
      },
      {
        front: "IR ou IS",
        back: "À l’IR, le bénéfice s’ajoute aux revenus du foyer. À l’IS, la société paie l’impôt ; le dirigeant est imposé sur ce qu’il perçoit.",
      },
    ],
  },
  {
    id: "ent-creer-etapes",
    title: "Créer son entreprise, étape par étape",
    domain: "Entrepreneuriat",
    level: 1,
    minutes: 18,
    summary:
      "De l’étude de marché à l’immatriculation : l’ordre des étapes, les démarches en ligne et ce qu’il faut prévoir avant d’encaisser le premier euro.",
    skills: [
      "Étude de marché et prévisionnel",
      "Formalités de création",
      "Premières obligations",
    ],
    prerequisites: ["ent-statut-juridique"],
    sections: [
      {
        title: "Pourquoi apprendre ça ?",
        body: [
          "Créer une entreprise est devenu rapide en ligne, mais l’ordre compte : un nom déjà déposé, une activité réglementée oubliée ou une assurance manquante peuvent coûter cher après coup.",
          "Connaître les étapes évite aussi de payer des services pour des démarches que l’on peut faire soi-même.",
        ],
      },
      {
        title: "Avant les formalités",
        body: [
          "Étude de marché : taille et évolution du marché, clients, concurrents, prix pratiqués, réglementation. Les entretiens de la leçon « Valider un problème » en sont le cœur ; les données publiques (Insee, fédérations professionnelles, CCI) les complètent.",
          "Prévisionnel financier : chiffre d’affaires réaliste mois par mois, charges, investissements, besoin de financement et plan de trésorerie sur au moins un an. Il sert à décider, et il est demandé par les banques.",
          "Vérifications : l’activité est-elle réglementée (diplôme, qualification, carte professionnelle, assurance obligatoire) ? Le nom et la marque sont-ils libres ? Une recherche d’antériorité sur la base de l’INPI et une recherche de noms de domaine évitent les conflits. Choisir aussi l’adresse : domicile (sous conditions), local ou société de domiciliation.",
        ],
      },
      {
        title: "Les formalités",
        body: [
          "Pour une société : rédiger les statuts, déposer le capital sur un compte bloqué (banque ou notaire), publier une annonce légale de constitution, puis déclarer la création.",
          "Depuis le 1er janvier 2023, toutes les formalités de création, modification et cessation passent par le guichet unique en ligne opéré par l’INPI, y compris pour un micro-entrepreneur. La déclaration alimente le Registre national des entreprises (RNE) ; l’entreprise reçoit son numéro SIREN (l’entreprise) et SIRET (chaque établissement), puis un code APE qui décrit l’activité.",
          "Après l’immatriculation : ouvrir un compte bancaire professionnel (obligatoire pour une société ; pour un micro-entrepreneur, un compte dédié devient obligatoire au-delà d’un certain chiffre d’affaires), souscrire les assurances utiles (responsabilité civile professionnelle, obligatoire dans certains métiers), mettre en place la facturation et le suivi comptable, et demander les aides éventuelles dans les délais.",
        ],
      },
      {
        title: "Le point de vigilance",
        body: [
          "Les aides ont des délais et des conditions. L’ACRE (aide à la création ou à la reprise d’entreprise) a été réformée en 2026 : une demande à l’Urssaf est désormais obligatoire, et pour les micro-entrepreneurs, l’exonération de cotisations passe de 50 % à 25 % à partir du 1er juillet 2026 selon les sources consultées. Vérifie les conditions et la date de référence avant de créer.",
          "Méfie-toi des courriers d’apparence officielle reçus après une immatriculation, qui réclament de l’argent pour une inscription « obligatoire » dans un annuaire ou un registre. Les démarches officielles se font sur les sites en .gouv.fr ou auprès des organismes connus.",
        ],
      },
    ],
    example: {
      title: "Exemple fictif · Nora ouvre une boutique de vélos d’occasion",
      body: "Nora interroge vingt cyclistes et trois ateliers concurrents, puis bâtit un prévisionnel sur douze mois : elle découvre qu’il lui faut 15 000 € pour le stock et l’outillage. Elle vérifie que le nom choisi n’est pas déposé, crée une SARL avec son associé, dépose le capital, publie l’annonce légale et déclare la société sur le guichet unique. Une fois le SIRET reçu, elle ouvre le compte professionnel, assure le local et le stock, et prépare ses modèles de factures avant la première vente.",
    },
    exercise: {
      prompt:
        "Remets dans l’ordre : déclaration sur le guichet unique ; recherche d’antériorité du nom ; ouverture du compte professionnel avec le SIRET ; étude de marché et prévisionnel ; choix du statut.",
      hint: "On valide le projet avant de choisir la forme, et on vérifie le nom avant de le déclarer.",
      answer:
        "1. Étude de marché et prévisionnel. 2. Choix du statut. 3. Recherche d’antériorité du nom. 4. Déclaration sur le guichet unique. 5. Ouverture ou finalisation du compte professionnel avec le SIRET.",
      explanation:
        "Pour une société, le dépôt du capital précède la déclaration : la banque fournit une attestation de dépôt jointe au dossier.",
    },
    quiz: [
      {
        id: "ent-creer-1",
        question:
          "Depuis 2023, où se déclare la création d’une entreprise, micro-entreprise comprise ?",
        options: [
          "Uniquement à la mairie de la commune.",
          "Sur le guichet unique en ligne des formalités d’entreprises, opéré par l’INPI.",
          "Auprès de sa banque, qui transmet le dossier.",
        ],
        answer: 1,
        explanation:
          "Le guichet unique remplace les anciens centres de formalités ; il alimente le Registre national des entreprises.",
      },
      {
        id: "ent-creer-2",
        question:
          "Après une immatriculation, un courrier réclame 290 € pour une inscription « obligatoire » dans un registre privé. Que faire ?",
        options: [
          "Payer rapidement pour éviter une amende.",
          "Vérifier l’émetteur : les démarches officielles passent par des sites publics, ce type de courrier est souvent une sollicitation commerciale trompeuse.",
          "Le transmettre à sa banque pour paiement automatique.",
        ],
        answer: 1,
        explanation:
          "Ces courriers imitent les documents officiels. Aucun paiement ne doit être fait sans vérifier l’organisme.",
      },
    ],
    application:
      "Établis ta liste de création dans l’ordre, avec pour chaque étape la source officielle à consulter et une date cible.",
    idea: {
      title: "Ma liste de création, dans l’ordre",
      description:
        "Étude, prévisionnel, statut, nom, formalités, compte, assurances : chaque étape datée et sourcée.",
    },
    sources: [guichetUnique, entreprendre, bpiCreation],
    version: "1.0.0",
    editorialStatus,
    flashcards: [
      {
        front: "Guichet unique",
        back: "Site officiel (INPI) où se font toutes les formalités d’entreprise depuis 2023.",
      },
      {
        front: "SIREN et SIRET",
        back: "SIREN identifie l’entreprise ; SIRET identifie chacun de ses établissements.",
      },
      {
        front: "Prévisionnel",
        back: "Chiffre d’affaires, charges, investissements et trésorerie estimés sur au moins un an.",
      },
    ],
  },
  {
    id: "ent-micro-entreprise",
    title: "La micro-entreprise de A à Z",
    domain: "Entrepreneuriat",
    level: 1,
    minutes: 22,
    summary:
      "Le régime le plus simple pour démarrer seul : plafonds, cotisations sur le chiffre d’affaires, impôt, TVA, obligations et limites à connaître.",
    skills: [
      "Plafonds et cotisations",
      "Impôt et franchise de TVA",
      "Obligations du micro-entrepreneur",
    ],
    prerequisites: ["ent-statut-juridique"],
    sections: [
      {
        title: "Pourquoi apprendre ça ?",
        body: [
          "La micro-entreprise permet de tester une activité vite et à faible coût : création en ligne, cotisations seulement si l’on encaisse, comptabilité réduite. C’est aussi un régime mal compris, dont les limites surprennent ceux qui grandissent.",
          "Rappel : ce n’est pas une forme juridique, mais le régime simplifié de l’entreprise individuelle.",
        ],
      },
      {
        title: "Plafonds et cotisations",
        body: [
          "Le régime est réservé aux entreprises dont le chiffre d’affaires annuel reste sous un plafond. Selon les sources concordantes consultées pour 2026, il est de 203 100 € pour la vente de marchandises et l’hébergement, et de 83 600 € pour les prestations de services et les activités libérales ; ces plafonds sont révisés tous les trois ans. Un dépassement isolé ne fait pas sortir du régime : la sortie intervient après deux années consécutives au-dessus.",
          "Les cotisations sociales sont un pourcentage du chiffre d’affaires encaissé, déclaré chaque mois ou chaque trimestre sur le site de l’Urssaf. Pas de chiffre d’affaires, pas de cotisations ; mais une déclaration à zéro reste obligatoire. Pour 2026, les sources citent environ 12,3 % pour la vente de marchandises et 21,2 % pour les prestations de services commerciales et artisanales ; le taux des activités libérales dépend de la caisse et a été relevé récemment : vérifie le taux exact de ton activité sur le site de l’Urssaf.",
          "Les cotisations ouvrent des droits (retraite, santé, indemnités journalières sous conditions) proportionnels au chiffre d’affaires déclaré : un chiffre d’affaires faible ouvre peu de droits.",
        ],
      },
      {
        title: "Impôt et TVA",
        body: [
          "L’impôt sur le revenu se calcule par défaut sur le chiffre d’affaires diminué d’un abattement forfaitaire censé représenter les charges : 71 % pour la vente, 50 % pour les autres activités commerciales et artisanales, 34 % pour les activités libérales. Le résultat s’ajoute aux autres revenus du foyer. Sur option, et sous condition de revenu fiscal du foyer, le versement libératoire permet de payer l’impôt en même temps que les cotisations, par un petit pourcentage du chiffre d’affaires.",
          "La TVA suit des règles distinctes. En dessous de seuils de franchise en base (85 000 € pour la vente et 37 500 € pour les services en 2026, selon les sources consultées, avec des seuils majorés), le micro-entrepreneur ne facture pas de TVA et porte la mention « TVA non applicable, article 293 B du CGI ». Il ne récupère pas non plus la TVA sur ses achats. Au-delà, il doit facturer et reverser la TVA, même s’il reste en régime micro.",
          "Autres obligations : tenir un livre des recettes (et un registre des achats pour la vente), conserver les factures, disposer d’un compte bancaire dédié au-delà d’un certain chiffre d’affaires, payer la cotisation foncière des entreprises (CFE) à partir de la deuxième année en général, et souscrire les assurances nécessaires.",
        ],
      },
      {
        title: "Le point de vigilance",
        body: [
          "Le régime ne déduit pas les charges réelles : avec beaucoup d’achats, de sous-traitance ou un local cher, les cotisations calculées sur le chiffre d’affaires pèsent lourd. Comparer avec le régime réel devient alors nécessaire.",
          "Cumuler avec un emploi salarié est possible, en respectant son contrat de travail (loyauté, clause d’exclusivité ou de non-concurrence). Les seuils, taux et l’ACRE (réformée en 2026) changent régulièrement : vérifie toujours les valeurs sur autoentrepreneur.urssaf.fr et entreprendre.service-public.gouv.fr à la date de ta décision.",
        ],
      },
    ],
    example: {
      title: "Exemple fictif · un professeur de yoga indépendant",
      body: "Hugo donne des cours de yoga et encaisse 2 000 € en mars. Il déclare ce montant à la fin du trimestre sur le site de l’Urssaf, qui calcule ses cotisations au taux de son activité libérale. N’ayant pas opté pour le versement libératoire, il ajoutera son chiffre d’affaires annuel, après abattement de 34 %, à sa déclaration de revenus. Son chiffre d’affaires reste sous le seuil de franchise de TVA : ses factures portent « TVA non applicable, article 293 B du CGI ». En août, il n’encaisse rien et déclare zéro : il ne paie aucune cotisation ce trimestre-là.",
    },
    exercise: {
      prompt:
        "Une micro-entrepreneuse vend des bijoux et encaisse 30 000 € sur l’année. Avec un taux de cotisations de 12,3 % et un abattement fiscal de 71 %, calcule ses cotisations sociales et le montant ajouté à son revenu imposable.",
      hint: "Cotisations = chiffre d’affaires × taux. Revenu imposable = chiffre d’affaires × (1 − abattement).",
      answer:
        "Cotisations : 30 000 × 12,3 % = 3 690 €. Revenu imposable : 30 000 × 29 % = 8 700 €, ajoutés aux autres revenus du foyer et imposés au barème progressif.",
      explanation:
        "Si ses achats réels de matières dépassent 71 % de son chiffre d’affaires, l’abattement forfaitaire la désavantage, et ses cotisations restent calculées sur la totalité de ses ventes.",
    },
    quiz: [
      {
        id: "ent-micro-1",
        question:
          "Un micro-entrepreneur n’encaisse rien pendant un trimestre. Que doit-il faire ?",
        options: [
          "Rien : sans chiffre d’affaires, il n’a aucune démarche.",
          "Déclarer un chiffre d’affaires de zéro ; il ne paiera pas de cotisations sur cette période.",
          "Payer une cotisation minimale forfaitaire.",
        ],
        answer: 1,
        explanation:
          "La déclaration reste obligatoire, même à zéro. Les cotisations étant proportionnelles au chiffre d’affaires, elles sont nulles.",
      },
      {
        id: "ent-micro-2",
        question:
          "Un micro-entrepreneur en franchise de TVA achète du matériel. Peut-il récupérer la TVA payée ?",
        options: [
          "Oui, comme toute entreprise.",
          "Non : en franchise, il ne facture pas de TVA et ne la récupère pas sur ses achats.",
          "Oui, mais seulement la première année.",
        ],
        answer: 1,
        explanation:
          "La franchise en base dispense de facturer la TVA, et prive en contrepartie du droit de la déduire.",
      },
    ],
    application:
      "Estime ton chiffre d’affaires annuel, calcule cotisations et revenu imposable avec les taux de ton activité, et compare avec tes charges réelles pour savoir si le régime micro te convient.",
    idea: {
      title: "Simuler ma micro-entreprise",
      description:
        "Chiffre d’affaires, cotisations, impôt et seuil de TVA : savoir si le régime micro convient à mon activité.",
    },
    sources: [urssafMicro, entreprendre, impotsPro],
    version: "1.0.0",
    editorialStatus,
    flashcards: [
      {
        front: "Cotisations en micro",
        back: "Pourcentage du chiffre d’affaires encaissé, déclaré chaque mois ou trimestre.",
      },
      {
        front: "Abattement forfaitaire",
        back: "71 % vente, 50 % autres activités commerciales et artisanales, 34 % activités libérales.",
      },
      {
        front: "Franchise en base de TVA",
        back: "Sous les seuils, pas de TVA facturée ni récupérée ; mention « article 293 B du CGI ».",
      },
    ],
  },
  {
    id: "ent-facturer-declarer",
    title: "Facturer, encaisser, déclarer",
    domain: "Entrepreneuriat",
    level: 2,
    minutes: 20,
    summary:
      "Une facture conforme, un encaissement suivi, une TVA comprise et des déclarations à l’heure : le quotidien administratif qui protège la trésorerie.",
    skills: [
      "Facture conforme",
      "Délais de paiement et relances",
      "TVA collectée et déductible",
    ],
    prerequisites: ["ent-micro-entreprise"],
    sections: [
      {
        title: "Pourquoi apprendre ça ?",
        body: [
          "Vendre ne suffit pas : il faut être payé. Les retards de paiement et les factures incomplètes figurent parmi les premières causes de difficultés de trésorerie des petites entreprises.",
          "Une gestion simple et régulière (une heure par semaine plutôt qu’un week-end par trimestre) évite pénalités et oublis.",
        ],
      },
      {
        title: "La facture",
        body: [
          "Une facture entre professionnels comporte notamment : un numéro unique suivant une séquence chronologique continue, la date, l’identité et l’adresse du vendeur et de l’acheteur, le numéro SIREN, la désignation précise des biens ou services, les quantités, le prix unitaire HT, les remises, le taux et le montant de TVA (ou la mention d’exonération), le total, la date d’échéance, les pénalités de retard et l’indemnité forfaitaire pour frais de recouvrement.",
          "La facturation électronique devient obligatoire progressivement entre entreprises assujetties à la TVA : selon le calendrier confirmé par la loi de finances 2026, toutes doivent pouvoir recevoir des factures électroniques depuis le 1er septembre 2026, et les PME et micro-entreprises devront les émettre à partir du 1er septembre 2027. De nouvelles mentions s’ajoutent, comme le SIREN du client et la nature de l’opération (bien, service ou les deux). Vérifie le calendrier et choisis une plateforme agréée.",
          "Un devis signé protège les deux parties : il fixe le prix, le périmètre et les délais. Pour les particuliers, certaines activités imposent un devis préalable.",
        ],
      },
      {
        title: "Encaisser et déclarer",
        body: [
          "Entre professionnels, les délais de paiement sont plafonnés par la loi (en règle générale 60 jours à compter de la facture, ou 45 jours fin de mois si le contrat le prévoit), avec des règles particulières dans certains secteurs. Un acompte à la commande, une relance aimable à l’échéance puis une relance ferme et une mise en demeure forment une procédure simple.",
          "La TVA collectée est celle que l’entreprise facture à ses clients ; la TVA déductible, celle qu’elle paie sur ses achats professionnels. Elle reverse la différence à l’État. La TVA n’est pas un revenu : la mettre de côté à chaque encaissement évite les mauvaises surprises.",
          "Le calendrier : déclarations de chiffre d’affaires (micro) ou de TVA, déclaration de résultat annuelle, cotisation foncière des entreprises, éventuelles déclarations sociales pour les salariés. Un agenda avec rappels et un compte dédié à la TVA et aux cotisations simplifient beaucoup.",
        ],
      },
      {
        title: "Le point de vigilance",
        body: [
          "Les pièces comptables et les factures doivent être conservées pendant plusieurs années (durées légales à vérifier selon le document). Un logiciel de facturation conforme, qui numérote automatiquement et ne permet pas de modifier une facture émise, évite des erreurs coûteuses.",
          "Une facture ne se supprime pas : on corrige une erreur par un avoir, qui annule tout ou partie de la facture d’origine.",
        ],
      },
    ],
    example: {
      title: "Exemple fictif · un développeur web assujetti à la TVA",
      body: "Karim facture un site 4 000 € HT, soit 4 800 € TTC avec une TVA à 20 %. Il a payé 600 € HT de logiciels, avec 120 € de TVA. À l’échéance de sa déclaration, il doit reverser 800 − 120 = 680 € de TVA. Son client règle avec trente jours de retard ; Karim relance à l’échéance, puis applique les pénalités prévues sur sa facture. Il a mis de côté la TVA dès l’encaissement : pas de mauvaise surprise au moment de payer.",
    },
    exercise: {
      prompt:
        "Sur un mois, une entreprise facture 12 000 € HT de prestations à 20 % de TVA et achète 3 000 € HT de matériel à 20 %. Quel montant de TVA doit-elle reverser ?",
      hint: "TVA collectée − TVA déductible.",
      answer:
        "TVA collectée : 12 000 × 20 % = 2 400 €. TVA déductible : 3 000 × 20 % = 600 €. TVA à reverser : 1 800 €.",
      explanation:
        "Les 2 400 € de TVA encaissés ne lui ont jamais appartenu : seule la différence entre TVA collectée et TVA déductible est versée à l’État.",
    },
    quiz: [
      {
        id: "ent-facture-1",
        question:
          "Une facture émise contient une erreur de montant. Que faire ?",
        options: [
          "La supprimer et en refaire une avec le même numéro.",
          "Émettre un avoir qui l’annule ou la corrige, puis une nouvelle facture si nécessaire.",
          "Corriger le montant à la main sur le document envoyé.",
        ],
        answer: 1,
        explanation:
          "La numérotation doit rester continue et la facture émise inchangée : l’avoir est l’outil de correction.",
      },
      {
        id: "ent-facture-2",
        question: "Que représente la TVA encaissée auprès des clients ?",
        options: [
          "Un revenu supplémentaire de l’entreprise.",
          "Une somme collectée pour l’État, dont on déduit la TVA payée sur les achats avant de la reverser.",
          "Une réserve que l’entreprise peut utiliser librement.",
        ],
        answer: 1,
        explanation:
          "L’entreprise est collectrice de la TVA : elle reverse la TVA collectée diminuée de la TVA déductible.",
      },
    ],
    application:
      "Crée un modèle de facture avec toutes les mentions, fixe ta procédure de relance en trois étapes et note tes dates de déclaration de l’année.",
    idea: {
      title: "Mon système de facturation et de relance",
      description:
        "Modèle de facture conforme, délais, relances et calendrier des déclarations.",
    },
    sources: [
      impotsPro,
      entreprendre,
      {
        title: "Facturation électronique · portail public (impots.gouv.fr)",
        url: "https://www.impots.gouv.fr/facturation-electronique",
      },
    ],
    version: "1.0.0",
    editorialStatus,
    flashcards: [
      {
        front: "Avoir",
        back: "Document qui annule ou corrige tout ou partie d’une facture déjà émise.",
      },
      {
        front: "TVA à reverser",
        back: "TVA collectée sur les ventes moins TVA déductible sur les achats.",
      },
      {
        front: "Facturation électronique",
        back: "Réception obligatoire depuis septembre 2026 ; émission pour les PME et micro-entreprises en septembre 2027 (à vérifier).",
      },
    ],
  },
  {
    id: "ent-financer-projet",
    title: "Financer son projet",
    domain: "Entrepreneuriat",
    level: 2,
    minutes: 20,
    summary:
      "Apport, prêt d’honneur, banque, aides, financement participatif, investisseurs : chaque source a un coût, des conditions et un moment.",
    skills: [
      "Besoin de financement",
      "Dettes et fonds propres",
      "Plan de financement",
    ],
    prerequisites: ["ent-creer-etapes"],
    sections: [
      {
        title: "Pourquoi apprendre ça ?",
        body: [
          "Manquer d’argent au mauvais moment fait échouer des projets viables. Lever trop, ou auprès des mauvais partenaires, fait perdre le contrôle ou impose une croissance qui ne convient pas.",
          "Financer, c’est d’abord savoir combien, pour quoi et pour quand : le besoin vient du prévisionnel.",
        ],
      },
      {
        title: "Mesurer le besoin",
        body: [
          "Le besoin de démarrage additionne les investissements (matériel, travaux, logiciel, dépôt de garantie), le besoin en fonds de roulement (stock, délais de paiement des clients) et une trésorerie de sécurité pour les premiers mois, souvent déficitaires.",
          "Le plan de financement met en face les ressources : apport personnel, prêts, subventions, levée de fonds. Il doit être équilibré, et le plan de trésorerie mois par mois doit montrer que le compte ne passe jamais sous zéro.",
          "Deux grandes familles : la dette (on rembourse, avec intérêts, mais on garde le contrôle) et les fonds propres (des investisseurs entrent au capital : pas de remboursement, mais ils partagent les décisions et les gains futurs).",
        ],
      },
      {
        title: "Les sources de financement",
        body: [
          "L’apport personnel et l’entourage (« love money ») rassurent les autres financeurs. Le prêt d’honneur, accordé sans intérêt et sans garantie à la personne du créateur par des réseaux associatifs (comme Initiative France ou Réseau Entreprendre), renforce l’apport et facilite le prêt bancaire.",
          "Le prêt bancaire finance surtout les investissements. La banque regarde l’apport, le prévisionnel et l’expérience ; des organismes comme Bpifrance peuvent garantir une partie du prêt. Les aides et subventions (régions, France Travail pour les demandeurs d’emploi, concours) existent mais ont des conditions et délais précis.",
          "Le financement participatif (dons avec contreparties, prêts ou prises de participation via une plateforme) teste aussi l’intérêt du public. Les business angels et les fonds de capital-risque investissent dans des projets à fort potentiel de croissance, contre une part du capital : c’est adapté à peu de projets.",
        ],
      },
      {
        title: "Le point de vigilance",
        body: [
          "Entrer des investisseurs, c’est se diluer : la part du fondateur diminue à chaque levée. Un pacte d’associés organise gouvernance, sorties et droits de chacun ; il se rédige avec un avocat.",
          "Une caution personnelle sur un prêt professionnel engage les biens personnels, même en société ou en entreprise individuelle protégée. Lis chaque engagement, et ne finance jamais une activité avec un crédit à la consommation ou un découvert durable.",
        ],
      },
    ],
    example: {
      title: "Exemple fictif · un food truck",
      body: "Yanis chiffre son besoin : 38 000 € de camion aménagé, 4 000 € de stock et de frais de démarrage, 6 000 € de trésorerie de sécurité, soit 48 000 €. Ressources : 8 000 € d’apport, 10 000 € de prêt d’honneur, 30 000 € de prêt bancaire sur cinq ans, avec une garantie partielle. Le plan de trésorerie montre un creux en janvier, saison basse : il négocie un différé de remboursement de trois mois au démarrage.",
    },
    exercise: {
      prompt:
        "Un projet demande 20 000 € d’investissement, 5 000 € de stock et 5 000 € de trésorerie de sécurité. Le créateur apporte 6 000 € et obtient un prêt d’honneur de 8 000 €. Quel prêt bancaire faut-il chercher ? Que représente l’apport renforcé dans le besoin total ?",
      hint: "Besoin total − ressources déjà trouvées. Apport renforcé = apport + prêt d’honneur.",
      answer:
        "Besoin : 30 000 €. Ressources : 14 000 €. Prêt bancaire à chercher : 16 000 €. L’apport renforcé (6 000 + 8 000 = 14 000 €) couvre près de 47 % du besoin, ce qui rassure la banque.",
      explanation:
        "Le prêt d’honneur est personnel et sans intérêt : il augmente les fonds propres apportés au projet et sert souvent de levier pour obtenir un prêt bancaire.",
    },
    quiz: [
      {
        id: "ent-financer-1",
        question:
          "Quelle différence principale sépare la dette des fonds propres ?",
        options: [
          "La dette se rembourse avec intérêts ; les fonds propres font entrer des associés qui partagent décisions et gains.",
          "Les fonds propres sont toujours gratuits et sans contrepartie.",
          "La dette donne des droits de vote au prêteur.",
        ],
        answer: 0,
        explanation:
          "Un prêt n’ouvre pas de droit sur le capital ; une levée de fonds, si.",
      },
      {
        id: "ent-financer-2",
        question: "Qu’est-ce qu’un prêt d’honneur ?",
        options: [
          "Un prêt bancaire garanti par l’État.",
          "Un prêt personnel au créateur, sans intérêt ni garantie, accordé par des réseaux d’accompagnement.",
          "Une subvention qu’il n’est pas nécessaire de rembourser.",
        ],
        answer: 1,
        explanation:
          "Il se rembourse, mais sans intérêt ; il renforce l’apport et facilite l’accès au prêt bancaire.",
      },
    ],
    application:
      "Chiffre ton besoin de démarrage (investissements, stock, trésorerie de sécurité), puis construis un plan de financement équilibré avec deux sources au moins.",
    idea: {
      title: "Le plan de financement de mon projet",
      description:
        "Besoin chiffré, ressources possibles et plan de trésorerie des douze premiers mois.",
    },
    sources: [
      bpiCreation,
      {
        title: "Initiative France · prêts d’honneur",
        url: "https://www.initiative-france.fr/",
      },
      {
        title: "Réseau Entreprendre",
        url: "https://www.reseau-entreprendre.org/",
      },
    ],
    version: "1.0.0",
    editorialStatus,
    flashcards: [
      {
        front: "Besoin de démarrage",
        back: "Investissements + besoin en fonds de roulement + trésorerie de sécurité.",
      },
      {
        front: "Prêt d’honneur",
        back: "Prêt personnel sans intérêt ni garantie, qui renforce l’apport du créateur.",
      },
      {
        front: "Dilution",
        back: "Baisse de la part du fondateur dans le capital à chaque entrée d’investisseurs.",
      },
    ],
  },
];
