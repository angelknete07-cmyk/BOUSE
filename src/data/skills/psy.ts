import type { SkillContent } from "./types";

/** Psychologie et argent : les compétences sans leçon longue. */
export const skills: SkillContent[] = [
  {
    id: "psy-biais",
    idea: [
      "Un biais, c’est un raccourci de ton cerveau qui te fait parfois te tromper. On en a tous. Le biais de confirmation, par exemple : on retient surtout ce qui confirme ce qu’on pense déjà, et on oublie le reste.",
      "Autres pièges fréquents : l’ancrage (le premier prix vu influence tout ce qui suit), l’aversion à la perte (perdre 100 € fait plus mal que gagner 100 € ne fait plaisir) et l’effet de groupe (acheter parce que tout le monde achète).",
      "On ne supprime pas les biais, mais on peut les repérer. Avant une décision d’argent, pose-toi trois questions : qu’est-ce qui me ferait changer d’avis ? Ai-je regardé les arguments contraires ? Que ferait quelqu’un de calme à ma place ?",
    ],
    keys: [
      "Un biais est un raccourci qui nous trompe parfois.",
      "Confirmation, ancrage, aversion à la perte, effet de groupe : les quatre à connaître.",
      "On ne les supprime pas, on apprend à les repérer.",
      "Avant de décider, cherche ce qui contredit ton idée.",
    ],
    gesture: {
      intro:
        "Repère trois biais qui t’arrivent le plus souvent. Pour chacun, note une situation vécue et une parade.",
      fields: [
        {
          label: "Biais n° 1",
          example:
            "ancrage : j’ai trouvé un article « soldé » à 80 € au lieu de 100 €",
        },
        {
          label: "Situation où il m’est arrivé",
          example: "achat d’un casque pendant les soldes",
        },
        {
          label: "Biais n° 2",
          example: "effet de groupe : tout le monde en parle",
        },
        {
          label: "Situation où il m’est arrivé",
          example: "j’ai voulu investir parce que mes amis le faisaient",
        },
        {
          label: "Biais n° 3",
          example: "aversion à la perte : garder une action qui baisse",
        },
        {
          label: "Ma parade pour chacun",
          example:
            "attendre 48 h, chercher un avis contraire, fixer une règle écrite",
        },
      ],
      tip: "Un biais repéré perd déjà la moitié de son pouvoir : écris-le dès que tu t’en rends compte.",
    },
    check: [
      {
        q: "Qu’est-ce que le biais de confirmation ?",
        options: [
          "Chercher surtout ce qui confirme ce qu’on pense déjà",
          "Confirmer un virement",
          "Vérifier ses comptes",
        ],
        answer: 0,
        why: "On retient les informations qui nous donnent raison et on néglige les autres.",
      },
      {
        q: "Que fait l’ancrage ?",
        options: [
          "Le premier prix vu influence notre jugement des suivants",
          "Il nous protège des pertes",
          "Il fait baisser les prix",
        ],
        answer: 0,
        why: "Un prix « barré » plus élevé nous fait paraître le prix final plus avantageux qu’il ne l’est.",
      },
      {
        q: "Comment se protéger d’un biais ?",
        options: [
          "En le repérant et en cherchant un avis contraire",
          "En l’ignorant",
          "En décidant le plus vite possible",
        ],
        answer: 0,
        why: "Repérer le biais permet de ralentir et de comparer avant de décider.",
      },
    ],
  },
  {
    id: "psy-achats",
    idea: [
      "Les vendeurs et les sites connaissent bien notre cerveau. Ils créent l’urgence (« plus que 2 articles ! »), la rareté (« offre limitée »), l’ancrage (un prix barré) et la preuve sociale (« 1 000 personnes l’ont acheté »). Ces signaux donnent envie d’acheter vite, sans réfléchir.",
      "Une bonne défense : la règle des 48 heures. Quand tu veux acheter quelque chose qui n’est pas indispensable, tu attends deux jours. Si l’envie est toujours là après, tu peux acheter. Si elle a disparu, tu viens d’économiser de l’argent.",
      "Aide-toi aussi de petites barrières : supprimer la carte enregistrée sur un site, se désabonner des newsletters promotionnelles, utiliser une liste de courses. Plus l’achat est facile, plus il est tentant.",
    ],
    keys: [
      "Urgence, rareté, prix barré et preuve sociale poussent à acheter vite.",
      "La règle des 48 heures filtre les envies passagères.",
      "Supprime la carte enregistrée et les newsletters de promotion.",
      "Une liste avant d’entrer dans un magasin protège ton budget.",
    ],
    gesture: {
      intro:
        "Mets en place ta règle des 48 heures : une liste d’attente pour tes envies, avec la date à laquelle tu décides.",
      fields: [
        { label: "L’objet que je veux", example: "casque sans fil" },
        { label: "Prix", example: "100 €" },
        { label: "Date où j’en ai eu envie", example: "lundi" },
        { label: "Date de décision (48 h plus tard)", example: "mercredi" },
        {
          label: "Raison réelle de l’envie",
          example: "mon casque actuel marche encore, j’ai vu une pub",
        },
        {
          label: "Décision finale",
          example: "j’achète / j’abandonne / j’attends encore",
        },
      ],
      tip: "Tiens cette liste sur ton téléphone : tu verras vite combien d’envies disparaissent toutes seules.",
    },
    check: [
      {
        q: "« Plus que 2 articles en stock ! » sert surtout à :",
        options: [
          "T’informer honnêtement",
          "Créer une impression d’urgence qui pousse à acheter",
          "Baisser le prix",
        ],
        answer: 1,
        why: "L’urgence pousse à décider vite, sans comparer ni réfléchir.",
      },
      {
        q: "La règle des 48 heures consiste à :",
        options: [
          "Acheter très vite",
          "Attendre deux jours avant un achat non indispensable",
          "Demander un remboursement",
        ],
        answer: 1,
        why: "Le délai laisse retomber l’envie et permet de décider calmement.",
      },
      {
        q: "Quel geste rend l’achat impulsif plus difficile ?",
        options: [
          "Enregistrer sa carte sur tous les sites",
          "Supprimer sa carte enregistrée",
          "S’abonner à toutes les promotions",
        ],
        answer: 1,
        why: "Moins un achat est facile, plus on y réfléchit.",
      },
    ],
  },
  {
    id: "psy-decider",
    idea: [
      "Pour une grosse décision (déménager, changer de travail, acheter un bien), le cerveau a tendance à s’emballer ou à fuir. Une méthode simple t’aide à rester calme : écrire les options, les critères qui comptent, et noter chaque option.",
      "Choisis trois à cinq critères importants pour toi (coût, sécurité, plaisir, temps…) et donne à chacun un poids selon son importance. Note chaque option de 1 à 5 sur chaque critère, puis fais le total. Ce n’est pas un juge infaillible, mais cela montre ce qui compte vraiment.",
      "Ajoute deux questions : « Si ça rate dans un an, quelle sera la cause la plus probable ? » et « Ma décision reste-t-elle bonne si les choses se passent moins bien que prévu ? ». Et dors dessus : une nuit évite bien des regrets.",
    ],
    keys: [
      "Écris les options, les critères et une note pour chacune.",
      "Pondère les critères selon leur importance.",
      "Imagine l’échec : quelle en serait la cause probable ?",
      "Dors dessus avant une grosse décision.",
    ],
    gesture: {
      intro:
        "Remplis cette grille pour une décision réelle. Note de 1 à 5, multiplie par le poids, puis additionne.",
      fields: [
        {
          label: "La décision à prendre",
          example: "accepter ou non un nouveau poste dans une autre ville",
        },
        {
          label: "Mes options",
          example: "A : accepter / B : refuser / C : négocier",
        },
        {
          label: "Mes critères et leur poids (1 à 3)",
          example: "salaire (3), temps de trajet (2), ambiance (2)",
        },
        {
          label: "Notes de chaque option (1 à 5)",
          example: "A : 4, 2, 3 / B : 2, 4, 3",
        },
        { label: "Totaux", example: "A : 4×3 + 2×2 + 3×2 = 22" },
        {
          label: "Si ça rate dans un an, pourquoi ?",
          example: "le trajet serait trop long",
        },
      ],
      tip: "Si le résultat te surprend, c’est utile : demande-toi quel critère manque à ta grille.",
    },
    check: [
      {
        q: "À quoi servent les poids dans la grille ?",
        options: [
          "À montrer l’importance de chaque critère pour toi",
          "À rendre le calcul plus long",
          "À trouver la bonne réponse à coup sûr",
        ],
        answer: 0,
        why: "Un critère plus important doit peser plus dans le total.",
      },
      {
        q: "Pourquoi imaginer que la décision échoue ?",
        options: [
          "Pour repérer à l’avance le risque principal",
          "Pour se décourager",
          "Pour ne rien décider",
        ],
        answer: 0,
        why: "Imaginer l’échec fait apparaître les risques qu’on ne voit pas quand on est enthousiaste.",
      },
      {
        q: "Que faire avant une grosse décision ?",
        options: [
          "Dormir dessus",
          "Décider sous le coup de l’émotion",
          "Demander à un inconnu de choisir",
        ],
        answer: 0,
        why: "Le temps fait retomber l’émotion et clarifie les idées.",
      },
    ],
  },
  {
    id: "psy-peur",
    idea: [
      "Quand les marchés baissent, la peur pousse à vendre pour « arrêter de perdre ». C’est le piège classique : une baisse n’est une perte réelle que si tu vends. Beaucoup de gens vendent au plus bas, puis rachètent plus cher, et perdent vraiment de l’argent.",
      "Les émotions sont normales : l’idée est de ne pas décider à chaud. Le moyen le plus efficace est d’écrire un plan avant que la baisse n’arrive. Dans ce plan, tu notes ce que tu feras (ou pas) si ton placement baisse de 10 %, de 20 %, de 30 %.",
      "Le plan dépend de ta situation : de la durée pendant laquelle tu peux laisser l’argent, et de ce que tu peux supporter. Si une baisse t’empêche de dormir, c’est un signe : le risque est peut-être trop élevé pour toi. L’argent dont tu auras besoin bientôt n’a rien à faire en Bourse.",
    ],
    keys: [
      "Une baisse n’est une perte réelle que si tu vends.",
      "Écris ton plan avant la baisse, pas pendant.",
      "Si une baisse t’empêche de dormir, le risque est peut-être trop grand pour toi.",
      "L’argent dont tu as besoin bientôt n’a rien à faire en Bourse.",
    ],
    gesture: {
      intro:
        "Écris ton plan anti-panique maintenant, à tête reposée. Tu le relis le jour où ça baisse, avant de toucher à quoi que ce soit.",
      fields: [
        { label: "Mon objectif et mon horizon", example: "retraite, 25 ans" },
        {
          label: "Ce que je ressens si mon placement baisse de 20 %",
          example: "inquiet, mais je peux attendre",
        },
        {
          label: "Ce que je fais si ça baisse de 10 %",
          example: "rien, je relis ce plan",
        },
        {
          label: "Ce que je fais si ça baisse de 30 %",
          example: "j’attends 48 h, puis je regarde mon objectif",
        },
        {
          label: "Personne que j’appelle avant de vendre",
          example: "un proche de confiance",
        },
        {
          label: "Argent dont je peux avoir besoin vite, hors Bourse",
          example: "épargne de précaution sur livret",
        },
      ],
      tip: "Signe et date ton plan. Le jour de la panique, tu seras content de t’être écrit à toi-même.",
    },
    check: [
      {
        q: "Ton placement a baissé de 20 %. Tu n’as pas vendu. Ta perte est :",
        options: [
          "Définitive",
          "Une baisse sur le papier, qui peut remonter ou non",
          "Remboursée par la banque",
        ],
        answer: 1,
        why: "Tant que tu ne vends pas, la baisse n’est pas encore réalisée ; mais elle n’est pas non plus garantie de disparaître.",
      },
      {
        q: "Quand est-il le plus judicieux d’écrire son plan anti-panique ?",
        options: ["Pendant la panique", "Avant, à tête reposée", "Jamais"],
        answer: 1,
        why: "Un plan écrit à froid protège des décisions prises sous le coup de l’émotion.",
      },
      {
        q: "De l’argent dont tu auras besoin dans quelques mois :",
        options: [
          "Doit rester sur un placement sûr et disponible",
          "Doit être placé en Bourse pour gagner vite",
          "N’a pas d’importance",
        ],
        answer: 0,
        why: "Un besoin proche ne laisse pas le temps d’attendre une éventuelle remontée.",
      },
    ],
  },
  {
    id: "psy-habitudes",
    idea: [
      "Une habitude d’argent (épargner chaque mois, noter ses dépenses) tient mieux quand elle est petite, précise et liée à un moment de ta journée. « Épargner plus » est vague. « Le jour de la paie, je vire 20 € vers mon livret » est un geste clair.",
      "Pour bien l’installer, trouve un déclencheur (un moment fixe), réduis l’effort au minimum et récompense-toi d’une petite façon (cocher une case, par exemple). Un virement automatique supprime l’effort : tu n’as plus besoin de volonté.",
      "Si tu rates un jour, ce n’est pas grave : l’important est de reprendre le lendemain, sans te juger. Teste sur trente jours : assez long pour sentir la différence, assez court pour rester motivé. Puis augmente peu à peu.",
    ],
    keys: [
      "Une bonne habitude est petite, précise et liée à un moment fixe.",
      "Un déclencheur clair vaut mieux que de la volonté.",
      "Automatiser supprime l’effort.",
      "Rater un jour ne compte pas : reprends le lendemain.",
    ],
    gesture: {
      intro:
        "Choisis une seule habitude d’argent à installer et prépare ton plan sur trente jours.",
      fields: [
        {
          label: "L’habitude choisie",
          example: "noter mes dépenses chaque soir",
        },
        { label: "Le déclencheur (moment fixe)", example: "après le dîner" },
        {
          label: "La version la plus petite",
          example: "2 minutes sur mon téléphone",
        },
        { label: "Ce qui peut m’en empêcher", example: "fatigue, oubli" },
        { label: "Ma parade", example: "alarme à 21 h" },
        {
          label: "Ma récompense",
          example: "cocher le jour dans un calendrier",
        },
        {
          label: "Si je rate un jour",
          example: "je reprends le lendemain, sans m’en vouloir",
        },
      ],
      tip: "Une habitude à la fois : trois changements en même temps tiennent rarement.",
    },
    check: [
      {
        q: "Quelle habitude a le plus de chances de tenir ?",
        options: [
          "« Épargner plus »",
          "« Le jour de la paie, je vire 20 € vers mon livret »",
          "« Faire attention à mon argent »",
        ],
        answer: 1,
        why: "Un geste précis, avec un moment fixe, est facile à appliquer.",
      },
      {
        q: "Un virement automatique sert à :",
        options: [
          "Supprimer l’effort et la décision chaque mois",
          "Dépenser plus",
          "Cacher l’argent",
        ],
        answer: 0,
        why: "Ce qui est automatique ne dépend plus de ta volonté du moment.",
      },
      {
        q: "Tu rates un jour. Que fais-tu ?",
        options: [
          "J’abandonne tout",
          "Je reprends le lendemain",
          "Je double l’effort pendant une semaine",
        ],
        answer: 1,
        why: "Un jour raté n’annule pas l’habitude : c’est la régularité sur la durée qui compte.",
      },
    ],
  },
  {
    id: "psy-couple",
    idea: [
      "L’argent est l’un des sujets qui fait le plus se disputer les couples, souvent parce qu’on n’en parle pas assez, ou trop tard. Chacun a son histoire avec l’argent : l’un aime épargner, l’autre aime en profiter. Aucun n’a tort.",
      "Il existe plusieurs façons d’organiser les comptes : tout en commun, tout séparé, ou un mélange avec un compte joint pour les dépenses communes et un compte personnel pour chacun. Si les revenus sont différents, certains couples répartissent les dépenses au prorata des revenus, plutôt que moitié-moitié.",
      "Fixe un rendez-vous régulier, par exemple une fois par mois, de trente minutes, pour regarder les comptes ensemble, sans reproche. Parle de projets plutôt que de fautes. Et garde à chacun une petite somme à dépenser librement, sans avoir à se justifier.",
    ],
    keys: [
      "Parler d’argent tôt évite beaucoup de disputes.",
      "Compte joint pour le commun, compte personnel pour chacun : une formule courante.",
      "On peut répartir les dépenses au prorata des revenus.",
      "Un rendez-vous mensuel sans reproche garde le dialogue ouvert.",
    ],
    gesture: {
      intro:
        "Construisez votre budget à deux, ensemble, en remplissant cette fiche. Les chiffres sont des exemples ronds.",
      fields: [
        {
          label: "Revenus nets de chacun",
          example: "A : 2 000 € / B : 1 000 €",
        },
        {
          label: "Dépenses communes mensuelles",
          example: "loyer, courses, énergie : 1 500 €",
        },
        {
          label: "Part de chacun",
          example: "au prorata des revenus : A 1 000 € / B 500 €",
        },
        {
          label: "Compte joint ou comptes séparés",
          example: "compte joint + un compte perso chacun",
        },
        {
          label: "Argent libre pour chacun",
          example: "100 € par mois, sans justification",
        },
        {
          label: "Projet commun à financer",
          example: "vacances : 100 € par mois",
        },
        {
          label: "Date du rendez-vous mensuel",
          example: "premier dimanche du mois, 30 minutes",
        },
      ],
      tip: "Commencez par un projet qui vous donne envie : il est plus facile de parler budget quand on parle d’avenir.",
    },
    check: [
      {
        q: "Une façon courante d’organiser les comptes d’un couple :",
        options: [
          "Un compte joint pour le commun, un compte personnel chacun",
          "Un seul compte tenu en secret par l’un",
          "Aucun compte",
        ],
        answer: 0,
        why: "Cette formule partage les dépenses communes tout en laissant de l’autonomie à chacun.",
      },
      {
        q: "Si l’un gagne le double de l’autre, une répartition juste peut être :",
        options: [
          "Toujours moitié-moitié",
          "Au prorata des revenus, si les deux sont d’accord",
          "L’un paie tout",
        ],
        answer: 1,
        why: "Le prorata tient compte de la capacité de chacun, à condition que les deux acceptent la règle.",
      },
      {
        q: "À quoi sert un rendez-vous mensuel sur l’argent ?",
        options: [
          "À chercher un coupable",
          "À regarder les comptes ensemble sans reproche",
          "À éviter d’en parler le reste du mois",
        ],
        answer: 1,
        why: "Un rendez-vous régulier et calme évite que les tensions s’accumulent.",
      },
    ],
  },
];
