import type { Lesson } from "./lessons";

/**
 * Finance d'entreprise, après « Chiffre d'affaires, marge et trésorerie » et
 * « Seuil de rentabilité ». Notions comptables générales, présentées de façon
 * simplifiée ; les règles comptables et fiscales détaillées (plan comptable,
 * durées d'amortissement, régimes) se vérifient avec un expert-comptable.
 */
const editorialStatus =
  "Parcours pédagogique · exemples fictifs et présentations comptables simplifiées · règles détaillées à vérifier avec un professionnel · aucun conseil personnalisé";

const bpiCreation = {
  title: "Bpifrance Création · gestion et finances",
  url: "https://bpifrance-creation.fr/",
};
const planComptable = {
  title: "Autorité des normes comptables · plan comptable général",
  url: "https://www.anc.gouv.fr/",
};
const banqueDeFranceEntreprises = {
  title: "Banque de France · accompagnement des TPE-PME",
  url: "https://entreprises.banque-france.fr/",
};

export const businessFinanceLessons: Lesson[] = [
  {
    id: "fin-etats-financiers",
    title: "Lire un compte de résultat et un bilan",
    domain: "Finance",
    level: 1,
    minutes: 20,
    summary:
      "Le compte de résultat raconte une année ; le bilan photographie une date. Savoir les lire, c’est comprendre d’où vient le résultat et ce que possède et doit l’entreprise.",
    skills: ["Compte de résultat", "Bilan", "Capitaux propres et dettes"],
    prerequisites: ["ca-marge-tresorerie"],
    sections: [
      {
        title: "Pourquoi apprendre ça ?",
        body: [
          "Banquiers, investisseurs, repreneurs et administrations parlent la même langue : celle des comptes annuels. Les lire évite de signer un prêt, un rachat ou une association sans comprendre la situation réelle.",
          "Deux documents se complètent : l’un dit si l’activité gagne de l’argent sur une période, l’autre ce que l’entreprise possède et doit à une date donnée.",
        ],
      },
      {
        title: "Le compte de résultat",
        body: [
          "Il compare les produits (ventes, subventions d’exploitation, produits financiers) et les charges (achats, charges externes, salaires et cotisations, impôts et taxes, dotations aux amortissements, intérêts) d’un exercice, souvent l’année. Produits − charges = résultat : bénéfice s’il est positif, perte sinon.",
          "On le lit en cascade. Le résultat d’exploitation mesure ce que rapporte le métier lui-même. Le résultat financier ajoute intérêts reçus et payés. Le résultat exceptionnel isole les opérations inhabituelles, comme la vente d’une machine. Après impôt sur les bénéfices, on obtient le résultat net.",
          "L’excédent brut d’exploitation (EBE) est un repère clé : ce que dégage l’activité avant amortissements, intérêts et impôt. Il indique la capacité du métier à produire de la trésorerie, indépendamment des choix de financement.",
        ],
      },
      {
        title: "Le bilan",
        body: [
          "À gauche, l’actif : ce que l’entreprise possède ou contrôle. Les immobilisations (machines, logiciels, locaux, gardés plusieurs années), puis l’actif circulant : stocks, créances clients, trésorerie disponible.",
          "À droite, le passif : comment cet actif est financé. Les capitaux propres (capital apporté, réserves, résultat de l’année) appartiennent aux associés ; les dettes (emprunts bancaires, dettes fournisseurs, dettes fiscales et sociales) sont dues à des tiers. Le bilan est toujours équilibré : actif = passif.",
          "Des capitaux propres négatifs signalent que les pertes ont dépassé les apports : la situation exige des mesures. Un fort endettement à court terme face à peu de trésorerie signale un risque de difficultés de paiement.",
        ],
      },
      {
        title: "Le point de vigilance",
        body: [
          "Un bénéfice n’est pas de l’argent sur le compte : une vente facturée non encaissée compte dans le résultat, et le remboursement du capital d’un emprunt sort de la trésorerie sans passer en charge.",
          "Un bilan est une photo à une date choisie : stock et trésorerie peuvent être très différents une semaine plus tard. Compare toujours plusieurs exercices, et lis l’annexe, qui explique les méthodes et les engagements hors bilan.",
        ],
      },
    ],
    example: {
      title: "Exemple fictif · une boulangerie",
      body: "Sur l’année, la boulangerie réalise 300 000 € de ventes. Achats de farine et matières : 90 000 €. Charges externes (loyer, énergie, assurance) : 50 000 €. Salaires et cotisations : 120 000 €. Impôts et taxes : 5 000 €. L’EBE vaut 35 000 €. Après 15 000 € d’amortissement du four et 3 000 € d’intérêts, le résultat avant impôt est de 17 000 €. Au bilan, le four figure à l’actif pour sa valeur restant à amortir, et l’emprunt qui l’a financé au passif.",
    },
    exercise: {
      prompt:
        "Une entreprise affiche à son bilan 40 000 € d’immobilisations, 10 000 € de stocks, 15 000 € de créances clients et 5 000 € de trésorerie. Ses dettes s’élèvent à 30 000 € d’emprunt et 12 000 € de dettes fournisseurs. Quel est le montant de ses capitaux propres ?",
      hint: "Actif = passif. Capitaux propres = actif total − dettes.",
      answer:
        "Actif total : 40 000 + 10 000 + 15 000 + 5 000 = 70 000 €. Dettes : 42 000 €. Capitaux propres : 70 000 − 42 000 = 28 000 €.",
      explanation:
        "Le bilan s’équilibre toujours : ce que l’entreprise possède est financé soit par ses associés (capitaux propres), soit par des tiers (dettes).",
    },
    quiz: [
      {
        id: "fin-etats-1",
        question:
          "Une entreprise rembourse 10 000 € de capital d’emprunt. Où cela apparaît-il ?",
        options: [
          "En charge dans le compte de résultat.",
          "Dans la trésorerie et la baisse de la dette au bilan, pas en charge : seuls les intérêts sont une charge.",
          "Nulle part, car c’est une opération bancaire.",
        ],
        answer: 1,
        explanation:
          "Le capital remboursé réduit la dette et la trésorerie ; les intérêts, eux, sont une charge financière.",
      },
      {
        id: "fin-etats-2",
        question: "Que mesure l’excédent brut d’exploitation (EBE) ?",
        options: [
          "Le bénéfice final distribué aux associés.",
          "Ce que dégage le métier avant amortissements, intérêts et impôt.",
          "Le montant disponible sur le compte bancaire.",
        ],
        answer: 1,
        explanation:
          "L’EBE isole la performance du métier, indépendamment des investissements passés et du financement.",
      },
    ],
    application:
      "Si tu as accès aux comptes d’une entreprise (la tienne ou des comptes publiés), calcule son EBE, ses capitaux propres et compare deux années.",
    idea: {
      title: "Lire les comptes de mon entreprise",
      description:
        "Résultat d’exploitation, EBE, capitaux propres et dettes : les quatre chiffres à suivre chaque année.",
    },
    sources: [planComptable, bpiCreation, banqueDeFranceEntreprises],
    version: "1.0.0",
    editorialStatus,
    flashcards: [
      {
        front: "Compte de résultat",
        back: "Produits − charges d’une période : bénéfice ou perte.",
      },
      {
        front: "Bilan",
        back: "À une date : actif (ce que l’on possède) = passif (capitaux propres + dettes).",
      },
      {
        front: "EBE",
        back: "Excédent brut d’exploitation : ce que dégage le métier avant amortissements, intérêts et impôt.",
      },
    ],
  },
  {
    id: "fin-bfr-tresorerie",
    title: "BFR et plan de trésorerie",
    domain: "Finance",
    level: 1,
    minutes: 18,
    summary:
      "Stocks et délais de paiement immobilisent de l’argent. Mesurer le besoin en fonds de roulement et prévoir sa trésorerie mois par mois évite la panne de cash.",
    skills: [
      "Besoin en fonds de roulement",
      "Plan de trésorerie",
      "Délais clients et fournisseurs",
    ],
    prerequisites: ["ca-marge-tresorerie"],
    sections: [
      {
        title: "Pourquoi apprendre ça ?",
        body: [
          "Une entreprise rentable peut cesser ses paiements : c’est la trésorerie, pas le bénéfice, qui paie les salaires et les fournisseurs. Une croissance rapide aggrave souvent le problème, car elle augmente stocks et créances avant d’apporter du cash.",
          "Prévoir permet d’agir à temps : négocier un délai, demander un acompte, mobiliser un financement avant d’en avoir un besoin urgent.",
        ],
      },
      {
        title: "Le besoin en fonds de roulement",
        body: [
          "Le besoin en fonds de roulement (BFR) d’exploitation, dans sa version simple : stocks + créances clients − dettes fournisseurs (et autres dettes d’exploitation). C’est l’argent immobilisé dans le cycle d’activité, entre le moment où l’on paie et celui où l’on encaisse.",
          "Il s’exprime aussi en jours de chiffre d’affaires. Délai client moyen = créances clients ÷ chiffre d’affaires TTC × 365. Délai fournisseur = dettes fournisseurs ÷ achats TTC × 365. Un délai client qui s’allonge augmente le BFR.",
          "Le fonds de roulement, lui, est l’excédent des ressources durables (capitaux propres, emprunts longs) sur les immobilisations. La trésorerie nette ≈ fonds de roulement − BFR : si le BFR dépasse le fonds de roulement, la différence est financée à court terme, souvent par découvert.",
        ],
      },
      {
        title: "Le plan de trésorerie",
        body: [
          "Un tableau, un mois par colonne : solde de départ, encaissements prévus (ventes encaissées, apports, prêts, subventions), décaissements prévus (fournisseurs, salaires, cotisations, loyer, TVA à reverser, échéances d’emprunt, investissements), puis solde de fin de mois.",
          "Les montants s’y inscrivent à la date de paiement, TVA comprise, et non à la date de facture. C’est la principale différence avec le compte de résultat.",
          "Leviers quand le solde plonge : acomptes et paiement à la commande, relance rapide, réduction des stocks, délais négociés avec les fournisseurs, étalement d’un investissement, financement adapté (découvert autorisé, affacturage, prêt de trésorerie).",
        ],
      },
      {
        title: "Le point de vigilance",
        body: [
          "Les décaissements ponctuels sont les plus oubliés : TVA trimestrielle, régularisation de cotisations, impôt, assurance annuelle, renouvellement de matériel. Un plan qui ne les contient pas rassure à tort.",
          "Garde une trésorerie de sécurité correspondant à plusieurs semaines de charges fixes, et compare chaque mois le prévu au réalisé pour corriger tes hypothèses.",
        ],
      },
    ],
    example: {
      title: "Exemple fictif · un grossiste qui grandit",
      body: "Un grossiste en thé vend 50 000 € par mois, paie ses fournisseurs à 30 jours, garde un mois de stock et ses clients le règlent à 60 jours. Il accepte un nouveau client qui double ses ventes : ses besoins de stock et de créances doublent aussi, bien avant les premiers encaissements. Son plan de trésorerie révèle un creux de 70 000 € au troisième mois. Il négocie un acompte de 30 % avec le nouveau client et un délai de 45 jours avec son fournisseur principal.",
    },
    exercise: {
      prompt:
        "Une entreprise a 20 000 € de stocks, 45 000 € de créances clients et 25 000 € de dettes fournisseurs. Son chiffre d’affaires TTC annuel est de 365 000 €. Calcule son BFR et son délai client moyen.",
      hint: "BFR = stocks + créances − dettes fournisseurs. Délai = créances ÷ CA TTC × 365.",
      answer:
        "BFR : 20 000 + 45 000 − 25 000 = 40 000 €. Délai client : 45 000 ÷ 365 000 × 365 = 45 jours.",
      explanation:
        "Réduire le délai client de 15 jours libérerait environ 15 000 € de trésorerie (15 jours de chiffre d’affaires à 1 000 € par jour).",
    },
    quiz: [
      {
        id: "fin-bfr-1",
        question:
          "Les clients paient désormais à 60 jours au lieu de 30. Qu’arrive-t-il au BFR ?",
        options: [
          "Il diminue, car les ventes sont plus élevées.",
          "Il augmente : plus d’argent reste immobilisé dans les créances clients.",
          "Il ne change pas, car le chiffre d’affaires est le même.",
        ],
        answer: 1,
        explanation:
          "Des créances qui restent plus longtemps impayées augmentent l’argent immobilisé dans le cycle.",
      },
      {
        id: "fin-bfr-2",
        question:
          "Dans un plan de trésorerie, à quelle date inscrire une vente ?",
        options: [
          "À la date de la facture.",
          "À la date prévue de l’encaissement, TVA comprise.",
          "À la fin de l’exercice comptable.",
        ],
        answer: 1,
        explanation:
          "Le plan de trésorerie suit les mouvements d’argent réels, pas les dates comptables.",
      },
    ],
    application:
      "Construis un plan de trésorerie sur six mois pour ton projet, avec les décaissements ponctuels, et repère le mois le plus tendu.",
    idea: {
      title: "Plan de trésorerie de mon projet",
      description:
        "Encaissements, décaissements et solde mois par mois, avec le mois le plus tendu et les leviers prévus.",
    },
    sources: [bpiCreation, banqueDeFranceEntreprises],
    version: "1.0.0",
    editorialStatus,
    flashcards: [
      {
        front: "BFR simplifié",
        back: "Stocks + créances clients − dettes fournisseurs.",
      },
      {
        front: "Délai client moyen",
        back: "Créances clients ÷ chiffre d’affaires TTC × 365.",
      },
      {
        front: "Plan de trésorerie",
        back: "Encaissements et décaissements à leur date réelle, TVA comprise, mois par mois.",
      },
    ],
  },
  {
    id: "fin-previsionnel",
    title: "Construire un prévisionnel crédible",
    domain: "Finance",
    level: 2,
    minutes: 22,
    summary:
      "Un prévisionnel n’est pas une promesse : c’est un modèle d’hypothèses. Le construire, le relier et le tester en scénarios pour décider et convaincre.",
    skills: [
      "Hypothèses chiffrées",
      "Compte de résultat prévisionnel",
      "Scénarios et sensibilité",
    ],
    prerequisites: ["seuil-rentabilite", "fin-bfr-tresorerie"],
    sections: [
      {
        title: "Pourquoi apprendre ça ?",
        body: [
          "Banques et financeurs demandent un prévisionnel, mais son premier utilisateur, c’est toi : il montre si le projet peut vivre, combien de temps il faut tenir et quel chiffre surveiller.",
          "Un prévisionnel trop optimiste fait prendre de mauvaises décisions ; un prévisionnel sans hypothèses explicites ne convainc personne.",
        ],
      },
      {
        title: "Les quatre tableaux",
        body: [
          "Les hypothèses d’abord : prix, volumes et leur montée en charge, coûts variables, charges fixes, salaires, délais de paiement, investissements. Chacune est justifiée (entretiens, devis, données de marché, précommandes).",
          "Le compte de résultat prévisionnel, souvent sur trois ans, en déduit chiffre d’affaires, marges, charges et résultat. Le plan de financement met en face les besoins (investissements, BFR) et les ressources (apports, prêts, aides).",
          "Le plan de trésorerie mensuel de la première année vérifie que le compte ne passe jamais sous zéro. Les quatre tableaux sont reliés : changer une hypothèse doit tout mettre à jour.",
        ],
      },
      {
        title: "Tester la solidité",
        body: [
          "Construis au moins trois scénarios : prudent, central et favorable. Le scénario prudent ne doit pas mettre l’entreprise en cessation de paiement, ou il faut prévoir comment réagir.",
          "L’analyse de sensibilité fait varier une hypothèse à la fois (prix −10 %, volume −20 %, délai client +30 jours) pour voir laquelle menace le plus le projet. C’est elle qu’il faut tester en priorité sur le terrain.",
          "La montée en charge est souvent l’erreur la plus fréquente : atteindre son rythme de croisière prend des mois. Un chiffre d’affaires plein dès le premier mois est un signal d’alerte pour un banquier.",
        ],
      },
      {
        title: "Le point de vigilance",
        body: [
          "N’oublie ni ta propre rémunération (ou comment tu vivras sans), ni les cotisations sociales du dirigeant, ni la TVA, ni les impôts. Un projet rentable uniquement parce que le fondateur ne se paie pas reste fragile.",
          "Compare ensuite le réel au prévisionnel chaque mois : l’écart est une information précieuse, pas un échec.",
        ],
      },
    ],
    example: {
      title: "Exemple fictif · un studio de pilates",
      body: "Hypothèses : 6 cours par jour, 12 places, un taux de remplissage qui passe de 30 % à 70 % en dix mois, 18 € la séance, 4 500 € de charges fixes mensuelles. Le scénario central atteint l’équilibre au septième mois ; le prudent, avec un remplissage plafonné à 55 %, au onzième. L’analyse de sensibilité montre que le remplissage pèse beaucoup plus que le prix : la fondatrice organise des cours d’essai avant l’ouverture pour constituer une liste d’abonnés.",
    },
    exercise: {
      prompt:
        "Un projet a 6 000 € de charges fixes mensuelles et une marge de 30 € par vente. Le scénario central prévoit 260 ventes par mois, le prudent 180. Calcule le résultat mensuel de chaque scénario et le nombre de ventes d’équilibre.",
      hint: "Résultat = ventes × marge unitaire − charges fixes. Équilibre = charges fixes ÷ marge unitaire.",
      answer:
        "Central : 260 × 30 − 6 000 = 1 800 €. Prudent : 180 × 30 − 6 000 = −600 €. Équilibre : 6 000 ÷ 30 = 200 ventes par mois.",
      explanation:
        "Le scénario prudent est déficitaire : le prévisionnel doit dire comment le projet tient s’il se réalise (réserve de trésorerie, baisse de charges, action commerciale).",
    },
    quiz: [
      {
        id: "fin-prev-1",
        question: "À quoi sert principalement l’analyse de sensibilité ?",
        options: [
          "À rendre le prévisionnel plus optimiste.",
          "À identifier l’hypothèse dont la variation menace le plus le projet.",
          "À calculer l’impôt sur les sociétés.",
        ],
        answer: 1,
        explanation:
          "Faire varier une hypothèse à la fois montre où concentrer les vérifications et la vigilance.",
      },
      {
        id: "fin-prev-2",
        question:
          "Un prévisionnel affiche le chiffre d’affaires de croisière dès le premier mois. Qu’en penser ?",
        options: [
          "C’est un signe de projet solide.",
          "C’est peu réaliste : la montée en charge prend généralement plusieurs mois.",
          "C’est obligatoire pour obtenir un prêt.",
        ],
        answer: 1,
        explanation:
          "Une montée en charge progressive est plus crédible et évite de sous-estimer le besoin de trésorerie.",
      },
    ],
    application:
      "Liste les dix hypothèses de ton projet avec leur justification, puis construis trois scénarios et repère l’hypothèse la plus sensible.",
    idea: {
      title: "Le prévisionnel de mon projet",
      description:
        "Hypothèses justifiées, trois scénarios et l’hypothèse la plus sensible à tester en premier.",
    },
    sources: [bpiCreation, banqueDeFranceEntreprises],
    version: "1.0.0",
    editorialStatus,
    flashcards: [
      {
        front: "Les quatre tableaux",
        back: "Hypothèses, compte de résultat prévisionnel, plan de financement, plan de trésorerie.",
      },
      {
        front: "Analyse de sensibilité",
        back: "Faire varier une hypothèse à la fois pour voir laquelle menace le plus le projet.",
      },
      {
        front: "Montée en charge",
        back: "Progression du chiffre d’affaires vers son rythme de croisière, souvent sur plusieurs mois.",
      },
    ],
  },
  {
    id: "fin-investir-amortir",
    title: "Investir et amortir",
    domain: "Finance",
    level: 2,
    minutes: 18,
    summary:
      "Une machine n’est pas une charge comme les autres : elle s’amortit sur sa durée d’utilisation. Évaluer un investissement par ce qu’il rapporte et le temps qu’il met à se rembourser.",
    skills: [
      "Immobilisation et amortissement",
      "Retour sur investissement",
      "Délai de récupération",
    ],
    prerequisites: ["fin-etats-financiers"],
    sections: [
      {
        title: "Pourquoi apprendre ça ?",
        body: [
          "Acheter un véhicule, un logiciel ou un local engage l’entreprise pour des années. Comprendre l’amortissement évite deux erreurs : croire qu’un gros achat « plombe » le résultat d’une seule année, ou oublier qu’il faudra le renouveler.",
          "Évaluer un investissement avant de le faire permet de comparer des options et de choisir son financement.",
        ],
      },
      {
        title: "Immobilisation et amortissement",
        body: [
          "Un bien destiné à servir durablement (au-delà d’un exercice) est une immobilisation : il est inscrit à l’actif du bilan, et non en charge immédiate. Les petits matériels de faible valeur peuvent, sous conditions, être passés directement en charge ; le seuil se vérifie avec le comptable.",
          "L’amortissement répartit le coût du bien sur sa durée d’utilisation. En amortissement linéaire : dotation annuelle = valeur d’achat HT ÷ durée. Un four de 30 000 € amorti sur 5 ans entraîne 6 000 € de dotation par an. Les durées usuelles dépendent du type de bien.",
          "La dotation est une charge qui ne fait pas sortir d’argent : la trésorerie est sortie le jour de l’achat. C’est pourquoi la capacité d’autofinancement (CAF) se calcule, simplement, en ajoutant au résultat net les dotations aux amortissements.",
        ],
      },
      {
        title: "Évaluer un investissement",
        body: [
          "Le délai de récupération répond à « en combien de temps l’investissement est-il remboursé par ce qu’il rapporte ? » : coût ÷ gain de trésorerie annuel. Il est simple et utile pour comparer des projets risqués.",
          "Le retour sur investissement (ROI) = gain obtenu ÷ montant investi, souvent exprimé en pourcentage annuel. Il ne tient pas compte du temps : un euro dans cinq ans vaut moins qu’un euro aujourd’hui. Les méthodes avancées (valeur actuelle nette, taux de rendement interne) actualisent les flux futurs.",
          "Acheter ou louer ? Achat comptant, emprunt, crédit-bail ou location longue durée changent la trésorerie, le bilan et la souplesse : comparer le coût total sur la durée d’usage.",
        ],
      },
      {
        title: "Le point de vigilance",
        body: [
          "Le gain d’un investissement se mesure en trésorerie supplémentaire ou en coûts évités, et doit inclure l’entretien, l’énergie, la formation et les arrêts de production.",
          "Un investissement financé par la trésorerie courante peut provoquer une crise de liquidités : un bien durable se finance plutôt par des ressources durables (emprunt, crédit-bail, apport).",
        ],
      },
    ],
    example: {
      title: "Exemple fictif · un imprimeur",
      body: "Un imprimeur hésite à acheter une machine à 48 000 € HT qui lui ferait économiser 1 000 € de sous-traitance par mois, moins 200 € d’entretien. Gain net : 9 600 € par an. Délai de récupération : 5 ans. Amortie sur 6 ans, la machine génère 8 000 € de dotation annuelle. Il finance l’achat par un emprunt sur 5 ans plutôt que par sa trésorerie, pour garder sa réserve de sécurité.",
    },
    exercise: {
      prompt:
        "Un logiciel métier coûte 12 000 € HT, s’amortit sur 3 ans et fait gagner 500 € par mois de temps facturable. Calcule la dotation annuelle, le gain annuel et le délai de récupération.",
      hint: "Dotation = coût ÷ durée. Délai = coût ÷ gain annuel.",
      answer:
        "Dotation : 12 000 ÷ 3 = 4 000 € par an. Gain : 500 × 12 = 6 000 € par an. Délai de récupération : 12 000 ÷ 6 000 = 2 ans.",
      explanation:
        "Le logiciel est remboursé avant la fin de sa période d’amortissement : l’investissement est pertinent si le gain de temps est réellement facturé.",
    },
    quiz: [
      {
        id: "fin-amort-1",
        question:
          "Une machine de 20 000 € est amortie en linéaire sur 4 ans. Quelle est la dotation annuelle ?",
        options: [
          "20 000 € la première année.",
          "5 000 € par an.",
          "4 000 € par an.",
        ],
        answer: 1,
        explanation: "20 000 ÷ 4 = 5 000 € de dotation chaque année.",
      },
      {
        id: "fin-amort-2",
        question:
          "Pourquoi ajoute-t-on les amortissements au résultat pour estimer la CAF ?",
        options: [
          "Parce que la dotation est une charge qui ne fait pas sortir d’argent pendant l’exercice.",
          "Parce que les amortissements sont des recettes.",
          "Parce que la loi l’impose dans le compte de résultat.",
        ],
        answer: 0,
        explanation:
          "L’argent est sorti à l’achat ; la dotation répartit ensuite ce coût sans nouveau décaissement.",
      },
    ],
    application:
      "Pour un investissement envisagé, calcule la dotation annuelle, le gain net annuel en trésorerie et le délai de récupération, puis compare achat et location.",
    idea: {
      title: "Évaluer un investissement de mon projet",
      description:
        "Coût, amortissement, gain net, délai de récupération et mode de financement comparés.",
    },
    sources: [planComptable, bpiCreation],
    version: "1.0.0",
    editorialStatus,
    flashcards: [
      {
        front: "Amortissement linéaire",
        back: "Dotation annuelle = valeur d’achat HT ÷ durée d’utilisation.",
      },
      {
        front: "Délai de récupération",
        back: "Coût de l’investissement ÷ gain de trésorerie annuel.",
      },
      {
        front: "CAF simplifiée",
        back: "Résultat net + dotations aux amortissements.",
      },
    ],
  },
  {
    id: "fin-piloter-indicateurs",
    title: "Piloter avec des indicateurs",
    domain: "Finance",
    level: 2,
    minutes: 18,
    summary:
      "Un tableau de bord de quelques chiffres bien choisis vaut mieux que cent graphiques. Choisir, calculer et lire les indicateurs qui pilotent une petite entreprise.",
    skills: ["Tableau de bord", "Taux de marge et rentabilité", "Endettement"],
    prerequisites: ["fin-etats-financiers", "fin-bfr-tresorerie"],
    sections: [
      {
        title: "Pourquoi apprendre ça ?",
        body: [
          "Les comptes annuels arrivent des mois après les faits. Pour piloter, il faut des chiffres plus fréquents, liés aux décisions : prix, commandes, encaissements, stocks.",
          "Un bon indicateur déclenche une action quand il dérive ; un indicateur que personne ne regarde ou qui ne change aucune décision peut disparaître.",
        ],
      },
      {
        title: "Les indicateurs essentiels",
        body: [
          "Activité : chiffre d’affaires du mois et cumulé, comparé au prévisionnel et à l’année précédente ; nombre de clients et panier moyen.",
          "Marge : taux de marge = marge ÷ chiffre d’affaires HT. Pour un commerce, la marge commerciale (ventes − coût d’achat des marchandises vendues) ; pour un service, la marge sur coûts variables. Une marge qui s’érode signale des coûts en hausse ou des remises trop fréquentes.",
          "Trésorerie et cycle : solde de trésorerie et prévision à 3 mois, délai client moyen, montant des impayés, rotation des stocks (combien de fois le stock est renouvelé sur l’année).",
        ],
      },
      {
        title: "Rentabilité et solidité",
        body: [
          "Rentabilité : taux d’EBE (EBE ÷ chiffre d’affaires), résultat net ÷ chiffre d’affaires, et rentabilité des capitaux propres (résultat net ÷ capitaux propres) pour les associés.",
          "Solidité : endettement (dettes financières ÷ capitaux propres) et capacité de remboursement (dettes financières ÷ CAF, en années). Les banques regardent ces ratios avant d’accorder un crédit.",
          "Un tableau de bord tient sur une page : cinq à dix indicateurs, un objectif et un seuil d’alerte pour chacun, mis à jour à date fixe (chaque semaine ou chaque mois).",
        ],
      },
      {
        title: "Le point de vigilance",
        body: [
          "Un ratio seul ne dit rien : il se compare dans le temps, à un objectif ou à des entreprises du même secteur. Les moyennes sectorielles se trouvent auprès des fédérations, de la Banque de France ou des centres de gestion agréés.",
          "Méfie-toi des indicateurs de vanité, qui montent sans rapporter (abonnés, visites, devis envoyés) : relie chaque indicateur au cash ou à la marge.",
        ],
      },
    ],
    example: {
      title: "Exemple fictif · une épicerie fine",
      body: "Le gérant suit chaque lundi six chiffres : ventes de la semaine, panier moyen, taux de marge, stock en jours de ventes, trésorerie prévue à 90 jours et produits périmés jetés. En trois mois, le taux de marge baisse de 38 % à 33 % alors que les ventes progressent. En cause : des promotions répétées sur les produits les plus vendus. Il les remplace par une offre groupée qui protège la marge.",
    },
    exercise: {
      prompt:
        "Une entreprise réalise 400 000 € de chiffre d’affaires HT, 60 000 € d’EBE et 20 000 € de résultat net, avec 100 000 € de capitaux propres et 150 000 € de dettes financières. Calcule le taux d’EBE, la rentabilité des capitaux propres et le ratio d’endettement.",
      hint: "Taux d’EBE = EBE ÷ CA. Rentabilité des capitaux propres = résultat net ÷ capitaux propres. Endettement = dettes financières ÷ capitaux propres.",
      answer:
        "Taux d’EBE : 60 000 ÷ 400 000 = 15 %. Rentabilité des capitaux propres : 20 000 ÷ 100 000 = 20 %. Endettement : 150 000 ÷ 100 000 = 1,5.",
      explanation:
        "L’entreprise est rentable, mais ses dettes financières représentent une fois et demie ses capitaux propres : un banquier regardera aussi sa capacité de remboursement.",
    },
    quiz: [
      {
        id: "fin-pilot-1",
        question:
          "Les ventes augmentent mais le taux de marge baisse. Quelle hypothèse vérifier en premier ?",
        options: [
          "Que l’entreprise vend trop.",
          "Que les coûts d’achat ont augmenté ou que les remises sont trop fréquentes.",
          "Que le tableau de bord est faux, car une hausse des ventes améliore toujours la marge.",
        ],
        answer: 1,
        explanation:
          "Le taux de marge rapporte la marge au chiffre d’affaires : il baisse si les coûts montent ou si le prix réellement payé diminue.",
      },
      {
        id: "fin-pilot-2",
        question: "Qu’est-ce qui fait un bon indicateur de pilotage ?",
        options: [
          "Il est spectaculaire à présenter.",
          "Il est mis à jour régulièrement, a un objectif et un seuil d’alerte, et déclenche une décision quand il dérive.",
          "Il est calculé une fois par an par le comptable.",
        ],
        answer: 1,
        explanation:
          "Un indicateur sert à décider : sans seuil ni action associée, il ne pilote rien.",
      },
    ],
    application:
      "Choisis six indicateurs pour ton activité, avec pour chacun un objectif, un seuil d’alerte et l’action prévue s’il est franchi.",
    idea: {
      title: "Le tableau de bord de mon projet",
      description:
        "Six indicateurs, leur objectif, leur seuil d’alerte et l’action associée.",
    },
    sources: [banqueDeFranceEntreprises, bpiCreation],
    version: "1.0.0",
    editorialStatus,
    flashcards: [
      {
        front: "Taux de marge",
        back: "Marge ÷ chiffre d’affaires HT.",
      },
      {
        front: "Rentabilité des capitaux propres",
        back: "Résultat net ÷ capitaux propres.",
      },
      {
        front: "Endettement",
        back: "Dettes financières ÷ capitaux propres.",
      },
    ],
  },
];
