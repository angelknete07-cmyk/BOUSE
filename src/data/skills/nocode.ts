import type { SkillContent } from "./types";

/** Automatiser sans coder : les compétences sans leçon longue. */
export const skills: SkillContent[] = [
  {
    id: "nc-reperer",
    idea: [
      "Automatiser, c’est demander à un outil de faire à ta place ce que tu refais toujours de la même façon. Avant de choisir un outil, il faut donc trouver quelles tâches s’y prêtent. Elles ont toutes un point commun : tu les refais chaque semaine, presque à l’identique.",
      "Une bonne tâche à automatiser est répétitive, simple à décrire en quelques étapes, et sans vraie décision à prendre. Recopier une commande dans un tableau, envoyer le même mail de confirmation, relancer un client en retard : ce sont de bons candidats.",
      "Pendant une semaine, note chaque tâche que tu sens répétitive, avec le temps qu’elle prend. À la fin, tu verras laquelle te coûte le plus d’heures : c’est par celle-là qu’on commence.",
    ],
    keys: [
      "Une tâche à automatiser est répétitive et simple à décrire.",
      "Si elle demande du jugement à chaque fois, garde-la pour toi.",
      "Note le temps que chaque tâche te prend sur une semaine.",
      "Commence par celle qui te coûte le plus d’heures.",
    ],
    gesture: {
      intro:
        "Fais la liste de tes tâches répétitives de la semaine. Pour chacune, note la fréquence et le temps passé : la gagnante saute aux yeux.",
      fields: [
        {
          label: "Tâche répétitive n° 1",
          example: "Envoyer un mail de confirmation après chaque commande",
        },
        { label: "Fréquence", example: "10 fois par semaine" },
        { label: "Temps passé à chaque fois", example: "5 minutes" },
        {
          label: "Temps total par semaine",
          example: "50 minutes",
        },
        {
          label: "Peut-on la décrire en 3 étapes simples ?",
          example: "Oui : commande reçue, mail rédigé, mail envoyé",
        },
        {
          label: "Ma candidate pour commencer",
          example: "Le mail de confirmation (le plus répété)",
        },
      ],
      tip: "Vise une tâche que tu détestes et qui est très simple : un premier succès rapide te donne envie de continuer.",
    },
    check: [
      {
        q: "Quelle tâche est la meilleure candidate à l’automatisation ?",
        options: [
          "Choisir la stratégie de ton entreprise",
          "Envoyer le même mail de confirmation après chaque commande",
          "Répondre à un client très en colère",
        ],
        answer: 1,
        why: "Elle est répétitive, simple à décrire et ne demande aucun jugement.",
      },
      {
        q: "Avant de choisir un outil, que faut-il faire ?",
        options: [
          "Lister ses tâches répétitives et le temps qu’elles prennent",
          "Acheter l’abonnement le plus complet",
          "Attendre d’avoir beaucoup de clients",
        ],
        answer: 0,
        why: "Sans repérer ce qui se répète, on automatise au hasard et on perd du temps.",
      },
      {
        q: "Par quelle tâche commencer ?",
        options: [
          "La plus rare, pour ne pas se tromper",
          "La plus compliquée, pour apprendre vite",
          "Celle qui te coûte le plus d’heures et reste simple",
        ],
        answer: 2,
        why: "C’est elle qui te fait gagner le plus de temps pour le moins d’effort.",
      },
    ],
  },
  {
    id: "nc-formulaire",
    idea: [
      "Un formulaire en ligne (Google Forms, Tally, Typeform…) remplace les échanges de mails et de messages pour collecter des informations. Chaque réponse tombe automatiquement dans un tableau, bien rangée, sans que tu aies à recopier quoi que ce soit.",
      "Tu peux aller plus loin avec une réponse automatique : dès que quelqu’un envoie le formulaire, il reçoit un mail de confirmation avec la suite des étapes. Ton client est rassuré, et toi tu n’as rien tapé.",
      "Un bon formulaire est court. Chaque question en plus fait fuir des gens. Ne demande que ce dont tu as vraiment besoin pour la suite, et utilise des listes de choix plutôt que du texte libre quand tu peux.",
    ],
    keys: [
      "Un formulaire range les réponses dans un tableau tout seul.",
      "Une réponse automatique confirme la réception au client.",
      "Moins de questions, plus de réponses.",
      "Préfère les listes de choix au texte libre.",
    ],
    gesture: {
      intro:
        "Prépare ton formulaire sur le papier avant de le créer en ligne : ses questions, l’endroit où vont les réponses, et le message automatique envoyé.",
      fields: [
        {
          label: "À quoi sert le formulaire ?",
          example: "Demande de devis pour un nettoyage de vitres",
        },
        {
          label: "Questions indispensables (3 à 5)",
          example: "Nom, e-mail, adresse, nombre de fenêtres",
        },
        {
          label: "Question en liste de choix",
          example: "Type de logement : maison / appartement / local",
        },
        {
          label: "Où arrivent les réponses ?",
          example: "Un tableau en ligne partagé avec mon associé",
        },
        {
          label: "Mail de confirmation automatique",
          example: "Merci, je te réponds sous 48 h avec un devis.",
        },
      ],
      tip: "Teste ton formulaire toi-même avant de le partager : tu verras vite quelle question est de trop.",
    },
    check: [
      {
        q: "Que devient une réponse envoyée dans un formulaire en ligne ?",
        options: [
          "Elle part dans ta boîte de spams",
          "Elle disparaît au bout d’une heure",
          "Elle est rangée automatiquement dans un tableau",
        ],
        answer: 2,
        why: "Les réponses s’enregistrent ligne par ligne, sans recopie à la main.",
      },
      {
        q: "À quoi sert une réponse automatique ?",
        options: [
          "À confirmer à la personne que son envoi est bien reçu",
          "À supprimer sa réponse",
          "À remplacer ton devis",
        ],
        answer: 0,
        why: "Elle rassure le client tout de suite, sans que tu aies rien à écrire.",
      },
      {
        q: "Quel formulaire marche le mieux ?",
        options: [
          "Vingt questions pour tout savoir",
          "Quelques questions utiles, avec des listes de choix",
          "Une seule grande case de texte libre",
        ],
        answer: 1,
        why: "Un formulaire court et clair est rempli jusqu’au bout, ce qui donne de meilleures réponses.",
      },
    ],
  },
  {
    id: "nc-relier",
    idea: [
      "Les outils d’automatisation (Zapier, Make, n8n…) relient tes applications entre elles. Le principe tient en une phrase : « quand X arrive, fais Y ». Par exemple : quand quelqu’un remplit mon formulaire, ajoute une ligne dans mon tableau et préviens-moi par message.",
      "Un scénario a toujours deux parties. Le déclencheur est l’événement de départ (un mail reçu, un formulaire envoyé). L’action est ce qui se passe ensuite (créer une ligne, envoyer un message). Tu peux enchaîner plusieurs actions.",
      "Pour ton premier scénario, reste simple : un déclencheur, une action. Teste-le avec une fausse donnée avant de l’activer pour de vrai, puis regarde l’historique pour vérifier que tout s’est bien passé.",
    ],
    keys: [
      "Un scénario = un déclencheur + une ou plusieurs actions.",
      "« Quand X arrive, fais Y » : voilà le schéma.",
      "Commence par un scénario très simple.",
      "Teste avec une fausse donnée avant d’activer.",
    ],
    gesture: {
      intro:
        "Écris ton premier scénario en toutes lettres. Quand il est clair sur le papier, il est facile à construire dans l’outil.",
      fields: [
        {
          label: "Déclencheur : quand…",
          example: "quelqu’un envoie mon formulaire de contact",
        },
        {
          label: "Action 1 : alors…",
          example: "ajouter une ligne dans mon tableau des clients",
        },
        {
          label: "Action 2 : et aussi…",
          example: "m’envoyer un message sur mon téléphone",
        },
        {
          label: "Les outils reliés",
          example: "Formulaire, tableau en ligne, messagerie",
        },
        {
          label: "Mon test avec une fausse donnée",
          example: "Une réponse à mon nom, vérifiée dans le tableau",
        },
      ],
      tip: "Donne un nom clair à ton scénario (« Formulaire vers tableau ») : tu t’y retrouveras quand tu en auras dix.",
    },
    check: [
      {
        q: "Dans un scénario, le déclencheur est :",
        options: [
          "le résultat final",
          "l’événement qui lance le scénario",
          "le prix de l’abonnement",
        ],
        answer: 1,
        why: "Le déclencheur est le « quand X arrive » : c’est lui qui démarre tout.",
      },
      {
        q: "Un exemple de scénario qui a du sens :",
        options: [
          "Quand je reçois un nouveau formulaire, ajouter une ligne dans mon tableau",
          "Quand je dors, relire mes factures",
          "Quand j’ai faim, commander à manger sans jamais avoir réglé",
        ],
        answer: 0,
        why: "Il a un déclencheur précis et une action claire que l’outil peut faire seul.",
      },
      {
        q: "Avant d’activer un scénario pour de bon, il faut :",
        options: [
          "l’activer et croiser les doigts",
          "le tester avec une fausse donnée",
          "demander à tous tes clients de l’essayer",
        ],
        answer: 1,
        why: "Un test avec une fausse donnée évite d’envoyer des erreurs à de vrais clients.",
      },
    ],
  },
  {
    id: "nc-base",
    idea: [
      "Une base de données en ligne (Airtable, Notion, un tableur partagé…) range tes informations comme un tableau amélioré : une ligne par élément (un client, un produit), une colonne par information (nom, téléphone, stock). Tout le monde y accède, depuis n’importe où.",
      "Sa force : on peut relier les tableaux entre eux. Un tableau « Clients » et un tableau « Commandes » se répondent : chaque commande pointe vers son client, sans retaper son nom. On évite ainsi les doublons et les erreurs.",
      "Avant de construire, dessine sur papier tes colonnes. Une information = une colonne, un seul type de contenu par colonne (date, nombre, choix dans une liste). C’est ce qui rend la base facile à trier et à automatiser ensuite.",
    ],
    keys: [
      "Une ligne par élément, une colonne par information.",
      "Un type de contenu par colonne : date, nombre, liste de choix.",
      "On peut relier un tableau à un autre pour éviter de tout retaper.",
      "Dessine tes colonnes sur papier avant de construire.",
    ],
    gesture: {
      intro:
        "Dessine ta première base : à quoi elle sert, quelles colonnes elle contient et quelle liste de choix t’évitera les fautes de frappe.",
      fields: [
        {
          label: "Ce que je veux suivre",
          example: "Mes clients et leurs commandes",
        },
        {
          label: "Colonnes du tableau « Clients »",
          example: "Nom, téléphone, e-mail, ville",
        },
        {
          label: "Colonnes du tableau « Commandes »",
          example: "Client, date, montant, statut",
        },
        {
          label: "Colonne en liste de choix",
          example: "Statut : à faire / en cours / payé",
        },
        {
          label: "Lien entre les deux tableaux",
          example: "Chaque commande est liée à un client",
        },
      ],
      tip: "Commence avec peu de colonnes : tu pourras toujours en ajouter, alors qu’une base trop chargée décourage.",
    },
    check: [
      {
        q: "Dans une base de données, une ligne représente en général :",
        options: [
          "un seul élément (un client, un produit)",
          "toute ton entreprise",
          "une information unique, comme une date",
        ],
        answer: 0,
        why: "Chaque ligne est un élément ; ses informations se trouvent dans les colonnes.",
      },
      {
        q: "Pourquoi relier un tableau « Commandes » à un tableau « Clients » ?",
        options: [
          "Pour rendre la base plus lente",
          "Pour garder les clients secrets",
          "Pour ne pas retaper les infos du client à chaque commande",
        ],
        answer: 2,
        why: "Le lien évite les doublons et les erreurs : les infos du client sont écrites une seule fois.",
      },
      {
        q: "Pourquoi utiliser une liste de choix pour un statut ?",
        options: [
          "Pour que tout le monde écrive la même chose",
          "Pour faire joli",
          "Pour cacher des colonnes",
        ],
        answer: 0,
        why: "Les mêmes mots partout rendent la base facile à trier et à automatiser.",
      },
    ],
  },
  {
    id: "nc-ia",
    idea: [
      "Tu peux brancher une IA (un assistant comme Claude ou ChatGPT) au milieu d’un scénario d’automatisation. Elle sait lire un texte et en faire quelque chose : classer un mail (devis, réclamation, spam), résumer un long message, ou proposer un brouillon de réponse.",
      "Le schéma est simple : un mail arrive, l’IA le lit et décide de sa catégorie, puis l’automatisation le range au bon endroit ou prévient la bonne personne. L’IA fait le tri, l’outil d’automatisation fait le reste.",
      "Garde l’humain dans la boucle. L’IA peut se tromper : ne lui laisse pas envoyer seule une réponse à un client important. Demande-lui plutôt un brouillon, que tu relis et envoies toi-même. Ne lui donne jamais d’informations vraiment sensibles.",
    ],
    keys: [
      "L’IA sait trier, résumer et proposer un brouillon.",
      "L’automatisation range et envoie, l’IA lit et décide.",
      "L’IA peut se tromper : relis avant d’envoyer à un client.",
      "Évite de lui confier des données sensibles.",
    ],
    gesture: {
      intro:
        "Imagine une automatisation avec IA pour tes mails : ce qu’elle doit trier, la consigne que tu lui donnes et ce que tu relis toi-même.",
      fields: [
        {
          label: "Le message qui arrive",
          example: "Mail d’un client via mon adresse pro",
        },
        {
          label: "Ce que l’IA doit faire",
          example: "Classer en : devis, réclamation, autre",
        },
        {
          label: "La consigne donnée à l’IA",
          example:
            "Lis le mail et réponds par un seul mot : devis, réclamation ou autre.",
        },
        {
          label: "Ce que l’automatisation fait ensuite",
          example: "Ranger le mail dans le bon dossier et me prévenir",
        },
        {
          label: "Ce que je relis moi-même",
          example: "Toute réponse envoyée à un client",
        },
      ],
      tip: "Plus ta consigne est précise (réponds par un seul mot parmi trois), plus le résultat est fiable.",
    },
    check: [
      {
        q: "Quel est un bon usage de l’IA dans une automatisation ?",
        options: [
          "Payer les factures sans contrôle",
          "Trier les mails entrants par catégorie",
          "Répondre seule à toutes les réclamations",
        ],
        answer: 1,
        why: "Trier un texte est une tâche où l’IA est utile et le risque d’erreur reste faible.",
      },
      {
        q: "Avant d’envoyer une réponse écrite par l’IA à un client important :",
        options: [
          "tu l’envoies sans la lire",
          "tu la relis et la corriges",
          "tu changes de client",
        ],
        answer: 1,
        why: "L’IA peut se tromper ou mal formuler : l’humain valide ce qui part chez un client.",
      },
      {
        q: "Dans le duo IA + automatisation, qui fait quoi ?",
        options: [
          "L’IA envoie les mails, l’automatisation lit",
          "L’IA lit et décide, l’automatisation range ou envoie",
          "Les deux font exactement la même chose",
        ],
        answer: 1,
        why: "L’IA comprend le texte ; l’outil d’automatisation exécute les actions ensuite.",
      },
    ],
  },
  {
    id: "nc-appli",
    idea: [
      "Créer une appli sans coder, c’est possible avec des outils « no-code » (Glide, Softr, Bubble, Notion…). Tu pars d’une base de données déjà prête, et l’outil en fait des écrans : une liste, une fiche, un formulaire. Pas une ligne de code à écrire.",
      "Une bonne petite appli répond à un seul besoin : une équipe qui suit ses chantiers, des clients qui réservent un créneau, un inventaire consultable sur téléphone. Plus elle fait peu de choses, plus elle est facile à utiliser et à finir.",
      "Commence par la version minimale : deux ou trois écrans, une poignée d’utilisateurs. Fais-la tester, écoute ce qui bloque, puis améliore. Pense aussi aux droits : chacun ne doit voir que ce qui le concerne.",
    ],
    keys: [
      "Une appli no-code s’appuie sur une base de données existante.",
      "Une appli, un seul besoin bien traité.",
      "Commence par 2 ou 3 écrans et quelques testeurs.",
      "Règle qui voit quoi, surtout si des clients l’utilisent.",
    ],
    gesture: {
      intro:
        "Décris ton appli avant de la construire : pour qui, pour quoi faire, quels écrans et quels droits. C’est ton cahier des charges d’une page.",
      fields: [
        {
          label: "Qui va l’utiliser ?",
          example: "Mon équipe de trois personnes, sur téléphone",
        },
        {
          label: "Le besoin unique",
          example: "Suivre l’avancement de chaque chantier",
        },
        {
          label: "Écran 1",
          example: "Liste des chantiers avec leur statut",
        },
        {
          label: "Écran 2",
          example: "Fiche d’un chantier avec photos et notes",
        },
        {
          label: "Écran 3",
          example: "Formulaire pour ajouter une photo",
        },
        {
          label: "Qui voit quoi ?",
          example: "L’équipe voit tout, un client voit son chantier seulement",
        },
      ],
      tip: "Teste avec deux vraies personnes dès que deux écrans fonctionnent : leurs remarques valent plus que tes idées.",
    },
    check: [
      {
        q: "Sur quoi s’appuie en général une appli no-code ?",
        options: [
          "Sur une base de données déjà organisée",
          "Sur un programme écrit à la main",
          "Sur rien du tout",
        ],
        answer: 0,
        why: "L’outil transforme les lignes et colonnes de ta base en écrans utilisables.",
      },
      {
        q: "Combien de besoins une première appli doit-elle traiter ?",
        options: [
          "Tous ceux de l’entreprise",
          "Dix, pour être complète",
          "Un seul, bien traité",
        ],
        answer: 2,
        why: "Une appli simple se termine vite, se teste facilement et est mieux adoptée.",
      },
      {
        q: "Pourquoi régler les droits d’accès ?",
        options: [
          "Pour que chacun ne voie que ce qui le concerne",
          "Pour ralentir l’appli",
          "Pour que personne ne puisse s’en servir",
        ],
        answer: 0,
        why: "Un client ne doit pas voir les données des autres : on limite l’accès à chacun.",
      },
    ],
  },
];
