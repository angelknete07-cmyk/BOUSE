import type { SkillContent } from "./types";

/** Entreprendre : les compétences sans leçon longue. */
export const skills: SkillContent[] = [
  {
    id: "ent-idee",
    idea: [
      "Une bonne idée d’activité part rarement d’une illumination. Elle vient de deux endroits : ce que tu sais déjà faire (un métier, un talent, une passion) et ce qui manque autour de toi (un service introuvable, un client qui galère, une attente trop longue).",
      "Croise les deux. Si tu sais réparer des volets et que les voisins attendent trois semaines un artisan, tu tiens une piste. Une idée ne vaut rien tant qu’un vrai client n’a pas dit « je paierais pour ça ».",
      "Note large, trie ensuite. Écris dix idées sans te censurer, puis garde les deux ou trois où tu as une compétence, un client précis en tête et une façon simple de tester sans grosse dépense.",
    ],
    keys: [
      "Pars de ce que tu sais faire et de ce qui manque autour de toi.",
      "Une idée sans client prêt à payer reste une hypothèse.",
      "Écris beaucoup d’idées, puis trie avec trois critères : compétence, client, test simple.",
      "Teste petit avant de dépenser.",
    ],
    gesture: {
      intro:
        "Remplis ta carte d’idées : tes compétences, les problèmes que tu vois, et trois idées à croiser. Prends dix minutes, sans filtre.",
      fields: [
        {
          label: "Ce que je sais bien faire",
          example: "poser du carrelage, être ponctuel",
        },
        {
          label: "Problème que je vois autour de moi",
          example: "impossible de trouver un plombier le week-end",
        },
        {
          label: "Qui en souffre ?",
          example: "les propriétaires de maisons de mon quartier",
        },
        {
          label: "Idée 1 : compétence + problème",
          example: "dépannage plomberie week-end",
        },
        {
          label: "Idée 2",
          example: "pose de carrelage pour petites salles de bain",
        },
        {
          label: "Comment tester sans dépenser",
          example: "poster une annonce et appeler 5 voisins",
        },
      ],
      tip: "Une bonne idée tient en une phrase : « J’aide [qui] à [quoi] ».",
    },
    check: [
      {
        q: "Quelle est la meilleure façon de trouver une idée solide ?",
        options: [
          "Attendre une inspiration soudaine",
          "Croiser ce que tu sais faire et ce qui manque autour de toi",
          "Copier l’activité la plus à la mode",
        ],
        answer: 1,
        why: "Une compétence réelle face à un besoin réel donne une base concrète.",
      },
      {
        q: "Quand une idée devient-elle crédible ?",
        options: [
          "Quand elle te plaît beaucoup",
          "Quand tu as acheté du matériel",
          "Quand un vrai client dit qu’il paierait pour ça",
        ],
        answer: 2,
        why: "Ton enthousiasme ne remplace pas la preuve qu’un client est prêt à payer.",
      },
      {
        q: "Tu as dix idées. Que fais-tu ensuite ?",
        options: [
          "Tu en gardes deux ou trois et tu les testes",
          "Tu lances les dix en même temps",
          "Tu jettes la liste",
        ],
        answer: 0,
        why: "Tester peu d’idées, vite et pas cher, évite de se disperser.",
      },
    ],
  },
  {
    id: "ent-devis",
    idea: [
      "Un devis est ton offre chiffrée avant le travail. Une fois signé par le client avec la mention « bon pour accord », il devient un contrat : prix, travaux et délais s’imposent aux deux parties. Il te protège autant que lui.",
      "Un devis clair contient ton identité (nom, adresse, numéro d’entreprise), celle du client, la date, la durée de validité, la description précise de chaque prestation, les quantités, les prix hors taxes, la TVA et le total TTC. Plus c’est précis, moins il y a de disputes.",
      "Pour certains métiers, comme le bâtiment, d’autres mentions s’ajoutent. Vérifie les règles de ton activité sur service-public.fr ou auprès de ta chambre de métiers avant d’envoyer le premier devis.",
    ],
    keys: [
      "Un devis signé vaut contrat.",
      "Décris chaque prestation avec quantité, prix HT, TVA et total TTC.",
      "Indique une durée de validité et les conditions de paiement.",
      "Vérifie les mentions propres à ton métier sur service-public.fr.",
    ],
    gesture: {
      intro:
        "Voici le modèle de devis à recopier dans ton outil. Remplis chaque case : plus il est précis, moins tu auras de discussions plus tard.",
      fields: [
        {
          label: "Mon entreprise (nom, adresse, numéro)",
          example: "Léo Martin Plomberie, 12 rue des Lilas",
        },
        { label: "Client", example: "Mme Durand, 5 allée du Parc" },
        {
          label: "Date et durée de validité",
          example: "10/11/2026, valable 30 jours",
        },
        {
          label: "Prestation détaillée",
          example: "Remplacement d’un chauffe-eau 200 L, pose incluse",
        },
        { label: "Prix HT et TVA", example: "800 € HT, TVA 10 %" },
        { label: "Total TTC et acompte", example: "880 € TTC, acompte 30 %" },
        {
          label: "Signature du client",
          example: "« Bon pour accord », date, signature",
        },
      ],
      tip: "Détaille les fournitures et la main-d’œuvre séparément : le client comprend mieux ton prix.",
    },
    check: [
      {
        q: "Que se passe-t-il quand le client signe ton devis avec « bon pour accord » ?",
        options: [
          "Rien, ce n’est qu’une estimation",
          "Il devient un contrat que les deux parties doivent respecter",
          "Il peut encore changer les prix seul",
        ],
        answer: 1,
        why: "Un devis accepté par écrit engage les deux parties sur le prix et la prestation.",
      },
      {
        q: "Quelle information est essentielle dans un devis ?",
        options: [
          "La description précise de chaque prestation avec son prix",
          "Ton chiffre d’affaires de l’an dernier",
          "La couleur de ta camionnette",
        ],
        answer: 0,
        why: "Le client doit savoir exactement ce qu’il achète et à quel prix.",
      },
      {
        q: "Pourquoi indiquer une durée de validité ?",
        options: [
          "Pour rien, c’est décoratif",
          "Pour que le prix ne s’impose pas indéfiniment si tes coûts changent",
          "Pour obliger le client à signer le jour même",
        ],
        answer: 1,
        why: "Les prix des fournitures bougent : la durée de validité limite ton engagement dans le temps.",
      },
    ],
  },
  {
    id: "ent-relancer-impayes",
    idea: [
      "Un impayé, c’est de l’argent qui t’appartient et qui dort chez ton client. La plupart du temps, ce n’est pas de la mauvaise foi : une facture oubliée, un mail perdu. Une relance polie et rapide règle la majorité des cas sans fâcher personne.",
      "Procède par étapes. D’abord un rappel amical quelques jours après l’échéance. Puis une relance plus ferme avec la facture jointe et une date limite. Enfin une mise en demeure en lettre recommandée, qui fixe un dernier délai avant de passer à d’autres moyens.",
      "Garde toujours une trace écrite de chaque étape. Et prévois dès le départ des conditions de paiement claires sur ton devis et ta facture : date limite, pénalités de retard et indemnité de recouvrement doivent y figurer. Les détails se vérifient sur service-public.fr.",
    ],
    keys: [
      "Relance vite : plus tu attends, plus c’est difficile.",
      "Trois étapes : rappel amical, relance ferme, mise en demeure.",
      "Garde une trace écrite de chaque relance.",
      "Les conditions de paiement se prévoient dès le devis.",
    ],
    gesture: {
      intro:
        "Prépare tes trois messages une fois pour toutes. Il ne restera qu’à changer le nom du client, le montant et la date.",
      fields: [
        {
          label: "Mail 1 : rappel amical (J+3 après échéance)",
          example:
            "Bonjour M. Roux, je n’ai pas reçu le règlement de la facture n° 12 de 600 €. Un oubli ?",
        },
        {
          label: "Mail 2 : relance ferme (J+15)",
          example:
            "La facture n° 12 est impayée. Merci de la régler avant le 30/11.",
        },
        {
          label: "Mise en demeure (J+30)",
          example:
            "Lettre recommandée : paiement sous 8 jours, sinon j’engage d’autres démarches",
        },
        {
          label: "Facture jointe et montant dû",
          example: "facture n° 12 – 600 €",
        },
        { label: "Moyens de paiement proposés", example: "virement ou chèque" },
      ],
      tip: "Reste factuel et poli : le but est d’être payé, pas d’avoir raison.",
    },
    check: [
      {
        q: "Une facture n’est pas payée trois jours après l’échéance. Première action ?",
        options: [
          "Envoyer tout de suite une mise en demeure",
          "Un rappel amical par mail ou téléphone",
          "Ne rien faire pendant six mois",
        ],
        answer: 1,
        why: "Un simple oubli est le cas le plus fréquent : un rappel poli suffit souvent.",
      },
      {
        q: "À quoi sert une mise en demeure en lettre recommandée ?",
        options: [
          "À offrir une remise au client",
          "À prouver que tu as exigé le paiement et à fixer un dernier délai",
          "À annuler la facture",
        ],
        answer: 1,
        why: "Elle laisse une preuve datée de ta demande et ouvre la suite si le client ne paie pas.",
      },
      {
        q: "Pourquoi garder une trace écrite de chaque relance ?",
        options: [
          "Pour pouvoir prouver tes démarches si l’affaire se complique",
          "Pour faire joli dans ton dossier",
          "Ce n’est jamais utile",
        ],
        answer: 0,
        why: "Si l’impayé persiste, tes relances datées montrent que tu as agi dans les règles.",
      },
    ],
  },
  {
    id: "ent-cgv",
    idea: [
      "Les conditions générales de vente (CGV), ce sont les règles du jeu de ta relation commerciale : comment on paie, quand, que se passe-t-il en cas de retard, quelles garanties tu offres, que faire en cas de problème. Elles évitent d’improviser à chaque dispute.",
      "Elles tiennent sur une ou deux pages, en langage simple : prix et paiement, délais de réalisation, retards de paiement, garanties, réclamations et annulations. Si tu vends à des particuliers, certains droits, comme le droit de rétractation pour une vente à distance, sont imposés par la loi.",
      "Fais-les lire avant la signature, par exemple en les joignant au devis. Les règles exactes varient selon l’activité et le type de client : vérifie-les sur service-public.fr avant de finaliser tes CGV.",
    ],
    keys: [
      "Les CGV fixent les règles de paiement, de délai, de garantie et de litige.",
      "Elles doivent être simples et lisibles.",
      "Certains droits du consommateur ne peuvent pas être supprimés.",
      "Joins-les au devis pour qu’elles soient acceptées avec lui.",
    ],
    gesture: {
      intro:
        "Rédige tes CGV en remplissant chaque rubrique avec ta propre règle. Une phrase suffit par case.",
      fields: [
        {
          label: "Prix et paiement",
          example: "Acompte de 30 % à la commande, solde à la livraison",
        },
        {
          label: "Délais d’exécution",
          example: "Travaux commencés sous 3 semaines après acceptation",
        },
        {
          label: "Retard de paiement",
          example:
            "Pénalités de retard et indemnité de recouvrement, comme prévu par la loi",
        },
        {
          label: "Garanties",
          example: "Garantie sur les travaux selon les règles de mon métier",
        },
        {
          label: "Réclamations",
          example: "Par écrit sous 8 jours après la fin des travaux",
        },
        {
          label: "Annulation",
          example: "Annulation gratuite 7 jours avant, acompte gardé ensuite",
        },
      ],
      tip: "Une règle claire dite avant vaut mieux qu’une explication difficile après le problème.",
    },
    check: [
      {
        q: "À quoi servent les CGV ?",
        options: [
          "À décorer tes documents",
          "À fixer à l’avance les règles de paiement, délai, garantie et litige",
          "À remplacer le devis",
        ],
        answer: 1,
        why: "Elles encadrent la relation et évitent les conflits sur des points non prévus.",
      },
      {
        q: "Tu vends à un particulier à distance. Peux-tu écrire dans tes CGV qu’il n’a aucun droit de se rétracter ?",
        options: [
          "Oui, c’est ton choix",
          "Non, certains droits du consommateur sont imposés par la loi",
          "Oui, si c’est écrit en petit",
        ],
        answer: 1,
        why: "La loi protège le consommateur : une clause qui supprime ces droits n’est pas valable.",
      },
      {
        q: "Comment t’assurer que le client a accepté tes CGV ?",
        options: [
          "Les cacher sur ton site",
          "Les lui remettre avec le devis, qu’il signe",
          "Les lui envoyer après le paiement",
        ],
        answer: 1,
        why: "Elles doivent être connues avant l’achat : le plus simple est de les joindre au devis.",
      },
    ],
  },
  {
    id: "ent-grandir",
    idea: [
      "Grandir veut dire plus de clients, plus de chiffre d’affaires, souvent plus de complexité. Trois grandes décisions reviennent : embaucher quelqu’un, changer de statut juridique, trouver de l’argent pour investir. Chacune a un coût et des obligations.",
      "Embaucher fait gagner du temps, mais ajoute un salaire à payer chaque mois, même quand l’activité baisse. Changer de statut peut devenir utile quand ton activité dépasse ce que le statut de départ permet ou quand tu veux protéger ton patrimoine ou t’associer. Lever des fonds donne de l’argent contre une part de l’entreprise.",
      "Une règle simple : grandis quand la demande dépasse déjà ta capacité, pas par impatience. Fais-toi conseiller par un expert-comptable ou ta chambre de métiers avant de choisir : les règles et seuils changent régulièrement, vérifie-les sur service-public.fr.",
    ],
    keys: [
      "Embaucher, changer de statut, financer : trois décisions différentes.",
      "Un salaire se paie même les mois creux.",
      "Grandis quand la demande dépasse déjà ta capacité.",
      "Demande conseil à un expert-comptable avant de te lancer.",
    ],
    gesture: {
      intro:
        "Avant de grandir, pose les faits sur papier. Cette fiche t’aide à décider avec des chiffres plutôt qu’avec l’enthousiasme.",
      fields: [
        {
          label: "Ce qui me bloque aujourd’hui",
          example: "je refuse des chantiers faute de temps",
        },
        { label: "Décision envisagée", example: "embaucher un apprenti" },
        {
          label: "Coût mensuel supplémentaire",
          example: "1 800 € tout compris",
        },
        {
          label: "Chiffre d’affaires que cela doit rapporter",
          example: "au moins 3 000 € de plus par mois",
        },
        {
          label: "Risque si l’activité baisse",
          example: "3 mois de salaire à payer sans nouveau chantier",
        },
        { label: "Personne à consulter", example: "mon expert-comptable" },
      ],
      tip: "Si tu ne peux pas payer la nouvelle charge trois mois sans rentrée, attends un peu.",
    },
    check: [
      {
        q: "Quand est-il raisonnable d’embaucher ?",
        options: [
          "Quand la demande dépasse déjà ta capacité à la servir",
          "Dès le premier client",
          "Quand tu t’ennuies",
        ],
        answer: 0,
        why: "L’embauche doit répondre à un besoin prouvé, car elle crée une charge fixe.",
      },
      {
        q: "Lever des fonds, c’est :",
        options: [
          "recevoir de l’argent gratuit",
          "recevoir de l’argent contre une part de l’entreprise",
          "emprunter sans rien rembourser",
        ],
        answer: 1,
        why: "Les investisseurs apportent de l’argent et deviennent associés : tu leur cèdes une part.",
      },
      {
        q: "Pourquoi un salaire pèse-t-il plus lourd qu’un achat ponctuel ?",
        options: [
          "Il est payé chaque mois, même quand l’activité baisse",
          "Il est plus cher que tout achat",
          "Il ne coûte rien les premiers mois",
        ],
        answer: 0,
        why: "C’est une charge fixe : elle reste là même quand les ventes diminuent.",
      },
    ],
  },
];
