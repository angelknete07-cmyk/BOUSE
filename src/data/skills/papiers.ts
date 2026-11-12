import type { SkillContent } from "./types";

/** Papiers et administratif : les compétences sans leçon longue. */
export const skills: SkillContent[] = [
  {
    id: "pap-ranger",
    idea: [
      "Un bon classement te fait gagner des heures le jour où tu cherches un document en urgence. Le principe : peu de dossiers, des noms clairs. Par exemple : identité, logement, travail, impôts, santé, banque, assurances.",
      "Tous les papiers ne se gardent pas aussi longtemps. Les fiches de paie, les documents de retraite, ceux de propriété et d’identité se gardent très longtemps, voire toute la vie. Les factures courantes et les relevés se gardent moins : vérifie les durées à jour sur service-public.fr.",
      "Tu peux classer en papier, en numérique, ou les deux. En numérique, scanne avec ton téléphone, donne un nom clair au fichier (par exemple « 2026-10 facture électricité ») et fais une copie de sauvegarde ailleurs.",
    ],
    keys: [
      "Peu de dossiers, des noms clairs.",
      "Fiches de paie, retraite, propriété et identité : à garder très longtemps.",
      "Pour les autres papiers, vérifie la durée sur service-public.fr.",
      "Un classeur numérique a besoin d’une sauvegarde.",
    ],
    gesture: {
      intro:
        "Dessine ton classeur : les dossiers que tu vas créer, et ce que tu mets dedans. Tu peux le faire sur papier ou sur ton ordinateur.",
      fields: [
        {
          label: "Mes dossiers principaux",
          example: "identité, logement, travail, impôts, santé, banque",
        },
        {
          label: "Documents à garder à vie",
          example: "fiches de paie, diplômes, contrats de travail",
        },
        {
          label: "Documents à garder quelques années",
          example: "factures, quittances de loyer",
        },
        {
          label: "Papier, numérique ou les deux",
          example: "les deux : classeur + scan sur le téléphone",
        },
        {
          label: "Règle de nommage des fichiers",
          example: "année-mois + nom (2026-10 facture électricité)",
        },
        {
          label: "Où est la sauvegarde",
          example: "une clé USB rangée chez moi",
        },
      ],
      tip: "Fais un tri une fois par an à date fixe : c’est le moment de jeter ce qui n’a plus besoin d’être gardé.",
    },
    check: [
      {
        q: "Quels papiers faut-il garder très longtemps ?",
        options: [
          "Les tickets de caisse",
          "Les fiches de paie",
          "Les publicités reçues",
        ],
        answer: 1,
        why: "Les fiches de paie servent à prouver tes droits à la retraite : on les garde toute sa vie.",
      },
      {
        q: "Pour un classement numérique, il faut aussi :",
        options: [
          "Rien de plus",
          "Une copie de sauvegarde ailleurs",
          "Tout imprimer",
        ],
        answer: 1,
        why: "Un seul exemplaire peut disparaître avec un téléphone cassé ou perdu.",
      },
      {
        q: "Un bon classement, c’est :",
        options: [
          "Plein de petits dossiers aux noms variés",
          "Peu de dossiers, avec des noms clairs",
          "Tout mélanger dans une seule boîte",
        ],
        answer: 1,
        why: "Moins de dossiers et des noms simples permettent de retrouver un papier vite.",
      },
    ],
  },
  {
    id: "pap-espaces-en-ligne",
    idea: [
      "L’administration française a ses sites officiels : impots.gouv.fr pour les impôts, ameli.fr pour la santé, caf.fr pour les aides au logement et familiales, francetravail.fr pour le chômage et l’emploi. Chaque site a son propre compte.",
      "Pour t’y connecter plus simplement, il existe FranceConnect : un seul compte (par exemple celui des impôts) donne accès aux autres. C’est pratique, mais garde bien tes identifiants en sécurité.",
      "Attention aux faux sites : ils imitent l’administration pour voler tes informations. Tape toi-même l’adresse du site ou utilise ses applications officielles, et ne clique jamais sur un lien reçu dans un message qui te demande ton mot de passe.",
    ],
    keys: [
      "Un site officiel par sujet : impôts, santé, aides, emploi.",
      "FranceConnect évite de créer un compte par site.",
      "Écris l’adresse du site toi-même, ne passe pas par un message.",
      "Aucune administration ne te demande ton mot de passe par message.",
    ],
    gesture: {
      intro:
        "Dresse la liste de tes comptes publics, sans y écrire de mot de passe. Note seulement ce qui t’aide à te retrouver : quel site, quel identifiant, où est le secret rangé.",
      fields: [
        {
          label: "Impôts (impots.gouv.fr)",
          example:
            "identifiant = numéro fiscal ; mot de passe dans mon gestionnaire",
        },
        { label: "Santé (ameli.fr)", example: "compte créé, appli installée" },
        { label: "Aides (caf.fr)", example: "à créer si besoin" },
        {
          label: "Emploi (francetravail.fr)",
          example: "identifiant noté, mot de passe dans le gestionnaire",
        },
        {
          label: "Utilise FranceConnect ?",
          example: "oui, avec le compte des impôts",
        },
        {
          label: "Où sont rangés les mots de passe",
          example: "gestionnaire de mots de passe",
        },
      ],
      tip: "N’écris jamais tes mots de passe dans cette liste : note seulement où ils sont rangés.",
    },
    check: [
      {
        q: "Quel site officiel sert à gérer ses impôts ?",
        options: [
          "impots.gouv.fr",
          "impots-rapide.com",
          "Celui d’un lien reçu par SMS",
        ],
        answer: 0,
        why: "Les sites de l’administration se terminent par .gouv.fr ; les autres peuvent être des faux.",
      },
      {
        q: "À quoi sert FranceConnect ?",
        options: [
          "À se connecter à plusieurs services publics avec un seul compte",
          "À payer ses impôts en retard",
          "À supprimer ses données",
        ],
        answer: 0,
        why: "FranceConnect relie plusieurs services publics à un compte que tu possèdes déjà.",
      },
      {
        q: "Un message te demande ton mot de passe ameli pour « finir ton dossier » :",
        options: [
          "Tu le donnes vite avant que ça expire",
          "Tu l’ignores et tu vas directement sur le site officiel",
          "Tu réponds avec ton numéro de carte",
        ],
        answer: 1,
        why: "Les administrations ne demandent jamais ton mot de passe par message : c’est une arnaque.",
      },
    ],
  },
  {
    id: "pap-declarer-revenus",
    idea: [
      "Chaque année, tu déclares tes revenus de l’année précédente à l’administration fiscale. Cela se fait en ligne sur impots.gouv.fr : tu te connectes, et la déclaration arrive déjà pré-remplie avec la plupart des informations envoyées par ton employeur, la CAF ou France Travail.",
      "Ton rôle : vérifier que tout est exact et compléter ce qui manque, par exemple des revenus que l’administration ne connaît pas, ou des frais que tu veux déduire. Compare avec tes documents : fiches de paie de décembre, attestations, relevés.",
      "Les dates limites changent chaque année : consulte-les sur impots.gouv.fr. Si tu fais une erreur, tu peux souvent la corriger en ligne. Et même si tu es à zéro impôt, tu dois déclarer : cela sert à toucher certaines aides.",
    ],
    keys: [
      "La déclaration se fait chaque année, en ligne, sur impots.gouv.fr.",
      "Elle est pré-remplie : tu vérifies et tu complètes.",
      "Vérifie les dates limites de l’année sur impots.gouv.fr.",
      "Même sans impôt à payer, on déclare.",
    ],
    gesture: {
      intro:
        "Prépare ta déclaration avant d’ouvrir le site : rassemble les pièces, puis suis les étapes dans l’ordre. Les montants sont des exemples.",
      fields: [
        {
          label: "Date limite (vérifiée sur impots.gouv.fr)",
          example: "à noter dans mon agenda",
        },
        {
          label: "Revenus pré-remplis à vérifier",
          example: "salaires : total de ma fiche de paie de décembre",
        },
        {
          label: "Revenus à ajouter",
          example: "petit job d’été non déclaré par l’employeur",
        },
        {
          label: "Frais ou dons à déclarer",
          example: "dons à une association : 100 €",
        },
        {
          label: "Situation de famille à jour",
          example: "célibataire, 0 enfant",
        },
        {
          label: "Résultat affiché avant validation",
          example: "impôt estimé, à relire",
        },
        {
          label: "Preuve de validation conservée",
          example: "accusé de réception enregistré",
        },
      ],
      tip: "Fais la déclaration quelques jours avant la date limite, pas le dernier soir.",
    },
    check: [
      {
        q: "Que veut dire « déclaration pré-remplie » ?",
        options: [
          "Tu n’as rien à vérifier",
          "L’administration y a déjà mis la plupart de tes revenus connus",
          "Elle est valable pour toujours",
        ],
        answer: 1,
        why: "Les revenus connus sont déjà inscrits, mais c’est à toi de vérifier qu’ils sont justes et complets.",
      },
      {
        q: "Tu ne dois pas d’impôt cette année. Que fais-tu ?",
        options: [
          "Je déclare quand même",
          "Je ne déclare pas",
          "J’attends qu’on me relance",
        ],
        answer: 0,
        why: "La déclaration reste obligatoire et sert aussi à ouvrir des droits à certaines aides.",
      },
      {
        q: "Où trouver la date limite de cette année ?",
        options: [
          "Sur impots.gouv.fr",
          "Elle ne change jamais",
          "Sur un forum",
        ],
        answer: 0,
        why: "Les dates changent chaque année : seul le site officiel est fiable.",
      },
    ],
  },
  {
    id: "pap-aides",
    idea: [
      "Beaucoup de gens n’obtiennent pas des aides auxquelles ils ont droit, simplement parce qu’ils ne savent pas qu’elles existent. Parmi les plus connues : l’APL (aide au logement), la prime d’activité (un complément pour les salaires modestes) et le chèque énergie (une aide pour les factures d’énergie).",
      "Chaque aide a ses conditions : revenus, situation de famille, logement. Pour savoir à quoi tu as droit, utilise le simulateur officiel mesdroitssociaux.gouv.fr : tu réponds à des questions et il te montre les aides possibles.",
      "Les montants et les seuils changent souvent : vérifie-les sur le site officiel ou celui de la CAF. Et méfie-toi des sites qui te promettent « toutes les aides » contre de l’argent : l’information officielle est gratuite.",
    ],
    keys: [
      "Beaucoup d’aides existent : APL, prime d’activité, chèque énergie…",
      "Le simulateur officiel est mesdroitssociaux.gouv.fr, gratuit.",
      "Conditions et montants changent : vérifie sur le site officiel.",
      "N’achète jamais un service qui promet « toutes tes aides ».",
    ],
    gesture: {
      intro:
        "Fais le tour de tes droits : pour chaque aide, note si tu y as droit, si tu l’as demandée, et ce qu’il te reste à faire.",
      fields: [
        {
          label: "Aide au logement (APL)",
          example: "à simuler, location depuis 6 mois",
        },
        {
          label: "Prime d’activité",
          example: "à simuler, salaire proche du Smic",
        },
        {
          label: "Chèque énergie",
          example: "reçu automatiquement en cas d’éligibilité",
        },
        {
          label: "Autres aides possibles",
          example: "aide de ma région pour le permis",
        },
        { label: "Simulation faite le", example: "date du jour" },
        {
          label: "Démarche à lancer en premier",
          example: "dossier APL sur caf.fr",
        },
      ],
      tip: "Refais cette simulation à chaque changement : salaire, logement, naissance, perte d’emploi.",
    },
    check: [
      {
        q: "Quel est le bon outil pour connaître ses droits ?",
        options: [
          "Un site payant qui promet « toutes les aides »",
          "Le simulateur officiel mesdroitssociaux.gouv.fr",
          "Une publicité sur un réseau social",
        ],
        answer: 1,
        why: "Le simulateur officiel est gratuit et fiable ; les offres payantes vendent souvent une information gratuite.",
      },
      {
        q: "Pourquoi refaire sa simulation après un changement de situation ?",
        options: [
          "Les droits dépendent de ta situation, qui change",
          "Pour recevoir un cadeau",
          "Ce n’est jamais utile",
        ],
        answer: 0,
        why: "Un changement de salaire, de logement ou de famille peut ouvrir ou fermer des droits.",
      },
      {
        q: "La prime d’activité, c’est :",
        options: [
          "Une aide qui complète les revenus d’un travail modeste",
          "Un impôt",
          "Une indemnité de chômage",
        ],
        answer: 0,
        why: "La prime d’activité est un complément versé à ceux qui travaillent avec des revenus modestes.",
      },
    ],
  },
  {
    id: "pap-courrier-officiel",
    idea: [
      "Quand une administration ou une entreprise commet une erreur, tu peux réclamer. Une lettre claire, courte et polie marche mieux qu’une lettre énervée. Elle explique les faits, dit ce que tu demandes, et donne un délai.",
      "Une bonne lettre contient : tes coordonnées, la date, la référence du dossier, les faits dans l’ordre, ce que tu demandes précisément, et les pièces jointes. Garde toujours une copie.",
      "Envoie-la en recommandé avec accusé de réception pour avoir une preuve de l’envoi, surtout pour une contestation importante. Respecte le délai indiqué dans le courrier que tu contestes : c’est souvent écrit en bas de la lettre.",
    ],
    keys: [
      "Courte, claire, polie : une réclamation efficace.",
      "Mets la référence du dossier et la demande précise.",
      "Garde une copie et joins les preuves.",
      "Le recommandé donne une preuve d’envoi ; respecte le délai de contestation indiqué.",
    ],
    gesture: {
      intro:
        "Remplis ce modèle pour écrire ta lettre de réclamation. Chaque case devient une partie de la lettre.",
      fields: [
        {
          label: "À qui j’écris, et à quelle adresse",
          example: "Service des impôts des particuliers de ma ville",
        },
        {
          label: "Référence du dossier ou du courrier",
          example: "n° fiscal ou n° de dossier",
        },
        {
          label: "Les faits, avec les dates",
          example:
            "Le 5 mars, j’ai reçu un avis indiquant 300 € de plus qu’attendu.",
        },
        {
          label: "Ce que je demande précisément",
          example: "Je demande la correction de mon avis.",
        },
        {
          label: "Pièces jointes",
          example: "copie de l’avis, copie de mon justificatif",
        },
        { label: "Délai de réponse demandé", example: "sous 30 jours" },
      ],
      tip: "Reste factuel : une phrase par fait, sans reproche. Garde une copie datée de la lettre.",
    },
    check: [
      {
        q: "Qu’est-ce qui rend une lettre de réclamation efficace ?",
        options: [
          "Des faits clairs et une demande précise",
          "Un ton énervé",
          "Un texte très long",
        ],
        answer: 0,
        why: "Une lettre courte avec des faits et une demande claire est plus facile à traiter.",
      },
      {
        q: "Pourquoi envoyer un recommandé avec accusé de réception ?",
        options: [
          "Pour obtenir une preuve de l’envoi",
          "Pour accélérer la réponse à coup sûr",
          "Pour ne pas avoir à écrire de lettre",
        ],
        answer: 0,
        why: "L’accusé de réception prouve que ta lettre a été envoyée et reçue.",
      },
      {
        q: "Quel détail ne faut-il pas oublier ?",
        options: [
          "La référence du dossier",
          "Le prénom du facteur",
          "Une photo",
        ],
        answer: 0,
        why: "La référence permet à l’administration de retrouver ton dossier tout de suite.",
      },
    ],
  },
  {
    id: "pap-reduire-impot",
    idea: [
      "Réduire son impôt, c’est utiliser les règles prévues par la loi : pas tricher. Certains dons à des associations, par exemple, donnent droit à une réduction d’impôt. Les dépenses d’emploi à domicile (ménage, garde d’enfants, soutien scolaire) peuvent aussi donner droit à un crédit ou une réduction d’impôt, selon les cas.",
      "Autre choix : les frais réels. Par défaut, l’administration applique une déduction forfaitaire pour tes frais de travail. Si tes frais réels (trajets, repas…) sont plus élevés, tu peux les déclarer à la place, avec des justificatifs.",
      "Les règles, taux et plafonds changent d’une année à l’autre : vérifie-les sur impots.gouv.fr avant de te lancer. Et ne dépense jamais de l’argent uniquement pour payer moins d’impôt : une réduction rend une partie de la somme, pas la totalité.",
    ],
    keys: [
      "Les dons et l’emploi à domicile peuvent donner une réduction ou un crédit d’impôt.",
      "Les frais réels remplacent la déduction forfaitaire si tes frais sont plus élevés.",
      "Garde tous les justificatifs.",
      "Règles et plafonds changent : vérifie sur impots.gouv.fr.",
      "Une réduction ne rembourse pas la totalité de la dépense.",
    ],
    gesture: {
      intro:
        "Liste ce que tu pourrais déclarer. Pour chaque ligne, note le montant et le justificatif dont tu disposes.",
      fields: [
        {
          label: "Dons à des associations",
          example: "100 €, reçu fiscal reçu",
        },
        {
          label: "Emploi à domicile",
          example: "ménage : 600 € sur l’année, attestation de l’organisme",
        },
        {
          label: "Frais réels possibles",
          example: "trajets domicile-travail : à calculer et à comparer",
        },
        {
          label: "Justificatifs à retrouver",
          example: "reçus, factures, attestations",
        },
        {
          label: "Règles à vérifier sur impots.gouv.fr",
          example: "taux et plafonds de l’année",
        },
        {
          label: "Décision",
          example: "je déclare les dons et l’emploi à domicile",
        },
      ],
      tip: "Sans justificatif, une déduction n’est pas valable : garde les papiers au moins le temps indiqué sur service-public.fr.",
    },
    check: [
      {
        q: "Quand les frais réels sont-ils utiles ?",
        options: [
          "Quand tes frais de travail dépassent la déduction forfaitaire",
          "Toujours",
          "Jamais",
        ],
        answer: 0,
        why: "Les frais réels ne valent la peine que s’ils sont plus élevés que le forfait appliqué par défaut.",
      },
      {
        q: "Tu fais un don de 100 € à une association. La réduction d’impôt :",
        options: [
          "Te rend toute la somme",
          "Te rend une partie de la somme",
          "N’existe pas",
        ],
        answer: 1,
        why: "Une réduction d’impôt rend un pourcentage du don, pas la totalité.",
      },
      {
        q: "Que faut-il pour déclarer ces dépenses ?",
        options: ["Des justificatifs conservés", "Rien", "Un message à un ami"],
        answer: 0,
        why: "En cas de contrôle, l’administration peut te demander les justificatifs.",
      },
    ],
  },
  {
    id: "pap-evenements",
    idea: [
      "Les grands moments de la vie (déménagement, naissance, mariage, décès) apportent chacun une liste de démarches. On les oublie facilement parce qu’elles arrivent en pleine période chargée. Une checklist évite les oublis coûteux.",
      "Prends l’exemple d’un déménagement : prévenir ton propriétaire (préavis), changer d’adresse auprès des impôts, de la CAF, de ta banque et de ton assurance, transférer l’électricité et internet, et faire suivre ton courrier. Beaucoup de ces démarches se font en ligne.",
      "Pour une naissance, un mariage ou un décès, la liste est différente : le site service-public.fr propose, pour chaque situation, la liste officielle des démarches. Consulte-la dès le début plutôt qu’au dernier moment.",
    ],
    keys: [
      "Chaque grand moment de la vie apporte sa liste de démarches.",
      "Déménagement : propriétaire, impôts, CAF, banque, énergie, internet, courrier.",
      "Service-public.fr donne la liste officielle de chaque situation.",
      "Commence tôt : certaines démarches demandent un préavis.",
    ],
    gesture: {
      intro:
        "Prépare ta checklist de déménagement avec les dates. Coche chaque démarche au fur et à mesure.",
      fields: [
        {
          label: "Préavis donné au propriétaire (date)",
          example: "lettre envoyée le 1er du mois",
        },
        {
          label: "Changement d’adresse : impôts, CAF, banque, assurance",
          example: "à faire en ligne la semaine du déménagement",
        },
        {
          label: "Énergie et internet",
          example: "transfert du contrat demandé 2 semaines avant",
        },
        {
          label: "Suivi du courrier",
          example: "réexpédition demandée à La Poste",
        },
        {
          label: "Changement d’adresse sur la carte grise (si besoin)",
          example: "à faire en ligne sur le site officiel",
        },
        {
          label: "Dernier jour pour tout cocher",
          example: "un mois après l’emménagement",
        },
      ],
      tip: "Fais la liste avant d’emballer : tu seras moins tenté d’oublier les papiers.",
    },
    check: [
      {
        q: "Où trouver la liste officielle des démarches pour chaque situation ?",
        options: ["service-public.fr", "Un forum", "Une publicité"],
        answer: 0,
        why: "Service-public.fr décrit, pour chaque événement de la vie, les démarches à faire.",
      },
      {
        q: "Lors d’un déménagement, qui faut-il prévenir ?",
        options: [
          "Uniquement les voisins",
          "Propriétaire, impôts, CAF, banque, assurance, énergie, internet",
          "Personne",
        ],
        answer: 1,
        why: "Ces organismes envoient des courriers et des paiements : ils doivent avoir ta bonne adresse.",
      },
      {
        q: "Pourquoi commencer tôt ?",
        options: [
          "Certaines démarches demandent un préavis ou un délai",
          "Parce que c’est la mode",
          "Pour payer plus",
        ],
        answer: 0,
        why: "Les préavis et les délais de traitement obligent à anticiper.",
      },
    ],
  },
  {
    id: "pap-succession",
    idea: [
      "Une succession, c’est ce qui se passe pour les biens d’une personne après son décès : ses comptes, son logement, ses objets. La loi prévoit qui hérite, et dans quelle part, selon le lien de parenté. Un héritier peut aussi refuser un héritage, par exemple si les dettes sont trop lourdes.",
      "Un testament est un document où une personne exprime ses volontés. Il ne peut pas faire n’importe quoi : la loi protège une partie des biens pour certains héritiers, notamment les enfants. Une donation, c’est donner de son vivant, avec des règles et parfois de l’impôt.",
      "Pour une succession, le notaire est la personne clé : il établit les documents et aide aux démarches. Les règles et les abattements fiscaux changent : vérifie les informations à jour sur service-public.fr et demande conseil à un notaire avant toute décision importante.",
    ],
    keys: [
      "La loi organise qui hérite et en quelle part.",
      "Un testament exprime des volontés, mais la loi protège certains héritiers.",
      "Une donation se fait de son vivant et suit des règles précises.",
      "Pour les sujets importants, le notaire est l’interlocuteur à consulter.",
    ],
    gesture: {
      intro:
        "Prépare une fiche pour mettre de l’ordre dans ce que tu sais et ce que tu dois demander au notaire. Elle ne remplace pas un conseil professionnel.",
      fields: [
        {
          label: "Mes biens principaux",
          example: "compte courant, livret, logement",
        },
        { label: "Mes proches concernés", example: "conjoint, enfants" },
        {
          label: "Mes souhaits",
          example: "aider un proche, laisser un souvenir précis",
        },
        {
          label: "Documents importants à rassembler",
          example:
            "livret de famille, titres de propriété, contrats d’assurance",
        },
        {
          label: "Questions à poser au notaire",
          example: "que prévoit la loi si je ne fais rien ?",
        },
        { label: "Rendez-vous prévu", example: "date à fixer" },
      ],
      tip: "Dis à un proche de confiance où se trouvent tes papiers importants : cela aide beaucoup le moment venu.",
    },
    check: [
      {
        q: "Qui établit les actes d’une succession ?",
        options: ["Le notaire", "Le facteur", "La banque, seule"],
        answer: 0,
        why: "Le notaire règle la succession, établit les actes et accompagne les héritiers.",
      },
      {
        q: "Un testament permet de :",
        options: [
          "Faire ce qu’on veut, sans aucune limite",
          "Exprimer ses volontés dans les limites de la loi",
          "Éviter toute démarche",
        ],
        answer: 1,
        why: "La loi réserve une part des biens à certains héritiers, qu’un testament ne peut pas écarter.",
      },
      {
        q: "Une donation, c’est :",
        options: [
          "Donner de son vivant, avec des règles précises",
          "Hériter après un décès",
          "Payer un impôt",
        ],
        answer: 0,
        why: "La donation a lieu du vivant du donateur et suit des règles légales, parfois fiscales.",
      },
    ],
  },
];
