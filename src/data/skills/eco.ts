import type { SkillContent } from "./types";

/** Économie : les compétences sans leçon longue. */
export const skills: SkillContent[] = [
  {
    id: "eco-inflation",
    idea: [
      "L’inflation, c’est la hausse générale des prix dans le temps. Si tout coûte 3 % de plus qu’il y a un an, ton euro achète un peu moins de choses. Ce n’est pas un produit qui augmente : c’est l’ensemble du panier de courses, d’énergie, de loyers et de services.",
      "Elle vient souvent de trois causes : la demande monte plus vite que ce qu’on produit, les coûts (énergie, matières premières) augmentent, ou les gens s’attendent à des hausses et les anticipent. Un peu d’inflation est normal ; beaucoup, c’est une taxe invisible sur ton épargne.",
      "Si ton salaire monte moins vite que les prix, tu t’appauvris sans le voir. Si ton livret rapporte moins que l’inflation, ton argent perd de la valeur, même si le chiffre affiché grossit.",
    ],
    keys: [
      "L’inflation est la hausse générale des prix, pas celle d’un seul produit.",
      "Elle réduit ce que tu peux acheter avec le même argent.",
      "Un taux d’épargne inférieur à l’inflation fait perdre du pouvoir d’achat.",
      "Compare toujours ton salaire et ton épargne à l’inflation.",
    ],
    gesture: {
      intro:
        "Mesure l’inflation sur ta propre vie : note le prix d’achats habituels il y a un an et aujourd’hui, puis compare avec ton salaire et ton épargne.",
      fields: [
        { label: "Panier de courses habituel il y a un an", example: "100 €" },
        { label: "Même panier aujourd’hui", example: "104 €" },
        { label: "Ton inflation personnelle", example: "+4 %" },
        { label: "Évolution de ton revenu sur un an", example: "+2 %" },
        { label: "Rendement de ton épargne sur un an", example: "+3 %" },
        {
          label: "Ce que ça veut dire pour toi",
          example: "mon revenu perd du pouvoir d’achat, mon épargne aussi",
        },
      ],
      tip: "Choisis toujours les mêmes produits pour que la comparaison soit juste.",
    },
    check: [
      {
        q: "Les prix montent de 2 % en un an. Ton livret rapporte 1 %. Que se passe-t-il ?",
        options: [
          "Ton épargne perd un peu de pouvoir d’achat",
          "Ton épargne gagne du pouvoir d’achat",
          "Rien, le chiffre augmente donc tu es gagnant",
        ],
        answer: 0,
        why: "Le solde augmente de 1 % mais les prix de 2 % : tu peux acheter un peu moins qu’avant.",
      },
      {
        q: "L’inflation, c’est :",
        options: [
          "la hausse du prix d’un seul produit",
          "la baisse des prix dans le temps",
          "la hausse générale des prix dans le temps",
        ],
        answer: 2,
        why: "C’est l’ensemble des prix qui monte, pas un produit isolé.",
      },
      {
        q: "Ton salaire monte de 1 % alors que l’inflation est à 3 %. Ton pouvoir d’achat :",
        options: ["augmente", "baisse", "reste identique"],
        answer: 1,
        why: "Tes revenus progressent moins vite que les prix, tu peux donc acheter moins.",
      },
    ],
  },
  {
    id: "eco-taux",
    idea: [
      "La banque centrale (en Europe, la BCE) fixe le prix auquel les banques peuvent lui emprunter de l’argent : ce sont les taux directeurs. Quand il monte, les banques empruntent plus cher et répercutent ce coût sur leurs clients.",
      "Résultat : quand les taux montent, tes crédits deviennent plus chers, mais l’épargne est souvent mieux payée. Quand ils baissent, emprunter coûte moins, mais l’épargne rapporte moins. La banque centrale les ajuste surtout pour freiner l’inflation ou relancer l’activité.",
      "Pour toi, c’est utile avant d’emprunter pour un camion ou un local : un taux plus bas de 1 point sur 20 000 € peut changer le coût total de plusieurs centaines d’euros.",
    ],
    keys: [
      "Les taux directeurs sont le prix de l’argent pour les banques.",
      "Taux en hausse : crédits plus chers, épargne souvent mieux payée.",
      "Taux en baisse : crédits moins chers, épargne moins rémunérée.",
      "La banque centrale les relève surtout pour freiner l’inflation.",
    ],
    gesture: {
      intro:
        "Remplis cette fiche pour comprendre, en une page, l’effet d’un changement de taux sur toi. Elle te servira à chaque annonce de la banque centrale.",
      fields: [
        {
          label: "Dernière décision de la banque centrale",
          example: "taux relevés de 0,25 point",
        },
        { label: "Raison donnée", example: "freiner l’inflation" },
        {
          label: "Effet sur un crédit que je pourrais prendre",
          example: "mensualité plus élevée",
        },
        { label: "Effet sur mon épargne", example: "livret un peu mieux payé" },
        { label: "Ce que je décide", example: "attendre avant d’emprunter" },
      ],
      tip: "Retrouve l’annonce sur le site de la BCE ou dans un article d’actualité, et note la raison avec tes mots.",
    },
    check: [
      {
        q: "La banque centrale relève ses taux. En général, pour un crédit :",
        options: [
          "il devient plus cher",
          "il devient moins cher",
          "il ne change jamais",
        ],
        answer: 0,
        why: "Les banques paient plus cher leur argent et répercutent la hausse sur les crédits.",
      },
      {
        q: "Pourquoi la banque centrale relève-t-elle ses taux ?",
        options: [
          "pour faire monter les prix",
          "pour freiner l’inflation",
          "pour donner de l’argent à l’État",
        ],
        answer: 1,
        why: "Un argent plus cher refroidit la demande et calme la hausse des prix.",
      },
      {
        q: "Quand les taux baissent, l’épargne simple (livret) :",
        options: [
          "rapporte plus",
          "ne dépend jamais des taux",
          "rapporte souvent moins",
        ],
        answer: 2,
        why: "Les taux d’épargne suivent généralement le prix de l’argent : il baisse, donc l’épargne aussi.",
      },
    ],
  },
  {
    id: "eco-pib",
    idea: [
      "Trois chiffres reviennent tout le temps aux infos. Le PIB : la valeur de tout ce qui est produit dans un pays sur une période. Quand on dit « croissance de 1 % », on dit que cette valeur a augmenté de 1 % par rapport à avant.",
      "Le taux de chômage, c’est la part des personnes qui cherchent un emploi parmi celles qui travaillent ou en cherchent. La dette publique, c’est tout ce que l’État doit : on la compare souvent au PIB pour savoir si elle est lourde ou non.",
      "Ces chiffres ne se lisent pas seuls : une croissance faible avec un chômage qui monte inquiète, une dette qui grossit plus vite que le PIB aussi. Pour décoder un article, repère le chiffre, sa comparaison et sa cause.",
    ],
    keys: [
      "PIB : la valeur de ce qu’un pays produit sur une période.",
      "Croissance : l’évolution du PIB d’une période à l’autre.",
      "Chômage : la part des actifs qui cherchent un emploi sans en trouver.",
      "Dette publique : ce que l’État doit, souvent comparée au PIB.",
    ],
    gesture: {
      intro:
        "Prends un article d’actualité économique et remplis cette fiche. En trois minutes, tu sauras dire ce qu’il annonce vraiment.",
      fields: [
        {
          label: "Titre de l’article",
          example: "La croissance ralentit au 3e trimestre",
        },
        { label: "Chiffre principal", example: "+0,2 % de croissance" },
        { label: "Comparé à quoi ?", example: "+0,5 % le trimestre précédent" },
        { label: "Cause avancée", example: "baisse de la consommation" },
        {
          label: "Conséquence possible pour moi",
          example: "moins de commandes de clients",
        },
        {
          label: "Ce que je retiens en une phrase",
          example: "l’économie ralentit sans reculer",
        },
      ],
      tip: "Un chiffre sans point de comparaison ne veut rien dire : cherche toujours « par rapport à quoi ».",
    },
    check: [
      {
        q: "Le PIB mesure :",
        options: [
          "la dette de l’État",
          "la valeur de ce qu’un pays produit sur une période",
          "le nombre de chômeurs",
        ],
        answer: 1,
        why: "C’est la valeur de la production du pays : biens et services.",
      },
      {
        q: "Un article annonce « croissance de 0,2 % ». Cela veut dire que :",
        options: [
          "la production a augmenté de 0,2 % par rapport à la période précédente",
          "le pays a perdu 0,2 % de ses emplois",
          "la dette a baissé de 0,2 %",
        ],
        answer: 0,
        why: "La croissance est la variation du PIB entre deux périodes.",
      },
      {
        q: "Le taux de chômage correspond à :",
        options: [
          "la part de la population totale sans travail",
          "la part des actifs qui cherchent un emploi sans en trouver",
          "le nombre de retraités",
        ],
        answer: 1,
        why: "On compte parmi les personnes actives (qui travaillent ou cherchent) celles qui n’ont pas d’emploi.",
      },
    ],
  },
  {
    id: "eco-marches",
    idea: [
      "La bourse bouge parce que des milliers d’acheteurs et de vendeurs réagissent à des informations. Quand une bonne nouvelle arrive sur une entreprise, plus de gens veulent acheter, donc le prix monte. Quand une mauvaise nouvelle tombe, plus de gens vendent, donc il baisse.",
      "Les infos qui comptent le plus : les résultats des entreprises, les décisions sur les taux, les chiffres d’inflation ou de chômage, et l’actualité politique ou mondiale. Les marchés regardent surtout l’avenir : une bonne nouvelle déjà attendue fait peu bouger les prix.",
      "Ne conclus pas trop vite : une même info peut faire monter une action et en faire baisser une autre. L’exercice, c’est d’apprendre à relier une nouvelle à un mouvement, pas de deviner les prix de demain.",
    ],
    keys: [
      "Les prix bougent selon l’offre et la demande des investisseurs.",
      "Les marchés réagissent à l’avenir, pas seulement au passé.",
      "Taux, résultats, inflation et actualité mondiale font bouger la bourse.",
      "Une info déjà attendue change peu les prix.",
    ],
    gesture: {
      intro:
        "Choisis une info récente et relie-la à un mouvement de marché. C’est le réflexe qui t’évitera de paniquer devant une baisse.",
      fields: [
        {
          label: "Info du jour",
          example: "la banque centrale baisse ses taux",
        },
        {
          label: "Marché ou action concerné",
          example: "indice des actions européennes",
        },
        { label: "Mouvement observé", example: "+1 % dans la journée" },
        {
          label: "Mon explication",
          example: "emprunter coûtera moins cher aux entreprises",
        },
        {
          label: "Ce qui pourrait me contredire",
          example: "la baisse était déjà prévue",
        },
      ],
      tip: "Écris l’explication avant de regarder ce que disent les commentateurs : tu progresseras plus vite.",
    },
    check: [
      {
        q: "Une entreprise annonce de très bons résultats, mais déjà attendus par tous. Le cours de l’action :",
        options: [
          "peut peu bouger, car la nouvelle est déjà dans les prix",
          "monte forcément beaucoup",
          "s’effondre toujours",
        ],
        answer: 0,
        why: "Les marchés réagissent à ce qui est nouveau par rapport aux attentes.",
      },
      {
        q: "Plus de gens veulent vendre une action que l’acheter. Son prix :",
        options: ["monte", "reste fixe", "baisse"],
        answer: 2,
        why: "Quand l’offre dépasse la demande, le prix recule.",
      },
      {
        q: "Quelle information peut faire bouger la bourse ?",
        options: [
          "Seulement la météo du jour",
          "Les résultats d’entreprises, les taux, l’inflation ou l’actualité mondiale",
          "Uniquement le jour de la semaine",
        ],
        answer: 1,
        why: "Ces éléments changent les perspectives des entreprises et donc l’envie d’acheter ou de vendre.",
      },
    ],
  },
  {
    id: "eco-mondialisation",
    idea: [
      "Presque tout ce que tu achètes a voyagé : un composant fabriqué en Asie, un matériau venu d’un autre pays, un logiciel conçu ailleurs. Le commerce mondial, c’est cet échange constant de produits et de services entre pays.",
      "Trois leviers influencent les prix. Les droits de douane : une taxe sur les produits importés, qui les rend plus chers. Le taux de change : la valeur d’une monnaie par rapport à une autre. Les matières premières (pétrole, cuivre, blé) : quand leur prix monte, beaucoup de produits suivent.",
      "Pour une petite entreprise, cela veut dire une chose simple : si tu achètes du matériel ou des fournitures importés, une taxe nouvelle ou une monnaie qui bouge peut changer ta marge. Mieux vaut le prévoir que le subir.",
    ],
    keys: [
      "Les droits de douane sont une taxe sur les produits qui entrent dans un pays.",
      "Le taux de change dit combien vaut une monnaie en une autre.",
      "Le prix des matières premières se répercute sur beaucoup de produits.",
      "Une entreprise qui importe doit surveiller ces trois éléments.",
    ],
    gesture: {
      intro:
        "Prends un produit que tu achètes ou vends et cherche d’où il vient et ce qui peut faire varier son prix.",
      fields: [
        { label: "Produit étudié", example: "perceuse sans fil" },
        { label: "Pays de fabrication", example: "Chine" },
        { label: "Monnaie d’achat", example: "dollar" },
        {
          label: "Matière première principale",
          example: "cuivre et plastique",
        },
        {
          label: "Risque de hausse de prix",
          example: "taxe à l’importation ou dollar plus fort",
        },
        { label: "Ma parade", example: "stock pour 3 mois, 2e fournisseur" },
      ],
      tip: "Même sans importer toi-même, demande à ton fournisseur d’où viennent les produits.",
    },
    check: [
      {
        q: "Un droit de douane, c’est :",
        options: [
          "une taxe sur les produits importés",
          "une aide pour les produits importés",
          "un prix fixé par la banque centrale",
        ],
        answer: 0,
        why: "Le pays taxe l’entrée de produits venus de l’étranger, ce qui les rend plus chers.",
      },
      {
        q: "L’euro baisse face au dollar. Un produit acheté en dollars coûte, en euros :",
        options: ["moins cher", "plus cher", "exactement pareil"],
        answer: 1,
        why: "Il faut plus d’euros pour obtenir la même somme en dollars.",
      },
      {
        q: "Le prix du pétrole grimpe fortement. Quel effet probable sur les prix ?",
        options: [
          "Aucun, ils ne sont pas liés",
          "Les transports et beaucoup de produits deviennent plus chers",
          "Tout baisse partout",
        ],
        answer: 1,
        why: "L’énergie entre dans le coût de fabrication et de transport de nombreux produits.",
      },
    ],
  },
  {
    id: "eco-crises",
    idea: [
      "En 2008, la crise est partie des États-Unis : des banques avaient prêté à des ménages qui ne pouvaient pas rembourser (les « subprimes »), puis revendu ces crédits à travers le monde. Quand les impayés se sont multipliés, la confiance a disparu, des banques ont fait faillite et l’économie a ralenti partout.",
      "En 2020, la cause était différente : la pandémie a stoppé l’activité d’un coup, avec des confinements. Les États ont soutenu les entreprises et les salariés avec beaucoup d’argent public, et les banques centrales ont garanti que le crédit continue.",
      "Ce qu’on retient : une crise est souvent une perte de confiance qui se propage, les États et banques centrales finissent par intervenir, et les petites entreprises survivent mieux avec de la trésorerie et peu de dépendance à un seul client.",
    ],
    keys: [
      "2008 : une crise financière née de crédits immobiliers non remboursés.",
      "2020 : un arrêt brutal de l’activité à cause de la pandémie.",
      "Une crise se propage par la perte de confiance.",
      "Trésorerie de côté et clients variés protègent une petite entreprise.",
    ],
    gesture: {
      intro:
        "Imagine qu’une crise arrive demain. Remplis cette fiche pour savoir comment ton activité tiendrait le choc.",
      fields: [
        {
          label: "Mois de charges couverts par ma trésorerie",
          example: "2 mois",
        },
        {
          label: "Part du client le plus important dans mon chiffre d’affaires",
          example: "40 %",
        },
        {
          label: "Charges que je pourrais réduire vite",
          example: "abonnements, location de matériel",
        },
        {
          label: "Aide ou interlocuteur à contacter",
          example: "mon banquier, ma chambre de métiers",
        },
        {
          label: "Première action si l’activité chute",
          example: "prévenir mon banquier et revoir mes dépenses",
        },
      ],
      tip: "Un objectif simple : tenir trois mois de charges sans aucun nouveau client.",
    },
    check: [
      {
        q: "Quelle est l’origine de la crise de 2008 ?",
        options: [
          "Un virus qui a arrêté l’activité",
          "Des crédits immobiliers non remboursés diffusés dans le système financier",
          "Une chute du prix de la nourriture",
        ],
        answer: 1,
        why: "Les subprimes ont déclenché des pertes en chaîne dans les banques.",
      },
      {
        q: "En 2020, quelle a été la cause principale du choc économique ?",
        options: [
          "Un arrêt brutal de l’activité à cause de la pandémie",
          "Une faillite de banques américaines",
          "Une hausse des impôts",
        ],
        answer: 0,
        why: "Les confinements ont stoppé commerces, transports et services en quelques semaines.",
      },
      {
        q: "Qu’est-ce qui aide le plus une petite entreprise à passer une crise ?",
        options: [
          "Dépendre d’un seul gros client",
          "Avoir de la trésorerie de côté et des clients variés",
          "Ne rien prévoir et attendre",
        ],
        answer: 1,
        why: "Une réserve donne du temps et plusieurs clients évitent qu’une seule perte te mette en danger.",
      },
    ],
  },
];
