import type { SkillContent } from "./types";

/** Parole : les compétences sans leçon longue. */
export const skills: SkillContent[] = [
  {
    id: "par-mail",
    idea: [
      "Un bon mail se lit en dix secondes et appelle une réponse. Pour cela, un objet précis (« Devis chantier Dupont : validation avant jeudi »), une phrase de contexte, ta demande clairement posée, puis la date à laquelle tu en as besoin. Évite les longs paragraphes : une idée par paragraphe.",
      "Place l’essentiel en premier : ce que tu demandes ou ce que tu annonces. Le détail vient après. Si tu attends plusieurs réponses, écris-les en liste numérotée : c’est plus simple pour ton lecteur de répondre point par point.",
      "Relis avant d’envoyer : destinataire, pièce jointe, orthographe, ton poli. Un mail se garde longtemps et peut être transféré : n’y écris rien que tu ne dirais pas en face. Pour les sujets délicats, appelle plutôt.",
    ],
    keys: [
      "Un objet précis qui annonce le sujet.",
      "L’essentiel d’abord : ta demande, puis la date.",
      "Des phrases courtes, une idée par paragraphe.",
      "Relis : destinataire, pièce jointe, orthographe.",
    ],
    gesture: {
      intro:
        "Remplis ce modèle, puis copie-le dans ton mail. Il marche pour presque toutes les demandes professionnelles.",
      fields: [
        {
          label: "Objet",
          example: "Devis chantier Dupont : validation avant jeudi",
        },
        { label: "Salutation", example: "Bonjour Madame Dupont," },
        {
          label: "Contexte en une phrase",
          example: "Suite à notre visite de lundi, je vous envoie le devis.",
        },
        {
          label: "Ta demande claire",
          example: "Pouvez-vous me confirmer votre accord ?",
        },
        {
          label: "La date limite et la raison",
          example: "Avant jeudi 12 h, pour réserver le matériel.",
        },
        {
          label: "Formule de politesse et signature",
          example: "Cordialement, Sofia Martin, 06 00 00 00 00",
        },
      ],
      tip: "Lis l’objet seul : si le destinataire comprend de quoi il s’agit sans ouvrir le mail, il est bon.",
    },
    check: [
      {
        q: "Quel objet est le plus efficace ?",
        options: [
          "« Bonjour »",
          "« Devis chantier Dupont : validation avant jeudi »",
          "« Question »",
        ],
        answer: 1,
        why: "Il dit le sujet, ce qu’on attend et pour quand : le lecteur sait quoi faire.",
      },
      {
        q: "Où placer ta demande dans le mail ?",
        options: [
          "À la toute fin, après un long contexte",
          "Dans la pièce jointe uniquement",
          "Au début, avec le contexte en une phrase",
        ],
        answer: 2,
        why: "Un lecteur pressé lit le début : mets l’essentiel là.",
      },
      {
        q: "Que faire pour un sujet délicat (un désaccord, une mauvaise nouvelle) ?",
        options: [
          "Écrire un mail très long pour tout expliquer",
          "Appeler ou voir la personne, puis confirmer par écrit si besoin",
          "L’envoyer en copie à toute l’équipe",
        ],
        answer: 1,
        why: "À l’écrit, le ton se perd facilement : de vive voix, on évite les malentendus.",
      },
    ],
  },
  {
    id: "par-telephone",
    idea: [
      "Au téléphone, on n’a que la voix : elle doit être claire, posée et aimable. Souris en parlant, ça s’entend. Prépare ton appel : qui tu veux joindre, pourquoi, ce que tu souhaites obtenir. Quelques mots notés sur papier t’évitent de bafouiller.",
      "Une bonne structure tient en quatre temps : te présenter (« Bonjour, je suis Ali Benali, de l’entreprise Martin »), dire pourquoi tu appelles, poser ta demande, puis conclure en résumant la suite (« Je vous envoie le devis demain »). Si la personne n’est pas là, laisse ton nom, ton numéro et la raison en une phrase.",
      "Écoute sans couper, note ce qui est dit (nom, date, chiffre) et reformule les points clés pour être sûr. Si tu tombes sur une messagerie, laisse un message court : nom, numéro, sujet, créneau pour te rappeler.",
    ],
    keys: [
      "Prépare : qui, pourquoi, ce que tu veux obtenir.",
      "Présente-toi, dis pourquoi tu appelles, demande, conclus.",
      "Note les infos importantes et reformule.",
      "Messagerie : nom, numéro, sujet, créneau, en peu de mots.",
    ],
    gesture: {
      intro:
        "Note ton appel sur une fiche avant de décrocher. Tu y verras plus clair et ton interlocuteur aussi.",
      fields: [
        {
          label: "Qui j’appelle",
          example: "Le service comptabilité de la mairie",
        },
        {
          label: "Ma présentation",
          example: "Bonjour, je suis Ali Benali, de l’entreprise Martin.",
        },
        {
          label: "Pourquoi j’appelle",
          example: "Pour savoir où en est le paiement de la facture 245.",
        },
        {
          label: "Ma demande précise",
          example: "Quelle est la date prévue du virement ?",
        },
        {
          label: "Si la personne est absente, mon message",
          example:
            "Ali Benali, entreprise Martin, facture 245, 06 00 00 00 00, avant 17 h.",
        },
        {
          label: "Ma conclusion (résumé de la suite)",
          example: "Donc virement le 12, merci, bonne journée.",
        },
      ],
      tip: "Tiens un stylo prêt : noter le nom de la personne et la date donnée évite de rappeler.",
    },
    check: [
      {
        q: "Quelle est la bonne façon de commencer un appel professionnel ?",
        options: [
          "Se présenter, puis dire pourquoi on appelle",
          "Demander « C’est qui ? »",
          "Commencer directement par sa demande, sans dire qui on est",
        ],
        answer: 0,
        why: "Se présenter met la personne à l’aise et lui permet de comprendre qui lui parle.",
      },
      {
        q: "Tu tombes sur une messagerie. Quel message est le meilleur ?",
        options: [
          "Un long message qui explique toute l’histoire",
          "Raccrocher sans laisser de message",
          "Ton nom, ton numéro, le sujet en une phrase et un créneau pour te rappeler",
        ],
        answer: 2,
        why: "Un message court et complet permet à la personne de te rappeler sans te chercher.",
      },
      {
        q: "Pourquoi reformuler à la fin de l’appel ?",
        options: [
          "Pour gagner du temps en parlant plus",
          "Pour vérifier que vous avez compris la même chose",
          "Pour couper la parole",
        ],
        answer: 1,
        why: "Résumer la suite évite les malentendus sur qui fait quoi et pour quand.",
      },
    ],
  },
  {
    id: "par-oral",
    idea: [
      "Le trac est normal : presque tout le monde l’a, même ceux qui parlent bien. Il montre que tu veux bien faire. Ce qui aide le plus, c’est de te préparer : un message principal, trois idées, une première phrase apprise par cœur. Quand on sait comment on commence, on se détend.",
      "Garde la structure simple : une accroche (une question, un chiffre, une histoire courte), trois points, une conclusion avec ce que tu veux que les gens retiennent. N’écris pas tout : quelques mots-clés sur une carte te permettent de parler naturellement.",
      "Pour tenir l’attention, regarde les gens, parle un peu plus lentement que d’habitude, fais des pauses et varie ta voix. Entraîne-toi à voix haute, avec un chronomètre : trois minutes se tiennent mieux quand on les a répétées. Respire doucement avant de commencer.",
    ],
    keys: [
      "Le trac est normal ; la préparation le calme.",
      "Un message, trois idées, une phrase d’ouverture sue par cœur.",
      "Parle sur des mots-clés, pas sur un texte entier.",
      "Entraîne-toi à voix haute, avec un chronomètre.",
    ],
    gesture: {
      intro:
        "Prépare ici trois minutes d’oral. Remplis chaque case, puis répète à voix haute deux ou trois fois.",
      fields: [
        {
          label: "Le message principal (une phrase)",
          example: "Nous devons passer les commandes par l’application.",
        },
        {
          label: "L’accroche (première phrase)",
          example: "Combien de commandes perdons-nous chaque mois par oubli ?",
        },
        {
          label: "Point 1",
          example: "Le problème : trois commandes oubliées le mois dernier.",
        },
        {
          label: "Point 2",
          example: "La solution : une application simple, gratuite à tester.",
        },
        {
          label: "Point 3",
          example: "La suite : un essai de deux semaines à partir de lundi.",
        },
        {
          label: "La conclusion (ce qu’on retient)",
          example: "Un essai de deux semaines, sans risque : qui est partant ?",
        },
      ],
      tip: "Chronomètre-toi : prévois un peu moins de temps que celui accordé, tu iras naturellement plus lentement le jour J.",
    },
    check: [
      {
        q: "Qu’est-ce qui aide le plus à gérer le trac ?",
        options: [
          "Éviter de se préparer pour ne pas y penser",
          "Se préparer et savoir comment on commence",
          "Parler le plus vite possible pour en finir",
        ],
        answer: 1,
        why: "Quand on connaît son début et sa structure, on se sent plus en sécurité.",
      },
      {
        q: "Pour parler naturellement, vaut-il mieux :",
        options: [
          "Lire un texte entier mot à mot",
          "Réciter tout par cœur",
          "S’appuyer sur quelques mots-clés",
        ],
        answer: 2,
        why: "Les mots-clés te guident sans que tu aies l’air de lire, et tu gardes le regard sur le public.",
      },
      {
        q: "Comment garder l’attention du groupe ?",
        options: [
          "Regarder les gens, faire des pauses et varier la voix",
          "Fixer ses notes pour ne rien oublier",
          "Parler sans pause pour tout dire",
        ],
        answer: 0,
        why: "Le contact visuel et le rythme donnent envie d’écouter.",
      },
    ],
  },
  {
    id: "par-presentation",
    idea: [
      "Les diapositives sont là pour aider ton auditoire à comprendre, pas pour remplacer ta voix. Si tu lis ton écran, les gens lisent aussi, et ne t’écoutent plus. Une diapositive doit porter une seule idée, avec peu de texte, de grandes lettres et, si possible, un schéma ou une image.",
      "Commence par le plan : à quoi sert cette présentation, ce que tu veux que les gens retiennent ou décident. Puis construis dans cet ordre : le problème, ta solution, les preuves (chiffres, exemples), la décision attendue. Dix diapositives pour vingt minutes, c’est déjà beaucoup.",
      "Pense à ton public : un chef d’entreprise veut le résultat, une équipe technique veut le détail. Évite les animations, les couleurs criardes et les paragraphes entiers. Prévois une dernière diapositive qui résume le message et propose la suite. Teste ton matériel avant d’arriver.",
    ],
    keys: [
      "Une idée par diapositive, peu de texte.",
      "Ordre simple : problème, solution, preuves, décision attendue.",
      "Adapte le contenu à ton public.",
      "Dernière diapositive : le message à retenir et la suite.",
    ],
    gesture: {
      intro:
        "Écris le plan de ta présentation avant d’ouvrir le logiciel. Chaque ligne devient une diapositive.",
      fields: [
        {
          label: "Le but de la présentation",
          example: "Faire valider l’achat d’une nouvelle machine",
        },
        {
          label: "Ton public et ce qui l’intéresse",
          example: "La direction : coût, délai, gain attendu",
        },
        {
          label: "Diapositive 1 : le problème",
          example: "La machine actuelle tombe en panne deux fois par mois.",
        },
        {
          label: "Diapositive 2 : la solution",
          example: "Une machine neuve, garantie deux ans.",
        },
        {
          label: "Diapositive 3 : les preuves en chiffres",
          example:
            "Coût des pannes : 4 000 € par an ; prix de la machine : 9 000 €.",
        },
        {
          label: "Diapositive 4 : la décision attendue",
          example: "Valider l’achat avant fin décembre.",
        },
      ],
      tip: "Teste la lisibilité : si quelqu’un au fond de la salle ne peut pas lire une diapositive, il y a trop de texte.",
    },
    check: [
      {
        q: "Combien d’idées par diapositive ?",
        options: [
          "Une seule",
          "Autant que possible pour gagner du temps",
          "Dix, pour que ce soit complet",
        ],
        answer: 0,
        why: "Une idée à la fois se comprend et se retient mieux.",
      },
      {
        q: "Quel est le défaut d’une diapositive pleine de texte ?",
        options: [
          "Elle est plus chère à imprimer",
          "Elle empêche l’animation",
          "Les gens la lisent et n’écoutent plus ce que tu dis",
        ],
        answer: 2,
        why: "L’attention ne peut pas lire et écouter en même temps : le texte doit rester court.",
      },
      {
        q: "Que mettre dans la dernière diapositive ?",
        options: [
          "« Merci » et rien d’autre",
          "Le message à retenir et la suite proposée",
          "Toutes les sources, en petit",
        ],
        answer: 1,
        why: "La fin est ce qu’on retient : elle doit rappeler l’essentiel et dire ce qui doit se passer ensuite.",
      },
    ],
  },
  {
    id: "par-difficile",
    idea: [
      "Une conversation difficile, c’est annoncer une mauvaise nouvelle, refuser une demande ou recadrer quelqu’un. On a envie de l’éviter, mais le temps ne l’arrange presque jamais. La bonne attitude : être clair sur le fond, respectueux dans la forme.",
      "Prépare-toi. Écris la phrase qui dit l’essentiel, sans détour (« Je ne peux pas valider ta demande de congé sur ces dates »). Donne la raison en une phrase vraie, sans te justifier longuement. Puis écoute la réaction, accepte l’émotion de l’autre, et propose, si possible, une alternative.",
      "Choisis un lieu calme et un bon moment, de préférence en privé. Parle de faits, pas de la personne, et ne t’excuse pas de ta décision si elle est juste. Termine par ce qui va se passer ensuite. Pour les situations graves (licenciement, harcèlement), fais-toi aider par les ressources humaines ou un juriste.",
    ],
    keys: [
      "Dis l’essentiel dès les premières phrases, sans détour.",
      "Une raison courte et vraie, sans longue justification.",
      "Accepte la réaction de l’autre et propose une alternative.",
      "Cadre privé, calme, parle de faits et de la suite.",
    ],
    gesture: {
      intro:
        "Prépare ta conversation avec cette fiche. Relis tes phrases à voix haute : elles doivent être courtes et nettes.",
      fields: [
        {
          label: "La situation",
          example:
            "Refuser une demande de congé pour la dernière semaine de décembre",
        },
        {
          label: "Ma phrase d’ouverture (l’essentiel)",
          example: "Je ne peux pas accepter tes congés sur cette semaine.",
        },
        {
          label: "La raison en une phrase",
          example: "Deux collègues sont déjà absents ces jours-là.",
        },
        {
          label: "Ce que l’autre risque de ressentir",
          example: "De la déception, peut-être de l’injustice.",
        },
        {
          label: "Ce que je réponds à son émotion",
          example:
            "Je comprends que ce soit décevant, et je veux trouver une solution.",
        },
        {
          label: "L’alternative ou la suite proposée",
          example: "Je peux t’accorder la première semaine de janvier.",
        },
      ],
      tip: "Ne commence pas par trois phrases de politesse : l’autre sent venir la mauvaise nouvelle et se crispe.",
    },
    check: [
      {
        q: "Par quoi commencer une mauvaise nouvelle ?",
        options: [
          "Par un long détour pour adoucir",
          "Par l’essentiel, dit clairement et poliment",
          "Par des excuses répétées",
        ],
        answer: 1,
        why: "Dire l’essentiel tout de suite évite l’angoisse et les malentendus.",
      },
      {
        q: "L’autre réagit avec colère ou déception. Que fais-tu ?",
        options: [
          "Tu hausses le ton pour t’imposer",
          "Tu changes ta décision aussitôt pour calmer le jeu",
          "Tu reconnais ce qu’il ressent, tu restes ferme et proposes une alternative",
        ],
        answer: 2,
        why: "Accepter l’émotion sans céder sur le fond garde la relation et la décision.",
      },
      {
        q: "Où et quand faire cette conversation ?",
        options: [
          "Dans un endroit calme, en privé, au bon moment",
          "Devant tout le monde pour que ce soit transparent",
          "Par message, pour éviter toute émotion",
        ],
        answer: 0,
        why: "Le respect de la personne et un cadre calme permettent d’échanger vraiment.",
      },
    ],
  },
  {
    id: "par-convaincre",
    idea: [
      "Convaincre, ce n’est pas gagner une dispute : c’est aider quelqu’un à voir pourquoi ta proposition est bonne pour lui. Commence donc par comprendre ce qui compte pour la personne : son objectif, sa crainte, ce qu’elle risque. Un argument n’a de force que s’il répond à ce qu’elle se demande.",
      "Une structure simple fonctionne souvent : ta position en une phrase, deux ou trois raisons (chacune avec un fait, un chiffre ou un exemple), la réponse à l’objection principale, puis la décision que tu demandes. Dans cet ordre, tout est clair et tu ne te perds pas.",
      "Évite la pression et la manipulation : exagérer, faire peur ou cacher les inconvénients détruisent la confiance et se retournent contre toi. Reconnaître une limite de ta proposition la rend plus crédible. Termine toujours par une demande précise : « Pouvons-nous décider de l’essai jeudi ? »",
    ],
    keys: [
      "Pars de ce qui compte pour l’autre, pas seulement pour toi.",
      "Structure : position, deux ou trois raisons prouvées, objection, demande.",
      "Appuie chaque raison sur un fait, un chiffre ou un exemple.",
      "Pas de pression ni de mensonge : la confiance prime.",
    ],
    gesture: {
      intro:
        "Construis ton argument avec ces cases. Tu peux ensuite le dire à l’oral ou l’écrire dans un mail.",
      fields: [
        {
          label: "Ce que je veux faire décider",
          example: "Passer à une facturation en ligne",
        },
        {
          label: "Ce qui compte pour la personne",
          example: "Gagner du temps et être payée plus vite",
        },
        {
          label: "Raison 1 avec preuve",
          example: "Moins d’erreurs : trois factures fausses le mois dernier.",
        },
        {
          label: "Raison 2 avec preuve",
          example:
            "Paiement en 10 jours au lieu de 30 chez des clients équipés.",
        },
        {
          label: "L’objection probable et ma réponse",
          example:
            "« C’est compliqué » : une formation de 30 minutes est prévue.",
        },
        {
          label: "Ma demande précise",
          example: "Pouvons-nous commencer par un essai de deux semaines ?",
        },
      ],
      tip: "Teste ton argument sur un proche en lui demandant l’objection qu’il te ferait : tu seras mieux préparé.",
    },
    check: [
      {
        q: "Par quoi commencer pour convaincre ?",
        options: [
          "Par le plus d’arguments possibles, sans écouter",
          "Par comprendre ce qui compte pour la personne",
          "Par un ton insistant",
        ],
        answer: 1,
        why: "Un argument qui répond à ce que l’autre cherche pèse beaucoup plus qu’une longue liste.",
      },
      {
        q: "Quelle raison est la plus convaincante ?",
        options: [
          "« C’est mieux, croyez-moi. »",
          "« Tout le monde le fait. »",
          "« Trois factures fausses le mois dernier : ça évite ces erreurs. »",
        ],
        answer: 2,
        why: "Un fait précis se vérifie et montre l’intérêt concret.",
      },
      {
        q: "Tu cites une limite de ta proposition. Quel effet attendre ?",
        options: [
          "Tu perds toute ta crédibilité",
          "Tu seras plus crédible, car tu ne caches rien",
          "Aucun effet, c’est inutile",
        ],
        answer: 1,
        why: "Être honnête sur les limites donne confiance dans le reste de ton argument.",
      },
    ],
  },
];
