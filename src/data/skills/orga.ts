import type { SkillContent } from "./types";

/** Organisation : les compétences sans leçon longue. */
export const skills: SkillContent[] = [
  {
    id: "org-priorites",
    idea: [
      "Tout ne peut pas se faire en même temps, et tout n’a pas la même valeur. Choisir ses priorités, c’est décider quoi faire d’abord, quoi planifier, quoi confier à quelqu’un d’autre et quoi laisser tomber. Sans ce tri, on s’occupe de ce qui crie le plus fort, pas de ce qui compte le plus.",
      "La matrice d’Eisenhower aide à trier avec deux questions : est-ce urgent (une échéance proche) ? est-ce important (ça compte pour mes objectifs) ? Urgent et important : à faire tout de suite. Important mais pas urgent : à planifier. Urgent mais pas important : à déléguer ou à faire vite. Ni l’un ni l’autre : à abandonner.",
      "Le piège, c’est de passer sa journée sur l’urgent et de ne jamais avoir le temps de l’important, comme se former ou préparer l’avenir. Réserve donc du temps pour la case « important, pas urgent » : c’est elle qui évite de futures urgences.",
    ],
    keys: [
      "Choisir, c’est aussi renoncer à certaines choses.",
      "Deux questions : est-ce urgent ? est-ce important ?",
      "Important mais pas urgent : à planifier, c’est la case la plus précieuse.",
      "Urgent sans être important : à déléguer ou expédier.",
    ],
    gesture: {
      intro:
        "Écris toutes tes tâches en vrac, puis range-les dans les quatre cases. Tu verras tout de suite par quoi commencer.",
      fields: [
        {
          label: "Urgent et important : à faire maintenant",
          example: "Envoyer le devis qui expire demain",
        },
        {
          label: "Important, pas urgent : à planifier",
          example: "Préparer la formation de janvier",
        },
        {
          label: "Urgent, pas important : à déléguer ou faire vite",
          example: "Répondre à une demande d’information simple",
        },
        {
          label: "Ni urgent ni important : à laisser tomber",
          example: "Trier de vieilles photos sur le téléphone",
        },
        {
          label: "Ma première tâche aujourd’hui",
          example: "Le devis, avant 10 h",
        },
      ],
      tip: "Si tout te semble urgent et important, demande-toi : « Que se passe-t-il vraiment si je ne le fais pas aujourd’hui ? »",
    },
    check: [
      {
        q: "Dans quelle case classer « préparer sa formation de janvier » (pas pour demain, mais utile) ?",
        options: [
          "Urgent et important",
          "Important mais pas urgent : à planifier",
          "Ni urgent ni important",
        ],
        answer: 1,
        why: "Ça compte pour l’avenir, mais rien ne presse : on réserve un créneau pour s’y mettre.",
      },
      {
        q: "Quel est le danger de ne traiter que l’urgent ?",
        options: [
          "On finit toujours en avance",
          "On n’a jamais le temps de l’important qui évite les futures urgences",
          "On devient trop organisé",
        ],
        answer: 1,
        why: "Sans temps pour l’important, les problèmes s’accumulent et deviennent des urgences.",
      },
      {
        q: "Que faire d’une tâche ni urgente ni importante ?",
        options: [
          "La mettre en premier pour s’échauffer",
          "La déléguer obligatoirement",
          "La laisser tomber ou la reporter sans culpabilité",
        ],
        answer: 2,
        why: "Elle ne sert ni tes objectifs ni une échéance : tu peux l’abandonner.",
      },
    ],
  },
  {
    id: "org-liste",
    idea: [
      "La tête est faite pour réfléchir, pas pour stocker. Quand tu essaies de tout retenir, tu y penses sans arrêt et tu finis par oublier. Une liste écrite, au même endroit, libère ton esprit : tu sais que rien ne se perd.",
      "Une liste efficace est courte et concrète. Écris des actions qu’on peut faire, avec un verbe : « Appeler le plombier » plutôt que « plomberie ». Découpe ce qui est gros : « Refaire le site » devient « Lister les pages », « Écrire la page d’accueil »… Ne garde pour le jour que trois à cinq tâches réalistes.",
      "Chaque soir ou chaque matin, prends cinq minutes : coche ce qui est fait, reporte le reste, ajoute ce qui est nouveau. Un papier, une application ou les notes du téléphone : l’outil importe peu, pourvu qu’il soit toujours à portée de main.",
    ],
    keys: [
      "Écris tout au même endroit : ta tête n’est pas un classeur.",
      "Des actions concrètes qui commencent par un verbe.",
      "Découpe les gros projets en petites étapes.",
      "Trois à cinq tâches pour la journée, pas plus.",
    ],
    gesture: {
      intro:
        "Fais ta liste du jour avec ce modèle. Cinq minutes le matin ou la veille au soir suffisent.",
      fields: [
        {
          label: "Mon objectif principal du jour",
          example: "Envoyer les trois devis en attente",
        },
        {
          label: "Tâche 1 (verbe + objet)",
          example: "Appeler M. Roux pour confirmer les mesures",
        },
        { label: "Tâche 2", example: "Rédiger le devis pour Mme Lopez" },
        { label: "Tâche 3", example: "Commander les carrelages avant 16 h" },
        {
          label: "Petites tâches de moins de 5 minutes",
          example: "Répondre à deux mails, payer une facture",
        },
        { label: "Ce que je reporte à demain", example: "Ranger l’atelier" },
      ],
      tip: "Commence par la tâche qui te fait le plus peur : le reste de la journée sera plus léger.",
    },
    check: [
      {
        q: "Quelle ligne est la mieux écrite dans une liste de tâches ?",
        options: [
          "« Plomberie »",
          "« Le truc de Paul »",
          "« Appeler le plombier pour fixer un rendez-vous »",
        ],
        answer: 2,
        why: "Elle commence par un verbe et dit exactement quoi faire.",
      },
      {
        q: "Une tâche est très grosse : « refaire le site ». Que faire ?",
        options: [
          "La découper en petites étapes",
          "La laisser telle quelle",
          "La mettre en haut de la liste du jour",
        ],
        answer: 0,
        why: "Les petites étapes se font facilement et on voit l’avancée.",
      },
      {
        q: "Combien de tâches viser pour la journée ?",
        options: [
          "Toutes celles qu’on a en tête, sans limite",
          "Trois à cinq, réalistes",
          "Une seule, jamais plus",
        ],
        answer: 1,
        why: "Une liste réaliste se termine souvent, ce qui donne envie de continuer.",
      },
    ],
  },
  {
    id: "org-agenda",
    idea: [
      "L’agenda n’est pas seulement un endroit où l’on note les rendez-vous des autres. C’est ton outil pour protéger le temps de ce qui compte : un travail de fond, une formation, du sport, la famille. Ce qui n’est pas dans l’agenda se fait rarement.",
      "Pour cela, bloque des créneaux, comme des rendez-vous avec toi-même : deux heures mardi matin pour avancer sur ton projet, 30 minutes chaque midi pour les mails. Garde aussi des plages vides : les imprévus arrivent, et un agenda plein à ras bord déborde toujours.",
      "Une semaine type t’aide à poser le cadre : les moments fixes (travail, trajets, enfants), puis les créneaux protégés pour tes priorités. Tu l’ajustes ensuite chaque semaine. Estime les durées avec un peu de marge : tout prend plus longtemps que prévu.",
    ],
    keys: [
      "Ce qui n’est pas dans l’agenda se fait rarement.",
      "Bloque des créneaux pour tes priorités, comme des rendez-vous.",
      "Garde des plages libres pour les imprévus.",
      "Ajoute de la marge : tout dure plus longtemps que prévu.",
    ],
    gesture: {
      intro:
        "Dessine ta semaine type. Remplis les moments fixes d’abord, puis place tes priorités dans ce qui reste.",
      fields: [
        {
          label: "Mes moments fixes (travail, trajets, famille)",
          example: "Travail 8 h-17 h, crèche 17 h 30",
        },
        {
          label: "Mon créneau protégé n° 1 (priorité)",
          example: "Mardi 18 h-20 h : préparer mon examen",
        },
        {
          label: "Mon créneau protégé n° 2",
          example: "Samedi 9 h-10 h 30 : sport",
        },
        {
          label: "Un créneau pour les mails et appels",
          example: "Chaque jour de 12 h 30 à 13 h",
        },
        {
          label: "Ma plage libre pour les imprévus",
          example: "Jeudi après-midi : rien de prévu",
        },
        {
          label: "Mon moment de bilan de la semaine",
          example: "Dimanche 18 h, dix minutes",
        },
      ],
      tip: "Place d’abord les créneaux importants, puis le reste : si tu commences par le reste, il ne restera plus de place.",
    },
    check: [
      {
        q: "Pourquoi bloquer des créneaux pour ses priorités ?",
        options: [
          "Pour être plus occupé",
          "Parce que ce qui n’est pas planifié est souvent repoussé",
          "Pour avoir moins de rendez-vous",
        ],
        answer: 1,
        why: "Un créneau réservé protège ton temps contre les demandes du moment.",
      },
      {
        q: "Pourquoi garder des plages libres ?",
        options: [
          "Pour se reposer chaque fois",
          "Pour qu’on te croie disponible",
          "Pour absorber les imprévus sans tout décaler",
        ],
        answer: 2,
        why: "Les imprévus arrivent toujours : sans marge, tout le planning se déplace.",
      },
      {
        q: "Une tâche prend d’habitude 40 minutes. Combien de temps prévois-tu ?",
        options: [
          "40 minutes pile, sinon tu perds du temps",
          "Un peu plus pour garder de la marge",
          "10 minutes, pour te motiver",
        ],
        answer: 1,
        why: "Les durées sont souvent sous-estimées : un peu de marge évite le retard en chaîne.",
      },
    ],
  },
  {
    id: "org-concentration",
    idea: [
      "Chaque interruption (une notification, un mail, une question) fait perdre bien plus que les quelques secondes qu’elle prend : il faut ensuite se replonger dans ce qu’on faisait. Pour avancer sur un travail difficile, il faut de longs moments sans être dérangé.",
      "Une méthode simple : travailler 45 minutes sur une seule tâche, puis faire une pause de 5 à 10 minutes. Avant de commencer, décide précisément de la tâche, mets ton téléphone hors de vue en mode silencieux, ferme les onglets inutiles et préviens ton entourage si tu peux.",
      "Pendant la pause, bouge, bois de l’eau, regarde au loin : évite les réseaux sociaux qui te fatiguent autrement. Si une idée ou une tâche surgit, note-la sur un papier et reviens à ce que tu faisais : tu la traiteras après. Avec l’habitude, la concentration devient plus facile.",
    ],
    keys: [
      "Une interruption coûte plus que sa durée : il faut se replonger dans la tâche.",
      "45 minutes sur une seule tâche, puis une vraie pause.",
      "Téléphone hors de vue, notifications coupées, onglets fermés.",
      "Note les idées qui surgissent et reviens à ta tâche.",
    ],
    gesture: {
      intro:
        "Prépare ta prochaine séance de concentration avec cette fiche. Tu la remplis en deux minutes avant de commencer.",
      fields: [
        {
          label: "La tâche unique de la séance",
          example: "Écrire le devis de la salle de bain",
        },
        { label: "Début et fin (45 minutes)", example: "9 h 00 - 9 h 45" },
        {
          label: "Ce que je coupe ou j’éloigne",
          example: "Notifications, téléphone dans le sac, onglets mails fermés",
        },
        {
          label: "Mon papier pour les idées qui surgissent",
          example: "Feuille posée à gauche du clavier",
        },
        {
          label: "Ma pause (5-10 minutes)",
          example: "Boire un verre d’eau et marcher dans le couloir",
        },
      ],
      tip: "Commence par 25 minutes si 45 te paraît long, puis augmente peu à peu.",
    },
    check: [
      {
        q: "Pourquoi les interruptions font-elles perdre du temps ?",
        options: [
          "Parce qu’il faut ensuite se replonger dans la tâche",
          "Parce qu’elles sont toujours longues",
          "Parce qu’elles te donnent de nouvelles idées",
        ],
        answer: 0,
        why: "Le coût réel, c’est le temps pour retrouver le fil de ce que tu faisais.",
      },
      {
        q: "Une idée surgit en plein travail. Que fais-tu ?",
        options: [
          "Tu arrêtes tout pour t’en occuper",
          "Tu l’oublies de toute façon",
          "Tu la notes sur un papier et tu continues",
        ],
        answer: 2,
        why: "La noter la libère de ta tête, et tu la traiteras à la pause.",
      },
      {
        q: "Que faire pendant la pause ?",
        options: [
          "Ouvrir les réseaux sociaux",
          "Bouger, boire de l’eau, regarder au loin",
          "Ouvrir de nouveaux mails professionnels",
        ],
        answer: 1,
        why: "Une vraie pause repose le corps et l’esprit, alors que les écrans fatiguent encore.",
      },
    ],
  },
  {
    id: "org-projet",
    idea: [
      "Un projet, c’est un travail avec un but, une date de fin et plusieurs étapes : déménager, lancer un site, organiser un mariage. Il paraît énorme tant qu’on ne l’a pas découpé. Le découpage est la clé : un gros objectif devient une suite de petites tâches faisables.",
      "Commence par écrire le but en une phrase et la date limite. Puis liste toutes les tâches, regroupe-les en grandes étapes, mets-les dans l’ordre, estime la durée de chacune et note qui s’en occupe. Cherche les tâches qui en bloquent d’autres : ce sont elles qui décident de la date finale.",
      "Pour suivre, fais un point régulier (chaque semaine, par exemple) : ce qui est fait, ce qui bloque, ce qui change. Si tu prends du retard, ajuste le plan tôt : décale, simplifie ou demande de l’aide. À la fin, prends dix minutes pour noter ce que tu referas ou éviteras la prochaine fois.",
    ],
    keys: [
      "But en une phrase et date limite.",
      "Découpe en étapes, puis en petites tâches, avec une durée et un responsable.",
      "Repère les tâches qui bloquent les autres.",
      "Point régulier : fait, bloqué, changements.",
    ],
    gesture: {
      intro:
        "Remplis ce plan avant de te lancer. Il tient sur une page et sert de tableau de bord pendant tout le projet.",
      fields: [
        {
          label: "Le but en une phrase",
          example: "Ouvrir la boutique en ligne avant le 15 mars",
        },
        {
          label: "Étape 1 et ses tâches",
          example: "Préparation : choisir les produits, prendre les photos",
        },
        {
          label: "Étape 2 et ses tâches",
          example: "Création : construire le site, écrire les fiches",
        },
        {
          label: "Étape 3 et ses tâches",
          example: "Lancement : tester la commande, annoncer l’ouverture",
        },
        {
          label: "La tâche qui bloque les autres",
          example: "Choisir l’hébergeur : rien ne peut commencer avant",
        },
        {
          label: "Date et heure du point hebdomadaire",
          example: "Vendredi 17 h, 15 minutes",
        },
      ],
      tip: "Prévois dès le début une marge d’environ un cinquième du temps : les imprévus arrivent presque toujours.",
    },
    check: [
      {
        q: "Quelle est la première étape pour mener un projet ?",
        options: [
          "Commencer par la tâche la plus facile",
          "Écrire le but en une phrase avec une date limite",
          "Acheter le matériel",
        ],
        answer: 1,
        why: "Sans but ni date, on ne sait pas où l’on va ni quand on a fini.",
      },
      {
        q: "Pourquoi repérer les tâches qui en bloquent d’autres ?",
        options: [
          "Pour les faire en dernier",
          "Parce qu’elles sont les plus longues",
          "Parce qu’elles déterminent la date de fin et doivent passer d’abord",
        ],
        answer: 2,
        why: "Tant qu’elles ne sont pas faites, d’autres tâches ne peuvent pas commencer.",
      },
      {
        q: "Tu prends du retard. Que fais-tu ?",
        options: [
          "Tu ajustes le plan tôt : décaler, simplifier ou demander de l’aide",
          "Tu attends la date de fin pour en parler",
          "Tu travailles plus vite sans changer le plan",
        ],
        answer: 0,
        why: "Un ajustement précoce coûte peu, alors qu’un retard découvert à la fin coûte cher.",
      },
    ],
  },
  {
    id: "org-systeme",
    idea: [
      "Un système d’organisation, c’est l’ensemble des habitudes qui te permettent de ne rien oublier et d’avancer sur ce qui compte, sans y passer ta vie. Il combine ce que tu as déjà vu : une liste unique où tout est noté, des priorités, un agenda, des créneaux de concentration et un suivi des projets.",
      "Un bon système tient en quelques rituels. Chaque jour : noter ce qui arrive au même endroit, choisir tes trois tâches. Chaque semaine : faire le point, vider ta boîte mail et ta liste, planifier la semaine suivante. Chaque mois : regarder tes projets et tes objectifs, supprimer ce qui ne sert plus.",
      "Le meilleur système est celui que tu utilises vraiment. Commence petit, garde le plus simple possible et améliore-le quand quelque chose coince. Si tu abandonnes ton système pendant une semaine, ce n’est pas grave : reprends-le simplement avec un point rapide. La régularité compte plus que la perfection.",
    ],
    keys: [
      "Un système = des habitudes simples, pas un outil compliqué.",
      "Un seul endroit où tout est noté.",
      "Rituels : un point chaque jour, chaque semaine, chaque mois.",
      "Commence petit et améliore-le quand quelque chose coince.",
    ],
    gesture: {
      intro:
        "Décris ton système sur une page : où tu notes, et à quel moment tu fais quoi. Tu pourras l’afficher près de ton bureau.",
      fields: [
        {
          label: "L’endroit unique où je note tout",
          example: "L’application Notes du téléphone, liste « À faire »",
        },
        {
          label: "Mon rituel du jour (5 minutes)",
          example: "Chaque matin : choisir mes trois tâches du jour",
        },
        {
          label: "Mon rituel de la semaine (20 minutes)",
          example:
            "Dimanche soir : faire le point et planifier la semaine suivante",
        },
        {
          label: "Mon rituel du mois (30 minutes)",
          example: "Le 1er du mois : relire mes projets et objectifs",
        },
        {
          label: "Mes outils (agenda, liste, projets)",
          example:
            "Agenda du téléphone, liste de notes, tableau papier pour les projets",
        },
        {
          label: "Mon plan si j’abandonne une semaine",
          example: "Reprendre par un point de dix minutes et repartir",
        },
      ],
      tip: "Teste ton système pendant un mois avant de le changer : un outil qui n’a pas eu le temps de devenir une habitude ne peut pas être jugé.",
    },
    check: [
      {
        q: "Qu’est-ce qu’un bon système d’organisation ?",
        options: [
          "Le plus complet, avec beaucoup d’outils",
          "Celui qu’on utilise vraiment, simple et régulier",
          "Celui que tout le monde utilise",
        ],
        answer: 1,
        why: "Un système n’a de valeur que s’il est utilisé : la simplicité aide la régularité.",
      },
      {
        q: "Quel est l’intérêt du point de la semaine ?",
        options: [
          "Remplacer le point du jour",
          "Montrer à ton entourage que tu es organisé",
          "Faire le bilan, vider ta liste et planifier la semaine suivante",
        ],
        answer: 2,
        why: "Il remet de l’ordre dans ce qui s’est accumulé et prépare les jours à venir.",
      },
      {
        q: "Tu as abandonné ton système pendant une semaine. Que faire ?",
        options: [
          "Reprendre simplement par un point rapide",
          "Tout abandonner définitivement",
          "Changer d’outil chaque fois que ça arrive",
        ],
        answer: 0,
        why: "Reprendre sans culpabilité maintient l’habitude : la régularité compte plus que la perfection.",
      },
    ],
  },
];
