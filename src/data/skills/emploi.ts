import type { SkillContent } from "./types";

/** Emploi : les compétences sans leçon longue. */
export const skills: SkillContent[] = [
  {
    id: "emp-cv",
    idea: [
      "Un recruteur passe quelques secondes sur ton CV avant de décider de continuer ou non. Il doit donc comprendre très vite qui tu es, ce que tu sais faire et ce que tu cherches. Une page suffit presque toujours quand on débute.",
      "Mets en haut un titre qui dit ton objectif (« Électricien en rénovation, recherche CDI »), puis tes expériences de la plus récente à la plus ancienne. Pour chacune, écris ce que tu as fait et le résultat : « Pose de 40 prises par semaine, zéro retour client » dit plus que « Travaux d’électricité ».",
      "Adapte-le à chaque offre : reprends les mots de l’annonce quand ils sont vrais. N’invente jamais rien : un diplôme ou une durée inventés se vérifient et peuvent te faire perdre le poste. Relis-toi, ou fais-toi relire : une faute d’orthographe fait mauvaise impression.",
    ],
    keys: [
      "Une page, lisible en quelques secondes.",
      "Un titre clair en haut : ce que tu fais et ce que tu cherches.",
      "Expériences de la plus récente à la plus ancienne, avec des résultats.",
      "Adapte-le à chaque offre et ne mens jamais.",
    ],
    gesture: {
      intro:
        "Remplis ce modèle pour construire ton CV. Ensuite, tu le mets en page simplement : une colonne, peu de couleurs, une police lisible.",
      fields: [
        {
          label: "Titre du CV",
          example: "Aide-soignante, recherche CDI en EHPAD",
        },
        {
          label: "Coordonnées",
          example: "Prénom Nom, téléphone, mail sérieux, ville",
        },
        {
          label: "Expérience la plus récente",
          example:
            "Auxiliaire de vie, 2024-2026 : toilette et repas de 8 personnes par jour",
        },
        {
          label: "Expérience précédente",
          example: "Employée de rayon, 2022-2024 : mise en place et caisse",
        },
        {
          label: "Formations et diplômes",
          example: "Diplôme d’aide-soignante, 2024",
        },
        {
          label: "Compétences utiles pour ce poste",
          example: "Écoute, gestes de transfert, informatique de base",
        },
        {
          label: "Langues et centres d’intérêt (court)",
          example: "Anglais courant, bénévole aux Restos du cœur",
        },
      ],
      tip: "Enregistre-le en PDF avec un nom simple, par exemple « CV-Prenom-Nom.pdf » : la mise en page ne bougera pas chez le recruteur.",
    },
    check: [
      {
        q: "Quelle ligne d’expérience est la plus utile à un recruteur ?",
        options: [
          "« Travaux divers. »",
          "« Pose de 40 prises par semaine, aucun retour client. »",
          "« Bonne ambiance dans l’équipe. »",
        ],
        answer: 1,
        why: "Elle décrit ce que tu as fait avec un résultat concret, vérifiable.",
      },
      {
        q: "Dans quel ordre présenter ses expériences ?",
        options: [
          "De la plus ancienne à la plus récente",
          "Dans l’ordre qui te flatte le plus",
          "De la plus récente à la plus ancienne",
        ],
        answer: 2,
        why: "Le plus récent est ce qui intéresse le plus le recruteur : il le voit en premier.",
      },
      {
        q: "Tu n’as pas tout à fait la durée d’expérience demandée. Que fais-tu ?",
        options: [
          "Tu allonges les dates",
          "Tu candidates quand même en restant honnête sur tes dates",
          "Tu ne candidates jamais",
        ],
        answer: 1,
        why: "Une erreur de bonne foi se discute, un mensonge se vérifie et peut mettre fin à la collaboration.",
      },
    ],
  },
  {
    id: "emp-lettre",
    idea: [
      "La lettre de motivation répond à une seule question : pourquoi toi, pour ce poste, dans cette entreprise ? Si tu pourrais l’envoyer à n’importe quelle société, elle est trop vague. Le recruteur veut sentir que tu as lu son annonce.",
      "Trois paragraphes suffisent. Le premier dit pourquoi cette entreprise t’intéresse, avec un détail vrai (un projet, un produit, une valeur). Le deuxième montre ce que tu apportes, avec un ou deux exemples concrets tirés de ton parcours. Le troisième propose une suite : un entretien, en précisant tes disponibilités.",
      "Évite de recopier ton CV : la lettre explique, le CV liste. Garde des phrases courtes, un ton poli mais naturel, et tiens sur une page. Certaines offres ne demandent plus de lettre : dans ce cas, ne l’envoie que si elle peut t’aider.",
    ],
    keys: [
      "Une lettre répond à : pourquoi toi, ce poste, cette entreprise ?",
      "Trois paragraphes : l’entreprise, ce que tu apportes, la suite.",
      "Un détail vrai sur l’entreprise prouve que tu t’es renseigné.",
      "Une page maximum, sans recopier le CV.",
    ],
    gesture: {
      intro:
        "Remplis chaque case, puis assemble les phrases dans une lettre. Elle sera courte et propre à cette offre.",
      fields: [
        {
          label: "Le poste et l’entreprise visés",
          example: "Magasinier chez Transports Lemoine",
        },
        {
          label: "Pourquoi cette entreprise (un détail vrai)",
          example:
            "Vous livrez en 24 heures dans toute la région, j’aime ce rythme.",
        },
        {
          label: "Ce que j’apporte (exemple concret)",
          example:
            "Chez Dupuis, j’ai réduit les erreurs de préparation de commandes en créant une liste de contrôle.",
        },
        {
          label: "Une qualité utile pour ce poste",
          example: "Rigueur et goût du travail en équipe",
        },
        {
          label: "La suite proposée",
          example: "Je suis disponible pour un entretien dès cette semaine.",
        },
        {
          label: "Formule de politesse",
          example:
            "Je vous prie d’agréer, Madame, Monsieur, mes sincères salutations.",
        },
      ],
      tip: "Si tu peux, adresse-la à une personne (le nom est parfois dans l’annonce) plutôt qu’à « Madame, Monsieur ».",
    },
    check: [
      {
        q: "À quoi sert surtout la lettre de motivation ?",
        options: [
          "À recopier ton CV avec d’autres mots",
          "À montrer pourquoi tu veux ce poste dans cette entreprise",
          "À raconter toute ta vie",
        ],
        answer: 1,
        why: "Le CV liste les faits, la lettre explique ta motivation et ce que tu apportes.",
      },
      {
        q: "Quel détail rend une lettre crédible ?",
        options: [
          "Un compliment général sur « la belle entreprise »",
          "Une phrase copiée sur n’importe quel site",
          "Un point précis et vrai sur l’entreprise ou l’offre",
        ],
        answer: 2,
        why: "Un détail précis prouve que tu as lu l’annonce et que la lettre est faite pour eux.",
      },
      {
        q: "Combien de place prend une bonne lettre ?",
        options: [
          "Une page au plus",
          "Trois pages pour tout détailler",
          "Une phrase seulement",
        ],
        answer: 0,
        why: "Le recruteur lit vite : une page courte et ciblée est mieux lue qu’un long texte.",
      },
    ],
  },
  {
    id: "emp-entretien",
    idea: [
      "Un entretien se prépare comme un examen oral : les mêmes questions reviennent presque toujours. « Parlez-moi de vous », « Pourquoi ce poste ? », « Quels sont vos points forts et vos faiblesses ? », « Où vous voyez-vous dans cinq ans ? ». Si tu y as réfléchi avant, tu seras à l’aise.",
      "Prépare deux ou trois histoires vraies de ton parcours : un problème résolu, une réussite, une erreur dont tu as appris quelque chose. Elles servent de réponse à beaucoup de questions. Raconte-les simplement : la situation, ce que tu as fait, le résultat.",
      "Renseigne-toi sur l’entreprise, prépare deux questions à poser (sur le poste, l’équipe, la suite du processus) et arrive en avance. À la fin, remercie. Un entretien est aussi ta chance de vérifier que le poste te convient.",
    ],
    keys: [
      "Les mêmes questions reviennent : prépare tes réponses.",
      "Prépare deux ou trois histoires vraies : situation, action, résultat.",
      "Renseigne-toi sur l’entreprise.",
      "Pose deux questions : l’entretien va dans les deux sens.",
    ],
    gesture: {
      intro:
        "Remplis cette fiche la veille. Relis-la le matin : elle te sert de repère, pas de texte à réciter.",
      fields: [
        {
          label: "Le poste et l’entreprise",
          example: "Vendeur en magasin de sport, Décathlon près de chez moi",
        },
        {
          label: "Ma présentation en 30 secondes",
          example:
            "J’ai 24 ans, deux ans de vente en habillement, je veux passer au sport que je pratique.",
        },
        {
          label: "Mon histoire de réussite",
          example:
            "J’ai doublé les ventes d’un rayon en changeant la mise en place.",
        },
        {
          label: "Mon point faible et ce que je fais pour progresser",
          example:
            "Je suis impatient : je note mes priorités pour attendre le bon moment.",
        },
        {
          label: "Ce que je sais de l’entreprise",
          example:
            "Magasin de quartier, grand choix, conseils par des passionnés",
        },
        {
          label: "Mes deux questions à poser",
          example:
            "Comment se passe l’arrivée d’un nouveau ? Quelle équipe je rejoins ?",
        },
      ],
      tip: "Répète à voix haute devant un proche ou un miroir : ce n’est pas la même chose que dans ta tête.",
    },
    check: [
      {
        q: "Pourquoi préparer des histoires vraies de ton parcours ?",
        options: [
          "Pour répondre à beaucoup de questions avec des exemples concrets",
          "Pour impressionner en exagérant",
          "Pour éviter de répondre aux questions",
        ],
        answer: 0,
        why: "Un exemple vécu est plus convaincant qu’une qualité annoncée sans preuve.",
      },
      {
        q: "En fin d’entretien, on te demande si tu as des questions. Que fais-tu ?",
        options: [
          "Tu réponds « non, tout est clair » pour ne pas déranger",
          "Tu poses une ou deux questions préparées sur le poste ou l’équipe",
          "Tu demandes tout de suite le salaire et les congés, sans rien d’autre",
        ],
        answer: 1,
        why: "Poser des questions montre ton intérêt et t’aide à savoir si le poste te convient.",
      },
      {
        q: "Une bonne façon de raconter une réussite est :",
        options: [
          "Citer le plus de qualités possibles",
          "Dire que tu es sérieux et motivé",
          "Décrire la situation, ce que tu as fait et le résultat",
        ],
        answer: 2,
        why: "Situation, action, résultat : le recruteur voit ce que tu sais faire.",
      },
    ],
  },
  {
    id: "emp-contrat",
    idea: [
      "Un contrat de travail est un papier qui fixe les règles entre toi et ton employeur : poste, durée, salaire, horaires. Les deux contrats les plus courants sont le CDI (contrat à durée indéterminée, sans date de fin) et le CDD (contrat à durée déterminée, avec une date de fin ou un motif précis).",
      "Avant de signer, vérifie dans l’ordre : l’intitulé du poste et tes missions, la date de début, le salaire brut et sa périodicité, la durée du travail (par exemple 35 heures par semaine), le lieu de travail, et la convention collective qui s’applique. Une période d’essai peut exister : sa durée et ses règles sont encadrées par la loi, et leur détail se trouve sur service-public.fr.",
      "Lis tout, même les petites lignes. Si une clause te surprend (ne pas travailler pour un concurrent, mobilité, forfait en heures), pose la question avant de signer. Garde un exemplaire signé. En cas de doute, tu peux te renseigner auprès d’un syndicat, de l’inspection du travail ou sur service-public.fr.",
    ],
    keys: [
      "CDI : pas de date de fin. CDD : date de fin ou motif précis.",
      "Vérifie poste, date de début, salaire brut, durée du travail, lieu.",
      "La période d’essai est encadrée par la loi : renseigne-toi sur service-public.fr.",
      "Pose tes questions avant de signer et garde un exemplaire.",
    ],
    gesture: {
      intro:
        "Prends ton contrat (ou une proposition) et vérifie chaque point. Coche ce qui est écrit et note ce qui manque ou t’étonne.",
      fields: [
        { label: "Type de contrat (CDI, CDD, autre)", example: "CDI" },
        {
          label: "Poste et missions écrits",
          example: "Agent d’entretien, nettoyage de bureaux",
        },
        { label: "Date de début", example: "2 décembre" },
        {
          label: "Salaire brut et fréquence",
          example: "1 900 € brut par mois, versé en fin de mois",
        },
        {
          label: "Durée du travail et horaires",
          example: "35 heures par semaine, de 6 h à 13 h",
        },
        {
          label: "Lieu de travail",
          example: "Bureaux de Villeurbanne, déplacements possibles",
        },
        {
          label: "Une clause à demander ou à clarifier",
          example: "La période d’essai et son éventuel renouvellement",
        },
      ],
      tip: "Photographie ou scanne le contrat signé et garde-le avec tes fiches de paie : tu en auras besoin plus tard.",
    },
    check: [
      {
        q: "Quelle est la différence entre un CDI et un CDD ?",
        options: [
          "Le CDI paie toujours plus",
          "Le CDD n’a pas de contrat écrit",
          "Le CDI n’a pas de date de fin, le CDD en a une ou un motif précis",
        ],
        answer: 2,
        why: "C’est la durée qui distingue les deux : indéterminée pour le CDI, déterminée pour le CDD.",
      },
      {
        q: "Une clause te surprend dans le contrat. Que fais-tu ?",
        options: [
          "Tu demandes des précisions avant de signer",
          "Tu signes, tu verras plus tard",
          "Tu la barres toi-même au stylo",
        ],
        answer: 0,
        why: "Avant la signature, tu peux poser des questions et faire clarifier ce qui t’inquiète.",
      },
      {
        q: "Où trouver les règles exactes sur la période d’essai ?",
        options: [
          "Sur un forum, selon l’expérience de chacun",
          "Auprès de tes collègues uniquement",
          "Sur service-public.fr ou dans le code du travail",
        ],
        answer: 2,
        why: "Les durées et conditions sont fixées par la loi et par les conventions : les sources officielles font foi.",
      },
    ],
  },
  {
    id: "emp-salaire",
    idea: [
      "Négocier, ce n’est pas réclamer : c’est montrer que ta demande est juste. Avant d’en parler, regarde ce que paient des postes comparables dans ta région (annonces, sites d’emploi, convention collective). Tu parles alors avec des repères, pas au hasard.",
      "Ta valeur, ce sont aussi des faits : les résultats que tu as obtenus, les responsabilités que tu as prises, ce que tu apportes en plus. Prépare trois exemples précis. Choisis le bon moment : après une belle réussite, lors d’un entretien annuel, ou à l’offre d’embauche.",
      "Donne un chiffre précis ou une fourchette dont le bas te convient. Si la réponse est non, demande ce qu’il faudrait faire pour obtenir une augmentation et à quelle date en reparler : tu peux aussi négocier d’autres avantages (horaires, formation, jours de congé). Reste calme et courtois : le but est de continuer à travailler ensemble.",
    ],
    keys: [
      "Compare avec des postes similaires avant de parler.",
      "Appuie-toi sur des faits : résultats, responsabilités.",
      "Annonce un chiffre ou une fourchette dont le bas te convient.",
      "Si c’est non, demande les conditions pour un oui plus tard.",
    ],
    gesture: {
      intro:
        "Prépare ta demande par écrit avant l’entretien. Tu y vas avec des repères, des faits et un chiffre.",
      fields: [
        { label: "Mon salaire actuel (brut)", example: "2 000 € par mois" },
        {
          label: "Ce que paient des postes comparables",
          example:
            "2 200 à 2 400 € brut dans la région, d’après trois annonces",
        },
        {
          label: "Mes trois preuves de valeur",
          example:
            "Formation du nouveau, zéro retard de livraison, client important gardé",
        },
        {
          label: "Ma demande (chiffre ou fourchette)",
          example: "2 300 € brut par mois",
        },
        {
          label: "Mon plan B si la réponse est non",
          example:
            "Une formation payée et une date de réévaluation dans six mois",
        },
        { label: "Le moment choisi", example: "Entretien annuel de janvier" },
      ],
      tip: "Dis ton chiffre en premier si tu as des repères solides, puis fais une pause : ne remplis pas le silence en baissant ta demande.",
    },
    check: [
      {
        q: "Que faire avant de demander une augmentation ?",
        options: [
          "Menacer de démissionner pour montrer ta détermination",
          "Comparer avec des postes similaires et préparer des faits",
          "Demander à un collègue combien il gagne et l’imiter",
        ],
        answer: 1,
        why: "Des repères du marché et des preuves de ta valeur rendent ta demande solide et sereine.",
      },
      {
        q: "Ton employeur dit non pour l’instant. Quelle réaction est la plus utile ?",
        options: [
          "Demander ce qu’il faut atteindre et fixer une date pour en reparler",
          "Partir en claquant la porte",
          "Ne plus jamais aborder le sujet",
        ],
        answer: 0,
        why: "Tu transformes un non en plan concret et tu gardes la relation.",
      },
      {
        q: "Pourquoi annoncer une fourchette plutôt qu’un seul chiffre ?",
        options: [
          "Pour paraître indécis",
          "Parce que le bas de la fourchette est ce qui te convient vraiment",
          "Pour que l’employeur choisisse le plus haut",
        ],
        answer: 1,
        why: "Une fourchette laisse de la place à l’accord, à condition que son minimum te convienne.",
      },
    ],
  },
  {
    id: "emp-reconversion",
    idea: [
      "Changer de métier, c’est possible à tout âge, mais mieux vaut le préparer. La première étape est un bilan : qu’est-ce que tu sais faire, ce que tu aimes, ce que tu ne veux plus. Un conseiller peut t’y aider, par exemple lors d’un bilan de compétences ou d’un rendez-vous de conseil en évolution professionnelle (CEP), gratuit pour les actifs.",
      "Ensuite, vérifie que le métier visé recrute et ce qu’il demande : diplôme, titre professionnel, expérience. Parle avec des gens qui l’exercent, fais un stage ou une journée d’immersion si c’est possible. Tu évites ainsi de te former pour un métier qui ne te plaira pas.",
      "Pour te former, il existe des aides : le compte personnel de formation (CPF), l’aide de France Travail si tu es inscrit, ou le projet de transition professionnelle. Les conditions changent : renseigne-toi sur service-public.fr ou sur moncompteformation.gouv.fr avant de t’engager et de faire des plans financiers.",
    ],
    keys: [
      "Commence par un bilan : ce que tu sais faire, ce que tu veux.",
      "Le conseil en évolution professionnelle (CEP) est gratuit pour t’aider.",
      "Teste le métier avant de te former : rencontres, stage, immersion.",
      "Les aides (CPF, France Travail) changent : vérifie les conditions actuelles.",
    ],
    gesture: {
      intro:
        "Remplis ce plan en plusieurs fois. Il te donne une feuille de route et montre ce qu’il te reste à vérifier.",
      fields: [
        {
          label: "Mon métier actuel et ce qui ne va plus",
          example: "Vendeuse : horaires du week-end, peu d’évolution",
        },
        {
          label: "Ce que je sais faire et ce que j’aime",
          example: "Conseiller, organiser, travailler en autonomie",
        },
        { label: "Le métier envisagé", example: "Gestionnaire de paie" },
        {
          label: "Ce que ce métier demande (formation, diplôme)",
          example: "Titre professionnel ou BTS, vérifié sur le site officiel",
        },
        {
          label: "Comment je le teste avant",
          example:
            "Parler à deux gestionnaires de paie, une journée d’immersion",
        },
        {
          label: "Comment je finance la formation",
          example: "CPF, à vérifier avec un conseiller",
        },
        {
          label: "Première étape cette semaine",
          example:
            "Prendre rendez-vous avec un conseiller en évolution professionnelle",
        },
      ],
      tip: "Ne démissionne pas avant d’avoir vérifié le financement et la date de début de ta formation.",
    },
    check: [
      {
        q: "Quelle est la bonne première étape d’une reconversion ?",
        options: [
          "Démissionner pour se libérer du temps",
          "S’inscrire à la première formation trouvée",
          "Faire le point sur ce que tu sais faire et ce que tu veux",
        ],
        answer: 2,
        why: "Un bilan évite de se tromper de direction et prépare la suite.",
      },
      {
        q: "Pourquoi rencontrer des gens qui exercent le métier visé ?",
        options: [
          "Pour vérifier que le métier te plaît vraiment avant de te former",
          "Pour leur demander un emploi tout de suite",
          "Pour t’éviter d’avoir à te former",
        ],
        answer: 0,
        why: "Le métier réel est parfois différent de l’image qu’on s’en fait : mieux vaut le savoir avant.",
      },
      {
        q: "Les aides à la formation (CPF, France Travail…) :",
        options: [
          "Ne changent jamais",
          "Sont les mêmes pour tout le monde",
          "Évoluent : vérifie les conditions du moment sur les sites officiels",
        ],
        answer: 2,
        why: "Les montants et conditions varient : les sites officiels donnent la règle à jour.",
      },
    ],
  },
  {
    id: "emp-reseau",
    idea: [
      "Beaucoup d’emplois se trouvent par le bouche-à-oreille, pas seulement par les annonces. Se faire un réseau, c’est simplement faire savoir autour de soi ce que l’on sait faire et ce que l’on cherche, et rester en contact avec des gens du métier. Ce n’est pas de la flatterie, c’est de la conversation.",
      "LinkedIn est un site où les professionnels ont un profil. Soigne le tien : une photo nette, un titre clair (« Comptable junior, recherche alternance »), un court texte sur ce que tu fais, tes expériences. Puis connecte-toi à des gens que tu connais, et à des personnes de ton secteur avec un petit message personnalisé.",
      "Pour te présenter sans gêne, pose des questions plutôt que de demander un emploi : « Comment êtes-vous arrivé dans ce métier ? Que me conseillez-vous ? ». Les gens aiment aider. Remercie toujours, et donne en retour : partage une info utile ou félicite pour une réussite.",
    ],
    keys: [
      "Beaucoup de postes se trouvent par des contacts.",
      "Un profil LinkedIn soigné : photo, titre clair, résumé court.",
      "Demande des conseils plutôt qu’un emploi.",
      "Remercie et rends service à ton tour.",
    ],
    gesture: {
      intro:
        "Écris le contenu de ton profil LinkedIn avant de le saisir en ligne. Tu peux ensuite le copier tel quel.",
      fields: [
        {
          label: "Ton titre (sous ton nom)",
          example: "Comptable junior | Recherche alternance en cabinet",
        },
        {
          label: "Ton résumé en 3 phrases",
          example:
            "Passionnée de chiffres, j’ai fait deux stages en cabinet. J’aime organiser et expliquer simplement. Je cherche un cabinet pour mon alternance.",
        },
        {
          label: "Une expérience avec un résultat",
          example:
            "Stage chez Duval : saisie de 200 factures par semaine sans erreur",
        },
        {
          label: "Trois compétences à afficher",
          example: "Comptabilité, Excel, relation client",
        },
        {
          label: "Deux personnes à contacter cette semaine",
          example:
            "Mon ancienne tutrice de stage, un comptable rencontré à un salon",
        },
        {
          label: "Ton message d’invitation",
          example:
            "Bonjour, j’aimerais vous poser deux questions sur votre métier. Merci d’avance !",
        },
      ],
      tip: "Choisis une photo où l’on voit bien ton visage, sur fond simple : un smartphone en lumière du jour suffit.",
    },
    check: [
      {
        q: "Quel message d’invitation à un inconnu est le meilleur ?",
        options: [
          "« Trouvez-moi un emploi. »",
          "« Bonjour, je débute dans votre métier : puis-je vous poser deux questions ? »",
          "« Acceptez ma demande. »",
        ],
        answer: 1,
        why: "Une demande courte, polie et précise est facile à accepter.",
      },
      {
        q: "Que doit montrer ton titre LinkedIn ?",
        options: [
          "Ton salaire",
          "Une phrase d’humour",
          "Ce que tu fais et ce que tu cherches",
        ],
        answer: 2,
        why: "Le titre est vu partout : il doit dire en quelques mots qui tu es et ce que tu cherches.",
      },
      {
        q: "Pourquoi demander des conseils plutôt qu’un emploi ?",
        options: [
          "Les gens aiment aider et ça ouvre la discussion sans pression",
          "Parce que personne n’embauche jamais par contact",
          "Pour éviter de remercier",
        ],
        answer: 0,
        why: "On répond volontiers à une demande de conseil, et la relation peut déboucher plus tard sur une opportunité.",
      },
    ],
  },
  {
    id: "emp-carriere",
    idea: [
      "Piloter sa carrière, c’est ne pas subir ses emplois mais choisir où l’on va. Pour cela, il faut une direction : un poste visé à deux ou trois ans, même s’il change en route. « Chef d’équipe », « responsable d’agence », « indépendant » : une cible rend chaque choix plus simple.",
      "Ensuite, compare ce que tu as et ce que ce poste demande : compétences, expérience, diplôme, réseau. Les écarts forment ton plan : une formation, une mission qui te fait grandir, quelqu’un qui t’accompagne. Fixe-toi quelques étapes datées et vérifie-les tous les six mois.",
      "Parle de tes ambitions à ton responsable : il peut t’aider, mais seulement s’il les connaît. Garde aussi la trace de tes réussites (chiffres, remerciements) : elles serviront pour une augmentation, une promotion ou un nouvel emploi. Et reste ouvert : certaines des meilleures opportunités arrivent sans être prévues.",
    ],
    keys: [
      "Choisis un poste visé à deux ou trois ans.",
      "Compare ce que tu as et ce que le poste demande : les écarts font ton plan.",
      "Parle de tes ambitions à ton responsable.",
      "Note tes réussites et vérifie ton plan tous les six mois.",
    ],
    gesture: {
      intro:
        "Remplis ce plan de carrière sur une page. Relis-le tous les six mois pour le mettre à jour.",
      fields: [
        { label: "Mon poste actuel", example: "Technicien de maintenance" },
        {
          label: "Le poste visé dans 2-3 ans",
          example: "Responsable de maintenance d’un site",
        },
        {
          label: "Ce que ce poste demande",
          example: "Gérer une équipe, un budget, parler aux fournisseurs",
        },
        {
          label: "Ce qui me manque",
          example: "Expérience du management et connaissances en budget",
        },
        {
          label: "Mes trois actions, avec dates",
          example:
            "Demander un rôle de référent d’équipe (mars), formation en gestion (juin), point avec mon responsable (avril)",
        },
        {
          label: "Mes réussites à garder en preuve",
          example:
            "Pannes réduites de 20 % sur mon secteur, remerciements du client",
        },
      ],
      tip: "Note ces réussites tout de suite, dans un fichier à part : on les oublie très vite.",
    },
    check: [
      {
        q: "À quoi sert un poste visé dans deux ou trois ans ?",
        options: [
          "À s’interdire de changer d’avis",
          "À donner une direction pour choisir formations et missions",
          "À prouver à ton patron que tu veux sa place",
        ],
        answer: 1,
        why: "Une cible sert de boussole : elle aide à choisir ce qui te rapproche du but.",
      },
      {
        q: "Qu’appelle-t-on les « écarts » dans un plan de carrière ?",
        options: [
          "Les fautes commises dans ton métier",
          "Les jours d’absence",
          "Ce qui manque entre ton niveau actuel et ce que demande le poste visé",
        ],
        answer: 2,
        why: "Les écarts montrent ce qu’il faut apprendre ou vivre pour atteindre le poste.",
      },
      {
        q: "Pourquoi garder la trace de tes réussites ?",
        options: [
          "Pour les utiliser quand tu demandes une promotion ou changes d’emploi",
          "Pour les montrer à tout le monde chaque jour",
          "Pour avoir une excuse en cas d’erreur",
        ],
        answer: 0,
        why: "Des faits notés au fil de l’eau rendent tes demandes et ton CV beaucoup plus solides.",
      },
    ],
  },
];
