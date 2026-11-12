import type { SkillContent } from "./types";

/** Intelligence artificielle : les compétences sans leçon longue. */
export const skills: SkillContent[] = [
  {
    id: "ia-premiers-usages",
    idea: [
      "Une IA qui écrit (un assistant conversationnel) est un outil de texte : tu lui écris une demande, elle te répond. Les usages les plus simples sont aussi les plus utiles : résumer un long texte, reformuler un message plus clairement, traduire, ou trouver des idées quand tu sèches.",
      "Plus ta demande est précise, meilleure est la réponse. Dis-lui qui tu es, ce que tu veux, pour qui, et sous quelle forme. Une demande vague donne une réponse vague.",
      "Attention : une IA peut se tromper en sonnant très sûre d’elle. Vérifie les faits importants (chiffres, noms, lois). Et ne lui donne jamais de mots de passe, de données bancaires ni d’informations privées sur d’autres personnes.",
    ],
    keys: [
      "Résumer, reformuler, traduire, chercher des idées : les 4 usages de départ.",
      "Une demande précise donne une meilleure réponse.",
      "Une IA peut se tromper : vérifie les faits importants.",
      "Ne donne jamais de mot de passe ni de données privées.",
    ],
    gesture: {
      intro:
        "Teste ces cinq demandes avec un assistant IA et note ce que tu en penses. Remplace les exemples par ton propre texte.",
      fields: [
        {
          label: "Résumer",
          example: "Résume ce texte en 5 lignes simples : [colle ton texte]",
        },
        {
          label: "Reformuler",
          example:
            "Reformule ce message pour qu’il soit plus poli et plus court : [ton message]",
        },
        {
          label: "Traduire",
          example: "Traduis ce paragraphe en anglais simple : [ton texte]",
        },
        {
          label: "Trouver des idées",
          example:
            "Donne-moi 10 idées de cadeaux à moins de 30 € pour un collègue.",
        },
        {
          label: "Expliquer simplement",
          example: "Explique-moi l’inflation comme si j’avais 12 ans.",
        },
        {
          label: "Ce que j’ai vérifié ensuite",
          example: "j’ai recoupé le chiffre avec une source officielle",
        },
      ],
      tip: "Relis toujours la réponse avant de l’utiliser. L’IA t’aide, mais c’est toi qui es responsable du résultat.",
    },
    check: [
      {
        q: "Pour obtenir une bonne réponse d’une IA, il vaut mieux :",
        options: [
          "Écrire une demande très vague",
          "Dire clairement ce que tu veux, pour qui et sous quelle forme",
          "Lui répéter « fais-le »",
        ],
        answer: 1,
        why: "Une demande précise donne à l’IA les informations qui lui manquent.",
      },
      {
        q: "L’IA te donne un chiffre précis très sûr d’elle. Que fais-tu ?",
        options: [
          "Tu le vérifies avec une source fiable",
          "Tu le crois, elle est sûre d’elle",
          "Tu le recopies sans lire",
        ],
        answer: 0,
        why: "Une IA peut se tromper en paraissant sûre d’elle : on vérifie les faits importants.",
      },
      {
        q: "Que peux-tu envoyer sans risque à une IA grand public ?",
        options: [
          "Ton mot de passe bancaire",
          "Un texte sans donnée personnelle à reformuler",
          "Le numéro de carte d’un client",
        ],
        answer: 1,
        why: "On ne partage jamais de secrets ni de données privées : un texte neutre est le bon usage.",
      },
    ],
  },
  {
    id: "ia-images",
    idea: [
      "Une IA d’images fabrique une image à partir d’une description en texte. Plus tu décris précisément, plus l’image ressemble à ce que tu imagines : le sujet, le lieu, le style (photo, dessin, aquarelle), la lumière, les couleurs.",
      "Le premier résultat est rarement parfait. On l’améliore par petites touches : « plus lumineux », « fond plus simple », « sans texte ». Change une chose à la fois pour comprendre ce qui marche.",
      "Pense aux limites : l’IA se trompe souvent sur le texte écrit dans l’image et sur certains détails (les mains, par exemple). Vérifie les règles d’usage de l’outil avant de publier une image, et ne reproduis pas le visage d’une vraie personne sans son accord.",
    ],
    keys: [
      "Décris le sujet, le lieu, le style, la lumière et les couleurs.",
      "Améliore l’image par petites touches, une chose à la fois.",
      "Le texte dans l’image et les détails fins sont souvent faux.",
      "Respecte les règles d’usage et le droit à l’image.",
    ],
    gesture: {
      intro:
        "Écris la description (le « prompt ») d’une image. Remplis chaque case, puis envoie la phrase complète à l’IA.",
      fields: [
        {
          label: "Le sujet",
          example: "un chat roux assis sur un rebord de fenêtre",
        },
        {
          label: "Le lieu ou le décor",
          example: "un appartement parisien, jour de pluie",
        },
        { label: "Le style", example: "photo réaliste" },
        {
          label: "La lumière et l’ambiance",
          example: "lumière douce, ambiance calme",
        },
        {
          label: "Les couleurs dominantes",
          example: "tons chauds, gris bleuté dehors",
        },
        {
          label: "Ce que je ne veux pas",
          example: "pas de texte dans l’image",
        },
      ],
      tip: "Garde les bonnes descriptions dans un carnet : tu pourras les réutiliser et les ajuster.",
    },
    check: [
      {
        q: "Quelle description est la plus utile pour une IA d’images ?",
        options: [
          "« Une belle image »",
          "« Un chat roux sur un rebord de fenêtre, photo réaliste, lumière douce »",
          "« Fais ça »",
        ],
        answer: 1,
        why: "Elle précise le sujet, le style et la lumière : l’IA a de quoi travailler.",
      },
      {
        q: "Le premier résultat ne te plaît pas. Que fais-tu ?",
        options: [
          "Tu abandonnes",
          "Tu changes une chose à la fois dans ta description",
          "Tu changes tout, puis tu recommences",
        ],
        answer: 1,
        why: "Changer un détail à la fois permet de comprendre ce qui améliore l’image.",
      },
      {
        q: "Que faut-il vérifier dans une image générée avant de l’utiliser ?",
        options: [
          "Les mains et le texte écrit, souvent déformés",
          "Rien, elle est toujours parfaite",
          "La taille du fichier uniquement",
        ],
        answer: 0,
        why: "Les IA d’images se trompent souvent sur le texte et les détails comme les mains.",
      },
    ],
  },
  {
    id: "ia-assistant",
    idea: [
      "Un assistant sur mesure, c’est une IA à qui tu donnes une fois pour toutes un rôle et des règles. Au lieu de tout réexpliquer à chaque conversation, tu écris une consigne de départ : qui il est, pour qui il travaille, ce qu’il doit faire et ne pas faire.",
      "Une bonne fiche contient : son rôle (par exemple « assistant de mon commerce »), ses tâches, le ton à employer, les informations qu’il connaît (horaires, tarifs), et ses limites (ce qu’il ne doit jamais inventer). Plus c’est clair, plus il est fiable.",
      "Teste ton assistant avec cinq vraies questions, vois où il se trompe et corrige la fiche. Protège les données : n’y mets pas d’informations privées sur tes clients, et fais relire par un humain ce qui part à l’extérieur.",
    ],
    keys: [
      "Un assistant sur mesure = un rôle et des règles écrits une fois.",
      "La fiche contient rôle, tâches, ton, informations et limites.",
      "Teste avec de vraies questions et corrige la fiche.",
      "Pas de données privées, et un humain relit ce qui sort.",
    ],
    gesture: {
      intro:
        "Remplis la fiche de ton assistant. Tu pourras ensuite la coller au début d’une conversation avec une IA.",
      fields: [
        { label: "Son rôle", example: "assistant de mon commerce de fleurs" },
        {
          label: "Ses tâches",
          example: "répondre aux questions courantes, proposer des bouquets",
        },
        {
          label: "Le ton à employer",
          example: "chaleureux, simple, vouvoiement",
        },
        {
          label: "Les informations qu’il connaît",
          example: "ouvert du mardi au samedi, 9 h-18 h",
        },
        {
          label: "Ce qu’il ne doit pas faire",
          example: "inventer un prix ou une promesse de livraison",
        },
        {
          label: "Quand il passe la main à un humain",
          example: "réclamation ou demande sur mesure",
        },
      ],
      tip: "Ajoute une phrase du type « si tu ne sais pas, dis-le » : elle limite les réponses inventées.",
    },
    check: [
      {
        q: "À quoi sert la fiche d’un assistant sur mesure ?",
        options: [
          "À lui donner un rôle et des règles une fois pour toutes",
          "À le rendre plus lent",
          "À remplacer toute vérification humaine",
        ],
        answer: 0,
        why: "La fiche évite de tout réexpliquer et cadre son travail.",
      },
      {
        q: "Quelle consigne réduit les réponses inventées ?",
        options: [
          "« Réponds toujours, même sans savoir »",
          "« Si tu ne sais pas, dis-le et passe la main à un humain »",
          "« Sois très créatif sur les prix »",
        ],
        answer: 1,
        why: "Dire à l’assistant d’avouer qu’il ne sait pas évite qu’il invente.",
      },
      {
        q: "Que ne dois-tu pas mettre dans la fiche ?",
        options: [
          "Les horaires d’ouverture",
          "Le ton à employer",
          "Des données privées sur tes clients",
        ],
        answer: 2,
        why: "Les données privées doivent rester protégées, hors de la portée d’un outil externe.",
      },
    ],
  },
];
