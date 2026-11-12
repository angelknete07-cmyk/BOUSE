import type { SkillContent } from "./types";

/** Créer du contenu : les compétences sans leçon longue. */
export const skills: SkillContent[] = [
  {
    id: "cont-ecrire",
    idea: [
      "Un texte qui se lit, c’est un texte que ton lecteur comprend du premier coup, sans effort. Pour ça, une règle : une phrase, une idée. Des phrases courtes (quinze à vingt mots), des mots simples, et le plus important en premier.",
      "Avant d’écrire, réponds à une question : que doit retenir mon lecteur ? Écris cette idée en une phrase, puis mets-la au début. Le reste du texte l’explique ou la prouve. Si un passage ne sert pas cette idée, supprime-le.",
      "Relis ensuite à voix haute. Là où tu butes ou tu reprends ton souffle, la phrase est trop longue ou trop lourde : coupe-la. Remplace les mots compliqués par des mots de tous les jours, et préfère les verbes d’action aux phrases abstraites.",
    ],
    keys: [
      "Une phrase, une idée.",
      "Le plus important d’abord.",
      "Des mots simples valent mieux que des mots savants.",
      "Relis à voix haute : là où tu butes, coupe.",
    ],
    gesture: {
      intro:
        "Prends un texte que tu as écrit (un mail, une présentation) et réécris-le plus clair, en suivant les cases ci-dessous.",
      fields: [
        {
          label: "Ce que le lecteur doit retenir",
          example: "Le rendez-vous est déplacé à jeudi 14 h",
        },
        {
          label: "Mon texte d’origine",
          example:
            "Suite à un empêchement de dernière minute, nous nous voyons dans l’obligation de reporter…",
        },
        {
          label: "Phrases à couper en deux",
          example: "La phrase d’ouverture, trop longue",
        },
        {
          label: "Mots compliqués à remplacer",
          example: "« dans l’obligation de reporter » devient « déplacer »",
        },
        {
          label: "Mon texte réécrit",
          example:
            "Le rendez-vous est déplacé à jeudi 14 h. Merci de confirmer.",
        },
      ],
      tip: "Ton texte réécrit doit être plus court que l’original. S’il est plus long, tu as ajouté au lieu de simplifier.",
    },
    check: [
      {
        q: "Où placer l’idée principale d’un texte ?",
        options: [
          "À la fin, pour faire durer le suspense",
          "Au début, pour que le lecteur la voie tout de suite",
          "Au milieu, noyée dans les détails",
        ],
        answer: 1,
        why: "Un lecteur pressé lit le début : l’essentiel doit y être.",
      },
      {
        q: "Quelle phrase se lit le mieux ?",
        options: [
          "Il est porté à votre connaissance que la réunion fait l’objet d’un report.",
          "La réunion est reportée, car plusieurs personnes sont absentes ce jour-là.",
          "En ce qui concerne la réunion, étant donné les circonstances, il a été décidé qu’elle serait décalée.",
        ],
        answer: 1,
        why: "Elle est courte, directe et dit la cause : une idée, des mots simples.",
      },
      {
        q: "Comment repérer une phrase trop lourde ?",
        options: [
          "On la relit en silence très vite",
          "On la relit à voix haute et on bute dessus",
          "On compte les virgules",
        ],
        answer: 1,
        why: "L’oreille repère tout de suite ce que l’œil laisse passer.",
      },
    ],
  },
  {
    id: "cont-photo",
    idea: [
      "Pas besoin d’un appareil de pro : le téléphone suffit. Ce qui fait la différence, c’est la lumière. Place-toi face à une fenêtre ou en extérieur, de jour. Évite le flash, qui écrase les couleurs, et la lumière juste au-dessus de ta tête, qui crée des ombres dures.",
      "Ensuite, le cadrage. Garde ton sujet bien visible : approche-toi plutôt que de zoomer. Utilise la grille de ton appareil photo : place le sujet sur un des points où les lignes se croisent plutôt qu’au centre, l’image sera plus vivante. Garde l’horizon droit.",
      "Enfin, simplifie. Un seul sujet, un fond calme, pas d’objets inutiles derrière. Essuie l’objectif avec un chiffon doux : une lentille sale rend la photo floue. Prends plusieurs photos et garde la meilleure.",
    ],
    keys: [
      "La lumière naturelle fait 80 % d’une bonne photo.",
      "Évite le flash : place-toi face à une fenêtre.",
      "Approche-toi plutôt que de zoomer.",
      "Un seul sujet, un fond simple, un objectif propre.",
    ],
    gesture: {
      intro:
        "Prépare ta prochaine photo avec cette mini-checklist : lumière, cadrage, fond, puis vérification.",
      fields: [
        {
          label: "Mon sujet",
          example: "Un gâteau que je viens de préparer",
        },
        {
          label: "Où je trouve la lumière",
          example: "Près d’une fenêtre, de jour, sans flash",
        },
        {
          label: "Mon cadrage",
          example: "De près, légèrement de côté, grille activée",
        },
        {
          label: "Le fond",
          example: "Une table vide et claire, sans objets derrière",
        },
        {
          label: "Mon objectif est propre ?",
          example: "Oui, essuyé avec un chiffon doux",
        },
        {
          label: "Nombre de photos prises, laquelle je garde",
          example: "6 photos, la 4e est la plus nette",
        },
      ],
      tip: "Une photo ratée parce qu’elle est floue ou sombre ne se rattrape pas toujours. Prends-en plusieurs, c’est gratuit.",
    },
    check: [
      {
        q: "Quelle lumière donne généralement les meilleures photos au téléphone ?",
        options: [
          "Le flash, pour tout éclairer",
          "La lumière du jour, face à une fenêtre",
          "Une lampe juste au-dessus de la tête",
        ],
        answer: 1,
        why: "La lumière naturelle est douce et garde les vraies couleurs.",
      },
      {
        q: "Ton sujet est petit dans l’image. Tu devrais :",
        options: [
          "t’approcher de lui",
          "zoomer au maximum",
          "ajouter des objets autour",
        ],
        answer: 0,
        why: "S’approcher garde la qualité ; le zoom du téléphone la dégrade.",
      },
      {
        q: "Qu’est-ce qui rend une photo plus claire à regarder ?",
        options: [
          "Beaucoup d’objets pour qu’il y ait de la vie",
          "Un fond encombré, qui donne du contexte",
          "Un seul sujet sur un fond calme",
        ],
        answer: 2,
        why: "Un sujet isolé guide l’œil tout de suite vers ce qui compte.",
      },
    ],
  },
  {
    id: "cont-visuel",
    idea: [
      "Un visuel, c’est une image simple qui accompagne un message : une affiche, une publication, une couverture. Avec un outil en ligne comme Canva, tu pars d’un modèle déjà dessiné et tu changes le texte, la photo et les couleurs. Pas besoin de savoir dessiner.",
      "Un visuel réussi respecte trois règles. Une seule idée : un message principal, lisible en deux secondes. Peu de couleurs : deux ou trois, toujours les mêmes. Une ou deux polices maximum : une pour les titres, une pour le texte. L’espace vide n’est pas du gaspillage, il aide à lire.",
      "Garde toujours le même style (couleurs, police, logo) pour que tes visuels se reconnaissent d’un coup d’œil. Vérifie que le texte reste lisible sur téléphone et que la taille correspond bien à l’endroit où tu publies.",
    ],
    keys: [
      "Une image, un message.",
      "Deux ou trois couleurs et une ou deux polices.",
      "Laisse de l’espace vide : il aide à lire.",
      "Garde le même style pour qu’on te reconnaisse.",
    ],
    gesture: {
      intro:
        "Prépare ton modèle de visuel une fois pour toutes : ses couleurs, ses polices et sa structure. Tu le dupliqueras à chaque publication.",
      fields: [
        {
          label: "Le message du visuel",
          example: "Atelier cuisine ce samedi, 10 places",
        },
        {
          label: "Mes 2 ou 3 couleurs",
          example: "Crème, vert foncé, touche de orange",
        },
        {
          label: "Ma police de titre / de texte",
          example: "Une police épaisse pour le titre, une simple pour le reste",
        },
        {
          label: "La photo ou l’élément principal",
          example: "Ma photo de plat, bien centrée",
        },
        {
          label: "Où se placent le titre et l’information pratique",
          example: "Titre en haut, date et lieu en bas",
        },
        {
          label: "Le format choisi",
          example: "Carré pour une publication, vertical pour une story",
        },
      ],
      tip: "Quand ton modèle te plaît, enregistre-le : à l’avenir, tu changes juste le texte et la photo.",
    },
    check: [
      {
        q: "Combien d’idées principales dans un bon visuel ?",
        options: ["Une seule", "Au moins cinq", "Autant que possible"],
        answer: 0,
        why: "Un visuel doit se comprendre en deux secondes : un message, pas plusieurs.",
      },
      {
        q: "Pourquoi garder les mêmes couleurs et polices ?",
        options: [
          "Pour que tes visuels se reconnaissent",
          "Parce que l’outil l’impose",
          "Pour économiser de la place",
        ],
        answer: 0,
        why: "La cohérence crée une identité : on te reconnaît sans même lire ton nom.",
      },
      {
        q: "L’espace vide dans un visuel :",
        options: [
          "est un défaut à combler",
          "montre qu’on a manqué d’idées",
          "aide à lire et met en valeur l’essentiel",
        ],
        answer: 2,
        why: "L’air autour du texte et des images rend le visuel plus clair.",
      },
    ],
  },
  {
    id: "cont-video",
    idea: [
      "Sur les réseaux, on décide en quelques secondes de regarder ou de passer. Les trois premières secondes de ta vidéo sont donc les plus importantes : commence directement par l’action, une question ou le résultat. Pas de « Bonjour, aujourd’hui je vais vous parler de… ».",
      "Une vidéo courte tient en trois temps. L’accroche (3 secondes) : ce qui donne envie de rester. Le contenu (20 secondes) : une seule idée, montrée plutôt qu’expliquée. La fin (5 secondes) : ce que tu veux que la personne fasse ensuite (s’abonner, visiter, répondre).",
      "Filme en vertical avec le téléphone, près d’une source de lumière, et vérifie que le son est clair : une voix mal audible fait fuir plus vite qu’une image moyenne. Ajoute des sous-titres, car beaucoup de gens regardent sans le son.",
    ],
    keys: [
      "Les 3 premières secondes décident si on reste.",
      "Une vidéo courte = accroche, contenu, fin.",
      "Une seule idée par vidéo, montrée plutôt qu’expliquée.",
      "Soigne le son et ajoute des sous-titres.",
    ],
    gesture: {
      intro:
        "Écris le plan de ta vidéo de 30 secondes avant de filmer. Trois temps, une idée, et ce que tu veux qu’on fasse après.",
      fields: [
        {
          label: "L’idée unique de la vidéo",
          example: "Comment réparer un robinet qui goutte",
        },
        {
          label: "Accroche (3 premières secondes)",
          example:
            "Je montre le robinet qui goutte : « Ça te coûte 30 € par an ! »",
        },
        {
          label: "Contenu (environ 20 secondes)",
          example: "3 gestes montrés à la caméra, un plan par geste",
        },
        {
          label: "Fin (environ 5 secondes)",
          example: "« Abonne-toi pour d’autres astuces »",
        },
        {
          label: "Lieu et lumière",
          example: "Cuisine, près de la fenêtre, de jour",
        },
        {
          label: "Sous-titres prévus ?",
          example: "Oui, ajoutés dans l’appli de montage",
        },
      ],
      tip: "Filme toujours en vertical pour les réseaux, et teste le son de ton téléphone avant de te lancer.",
    },
    check: [
      {
        q: "Comment commencer une vidéo courte ?",
        options: [
          "Par une longue présentation de toi",
          "Directement par une action, une question ou le résultat",
          "Par un écran noir de 5 secondes",
        ],
        answer: 1,
        why: "L’accroche doit capter l’attention tout de suite, avant que la personne ne passe.",
      },
      {
        q: "Pourquoi mettre des sous-titres ?",
        options: [
          "Parce que c’est obligatoire",
          "Parce que beaucoup de gens regardent sans le son",
          "Pour allonger la vidéo",
        ],
        answer: 1,
        why: "Dans les transports ou au travail, on regarde souvent sans activer le son.",
      },
      {
        q: "Combien d’idées par vidéo courte ?",
        options: ["Dix", "Trois", "Une seule"],
        answer: 2,
        why: "Une seule idée se retient ; plusieurs idées se mélangent et se perdent.",
      },
    ],
  },
  {
    id: "cont-montage",
    idea: [
      "Monter une vidéo, c’est choisir ce qu’on garde et ce qu’on enlève. Avec une appli simple (CapCut, l’appli de ton téléphone, ou un logiciel gratuit), tu assembles tes séquences sur une ligne de temps : tu coupes les silences, les hésitations et les passages qui n’apportent rien.",
      "Le rythme est tout. Une coupe toutes les deux à cinq secondes garde l’attention. Ajoute des sous-titres lisibles (gros, contrastés, dans la zone visible de l’écran) : ils retiennent ceux qui regardent sans le son. Enfin, un fond sonore discret met de l'ambiance, sans couvrir la voix.",
      "Attention aux droits : n’utilise que des musiques, images et vidéos dont tu as le droit de te servir (celles fournies par l’appli, ou libres de droits). Exporte dans le format vertical, regarde le résultat en entier sur ton téléphone, puis publie.",
    ],
    keys: [
      "Monter, c’est surtout couper ce qui ne sert pas.",
      "Garde un rythme : une coupe toutes les quelques secondes.",
      "Sous-titres gros et lisibles ; musique plus basse que la voix.",
      "N’utilise que des sons et images dont tu as le droit.",
    ],
    gesture: {
      intro:
        "Prépare ton montage sur papier : ce que tu coupes, tes sous-titres, ta musique et ta vérification finale.",
      fields: [
        {
          label: "Mes séquences filmées",
          example: "Intro, 3 gestes, conclusion",
        },
        {
          label: "Ce que je coupe",
          example: "Les silences du début et les hésitations",
        },
        {
          label: "Rythme prévu",
          example: "Une coupe toutes les 3 secondes environ",
        },
        {
          label: "Sous-titres",
          example: "Gros, blancs avec contour, placés en bas au centre",
        },
        {
          label: "Musique et son",
          example: "Musique libre de droits de l’appli, volume bas",
        },
        {
          label: "Vérification avant de publier",
          example: "Je regarde tout sur mon téléphone, avec et sans le son",
        },
      ],
      tip: "Une vidéo de 30 secondes bien montée vaut mieux qu’une minute qui traîne : si un passage t’ennuie, coupe-le.",
    },
    check: [
      {
        q: "Quel est le rôle principal du montage ?",
        options: [
          "Ajouter le plus d’effets possible",
          "Rallonger la vidéo",
          "Garder l’essentiel et couper ce qui n’apporte rien",
        ],
        answer: 2,
        why: "Un bon montage rend la vidéo plus claire et plus rythmée en enlevant le superflu.",
      },
      {
        q: "Quelle musique peux-tu utiliser dans ta vidéo ?",
        options: [
          "Celle de ton chanteur préféré, du moment qu’elle te plaît",
          "Une musique libre de droits ou fournie par l’appli",
          "N’importe laquelle trouvée en ligne",
        ],
        answer: 1,
        why: "Une musique protégée peut entraîner le retrait de ta vidéo : choisis-en une dont tu as le droit.",
      },
      {
        q: "Le volume de la musique de fond doit être :",
        options: [
          "plus bas que la voix",
          "au maximum",
          "supprimé dès qu’on parle",
        ],
        answer: 0,
        why: "La musique accompagne, elle ne doit pas empêcher de comprendre ce qui est dit.",
      },
    ],
  },
  {
    id: "cont-ligne",
    idea: [
      "Une ligne éditoriale, c’est ta réponse à trois questions : pour qui je publie, de quoi je parle, et sur quel ton. Sans elle, on publie au hasard et personne ne sait pourquoi te suivre. Avec elle, chaque publication a une raison d’être.",
      "En pratique, choisis deux ou trois thèmes (tes « piliers »), par exemple : conseils, coulisses, résultats de clients. Alterne-les. Chaque publication doit aider, apprendre, divertir ou inspirer ta cible, jamais seulement parler de toi.",
      "Ensuite, planifie. Un calendrier éditorial fixe quoi publier, quand et où. Il évite le stress du « je poste quoi aujourd’hui ? » et te rend régulier. Mieux vaut un rythme réaliste que tu tiens (deux fois par semaine) qu’un rythme ambitieux que tu abandonnes.",
    ],
    keys: [
      "Ligne éditoriale = pour qui, de quoi, sur quel ton.",
      "Choisis deux ou trois thèmes et alterne-les.",
      "Chaque publication doit servir ta cible, pas seulement te montrer.",
      "Un rythme réaliste tenu vaut mieux qu’un rythme ambitieux abandonné.",
    ],
    gesture: {
      intro:
        "Construis ton calendrier éditorial pour deux semaines : ta cible, tes thèmes et les publications prévues, jour par jour.",
      fields: [
        {
          label: "Pour qui je publie",
          example: "Des parents qui veulent cuisiner sain, vite",
        },
        {
          label: "Mes 3 thèmes",
          example: "Recettes rapides, astuces, coulisses",
        },
        {
          label: "Mon ton",
          example: "Chaleureux, simple, un peu d’humour",
        },
        {
          label: "Mon rythme",
          example: "2 publications par semaine",
        },
        {
          label: "Mardi",
          example: "Recette rapide en vidéo courte",
        },
        {
          label: "Vendredi",
          example: "Astuce en image, avec un conseil",
        },
      ],
      tip: "Prépare plusieurs publications d’avance un jour fixe de la semaine : tu publies sans stress.",
    },
    check: [
      {
        q: "À quoi sert une ligne éditoriale ?",
        options: [
          "À publier le plus possible",
          "À copier ce que font les autres",
          "À savoir pour qui, de quoi et sur quel ton tu publies",
        ],
        answer: 2,
        why: "Elle donne une direction claire à chaque publication.",
      },
      {
        q: "Quel rythme de publication choisir ?",
        options: [
          "Celui que tu peux réellement tenir dans la durée",
          "Tous les jours, même sans idée",
          "Seulement quand tu as de l’inspiration",
        ],
        answer: 0,
        why: "La régularité compte plus que la quantité : un rythme tenu construit l’audience.",
      },
      {
        q: "Un bon contenu pour ta cible :",
        options: [
          "parle surtout de toi",
          "répète toujours la même chose",
          "l’aide, lui apprend quelque chose ou l’inspire",
        ],
        answer: 2,
        why: "On suit quelqu’un qui apporte de la valeur, pas seulement de la publicité.",
      },
    ],
  },
  {
    id: "cont-audience",
    idea: [
      "Une audience grandit par la régularité, pas par un coup d’éclat. Publier à un rythme fixe apprend aux gens à t’attendre et aide les réseaux à montrer tes contenus. Mieux vaut peu, mais souvent, que beaucoup un jour puis plus rien pendant un mois.",
      "Varie les formats (vidéo courte, image, texte, direct) pour voir ce que ton public aime. Puis regarde tes statistiques : quelles publications ont été vues, enregistrées, partagées, commentées ? Les partages et enregistrements comptent plus que les « j’aime ». Refais ce qui marche, abandonne ce qui ne marche pas.",
      "Enfin, parle avec ton public : réponds aux commentaires, pose des questions, remercie. Une audience engagée vaut mieux qu’une grande audience silencieuse. Sois patient : les premiers mois sont lents pour tout le monde. Ne cours pas après les abonnés achetés, ils n’apportent rien.",
    ],
    keys: [
      "La régularité compte plus qu’un coup d’éclat.",
      "Teste plusieurs formats, puis regarde les statistiques.",
      "Partages et enregistrements comptent plus que les « j’aime ».",
      "Réponds à ton public : l’engagement vaut mieux que le nombre.",
    ],
    gesture: {
      intro:
        "Fais le bilan du mois de ta publication la plus réussie et de la moins réussie. Tu en tires une règle pour le mois suivant.",
      fields: [
        {
          label: "Ma publication la plus réussie",
          example: "La vidéo « 3 astuces anti-gaspillage »",
        },
        {
          label: "Ses chiffres (vues, partages, enregistrements)",
          example: "4 200 vues, 85 partages, 120 enregistrements",
        },
        {
          label: "Pourquoi elle a marché, à mon avis",
          example: "Une astuce utile dès les 3 premières secondes",
        },
        {
          label: "Ma publication la moins réussie",
          example: "La photo de mon bureau",
        },
        {
          label: "Ce que j’en retiens",
          example: "Mon public préfère les conseils aux coulisses",
        },
        {
          label: "Ma règle pour le mois prochain",
          example: "Deux conseils en vidéo courte par semaine",
        },
      ],
      tip: "Regarde tes statistiques à jour fixe (par exemple le dimanche) : tu verras les tendances sans y passer ta vie.",
    },
    check: [
      {
        q: "Qu’est-ce qui fait grandir une audience durablement ?",
        options: [
          "Un seul contenu viral",
          "Une publication régulière qui apporte de la valeur",
          "Acheter des abonnés",
        ],
        answer: 1,
        why: "La constance crée l’habitude, et la valeur donne envie de rester.",
      },
      {
        q: "Quels chiffres regarder en priorité ?",
        options: [
          "Uniquement les « j’aime »",
          "Les partages, les enregistrements et les commentaires",
          "Le nombre de publications faites",
        ],
        answer: 1,
        why: "Ils montrent que le contenu est utile ou marquant, pas seulement vu en passant.",
      },
      {
        q: "Une publication a très bien marché. Tu devrais :",
        options: [
          "ne plus jamais publier",
          "en comprendre la raison et refaire dans le même esprit",
          "supprimer les autres",
        ],
        answer: 1,
        why: "Les statistiques servent à répéter ce qui plaît à ton public.",
      },
    ],
  },
];
