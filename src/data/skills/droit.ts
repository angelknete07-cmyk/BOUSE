import type { SkillContent } from "./types";

/** Droit du quotidien : les compétences sans leçon longue. */
export const skills: SkillContent[] = [
  {
    id: "dro-contrat",
    idea: [
      "Un contrat est une promesse écrite : en signant, tu es engagé. Personne ne te force à le lire, mais personne ne t’écoutera dire « je n’avais pas vu » après coup. Lire avant de signer est ta meilleure protection.",
      "Cherche d’abord les points qui coûtent de l’argent ou t’enferment : le prix total, la durée, la façon d’arrêter (préavis, frais de résiliation), la reconduction automatique et les pénalités. Les phrases écrites en petits caractères comptent autant que les grosses.",
      "Si une clause est floue, demande une explication par écrit, ou fais-la modifier avant de signer. Un contrat important (travail, logement, prêt) peut se faire relire par un proche ou un professionnel.",
    ],
    keys: [
      "Ta signature t’engage : lis tout avant de signer.",
      "Repère le prix total, la durée et la façon d’arrêter.",
      "Méfie-toi de la reconduction automatique et des pénalités.",
      "Une clause floue se fait expliquer ou modifier avant la signature.",
    ],
    gesture: {
      intro:
        "Avant chaque signature, remplis cette checklist avec le contrat sous les yeux. Si une case reste vide, pose la question avant de signer.",
      fields: [
        {
          label: "Qui s’engage envers qui ?",
          example: "Moi et la société Fibre+",
        },
        { label: "Prix total et fréquence", example: "29,99 € par mois" },
        { label: "Durée de l’engagement", example: "24 mois" },
        {
          label: "Comment arrêter (préavis, frais)",
          example: "lettre recommandée, 1 mois de préavis",
        },
        { label: "Reconduction automatique ?", example: "oui, pour 12 mois" },
        {
          label: "Pénalités ou clauses qui m’inquiètent",
          example: "frais de 50 € si retard",
        },
      ],
      tip: "Photographie le contrat signé et garde-le : tu en auras besoin le jour où tu voudras l’arrêter.",
    },
    check: [
      {
        q: "Tu signes un contrat sans l’avoir lu. Que se passe-t-il en général ?",
        options: [
          "Tu es quand même engagé par ce que tu as signé",
          "Le contrat est automatiquement annulé",
          "Seule l’autre partie est engagée",
        ],
        answer: 0,
        why: "Ta signature vaut accord : ne pas avoir lu ne te dégage pas.",
      },
      {
        q: "Quelle information est essentielle à repérer avant de signer ?",
        options: [
          "La couleur du logo",
          "Le prix total, la durée et la façon d’arrêter",
          "Le nombre de pages",
        ],
        answer: 1,
        why: "Ces trois points décident de ce que le contrat te coûte et de ta liberté d’en sortir.",
      },
      {
        q: "Une clause est floue. Que fais-tu ?",
        options: [
          "Tu signes, on verra plus tard",
          "Tu demandes une explication écrite ou une modification avant de signer",
          "Tu signes en barrant la clause toi-même",
        ],
        answer: 1,
        why: "Une clause floue se clarifie avant la signature, par écrit pour en garder la preuve.",
      },
    ],
  },
  {
    id: "dro-conso",
    idea: [
      "Quand tu achètes à un professionnel, la loi te protège. Pour un achat fait à distance (sur Internet, par téléphone), tu as en général un droit de rétractation : tu peux changer d’avis et renvoyer le produit. Le délai et les exceptions sont indiqués sur service-public.fr.",
      "Un produit neuf qui ne fonctionne pas ou n’est pas conforme à ce qui était promis est couvert par la garantie légale de conformité, que le vendeur doit respecter. Tu peux demander une réparation, un remplacement ou un remboursement selon les cas.",
      "Pour réclamer, commence par écrire au vendeur : un courrier ou un mail clair, avec les faits, ta demande et la preuve d’achat. Garde toujours une trace de tes échanges.",
    ],
    keys: [
      "Un achat à distance permet souvent de se rétracter.",
      "La garantie légale de conformité protège contre un produit défectueux.",
      "Garde la preuve d’achat et les échanges écrits.",
      "En cas de doute sur un délai, vérifie sur service-public.fr.",
    ],
    gesture: {
      intro:
        "Remplis cette lettre de réclamation pour demander réparation, remplacement ou remboursement. Un écrit précis est plus efficace qu’un appel.",
      fields: [
        {
          label: "Mon nom et mon adresse",
          example: "Léa Martin, 12 rue des Lilas, Lyon",
        },
        {
          label: "Le produit et la date d’achat",
          example: "aspirateur X200, acheté le 3 mars",
        },
        {
          label: "Le problème constaté",
          example: "il s’éteint après 5 minutes",
        },
        {
          label: "Ce que je demande",
          example: "un remplacement ou un remboursement",
        },
        {
          label: "Les pièces jointes",
          example: "facture, photo, capture d’écran",
        },
        { label: "Le délai que je laisse pour répondre", example: "15 jours" },
      ],
      tip: "Reste factuel et poli. Envoie en recommandé avec accusé de réception si l’enjeu est important.",
    },
    check: [
      {
        q: "Tu as acheté un objet sur Internet et tu changes d’avis. En général, tu peux :",
        options: [
          "rien faire, un achat est définitif",
          "utiliser ton droit de rétractation à distance, dans le délai prévu",
          "exiger un remboursement dix ans plus tard",
        ],
        answer: 1,
        why: "Les achats à distance ouvrent en général un droit de rétractation, dans un délai à vérifier sur service-public.fr.",
      },
      {
        q: "Ton appareil neuf ne marche pas comme annoncé. Quelle protection s’applique ?",
        options: [
          "La garantie légale de conformité",
          "Aucune, sauf si tu as payé une option",
          "Seulement le bon vouloir du vendeur",
        ],
        answer: 0,
        why: "La garantie légale de conformité s’applique automatiquement, sans option payante.",
      },
      {
        q: "Quelle est la première bonne démarche pour réclamer ?",
        options: [
          "Poster un avis rageur",
          "Écrire au vendeur avec les faits, ta demande et la preuve d’achat",
          "Attendre que le vendeur t’appelle",
        ],
        answer: 1,
        why: "Un écrit précis, avec preuve, est la base de toute réclamation.",
      },
    ],
  },
  {
    id: "dro-bail",
    idea: [
      "Un bail est le contrat entre un propriétaire (le bailleur) et un locataire. Il fixe le loyer, les charges, la durée et l’état du logement. Tu le lis comme n’importe quel contrat : ce que tu paies, jusqu’à quand, et comment tu peux partir.",
      "Deux documents protègent les deux côtés : l’état des lieux d’entrée et celui de sortie. Écrits et signés ensemble, ils comparent l’état du logement au début et à la fin. Sans eux, il est difficile de prouver qui a abîmé quoi.",
      "Le locataire paie son loyer, entretient le logement et le rend en bon état. Le propriétaire fournit un logement décent et fait les grosses réparations. Pour les délais de préavis ou le dépôt de garantie, vérifie sur service-public.fr : ils dépendent du type de logement.",
    ],
    keys: [
      "Le bail fixe loyer, charges, durée et conditions de départ.",
      "L’état des lieux d’entrée et de sortie se font par écrit.",
      "Le locataire entretient ; le propriétaire garantit un logement décent.",
      "Pour le préavis et le dépôt de garantie, consulte service-public.fr.",
    ],
    gesture: {
      intro:
        "Remplis cette fiche d’état des lieux pour ton logement, pièce par pièce. Ajoute des photos datées : elles valent des preuves.",
      fields: [
        { label: "Pièce concernée", example: "salon" },
        {
          label: "Murs et plafond",
          example: "propres, une trace près de la fenêtre",
        },
        { label: "Sol", example: "parquet en bon état" },
        { label: "Fenêtres et volets", example: "ferment bien" },
        {
          label: "Équipements (prises, chauffage…)",
          example: "tout fonctionne",
        },
        { label: "Photos prises le", example: "1er septembre" },
      ],
      tip: "Note tout défaut dès l’entrée, même petit : c’est ce qui t’évitera de payer pour un dommage que tu n’as pas fait.",
    },
    check: [
      {
        q: "À quoi sert l’état des lieux d’entrée ?",
        options: [
          "À fixer le montant du loyer",
          "À prouver l’état du logement au début de la location",
          "À remplacer le bail",
        ],
        answer: 1,
        why: "Il sert de point de comparaison avec l’état des lieux de sortie.",
      },
      {
        q: "Qui entretient le logement au quotidien ?",
        options: [
          "Le locataire, pour l’entretien courant",
          "Toujours le propriétaire",
          "Le voisin",
        ],
        answer: 0,
        why: "Le locataire assure l’entretien courant ; les grosses réparations restent au propriétaire.",
      },
      {
        q: "Tu veux connaître ton délai de préavis. Que fais-tu ?",
        options: [
          "Tu inventes un délai",
          "Tu lis ton bail et tu vérifies sur service-public.fr",
          "Tu pars sans rien dire",
        ],
        answer: 1,
        why: "Le préavis dépend du type de logement : on le lit dans le bail et on le vérifie sur la source officielle.",
      },
    ],
  },
  {
    id: "dro-travail",
    idea: [
      "Le droit du travail protège le salarié. Ton contrat de travail précise ton poste, ta rémunération, ta durée de travail et la date de début. Tu as aussi droit à un repos et à des congés payés : ils s’accumulent au fil des mois travaillés.",
      "Les règles exactes (durée légale, heures supplémentaires, préavis, congés) dépendent de ton contrat, de ta convention collective (les règles de ta branche) et de ta situation. Retiens le réflexe : tout ce qui est important se lit dans ton contrat et sur service-public.fr.",
      "Le licenciement n’est pas libre : l’employeur doit respecter une procédure et avoir un motif valable. En cas de doute, ne signe rien dans l’urgence et demande conseil, par exemple à un syndicat ou à l’inspection du travail.",
    ],
    keys: [
      "Ton contrat de travail fixe poste, rémunération et durée de travail.",
      "Les congés payés s’accumulent au fil du travail.",
      "Convention collective et service-public.fr donnent les règles exactes.",
      "Un licenciement suit une procédure : ne signe rien dans l’urgence.",
    ],
    gesture: {
      intro:
        "Fais la fiche de ton contrat de travail. En la remplissant, tu repères ce que tu dois vérifier ou faire préciser.",
      fields: [
        { label: "Type de contrat", example: "CDI" },
        {
          label: "Poste et lieu de travail",
          example: "vendeuse, boutique de Nantes",
        },
        { label: "Durée de travail par semaine", example: "35 heures" },
        { label: "Rémunération brute", example: "1 900 € par mois" },
        {
          label: "Convention collective applicable",
          example: "commerce de détail",
        },
        { label: "Période d’essai", example: "2 mois" },
      ],
      tip: "Si une case reste vide dans ton contrat, demande à ton employeur de la préciser par écrit.",
    },
    check: [
      {
        q: "Où trouver les règles précises de ton emploi ?",
        options: [
          "Uniquement dans le bouche-à-oreille",
          "Dans ton contrat, ta convention collective et service-public.fr",
          "Sur un forum anonyme",
        ],
        answer: 1,
        why: "Les règles varient selon ta situation : le contrat et les sources officielles font foi.",
      },
      {
        q: "Un employeur peut-il te licencier sans aucune procédure ?",
        options: [
          "Oui, il fait ce qu’il veut",
          "Non, il doit respecter une procédure et un motif valable",
          "Oui, mais seulement le vendredi",
        ],
        answer: 1,
        why: "Le licenciement est encadré : procédure et motif sont obligatoires.",
      },
      {
        q: "On te tend un document important à signer tout de suite. Que fais-tu ?",
        options: [
          "Tu signes pour être tranquille",
          "Tu prends le temps de le lire et de demander conseil",
          "Tu le jettes",
        ],
        answer: 1,
        why: "Une signature sous pression peut t’engager : prends le temps de lire et de te renseigner.",
      },
    ],
  },
  {
    id: "dro-litige",
    idea: [
      "Un litige est un désaccord qu’on n’arrive pas à régler à l’amiable. Avant de penser au tribunal, il y a des étapes simples : d’abord un échange écrit avec l’autre partie, ensuite une mise en demeure si elle ne répond pas.",
      "La mise en demeure est une lettre qui demande clairement de faire quelque chose (payer, livrer, réparer) avant une date précise. Elle se fait en général en recommandé avec accusé de réception pour garder la preuve. C’est souvent suffisant pour débloquer une situation.",
      "Si rien ne bouge, tu peux passer par un médiateur, gratuit pour les litiges de consommation, avant le tribunal. Pour le tribunal et les délais exacts, vérifie sur service-public.fr ou demande conseil à un professionnel.",
    ],
    keys: [
      "D’abord un écrit amiable, ensuite la mise en demeure.",
      "La mise en demeure fixe une demande et une date limite.",
      "Envoie-la en recommandé avec accusé de réception.",
      "Un médiateur peut régler un litige sans aller au tribunal.",
    ],
    gesture: {
      intro:
        "Remplis ce modèle de mise en demeure. Reste factuel : des faits, une demande claire, une date limite, sans insultes.",
      fields: [
        {
          label: "Mon nom et mon adresse",
          example: "Léa Martin, 12 rue des Lilas, Lyon",
        },
        {
          label: "Nom et adresse de l’autre partie",
          example: "Société Meubles Dupont, Dijon",
        },
        {
          label: "Les faits (dates, montants)",
          example: "canapé commandé le 3 mars, payé 600 €, jamais livré",
        },
        {
          label: "Ce que je demande",
          example: "la livraison ou le remboursement de 600 €",
        },
        {
          label: "Date limite pour répondre",
          example: "dans 8 jours à réception",
        },
        {
          label: "Mes pièces jointes",
          example: "bon de commande, preuve de paiement",
        },
      ],
      tip: "Garde une copie de la lettre, le récépissé du recommandé et l’accusé de réception : ce sont tes preuves.",
    },
    check: [
      {
        q: "Qu’est-ce qu’une mise en demeure ?",
        options: [
          "Une lettre qui demande clairement de faire quelque chose avant une date limite",
          "Un jugement du tribunal",
          "Un reçu de paiement",
        ],
        answer: 0,
        why: "C’est un courrier qui somme l’autre partie d’agir dans un délai précis.",
      },
      {
        q: "Pourquoi l’envoyer en recommandé avec accusé de réception ?",
        options: [
          "Pour que la lettre arrive plus vite",
          "Pour garder la preuve de l’envoi et de la réception",
          "Parce que c’est gratuit",
        ],
        answer: 1,
        why: "Le recommandé prouve que l’autre a bien reçu ta demande, et quand.",
      },
      {
        q: "Avant d’aller au tribunal, qu’est-ce qui peut aider à régler un litige de consommation ?",
        options: ["Un médiateur", "Un influenceur", "Un avis sur Internet"],
        answer: 0,
        why: "La médiation est une étape gratuite, prévue pour éviter le tribunal.",
      },
    ],
  },
  {
    id: "dro-entreprise",
    idea: [
      "Quand tu as une activité (même petite), la loi te demande d’être transparent. Sur ton site, tes devis et tes factures, certaines informations doivent apparaître : qui tu es, ton adresse, ton numéro d’identification, tes prix. On les appelle les mentions obligatoires.",
      "Si tu collectes des données sur des personnes (nom, e-mail, adresse), le RGPD s’applique. Ce règlement européen te demande de dire pourquoi tu les gardes, de ne garder que le nécessaire, de les protéger et de les supprimer sur demande.",
      "Enfin, tu es responsable de ce que tu vends : si ton produit ou ton service cause un dommage, c’est toi qu’on peut tenir pour responsable. Une assurance adaptée et des conditions claires te protègent. Pour les détails de ton activité, vérifie sur service-public.fr.",
    ],
    keys: [
      "Site, devis et factures portent des mentions obligatoires.",
      "Le RGPD protège les données personnelles de tes clients.",
      "Ne garde que les données dont tu as besoin, et protège-les.",
      "Tu es responsable de ce que tu vends : pense à l’assurance.",
    ],
    gesture: {
      intro:
        "Fais la checklist de ton activité. Elle t’aide à vérifier que les points essentiels de transparence et de protection sont couverts.",
      fields: [
        { label: "Mon nom ou ma raison sociale", example: "Atelier Martin" },
        {
          label: "Mon numéro d’identification (SIRET)",
          example: "à indiquer sur mes devis et factures",
        },
        {
          label: "Les données que je collecte",
          example: "nom et e-mail des clients",
        },
        { label: "Pourquoi je les garde", example: "envoyer la facture" },
        {
          label: "Où elles sont stockées et protégées",
          example: "logiciel avec mot de passe",
        },
        {
          label: "Mon assurance d’activité",
          example: "responsabilité civile professionnelle",
        },
      ],
      tip: "Un doute sur tes obligations ? Consulte service-public.fr ou demande à un professionnel du droit ou de la comptabilité.",
    },
    check: [
      {
        q: "À quoi servent les mentions obligatoires ?",
        options: [
          "À décorer les documents",
          "À informer clairement sur qui vend et à quel prix",
          "À augmenter les prix",
        ],
        answer: 1,
        why: "Elles garantissent la transparence envers les clients.",
      },
      {
        q: "Tu collectes les e-mails de tes clients. Que dit le RGPD ?",
        options: [
          "Tu peux tout garder indéfiniment",
          "Tu ne gardes que le nécessaire et tu les protèges",
          "Tu les vends à qui veut",
        ],
        answer: 1,
        why: "Le RGPD demande de limiter les données au nécessaire et de les protéger.",
      },
      {
        q: "Ton produit cause un dommage à un client. Qui peut être responsable ?",
        options: [
          "Personne",
          "Toi, en tant que vendeur",
          "Uniquement le client",
        ],
        answer: 1,
        why: "Le vendeur répond de ce qu’il vend, d’où l’intérêt d’une assurance adaptée.",
      },
    ],
  },
];
