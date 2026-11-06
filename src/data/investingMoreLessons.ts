import type { Lesson } from "./lessons";

/**
 * Investissement, suite du module : obligations, arnaques, immobilier,
 * crypto-actifs, allocation, fiscalité. Pédagogique : exemples fictifs, aucun
 * produit ni établissement recommandé ; les taux et règles fiscales cités sont
 * datés (sources concordantes consultées en novembre 2026) et à vérifier.
 */
const editorialStatus =
  "Module pédagogique · exemples fictifs · règles et taux datés de novembre 2026, à vérifier · aucun conseil en investissement personnalisé";

const amf = {
  title: "AMF · espace épargnants",
  url: "https://www.amf-france.org/fr/espace-epargnants",
};
const amfListes = {
  title: "AMF · listes noires et mises en garde",
  url: "https://www.amf-france.org/fr/espace-epargnants/proteger-son-epargne/listes-noires-et-mises-en-garde",
};
const financePourTous = {
  title: "La finance pour tous (IEFP)",
  url: "https://www.lafinancepourtous.com/",
};
const impots = {
  title: "impots.gouv.fr · revenus de placements",
  url: "https://www.impots.gouv.fr/particulier",
};
const abeis = {
  title: "Assurance Banque Épargne Info Service (ACPR, AMF, Banque de France)",
  url: "https://www.abe-infoservice.fr/",
};

