import type { SkillContent } from "./types";

/** Sécurité numérique : les compétences sans leçon longue. */
export const skills: SkillContent[] = [
  {
    id: "sec-mots-passe",
    idea: [
      "Le piège classique : utiliser le même mot de passe partout. Si un seul site se fait voler ses données, les voleurs essaient ce mot de passe sur ta messagerie, ta banque, tes réseaux. Un mot de passe doit donc être unique pour chaque compte, et long plutôt que compliqué.",
      "Impossible de retenir des dizaines de mots de passe longs et différents. C’est le rôle du gestionnaire de mots de passe : un coffre verrouillé par un seul mot de passe maître, qui crée, range et remplit les autres à ta place. Tu n’as plus qu’un seul mot de passe à retenir.",
      "Ajoute la double vérification (ou double authentification) sur tes comptes importants : en plus du mot de passe, un code reçu sur ton téléphone. Même si quelqu’un trouve ton mot de passe, il ne peut pas entrer. Commence par ta messagerie, ta banque et tes réseaux.",
    ],
    keys: [
      "Un mot de passe unique par compte.",
      "Long vaut mieux que compliqué : une phrase de plusieurs mots est excellente.",
      "Un gestionnaire retient tout, sauf le mot de passe maître.",
      "Active la double vérification sur ta messagerie, ta banque et tes réseaux.",
    ],
    gesture: {
      intro:
        "Prépare ta mise en place d’un gestionnaire de mots de passe. Note ce que tu fais, dans l’ordre : tu pourras cocher au fur et à mesure.",
      fields: [
        {
          label: "Le gestionnaire choisi",
          example: "Celui intégré à mon téléphone, ou un gestionnaire reconnu",
        },
        {
          label: "Mon mot de passe maître (une phrase longue)",
          example:
            "Une phrase de 5 mots que moi seul connais, écrite nulle part",
        },
        {
          label: "Premier compte à sécuriser",
          example: "Ma messagerie principale",
        },
        {
          label: "Deuxième et troisième comptes",
          example: "Ma banque, puis mon compte de réseau social",
        },
        {
          label: "Double vérification activée sur",
          example: "Messagerie, banque",
        },
        {
          label: "Où je range mes codes de secours",
          example: "Imprimés, dans un tiroir chez moi",
        },
      ],
      tip: "N’écris jamais ton vrai mot de passe maître dans ce modèle : ne note que l’endroit où il est rangé dans ta tête.",
    },
    check: [
      {
        q: "Pourquoi éviter le même mot de passe sur tous les sites ?",
        options: [
          "Parce que c’est interdit par la loi",
          "Parce qu’un seul vol de données ouvre alors tous tes comptes",
          "Parce que les sites le refusent",
        ],
        answer: 1,
        why: "Si un site est piraté, les voleurs essaient ce même mot de passe partout ailleurs.",
      },
      {
        q: "Que fait un gestionnaire de mots de passe ?",
        options: [
          "Il retient un mot de passe maître pour toi et remplit les autres",
          "Il envoie tes mots de passe à tes contacts",
          "Il supprime tes comptes",
        ],
        answer: 0,
        why: "Un seul mot de passe à retenir : le coffre garde les autres, uniques et longs.",
      },
      {
        q: "À quoi sert la double vérification ?",
        options: [
          "À rendre le mot de passe inutile",
          "À accélérer la connexion",
          "À bloquer l’accès même si ton mot de passe est volé",
        ],
        answer: 2,
        why: "Le second code, reçu sur ton téléphone, manque au voleur pour entrer.",
      },
    ],
  },
  {
    id: "sec-arnaques",
    idea: [
      "Les arnaques en ligne ne cherchent pas à pirater ton ordinateur : elles cherchent à te convaincre. Faux SMS de colis à régler, faux conseiller bancaire au téléphone, faux mail des impôts… Elles jouent toutes sur les mêmes émotions : la peur, l’urgence, l’appât du gain.",
      "Cinq signes qui doivent t’alerter : un message inattendu, une urgence (« sous 24 h »), une menace ou une promesse trop belle, une demande d’argent ou de code, et un lien ou un expéditeur bizarre. Un seul signe suffit pour s’arrêter.",
      "Le bon réflexe : ne clique pas, ne réponds pas, ne donne jamais un code reçu par SMS. Contacte l’organisme toi-même, avec le numéro ou le site que tu connais. Une vraie banque ne te demandera jamais de code ni de virer ton argent « pour le sécuriser ».",
    ],
    keys: [
      "L’arnaque joue sur la peur, l’urgence ou l’appât du gain.",
      "Un message inattendu qui presse est suspect.",
      "Ne donne jamais un code reçu par SMS ou ton mot de passe.",
      "Rappelle toi-même l’organisme avec un numéro que tu connais.",
    ],
    gesture: {
      intro:
        "Passe un message suspect au test des 5 signes. Réponds par oui ou non à chaque ligne : dès qu’il y a un oui, tu t’arrêtes.",
      fields: [
        {
          label: "Le message que j’ai reçu",
          example: "SMS : « Votre colis est bloqué, payez 1,99 € »",
        },
        {
          label: "1. Je l’attendais ? (inattendu = signe)",
          example: "Non, je n’attends aucun colis : signe",
        },
        {
          label: "2. Il y a une urgence ?",
          example: "Oui : « sous 24 h » : signe",
        },
        {
          label: "3. Il y a une menace ou une promesse trop belle ?",
          example: "Oui : colis renvoyé sinon : signe",
        },
        {
          label: "4. On me demande de l’argent, un code ou des infos ?",
          example: "Oui : paiement et carte bancaire : signe",
        },
        {
          label: "5. Le lien ou l’expéditeur est bizarre ?",
          example: "Oui : adresse web étrange : signe",
        },
        {
          label: "Ce que je fais",
          example: "Je ne clique pas, je supprime et je signale le SMS",
        },
      ],
      tip: "En cas de doute, la règle d’or : tu raccroches, tu supprimes, et tu appelles toi-même l’organisme avec son vrai numéro.",
    },
    check: [
      {
        q: "Un « conseiller » t’appelle et demande le code reçu par SMS. Tu :",
        options: [
          "le lui donnes pour annuler l’opération",
          "lui donnes seulement les trois premiers chiffres",
          "raccroches et rappelles ta banque avec ton numéro habituel",
        ],
        answer: 2,
        why: "Un vrai conseiller ne demande jamais ce code : c’est la clé pour valider un paiement.",
      },
      {
        q: "Quel signe doit t’alerter dans un message ?",
        options: [
          "Une urgence qui te presse d’agir",
          "Un message de ta famille que tu attendais",
          "Un reçu après ton achat",
        ],
        answer: 0,
        why: "L’urgence est l’outil favori des arnaqueurs : elle t’empêche de réfléchir.",
      },
      {
        q: "Un SMS te dit que ton colis est bloqué et te donne un lien. Tu n’attends rien. Tu :",
        options: [
          "cliques vite pour régler le problème",
          "ne cliques pas et supprimes le message",
          "réponds pour demander des précisions",
        ],
        answer: 1,
        why: "Message inattendu, urgence, lien : il faut ne pas cliquer, et signaler ou supprimer.",
      },
    ],
  },
  {
    id: "sec-sauvegarde",
    idea: [
      "Un téléphone qui tombe dans l’eau, un ordinateur volé, un virus : un jour ou l’autre, un appareil lâche. Si tes photos, tes documents et tes contrats ne sont qu’à un seul endroit, ils sont perdus pour de bon. Une sauvegarde, c’est une copie rangée ailleurs.",
      "La règle 3-2-1 est simple à retenir : 3 copies de tes fichiers (l’original + 2 sauvegardes), sur 2 supports différents (ordinateur, disque dur externe, espace en ligne), dont 1 copie hors de chez toi (en ligne, ou chez un proche). Ainsi, un incendie ou un vol ne détruit pas tout.",
      "Une sauvegarde qu’on ne vérifie jamais peut être vide sans qu’on le sache. Programme-la pour qu’elle soit automatique, et une fois de temps en temps, essaie de rouvrir un fichier sauvegardé pour être sûr qu’elle marche.",
    ],
    keys: [
      "Un fichier à un seul endroit n’est pas protégé.",
      "Règle 3-2-1 : 3 copies, 2 supports, 1 copie hors de chez toi.",
      "Rends la sauvegarde automatique pour ne pas l’oublier.",
      "Teste de temps en temps que tu peux retrouver un fichier.",
    ],
    gesture: {
      intro:
        "Écris ton plan de sauvegarde. Il tient en une page : ce qu’on protège, où vont les copies, à quelle fréquence, et comment tu vérifies.",
      fields: [
        {
          label: "Ce que je ne peux pas perdre",
          example: "Photos de famille, contrats, factures de mon activité",
        },
        {
          label: "Copie 1 : l’original",
          example: "Mon ordinateur portable",
        },
        {
          label: "Copie 2 : sur un autre support",
          example: "Un disque dur externe branché une fois par semaine",
        },
        {
          label: "Copie 3 : hors de chez moi",
          example: "Un espace de stockage en ligne, sauvegarde automatique",
        },
        {
          label: "Fréquence de la sauvegarde",
          example: "Automatique chaque nuit",
        },
        {
          label: "Mon test de vérification",
          example: "Le 1er du mois, j’ouvre un fichier de la sauvegarde",
        },
      ],
      tip: "Commence par le plus important : tes photos et tes documents administratifs. Le reste viendra ensuite.",
    },
    check: [
      {
        q: "Que signifie la règle 3-2-1 ?",
        options: [
          "3 mots de passe, 2 appareils, 1 compte",
          "3 copies, sur 2 supports, dont 1 hors de chez toi",
          "3 jours, 2 heures, 1 minute",
        ],
        answer: 1,
        why: "Plusieurs copies, sur des supports variés, dont une ailleurs : aucun accident ne peut tout détruire.",
      },
      {
        q: "Pourquoi garder une copie hors de chez toi ?",
        options: [
          "Pour qu’un incendie ou un vol ne détruise pas aussi la sauvegarde",
          "Pour économiser de la place",
          "Pour que personne n’y accède jamais",
        ],
        answer: 0,
        why: "Si tout est au même endroit, un seul sinistre emporte l’original et les copies.",
      },
      {
        q: "Une sauvegarde automatique, il faut quand même :",
        options: [
          "la supprimer tous les mois",
          "ne plus jamais y penser",
          "vérifier de temps en temps qu’on retrouve un fichier",
        ],
        answer: 2,
        why: "Seul un essai de restauration prouve que la sauvegarde fonctionne vraiment.",
      },
    ],
  },
  {
    id: "sec-vie-privee",
    idea: [
      "Ta vie privée, ce sont les informations que tu choisis de montrer : où tu habites, où tu travailles, qui sont tes proches, quand tu pars en vacances. Ces détails servent aux arnaqueurs, aux cambrioleurs ou aux curieux. Tu n’as pas à tout cacher, mais à choisir.",
      "Les réseaux sociaux et ton téléphone ont des réglages de confidentialité, souvent très ouverts au départ. Passe ton compte en privé si tu veux, vérifie qui voit tes publications, et regarde quelles applications ont accès à ta position, à ton micro, à tes photos et à tes contacts.",
      "Une règle simple : avant de publier, demande-toi si tu serais gêné que cette information se retrouve sur un panneau d’affichage. Évite aussi de montrer en direct ta maison vide ou ton adresse. Ce qui est publié peut être copié et reste longtemps.",
    ],
    keys: [
      "Tu choisis ce que tu montres : adresse, travail, proches, vacances.",
      "Vérifie les réglages de confidentialité de chaque réseau.",
      "Retire aux applis les accès qui ne servent pas (position, micro, contacts).",
      "Ce qui est publié peut être copié : réfléchis avant d’envoyer.",
    ],
    gesture: {
      intro:
        "Fais le tour de ta vie privée en cinq contrôles. Pour chacun, note ce que tu vérifies et ce que tu décides de changer.",
      fields: [
        {
          label: "Mon compte de réseau à régler",
          example: "Mon compte de photos de famille",
        },
        {
          label: "Qui voit mes publications ?",
          example: "Passer de « tout le monde » à « mes abonnés »",
        },
        {
          label: "Informations visibles sur mon profil",
          example: "Retirer mon numéro et ma ville exacte",
        },
        {
          label: "Applis qui utilisent ma position",
          example: "Garder seulement la carte, couper le reste",
        },
        {
          label: "Applis qui accèdent à mon micro ou mes photos",
          example: "Retirer l’accès à l’appli de jeux",
        },
        {
          label: "Ce que je ne publierai plus",
          example: "Mes départs en vacances en direct",
        },
      ],
      tip: "Refais ce tour une fois par an : les réglages changent avec les mises à jour des applis.",
    },
    check: [
      {
        q: "Pourquoi éviter de publier ses vacances en direct ?",
        options: [
          "Cela montre que ta maison est vide",
          "Ça consomme trop de données",
          "Ce n’est pas autorisé par les réseaux",
        ],
        answer: 0,
        why: "Annoncer une absence peut intéresser des cambrioleurs : publie plutôt à ton retour.",
      },
      {
        q: "Quel réglage vérifier sur ton téléphone ?",
        options: [
          "La couleur du fond d’écran",
          "Quelles applis peuvent utiliser ta position, ton micro et tes photos",
          "Le volume des sonneries",
        ],
        answer: 1,
        why: "Chaque accès donné à une appli est une porte ouverte sur ta vie privée.",
      },
      {
        q: "Une photo publiée sur un réseau :",
        options: [
          "disparaît toujours quand tu la supprimes",
          "n’est vue que par tes amis proches",
          "peut être copiée par d’autres et rester longtemps",
        ],
        answer: 2,
        why: "Dès qu’une information est publiée, quelqu’un peut la sauvegarder ou la partager.",
      },
    ],
  },
  {
    id: "sec-piratage",
    idea: [
      "Un jour, un de tes comptes peut être piraté : tu ne peux plus te connecter, des messages bizarres partent en ton nom, un achat inconnu apparaît. Pas de panique : l’important est d’agir vite et dans le bon ordre, avant que les dégâts ne s’étendent.",
      "L’ordre qui marche : d’abord reprendre la main (changer le mot de passe depuis un appareil sûr, activer la double vérification), puis prévenir (ta banque si de l’argent est en jeu, tes contacts si des messages sont partis), enfin vérifier tes autres comptes qui utilisaient le même mot de passe.",
      "Garde les preuves (captures d’écran) et, si de l’argent est touché ou si on usurpe ton identité, dépose plainte. Le site cybermalveillance.gouv.fr propose une aide gratuite : un diagnostic pas à pas et des professionnels près de chez toi.",
    ],
    keys: [
      "Agis vite, mais dans l’ordre : reprendre la main, puis prévenir.",
      "Change le mot de passe depuis un appareil sûr et active la double vérification.",
      "Préviens ta banque en cas d’argent en jeu, tes contacts si des messages sont partis.",
      "cybermalveillance.gouv.fr aide gratuitement.",
    ],
    gesture: {
      intro:
        "Prépare ta checklist d’urgence maintenant, quand tout va bien. Le jour où ça arrive, tu n’auras qu’à la suivre ligne par ligne.",
      fields: [
        {
          label: "1. Reprendre la main",
          example:
            "Changer le mot de passe du compte depuis mon téléphone, activer la double vérification",
        },
        {
          label: "2. Autres comptes au même mot de passe",
          example: "Les changer tous, en commençant par la messagerie",
        },
        {
          label: "3. Prévenir ma banque (si argent en jeu)",
          example: "Faire opposition à la carte avec le numéro au dos",
        },
        {
          label: "4. Prévenir mes contacts",
          example: "Un message : « Mon compte a été piraté, ne cliquez pas »",
        },
        {
          label: "5. Garder les preuves",
          example: "Captures d’écran des messages et des achats suspects",
        },
        {
          label: "6. Demander de l’aide",
          example: "cybermalveillance.gouv.fr, et dépôt de plainte si besoin",
        },
      ],
      tip: "Range cette checklist ailleurs que dans le compte concerné : tu dois pouvoir la lire quand tu es bloqué.",
    },
    check: [
      {
        q: "Ton compte est piraté. Quelle est la première chose à faire ?",
        options: [
          "Attendre quelques jours pour voir",
          "Reprendre la main : changer le mot de passe depuis un appareil sûr",
          "Supprimer tous tes messages",
        ],
        answer: 1,
        why: "Tant que le pirate a l’accès, il peut continuer : il faut d’abord le lui retirer.",
      },
      {
        q: "Pourquoi changer aussi les autres mots de passe identiques ?",
        options: [
          "Parce que le pirate les essaiera sur tes autres comptes",
          "Parce que c’est obligatoire",
          "Pour que les sites te remarquent",
        ],
        answer: 0,
        why: "Un mot de passe volé est testé partout : c’est pourquoi il doit être unique pour chaque compte.",
      },
      {
        q: "Où trouver une aide gratuite après un piratage ?",
        options: [
          "Sur n’importe quelle page trouvée dans un message",
          "Auprès de la personne qui t’a contacté après le piratage",
          "Sur cybermalveillance.gouv.fr",
        ],
        answer: 2,
        why: "C’est le dispositif officiel d’assistance : sérieux, gratuit et sans risque d’arnaque.",
      },
    ],
  },
  {
    id: "sec-entreprise",
    idea: [
      "Quand tu as une activité, tu manipules des données qui ne sont pas à toi : noms, adresses, téléphones, factures de tes clients. Tu es responsable de leur protection. Une fuite fait perdre la confiance de tes clients, et peut coûter une amende.",
      "Les bases à poser : un mot de passe unique pour chaque outil et la double vérification, des sauvegardes régulières, des appareils à jour (mises à jour installées), et des droits d’accès limités : chacun n’accède qu’à ce dont il a besoin. Quand quelqu’un quitte l’équipe, ferme ses accès le jour même.",
      "En France, le RGPD t’oblige à ne collecter que les données utiles, à dire à quoi elles servent et à les garder le temps nécessaire. Forme aussi tes proches collaborateurs aux faux mails : l’erreur humaine est la cause principale des incidents.",
    ],
    keys: [
      "Les données de tes clients sont sous ta responsabilité.",
      "Mots de passe uniques, double vérification et mises à jour à jour.",
      "Donne à chacun uniquement les accès dont il a besoin.",
      "Le RGPD : collecter peu, expliquer à quoi ça sert, ne pas garder trop longtemps.",
    ],
    gesture: {
      intro:
        "Fais la fiche de sécurité de ton activité. Elle liste les données que tu gardes, qui y accède et les protections en place.",
      fields: [
        {
          label: "Données de clients que je garde",
          example: "Nom, e-mail, téléphone, adresse de livraison",
        },
        {
          label: "Où elles sont rangées",
          example: "Mon tableur en ligne et ma boîte mail",
        },
        {
          label: "Qui y a accès",
          example: "Moi et mon assistante, avec chacun son compte",
        },
        {
          label: "Protections en place",
          example: "Mots de passe uniques, double vérification, mises à jour",
        },
        {
          label: "Mes sauvegardes",
          example: "Copie automatique chaque nuit, sur un autre support",
        },
        {
          label: "Si quelqu’un quitte l’équipe",
          example: "Je ferme ses accès le jour même",
        },
        {
          label: "Combien de temps je garde les données",
          example: "3 ans après le dernier achat, puis suppression",
        },
      ],
      tip: "Moins tu collectes de données, moins tu as à protéger : ne demande que ce dont tu as vraiment besoin.",
    },
    check: [
      {
        q: "À qui appartiennent les données de tes clients ?",
        options: [
          "À toi, tu en fais ce que tu veux",
          "Aux clients : tu dois les protéger et les utiliser à bon escient",
          "À personne",
        ],
        answer: 1,
        why: "Ce sont des données personnelles : tu en es responsable et tu dois en limiter l’usage.",
      },
      {
        q: "Un collaborateur quitte l’équipe. Tu dois :",
        options: [
          "fermer ses accès le jour même",
          "attendre la fin de l’année",
          "lui laisser ses mots de passe au cas où",
        ],
        answer: 0,
        why: "Un accès oublié est une porte ouverte : on le ferme dès le départ.",
      },
      {
        q: "Quelle bonne pratique relève du RGPD ?",
        options: [
          "Garder toutes les données pour toujours, au cas où",
          "Collecter le maximum d’informations sur chaque client",
          "Ne collecter que les données utiles et dire à quoi elles servent",
        ],
        answer: 2,
        why: "Le RGPD demande des données limitées au besoin, avec une finalité claire et une durée raisonnable.",
      },
    ],
  },
];
