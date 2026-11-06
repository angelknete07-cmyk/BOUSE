import type { Lesson } from "./lessons";

/**
 * Finance personnelle, suite du module : banque, impôt, assurances, logement,
 * retraite. Pédagogique : exemples fictifs ; les règles citées sont datées
 * (sources concordantes consultées en novembre 2026) et doivent être vérifiées
 * sur les sites officiels. Aucune recommandation d'établissement ou de produit.
 */
const editorialStatus =
  "Module pédagogique · exemples fictifs · règles datées de novembre 2026, à vérifier sur les sites officiels · aucun conseil personnalisé";

const servicePublic = {
  title: "Service-public.fr · espace particuliers",
  url: "https://www.service-public.fr/particuliers",
};
const banqueDeFrance = {
  title: "Banque de France · Mes questions d’argent",
  url: "https://www.mesquestionsdargent.fr/",
};
const impots = {
  title: "impots.gouv.fr · espace particulier",
  url: "https://www.impots.gouv.fr/particulier",
};
const infoRetraite = {
  title: "Info-retraite.fr · relevé de carrière et simulateur",
  url: "https://www.info-retraite.fr/",
};
const anil = {
  title: "ANIL · information logement",
  url: "https://www.anil.org/",
};

export const personalFinanceMoreLessons: Lesson[] = [
  {
    id: "fp-banque-arnaques",
    title: "Banque au quotidien et arnaques",
    domain: "Finance personnelle",
    level: 0,
    minutes: 16,
    summary:
      "Frais, découvert, moyens de paiement : maîtriser son compte. Et reconnaître les fraudes les plus courantes, du faux conseiller au faux site.",
    skills: [
      "Frais et découvert",
      "Moyens de paiement",
      "Fraudes et bons réflexes",
    ],
    prerequisites: [],
    sections: [
      {
        title: "Pourquoi apprendre ça ?",
        body: [
          "Les frais bancaires, les incidents de paiement et les fraudes coûtent chaque année des sommes importantes à ceux qui ne connaissent pas les règles. Quelques réflexes suffisent à éviter l’essentiel.",
          "La banque est aussi le premier outil de budget : relevés, alertes et virements programmés aident à garder la main.",
        ],
      },
      {
        title: "Le compte au quotidien",
        body: [
          "Les frais se comparent sur la plaquette tarifaire, que chaque banque publie, et sur le récapitulatif annuel des frais. Les postes clés : tenue de compte, carte, commissions d’intervention en cas d’incident, frais de rejet.",
          "Le découvert autorisé est un crédit : il coûte des intérêts (agios), au taux prévu par la convention. Un découvert non autorisé ou dépassé coûte plus cher et peut entraîner des rejets. Un découvert permanent signale un budget à revoir, pas un financement durable.",
          "Moyens de paiement : carte (débit immédiat ou différé), virement (y compris instantané, en quelques secondes), prélèvement (qu’on peut contester dans certains délais), chèque (qui doit être provisionné). Le droit au compte permet d’obtenir un compte avec services de base auprès d’une banque désignée par la Banque de France après un refus.",
        ],
      },
      {
        title: "Les fraudes les plus courantes",
        body: [
          "Le faux conseiller : un appel affichant parfois le vrai numéro de la banque (usurpation) annonce une opération suspecte et demande de valider une opération ou de communiquer un code. Une banque ne demande jamais un code reçu par SMS ni de valider une opération pour « l’annuler ».",
          "L’hameçonnage : un message (colis, amende, impôts, compte bloqué) renvoie vers un faux site qui récupère identifiants et données de carte. Taper soi-même l’adresse du site officiel plutôt que de cliquer.",
          "Les faux placements : rendement élevé « garanti », pression pour décider vite, intermédiaire non autorisé. Vérifier sur les listes noires de l’AMF et le registre des intermédiaires (ORIAS) avant tout versement.",
        ],
      },
      {
        title: "Le point de vigilance",
        body: [
          "En cas de fraude : faire opposition immédiatement (numéro interbancaire ou application), signaler l’opération à la banque, porter plainte, et signaler l’arnaque sur les plateformes publiques. Pour une opération non autorisée, la banque doit en principe rembourser, sauf négligence grave du client, notion appréciée au cas par cas.",
          "Une opération que l’on a soi-même validée, même sous la pression d’un fraudeur, est beaucoup plus difficile à récupérer : ne jamais valider une opération que l’on n’a pas initiée.",
        ],
      },
    ],
    example: {
      title: "Exemple fictif · l’appel du « service fraude »",
      body: "Clara reçoit un appel du numéro de sa banque : un conseiller signale un paiement suspect de 980 € et lui demande de valider une notification dans son application « pour bloquer l’opération ». Elle raccroche, ouvre elle-même l’application et appelle le numéro inscrit au dos de sa carte. Il n’y avait aucune opération suspecte : la notification qu’on lui demandait de valider était un virement vers le fraudeur.",
    },
    exercise: {
      prompt:
        "Un compte reste à −300 € pendant 20 jours avec un découvert autorisé à un taux annuel de 16 %. Estime les agios de la période.",
      hint: "Agios ≈ montant × taux annuel × nombre de jours ÷ 365.",
      answer:
        "300 × 16 % × 20 ÷ 365 ≈ 2,63 €. Le coût paraît faible, mais un découvert permanent de 300 € coûterait environ 48 € par an, sans compter les commissions éventuelles.",
      explanation:
        "Le découvert est un crédit à la consommation déguisé : utile ponctuellement, coûteux s’il devient habituel.",
    },
    quiz: [
      {
        id: "fp-banque-1",
        question:
          "Un « conseiller » vous appelle et demande un code reçu par SMS pour annuler une opération. Que faire ?",
        options: [
          "Donner le code rapidement pour limiter la fraude.",
          "Raccrocher et rappeler soi-même la banque au numéro officiel : une banque ne demande jamais ce code.",
          "Donner seulement les quatre premiers chiffres.",
        ],
        answer: 1,
        explanation:
          "Le code sert à valider une opération : le communiquer revient à l’autoriser.",
      },
      {
        id: "fp-banque-2",
        question: "Qu’est-ce que le découvert autorisé ?",
        options: [
          "Un service gratuit de la banque.",
          "Un crédit qui coûte des intérêts (agios) selon la convention de compte.",
          "Une épargne de précaution.",
        ],
        answer: 1,
        explanation:
          "Toute somme avancée par la banque coûte des intérêts, même dans la limite autorisée.",
      },
    ],
    application:
      "Relis ton récapitulatif annuel de frais, active des alertes de solde et note les numéros officiels d’opposition de ta banque.",
    idea: {
      title: "Sécuriser et alléger mon compte bancaire",
      description:
        "Frais identifiés, alertes activées, réflexes anti-fraude et numéros d’urgence notés.",
    },
    sources: [
      banqueDeFrance,
      servicePublic,
      {
        title: "AMF · listes noires et mises en garde",
        url: "https://www.amf-france.org/fr/espace-epargnants",
      },
      {
        title: "Cybermalveillance.gouv.fr · assistance et prévention",
        url: "https://www.cybermalveillance.gouv.fr/",
      },
    ],
    version: "1.0.0",
    editorialStatus,
    flashcards: [
      {
        front: "Agios",
        back: "Intérêts payés sur un découvert ; découvert autorisé ou non, il coûte.",
      },
      {
        front: "Faux conseiller",
        back: "La banque ne demande jamais de code ni de valider une opération pour l’annuler.",
      },
      {
        front: "Opération non autorisée",
        back: "Opposition, signalement, plainte ; remboursement en principe sauf négligence grave.",
      },
    ],
  },
  {
    id: "fp-impot-revenu",
    title: "Comprendre l’impôt sur le revenu",
    domain: "Finance personnelle",
    level: 1,
    minutes: 20,
    summary:
      "Barème progressif, taux marginal et taux moyen, quotient familial, prélèvement à la source : savoir lire son avis et éviter les idées reçues.",
    skills: [
      "Barème progressif",
      "Taux marginal et taux moyen",
      "Prélèvement à la source",
    ],
    prerequisites: ["fp-budget"],
    sections: [
      {
        title: "Pourquoi apprendre ça ?",
        body: [
          "« Si je gagne plus, je vais payer plus d’impôt et gagner moins » : cette idée reçue est fausse avec un barème par tranches, mais elle fait encore refuser des augmentations.",
          "Comprendre l’impôt aide aussi à juger un placement, un statut d’entrepreneur ou une réduction d’impôt annoncée.",
        ],
      },
      {
        title: "Le barème progressif",
        body: [
          "L’impôt sur le revenu se calcule par foyer fiscal. Le revenu net imposable (salaires après abattement pour frais professionnels, revenus d’activité, pensions, certains revenus du patrimoine) est divisé par le nombre de parts du foyer : c’est le quotient familial.",
          "Le barème découpe ce revenu par part en tranches, imposées à des taux croissants : 0 %, 11 %, 30 %, 41 % et 45 %. Chaque tranche n’est imposée qu’à son propre taux : passer dans la tranche supérieure ne taxe que les euros situés au-dessus du seuil. Les seuils sont revalorisés chaque année : vérifie-les sur impots.gouv.fr.",
          "Le taux marginal est celui de la dernière tranche atteinte ; le taux moyen, l’impôt total divisé par le revenu imposable, est toujours plus faible. Ensuite viennent le plafonnement du quotient familial, la décote pour les revenus modestes, puis les réductions et crédits d’impôt.",
        ],
      },
      {
        title: "Payer et déclarer",
        body: [
          "Depuis 2019, l’impôt est prélevé à la source : un taux est appliqué chaque mois sur le salaire ou la pension, et des acomptes sont prélevés sur les revenus d’indépendant ou fonciers. La déclaration annuelle reste obligatoire : elle sert à calculer l’impôt définitif et à régulariser.",
          "Le taux de prélèvement peut être personnalisé (individualisé dans un couple, ou neutre vis-à-vis de l’employeur) et ajusté en cours d’année en cas de changement de situation dans l’espace particulier en ligne.",
          "Réduction ou crédit d’impôt : une réduction diminue l’impôt dû mais ne peut pas le rendre négatif ; un crédit d’impôt est remboursé s’il dépasse l’impôt (cas de l’emploi d’un salarié à domicile, par exemple).",
        ],
      },
      {
        title: "Le point de vigilance",
        body: [
          "Une réduction d’impôt n’est jamais une raison suffisante pour investir : un placement défiscalisant peut faire perdre davantage que l’économie d’impôt promise.",
          "Les montants, seuils et dispositifs changent avec chaque loi de finances. Pour un cas réel, utilise le simulateur officiel de impots.gouv.fr ; l’exemple ci-dessous utilise volontairement un barème fictif.",
        ],
      },
    ],
    example: {
      title: "Exemple fictif · un barème simplifié",
      body: "Imaginons un barème fictif : 0 % jusqu’à 10 000 €, 10 % de 10 000 à 30 000 €, 30 % au-delà. Léo, célibataire, a 35 000 € de revenu imposable. Impôt : 0 sur les 10 000 premiers euros, 10 % de 20 000 = 2 000 €, 30 % de 5 000 = 1 500 €. Total : 3 500 €. Son taux marginal est de 30 %, mais son taux moyen n’est que de 10 %. S’il obtient 1 000 € de plus, il paiera 300 € d’impôt supplémentaire : il gagne toujours 700 € de plus.",
    },
    exercise: {
      prompt:
        "Avec le barème fictif de l’exemple (0 % jusqu’à 10 000 €, 10 % jusqu’à 30 000 €, 30 % au-delà), calcule l’impôt et le taux moyen pour 50 000 € de revenu imposable.",
      hint: "Calcule tranche par tranche : 10 000 à 0 %, 20 000 à 10 %, le reste à 30 %.",
      answer:
        "0 + 2 000 + (20 000 × 30 %) = 2 000 + 6 000 = 8 000 €. Taux moyen : 8 000 ÷ 50 000 = 16 %, alors que le taux marginal est de 30 %.",
      explanation:
        "Seuls les euros au-delà de chaque seuil subissent le taux supérieur : le taux moyen reste bien inférieur au taux marginal.",
    },
    quiz: [
      {
        id: "fp-impot-1",
        question:
          "Une augmentation fait passer dans la tranche supérieure du barème. Que se passe-t-il ?",
        options: [
          "Tout le revenu est alors imposé au taux supérieur.",
          "Seule la part du revenu au-dessus du seuil est imposée au taux supérieur ; le revenu après impôt augmente.",
          "L’impôt double automatiquement.",
        ],
        answer: 1,
        explanation:
          "Le barème est progressif par tranches : changer de tranche ne fait jamais baisser le revenu après impôt.",
      },
      {
        id: "fp-impot-2",
        question: "Quelle différence entre réduction et crédit d’impôt ?",
        options: [
          "Aucune, ce sont deux noms pour la même chose.",
          "Le crédit d’impôt peut être remboursé s’il dépasse l’impôt ; la réduction ne peut que ramener l’impôt à zéro.",
          "La réduction est réservée aux entreprises.",
        ],
        answer: 1,
        explanation:
          "Un foyer non imposable profite d’un crédit d’impôt (remboursé), pas d’une réduction.",
      },
    ],
    application:
      "Retrouve ton taux de prélèvement, ton taux moyen et ton taux marginal sur ton dernier avis d’impôt, puis vérifie que ton taux de prélèvement correspond à ta situation actuelle.",
    idea: {
      title: "Comprendre mon avis d’impôt",
      description:
        "Revenu imposable, parts, taux moyen, taux marginal et taux de prélèvement à vérifier.",
    },
    sources: [impots, servicePublic],
    version: "1.0.0",
    editorialStatus,
    flashcards: [
      {
        front: "Taux marginal",
        back: "Taux de la dernière tranche atteinte ; ne s’applique qu’aux euros au-dessus du seuil.",
      },
      {
        front: "Taux moyen",
        back: "Impôt total ÷ revenu imposable ; toujours inférieur au taux marginal.",
      },
      {
        front: "Prélèvement à la source",
        back: "Impôt prélevé chaque mois depuis 2019 ; la déclaration annuelle reste obligatoire.",
      },
    ],
  },
  {
    id: "fp-assurances",
    title: "S’assurer sans se ruiner",
    domain: "Finance personnelle",
    level: 1,
    minutes: 18,
    summary:
      "Assurances obligatoires, utiles ou superflues : comprendre garanties, franchises et exclusions, et changer de contrat quand il le faut.",
    skills: [
      "Assurances obligatoires",
      "Garanties, franchises, exclusions",
      "Résilier et comparer",
    ],
    prerequisites: ["fp-budget"],
    sections: [
      {
        title: "Pourquoi apprendre ça ?",
        body: [
          "Une assurance transfère un risque que l’on ne pourrait pas supporter seul. Mal choisie, elle coûte cher pour un risque mineur ; absente, elle peut laisser une dette énorme après un sinistre.",
          "Le bon réflexe : assurer d’abord les risques graves et rares, et garder pour soi les petits risques fréquents, couverts par l’épargne de précaution.",
        ],
      },
      {
        title: "Obligatoire, utile, superflu",
        body: [
          "Obligatoires : la responsabilité civile automobile pour tout véhicule terrestre à moteur, l’assurance habitation pour le locataire (au moins les risques locatifs), certaines assurances professionnelles. L’assurance emprunteur n’est pas légalement obligatoire mais presque toujours exigée par la banque pour un crédit immobilier.",
          "Très utiles : la complémentaire santé (souvent proposée par l’employeur), la responsabilité civile de la vie privée (souvent incluse dans l’assurance habitation), la prévoyance (invalidité, décès) quand d’autres dépendent de ses revenus.",
          "À examiner de près : les assurances vendues avec un produit (téléphone, voyage, carte bancaire qui en contient déjà), qui font souvent doublon.",
        ],
      },
      {
        title: "Lire un contrat",
        body: [
          "Les garanties disent ce qui est couvert ; le plafond, jusqu’à quel montant ; la franchise, ce qui reste à la charge de l’assuré à chaque sinistre ; les exclusions, ce qui n’est jamais couvert. Une prime basse cache parfois une franchise élevée ou des exclusions larges.",
          "Résilier : après un an, une assurance auto ou habitation se résilie à tout moment, le nouvel assureur pouvant se charger des démarches. Depuis la loi Lemoine de 2022, l’assurance emprunteur se change à tout moment, à condition d’offrir des garanties équivalentes à celles exigées par la banque.",
          "Déclarer un sinistre dans les délais prévus au contrat, avec photos, factures et constat, conditionne l’indemnisation.",
        ],
      },
      {
        title: "Le point de vigilance",
        body: [
          "Une fausse déclaration à la souscription (antécédents, usage du véhicule, conducteurs) peut entraîner la nullité du contrat ou une indemnisation réduite.",
          "Comparer sur des garanties identiques, pas seulement sur le prix. En cas de litige, le service réclamations de l’assureur puis le médiateur de l’assurance permettent un recours gratuit.",
        ],
      },
    ],
    example: {
      title: "Exemple fictif · deux contrats auto",
      body: "Sofia compare deux contrats. Le premier coûte 480 € par an avec une franchise de 800 € ; le second 600 € avec une franchise de 200 €. Elle dispose d’une épargne de précaution suffisante et n’a pas eu de sinistre depuis dix ans : elle choisit le premier et place la différence de prime sur son épargne. Elle vérifie aussi que sa carte bancaire couvre déjà l’assistance en voyage et supprime une garantie en doublon.",
    },
    exercise: {
      prompt:
        "Contrat A : 360 € par an, franchise 500 €. Contrat B : 480 € par an, franchise 100 €. À partir de combien de sinistres par an le contrat B devient-il moins cher ?",
      hint: "Coût annuel = prime + nombre de sinistres × franchise. Cherche le nombre de sinistres où les coûts s’égalent.",
      answer:
        "Écart de prime : 120 €. Écart de franchise par sinistre : 400 €. Avec un sinistre : A coûte 860 €, B 580 €. B devient donc moins cher dès le premier sinistre de l’année ; sans sinistre, A est moins cher de 120 €.",
      explanation:
        "Le bon choix dépend de la probabilité de sinistre et de la capacité à payer la franchise : une épargne de précaution permet d’accepter une franchise plus élevée.",
    },
    quiz: [
      {
        id: "fp-assur-1",
        question: "Qu’est-ce que la franchise d’un contrat d’assurance ?",
        options: [
          "Le montant maximal remboursé par l’assureur.",
          "La part du sinistre qui reste à la charge de l’assuré.",
          "Une réduction accordée aux bons conducteurs.",
        ],
        answer: 1,
        explanation:
          "La franchise est déduite de l’indemnisation à chaque sinistre ; le plafond fixe le maximum remboursé.",
      },
      {
        id: "fp-assur-2",
        question:
          "Peut-on changer d’assurance emprunteur en cours de crédit immobilier ?",
        options: [
          "Non, jamais avant la fin du prêt.",
          "Oui, à tout moment depuis la loi Lemoine, avec des garanties équivalentes.",
          "Oui, mais seulement à la date anniversaire et avec des frais.",
        ],
        answer: 1,
        explanation:
          "La loi de 2022 permet la résiliation à tout moment, sans frais, sous réserve d’équivalence des garanties.",
      },
    ],
    application:
      "Liste tes contrats d’assurance, leur prime, leur franchise et leurs exclusions principales, puis repère les doublons et les risques graves non couverts.",
    idea: {
      title: "Faire le point sur mes assurances",
      description:
        "Contrats, primes, franchises, doublons et risques graves non couverts.",
    },
    sources: [
      servicePublic,
      {
        title: "France Assureurs · fiches pratiques",
        url: "https://www.franceassureurs.fr/",
      },
      {
        title: "La Médiation de l’assurance",
        url: "https://www.mediation-assurance.org/",
      },
    ],
    version: "1.0.0",
    editorialStatus,
    flashcards: [
      {
        front: "Franchise",
        back: "Part de chaque sinistre qui reste à la charge de l’assuré.",
      },
      {
        front: "Loi Lemoine",
        back: "Depuis 2022 : changer d’assurance emprunteur à tout moment, garanties équivalentes.",
      },
      {
        front: "Principe d’assurance",
        back: "Assurer les risques graves et rares ; garder les petits risques fréquents grâce à l’épargne.",
      },
    ],
  },
  {
    id: "fp-logement",
    title: "Louer ou acheter son logement",
    domain: "Finance personnelle",
    level: 2,
    minutes: 22,
    summary:
      "Acheter n’est pas toujours « mieux que jeter l’argent par les fenêtres ». Comparer le coût réel de chaque option, la durée de détention et la capacité d’emprunt.",
    skills: [
      "Coût complet de l’achat",
      "Capacité d’emprunt",
      "Comparer location et achat",
    ],
    prerequisites: ["fp-credit-taux"],
    sections: [
      {
        title: "Pourquoi apprendre ça ?",
        body: [
          "L’achat d’un logement est souvent la plus grosse décision financière d’une vie. La comparer à la location demande de compter tous les coûts, pas seulement la mensualité et le loyer.",
          "Il n’y a pas de réponse universelle : la durée pendant laquelle on garde le bien change tout.",
        ],
      },
      {
        title: "Le coût complet d’un achat",
        body: [
          "À l’achat : le prix, les frais d’acquisition (droits de mutation et rémunération du notaire, couramment autour de 7 à 8 % du prix dans l’ancien, moins dans le neuf), les frais de garantie et de dossier du crédit, d’éventuels travaux.",
          "Pendant la détention : les intérêts et l’assurance du crédit, la taxe foncière, les charges de copropriété, l’entretien et les gros travaux. La part de mensualité qui rembourse le capital n’est pas un coût : c’est une épargne forcée.",
          "À la revente : frais éventuels, et un prix incertain. L’apport immobilisé a aussi un coût d’opportunité : placé, il aurait pu rapporter.",
        ],
      },
      {
        title: "Capacité d’emprunt et comparaison",
        body: [
          "Les recommandations du Haut Conseil de stabilité financière, appliquées par les banques, limitent en règle générale le taux d’effort à 35 % des revenus nets (assurance comprise) et la durée du crédit à 25 ans, avec des dérogations encadrées. La banque regarde aussi l’apport, la stabilité des revenus et le reste à vivre.",
          "Pour comparer, on met face à face le coût annuel non récupérable du propriétaire (intérêts, assurance, taxe foncière, charges, entretien, coût d’opportunité de l’apport) et le loyer. Les frais d’acquisition, payés une fois, s’amortissent sur la durée de détention : revendre au bout de deux ou trois ans est rarement rentable.",
          "Des aides existent selon la situation (prêt à taux zéro sous conditions de ressources et de zone, prêts d’employeur) : vérifier les conditions en vigueur auprès de l’ANIL.",
        ],
      },
      {
        title: "Le point de vigilance",
        body: [
          "Une mensualité égale au loyer actuel ne signifie pas un coût égal : il faut ajouter taxe foncière, charges, entretien et frais d’achat.",
          "Garde une épargne de précaution après l’achat : un logement absorbe facilement plusieurs milliers d’euros d’imprévus, et l’apport ne doit pas vider toute la réserve.",
        ],
      },
    ],
    example: {
      title: "Exemple fictif · Inès hésite",
      body: "Inès loue 900 € par mois un appartement qu’elle pourrait acheter 220 000 €. Frais d’acquisition : environ 16 000 €. La première année, elle paierait environ 6 000 € d’intérêts, 600 € d’assurance, 1 100 € de taxe foncière, 1 200 € de charges et 1 500 € d’entretien, soit 10 400 € de coûts non récupérables, contre 10 800 € de loyer annuel. L’écart annuel, faible, mettrait des années à compenser les 16 000 € de frais d’achat : si elle prévoit de déménager dans trois ans pour son travail, louer reste plus cohérent.",
    },
    exercise: {
      prompt:
        "Un foyer gagne 4 200 € nets par mois. Avec un taux d’effort maximal de 35 %, quelle mensualité de crédit (assurance comprise) peut-il viser ? S’il a déjà 300 € de crédit auto, que reste-t-il pour le crédit immobilier ?",
      hint: "Mensualité maximale = revenus × 35 %, toutes dettes comprises.",
      answer:
        "4 200 × 35 % = 1 470 € de mensualités au total. Avec 300 € de crédit auto en cours, il reste 1 170 € pour le crédit immobilier.",
      explanation:
        "Le taux d’effort inclut toutes les mensualités de crédit : solder un petit crédit avant un projet immobilier augmente la capacité d’emprunt.",
    },
    quiz: [
      {
        id: "fp-logement-1",
        question:
          "Dans la mensualité d’un crédit immobilier, quelle part est un coût, et non une épargne ?",
        options: [
          "Toute la mensualité.",
          "Les intérêts et l’assurance ; le remboursement du capital constitue une épargne.",
          "Uniquement le capital remboursé.",
        ],
        answer: 1,
        explanation:
          "Le capital remboursé augmente la part du bien que l’on possède ; intérêts et assurance sont dépensés.",
      },
      {
        id: "fp-logement-2",
        question:
          "Pourquoi revendre un logement deux ans après l’achat est-il souvent peu rentable ?",
        options: [
          "Parce que c’est interdit avant cinq ans.",
          "Parce que les frais d’acquisition, payés au départ, n’ont pas eu le temps d’être compensés.",
          "Parce que les prix baissent toujours la première année.",
        ],
        answer: 1,
        explanation:
          "Les frais d’achat se répartissent sur la durée de détention : plus elle est courte, plus ils pèsent.",
      },
    ],
    application:
      "Pour ton logement actuel ou un projet, calcule le coût annuel non récupérable de l’achat et compare-le au loyer, puis estime la durée de détention nécessaire pour compenser les frais d’achat.",
    idea: {
      title: "Comparer louer et acheter pour mon logement",
      description:
        "Coût complet, capacité d’emprunt et durée de détention nécessaire.",
    },
    sources: [
      anil,
      servicePublic,
      {
        title: "Banque de France · Haut Conseil de stabilité financière",
        url: "https://www.banque-france.fr/",
      },
    ],
    version: "1.0.0",
    editorialStatus,
    flashcards: [
      {
        front: "Frais d’acquisition",
        back: "Droits et frais payés à l’achat, couramment 7 à 8 % du prix dans l’ancien.",
      },
      {
        front: "Taux d’effort",
        back: "Mensualités de crédit ÷ revenus nets ; 35 % maximum en règle générale.",
      },
      {
        front: "Coût d’opportunité de l’apport",
        back: "Ce que l’apport aurait pu rapporter s’il avait été placé.",
      },
    ],
  },
  {
    id: "fp-retraite",
    title: "Préparer sa retraite",
    domain: "Finance personnelle",
    level: 2,
    minutes: 20,
    summary:
      "Comment fonctionne la retraite en France, comment lire son relevé de carrière et pourquoi épargner tôt, même peu, change le résultat.",
    skills: [
      "Répartition et capitalisation",
      "Trimestres et taux plein",
      "Plan d’épargne retraite",
    ],
    prerequisites: ["fp-epargne-precaution"],
    sections: [
      {
        title: "Pourquoi apprendre ça ?",
        body: [
          "La pension est souvent inférieure au dernier revenu d’activité, et l’écart varie beaucoup selon la carrière. Le savoir tôt laisse le temps d’agir.",
          "Comprendre les règles évite aussi de mauvaises décisions : racheter des trimestres sans calcul, ou bloquer son épargne dans un produit mal adapté.",
        ],
      },
      {
        title: "Le système français",
        body: [
          "Le système obligatoire fonctionne par répartition : les cotisations des actifs financent les pensions des retraités de la même année. Un salarié du privé relève du régime de base (Assurance retraite) et d’un régime complémentaire (Agirc-Arrco), qui fonctionne par points.",
          "La pension de base dépend du salaire moyen des meilleures années, du nombre de trimestres validés et de l’âge de départ. Le taux plein s’obtient avec le nombre de trimestres requis pour sa génération, ou automatiquement à 67 ans ; partir avant avec trop peu de trimestres entraîne une décote.",
          "La réforme de 2023 relevait progressivement l’âge légal de départ. Selon les sources consultées, la loi de financement de la sécurité sociale pour 2026 suspend ce relèvement : pour les départs entre septembre 2026 et fin 2027, l’âge légal reste à 62 ans et 9 mois et la durée requise à 170 trimestres, pour les générations concernées. Ces règles évoluent : vérifie ta situation sur info-retraite.fr.",
        ],
      },
      {
        title: "Épargner pour compléter",
        body: [
          "La capitalisation consiste à épargner pour soi : l’argent placé produit des intérêts composés jusqu’à la retraite. Épargner tôt compte davantage que verser beaucoup tard.",
          "Le plan d’épargne retraite (PER), créé en 2019, permet de verser librement ; les versements volontaires sont en principe déductibles du revenu imposable dans une limite annuelle, et l’impôt est payé à la sortie. L’épargne est bloquée jusqu’à la retraite, sauf cas de déblocage anticipé (achat de la résidence principale, accidents de la vie). À la retraite, sortie en capital, en rente ou mixte selon le compartiment.",
          "D’autres supports servent aussi la retraite : assurance-vie, PEA, immobilier, épargne salariale. Le choix dépend de l’horizon, du besoin de disponibilité et de la fiscalité personnelle.",
        ],
      },
      {
        title: "Le point de vigilance",
        body: [
          "Vérifie ton relevé de carrière chaque année : des périodes oubliées (stages, emplois à l’étranger, chômage) se corrigent plus facilement tôt qu’à la veille du départ.",
          "La déduction fiscale du PER est d’autant plus intéressante que le taux marginal d’imposition est élevé ; pour un foyer peu ou pas imposé, l’avantage est faible et le blocage reste. Compare avant de verser.",
        ],
      },
    ],
    example: {
      title: "Exemple fictif · commencer à 25 ou à 45 ans",
      body: "Adam épargne 100 € par mois de 25 à 65 ans ; sa sœur Lina, 200 € par mois de 45 à 65 ans. Avec un rendement hypothétique de 4 % par an, Adam verse 48 000 € et dispose d’environ 118 000 € ; Lina verse aussi 48 000 € mais n’obtient qu’environ 73 000 €. Le temps a fait la différence, pas le montant versé. Les rendements futurs ne sont jamais garantis : ces chiffres illustrent seulement l’effet de la durée.",
    },
    exercise: {
      prompt:
        "Une personne a un taux marginal d’imposition de 30 %. Elle verse 2 000 € sur un PER, déductibles de son revenu imposable. Quelle économie d’impôt immédiate ? Que se passe-t-il à la sortie ?",
      hint: "Économie = versement × taux marginal.",
      answer:
        "Économie : 2 000 × 30 % = 600 €. À la sortie en capital, la part correspondant aux versements déduits est imposée au barème de l’impôt sur le revenu, et les gains selon leur propre fiscalité : l’impôt est différé, pas supprimé.",
      explanation:
        "L’intérêt du PER dépend de l’écart entre le taux marginal pendant la vie active et celui à la retraite, et de l’acceptation du blocage.",
    },
    quiz: [
      {
        id: "fp-retraite-1",
        question: "Que signifie un système de retraite « par répartition » ?",
        options: [
          "Chacun épargne pour sa propre retraite sur un compte personnel.",
          "Les cotisations des actifs financent les pensions des retraités de la même période.",
          "La retraite est payée uniquement par l’État grâce à l’impôt.",
        ],
        answer: 1,
        explanation:
          "La répartition repose sur la solidarité entre générations ; la capitalisation, sur l’épargne individuelle placée.",
      },
      {
        id: "fp-retraite-2",
        question:
          "Pourquoi commencer à épargner tôt pour sa retraite, même avec de petites sommes ?",
        options: [
          "Parce que les taux d’intérêt sont plus élevés pour les jeunes.",
          "Parce que les intérêts composés ont plus de temps pour produire leurs effets.",
          "Parce que c’est obligatoire avant 30 ans.",
        ],
        answer: 1,
        explanation:
          "Sur une longue durée, les intérêts produisent eux-mêmes des intérêts : le temps compte autant que le montant.",
      },
    ],
    application:
      "Crée ton compte sur info-retraite.fr, vérifie ton relevé de carrière et note ton estimation de pension et les trimestres qui manquent.",
    idea: {
      title: "Faire le point sur ma retraite",
      description:
        "Relevé de carrière vérifié, estimation de pension et premier montant d’épargne régulière.",
    },
    sources: [infoRetraite, servicePublic, impots],
    version: "1.0.0",
    editorialStatus,
    flashcards: [
      {
        front: "Répartition",
        back: "Les cotisations des actifs paient les pensions des retraités de la même période.",
      },
      {
        front: "Taux plein",
        back: "Pension sans décote : trimestres requis pour sa génération, ou âge de 67 ans.",
      },
      {
        front: "PER",
        back: "Épargne retraite bloquée ; versements en principe déductibles, impôt payé à la sortie.",
      },
    ],
  },
];
