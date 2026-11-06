import type { Lesson } from "./lessons";

/**
 * Module « Bourse et investissement ». Pédagogique, jamais un conseil :
 * exemples fictifs, aucun titre recommandé, aucune règle fiscale chiffrée
 * tant qu'elle n'a pas été vérifiée à une date donnée.
 */
const editorialStatus =
  "Module pédagogique initial · exemples fictifs · règles fiscales et plafonds à vérifier auprès des sources officielles · aucun conseil en investissement";

const amf = {
  title: "AMF · espace épargnants",
  url: "https://www.amf-france.org/fr/espace-epargnants",
};
const financePourTous = {
  title: "La finance pour tous (IEFP) · comprendre l’épargne et la bourse",
  url: "https://www.lafinancepourtous.com/",
};
const banqueDeFrance = {
  title: "Banque de France · ABC de l’économie",
  url: "https://abc-economie.banque-france.fr/",
};
const servicePublic = {
  title: "Service-public.fr · espace particuliers (rubrique argent et épargne)",
  url: "https://www.service-public.fr/particuliers",
};

export const investingLessons: Lesson[] = [
  {
    id: "inv-marches-financiers",
    title: "La bourse : actions, obligations et indices",
    domain: "Investissement",
    level: 0,
    minutes: 18,
    summary:
      "Ce que l’on achète vraiment en bourse, qui reçoit l’argent et ce que mesure un indice. La base avant tout placement.",
    skills: [
      "Action",
      "Obligation",
      "Marché primaire et secondaire",
      "Indice boursier",
    ],
    prerequisites: [],
    sections: [
      {
        title: "Pourquoi apprendre ça ?",
        body: [
          "La bourse est souvent décrite comme un casino ou comme une machine à s’enrichir. Les deux images empêchent de raisonner. Avant de parler de rendement, il faut savoir ce que l’on détient, ce que l’on peut perdre et qui se trouve de l’autre côté de l’échange.",
          "Ce module ne recommande aucun titre ni aucun produit. Il donne le vocabulaire et les mécanismes pour lire une offre, poser les bonnes questions et reconnaître une promesse irréaliste.",
        ],
      },
      {
        title: "Les mécanismes",
        body: [
          "Une action est une part du capital d’une société. Elle donne des droits : voter en assemblée générale et recevoir un dividende si la société décide d’en verser. Elle n’est jamais remboursée : sa valeur dépend du prix auquel d’autres acceptent de l’acheter. Si l’entreprise fait faillite, l’actionnaire peut tout perdre.",
          "Une obligation est un prêt consenti à un État ou à une entreprise. L’émetteur verse des intérêts, appelés coupons, et rembourse le montant prêté à l’échéance, s’il en a la capacité. Entre-temps, son prix varie : il baisse notamment quand les taux d’intérêt du marché montent.",
          "Le marché primaire est celui des émissions : une introduction en bourse ou un nouvel emprunt obligataire. L’argent va à l’émetteur. Le marché secondaire est celui des échanges entre investisseurs : quand tu achètes une action déjà cotée, ton argent va au vendeur, pas à l’entreprise.",
          "Un indice boursier est un panier de valeurs qui résume l’évolution d’un marché. Le CAC 40 suit quarante grandes sociétés cotées à Paris, pondérées par leur capitalisation. Un indice se calcule ; on ne l’achète pas directement, mais des fonds cherchent à le reproduire.",
        ],
      },
      {
        title: "Le vocabulaire professionnel",
        body: [
          "Le cours est le prix du dernier échange. La capitalisation boursière vaut cours × nombre d’actions : c’est la valeur que le marché attribue aux fonds propres de la société à cet instant, pas une valeur garantie.",
          "La liquidité mesure la facilité à acheter ou vendre sans faire bouger le prix. La volatilité mesure l’amplitude des variations. Un dividende rémunère l’actionnaire ; un coupon rémunère le prêteur obligataire.",
        ],
      },
      {
        title: "Le piège de la bonne entreprise",
        body: [
          "Une entreprise solide n’est pas forcément un bon placement à n’importe quel prix. Le prix payé compte : une excellente société achetée très cher peut décevoir pendant des années.",
          "Une hausse passée n’est pas une promesse. Les obligations ne sont pas sans risque non plus : l’émetteur peut faire défaut, et l’inflation ou la hausse des taux peut réduire leur valeur.",
          "Limites : ce cours simplifie les catégories d’actions, les obligations convertibles ou indexées et le fonctionnement des places de cotation. Les exemples sont fictifs.",
        ],
      },
    ],
    example: {
      title: "Exemple fictif · la société Atelier Nord",
      body: "Atelier Nord compte 1 000 000 d’actions cotées 25 € : sa capitalisation boursière est de 25 millions d’euros. Elle verse un dividende de 0,50 € par action, soit 2 % du cours actuel. Ce dividende n’est pas garanti l’année suivante. En parallèle, elle émet une obligation fictive de 1 000 € à 3 % sur 5 ans : le prêteur reçoit 30 € par an, puis 1 000 € à l’échéance si Atelier Nord peut rembourser.",
    },
    exercise: {
      prompt:
        "Une société fictive compte 2 000 000 d’actions cotées 15 €. Quelle est sa capitalisation boursière, en millions d’euros ?",
      hint: "Multiplie le cours par le nombre d’actions, puis exprime le résultat en millions.",
      answer: "30",
      explanation:
        "2 000 000 × 15 € = 30 000 000 €, soit 30 millions d’euros. Cette valeur change à chaque variation du cours ; elle ne dit rien, seule, de la rentabilité de l’entreprise.",
    },
    quiz: [
      {
        id: "inv-marches-1",
        question:
          "Tu achètes des actions d’une société déjà cotée, auprès d’un autre investisseur. Qui reçoit ton argent ?",
        options: [
          "Le vendeur des actions",
          "La société, qui l’investit dans son activité",
          "L’Autorité des marchés financiers",
        ],
        answer: 0,
        explanation:
          "Sur le marché secondaire, l’échange se fait entre investisseurs. La société ne reçoit de l’argent que lors d’une émission, sur le marché primaire.",
      },
      {
        id: "inv-marches-2",
        question: "Quelle affirmation sur une obligation est exacte ?",
        options: [
          "Son remboursement dépend de la capacité de l’émetteur à payer",
          "Elle garantit un gain même si on la revend avant l’échéance",
          "Elle donne un droit de vote en assemblée générale",
        ],
        answer: 0,
        explanation:
          "Une obligation est un prêt : le risque principal est que l’émetteur ne puisse pas payer. Revendue avant l’échéance, son prix peut avoir baissé.",
      },
    ],
    application:
      "Si ton projet devait un jour lever des fonds, compare deux voies : ouvrir son capital (des associés ou actionnaires partagent le risque et les décisions) ou emprunter (un prêteur attend d’être remboursé avec intérêts). Note ce que chaque voie changerait pour toi.",
    idea: {
      title: "Lecteur de vocabulaire financier",
      description:
        "Un outil qui surligne les termes techniques d’un article financier et les relie à une définition sourcée. Première validation : demander à cinq débutants quels mots les bloquent dans un article boursier.",
    },
    sources: [amf, banqueDeFrance, financePourTous],
    version: "1.0.0",
    editorialStatus,
    flashcards: [
      {
        front: "Une action est-elle remboursée à une date fixée ?",
        back: "Non. Sa valeur dépend du prix que d’autres acceptent de payer ; l’actionnaire peut tout perdre en cas de faillite.",
      },
      {
        front: "Sur le marché secondaire, qui reçoit l’argent d’un achat ?",
        back: "Le vendeur des titres, pas l’entreprise émettrice.",
      },
      {
        front: "Qu’est-ce qu’un indice boursier ?",
        back: "Un panier de valeurs qui résume un marché. Il se calcule ; des fonds cherchent à le reproduire.",
      },
    ],
  },
  {
    id: "inv-interets-composes",
    title: "Intérêts composés, inflation et frais",
    domain: "Investissement",
    level: 1,
    minutes: 18,
    summary:
      "Le temps fait croître un capital dont les gains sont réinvestis, l’inflation en grignote la valeur réelle et les frais composent à l’envers.",
    skills: ["Intérêts composés", "Rendement réel", "Frais de gestion"],
    prerequisites: ["inv-marches-financiers"],
    sections: [
      {
        title: "Pourquoi apprendre ça ?",
        body: [
          "Deux placements qui semblent proches à un an peuvent finir très éloignés à vingt ans. Ce qui fait la différence est rarement visible sur une seule année : c’est l’accumulation des gains, de l’inflation et des frais.",
          "Comprendre ce mécanisme aide à comparer des offres, à se méfier des projections trop belles et à repérer les coûts qui comptent vraiment.",
        ],
      },
      {
        title: "Les mécanismes",
        body: [
          "Avec des intérêts simples, on gagne chaque année un pourcentage du capital de départ. Avec des intérêts composés, les gains sont réinvestis et produisent à leur tour des gains : capital final = capital initial × (1 + taux)^nombre d’années.",
          "L’inflation est la hausse générale des prix. Un placement qui rapporte 3 % quand les prix montent de 3 % ne fait que maintenir le pouvoir d’achat. Le rendement réel vaut environ rendement nominal − inflation ; plus précisément (1 + nominal) ÷ (1 + inflation) − 1.",
          "Les frais réduisent le rendement chaque année, sur tout le capital accumulé : ils composent eux aussi, mais contre toi. On distingue notamment les frais d’entrée, les frais de gestion annuels d’un fonds ou d’un contrat, et les frais de courtage à chaque ordre.",
        ],
      },
      {
        title: "Le vocabulaire professionnel",
        body: [
          "Le rendement nominal est affiché avant inflation ; le rendement réel en tient compte. Les frais courants d’un fonds sont exprimés en pourcentage annuel de l’encours.",
          "La règle de 72 donne un ordre de grandeur : à un taux annuel constant de r %, un capital double en environ 72 ÷ r années. C’est une approximation, pas un calcul exact.",
        ],
      },
      {
        title: "Le piège de la courbe parfaite",
        body: [
          "Une projection à taux constant produit une courbe lisse. La réalité des placements risqués est faite de hausses et de baisses parfois fortes ; un taux moyen passé ne garantit rien pour la suite.",
          "Un petit écart de frais paraît négligeable sur une année. Sur vingt ans, il peut représenter une part importante du capital final. Compare toujours les frais totaux, y compris ceux du contrat qui contient les supports.",
          "Limites : les exemples ignorent la fiscalité, qui dépend de l’enveloppe et de règles à vérifier à la date de la décision.",
        ],
      },
    ],
    example: {
      title: "Exemple fictif · 10 000 € pendant 20 ans",
      body: "À un taux fictif constant de 5 % par an, intérêts réinvestis, 10 000 € deviennent environ 26 533 € en 20 ans. Avec 1 % de frais annuels, le capital final tombe à environ 21 702 € ; avec 2 %, à environ 17 714 €. Si les prix montent de 2 % par an, les 26 533 € n’achètent plus qu’environ ce que 17 856 € achetaient au départ. Ce calcul illustre un mécanisme : ce n’est ni une prévision, ni une promesse.",
    },
    exercise: {
      prompt:
        "Tu places 1 000 € à un taux fictif de 10 % par an, intérêts réinvestis. Combien as-tu après deux ans, en euros ?",
      hint: "La deuxième année, les 10 % s’appliquent aussi aux intérêts de la première année.",
      answer: "1210",
      explanation:
        "Après un an : 1 000 × 1,10 = 1 100 €. Après deux ans : 1 100 × 1,10 = 1 210 €. Avec des intérêts simples, on aurait 1 200 € : les 10 € d’écart sont les intérêts des intérêts.",
    },
    quiz: [
      {
        id: "inv-interets-1",
        question:
          "Ton placement rapporte 4 % sur un an pendant que les prix augmentent de 4 %. Que devient environ ton pouvoir d’achat ?",
        options: [
          "Il reste à peu près stable",
          "Il augmente d’environ 8 %",
          "Il augmente d’environ 4 %",
        ],
        answer: 0,
        explanation:
          "Le rendement réel est proche de 4 % − 4 % = 0 %. Tu as plus d’euros, mais ils achètent à peu près la même chose.",
      },
      {
        id: "inv-interets-2",
        question:
          "Deux fonds suivent la même stratégie ; l’un prélève 0,2 % de frais par an, l’autre 2 %. Que se passe-t-il sur vingt ans ?",
        options: [
          "L’écart de frais se cumule et peut peser lourd sur le capital final",
          "Les frais n’agissent que la première année",
          "L’écart reste toujours inférieur à 2 % du capital final",
        ],
        answer: 0,
        explanation:
          "Les frais s’appliquent chaque année à tout le capital accumulé : leur effet compose. Sur vingt ans, l’écart dépasse largement 2 % du capital final.",
      },
    ],
    application:
      "Si ton projet facture un abonnement ou prélève une commission, calcule ce qu’elle représente sur cinq ans pour un client fidèle. Un coût récurrent faible peut devenir un argument contre toi s’il compose sur la durée.",
    idea: {
      title: "Comparateur de frais lisible",
      description:
        "Un outil qui traduit des frais en pourcentage en euros cumulés sur 10 et 20 ans pour un versement donné. Première validation : montrer deux documents de frais à cinq épargnants et mesurer s’ils trouvent le coût total.",
    },
    sources: [amf, financePourTous, banqueDeFrance],
    version: "1.0.0",
    editorialStatus,
    flashcards: [
      {
        front: "Formule des intérêts composés ?",
        back: "Capital final = capital initial × (1 + taux)^années, avec des gains réinvestis et un taux supposé constant.",
      },
      {
        front: "Rendement réel approximatif ?",
        back: "Rendement nominal − inflation. Exactement : (1 + nominal) ÷ (1 + inflation) − 1.",
      },
      {
        front: "Pourquoi les frais annuels comptent-ils autant ?",
        back: "Ils s’appliquent chaque année à tout le capital accumulé : leur effet compose contre l’épargnant.",
      },
    ],
  },
  {
    id: "inv-risque-diversification",
    title: "Risque, rendement et diversification",
    domain: "Investissement",
    level: 1,
    minutes: 20,
    summary:
      "Pas de rendement espéré élevé sans risque. Mesurer une perte, répartir ses placements et reconnaître une promesse trop belle.",
    skills: [
      "Volatilité",
      "Perte maximale",
      "Diversification",
      "Horizon de placement",
    ],
    prerequisites: ["inv-interets-composes"],
    sections: [
      {
        title: "Pourquoi apprendre ça ?",
        body: [
          "Le rendement attire l’attention ; le risque décide si l’on peut tenir. Un placement adapté est d’abord un placement dont on peut supporter la pire année sans être forcé de vendre.",
          "Cette leçon donne des outils pour mesurer une perte, comprendre ce que la diversification protège ou non, et repérer les offres frauduleuses.",
        ],
      },
      {
        title: "Les mécanismes",
        body: [
          "Rendement espéré et risque vont ensemble : un placement qui promet davantage expose en général à des variations plus fortes et à une possibilité de perte. Un rendement élevé « garanti » est un signal d’alerte.",
          "La perte maximale mesure la baisse entre un plus haut et le plus bas suivant. Les pertes et les gains ne sont pas symétriques : après une baisse de 50 %, il faut une hausse de 100 % pour revenir au point de départ.",
          "Diversifier, c’est répartir entre entreprises, secteurs, pays et types d’actifs. La diversification réduit le risque propre à un émetteur, comme la faillite d’une société. Elle ne supprime pas le risque de marché : lors d’une crise générale, beaucoup d’actifs baissent ensemble.",
          "L’horizon de placement est la durée pendant laquelle l’argent peut rester investi. Plus il est long, plus on peut attendre après une baisse, sans aucune garantie de récupération. L’argent nécessaire à court terme et l’épargne de précaution ne devraient pas dépendre des marchés d’actions.",
        ],
      },
      {
        title: "Le vocabulaire professionnel",
        body: [
          "La volatilité mesure l’amplitude des variations d’un prix. La corrélation indique si deux actifs ont tendance à évoluer ensemble. Le document d’informations clés d’un produit présente un indicateur de risque gradué de 1 (plus faible) à 7 (plus élevé).",
          "Le profil de risque d’un épargnant tient compte de ses objectifs, de son horizon, de sa situation financière et de sa capacité à supporter des pertes.",
        ],
      },
      {
        title: "Le piège de la concentration et de la promesse",
        body: [
          "Tout miser sur une seule action, un seul secteur ou son propre employeur concentre les risques : une mauvaise nouvelle peut toucher à la fois le placement et le revenu.",
          "Vendre dans la panique au plus bas transforme une baisse temporaire en perte définitive. Un plan écrit à l’avance aide à ne pas décider sous le coup de l’émotion.",
          "Arnaques : rendement élevé sans risque, pression pour décider vite, acteur introuvable ou non autorisé. L’AMF publie des listes noires et rappelle de vérifier qu’un intermédiaire est autorisé avant tout versement.",
        ],
      },
    ],
    example: {
      title: "Exemple fictif · deux portefeuilles",
      body: "Le portefeuille A détient une seule action fictive ; le portefeuille B répartit le même montant entre vingt sociétés de secteurs et de pays différents. Si l’entreprise de A fait faillite, A perd tout. Dans B, la même faillite coûte environ 5 %. En revanche, si tout le marché baisse de 30 %, A et B baissent fortement : 10 000 € deviennent 7 000 €, et il faudra ensuite une hausse d’environ 43 % pour revenir à 10 000 €.",
    },
    exercise: {
      prompt:
        "Un placement perd 50 %. De quel pourcentage doit-il ensuite progresser pour retrouver sa valeur de départ ?",
      hint: "Pars de 100 €, applique la baisse, puis cherche la hausse qui ramène à 100 €.",
      answer: "100",
      explanation:
        "100 € deviennent 50 €. Pour revenir à 100 €, il faut gagner 50 € sur une base de 50 € : +100 %. Les pertes pèsent plus lourd que les gains de même pourcentage.",
    },
    quiz: [
      {
        id: "inv-risque-1",
        question: "Que la diversification ne supprime-t-elle pas ?",
        options: [
          "Le risque d’une baisse générale des marchés",
          "Le risque lié à la faillite d’une seule société du portefeuille",
          "La dépendance à un seul secteur",
        ],
        answer: 0,
        explanation:
          "Répartir protège contre le risque propre à un émetteur ou à un secteur, pas contre une baisse qui touche presque tout le marché.",
      },
      {
        id: "inv-risque-2",
        question:
          "On te propose un placement « sans risque » à 15 % par an garanti. Quelle réaction est la plus prudente ?",
        options: [
          "Y voir un signal d’alerte et vérifier l’acteur auprès de l’AMF avant tout versement",
          "Investir vite avant que l’offre disparaisse",
          "Verser une petite somme pour tester",
        ],
        answer: 0,
        explanation:
          "Un rendement élevé sans risque et une pression pour agir vite sont des signes classiques de fraude. Tester avec une petite somme expose déjà à la perte.",
      },
    ],
    application:
      "Pour ton projet, liste les dépendances qui pourraient tout arrêter : un seul client, un seul fournisseur, un seul canal d’acquisition. Pour chacune, note une façon réaliste de diversifier ou de réduire l’impact.",
    idea: {
      title: "Vérificateur d’offre de placement",
      description:
        "Une liste de contrôle qui aide à repérer les signaux d’arnaque avant de répondre à une offre. Première validation : soumettre trois offres fictives à des débutants et mesurer les signaux qu’ils repèrent seuls.",
    },
    sources: [amf, financePourTous, banqueDeFrance],
    version: "1.0.0",
    editorialStatus,
    flashcards: [
      {
        front:
          "Après une baisse de 50 %, quelle hausse faut-il pour revenir au départ ?",
        back: "+100 %. Les pertes et les gains ne sont pas symétriques.",
      },
      {
        front: "Que protège la diversification ?",
        back: "Le risque propre à un émetteur ou à un secteur, pas le risque d’une baisse générale du marché.",
      },
      {
        front: "Trois signaux d’arnaque ?",
        back: "Rendement élevé « sans risque », pression pour décider vite, acteur non autorisé ou introuvable.",
      },
    ],
  },
  {
    id: "inv-fonds-enveloppes",
    title: "Fonds, ETF et enveloppes : PEA, assurance-vie, compte-titres",
    domain: "Investissement",
    level: 2,
    minutes: 22,
    summary:
      "Distinguer le support (ce que tu détiens) de l’enveloppe (le cadre qui le contient), lire un document d’informations clés et comparer les frais.",
    skills: [
      "Fonds et ETF",
      "Document d’informations clés",
      "Support et enveloppe",
      "PEA, assurance-vie, compte-titres",
    ],
    prerequisites: ["inv-risque-diversification"],
    sections: [
      {
        title: "Pourquoi apprendre ça ?",
        body: [
          "Les noms se mélangent vite : PEA, ETF, assurance-vie, SICAV, compte-titres. Beaucoup de confusions viennent d’une seule erreur : mettre sur le même plan un support d’investissement et l’enveloppe qui le contient.",
          "Cette leçon donne la carte. Elle ne dit pas quelle enveloppe choisir : cela dépend de la situation de chacun et de règles fiscales à vérifier au moment de la décision.",
        ],
      },
      {
        title: "Les mécanismes",
        body: [
          "Un fonds d’investissement mutualise l’argent de nombreux épargnants pour acheter un ensemble de titres, selon une politique décrite à l’avance. Une gestion active cherche à faire mieux qu’un marché ; une gestion indicielle cherche à reproduire un indice.",
          "Un ETF, ou tracker, est un fonds indiciel coté en bourse : il s’achète et se vend comme une action et suit un indice. Ses frais sont souvent plus bas que ceux d’une gestion active, sans que ce soit une règle absolue. Il reste exposé à toutes les baisses de son indice.",
          "Une enveloppe est un cadre juridique et fiscal. Le compte-titres ordinaire peut contenir des titres très variés, sans avantage fiscal spécifique. Le plan d’épargne en actions (PEA) accueille des actions européennes et certains fonds éligibles, avec un plafond de versements et un avantage fiscal lié à une durée de détention. L’assurance-vie est un contrat d’assurance qui peut combiner un fonds en euros, dont le capital est en principe garanti par l’assureur, et des unités de compte, qui exposent au risque de perte.",
          "Plafonds, durées, conditions de retrait et fiscalité changent avec la loi. Vérifie-les sur service-public.fr ou auprès de l’AMF à la date de ta décision : ce cours ne les chiffre volontairement pas.",
        ],
      },
      {
        title: "Le vocabulaire professionnel",
        body: [
          "Le document d’informations clés (DIC) présente en quelques pages l’objectif du produit, son indicateur de risque de 1 à 7, des scénarios de performance et ses coûts. Le lire avant d’acheter est le réflexe de base.",
          "OPC, OPCVM, SICAV et FCP sont des catégories juridiques de fonds. Les frais courants s’expriment en pourcentage annuel ; dans une assurance-vie, ils s’ajoutent aux frais du contrat.",
        ],
      },
      {
        title: "Le piège de l’avantage fiscal",
        body: [
          "Choisir un produit seulement parce qu’il est « éligible » à une enveloppe avantageuse revient à oublier l’essentiel : le risque, les frais et l’adéquation à ton horizon.",
          "Les frais s’empilent : frais du contrat, frais du support, frais d’arbitrage. Un avantage fiscal peut être absorbé par des frais élevés sur la durée.",
          "Limites : ce cours ne traite ni la transmission, ni les situations particulières, ni les produits complexes. Pour une décision personnelle, un conseiller autorisé est tenu d’évaluer ton profil.",
        ],
      },
    ],
    example: {
      title: "Exemple fictif · un même ETF, deux enveloppes",
      body: "Camille, personnage fictif, veut un ETF « Monde » fictif aux frais courants de 0,2 % par an. Dans un compte-titres, elle détient directement l’ETF. Dans une assurance-vie, le même type de support peut exister en unité de compte : elle paie alors aussi les frais de gestion du contrat. Le support est comparable ; l’enveloppe change les frais, la fiscalité et les conditions de retrait. Les règles exactes sont à vérifier avant toute décision.",
    },
    exercise: {
      prompt:
        "Un fonds fictif affiche des frais courants de 1,5 % par an. Sur un encours de 8 000 €, combien coûtent-ils environ sur une année, en euros ?",
      hint: "Applique le pourcentage annuel à l’encours.",
      answer: "120",
      explanation:
        "8 000 × 1,5 % = 120 € par an, prélevés dans la valeur du fonds. Si l’encours grandit, le montant des frais grandit avec lui.",
    },
    quiz: [
      {
        id: "inv-fonds-1",
        question: "Quelle est la différence entre un ETF et un PEA ?",
        options: [
          "L’ETF est un support d’investissement ; le PEA est une enveloppe qui peut en contenir",
          "Ce sont deux noms du même produit",
          "Le PEA est un fonds indiciel coté en bourse",
        ],
        answer: 0,
        explanation:
          "Le support est ce que tu détiens (un ETF, une action, un fonds). L’enveloppe est le cadre fiscal et juridique (PEA, compte-titres, assurance-vie).",
      },
      {
        id: "inv-fonds-2",
        question:
          "Quel document présente l’objectif d’un fonds, son indicateur de risque et ses coûts ?",
        options: [
          "Le document d’informations clés (DIC)",
          "Le relevé de compte annuel",
          "La publicité du distributeur",
        ],
        answer: 0,
        explanation:
          "Le DIC est un document standardisé qui permet de comparer objectif, risque et coûts avant d’acheter.",
      },
    ],
    application:
      "Si ton projet propose plusieurs offres, sépare ce que le client achète (le service) de la formule qui l’encadre (abonnement, engagement, options). Vérifie que le coût total reste lisible, comme dans un DIC.",
    idea: {
      title: "Résumé de DIC en langage clair",
      description:
        "Un outil qui extrait d’un document d’informations clés l’objectif, l’indicateur de risque et les coûts en euros pour un versement donné. Première validation : demander à des épargnants ce qu’ils retiennent d’un DIC avant et après le résumé.",
    },
    sources: [amf, servicePublic, financePourTous],
    version: "1.0.0",
    editorialStatus,
    flashcards: [
      {
        front: "Support ou enveloppe : qu’est-ce qu’un PEA ?",
        back: "Une enveloppe : un cadre fiscal et juridique qui peut contenir des actions européennes et certains fonds éligibles.",
      },
      {
        front: "Qu’est-ce qu’un ETF ?",
        back: "Un fonds indiciel coté en bourse qui cherche à reproduire un indice, y compris dans ses baisses.",
      },
      {
        front: "Que contient un document d’informations clés ?",
        back: "L’objectif du produit, un indicateur de risque de 1 à 7, des scénarios de performance et les coûts.",
      },
    ],
  },
  {
    id: "inv-ordres-biais",
    title: "Passer un ordre et déjouer ses biais",
    domain: "Investissement",
    level: 2,
    minutes: 20,
    summary:
      "Ordres au marché ou à cours limité, fourchette et frais, puis les pièges de notre propre cerveau face aux marchés.",
    skills: [
      "Ordre au marché",
      "Ordre à cours limité",
      "Fourchette de prix",
      "Biais comportementaux",
    ],
    prerequisites: ["inv-fonds-enveloppes"],
    sections: [
      {
        title: "Pourquoi apprendre ça ?",
        body: [
          "Le passage à l’acte est le moment où les erreurs coûtent : un type d’ordre mal choisi, un titre peu échangé, une décision prise sous le coup de l’émotion.",
          "Savoir comment un ordre s’exécute et connaître ses propres biais protège davantage qu’une prévision sur la direction du marché.",
        ],
      },
      {
        title: "Les mécanismes",
        body: [
          "Le carnet d’ordres liste les prix auxquels des investisseurs veulent acheter et vendre. La fourchette, ou spread, est l’écart entre le meilleur prix vendeur et le meilleur prix acheteur ; elle est plus large sur les titres peu liquides.",
          "Un ordre au marché s’exécute au meilleur prix disponible : l’exécution est quasi certaine, le prix ne l’est pas. Un ordre à cours limité fixe un prix maximum à l’achat ou minimum à la vente : le prix est maîtrisé, l’exécution n’est pas garantie.",
          "Un ordre à seuil de déclenchement, souvent appelé stop, devient un ordre au marché quand un prix est atteint : en cas de chute rapide, il peut être exécuté bien plus bas que le seuil. Chaque ordre a aussi une durée de validité et peut entraîner des frais de courtage.",
        ],
      },
      {
        title: "Les biais qui coûtent cher",
        body: [
          "L’aversion à la perte pousse à garder trop longtemps un titre en baisse pour ne pas « acter » la perte. L’ancrage fixe l’attention sur le prix d’achat, qui n’a pourtant aucune importance pour le marché.",
          "L’excès de confiance fait sous-estimer le hasard. Le biais de confirmation fait chercher les informations qui donnent raison. L’effet de mode et la peur de rater une hausse poussent à acheter après une forte montée.",
          "Antidotes : un plan écrit à l’avance (objectif, horizon, répartition), des versements programmés qui réduisent le risque de mal choisir son moment sans supprimer le risque de marché, et un rééquilibrage périodique plutôt que des décisions au fil de l’actualité.",
        ],
      },
      {
        title: "Le piège de l’action permanente",
        body: [
          "Multiplier les ordres multiplie les frais et les occasions de se tromper. Les produits à effet de levier, comme les CFD, amplifient gains et pertes ; les avertissements réglementaires rappellent qu’une majorité de comptes de particuliers y perdent de l’argent.",
          "Les conseils de placement diffusés sur les réseaux sociaux ne remplacent pas une analyse ni un conseil autorisé. Vérifie qui parle, ce qu’il gagne à te convaincre et s’il est autorisé.",
          "Limites : ce cours ne décrit pas tous les types d’ordres ni les règles propres à chaque place de cotation ou intermédiaire.",
        ],
      },
    ],
    example: {
      title: "Exemple fictif · un carnet d’ordres",
      body: "Sur une action fictive, le meilleur prix acheteur est 20,00 € et le meilleur prix vendeur 20,10 € : la fourchette est de 0,10 €, soit 0,5 %. Un ordre d’achat au marché de 100 actions s’exécute vers 20,10 € si cette quantité est disponible, plus haut sinon. Un ordre à cours limité à 20,05 € attend qu’un vendeur accepte ce prix ; il peut ne jamais être exécuté.",
    },
    exercise: {
      prompt:
        "Sur une action fictive, le meilleur prix acheteur est 49 € et le meilleur prix vendeur 50 €. Quelle est la fourchette, en euros ?",
      hint: "Soustrais le meilleur prix acheteur du meilleur prix vendeur.",
      answer: "1",
      explanation:
        "50 − 49 = 1 €, soit environ 2 % du prix. Acheter puis revendre immédiatement coûterait déjà cet écart, avant même les frais de courtage.",
    },
    quiz: [
      {
        id: "inv-ordres-1",
        question:
          "Tu veux être certain de ne pas payer plus de 30 € par action. Quel ordre choisis-tu ?",
        options: [
          "Un ordre à cours limité à 30 €",
          "Un ordre au marché",
          "Un ordre à seuil de déclenchement à 30 €",
        ],
        answer: 0,
        explanation:
          "L’ordre à cours limité fixe un prix maximum, au prix d’une exécution non garantie. Un ordre au marché ou à seuil peut s’exécuter plus cher.",
      },
      {
        id: "inv-ordres-2",
        question:
          "Un titre a fortement baissé depuis ton achat. Quelle question est la plus utile ?",
        options: [
          "Est-ce que je l’achèterais aujourd’hui, à ce prix, au vu de mon plan ?",
          "Comment récupérer au moins mon prix d’achat ?",
          "Qui sur les réseaux sociaux pense qu’il va remonter ?",
        ],
        answer: 0,
        explanation:
          "Le prix d’achat est un ancrage sans importance pour le marché. Reprendre son plan et la situation actuelle évite l’aversion à la perte et le biais de confirmation.",
      },
    ],
    application:
      "Avant ta prochaine décision importante pour ton projet, écris en trois lignes ce que tu attends, ce qui te ferait changer d’avis et la date à laquelle tu feras le bilan. Compare ensuite avec ce qui s’est passé, comme dans le journal de décisions.",
    idea: {
      title: "Journal de décisions d’investisseur",
      description:
        "Un carnet qui enregistre avant chaque ordre l’intention, l’horizon et le critère de sortie, puis compare au résultat. Première validation : demander à des investisseurs débutants de noter trois décisions et de relire leurs raisons un mois plus tard.",
    },
    sources: [amf, financePourTous, banqueDeFrance],
    version: "1.0.0",
    editorialStatus,
    flashcards: [
      {
        front: "Ordre au marché ou à cours limité : lequel garantit le prix ?",
        back: "L’ordre à cours limité garantit le prix maximum (ou minimum), pas l’exécution. L’ordre au marché garantit presque l’exécution, pas le prix.",
      },
      {
        front: "Qu’est-ce que la fourchette (spread) ?",
        back: "L’écart entre le meilleur prix vendeur et le meilleur prix acheteur ; elle est plus large sur les titres peu liquides.",
      },
      {
        front: "Qu’est-ce que l’ancrage ?",
        back: "Se fixer sur un prix de référence, comme son prix d’achat, qui n’a aucune importance pour le marché.",
      },
    ],
  },
];
