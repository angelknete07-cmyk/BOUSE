import type { SkillContent } from "./types";

/** Marketing : les compétences sans leçon longue. */
export const skills: SkillContent[] = [
  {
    id: "mkt-cible",
    idea: [
      "Parler à tout le monde, c’est ne parler à personne. Ton client idéal est la personne qui a le plus besoin de ce que tu fais, qui peut payer ton prix et qui te recommandera ensuite. Plus tu le décris précisément, plus ton message tombe juste.",
      "Décris-le comme une vraie personne : son âge approximatif, où il vit, ce qu’il cherche, ce qui l’agace, où il cherche des informations. Par exemple « propriétaire de 45 ans, maison des années 1970, factures de chauffage trop élevées, cherche sur Google et demande à ses voisins ».",
      "Cette fiche n’est pas figée. Parle à tes vrais clients, observe qui revient et qui te recommande : ajuste ton portrait avec ce que tu apprends.",
    ],
    keys: [
      "Parler à tout le monde, c’est ne parler à personne.",
      "Décris ton client idéal comme une vraie personne.",
      "Note ce qu’il cherche, ce qui l’agace et où il s’informe.",
      "Ajuste la fiche avec tes vrais clients.",
    ],
    gesture: {
      intro:
        "Remplis la fiche de ton client idéal. Pense à une personne réelle que tu as déjà servie ou que tu voudrais servir.",
      fields: [
        {
          label: "Qui est-il ? (âge, situation, lieu)",
          example: "propriétaire, 45 ans, maison de 1975, près de Lyon",
        },
        {
          label: "Ce qu’il cherche",
          example: "une maison plus chaude et une facture plus basse",
        },
        {
          label: "Ce qui l’agace aujourd’hui",
          example: "les devis flous et les artisans qui ne rappellent pas",
        },
        {
          label: "Où il s’informe",
          example: "Google, bouche-à-oreille, Facebook du quartier",
        },
        {
          label: "Ce qui le fait acheter",
          example: "avis clairs, devis détaillé, réponse rapide",
        },
        { label: "Ce qui le fait fuir", example: "prix cachés, retards" },
      ],
      tip: "Donne-lui un prénom : cela t’aidera à écrire pour une seule personne.",
    },
    check: [
      {
        q: "Pourquoi cibler un client précis ?",
        options: [
          "Pour exclure des clients",
          "Pour que ton message parle vraiment à quelqu’un",
          "Pour augmenter tes prix",
        ],
        answer: 1,
        why: "Un message précis touche mieux qu’un message pour tout le monde.",
      },
      {
        q: "Quelle description est la plus utile ?",
        options: [
          "Toute personne ayant besoin de travaux",
          "Propriétaire de 45 ans, maison ancienne, factures de chauffage trop élevées",
          "Les gens",
        ],
        answer: 1,
        why: "Une description concrète permet de savoir où le trouver et que lui dire.",
      },
      {
        q: "Comment améliorer ta fiche client ?",
        options: [
          "La laisser telle quelle toute ta vie",
          "La confronter à tes vrais clients et l’ajuster",
          "La recopier d’un concurrent",
        ],
        answer: 1,
        why: "Tes clients réels te montrent qui achète vraiment et pourquoi.",
      },
    ],
  },
  {
    id: "mkt-message",
    idea: [
      "Ton message est la phrase qui dit pourquoi un client devrait te choisir. Il doit être clair, centré sur le client et différent de ce que dit la concurrence. « Plombier de qualité » ne dit rien : tous les plombiers le disent.",
      "Une bonne formule : « J’aide [qui] à [obtenir quel résultat], sans [quel problème] ». Par exemple : « J’aide les propriétaires à avoir une salle de bain finie en 8 jours, sans mauvaise surprise sur le prix ». Elle parle du résultat, pas de toi.",
      "Teste-la sur trois personnes : si elles la reformulent correctement et trouvent que ça les concerne, elle marche. Sinon, simplifie et précise.",
    ],
    keys: [
      "Un bon message est clair, centré sur le client et différent des autres.",
      "Parle du résultat, pas de ton métier.",
      "Formule : j’aide [qui] à [résultat] sans [problème].",
      "Teste-la sur trois personnes.",
    ],
    gesture: {
      intro:
        "Écris plusieurs versions de ton message, puis garde la meilleure après les avoir testées sur des proches.",
      fields: [
        { label: "Mon client", example: "les propriétaires pressés" },
        {
          label: "Le résultat que je lui apporte",
          example: "une salle de bain finie en 8 jours",
        },
        {
          label: "Le problème que j’évite",
          example: "les mauvaises surprises sur le prix",
        },
        {
          label: "Mon message : version 1",
          example:
            "J’aide les propriétaires à avoir une salle de bain finie en 8 jours, sans surprise de prix.",
        },
        {
          label: "Version 2, plus courte",
          example: "Salle de bain finie en 8 jours, prix garanti.",
        },
        {
          label: "Ce que mes 3 testeurs ont compris",
          example: "ils ont compris rapidité et prix fixe",
        },
      ],
      tip: "Rayer chaque mot qui pourrait être écrit par ton concurrent rend ton message plus unique.",
    },
    check: [
      {
        q: "Quel message est le plus fort ?",
        options: [
          "Entreprise sérieuse et de qualité",
          "Salle de bain finie en 8 jours, prix garanti",
          "Nous sommes les meilleurs",
        ],
        answer: 1,
        why: "Il promet un résultat précis et mesurable, que les autres ne promettent pas.",
      },
      {
        q: "Un bon message parle surtout de :",
        options: [
          "ton entreprise et son histoire",
          "tes diplômes",
          "ce que le client obtient",
        ],
        answer: 2,
        why: "Le client veut savoir ce que ça change pour lui.",
      },
      {
        q: "Comment vérifier que ton message fonctionne ?",
        options: [
          "Le tester auprès de quelques personnes et voir si elles comprennent",
          "Le trouver joli toi-même",
          "Le changer chaque jour",
        ],
        answer: 0,
        why: "Si des inconnus le reformulent correctement, c’est qu’il est clair.",
      },
    ],
  },
  {
    id: "mkt-reseaux",
    idea: [
      "Les réseaux sociaux demandent du temps. Le piège est d’être partout et de ne rien faire correctement. Choisis un seul réseau, celui où se trouve ton client idéal, et publie régulièrement avant d’en ajouter un autre.",
      "Pour un artisan ou un commerçant local, les photos de réalisations, les coulisses, les avis clients et les petits conseils fonctionnent bien. Un rythme tenable vaut mieux qu’un rythme parfait : par exemple deux publications par semaine pendant trois mois.",
      "Prépare tes idées à l’avance dans un calendrier. Prends tes photos pendant le travail, en fin de chantier. À la fin de chaque mois, regarde ce qui a été le plus aimé et refais-en davantage.",
    ],
    keys: [
      "Choisis un seul réseau où se trouve ton client.",
      "Un rythme tenable vaut mieux qu’un rythme parfait.",
      "Photos de réalisations, coulisses, conseils et avis marchent bien.",
      "Prépare tes idées dans un calendrier.",
    ],
    gesture: {
      intro:
        "Construis ton calendrier de publication pour quatre semaines. Choisis un rythme que tu peux vraiment tenir.",
      fields: [
        { label: "Mon réseau principal", example: "Instagram" },
        {
          label: "Mon rythme",
          example: "2 publications par semaine, mardi et vendredi",
        },
        {
          label: "Semaine 1",
          example: "photo avant-après d’un chantier, conseil d’entretien",
        },
        {
          label: "Semaine 2",
          example: "coulisses du chantier, avis d’un client",
        },
        {
          label: "Semaine 3",
          example:
            "présentation de mon métier, réponse à une question fréquente",
        },
        {
          label: "Semaine 4",
          example: "bilan du mois et annonce de mes disponibilités",
        },
      ],
      tip: "Prends tes photos pendant le chantier : tu auras de quoi publier pendant un mois.",
    },
    check: [
      {
        q: "Combien de réseaux faut-il pour commencer ?",
        options: ["Tous", "Un seul, bien utilisé", "Au moins cinq"],
        answer: 1,
        why: "Mieux vaut un réseau tenu régulièrement que cinq abandonnés.",
      },
      {
        q: "Quel rythme est le meilleur ?",
        options: [
          "Dix publications la première semaine, puis plus rien",
          "Un rythme réaliste que tu tiens sur plusieurs mois",
          "Une publication par an",
        ],
        answer: 1,
        why: "La régularité compte plus que l’intensité du début.",
      },
      {
        q: "Quel contenu fonctionne bien pour un artisan ?",
        options: [
          "Des photos de réalisations et des conseils concrets",
          "Des phrases à la mode sans rapport avec ton métier",
          "Des publicités uniquement",
        ],
        answer: 0,
        why: "Elles montrent ton savoir-faire et rassurent les futurs clients.",
      },
    ],
  },
  {
    id: "mkt-google",
    idea: [
      "Quand quelqu’un cherche « plombier près de moi » ou « boulangerie ouverte dimanche », Google montre d’abord les fiches d’établissement avec une carte, des horaires et des avis. Être présent à cet endroit est l’une des actions les plus rentables pour un commerce ou un artisan local.",
      "Une bonne fiche est complète et vraie : nom exact, adresse ou zone d’intervention, téléphone, horaires, catégorie d’activité, photos réelles, description claire. Les avis comptent beaucoup : demande-les aux clients satisfaits et réponds à chacun, y compris aux critiques, calmement.",
      "Un site simple en plus renforce la confiance : une page avec ce que tu fais, où, comment te joindre et quelques photos suffit. Garde les mêmes informations partout (fiche, site, réseaux).",
    ],
    keys: [
      "La fiche d’établissement Google est gratuite et très visible en local.",
      "Remplis-la entièrement avec des informations exactes.",
      "Demande des avis aux clients satisfaits et réponds à tous.",
      "Garde les mêmes informations partout.",
    ],
    gesture: {
      intro:
        "Prépare tous les éléments de ta fiche avant de la créer. Il ne restera plus qu’à les recopier dans Google.",
      fields: [
        { label: "Nom exact de l’entreprise", example: "Martin Plomberie" },
        {
          label: "Adresse ou zone d’intervention",
          example: "Lyon et 20 km autour",
        },
        {
          label: "Téléphone et horaires",
          example: "06 00 00 00 00, lundi au vendredi 8 h à 18 h",
        },
        { label: "Catégorie principale", example: "Plombier" },
        {
          label: "Description en 2 phrases",
          example:
            "Dépannage et rénovation de salles de bain. Intervention sous 24 heures.",
        },
        {
          label: "5 photos à ajouter",
          example: "véhicule, réalisation, équipe, outils, avant-après",
        },
        {
          label: "Clients à qui demander un avis",
          example: "les 5 derniers clients satisfaits",
        },
      ],
      tip: "Ajoute une photo récente tous les mois : une fiche vivante inspire confiance.",
    },
    check: [
      {
        q: "Pourquoi une fiche Google complète est-elle utile ?",
        options: [
          "Elle apparaît quand des clients cherchent près d’eux",
          "Elle remplace ton métier",
          "Elle empêche les concurrents d’exister",
        ],
        answer: 0,
        why: "Elle te rend visible au moment précis où quelqu’un cherche ton service.",
      },
      {
        q: "Un client laisse un avis critique. Que fais-tu ?",
        options: [
          "Tu le supprimes",
          "Tu l’ignores",
          "Tu réponds calmement et proposes une solution",
        ],
        answer: 2,
        why: "Une réponse polie montre ton sérieux aux futurs clients qui lisent.",
      },
      {
        q: "Les informations de ta fiche (téléphone, horaires) doivent être :",
        options: [
          "Exactes et identiques partout",
          "Différentes sur chaque support",
          "Facultatives",
        ],
        answer: 0,
        why: "Des informations contradictoires perdent des clients et la confiance.",
      },
    ],
  },
  {
    id: "mkt-bouche-oreille",
    idea: [
      "Le bouche-à-oreille est la forme de marketing la plus forte : un proche te recommande, la confiance est déjà là. Mais il ne tombe pas du ciel. Il se provoque : un client content raconte plus facilement son expérience si tu lui en donnes une raison et une occasion.",
      "Trois leviers simples. Offrir une expérience qui vaut la peine d’être racontée (ponctualité, chantier propre, petit geste inattendu). Demander clairement une recommandation. Faciliter le partage : carte de visite, lien vers ta fiche Google, message prêt à transférer.",
      "Remercie chaque personne qui te recommande, même si elle n’achète pas. Un petit mot ou un geste suffit. Et note d’où vient chaque nouveau client pour savoir qui parle de toi.",
    ],
    keys: [
      "Le bouche-à-oreille se provoque, il ne se subit pas.",
      "Offre une expérience qui mérite d’être racontée.",
      "Demande clairement une recommandation.",
      "Remercie ceux qui parlent de toi.",
    ],
    gesture: {
      intro:
        "Prépare ton plan pour que tes clients parlent de toi. Tu peux l’appliquer dès cette semaine.",
      fields: [
        {
          label: "Mon petit geste qui marque",
          example: "je nettoie le chantier et je laisse une note d’entretien",
        },
        {
          label: "Quand je demande une recommandation",
          example: "le jour de la fin des travaux, quand le client sourit",
        },
        {
          label: "Ma phrase pour demander",
          example:
            "Si vous êtes content, parlez de moi à vos proches, ça m’aide beaucoup.",
        },
        {
          label: "Ce que je leur remets",
          example: "2 cartes de visite et le lien vers ma fiche Google",
        },
        {
          label: "Comment je remercie",
          example:
            "un mot de remerciement et une petite remise sur leur prochaine intervention",
        },
      ],
      tip: "Demande toujours à la fin d’une bonne prestation : c’est à ce moment que le client est le plus enthousiaste.",
    },
    check: [
      {
        q: "Pourquoi le bouche-à-oreille est-il si efficace ?",
        options: [
          "Il est gratuit pour tout le monde",
          "Il repose sur la confiance d’un proche",
          "Il est obligatoire",
        ],
        answer: 1,
        why: "On croit plus facilement un proche qu’une publicité.",
      },
      {
        q: "Quel est le meilleur moment pour demander une recommandation ?",
        options: [
          "Quand le client est satisfait de la prestation",
          "Avant de commencer le travail",
          "Jamais, ce serait gênant",
        ],
        answer: 0,
        why: "Un client content répond volontiers et son enthousiasme est au plus haut.",
      },
      {
        q: "Un client te recommande à un ami qui n’achète finalement pas. Que fais-tu ?",
        options: [
          "Tu ne dis rien",
          "Tu remercies quand même le client",
          "Tu lui reproches",
        ],
        answer: 1,
        why: "Remercier encourage le client à recommencer.",
      },
    ],
  },
  {
    id: "mkt-pub",
    idea: [
      "Une petite pub en ligne se teste avec peu d’argent : 50 € suffisent pour savoir si une annonce attire des clients. On ne dépense pas gros dès le départ : on teste une idée, on regarde les résultats, puis on garde ce qui marche.",
      "Les chiffres à lire sont simples : combien de personnes ont vu la pub, combien ont cliqué, combien ont contacté ou acheté, et ce que coûte un contact. Si 50 € t’apportent 5 demandes de devis, une demande te coûte 10 €. À toi de comparer avec ce que rapporte un client.",
      "Ne change qu’un élément à la fois (le texte, l’image ou le public). Fixe d’avance ton seuil : « si je paie moins de 15 € par demande, je continue ». Si tu ne peux pas mesurer, ne dépense pas.",
    ],
    keys: [
      "Teste avec un petit budget avant de dépenser plus.",
      "Lis quatre chiffres : vues, clics, demandes, coût par demande.",
      "Change un seul élément à la fois.",
      "Fixe ton seuil de réussite avant de lancer.",
    ],
    gesture: {
      intro:
        "Écris ton plan de test avant de lancer la moindre pub. Cela t’évite de dépenser sans savoir pourquoi.",
      fields: [
        { label: "Budget du test", example: "50 € sur 7 jours" },
        {
          label: "Public visé",
          example: "propriétaires de 35 à 65 ans, à 20 km",
        },
        {
          label: "Message de la pub",
          example: "Salle de bain finie en 8 jours, devis gratuit",
        },
        { label: "Résultat que j’espère", example: "5 demandes de devis" },
        { label: "Seuil pour continuer", example: "moins de 15 € par demande" },
        {
          label: "Résultats réels (à remplir après)",
          example: "4 demandes, soit 12,50 € chacune",
        },
        {
          label: "Ma décision",
          example: "je continue avec 100 € la semaine suivante",
        },
      ],
      tip: "Demande à chaque nouveau client comment il t’a trouvé pour relier les demandes à ta pub.",
    },
    check: [
      {
        q: "Tu dépenses 50 € et obtiens 5 demandes de devis. Le coût par demande est de :",
        options: ["5 €", "10 €", "50 €"],
        answer: 1,
        why: "50 ÷ 5 = 10 € par demande.",
      },
      {
        q: "Pourquoi ne modifier qu’un seul élément à la fois ?",
        options: [
          "Pour comprendre ce qui a fait la différence",
          "Parce que les plateformes l’exigent",
          "Pour dépenser moins de temps",
        ],
        answer: 0,
        why: "Si tu changes tout, tu ne sais pas ce qui a marché.",
      },
      {
        q: "Quand fixer le seuil qui justifie de continuer ?",
        options: [
          "Après avoir vu les résultats",
          "Avant de lancer la pub",
          "Jamais",
        ],
        answer: 1,
        why: "Un seuil fixé à l’avance évite de se convaincre après coup.",
      },
    ],
  },
  {
    id: "mkt-mesurer",
    idea: [
      "Beaucoup de petits entrepreneurs ne savent pas d’où viennent leurs clients : Google, bouche-à-oreille, réseaux, voisin, pub ? Sans le savoir, tu risques de dépenser du temps et de l’argent sur ce qui ne marche pas, et de négliger ce qui marche.",
      "La méthode la plus simple : demander à chaque nouveau client « comment m’avez-vous connu ? » et noter la réponse dans un tableau. En fin de mois, compte combien de clients viennent de chaque source, et combien ils t’ont rapporté.",
      "Ce tableau te dit où mettre ton énergie. Si la moitié de tes clients viennent du bouche-à-oreille et presque aucun de ta pub, tu sais où investir. Garde-le simple : trois colonnes suffisent.",
    ],
    keys: [
      "Demande à chaque client comment il t’a connu.",
      "Note la réponse dans un tableau simple.",
      "Compare chaque source en nombre de clients et en chiffre d’affaires.",
      "Investis là où ça marche, abandonne ce qui ne rapporte rien.",
    ],
    gesture: {
      intro:
        "Remplis ce tableau d’acquisition chaque mois. Il t’indique de quelle source viennent tes clients.",
      fields: [
        {
          label: "Source 1 : bouche-à-oreille",
          example: "8 clients, 6 400 € de chiffre d’affaires",
        },
        { label: "Source 2 : Google", example: "5 clients, 3 500 €" },
        { label: "Source 3 : réseaux sociaux", example: "2 clients, 800 €" },
        {
          label: "Source 4 : publicité payante",
          example: "1 client, 500 € (pour 50 € dépensés)",
        },
        { label: "Source la plus rentable", example: "le bouche-à-oreille" },
        {
          label: "Ma décision pour le mois prochain",
          example:
            "demander plus de recommandations et soigner ma fiche Google",
        },
      ],
      tip: "Ajoute une case « comment m’avez-vous connu ? » à ton devis pour ne jamais oublier de demander.",
    },
    check: [
      {
        q: "Comment savoir d’où viennent tes clients ?",
        options: [
          "Deviner",
          "Leur demander et noter la réponse",
          "Regarder la météo",
        ],
        answer: 1,
        why: "La réponse du client est la source d’information la plus directe.",
      },
      {
        q: "Un tableau montre que presque aucun client ne vient de ta pub. Que fais-tu ?",
        options: [
          "Tu doubles le budget pub sans changer",
          "Tu regardes ce qui marche mieux et tu y mets plus d’énergie",
          "Tu arrêtes de suivre les chiffres",
        ],
        answer: 1,
        why: "Les chiffres servent à déplacer ton effort vers ce qui rapporte.",
      },
      {
        q: "Pourquoi compter aussi le chiffre d’affaires par source ?",
        options: [
          "Parce qu’une source peut apporter peu de clients mais de gros montants",
          "Pour faire un tableau plus long",
          "Ce n’est pas utile",
        ],
        answer: 0,
        why: "Le nombre de clients ne dit pas tout : leur valeur compte aussi.",
      },
    ],
  },
  {
    id: "mkt-strategie",
    idea: [
      "Une stratégie marketing sur un an, c’est un plan simple qui répond à quatre questions : à qui je parle, quel message je porte, par quels canaux, et quel résultat je vise. Elle te permet de choisir ce que tu fais, mais surtout ce que tu ne fais pas.",
      "Reprends ce que tu as construit : ton client idéal, ton message, un ou deux canaux principaux (fiche Google, un réseau, bouche-à-oreille) et un budget réaliste. Découpe ensuite l’année en trimestres avec un objectif chacun, par exemple le nombre de demandes de devis à obtenir.",
      "Un plan tenable vaut mieux qu’un plan ambitieux. Garde-le sur une page, relis-le chaque mois, ajuste-le avec tes chiffres. Si un canal ne donne rien après trois mois de vrai effort, remplace-le.",
    ],
    keys: [
      "Un plan répond à quatre questions : qui, quel message, quels canaux, quel résultat.",
      "Choisis un ou deux canaux principaux, pas dix.",
      "Un objectif chiffré par trimestre.",
      "Relis et ajuste ton plan chaque mois.",
    ],
    gesture: {
      intro:
        "Écris ton plan marketing annuel sur une page. Remplis-le avec tes vrais objectifs.",
      fields: [
        {
          label: "Mon client idéal",
          example: "propriétaires de maisons anciennes autour de Lyon",
        },
        {
          label: "Mon message",
          example: "Salle de bain finie en 8 jours, prix garanti",
        },
        {
          label: "Mes 2 canaux principaux",
          example: "fiche Google et bouche-à-oreille",
        },
        {
          label: "Budget de l’année",
          example: "600 € (photos, cartes, petite pub)",
        },
        {
          label: "Objectif trimestre 1",
          example: "30 demandes de devis, 10 avis Google",
        },
        {
          label: "Objectif trimestre 2 à 4",
          example: "40, 50 et 40 demandes de devis",
        },
        {
          label: "Rendez-vous mensuel avec mes chiffres",
          example: "le premier lundi du mois, 30 minutes",
        },
      ],
      tip: "Une page suffit. Si ton plan ne tient pas sur une page, il est trop compliqué pour être suivi.",
    },
    check: [
      {
        q: "Combien de canaux principaux faut-il choisir pour commencer ?",
        options: ["Un ou deux", "Dix", "Aucun"],
        answer: 0,
        why: "Concentrer ton énergie sur peu de canaux donne de meilleurs résultats.",
      },
      {
        q: "À quoi sert un objectif chiffré par trimestre ?",
        options: [
          "À avoir un chiffre joli",
          "À savoir si ton plan avance et quand l’ajuster",
          "À impressionner tes concurrents",
        ],
        answer: 1,
        why: "Sans chiffre, impossible de dire si le plan fonctionne.",
      },
      {
        q: "Un canal ne donne rien après trois mois d’efforts sérieux. Que fais-tu ?",
        options: [
          "Tu continues sans rien changer pendant des années",
          "Tu le remplaces par un autre canal",
          "Tu arrêtes le marketing",
        ],
        answer: 1,
        why: "Un plan se corrige avec les résultats : on garde ce qui marche et on change le reste.",
      },
    ],
  },
];
