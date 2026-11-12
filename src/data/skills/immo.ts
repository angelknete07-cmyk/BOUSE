import type { SkillContent } from "./types";

/** Immobilier : les compétences sans leçon longue. */
export const skills: SkillContent[] = [
  {
    id: "immo-louer",
    idea: [
      "Pour louer un logement, tu dois convaincre le propriétaire que tu paieras ton loyer. Il regarde surtout tes revenus, la stabilité de ton emploi et, souvent, si quelqu’un se porte garant. Un dossier complet, clair et envoyé vite donne un vrai avantage.",
      "Un dossier contient en général : une pièce d’identité, un justificatif de domicile, ton contrat de travail, tes dernières fiches de paie et ton dernier avis d’imposition. La loi limite la liste des pièces qu’on peut te demander : un propriétaire ne peut pas exiger n’importe quoi.",
      "Méfie-toi des arnaques : ne vire jamais d’argent avant d’avoir visité et signé, et refuse toute demande de paiement à un inconnu qui se dit « à l’étranger ». Les frais d’agence demandés au locataire sont encadrés par la loi : vérifie les règles à jour sur service-public.fr.",
    ],
    keys: [
      "Un dossier complet et envoyé vite fait la différence.",
      "Identité, domicile, contrat de travail, fiches de paie, avis d’imposition : la base.",
      "La loi limite les pièces qu’un propriétaire peut demander.",
      "Ne paie jamais avant d’avoir visité et signé.",
    ],
    gesture: {
      intro:
        "Prépare ton dossier de location une fois pour toutes, en un seul fichier ou classeur, prêt à envoyer en quelques minutes.",
      fields: [
        {
          label: "Pièce d’identité",
          example: "carte d’identité, scan lisible",
        },
        {
          label: "Justificatif de domicile",
          example: "quittance de loyer ou facture récente",
        },
        {
          label: "Preuves de revenus",
          example: "contrat de travail + 3 dernières fiches de paie",
        },
        {
          label: "Dernier avis d’imposition",
          example: "téléchargé sur impots.gouv.fr",
        },
        {
          label: "Garant éventuel et ses pièces",
          example: "parent : identité, fiches de paie",
        },
        {
          label: "Courte lettre de présentation",
          example: "3 phrases : qui je suis, mon travail, mon projet",
        },
      ],
      tip: "Mets tout dans un seul fichier clair : un dossier facile à ouvrir est lu en premier.",
    },
    check: [
      {
        q: "Que fais-tu si un inconnu demande de l’argent avant la visite ?",
        options: [
          "Je vire pour réserver",
          "Je refuse : c’est un risque d’arnaque",
          "Je vire la moitié",
        ],
        answer: 1,
        why: "Ne jamais payer sans avoir visité et signé : c’est le piège classique des fausses annonces.",
      },
      {
        q: "Qu’est-ce qui rend un dossier de location plus fort ?",
        options: [
          "Qu’il soit complet et envoyé vite",
          "Qu’il soit très long",
          "Qu’il contienne des documents inutiles",
        ],
        answer: 0,
        why: "Un dossier complet rassure et permet de décider vite.",
      },
      {
        q: "Un propriétaire peut-il demander n’importe quel document ?",
        options: [
          "Oui",
          "Non, la loi limite la liste",
          "Seulement un agent immobilier",
        ],
        answer: 1,
        why: "Une liste officielle fixe les pièces qu’on peut demander à un locataire.",
      },
    ],
  },
  {
    id: "immo-etat-lieux",
    idea: [
      "L’état des lieux décrit l’état du logement le jour où tu rentres, puis le jour où tu pars. En fin de bail, on compare les deux : seules les différences dues à une mauvaise utilisation peuvent être retenues sur ta caution.",
      "Fais-le avec soin : pièce par pièce, note l’état des murs, du sol, des fenêtres, des équipements, et relève les compteurs. Prends des photos datées de chaque défaut. Mets ce que tu constates par écrit, même si le défaut te paraît petit.",
      "Tu peux compléter le document dans le délai prévu par la loi après ton entrée. Vérifie ce délai sur service-public.fr, et note-le dans ton agenda. À la sortie, refais le même exercice : sans preuve au départ, le propriétaire peut avoir du mal à te croire.",
    ],
    keys: [
      "L’état des lieux d’entrée protège ta caution à la sortie.",
      "Pièce par pièce, avec des photos datées.",
      "Note les compteurs d’eau, d’électricité et de gaz.",
      "Les défauts non notés à l’entrée te seront reprochés à la sortie.",
    ],
    gesture: {
      intro:
        "Imprime ou recopie cette grille et remplis-la à l’entrée dans le logement, avec le propriétaire ou l’agence. Fais la même à la sortie.",
      fields: [
        {
          label: "Murs et plafonds",
          example: "salon : tache d’humidité en haut à gauche, photo n° 3",
        },
        {
          label: "Sols et fenêtres",
          example: "chambre : rayure sur le parquet, vitre fêlée",
        },
        {
          label: "Cuisine et salle de bain",
          example: "robinet qui fuit légèrement, joint noirci",
        },
        {
          label: "Équipements (plaques, chauffage, volets)",
          example: "1 plaque ne chauffe pas",
        },
        {
          label: "Relevé des compteurs",
          example: "électricité, eau, gaz : valeurs et photo",
        },
        { label: "Nombre de clés remises", example: "3 clés + 1 badge" },
      ],
      tip: "Une photo avec la date et un commentaire écrit valent mieux qu’une promesse orale.",
    },
    check: [
      {
        q: "À quoi sert l’état des lieux d’entrée ?",
        options: [
          "À décorer l’appartement",
          "À prouver l’état du logement quand tu arrives",
          "À réduire ton loyer",
        ],
        answer: 1,
        why: "Il sert de point de comparaison à la sortie pour protéger ta caution.",
      },
      {
        q: "Tu vois une tache sur un mur en arrivant. Que fais-tu ?",
        options: [
          "Rien, c’est petit",
          "Je la note et je la prends en photo",
          "Je la repeins",
        ],
        answer: 1,
        why: "Ce qui n’est pas écrit à l’entrée peut t’être reproché à la sortie.",
      },
      {
        q: "Pourquoi relever les compteurs ?",
        options: [
          "Pour ne payer que ta propre consommation",
          "Par habitude seulement",
          "Pour changer de fournisseur",
        ],
        answer: 0,
        why: "Les relevés d’entrée et de sortie évitent de payer la consommation d’un autre.",
      },
    ],
  },
  {
    id: "immo-capacite",
    idea: [
      "Avant de chercher un bien, calcule ce que tu peux te permettre. Ta capacité d’achat dépend de tes revenus, de tes dépenses, de ton apport (l’argent que tu mets de ta poche) et de la durée du prêt. Plus l’apport est grand, moins tu empruntes.",
      "Les banques regardent ton taux d’endettement : la part de tes revenus consacrée aux remboursements de prêts. Les règles et les seuils évoluent : vérifie les repères à jour auprès de ta banque ou sur service-public.fr. Une mensualité qui respecte le seuil n’est pas forcément confortable pour toi.",
      "Ne compte pas que sur le prix du bien. Ajoute les frais de notaire, les frais de dossier, les travaux éventuels, la taxe foncière et les charges de copropriété. Prévois toujours une marge : un imprévu ne doit pas te mettre en difficulté.",
    ],
    keys: [
      "Capacité d’achat = revenus, dépenses, apport et durée du prêt.",
      "Les banques regardent le taux d’endettement ; vérifie le seuil à jour.",
      "Ajoute notaire, travaux, taxe foncière et charges au prix du bien.",
      "Garde une marge pour les imprévus.",
    ],
    gesture: {
      intro:
        "Fais un premier calcul avec tes vrais chiffres. Les valeurs ci-dessous sont des exemples ronds.",
      fields: [
        { label: "Revenus nets mensuels du foyer", example: "3 000 €" },
        {
          label: "Dépenses fixes et crédits en cours",
          example: "loyer 800 €, crédit auto 200 €",
        },
        {
          label: "Mensualité maximale confortable pour moi",
          example: "900 € (bien en dessous du seuil des banques)",
        },
        { label: "Apport disponible", example: "20 000 €" },
        { label: "Durée du prêt envisagée", example: "20 ans" },
        {
          label: "Frais annexes à prévoir (notaire, travaux, taxe foncière)",
          example: "notaire et travaux estimés à part",
        },
        {
          label: "Marge de sécurité gardée",
          example: "épargne de précaution intacte",
        },
      ],
      tip: "Teste ta future mensualité en la mettant de côté chaque mois avant d’acheter : tu verras si elle est tenable.",
    },
    check: [
      {
        q: "Que mesure le taux d’endettement ?",
        options: [
          "La part des revenus consacrée aux remboursements de prêts",
          "Le prix du bien",
          "La valeur de l’apport",
        ],
        answer: 0,
        why: "C’est le rapport entre les mensualités de prêts et les revenus.",
      },
      {
        q: "Un prêt autorisé par la banque est-il forcément confortable ?",
        options: [
          "Oui, toujours",
          "Non, il faut vérifier que la mensualité est tenable pour toi",
          "Oui, si l’apport est nul",
        ],
        answer: 1,
        why: "La banque calcule un maximum ; ton confort dépend de ta vie et de tes dépenses.",
      },
      {
        q: "Que faut-il ajouter au prix du bien ?",
        options: [
          "Rien",
          "Frais de notaire, travaux éventuels, taxe foncière et charges",
          "Uniquement les meubles",
        ],
        answer: 1,
        why: "Ces coûts s’ajoutent au prix et pèsent sur ton budget.",
      },
    ],
  },
  {
    id: "immo-visite",
    idea: [
      "Une visite dure trente minutes, mais le bien te suivra des années. Va-t’y avec une checklist pour ne pas te laisser distraire par la décoration ou l’agent immobilier. Les défauts qui coûtent cher sont rarement les plus visibles.",
      "Regarde les signes d’humidité (taches, odeur de moisi), l’état des fenêtres, de l’électricité, du chauffage, et la toiture si c’est une maison. Ouvre les robinets, les placards, les volets. Demande le diagnostic de performance énergétique, qui note la consommation du logement.",
      "En copropriété, demande les derniers procès-verbaux d’assemblée générale et le montant des charges : ils révèlent les travaux prévus et les éventuels conflits. Visite à plusieurs moments de la journée si possible, pour juger le bruit et la luminosité.",
    ],
    keys: [
      "Utilise une checklist pour ne pas te laisser distraire.",
      "Cherche l’humidité, l’électricité, le chauffage, les fenêtres.",
      "Demande le diagnostic énergétique du logement.",
      "En copropriété, lis les procès-verbaux d’assemblée et les charges.",
    ],
    gesture: {
      intro:
        "Imprime cette checklist et remplis-la pendant la visite. Note une valeur ou un commentaire par ligne.",
      fields: [
        {
          label: "Humidité, odeurs, fissures",
          example: "tache au plafond de la salle de bain",
        },
        {
          label: "Fenêtres, volets, isolation",
          example: "double vitrage, volets qui coincent",
        },
        {
          label: "Électricité et chauffage",
          example: "tableau électrique ancien ?",
        },
        {
          label: "Diagnostic énergétique",
          example: "lettre notée, à lire en détail",
        },
        {
          label: "Charges et travaux prévus en copropriété",
          example: "ravalement voté pour l’an prochain",
        },
        {
          label: "Bruit et luminosité aux différentes heures",
          example: "très bruyant le matin, rue passante",
        },
        {
          label: "Mon impression générale",
          example: "à noter sans se précipiter",
        },
      ],
      tip: "Prends des photos et visite au moins deux fois avant de décider, à des heures différentes.",
    },
    check: [
      {
        q: "Quel défaut peut coûter très cher ?",
        options: [
          "Une peinture ancienne",
          "Des signes d’humidité",
          "Des rideaux démodés",
        ],
        answer: 1,
        why: "L’humidité peut cacher un problème de structure ou d’étanchéité, long et cher à réparer.",
      },
      {
        q: "En copropriété, que révèlent les procès-verbaux d’assemblée ?",
        options: [
          "Les travaux prévus et les litiges éventuels",
          "L’âge des voisins",
          "Le prix des voitures",
        ],
        answer: 0,
        why: "Ils contiennent les décisions de travaux et les problèmes en cours dans l’immeuble.",
      },
      {
        q: "Pourquoi visiter à des heures différentes ?",
        options: [
          "Pour juger le bruit et la luminosité",
          "Pour négocier le prix à coup sûr",
          "Pour rencontrer plus de monde",
        ],
        answer: 0,
        why: "Le bruit et la lumière changent selon le moment de la journée.",
      },
    ],
  },
  {
    id: "immo-offre",
    idea: [
      "Quand un bien te plaît, tu peux faire une offre d’achat : une proposition de prix, souvent un peu inférieure au prix affiché. Elle est écrite et précise le prix, les conditions (par exemple l’obtention du prêt) et sa durée de validité.",
      "Pour négocier, appuie-toi sur des faits : travaux à prévoir, diagnostic énergétique faible, prix des biens comparables vendus dans le quartier. Une remarque polie avec des chiffres convainc mieux qu’une exigence. Reste libre de refuser une contre-proposition qui dépasse ton budget.",
      "Une fois l’offre acceptée, on signe un avant-contrat chez le notaire. L’acheteur dispose alors d’un délai de rétractation : vérifie sa durée sur service-public.fr. Garde toujours une condition de prêt dans ton offre : si la banque refuse, tu ne perds pas ton argent.",
    ],
    keys: [
      "Une offre d’achat est écrite, avec prix, conditions et durée de validité.",
      "Négocie avec des faits : travaux, diagnostic, prix du quartier.",
      "Garde une condition d’obtention du prêt.",
      "Un délai de rétractation existe après l’avant-contrat : vérifie sa durée.",
    ],
    gesture: {
      intro:
        "Rédige ta lettre d’offre avec ces cases. Elle sera ensuite adressée au vendeur ou à l’agence.",
      fields: [
        {
          label: "Bien concerné (adresse, référence)",
          example: "appartement 3 pièces, 12 rue des Lilas",
        },
        { label: "Prix proposé", example: "190 000 € au lieu de 200 000 €" },
        {
          label: "Raisons de ce prix",
          example:
            "travaux de cuisine estimés, biens comparables vendus moins cher",
        },
        {
          label: "Condition d’obtention du prêt",
          example: "offre valable sous réserve d’obtention du prêt",
        },
        { label: "Durée de validité de l’offre", example: "7 jours" },
        { label: "Mes coordonnées", example: "nom, téléphone, e-mail" },
      ],
      tip: "Décide à l’avance de ton prix maximum : cela évite de céder sous la pression pendant la négociation.",
    },
    check: [
      {
        q: "Pourquoi garder une condition d’obtention du prêt ?",
        options: [
          "Pour ne pas perdre son argent si la banque refuse",
          "Pour payer plus cher",
          "Pour que le vendeur accepte plus vite",
        ],
        answer: 0,
        why: "Si le prêt est refusé, l’achat est annulé sans pénalité pour toi.",
      },
      {
        q: "Quel argument négocie le mieux ?",
        options: [
          "Un fait chiffré : travaux à prévoir, prix du quartier",
          "Un ton agacé",
          "Une menace",
        ],
        answer: 0,
        why: "Des faits objectifs rendent la demande difficile à écarter.",
      },
      {
        q: "Une offre d’achat doit préciser :",
        options: [
          "Le prix, les conditions et sa durée de validité",
          "Seulement ton prénom",
          "Rien, c’est oral",
        ],
        answer: 0,
        why: "Une offre claire par écrit protège les deux parties.",
      },
    ],
  },
  {
    id: "immo-pret",
    idea: [
      "Un prêt immobilier se compare sur plusieurs critères, pas seulement sur le taux. Regarde le TAEG (taux annuel effectif global) : il inclut les frais obligatoires et permet de comparer des offres différentes. Regarde aussi la durée, la mensualité et les frais de dossier.",
      "L’assurance emprunteur est une assurance qui rembourse la banque si tu ne peux plus payer (décès, invalidité…). Elle pèse beaucoup sur le coût total. Tu as le droit de choisir une assurance extérieure à la banque, à garanties équivalentes : c’est souvent plus avantageux.",
      "Mets au moins trois banques en concurrence, ou passe par un courtier, un professionnel qui cherche pour toi. Garde ton dossier prêt : pièces d’identité, fiches de paie, relevés de comptes. Les taux changent tout le temps : compare des offres de la même semaine.",
    ],
    keys: [
      "Compare le TAEG, la durée, la mensualité et les frais.",
      "L’assurance emprunteur pèse sur le coût total.",
      "Tu peux choisir une assurance extérieure à garanties équivalentes.",
      "Mets plusieurs banques en concurrence, ou passe par un courtier.",
    ],
    gesture: {
      intro:
        "Remplis un tableau avec une colonne par offre. Voici les lignes à comparer ; les chiffres sont des exemples.",
      fields: [
        {
          label: "Banque ou courtier",
          example: "Banque A / Banque B / Banque C",
        },
        { label: "Montant emprunté et durée", example: "200 000 € sur 20 ans" },
        { label: "Taux et TAEG", example: "à relever dans chaque offre" },
        {
          label: "Mensualité (assurance comprise)",
          example: "à relever dans chaque offre",
        },
        {
          label: "Frais de dossier et garantie",
          example: "montants indiqués dans l’offre",
        },
        {
          label: "Coût total du crédit",
          example: "à comparer d’une offre à l’autre",
        },
        {
          label: "Assurance emprunteur : banque ou extérieure",
          example: "extérieure, garanties équivalentes",
        },
      ],
      tip: "Compare le coût total du crédit, pas seulement la mensualité : une durée plus longue baisse la mensualité mais coûte plus cher.",
    },
    check: [
      {
        q: "À quoi sert le TAEG ?",
        options: [
          "À comparer le coût réel de plusieurs offres, frais inclus",
          "À choisir la couleur du contrat",
          "À connaître la valeur du bien",
        ],
        answer: 0,
        why: "Le TAEG inclut les frais obligatoires : il permet de comparer des offres différentes.",
      },
      {
        q: "Peut-on choisir une assurance emprunteur hors de la banque ?",
        options: [
          "Non, jamais",
          "Oui, à garanties équivalentes",
          "Oui, sans aucune condition",
        ],
        answer: 1,
        why: "La loi permet de choisir une assurance extérieure si ses garanties sont équivalentes.",
      },
      {
        q: "Une durée de prêt plus longue :",
        options: [
          "Baisse la mensualité mais augmente le coût total",
          "Baisse à la fois la mensualité et le coût total",
          "N’a aucun effet",
        ],
        answer: 0,
        why: "On rembourse moins par mois, mais plus longtemps : les intérêts s’accumulent.",
      },
    ],
  },
  {
    id: "immo-proprietaire-bailleur",
    idea: [
      "Devenir propriétaire bailleur, c’est acheter pour louer. Le logement te rapporte un loyer, mais il te coûte aussi : crédit, taxe foncière, charges, assurance, entretien, et parfois des mois sans locataire. Il faut tout compter avant de se lancer.",
      "On mesure la rentabilité brute en divisant le loyer annuel par le prix d’achat. Exemple : 6 000 € de loyer par an pour un bien à 100 000 € donne 6 %. La rentabilité nette retire les charges et la taxe foncière : elle est toujours plus basse, et c’est elle qui compte.",
      "Un bail de location est encadré par la loi : durée, préavis, dépôt de garantie, révision du loyer. Les loyers peuvent même être plafonnés dans certaines villes, et les revenus locatifs sont imposables selon des régimes précis. Vérifie les règles à jour sur service-public.fr et demande conseil avant d’acheter.",
    ],
    keys: [
      "Un loyer rapporte, mais crédit, taxe foncière, charges et vacances locatives coûtent.",
      "Rentabilité brute = loyer annuel ÷ prix d’achat.",
      "La rentabilité nette retire les charges : c’est elle qui compte.",
      "Le bail est encadré par la loi ; vérifie les règles à jour avant d’acheter.",
    ],
    gesture: {
      intro:
        "Calcule la rentabilité d’un bien que tu envisages, avec des chiffres réels de l’annonce. Les valeurs ci-dessous sont des exemples.",
      fields: [
        { label: "Prix d’achat (frais inclus)", example: "100 000 €" },
        { label: "Loyer mensuel prévu", example: "500 €" },
        { label: "Loyer annuel", example: "6 000 €" },
        {
          label:
            "Charges annuelles (taxe foncière, copropriété, assurance, entretien)",
          example: "1 500 €",
        },
        { label: "Rentabilité brute", example: "6 000 ÷ 100 000 = 6 %" },
        {
          label: "Rentabilité nette (avant impôt)",
          example: "(6 000 − 1 500) ÷ 100 000 = 4,5 %",
        },
        {
          label: "Mois sans locataire prévus par prudence",
          example: "1 mois par an",
        },
      ],
      tip: "Ajoute toujours un mois de vacance locative par an dans tes calculs : un logement vide ne rapporte rien.",
    },
    check: [
      {
        q: "Un bien à 100 000 € rapporte 6 000 € de loyer par an. Quelle est la rentabilité brute ?",
        options: ["6 %", "60 %", "0,6 %"],
        answer: 0,
        why: "6 000 ÷ 100 000 = 0,06, soit 6 %.",
      },
      {
        q: "Quelle rentabilité compte le plus ?",
        options: ["La brute", "La nette, après charges", "Aucune des deux"],
        answer: 1,
        why: "La rentabilité nette tient compte des vraies dépenses.",
      },
      {
        q: "Qu’est-ce qu’une vacance locative ?",
        options: [
          "Une période où le logement n’a pas de locataire",
          "Les vacances du propriétaire",
          "Un impôt",
        ],
        answer: 0,
        why: "Pendant ce temps, aucun loyer n’est perçu, mais les charges continuent.",
      },
    ],
  },
];
