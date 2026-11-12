import type { SkillContent } from "./types";

/** Anglais professionnel : les compétences sans leçon longue. */
export const skills: SkillContent[] = [
  {
    id: "ang-mail",
    idea: [
      "Un mail pro en anglais suit presque toujours la même forme : une formule d’ouverture, une phrase qui dit pourquoi tu écris, ta demande, puis une formule de fin. Tu n’as pas besoin de belles phrases : des phrases courtes et claires sont parfaites.",
      "Quelques formules à connaître : « Dear Mr Smith, » (Bonjour Monsieur Smith), « I am writing to… » (je vous écris pour…), « Could you please… ? » (pourriez-vous… ?), « Thank you for your help » (merci de votre aide), « Best regards » (cordialement).",
      "Relis toujours avant d’envoyer : une phrase par idée, une demande claire, la date si tu en attends une. Si tu hésites sur un mot, un traducteur peut aider, mais garde des tournures simples que tu comprends.",
    ],
    keys: [
      "Structure : ouverture, raison, demande, fin.",
      "« I am writing to… » introduit la raison de ton mail.",
      "« Could you please… ? » est la façon polie de demander.",
      "« Best regards » est la fin standard.",
    ],
    gesture: {
      intro:
        "Remplis ce modèle de mail en anglais. Remplace les exemples par ta situation et garde les formules.",
      fields: [
        { label: "Ouverture", example: "Dear Mr Smith," },
        {
          label: "Pourquoi j’écris",
          example: "I am writing to ask about your delivery times.",
        },
        {
          label: "Ma demande",
          example: "Could you please send me a quote by Friday?",
        },
        {
          label: "Une précision utile",
          example: "I have attached the list of products.",
        },
        { label: "Remerciement", example: "Thank you for your help." },
        { label: "Fin et signature", example: "Best regards, Léa Martin" },
      ],
      tip: "Garde ce modèle dans tes notes : tu n’auras qu’à changer les détails à chaque mail.",
    },
    check: [
      {
        q: "Que signifie « I am writing to… » ?",
        options: [
          "Je suis en train de dormir",
          "Je vous écris pour…",
          "Je vous appelle pour…",
        ],
        answer: 1,
        why: "C’est la formule classique pour annoncer la raison d’un mail.",
      },
      {
        q: "Quelle phrase est une demande polie ?",
        options: [
          "Send me the quote now.",
          "Could you please send me the quote?",
          "You must send the quote.",
        ],
        answer: 1,
        why: "« Could you please… ? » est poli et courant au travail.",
      },
      {
        q: "Quelle est une bonne fin de mail professionnel ?",
        options: ["See you, dude", "Best regards", "Bye bye"],
        answer: 1,
        why: "« Best regards » est neutre et adaptée à presque tous les mails pro.",
      },
    ],
  },
  {
    id: "ang-presenter",
    idea: [
      "Se présenter en anglais, c’est dire en quelques phrases qui tu es, ce que tu fais et pourquoi tu es là. Une présentation courte et claire vaut mieux qu’un long discours rempli d’erreurs.",
      "Les phrases de base : « My name is Léa » (je m’appelle Léa), « I am from Lyon » (je viens de Lyon), « I work as a… » (je travaille comme…), « I am in charge of… » (je m’occupe de…), « Nice to meet you » (enchanté).",
      "Prépare ta version à l’avance et dis-la à voix haute plusieurs fois. En parlant, fais des pauses : ça aide ceux qui t’écoutent et toi-même à rester calme.",
    ],
    keys: [
      "Une présentation : nom, origine, métier, ce que tu fais.",
      "« My name is… » et « I work as a… » couvrent l’essentiel.",
      "« Nice to meet you » se dit à la fin ou en arrivant.",
      "Prépare et répète à voix haute.",
    ],
    gesture: {
      intro:
        "Écris ta présentation en anglais, quatre ou cinq phrases. Tu la diras ensuite à voix haute.",
      fields: [
        { label: "Mon nom", example: "My name is Léa Martin." },
        { label: "D’où je viens", example: "I am from Lyon, in France." },
        { label: "Mon métier", example: "I work as a sales assistant." },
        {
          label: "Ce dont je m’occupe",
          example: "I am in charge of customer orders.",
        },
        { label: "Phrase de fin", example: "Nice to meet you." },
      ],
      tip: "Enregistre-toi avec ton téléphone et réécoute : tu entendras vite où tu peux fluidifier.",
    },
    check: [
      {
        q: "Comment dire « Je travaille comme vendeur » ?",
        options: [
          "I work as a salesman.",
          "I am working a salesman.",
          "I works vendor.",
        ],
        answer: 0,
        why: "« I work as a… » est la construction correcte pour donner son métier.",
      },
      {
        q: "« Nice to meet you » veut dire :",
        options: ["Au revoir", "Enchanté", "Merci beaucoup"],
        answer: 1,
        why: "C’est la formule pour dire « enchanté » en rencontrant quelqu’un.",
      },
      {
        q: "Quel est le meilleur moyen de s’améliorer avant une présentation ?",
        options: [
          "Ne rien préparer",
          "Préparer ses phrases et les répéter à voix haute",
          "Lire à toute vitesse",
        ],
        answer: 1,
        why: "Répéter à voix haute rend les mots naturels et rassure.",
      },
    ],
  },
  {
    id: "ang-appel",
    idea: [
      "Au téléphone, c’est plus difficile : tu ne vois pas le visage de l’autre, donc tu comprends moins bien. La bonne nouvelle, c’est que tu as le droit de demander de répéter ou de parler plus lentement.",
      "Les phrases qui sauvent : « Could you repeat that, please? » (pouvez-vous répéter ?), « Could you speak more slowly? » (pouvez-vous parler plus lentement ?), « Could you spell that? » (pouvez-vous l’épeler ?), « Let me check » (je vérifie).",
      "Commence ton appel en disant qui tu es : « Hello, this is Léa from Atelier Martin. » Note les informations importantes (nom, chiffre, date) et reprends-les à la fin pour confirmer : « Let me confirm: Friday at 3 p.m. »",
    ],
    keys: [
      "Tu peux demander de répéter et de parler plus lentement.",
      "« Could you spell that? » aide pour les noms et les adresses.",
      "Commence par dire qui tu es.",
      "Confirme les infos importantes avant de raccrocher.",
    ],
    gesture: {
      intro:
        "Prépare une fiche d’appel en anglais. Garde-la sous les yeux pendant la conversation.",
      fields: [
        {
          label: "Je me présente",
          example: "Hello, this is Léa from Atelier Martin.",
        },
        {
          label: "Je dis pourquoi j’appelle",
          example: "I am calling about my order.",
        },
        {
          label: "Pour faire répéter",
          example: "Could you repeat that, please?",
        },
        {
          label: "Pour faire parler plus lentement",
          example: "Could you speak more slowly?",
        },
        {
          label: "Pour confirmer",
          example: "Let me confirm: Friday at 3 p.m.",
        },
        { label: "Pour conclure", example: "Thank you for your time." },
      ],
      tip: "Note les chiffres et les noms par écrit : c’est ce qu’on comprend le moins bien au téléphone.",
    },
    check: [
      {
        q: "Comment demander de répéter ?",
        options: [
          "Could you repeat that, please?",
          "Repeat this now.",
          "Why you talk?",
        ],
        answer: 0,
        why: "C’est la formule polie et naturelle pour faire répéter.",
      },
      {
        q: "« Could you spell that? » signifie :",
        options: [
          "Pouvez-vous l’épeler ?",
          "Pouvez-vous le payer ?",
          "Pouvez-vous le traduire ?",
        ],
        answer: 0,
        why: "« To spell » veut dire épeler, lettre par lettre.",
      },
      {
        q: "Pourquoi reprendre à la fin « Let me confirm… » ?",
        options: [
          "Pour allonger l’appel",
          "Pour vérifier qu’on a bien compris les infos importantes",
          "Pour changer de sujet",
        ],
        answer: 1,
        why: "Confirmer évite les malentendus sur une date, un nom ou un montant.",
      },
    ],
  },
  {
    id: "ang-reunion",
    idea: [
      "En réunion, tu n’as pas besoin de parler beaucoup : tu dois savoir donner ton avis court et demander de l’aide quand tu ne comprends pas. Deux ou trois phrases bien choisies suffisent.",
      "Pour donner ton avis : « I think that… » (je pense que…), « In my opinion… » (à mon avis…), « I agree » (je suis d’accord), « I see it differently » (je vois ça autrement). Pour demander de l’aide : « Sorry, could you explain that? » (pardon, pouvez-vous expliquer ?).",
      "Prépare à l’avance une phrase pour chaque point de l’ordre du jour. Si tu perds le fil, redis ce que tu as compris : « So, if I understand correctly… » (donc, si je comprends bien…). Ça montre que tu suis et ça corrige les malentendus.",
    ],
    keys: [
      "« I think that… » et « I agree » donnent ton avis simplement.",
      "« Sorry, could you explain that? » demande de reformuler.",
      "« So, if I understand correctly… » vérifie ta compréhension.",
      "Prépare une phrase par point de l’ordre du jour.",
    ],
    gesture: {
      intro:
        "Prépare tes phrases pour une réunion. Écris-les avant, tu auras moins peur de parler.",
      fields: [
        {
          label: "Pour donner mon avis",
          example: "I think that we should wait until Monday.",
        },
        { label: "Pour être d’accord", example: "I agree with you." },
        {
          label: "Pour ne pas être d’accord poliment",
          example: "I see it differently.",
        },
        {
          label: "Pour demander d’expliquer",
          example: "Sorry, could you explain that?",
        },
        {
          label: "Pour vérifier que j’ai compris",
          example: "So, if I understand correctly, we deliver on Friday?",
        },
      ],
      tip: "Une phrase courte et sûre vaut mieux qu’une phrase longue et hésitante.",
    },
    check: [
      {
        q: "Comment donner ton avis ?",
        options: ["I think that…", "I am sleeping that…", "You are that…"],
        answer: 0,
        why: "« I think that… » introduit ton avis.",
      },
      {
        q: "Tu n’as pas compris un point. Que dis-tu ?",
        options: [
          "Nothing, I hide.",
          "Sorry, could you explain that?",
          "That is wrong!",
        ],
        answer: 1,
        why: "C’est la manière polie de demander une explication.",
      },
      {
        q: "« So, if I understand correctly… » sert à :",
        options: [
          "Reformuler pour vérifier qu’on a bien compris",
          "Terminer la réunion",
          "Refuser une idée",
        ],
        answer: 0,
        why: "Cette formule reformule l’idée de l’autre pour confirmer ta compréhension.",
      },
    ],
  },
  {
    id: "ang-negocier",
    idea: [
      "Négocier, c’est chercher un accord qui convient aux deux côtés. En anglais, on garde un ton poli : on propose, on explique ce qui compte pour soi, on cherche un compromis (un arrangement où chacun cède un peu).",
      "Pour proposer : « How about…? » (et si…?), « We could offer… » (nous pourrions offrir…). Pour refuser poliment : « I am afraid that is too high for us » (je crains que ce soit trop élevé pour nous). Pour conclure : « We have a deal » (marché conclu), « Let’s go with that » (retenons ça).",
      "Avant de négocier, décide ton minimum acceptable et ce que tu peux offrir en échange (un délai, un volume). Ne dis jamais « oui » trop vite : « Let me think about it » (laissez-moi y réfléchir) te donne du temps.",
    ],
    keys: [
      "On négocie poliment : proposer, expliquer, chercher un compromis.",
      "« How about…? » propose ; « I am afraid… » refuse poliment.",
      "« We have a deal » conclut l’accord.",
      "Prépare ton minimum acceptable avant de commencer.",
    ],
    gesture: {
      intro:
        "Prépare ta négociation. Remplis ce qui compte pour toi et les phrases que tu utiliseras.",
      fields: [
        { label: "Mon objectif", example: "obtenir 10 % de remise" },
        { label: "Mon minimum acceptable", example: "5 % de remise" },
        {
          label: "Ce que je peux offrir en échange",
          example: "une commande plus grosse",
        },
        {
          label: "Ma proposition en anglais",
          example: "How about a 10% discount for a larger order?",
        },
        {
          label: "Pour refuser poliment",
          example: "I am afraid that is too high for us.",
        },
        { label: "Pour conclure", example: "We have a deal." },
      ],
      tip: "Respire et fais des pauses : un silence après une proposition met souvent l’autre en mouvement.",
    },
    check: [
      {
        q: "Comment refuser poliment un prix ?",
        options: [
          "No way.",
          "I am afraid that is too high for us.",
          "You are crazy.",
        ],
        answer: 1,
        why: "« I am afraid that… » adoucit un refus tout en restant clair.",
      },
      {
        q: "« We have a deal » veut dire :",
        options: [
          "Nous avons un problème",
          "Marché conclu",
          "Je vais réfléchir",
        ],
        answer: 1,
        why: "C’est la façon classique de dire qu’un accord est conclu.",
      },
      {
        q: "Que faire avant de négocier ?",
        options: [
          "Choisir ton minimum acceptable et ce que tu peux offrir",
          "Dire oui à tout",
          "Éviter de préparer quoi que ce soit",
        ],
        answer: 0,
        why: "Connaître tes limites te permet de proposer sans te mettre en difficulté.",
      },
    ],
  },
];