export const investingMoreLessons: Lesson[] = [
  {
    id: "inv-obligations-taux",
    title: "Obligations et taux d’intérêt",
    domain: "Investissement",
    level: 1,
    minutes: 18,
    summary:
      "Prêter à un État ou une entreprise contre des intérêts : comprendre le coupon, pourquoi le prix d’une obligation baisse quand les taux montent, et le risque de défaut.",
    skills: [
      "Coupon et échéance",
      "Prix et taux en sens inverse",
      "Risque de crédit",
    ],
    prerequisites: ["inv-marches-financiers"],
    sections: [
      {
        title: "Pourquoi apprendre ça ?",
        body: [
          "Les obligations sont au cœur de nombreux placements : fonds en euros de l’assurance-vie, fonds obligataires, épargne retraite. Elles sont réputées « sûres », mais leur valeur peut baisser, comme en 2022 lorsque les taux ont fortement remonté.",
          "Comprendre le lien entre taux et prix évite de mauvaises surprises et aide à lire les performances d’un contrat.",
        ],
      },
      {
        title: "Les mécanismes",
        body: [
          "Une obligation est un titre de dette : l’émetteur (État, collectivité, entreprise) emprunte une somme, verse un intérêt périodique, le coupon, puis rembourse le montant nominal à l’échéance. Le taux du coupon est fixé à l’émission dans la plupart des cas.",
          "Une obligation se revend avant l’échéance sur le marché, à un prix qui varie. Quand les taux d’intérêt du marché montent, les anciennes obligations, qui rapportent moins que les nouvelles, perdent de la valeur ; quand les taux baissent, elles en gagnent. Le prix et le taux évoluent en sens inverse.",
          "Plus l’échéance est lointaine, plus le prix réagit aux variations de taux : c’est la sensibilité, souvent mesurée par la duration. Une obligation gardée jusqu’à l’échéance par un émetteur qui ne fait pas défaut rembourse le nominal, quelles que soient les variations intermédiaires.",
        ],
      },
      {
        title: "Le risque de crédit",
        body: [
          "L’émetteur peut ne pas payer : c’est le défaut. Les agences de notation classent les émetteurs, des plus solides (catégorie « investissement ») aux plus risqués (catégorie « spéculative », souvent appelée « haut rendement »). Un rendement plus élevé rémunère un risque plus élevé.",
          "L’écart entre le rendement d’une obligation d’entreprise et celui d’un État de référence s’appelle le spread : il s’élargit quand les investisseurs s’inquiètent.",
          "Pour un particulier, les obligations s’achètent surtout via des fonds (OPCVM, ETF obligataires) ou le fonds en euros d’une assurance-vie, qui diversifient entre de nombreux émetteurs.",
        ],
      },
      {
        title: "Le point de vigilance",
        body: [
          "Un fonds obligataire n’a pas d’échéance : sa valeur fluctue en permanence avec les taux, contrairement à une obligation détenue jusqu’à son terme. Le fonds en euros d’une assurance-vie, lui, garantit le capital, le risque étant porté par l’assureur.",
          "Méfie-toi des obligations ou « minibons » d’entreprises inconnues promettant des rendements très élevés : le rendement annoncé reflète un risque de perte important.",
        ],
      },
    ],
    example: {
      title:
        "Exemple fictif · une obligation à 2 % quand les taux montent à 4 %",
      body: "Marc détient une obligation de 1 000 € à 2 % d’intérêt annuel, à 10 ans. Un an plus tard, les nouvelles obligations comparables rapportent 4 %. Personne n’achèterait la sienne 1 000 € : son prix baisse jusqu’à ce que son rendement devienne comparable, environ 850 €. S’il la garde jusqu’à l’échéance et que l’émetteur paie, il récupère tout de même 1 000 € et ses coupons ; s’il la vend maintenant, il réalise une perte.",
    },
    exercise: {
      prompt:
        "Une obligation de nominal 1 000 € verse un coupon annuel de 30 €. Quel est son taux de coupon ? Si elle s’échange à 950 €, son rendement courant (coupon ÷ prix) est-il plus ou moins élevé que le taux du coupon ?",
      hint: "Taux de coupon = coupon ÷ nominal. Rendement courant = coupon ÷ prix de marché.",
      answer:
        "Taux de coupon : 30 ÷ 1 000 = 3 %. Rendement courant : 30 ÷ 950 ≈ 3,16 %, plus élevé : l’acheteur paie moins cher pour le même coupon.",
      explanation:
        "Quand le prix baisse, le rendement pour un nouvel acheteur monte : prix et rendement varient en sens inverse.",
    },
    quiz: [
      {
        id: "inv-oblig-1",
        question:
          "Les taux d’intérêt du marché augmentent. Qu’arrive-t-il au prix des obligations déjà émises ?",
        options: [
          "Il augmente, car les taux sont plus élevés.",
          "Il baisse, car elles rapportent moins que les nouvelles obligations.",
          "Il ne change pas avant l’échéance.",
        ],
        answer: 1,
        explanation:
          "Un coupon fixe devient moins attractif quand les nouvelles émissions rapportent davantage : le prix s’ajuste à la baisse.",
      },
      {
        id: "inv-oblig-2",
        question:
          "Pourquoi une obligation « haut rendement » rapporte-t-elle davantage ?",
        options: [
          "Parce qu’elle est garantie par l’État.",
          "Parce qu’elle rémunère un risque de défaut plus élevé de l’émetteur.",
          "Parce que son prix ne varie jamais.",
        ],
        answer: 1,
        explanation:
          "Un rendement supérieur compense un risque supérieur ; il n’existe pas de rendement élevé sans risque.",
      },
    ],
    application:
      "Regarde la composition du fonds en euros ou d’un fonds obligataire de ton épargne : part d’États et d’entreprises, notation, durée moyenne.",
    idea: {
      title: "Comprendre la part obligataire de mon épargne",
      description:
        "Émetteurs, notation, sensibilité aux taux : ce que contient vraiment la partie « prudente ».",
    },
    sources: [amf, financePourTous],
    version: "1.0.0",
    editorialStatus,
    flashcards: [
      {
        front: "Coupon",
        back: "Intérêt versé périodiquement par l’émetteur d’une obligation.",
      },
      {
        front: "Prix et taux",
        back: "Ils évoluent en sens inverse : taux en hausse, prix des obligations existantes en baisse.",
      },
      {
        front: "Spread",
        back: "Écart de rendement entre une obligation risquée et un emprunt d’État de référence.",
      },
    ],
  },
  {
    id: "inv-arnaques-placement",
    title: "Repérer une arnaque au placement",
    domain: "Investissement",
    level: 1,
    minutes: 16,
    summary:
      "Rendement garanti, urgence, intermédiaire inconnu : les signaux d’alerte, les vérifications à faire en cinq minutes et que faire si l’on a déjà versé de l’argent.",
    skills: [
      "Signaux d’alerte",
      "Listes blanches et noires",
      "Réagir en cas d’escroquerie",
    ],
    prerequisites: ["inv-marches-financiers"],
    sections: [
      {
        title: "Pourquoi apprendre ça ?",
        body: [
          "Les escroqueries aux faux placements font perdre chaque année des sommes considérables à des épargnants de tous âges et de tous niveaux. Les escrocs sont organisés, professionnels et imitent parfaitement de vraies institutions.",
          "L’argent versé à l’étranger à un escroc est très rarement récupéré : la prévention est la seule vraie protection.",
        ],
      },
      {
        title: "Les signaux d’alerte",
        body: [
          "Un rendement élevé présenté comme garanti ou sans risque. Une pression pour décider vite (« offre limitée », « dernières places »). Un premier contact non sollicité : appel, message, publicité sur un réseau social, faux article de presse avec une personnalité.",
          "Un intermédiaire introuvable sur les registres officiels, ou qui usurpe le nom d’une vraie société ou d’un vrai conseiller. Une demande de virement vers un compte à l’étranger, de paiement en crypto-actifs ou par carte prépayée.",
          "Des actifs exotiques difficiles à vérifier : vin, diamants, forêts, chambres d’Ehpad, crypto-actifs « exclusifs », trading automatisé par intelligence artificielle. Et, après une perte, une offre de « récupération » de fonds contre des frais : c’est une seconde arnaque.",
        ],
      },
      {
        title: "Vérifier avant de verser",
        body: [
          "Consulter les listes noires de l’AMF et de l’ACPR, qui recensent les sites et entités non autorisés. Vérifier que l’intermédiaire est enregistré sur le registre ORIAS, et le prestataire sur les listes d’entités autorisées (REGAFI, liste des prestataires sur crypto-actifs de l’AMF).",
          "Attention aux sites clonés : une société autorisée peut être usurpée. Contacter soi-même la vraie société via les coordonnées trouvées sur le registre officiel, jamais via celles fournies par l’interlocuteur.",
          "En cas de doute, la plateforme Assurance Banque Épargne Info Service (AMF, ACPR, Banque de France) répond gratuitement aux questions.",
        ],
      },
      {
        title: "Le point de vigilance",
        body: [
          "Si l’on a déjà versé : arrêter tout versement, prévenir immédiatement sa banque (un virement récent peut parfois être rappelé), conserver toutes les preuves, porter plainte et signaler l’arnaque à l’AMF ou sur les plateformes publiques.",
          "Ne jamais payer de « frais de déblocage » ou de « taxes » pour récupérer ses gains : un placement légitime ne l’exige jamais.",
        ],
      },
    ],
    example: {
      title: "Exemple fictif · le « livret » à 9 % garanti",
      body: "Une publicité sur un réseau social propose un livret à 9 % garanti, présenté par une banque au nom connu. Un « conseiller » rappelle Paul, envoie une documentation soignée et un contrat. Avant de verser, Paul cherche le site sur la liste noire de l’AMF : un site au nom très proche y figure. Il appelle la vraie banque, dont il a trouvé le numéro lui-même : elle ne propose aucun produit de ce type. C’était un site clone.",
    },
    exercise: {
      prompt:
        "Classe ces éléments en signaux d’alerte ou non : « rendement garanti de 12 % par an » ; « société inscrite à l’ORIAS, vérifiée sur le registre » ; « virement vers un compte à Chypre » ; « offre réservée aux 50 premiers inscrits » ; « document d’informations clés remis avant souscription ».",
      hint: "Rendement élevé garanti, urgence et paiement à l’étranger sont des signaux classiques.",
      answer:
        "Signaux d’alerte : rendement garanti de 12 %, virement vers Chypre, offre réservée aux 50 premiers. Éléments rassurants mais insuffisants seuls : inscription vérifiée à l’ORIAS et remise d’un document d’informations clés.",
      explanation:
        "Un seul signal d’alerte justifie de s’arrêter et de vérifier ; les éléments rassurants peuvent être imités, d’où l’importance de vérifier soi-même à la source.",
    },
    quiz: [
      {
        id: "inv-arnaque-1",
        question:
          "Un placement promet 10 % par an « sans aucun risque ». Que faut-il en penser ?",
        options: [
          "C’est une opportunité à saisir rapidement.",
          "C’est un signal d’alerte : un rendement élevé s’accompagne toujours d’un risque.",
          "C’est normal pour un livret bancaire.",
        ],
        answer: 1,
        explanation:
          "Rendement et risque vont ensemble ; un rendement élevé garanti est le premier signe d’une escroquerie.",
      },
      {
        id: "inv-arnaque-2",
        question:
          "Après une perte, une société propose de récupérer vos fonds contre des frais. Que faire ?",
        options: [
          "Payer les frais, car c’est la seule chance de récupérer l’argent.",
          "Refuser : c’est souvent une seconde arnaque ; porter plainte et signaler.",
          "Négocier les frais à la baisse.",
        ],
        answer: 1,
        explanation:
          "Les arnaques à la récupération ciblent les victimes déjà escroquées ; aucun organisme sérieux ne demande d’avance de frais.",
      },
    ],
    application:
      "Avant ton prochain placement, vérifie l’intermédiaire sur les listes de l’AMF et l’ORIAS, et note les numéros d’Assurance Banque Épargne Info Service.",
    idea: {
      title: "Ma liste de vérification avant de placer",
      description:
        "Signaux d’alerte, registres à consulter et réflexes en cas de doute.",
    },
    sources: [
      amfListes,
      abeis,
      {
        title: "ORIAS · registre des intermédiaires",
        url: "https://www.orias.fr/",
      },
    ],
    version: "1.0.0",
    editorialStatus,
    flashcards: [
      {
        front: "Premier signal d’alerte",
        back: "Un rendement élevé présenté comme garanti ou sans risque.",
      },
      {
        front: "Vérifier un intermédiaire",
        back: "Listes noires AMF et ACPR, registre ORIAS, coordonnées trouvées soi-même.",
      },
      {
        front: "Arnaque à la récupération",
        back: "Offre de récupérer des fonds perdus contre des frais : seconde escroquerie.",
      },
    ],
  },
  {
    id: "inv-immobilier-scpi",
    title: "Investir dans l’immobilier : locatif et SCPI",
    domain: "Investissement",
    level: 2,
    minutes: 22,
    summary:
      "Louer un bien ou acheter des parts de SCPI : calculer un rendement net, compter la vacance et les charges, comprendre la fiscalité et la liquidité.",
    skills: [
      "Rendement brut et net",
      "Fiscalité des loyers",
      "SCPI : frais et liquidité",
    ],
    prerequisites: ["inv-risque-diversification"],
    sections: [
      {
        title: "Pourquoi apprendre ça ?",
        body: [
          "L’immobilier attire parce qu’il est concret et peut se financer à crédit. Mais un rendement brut affiché de 7 % peut devenir très faible une fois retirés vacance, charges, travaux et impôts.",
          "Les SCPI promettent l’immobilier sans la gestion ; elles ont pourtant leurs propres frais, risques et contraintes de revente.",
        ],
      },
      {
        title: "L’investissement locatif",
        body: [
          "Rendement brut = loyers annuels ÷ prix d’achat. Rendement net de charges = (loyers − charges non récupérables, taxe foncière, assurance, gestion, entretien, provision pour vacance) ÷ coût total (prix + frais d’acquisition + travaux). Le rendement net d’impôt retire en plus la fiscalité.",
          "Les loyers d’une location nue sont des revenus fonciers : au-dessous d’un certain montant, le régime micro-foncier applique un abattement forfaitaire de 30 % ; sinon, ou sur option, le régime réel déduit les charges réelles, intérêts compris. La location meublée relève d’un autre régime (bénéfices industriels et commerciaux), dont les règles ont été modifiées récemment : vérifie-les avant de choisir.",
          "Le crédit crée un effet de levier : si le bien rapporte plus que le coût du crédit, l’investisseur s’enrichit sur un capital emprunté ; dans le cas contraire, le levier amplifie les pertes. Il faut aussi assumer les risques de locataire défaillant, de vacance et de travaux imprévus.",
        ],
      },
      {
        title: "Les SCPI",
        body: [
          "Une société civile de placement immobilier (SCPI) collecte l’épargne de nombreux associés pour acheter et gérer un parc d’immeubles (bureaux, commerces, santé, logistique). L’associé reçoit une part des loyers, proportionnelle à ses parts.",
          "Les frais de souscription sont élevés (souvent de l’ordre de 8 à 12 % du montant investi), auxquels s’ajoutent des frais de gestion annuels : l’horizon conseillé est long, souvent huit à dix ans. Un délai de jouissance de plusieurs mois peut s’écouler avant de percevoir les premiers revenus.",
          "Ni le capital ni les revenus ne sont garantis : le prix des parts peut baisser, comme ce fut le cas pour plusieurs SCPI en 2023 et 2024, et la revente dépend de la présence d’acheteurs. Les revenus sont imposés comme des revenus fonciers, sauf détention dans une assurance-vie.",
        ],
      },
      {
        title: "Le point de vigilance",
        body: [
          "Ne jamais acheter un bien uniquement pour une réduction d’impôt : un bien surpayé ou mal situé peut faire perdre bien plus que l’avantage fiscal.",
          "Concentrer l’essentiel de son patrimoine dans un seul bien, financé à crédit, est un pari peu diversifié. Les SCPI diversifient davantage, au prix de frais et d’une liquidité limitée.",
        ],
      },
    ],
    example: {
      title: "Exemple fictif · un studio à 120 000 €",
      body: "Nadia achète un studio 120 000 €, plus 9 000 € de frais et 6 000 € de travaux. Loyer : 600 € par mois, soit 7 200 € par an : rendement brut de 6 %. Charges non récupérables, taxe foncière, assurance et entretien : 1 900 € ; un mois de vacance par an : 600 €. Reste 4 700 € sur un coût total de 135 000 € : rendement net de charges d’environ 3,5 %, avant impôt et avant le coût du crédit.",
    },
    exercise: {
      prompt:
        "Un bien coûte 200 000 € frais et travaux compris. Il rapporte 10 800 € de loyers par an ; les charges et la provision pour vacance s’élèvent à 3 200 €. Calcule le rendement brut (sur 185 000 € de prix d’achat) et le rendement net de charges (sur le coût total).",
      hint: "Brut = loyers ÷ prix d’achat. Net = (loyers − charges) ÷ coût total.",
      answer:
        "Rendement brut : 10 800 ÷ 185 000 ≈ 5,8 %. Rendement net de charges : 7 600 ÷ 200 000 = 3,8 %.",
      explanation:
        "L’écart entre brut et net est souvent de deux points ou plus : c’est le rendement net qui compte pour comparer avec d’autres placements.",
    },
    quiz: [
      {
        id: "inv-immo-1",
        question:
          "Pourquoi le rendement brut d’un bien locatif est-il trompeur ?",
        options: [
          "Parce qu’il inclut déjà les impôts.",
          "Parce qu’il ignore charges, vacance, frais d’achat et travaux.",
          "Parce qu’il est calculé sur dix ans.",
        ],
        answer: 1,
        explanation:
          "Seul le rendement net, après charges et frais, permet de comparer avec d’autres placements.",
      },
      {
        id: "inv-immo-2",
        question:
          "Que doit savoir un épargnant avant d’acheter des parts de SCPI ?",
        options: [
          "Le capital et les revenus sont garantis par la loi.",
          "Les frais d’entrée sont élevés, le capital n’est pas garanti et la revente peut prendre du temps.",
          "Les parts se revendent instantanément en bourse.",
        ],
        answer: 1,
        explanation:
          "Les SCPI sont un placement de long terme, risqué en capital et peu liquide.",
      },
    ],
    application:
      "Pour un bien ou une SCPI que tu envisages, calcule le rendement net de charges et liste les risques principaux (vacance, travaux, liquidité, fiscalité).",
    idea: {
      title: "Analyser un projet immobilier locatif",
      description:
        "Rendement brut et net, fiscalité, effet du crédit et risques identifiés.",
    },
    sources: [
      amf,
      {
        title: "AMF · investir dans une SCPI",
        url: "https://www.amf-france.org/fr/espace-epargnants/comprendre-les-produits-financiers/placements-collectifs/scpi",
      },
      impots,
    ],
    version: "1.0.0",
    editorialStatus,
    flashcards: [
      {
        front: "Rendement net de charges",
        back: "(Loyers − charges, taxe foncière, vacance) ÷ coût total d’achat.",
      },
      {
        front: "Micro-foncier",
        back: "Régime des petits revenus fonciers : abattement forfaitaire de 30 % sur les loyers.",
      },
      {
        front: "SCPI",
        back: "Parts d’un parc immobilier géré ; frais d’entrée élevés, capital non garanti, revente parfois lente.",
      },
    ],
  },
  {
    id: "inv-crypto-actifs",
    title: "Crypto-actifs : comprendre avant d’acheter",
    domain: "Investissement",
    level: 2,
    minutes: 20,
    summary:
      "Blockchain, bitcoin, stablecoins : ce que sont les crypto-actifs, pourquoi ils sont si volatils, comment choisir une plateforme autorisée et comment ils sont imposés.",
    skills: [
      "Blockchain et crypto-actifs",
      "Volatilité et conservation",
      "Cadre légal et fiscalité",
    ],
    prerequisites: ["inv-risque-diversification"],
    sections: [
      {
        title: "Pourquoi apprendre ça ?",
        body: [
          "Les crypto-actifs sont très présents sur les réseaux sociaux, souvent présentés comme un moyen de s’enrichir vite. Ils peuvent aussi perdre une grande partie de leur valeur en quelques semaines, et attirent de nombreuses escroqueries.",
          "Comprendre ce que l’on achète, où et comment c’est conservé, est le minimum avant d’y consacrer de l’argent.",
        ],
      },
      {
        title: "Ce que c’est",
        body: [
          "Une blockchain est un registre partagé, tenu par un réseau d’ordinateurs, qui enregistre les transactions de façon difficile à falsifier. Le bitcoin, créé en 2009, est le plus connu des crypto-actifs ; d’autres réseaux, comme Ethereum, permettent d’exécuter des programmes.",
          "Un crypto-actif n’est adossé à aucun bénéfice ni revenu (contrairement à une action ou une obligation) : son prix dépend de l’offre et de la demande, d’où une volatilité extrême. Les stablecoins visent une valeur stable en suivant une monnaie comme l’euro ou le dollar, grâce à des réserves dont la qualité varie.",
          "La conservation est un risque en soi : sur une plateforme, on dépend de sa solidité ; dans un portefeuille personnel, la perte de la clé privée ou de la phrase de récupération fait perdre définitivement l’accès aux fonds.",
        ],
      },
      {
        title: "Cadre légal et fiscalité",
        body: [
          "Dans l’Union européenne, le règlement MiCA encadre les prestataires de services sur crypto-actifs. Selon les sources consultées, depuis juillet 2026, une plateforme qui s’adresse à des clients en France doit disposer de l’agrément européen de prestataire de services sur crypto-actifs (PSCA, ou CASP en anglais), la période transitoire des anciens enregistrements nationaux étant achevée. Vérifie le statut d’une plateforme sur les listes de l’AMF.",
          "Les plus-values réalisées lors de la cession de crypto-actifs contre des euros (ou pour payer un bien) sont imposées, en règle générale, au prélèvement forfaitaire unique ; les échanges d’un crypto-actif contre un autre ne sont pas imposés au moment de l’échange. Les comptes ouverts sur des plateformes étrangères doivent être déclarés.",
          "Ces règles évoluent souvent : vérifie le taux et les obligations déclaratives en vigueur sur impots.gouv.fr avant ta déclaration.",
        ],
      },
      {
        title: "Le point de vigilance",
        body: [
          "N’investir que des sommes dont la perte totale ne mettrait pas en difficulté, après l’épargne de précaution, et en garder une part limitée de son patrimoine.",
          "Les promesses de rendement garanti, le staking à taux extravagant, les « robots de trading » et les influenceurs rémunérés sont des terrains privilégiés des escroqueries.",
        ],
      },
    ],
    example: {
      title: "Exemple fictif · une baisse de 60 %",
      body: "Théo investit 2 000 € dans un crypto-actif au plus haut d’un emballement médiatique. Six mois plus tard, le cours a baissé de 60 % : son placement vaut 800 €. Pour revenir à 2 000 €, il faudrait une hausse de 150 %. Il avait gardé son épargne de précaution intacte et n’avait investi qu’une petite part de son patrimoine : la perte est douloureuse mais supportable.",
    },
    exercise: {
      prompt:
        "Un crypto-actif acheté 1 000 € perd 70 %, puis regagne 70 %. Quelle est sa valeur finale ?",
      hint: "Applique les variations l’une après l’autre : × 0,30 puis × 1,70.",
      answer:
        "1 000 × 0,30 = 300 €, puis 300 × 1,70 = 510 €. Après une baisse et une hausse du même pourcentage, il reste à peine plus de la moitié du capital.",
      explanation:
        "Après une forte baisse, il faut une hausse bien plus grande pour revenir au point de départ : la volatilité extrême détruit du capital.",
    },
    quiz: [
      {
        id: "inv-crypto-1",
        question:
          "Que se passe-t-il si l’on perd la phrase de récupération d’un portefeuille personnel ?",
        options: [
          "La plateforme peut la réinitialiser par courriel.",
          "L’accès aux crypto-actifs peut être perdu définitivement.",
          "La banque rembourse les fonds.",
        ],
        answer: 1,
        explanation:
          "Dans un portefeuille personnel, la phrase de récupération est la seule clé : sans elle, personne ne peut restaurer l’accès.",
      },
      {
        id: "inv-crypto-2",
        question:
          "Échanger un crypto-actif contre un autre crypto-actif est-il imposé au moment de l’échange en France ?",
        options: [
          "Oui, comme toute vente.",
          "Non en règle générale : l’imposition intervient lors de la conversion en euros ou de l’achat d’un bien.",
          "Oui, mais seulement au-delà de dix échanges par an.",
        ],
        answer: 1,
        explanation:
          "Le fait générateur est la cession contre une monnaie ayant cours légal ou un bien ou service, à vérifier selon les règles en vigueur.",
      },
    ],
    application:
      "Si tu détiens ou envisages des crypto-actifs, vérifie le statut de la plateforme sur les listes de l’AMF, la part de ton patrimoine concernée et l’endroit où sont conservées tes clés.",
    idea: {
      title: "Faire le point sur les crypto-actifs",
      description:
        "Plateforme vérifiée, part du patrimoine limitée, conservation sécurisée et obligations fiscales.",
    },
    sources: [
      amf,
      amfListes,
      impots,
      {
        title: "Banque de France · crypto-actifs",
        url: "https://www.banque-france.fr/",
      },
    ],
    version: "1.0.0",
    editorialStatus,
    flashcards: [
      {
        front: "Blockchain",
        back: "Registre partagé, tenu par un réseau d’ordinateurs, difficile à falsifier.",
      },
      {
        front: "Stablecoin",
        back: "Crypto-actif qui vise une valeur stable, adossée à une monnaie via des réserves.",
      },
      {
        front: "MiCA",
        back: "Règlement européen qui encadre les prestataires de services sur crypto-actifs.",
      },
    ],
  },
  {
    id: "inv-allocation-profil",
    title: "Construire son allocation",
    domain: "Investissement",
    level: 2,
    minutes: 20,
    summary:
      "Répartir son épargne entre sécurité et croissance selon son horizon, sa capacité à supporter une baisse et ses objectifs, puis s’y tenir.",
    skills: [
      "Profil de risque",
      "Allocation d’actifs",
      "Rééquilibrage et discipline",
    ],
    prerequisites: ["inv-fonds-enveloppes"],
    sections: [
      {
        title: "Pourquoi apprendre ça ?",
        body: [
          "Le choix de la répartition entre grandes catégories (liquidités, fonds en euros, obligations, actions, immobilier) explique l’essentiel du résultat d’un portefeuille sur le long terme, bien plus que le choix d’un titre particulier.",
          "Une allocation décidée à l’avance protège aussi des décisions émotionnelles : vendre en panique au plus bas, acheter dans l’euphorie au plus haut.",
        ],
      },
      {
        title: "Le profil de risque",
        body: [
          "Trois questions le dessinent. L’horizon : dans combien de temps aurai-je besoin de cet argent ? La capacité à perdre : que se passe-t-il pour moi si ce placement baisse de 30 % ? La tolérance au risque : vais-je vendre en panique lors d’une baisse ?",
          "Les professionnels du placement sont tenus d’évaluer ces éléments avant de conseiller un produit, par un questionnaire d’adéquation. Répondre sincèrement protège l’épargnant.",
          "L’ordre des priorités reste le même : épargne de précaution disponible d’abord, projets à court terme sur des supports sûrs, puis seulement épargne de long terme sur des supports plus risqués.",
        ],
      },
      {
        title: "Répartir et rééquilibrer",
        body: [
          "Une allocation simple associe une poche sûre (livrets, fonds en euros, obligations de court terme) et une poche de croissance (actions diversifiées, par exemple via des fonds indiciels mondiaux). Plus l’horizon est long et la capacité à perdre élevée, plus la poche de croissance peut être importante.",
          "Les marchés font dériver la répartition : après une forte hausse des actions, leur part dépasse la cible. Le rééquilibrage, une ou deux fois par an ou au-delà d’un écart fixé, ramène le portefeuille à sa cible : il vend ce qui a monté et achète ce qui a baissé.",
          "Les versements programmés (investir le même montant chaque mois) lissent le prix d’achat dans le temps et automatisent la discipline.",
        ],
      },
      {
        title: "Le point de vigilance",
        body: [
          "Il n’existe pas d’allocation parfaite valable pour tous : un exemple d’allocation n’est pas un conseil. Une répartition qui fait perdre le sommeil est trop risquée pour soi, quelle que soit sa logique théorique.",
          "Se diversifier, c’est aussi éviter de concentrer son patrimoine sur son employeur, un seul pays, un seul secteur ou un seul bien immobilier.",
        ],
      },
    ],
    example: {
      title: "Exemple fictif · le rééquilibrage d’Aïcha",
      body: "Aïcha vise 60 % d’actions et 40 % de fonds en euros sur un portefeuille de 20 000 €. Après une année de forte hausse, elle détient 15 000 € d’actions et 8 400 € de fonds en euros : 64 % et 36 %. Elle rééquilibre en arbitrant environ 960 € des actions vers le fonds en euros pour revenir à 60/40. L’année suivante, quand les actions baissent, elle fait l’inverse : elle achète des actions moins cher.",
    },
    exercise: {
      prompt:
        "Un portefeuille de 50 000 € vise 70 % d’actions et 30 % d’obligations. Après une baisse, il contient 31 500 € d’actions et 15 500 € d’obligations. Calcule la répartition actuelle et le montant à arbitrer pour revenir à la cible.",
      hint: "Valeur totale actuelle, puis cible = 70 % de cette valeur.",
      answer:
        "Total : 47 000 €. Actions : 31 500 ÷ 47 000 ≈ 67 %. Cible actions : 70 % × 47 000 = 32 900 €. Il faut arbitrer 1 400 € des obligations vers les actions.",
      explanation:
        "Rééquilibrer après une baisse revient à acheter des actions quand elles sont moins chères, ce que l’émotion pousse justement à éviter.",
    },
    quiz: [
      {
        id: "inv-alloc-1",
        question:
          "Quel élément pèse le plus dans le résultat d’un portefeuille sur le long terme ?",
        options: [
          "Le choix d’une action à la mode.",
          "La répartition entre grandes catégories d’actifs.",
          "Le jour de la semaine où l’on investit.",
        ],
        answer: 1,
        explanation:
          "L’allocation d’actifs détermine l’essentiel du rendement et du risque d’un portefeuille diversifié.",
      },
      {
        id: "inv-alloc-2",
        question: "Que consiste à faire un rééquilibrage ?",
        options: [
          "Vendre tout lors d’une baisse.",
          "Ramener le portefeuille à sa répartition cible en vendant ce qui a monté et en achetant ce qui a baissé.",
          "Changer d’allocation à chaque nouvelle tendance.",
        ],
        answer: 1,
        explanation:
          "Le rééquilibrage maintient le niveau de risque choisi et impose une discipline à contre-courant des émotions.",
      },
    ],
    application:
      "Réponds aux trois questions du profil de risque, fixe une répartition cible écrite et une règle de rééquilibrage, puis compare-la à ta répartition actuelle.",
    idea: {
      title: "Écrire mon allocation cible",
      description:
        "Profil de risque, répartition cible, règle de rééquilibrage et versements programmés.",
    },
    sources: [amf, financePourTous],
    version: "1.0.0",
    editorialStatus,
    flashcards: [
      {
        front: "Profil de risque",
        back: "Horizon, capacité à perdre, tolérance aux baisses.",
      },
      {
        front: "Allocation d’actifs",
        back: "Répartition de l’épargne entre grandes catégories : sécurité et croissance.",
      },
      {
        front: "Rééquilibrage",
        back: "Revenir à la répartition cible en vendant ce qui a monté, en achetant ce qui a baissé.",
      },
    ],
  },
  {
    id: "inv-fiscalite-placements",
    title: "La fiscalité des placements",
    domain: "Investissement",
    level: 2,
    minutes: 18,
    summary:
      "Prélèvement forfaitaire, prélèvements sociaux, avantages du PEA et de l’assurance-vie : comprendre ce que l’impôt prend vraiment sur un gain.",
    skills: [
      "Prélèvement forfaitaire unique",
      "PEA et assurance-vie",
      "Rendement après impôt",
    ],
    prerequisites: ["inv-fonds-enveloppes"],
    sections: [
      {
        title: "Pourquoi apprendre ça ?",
        body: [
          "Deux placements au même rendement brut peuvent laisser des sommes très différentes une fois l’impôt payé. Le bon support (l’enveloppe) compte autant que le placement lui-même.",
          "La fiscalité change souvent : comprendre les mécanismes permet de lire les nouveautés sans se tromper.",
        ],
      },
      {
        title: "Le prélèvement forfaitaire unique",
        body: [
          "Les intérêts, dividendes et plus-values de valeurs mobilières détenues sur un compte-titres sont soumis, par défaut, au prélèvement forfaitaire unique (PFU, ou « flat tax »). Il réunit l’impôt sur le revenu (12,8 %) et les prélèvements sociaux. Selon les sources concordantes, la loi de financement de la sécurité sociale pour 2026 a porté la CSG sur la plupart des revenus du capital de 9,2 % à 10,6 % : les prélèvements sociaux passent de 17,2 % à 18,6 %, et le PFU de 30 % à 31,4 %.",
          "Sur option globale, on peut choisir le barème progressif de l’impôt sur le revenu à la place des 12,8 %, ce qui peut être favorable aux foyers faiblement imposés. Les prélèvements sociaux restent dus.",
          "Les livrets réglementés (Livret A, LDDS, LEP) sont exonérés d’impôt et de prélèvements sociaux, dans la limite de leurs plafonds.",
        ],
      },
      {
        title: "PEA et assurance-vie",
        body: [
          "Le plan d’épargne en actions (PEA) est réservé aux actions européennes et à certains fonds. Après cinq ans de détention, les gains retirés sont exonérés d’impôt sur le revenu ; seuls les prélèvements sociaux s’appliquent. Un retrait avant cinq ans entraîne en principe la clôture et l’imposition au PFU.",
          "L’assurance-vie bénéficie de règles propres : selon les sources, elle a été exclue de la hausse de CSG de 2026, ses prélèvements sociaux restant à 17,2 %. Après huit ans, les gains retirés bénéficient d’un abattement annuel (4 600 € pour une personne seule, 9 200 € pour un couple soumis à imposition commune) avant imposition, à un taux réduit sur les versements jusqu’à un certain montant. Elle offre aussi un cadre de transmission spécifique.",
          "Seuls les gains sont imposés lors d’un retrait, pas le capital versé : un rachat partiel contient une part de capital et une part de gains, calculée au prorata.",
        ],
      },
      {
        title: "Le point de vigilance",
        body: [
          "La fiscalité ne doit pas guider seule le choix : un PEA investi dans un seul titre ou une assurance-vie aux frais élevés peut coûter plus que l’avantage fiscal.",
          "Les taux, abattements et plafonds se vérifient chaque année sur impots.gouv.fr : la loi de finances et la loi de financement de la sécurité sociale les modifient régulièrement.",
        ],
      },
    ],
    example: {
      title: "Exemple fictif · 1 000 € de gain dans trois enveloppes",
      body: "Camille réalise 1 000 € de plus-value en 2026. Sur un compte-titres, au PFU de 31,4 %, il lui reste 686 €. Sur un PEA de plus de cinq ans, seuls les prélèvements sociaux de 18,6 % s’appliquent : il lui reste 814 €. Sur une assurance-vie de plus de huit ans, si le gain reste dans son abattement annuel, elle ne paie que les prélèvements sociaux de 17,2 % : il lui reste 828 €. Les frais de chaque enveloppe doivent ensuite être comparés.",
    },
    exercise: {
      prompt:
        "Un épargnant retire 10 000 € d’un contrat d’assurance-vie valant 25 000 €, dont 20 000 € de versements. Quelle part du retrait correspond à des gains ?",
      hint: "Part de gains dans le contrat = (valeur − versements) ÷ valeur, appliquée au retrait.",
      answer:
        "Gains dans le contrat : 5 000 €, soit 20 % de sa valeur. Sur le retrait de 10 000 €, 2 000 € sont des gains imposables et 8 000 € du capital non imposé.",
      explanation:
        "L’impôt ne porte que sur la part de gains du retrait, calculée au prorata : un retrait n’est jamais imposé en totalité.",
    },
    quiz: [
      {
        id: "inv-fisca-1",
        question:
          "Selon les sources consultées, de quoi se compose le PFU de 31,4 % en 2026 ?",
        options: [
          "Uniquement d’impôt sur le revenu.",
          "De 12,8 % d’impôt sur le revenu et de 18,6 % de prélèvements sociaux.",
          "De 30 % d’impôt et 1,4 % de frais bancaires.",
        ],
        answer: 1,
        explanation:
          "La hausse de 2026 porte sur la CSG, donc sur les prélèvements sociaux ; la part d’impôt sur le revenu reste à 12,8 %.",
      },
      {
        id: "inv-fisca-2",
        question:
          "Après cinq ans de détention, quels prélèvements s’appliquent aux gains retirés d’un PEA ?",
        options: [
          "Aucun prélèvement.",
          "Les prélèvements sociaux seulement ; les gains sont exonérés d’impôt sur le revenu.",
          "Le PFU complet.",
        ],
        answer: 1,
        explanation:
          "L’avantage du PEA après cinq ans porte sur l’impôt sur le revenu ; les prélèvements sociaux restent dus.",
      },
    ],
    application:
      "Pour chacun de tes placements, note l’enveloppe, la fiscalité applicable à un retrait et les frais annuels, puis calcule le gain net d’impôt d’un même rendement.",
    idea: {
      title: "Comparer la fiscalité de mes placements",
      description:
        "Enveloppe, prélèvements, frais et gain net d’impôt pour chaque placement.",
    },
    sources: [amf, impots, financePourTous],
    version: "1.0.0",
    editorialStatus,
    flashcards: [
      {
        front: "PFU en 2026",
        back: "31,4 % selon les sources : 12,8 % d’impôt sur le revenu + 18,6 % de prélèvements sociaux.",
      },
      {
        front: "PEA après cinq ans",
        back: "Gains exonérés d’impôt sur le revenu ; prélèvements sociaux dus.",
      },
      {
        front: "Rachat partiel",
        back: "Seule la part de gains, calculée au prorata, est imposée.",
      },
    ],
  },
];
