import type { SkillContent } from "./types";

/** Manager : les compétences sans leçon longue. */
export const skills: SkillContent[] = [
  {
    id: "man-deleguer",
    idea: [
      "Déléguer, ce n’est pas se débarrasser d’une corvée : c’est confier un résultat à quelqu’un, avec les moyens de l’atteindre. Si tu dis seulement « occupe-toi du site », chacun comprend autre chose. Si tu dis ce que tu attends, pour quand et comment tu jugeras que c’est bien, la personne sait où elle va.",
      "Une bonne délégation tient en quatre choses : le résultat attendu, la date, les limites (budget, ce qu’elle peut décider seule) et le moment où tu fais le point. Tu confies le « quoi », elle trouve le « comment ». Tu gardes la responsabilité finale.",
      "Le piège classique : reprendre la tâche à la première erreur. Mieux vaut vérifier tôt, corriger ensemble, puis laisser faire. C’est comme ça que l’autre apprend et que toi, tu gagnes du temps.",
    ],
    keys: [
      "Confie un résultat, pas seulement une activité.",
      "Précise : le résultat attendu, la date, les limites, le point d’étape.",
      "Tu donnes le « quoi », l’autre choisit le « comment ».",
      "Vérifie tôt, corrige ensemble, ne reprends pas la tâche.",
    ],
    gesture: {
      intro:
        "Remplis cette fiche avant de confier une tâche, puis donne-la à la personne. Elle saura exactement ce qu’on attend d’elle.",
      fields: [
        {
          label: "La tâche confiée",
          example: "Préparer la commande de matériel du mois",
        },
        {
          label: "Le résultat attendu",
          example: "Un bon de commande validé, avec trois devis comparés",
        },
        { label: "Pour quand ?", example: "Vendredi 17 h" },
        {
          label: "Les limites (budget, décisions permises)",
          example: "Jusqu’à 500 € sans me demander",
        },
        {
          label: "Le point d’étape",
          example: "Mercredi matin, 10 minutes ensemble",
        },
        {
          label: "Ce que tu peux me demander",
          example: "Les anciens devis et l’accès au catalogue",
        },
      ],
      tip: "Fais-lui reformuler la tâche avec ses mots : tu vérifies tout de suite que c’est bien compris.",
    },
    check: [
      {
        q: "Quelle phrase délègue le mieux ?",
        options: [
          "« Occupe-toi des commandes, tu verras bien. »",
          "« Je voudrais trois devis comparés vendredi 17 h, jusqu’à 500 € sans me demander. »",
          "« Fais-le comme moi, je regarderai ce que ça donne. »",
        ],
        answer: 1,
        why: "Elle donne le résultat, la date et les limites : la personne sait quoi faire et jusqu’où aller.",
      },
      {
        q: "À quoi sert le point d’étape ?",
        options: [
          "À reprendre la tâche si elle avance doucement",
          "À corriger tôt, ensemble, avant que l’erreur coûte cher",
          "À montrer qu’on garde le contrôle sur tout",
        ],
        answer: 1,
        why: "Un contrôle en cours de route évite les mauvaises surprises sans enlever la tâche à la personne.",
      },
      {
        q: "Qui reste responsable du résultat final ?",
        options: [
          "La personne qui a reçu la tâche, seule",
          "Personne, puisque c’est délégué",
          "Toi, qui as délégué",
        ],
        answer: 2,
        why: "Tu confies le travail, pas la responsabilité : c’est toi qui réponds du résultat.",
      },
    ],
  },
  {
    id: "man-feedback",
    idea: [
      "Un retour franc est un cadeau, à condition de parler d’un fait précis et pas de la personne. « Tu es désordonné » blesse et n’apprend rien. « Hier, le dossier est arrivé sans la facture » est vérifiable : l’autre peut le comprendre et le corriger.",
      "Une méthode simple s’appelle « situation, effet, suite ». Tu décris la situation (ce que tu as vu), l’effet que ça a eu (sur le client, l’équipe, toi), puis tu demandes ou proposes la suite. Tu laisses ensuite l’autre répondre : il a peut-être une raison que tu ignores.",
      "Fais-le vite, en privé et au calme. Un reproche gardé trois semaines devient une rancœur. Et pense aussi aux retours positifs : dire précisément ce qui est bien aide autant que corriger ce qui ne va pas.",
    ],
    keys: [
      "Parle d’un fait précis, jamais de la personne.",
      "Méthode : situation, effet, suite.",
      "Fais-le vite, en privé, au calme.",
      "Écoute la réponse : tu n’as pas toutes les infos.",
    ],
    gesture: {
      intro:
        "Prépare ton retour avec cette méthode avant d’en parler. Écrire trois phrases t’évite de t’énerver ou de tourner autour du pot.",
      fields: [
        {
          label: "La situation (le fait précis)",
          example: "Mardi, tu es arrivé 30 minutes après le début du chantier.",
        },
        {
          label: "L’effet",
          example: "L’équipe a attendu les clés et on a pris du retard.",
        },
        { label: "Ta question", example: "Qu’est-ce qui s’est passé ?" },
        {
          label: "La suite demandée",
          example:
            "Prévenir par message dès que tu sais que tu seras en retard.",
        },
        {
          label: "Ce qui va bien (à dire aussi)",
          example: "Le travail sur place est toujours propre et soigné.",
        },
      ],
      tip: "Évite « toujours » et « jamais » : ils ouvrent une dispute sur les exemples au lieu de régler le problème.",
    },
    check: [
      {
        q: "Quelle phrase est un retour utile ?",
        options: [
          "« Tu n’es jamais fiable. »",
          "« Tu manques de sérieux. »",
          "« Ce matin, le devis est parti sans photos : le client a dû rappeler. »",
        ],
        answer: 2,
        why: "Elle décrit un fait précis et son effet, sans juger la personne.",
      },
      {
        q: "Que fais-tu juste après avoir décrit la situation et son effet ?",
        options: [
          "Tu laisses l’autre répondre, puis vous décidez la suite",
          "Tu annonces la sanction",
          "Tu changes de sujet pour détendre l’ambiance",
        ],
        answer: 0,
        why: "L’autre a peut-être une explication, et une suite choisie ensemble est mieux tenue.",
      },
      {
        q: "Quand faut-il faire le retour ?",
        options: [
          "Devant toute l’équipe, pour que ça serve d’exemple",
          "Vite et en privé",
          "À la fin de l’année, lors du bilan",
        ],
        answer: 1,
        why: "Un retour rapide et en privé est précis dans la mémoire de chacun et respecte la personne.",
      },
    ],
  },
  {
    id: "man-reunion",
    idea: [
      "Une réunion coûte cher : dix personnes pendant une heure, c’est dix heures de travail. Elle doit donc servir à décider ou à se coordonner, pas à lire à voix haute ce qu’on peut écrire dans un message. Si un mail suffit, ne fais pas de réunion.",
      "Pour qu’elle tienne en 20 minutes, prépare un ordre du jour : le but de la réunion, trois sujets maximum avec le temps de chacun, et ce qu’on doit avoir décidé à la fin. Envoie-le à l’avance : chacun vient préparé.",
      "Pendant la réunion, tu gardes le temps et tu notes les décisions. À la fin, tu relis : qui fait quoi, pour quand. Un compte rendu de cinq lignes, envoyé le jour même, vaut mieux qu’une heure de plus.",
    ],
    keys: [
      "Pas de réunion si un message suffit.",
      "Ordre du jour : un but, trois sujets au plus, un temps par sujet.",
      "Envoie-le avant : chacun vient préparé.",
      "Termine par : qui fait quoi, pour quand.",
    ],
    gesture: {
      intro:
        "Remplis ce modèle et envoie-le avec l’invitation. Il tient sur une page et garde la réunion courte.",
      fields: [
        {
          label: "But de la réunion",
          example: "Décider qui part sur quel chantier la semaine prochaine",
        },
        { label: "Sujet 1 et durée", example: "Le chantier de Lyon : 7 min" },
        { label: "Sujet 2 et durée", example: "Le matériel manquant : 5 min" },
        {
          label: "Sujet 3 et durée",
          example: "Les congés de fin de mois : 5 min",
        },
        {
          label: "Ce qui doit être décidé à la fin",
          example: "Le planning de la semaine",
        },
        {
          label: "Qui note et qui garde le temps",
          example: "Sarah note, Karim chronomètre",
        },
      ],
      tip: "Fixe la réunion debout, ou 5 minutes avant une pause : elle se terminera à l’heure toute seule.",
    },
    check: [
      {
        q: "Quand vaut-il mieux ne pas faire de réunion ?",
        options: [
          "Quand il faut prendre une décision à plusieurs",
          "Quand un simple message suffit à informer",
          "Quand le sujet est important",
        ],
        answer: 1,
        why: "Une réunion mobilise plusieurs personnes : si un message fait le travail, il vaut mieux l’éviter.",
      },
      {
        q: "Que doit contenir un bon ordre du jour ?",
        options: [
          "Une liste de tous les sujets de la semaine",
          "Le nom du plus bavard",
          "Un but, peu de sujets avec leur durée, et ce qu’on veut décider",
        ],
        answer: 2,
        why: "Un but clair et des sujets chronométrés gardent le groupe concentré.",
      },
      {
        q: "Que fais-tu juste avant de clore la réunion ?",
        options: [
          "Tu relis qui fait quoi et pour quand",
          "Tu ouvres un nouveau sujet pour ne pas gaspiller le temps restant",
          "Tu laisses chacun repartir sans rien dire",
        ],
        answer: 0,
        why: "Sans rappel des actions, les décisions s’oublient et rien n’avance.",
      },
    ],
  },
  {
    id: "man-objectifs",
    idea: [
      "« Améliorer le service client » n’est pas un objectif, c’est une envie. On ne sait ni quand c’est réussi, ni quoi faire lundi. Un bon objectif se vérifie : un chiffre, une date, et une personne qui s’en occupe.",
      "Une méthode connue consiste à se demander : est-ce précis, mesurable, réaliste, utile, et daté ? Par exemple : « Répondre à chaque mail client en moins de 24 heures, d’ici fin janvier ». Tout le monde peut dire à la fin si c’est atteint ou non.",
      "Mieux vaut peu d’objectifs que beaucoup : trois suffisent pour une équipe. Parle-en avec ceux qui doivent les tenir : un objectif imposé sans explication est rarement tenu. Et fais un point régulier pour ajuster.",
    ],
    keys: [
      "Un bon objectif se vérifie : un chiffre, une date, un responsable.",
      "Précis, mesurable, réaliste, utile, daté.",
      "Trois objectifs valent mieux que dix.",
      "Explique-les à ceux qui les portent et fais des points réguliers.",
    ],
    gesture: {
      intro:
        "Transforme une envie en objectif vérifiable. Remplis les cases dans l’ordre : à la fin, tu peux répondre « atteint » ou « pas atteint » sans discuter.",
      fields: [
        {
          label: "L’envie de départ",
          example: "Que les clients attendent moins",
        },
        {
          label: "L’objectif précis",
          example: "Répondre à chaque mail client en moins de 24 heures",
        },
        {
          label: "Comment le mesurer ?",
          example: "Le délai moyen noté chaque vendredi",
        },
        { label: "Pour quelle date ?", example: "Fin janvier" },
        { label: "Qui en est responsable ?", example: "Lina" },
        {
          label: "Quand fait-on le point ?",
          example: "Tous les quinze jours, 10 minutes",
        },
      ],
      tip: "Si tu hésites sur la difficulté, vise un objectif exigeant mais possible : trop facile n’apprend rien, trop dur décourage.",
    },
    check: [
      {
        q: "Lequel de ces objectifs se vérifie ?",
        options: [
          "« Être plus professionnel. »",
          "« Faire de son mieux. »",
          "« Livrer 90 % des commandes sous 48 heures d’ici mars. »",
        ],
        answer: 2,
        why: "Il a un chiffre et une date : on saura dire s’il est atteint.",
      },
      {
        q: "Combien d’objectifs donner à une équipe ?",
        options: [
          "Peu, trois suffisent",
          "Le plus possible, pour ne rien oublier",
          "Un par jour",
        ],
        answer: 0,
        why: "Trop d’objectifs diluent l’attention : l’équipe ne sait plus quoi faire en premier.",
      },
      {
        q: "Pourquoi en parler avec ceux qui doivent les tenir ?",
        options: [
          "Pour leur laisser fixer ce qu’ils veulent",
          "Parce qu’un objectif compris et discuté est plus souvent tenu",
          "Pour retarder la décision",
        ],
        answer: 1,
        why: "Quand on comprend pourquoi, on s’engage : un objectif imposé sans explication est vite oublié.",
      },
    ],
  },
  {
    id: "man-recruter",
    idea: [
      "Recruter est l’une des décisions les plus chères : un mauvais choix coûte du temps, de l’argent et de l’énergie à toute l’équipe. Avant de publier une annonce, écris à quoi servira le poste : quelles missions, quelles qualités indispensables, lesquelles seulement souhaitables. C’est ta fiche de poste.",
      "Pour l’entretien, prépare les mêmes questions pour tous les candidats et note les réponses sur une grille. Sans grille, on choisit souvent la personne qui nous ressemble ou qui parle bien, pas la plus compétente. Demande des exemples concrets : « Raconte une situation où… ».",
      "Reste dans ce qui concerne le métier : le droit français interdit de choisir ou d’écarter quelqu’un selon des critères comme l’origine, le sexe, l’âge ou la situation familiale. En cas de doute, renseigne-toi sur service-public.fr. Décide avec ta grille, puis réponds à chaque candidat, même pour dire non.",
    ],
    keys: [
      "Écris d’abord la fiche de poste : missions et qualités indispensables.",
      "Mêmes questions pour tous, réponses notées sur une grille.",
      "Demande des exemples concrets plutôt que des promesses.",
      "Juge sur les compétences ; certains critères sont interdits par la loi.",
    ],
    gesture: {
      intro:
        "Prépare ta grille avant le premier entretien. Tu notes chaque candidat de la même manière et tu compares à froid.",
      fields: [
        {
          label: "Le poste",
          example: "Aide-électricien, chantiers de rénovation",
        },
        {
          label: "Les qualités indispensables",
          example: "Ponctualité, soin, sécurité sur chantier",
        },
        {
          label: "Question 1 (exemple concret)",
          example: "Raconte un chantier où tu as dû corriger une erreur.",
        },
        {
          label: "Question 2 (mise en situation)",
          example:
            "Un client change d’avis en cours de travaux : que fais-tu ?",
        },
        {
          label: "Question 3 (motivation)",
          example: "Pourquoi ce métier, et pourquoi chez nous ?",
        },
        {
          label: "Note sur 5 par qualité",
          example: "Ponctualité 4, soin 5, sécurité 3",
        },
        {
          label: "Décision et réponse au candidat",
          example: "Deuxième entretien, réponse sous une semaine",
        },
      ],
      tip: "Note juste après l’entretien, pas le soir : la mémoire embellit ou déforme vite.",
    },
    check: [
      {
        q: "Pourquoi utiliser une grille d’entretien ?",
        options: [
          "Pour comparer les candidats de façon équitable",
          "Pour poser plus de questions personnelles",
          "Pour raccourcir le premier entretien",
        ],
        answer: 0,
        why: "Les mêmes questions et la même notation évitent de choisir au feeling.",
      },
      {
        q: "Que fais-tu avant de publier une annonce ?",
        options: [
          "Tu cherches un profil identique à toi",
          "Tu écris la fiche de poste : missions et qualités indispensables",
          "Tu attends de voir qui se présente",
        ],
        answer: 1,
        why: "Sans fiche de poste, tu ne sais pas qui chercher ni comment juger.",
      },
      {
        q: "Peut-on écarter un candidat à cause de son origine ou de son âge ?",
        options: [
          "Oui, si l’équipe est d’accord",
          "Oui, pendant la période d’essai seulement",
          "Non, ces critères sont interdits par la loi",
        ],
        answer: 2,
        why: "Le droit français interdit la discrimination à l’embauche : on juge les compétences pour le poste.",
      },
    ],
  },
  {
    id: "man-conflit",
    idea: [
      "Un conflit commence presque toujours petit : un message mal compris, une tâche mal répartie, un reproche jamais dit. Plus tu attends, plus chacun se raconte sa propre histoire. La règle d’or : en parler tôt, en direct, en privé.",
      "Pour désamorcer, sépare les faits, les ressentis et les besoins. Les faits : « la réunion a commencé sans toi ». Le ressenti : « je me suis senti mis de côté ». Le besoin : « être prévenu ». Chacun parle à tour de rôle, sans couper, et reformule ce que l’autre a dit avant de répondre.",
      "Le but n’est pas de désigner un coupable mais de trouver un accord pour la suite : qui fait quoi autrement ? Note-le et refais un point une semaine plus tard. Si ça dégénère malgré tout (insultes, menaces, harcèlement), ce n’est plus un simple conflit : préviens la direction ou les ressources humaines.",
    ],
    keys: [
      "Agis tôt, en privé, en direct.",
      "Sépare les faits, les ressentis et les besoins.",
      "Reformule ce que l’autre a dit avant de répondre.",
      "Cherche un accord pour la suite, pas un coupable.",
    ],
    gesture: {
      intro:
        "Prépare la discussion avec cette fiche. Tu y mets ce que tu veux dire et tu t’obliges à chercher une solution plutôt qu’à rejouer la dispute.",
      fields: [
        {
          label: "Les faits (ce qu’on a pu voir ou entendre)",
          example: "La réunion de lundi a commencé sans Inès.",
        },
        {
          label: "Ce que j’ai ressenti",
          example: "Je me suis senti mis de côté.",
        },
        {
          label: "Mon besoin",
          example: "Être prévenu quand l’horaire change.",
        },
        {
          label: "Ce que l’autre va peut-être dire",
          example: "Il pensait que j’avais vu le message.",
        },
        {
          label: "Une solution possible",
          example: "Un message dans le groupe dès qu’un horaire bouge.",
        },
        {
          label: "Date du point de suivi",
          example: "Lundi prochain, 5 minutes",
        },
      ],
      tip: "Commence par « j’ai besoin de te parler de… » plutôt que par « il faut qu’on parle » : ça rassure.",
    },
    check: [
      {
        q: "Quel est le meilleur moment pour parler d’une tension ?",
        options: [
          "Dès que possible, en privé",
          "Quand elle devient évidente pour toute l’équipe",
          "Jamais : ça finit toujours par passer",
        ],
        answer: 0,
        why: "Plus tôt on en parle, plus c’est petit et facile à régler.",
      },
      {
        q: "Que veut dire « reformuler » ?",
        options: [
          "Répéter plus fort ce que tu viens de dire",
          "Redire avec tes mots ce que l’autre a compris pour vérifier",
          "Changer de sujet",
        ],
        answer: 1,
        why: "En reformulant, l’autre se sent écouté et vous vérifiez que vous parlez de la même chose.",
      },
      {
        q: "Que faire face à des insultes répétées ou du harcèlement ?",
        options: [
          "Les traiter comme un simple désaccord et attendre",
          "Faire un débat devant l’équipe",
          "Prévenir la direction ou les ressources humaines",
        ],
        answer: 2,
        why: "Ce n’est plus un conflit ordinaire : c’est une situation grave qui doit être traitée officiellement.",
      },
    ],
  },
  {
    id: "man-motiver",
    idea: [
      "On ne motive pas les gens avec des slogans. On crée les conditions pour qu’ils aient envie de bien faire : comprendre à quoi sert leur travail, avoir une marge de décision, progresser et se sentir reconnus. L’argent compte, mais il ne remplace pas ces quatre choses.",
      "Faire grandir une équipe passe par la formation et la confiance. Repère ce que chacun fait bien, confie-lui un peu plus difficile que d’habitude, et soutiens-le. Un bon salarié qui ne progresse plus finit par partir : parle avec chacun de ce qu’il veut apprendre.",
      "Remercie précisément et souvent. « Merci d’avoir rappelé ce client, il a signé » vaut mieux qu’un « bon boulot » vague. Et propose à chacun un entretien individuel régulier, même court : c’est là que tu apprends ce qui le retient ou ce qui le pousse à partir.",
    ],
    keys: [
      "Donne du sens, de l’autonomie, de la progression et de la reconnaissance.",
      "Confie des responsabilités un cran au-dessus et soutiens.",
      "Remercie de façon précise, pas vague.",
      "Fais un point individuel régulier avec chacun.",
    ],
    gesture: {
      intro:
        "Prépare un entretien individuel avec un membre de ton équipe. Cette fiche t’aide à repérer comment l’aider à progresser.",
      fields: [
        { label: "La personne", example: "Yanis, 2 ans dans l’équipe" },
        {
          label: "Ce qu’elle fait très bien",
          example: "Rassure les clients, travail soigné",
        },
        {
          label: "Ce qu’elle voudrait apprendre",
          example: "Faire des devis seul",
        },
        {
          label: "Une responsabilité à lui confier",
          example: "Préparer les devis simples, avec ma relecture",
        },
        {
          label: "Une formation ou un accompagnement",
          example: "Deux séances avec Karim, puis une formation courte",
        },
        {
          label: "Le remerciement précis à faire",
          example: "Merci d’avoir pris le temps de rassurer Mme Roux.",
        },
      ],
      tip: "Pose la question « Qu’est-ce qui te donnerait envie de rester ici dans deux ans ? » et écoute sans te défendre.",
    },
    check: [
      {
        q: "Qu’est-ce qui motive vraiment les gens au travail ?",
        options: [
          "Un discours enthousiaste en début de semaine",
          "Le sens, l’autonomie, la progression et la reconnaissance",
          "Des consignes très détaillées à suivre",
        ],
        answer: 1,
        why: "Ces quatre éléments donnent envie de bien faire, au-delà du salaire.",
      },
      {
        q: "Quel remerciement est le plus efficace ?",
        options: [
          "« Bon boulot, continue. »",
          "« Merci pour tout. »",
          "« Merci d’avoir rappelé ce client : il a signé. »",
        ],
        answer: 2,
        why: "Un remerciement précis montre que tu as vu ce que la personne a fait et ce que ça a changé.",
      },
      {
        q: "Un très bon salarié ne progresse plus. Que risque-t-il de se passer ?",
        options: [
          "Il part voir ailleurs",
          "Il devient plus efficace tout seul",
          "Il demande une baisse de responsabilités",
        ],
        answer: 0,
        why: "Sans perspective de progression, les meilleurs cherchent souvent un autre poste.",
      },
    ],
  },
];
