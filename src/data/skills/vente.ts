import type { SkillContent } from "./types";

/** Vendre : les compétences sans leçon longue. */
export const skills: SkillContent[] = [
  {
    id: "vente-besoin",
    idea: [
      "Vendre commence par écouter. Un client n’achète pas ton produit : il achète la solution à un problème. Si tu parles de toi avant d’avoir compris sa situation, tu risques de proposer à côté de ce qu’il cherche.",
      "Les bonnes questions sont ouvertes : elles commencent par « comment », « pourquoi », « qu’est-ce que ». Elles font parler le client de sa situation, de ce qui le gêne, de ce qu’il a déjà essayé, de ce qui compte pour lui et du délai. Ensuite, reformule pour vérifier que tu as bien compris.",
      "Écoute deux fois plus que tu ne parles. Le vrai besoin n’est pas toujours celui du début : « un devis pour une peinture » peut cacher « je vends ma maison dans un mois ».",
    ],
    keys: [
      "Pose des questions ouvertes : comment, pourquoi, qu’est-ce que.",
      "Le client achète une solution, pas un produit.",
      "Reformule pour vérifier que tu as compris.",
      "Le vrai besoin se cache souvent derrière la première demande.",
    ],
    gesture: {
      intro:
        "Prépare tes 5 questions de découverte avant chaque rendez-vous. Adapte les exemples à ton métier.",
      fields: [
        {
          label: "1. Situation : où en es-tu aujourd’hui ?",
          example: "Comment faites-vous aujourd’hui pour vos chantiers ?",
        },
        {
          label: "2. Problème : qu’est-ce qui te gêne ?",
          example: "Qu’est-ce qui vous pose problème dans cette situation ?",
        },
        {
          label: "3. Conséquence : que se passe-t-il si rien ne change ?",
          example: "Que risquez-vous si cela continue ?",
        },
        {
          label: "4. Critères : qu’est-ce qui compte ?",
          example:
            "Qu’est-ce qui est le plus important pour vous : le prix, le délai, la qualité ?",
        },
        {
          label: "5. Délai et décision : pour quand et qui décide ?",
          example: "Pour quand en avez-vous besoin, et qui décide avec vous ?",
        },
      ],
      tip: "Note les mots exacts du client : tu les reprendras dans ton offre.",
    },
    check: [
      {
        q: "Quelle question est la plus utile pour découvrir un besoin ?",
        options: [
          "Voulez-vous acheter aujourd’hui ?",
          "Qu’est-ce qui vous pose problème aujourd’hui ?",
          "Vous connaissez mes tarifs ?",
        ],
        answer: 1,
        why: "Une question ouverte fait parler le client de son problème réel.",
      },
      {
        q: "Pourquoi reformuler ce que dit le client ?",
        options: [
          "Pour vérifier que tu as bien compris",
          "Pour gagner du temps de parole",
          "Pour changer de sujet",
        ],
        answer: 0,
        why: "Reformuler évite les malentendus et montre que tu écoutes.",
      },
      {
        q: "Qui doit parler le plus pendant la découverte ?",
        options: ["Toi", "Le client", "Peu importe"],
        answer: 1,
        why: "C’est le client qui détient l’information dont tu as besoin.",
      },
    ],
  },
  {
    id: "vente-pitch",
    idea: [
      "Un pitch est ta présentation en 30 secondes. Il répond à trois questions : pour qui, quel problème tu résous, et quel résultat tu apportes. Pas besoin de tout dire : il doit donner envie de poser une question.",
      "Évite de décrire ton métier (« je fais de la plomberie »). Décris le résultat (« j’aide les propriétaires à ne plus avoir de fuite, avec un dépannage en moins de 24 heures »). Un client comprend tout de suite ce que tu changes pour lui.",
      "Écris-le, dis-le à voix haute, chronomètre-le. Si tu dépasses 30 secondes ou si ta mère ne comprend pas, raccourcis. Un bon pitch finit par une question ou une proposition de rendez-vous.",
    ],
    keys: [
      "Pour qui, quel problème, quel résultat.",
      "Parle du résultat pour le client, pas de ton métier.",
      "Trente secondes à voix haute, chronomètre en main.",
      "Termine par une question ou un rendez-vous.",
    ],
    gesture: {
      intro:
        "Écris ton pitch en remplissant les cases, puis dis-le à voix haute à quelqu’un qui ne connaît pas ton métier.",
      fields: [
        {
          label: "Je m’adresse à qui ?",
          example: "aux propriétaires de maisons anciennes",
        },
        {
          label: "Leur problème",
          example: "des fuites et des factures de chauffage trop élevées",
        },
        {
          label: "Mon offre en une phrase",
          example: "j’installe un chauffage performant en deux jours",
        },
        {
          label: "Le résultat concret",
          example: "jusqu’à une facture plus basse et un confort toute l’année",
        },
        { label: "Ma preuve", example: "30 maisons équipées dans le quartier" },
        {
          label: "Ma question finale",
          example: "Puis-je passer vous faire un devis gratuit ?",
        },
      ],
      tip: "Évite les mots techniques : si un enfant de 12 ans ne comprend pas, simplifie.",
    },
    check: [
      {
        q: "Quel pitch est le meilleur ?",
        options: [
          "Je suis plombier depuis dix ans",
          "J’aide les propriétaires à éviter les fuites, avec une intervention sous 24 heures",
          "Je fais un peu de tout dans la maison",
        ],
        answer: 1,
        why: "Il dit pour qui, quel problème et quel résultat, en une phrase.",
      },
      {
        q: "Combien de temps doit durer un pitch ?",
        options: ["Environ 30 secondes", "Dix minutes", "Une heure"],
        answer: 0,
        why: "Assez court pour être retenu, assez long pour donner envie d’en savoir plus.",
      },
      {
        q: "Comment terminer un pitch ?",
        options: [
          "Par un long silence",
          "Par une question ou une proposition de rendez-vous",
          "Par la liste de tes diplômes",
        ],
        answer: 1,
        why: "Une question lance l’échange, ce qui est le but du pitch.",
      },
    ],
  },
  {
    id: "vente-objections",
    idea: [
      "Une objection, ce n’est pas un refus : c’est une question que le client n’a pas encore posée. « C’est trop cher » veut souvent dire « je ne vois pas encore pourquoi ça vaut ce prix ». « Je vais réfléchir » veut dire « il me manque quelque chose pour décider ».",
      "La méthode : écoute sans te défendre, reformule, pose une question pour comprendre ce qui bloque, puis réponds avec un fait ou un exemple. Ne baisse pas ton prix tout de suite : explique d’abord la valeur.",
      "Prépare tes réponses avant d’en avoir besoin. Les mêmes objections reviennent toujours : prix, délai, confiance, comparaison avec un concurrent. Une fiche à portée de main te rend calme et crédible.",
    ],
    keys: [
      "Une objection est une demande d’information, pas un refus.",
      "Écoute, reformule, questionne, puis réponds.",
      "Avant de baisser ton prix, explique la valeur.",
      "Prépare tes réponses aux objections fréquentes.",
    ],
    gesture: {
      intro:
        "Remplis ta fiche avec les objections que tu entends le plus et ta réponse. Relis-la avant chaque rendez-vous.",
      fields: [
        {
          label: "Objection 1 : « C’est trop cher »",
          example:
            "Trop cher par rapport à quoi ? Voici ce que comprend le prix…",
        },
        {
          label: "Objection 2 : « Je vais réfléchir »",
          example: "Bien sûr. Qu’est-ce qui vous manque pour décider ?",
        },
        {
          label: "Objection 3 : « J’ai un autre devis moins cher »",
          example: "Pouvez-vous me le montrer ? Comparons ce qui est inclus.",
        },
        {
          label: "Objection 4 : « Ce n’est pas le bon moment »",
          example: "Qu’est-ce qui changerait dans trois mois ?",
        },
        {
          label: "Ma preuve à montrer",
          example: "photos avant-après, avis clients",
        },
      ],
      tip: "Réponds toujours par une question avant de répondre par un argument.",
    },
    check: [
      {
        q: "Un client dit « c’est trop cher ». Ta meilleure première réaction ?",
        options: [
          "Baisser le prix tout de suite",
          "Demander « trop cher par rapport à quoi ? » pour comprendre",
          "Dire qu’il se trompe",
        ],
        answer: 1,
        why: "Tu découvres ce qui bloque avant de décider de bouger ou non.",
      },
      {
        q: "« Je vais réfléchir » veut souvent dire :",
        options: [
          "Il manque une information ou une confiance au client",
          "Le client veut vraiment attendre un an",
          "La vente est perdue à coup sûr",
        ],
        answer: 0,
        why: "C’est un signal : demande ce qui lui manque pour décider.",
      },
      {
        q: "Pourquoi préparer ses réponses aux objections ?",
        options: [
          "Pour éviter d’écouter le client",
          "Parce que les mêmes objections reviennent toujours",
          "Pour parler plus vite",
        ],
        answer: 1,
        why: "Les mêmes freins reviennent : une réponse préparée est plus calme et plus claire.",
      },
    ],
  },
  {
    id: "vente-conclure",
    idea: [
      "Beaucoup de ventes échouent non pas parce que le client refuse, mais parce que personne ne lui demande de décider. Conclure, c’est proposer clairement la suite : signer, fixer une date, verser l’acompte.",
      "Fais-le naturellement après avoir résumé ce que le client t’a dit et ce que tu proposes. Par exemple : « Vous voulez un chantier fini avant Noël pour 3 000 €. Si je réserve la date du 5 décembre, on signe le devis ? ». La question est simple et précise.",
      "Si le client dit non, demande pourquoi : tu apprends, et la porte reste ouverte. Si le client dit oui, confirme tout de suite par écrit : date, prix, prochaines étapes.",
    ],
    keys: [
      "Il faut demander la décision, sinon elle ne vient pas.",
      "Résume le besoin et l’offre avant de conclure.",
      "Propose une suite précise : date, signature, acompte.",
      "Confirme par écrit juste après le oui.",
    ],
    gesture: {
      intro:
        "Prépare ta phrase de conclusion pour un rendez-vous réel. Écris ce que tu diras mot pour mot.",
      fields: [
        {
          label: "Résumé du besoin du client",
          example: "Vous voulez refaire la salle de bain avant Noël",
        },
        {
          label: "Mon offre en une phrase",
          example: "Je propose une rénovation complète en 8 jours pour 3 000 €",
        },
        {
          label: "Ma question de conclusion",
          example:
            "On réserve le 5 décembre et on signe le devis aujourd’hui ?",
        },
        {
          label: "Si c’est oui, la suite",
          example: "devis signé, acompte, date confirmée par mail",
        },
        {
          label: "Si c’est non, ma question",
          example: "Qu’est-ce qui vous retient ?",
        },
      ],
      tip: "Après ta question, tais-toi : laisse le client répondre sans combler le silence.",
    },
    check: [
      {
        q: "Pourquoi beaucoup de ventes ne se font-elles pas ?",
        options: [
          "Le client refuse presque toujours",
          "Personne ne demande clairement au client de décider",
          "Les prix sont toujours trop hauts",
        ],
        answer: 1,
        why: "Sans demande claire, la décision reste en suspens.",
      },
      {
        q: "Quelle phrase de conclusion est la plus claire ?",
        options: [
          "Voilà, vous voyez, c’est tout.",
          "On réserve le 5 décembre et on signe le devis aujourd’hui ?",
          "Appelez-moi si ça vous dit.",
        ],
        answer: 1,
        why: "Elle propose une action précise avec une date.",
      },
      {
        q: "Le client dit oui. Que fais-tu tout de suite ?",
        options: [
          "Tu attends la semaine suivante",
          "Tu confirmes par écrit la date, le prix et les étapes",
          "Tu changes l’offre",
        ],
        answer: 1,
        why: "Un écrit rapide évite les oublis et verrouille l’accord.",
      },
    ],
  },
  {
    id: "vente-negocier",
    idea: [
      "Négocier, ce n’est pas se battre : c’est chercher un accord qui convient aux deux. Avant de t’asseoir, tu dois savoir trois choses : ton prix idéal, ton prix minimum en dessous duquel tu refuses, et ce que tu peux offrir en échange d’un effort du client.",
      "Ne baisse jamais ton prix sans contrepartie. Si le client veut payer moins, demande quelque chose : un paiement rapide, un contrat plus long, un volume plus grand. Cède petit à petit, en expliquant ce que tu retires : moins de prestations, moins de délai.",
      "Connaître ton minimum te protège de l’émotion. Si l’accord est en dessous, tu peux dire non calmement : « Je ne peux pas descendre plus bas sans réduire la qualité ».",
    ],
    keys: [
      "Prépare ton prix idéal, ton minimum et tes contreparties.",
      "Ne baisse pas le prix sans demander quelque chose en échange.",
      "Cède petit à petit, en expliquant ce que tu retires.",
      "Savoir dire non calmement te protège.",
    ],
    gesture: {
      intro:
        "Prépare ta négociation avant le rendez-vous. Remplis la fiche avec tes chiffres réels.",
      fields: [
        { label: "Mon prix idéal", example: "3 000 €" },
        { label: "Mon prix minimum", example: "2 700 €" },
        {
          label: "Ce que le client veut vraiment",
          example: "un chantier fini avant Noël",
        },
        {
          label: "Mes contreparties possibles",
          example: "paiement en une fois, avis client, recommandation",
        },
        {
          label: "Ce que je peux retirer si je baisse",
          example: "finitions simplifiées, délai plus long",
        },
        {
          label: "Ma phrase si c’est en dessous de mon minimum",
          example: "Je ne peux pas descendre plus bas sans réduire la qualité.",
        },
      ],
      tip: "Le minimum se fixe avant la discussion, jamais pendant.",
    },
    check: [
      {
        q: "Le client demande 10 % de remise. Quelle réaction est la plus saine ?",
        options: [
          "Accepter tout de suite",
          "Demander une contrepartie : paiement rapide, volume, recommandation",
          "Refuser et partir",
        ],
        answer: 1,
        why: "Une concession se rend contre quelque chose, sinon tu perds sans rien gagner.",
      },
      {
        q: "Pourquoi connaître son prix minimum à l’avance ?",
        options: [
          "Pour ne pas céder sous l’émotion",
          "Pour l’annoncer en premier",
          "Ça ne sert à rien",
        ],
        answer: 0,
        why: "Un seuil fixé à froid évite d’accepter un accord qui te fait perdre de l’argent.",
      },
      {
        q: "Tu baisses ton prix. Que dois-tu faire en plus ?",
        options: [
          "Rien de plus",
          "Ajouter des prestations gratuites",
          "Préciser ce que tu retires ou ce que tu obtiens en échange",
        ],
        answer: 2,
        why: "Une baisse sans changement donne l’impression que ton prix de départ n’était pas honnête.",
      },
    ],
  },
  {
    id: "vente-fideliser",
    idea: [
      "Un client qui revient coûte beaucoup moins cher qu’un nouveau client à trouver. Et un client content est ton meilleur vendeur : il te recommande à ses proches. Fidéliser, c’est organiser ce qui se passe après la vente.",
      "Trois gestes simples : un message de remerciement juste après la prestation, un suivi quelques semaines plus tard (« tout va bien ? »), puis un rappel régulier quand le besoin revient (entretien annuel, nouvelle saison). Tu montres que tu penses à lui, sans lui forcer la main.",
      "Demande aussi un avis ou une recommandation au bon moment : quand le client est content. Note dans un carnet ou un tableau la date de la dernière prestation et celle du prochain contact.",
    ],
    keys: [
      "Garder un client coûte moins cher qu’en trouver un nouveau.",
      "Remercie, prends des nouvelles, rappelle au bon moment.",
      "Demande un avis quand le client est content.",
      "Note les dates de contact dans un tableau.",
    ],
    gesture: {
      intro:
        "Construis ton plan de suivi pour un client type. Il te suffira de le répéter pour chaque nouveau client.",
      fields: [
        {
          label: "Client",
          example: "M. Bernard, chaudière installée le 10/11",
        },
        {
          label: "Jour J : remerciement",
          example: "SMS de remerciement et photo du chantier fini",
        },
        {
          label: "J+15 : prise de nouvelles",
          example: "Tout fonctionne bien ? N’hésitez pas à m’appeler.",
        },
        {
          label: "J+30 : demande d’avis",
          example: "Un avis sur ma fiche Google m’aiderait beaucoup.",
        },
        {
          label: "Prochain rappel naturel",
          example: "rappel de l’entretien dans 11 mois",
        },
        {
          label: "Cadeau ou geste possible",
          example: "petite remise sur le prochain entretien",
        },
      ],
      tip: "Un seul geste régulier vaut mieux que dix idées jamais appliquées.",
    },
    check: [
      {
        q: "Pourquoi fidéliser est-il rentable ?",
        options: [
          "Un client existant coûte moins cher à garder qu’un nouveau à trouver",
          "Parce que les clients ne paient jamais plus de deux fois",
          "Parce que c’est obligatoire",
        ],
        answer: 0,
        why: "Tu évites les frais de recherche, et le client te connaît déjà.",
      },
      {
        q: "Quel est le meilleur moment pour demander un avis ?",
        options: [
          "Quand le client est mécontent",
          "Juste après un échange où il se dit satisfait",
          "Un an plus tard",
        ],
        answer: 1,
        why: "Un client satisfait répond volontiers, et son avis est frais.",
      },
      {
        q: "Qu’est-ce qui aide à ne pas oublier ses clients ?",
        options: [
          "Les retenir de mémoire",
          "Noter la date de la dernière prestation et du prochain contact",
          "Attendre qu’ils appellent",
        ],
        answer: 1,
        why: "Un tableau simple t’évite de perdre le contact avec ceux qui te font vivre.",
      },
    ],
  },
  {
    id: "vente-process",
    idea: [
      "Prospecter, c’est aller chercher des clients au lieu d’attendre qu’ils arrivent. Le piège est de le faire par à-coups : beaucoup une semaine, rien le mois suivant. Une machine simple et régulière vaut mieux : un petit nombre de contacts, chaque semaine, suivi dans un tableau.",
      "Le principe en quatre étapes : lister des prospects précis, les contacter (appel, message, visite), noter la réponse, et relancer ceux qui n’ont pas répondu. Compte tes chiffres : sur 20 contacts, 5 réponses et 2 rendez-vous te disent ce que vaut ta méthode.",
      "Bloque un créneau fixe, par exemple deux heures le mardi matin. Quand tu connais tes taux (contacts → réponses → rendez-vous → ventes), tu sais combien de contacts viser pour atteindre ton objectif de clients.",
    ],
    keys: [
      "Prospecte chaque semaine, à créneau fixe.",
      "Quatre étapes : lister, contacter, noter, relancer.",
      "Compte tes chiffres pour savoir ce qui marche.",
      "Connaître tes taux te dit combien de contacts viser.",
    ],
    gesture: {
      intro:
        "Remplis ton tableau de prospection de la semaine et recopie-le chaque lundi. Les chiffres sont des exemples à remplacer.",
      fields: [
        { label: "Créneau fixe de prospection", example: "mardi, 9 h à 11 h" },
        { label: "Prospects contactés cette semaine", example: "20" },
        { label: "Réponses reçues", example: "5" },
        { label: "Rendez-vous obtenus", example: "2" },
        { label: "Ventes conclues", example: "1" },
        {
          label: "À relancer la semaine prochaine",
          example: "les 10 prospects sans réponse",
        },
        {
          label: "Objectif de la semaine suivante",
          example: "25 contacts, 3 rendez-vous",
        },
      ],
      tip: "Ne cherche pas à améliorer ton message avant d’avoir fait au moins 20 contacts : sans chiffres, tu devines.",
    },
    check: [
      {
        q: "Quelle approche de prospection fonctionne le mieux ?",
        options: [
          "Un gros effort de temps en temps",
          "Un petit effort régulier à créneau fixe, suivi dans un tableau",
          "Attendre que les clients viennent",
        ],
        answer: 1,
        why: "La régularité crée un flux constant de rendez-vous.",
      },
      {
        q: "Sur 20 contacts, tu obtiens 2 rendez-vous. Le taux contact → rendez-vous est de :",
        options: ["20 %", "2 %", "10 %"],
        answer: 2,
        why: "2 sur 20 font 10 %.",
      },
      {
        q: "Un prospect n’a pas répondu. Que fais-tu ?",
        options: [
          "Tu l’oublies à jamais",
          "Tu le notes et le relances plus tard",
          "Tu l’insultes",
        ],
        answer: 1,
        why: "Beaucoup de réponses viennent après une relance polie.",
      },
    ],
  },
];
