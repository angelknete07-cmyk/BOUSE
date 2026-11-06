import type { Lesson } from "./lessons";

/**
 * Intelligence artificielle, suite du parcours : données, cas d'usage,
 * évaluation, cadre légal. Pédagogique : exemples fictifs ; le calendrier du
 * règlement européen sur l'IA est daté (sources concordantes consultées en
 * novembre 2026) et doit être vérifié dans les textes officiels.
 */
const editorialStatus =
  "Parcours pédagogique · exemples fictifs · calendrier réglementaire daté de novembre 2026, à vérifier dans les textes officiels · aucun conseil juridique personnalisé";

const cnil = {
  title: "CNIL · intelligence artificielle et RGPD",
  url: "https://www.cnil.fr/fr/intelligence-artificielle",
};
const aiActEu = {
  title: "Commission européenne · cadre réglementaire de l’IA",
  url: "https://digital-strategy.ec.europa.eu/fr/policies/regulatory-framework-ai",
};
const anssi = {
  title: "ANSSI · recommandations de sécurité pour l’IA générative",
  url: "https://cyber.gouv.fr/",
};

export const aiMoreLessons: Lesson[] = [
  {
    id: "ia-donnees-confidentialite",
    title: "Données personnelles et confidentialité avec l’IA",
    domain: "Intelligence artificielle",
    level: 1,
    minutes: 18,
    summary:
      "Ce que l’on colle dans un assistant peut être conservé, lu ou réutilisé. Protéger les données personnelles, les secrets de l’entreprise et respecter le RGPD.",
    skills: [
      "RGPD et minimisation",
      "Données sensibles et secrets",
      "Paramètres et contrats des services",
    ],
    prerequisites: ["comprendre-llm"],
    sections: [
      {
        title: "Pourquoi apprendre ça ?",
        body: [
          "Copier un contrat client, un tableau de salaires ou un dossier médical dans un assistant gratuit peut constituer une fuite de données, même sans mauvaise intention. Les conséquences peuvent être juridiques, commerciales et humaines.",
          "Utiliser l’IA de façon responsable commence par savoir ce que l’on transmet, à qui, et pour quoi.",
        ],
      },
      {
        title: "Les règles de base",
        body: [
          "Le règlement général sur la protection des données (RGPD) s’applique dès que l’on traite des informations sur une personne identifiable : nom, adresse électronique, identifiant, voix, image, mais aussi un ensemble d’indices permettant de la retrouver.",
          "Ses principes guident l’usage de l’IA : une finalité précise, une base légale, la minimisation (ne transmettre que ce qui est nécessaire), l’information des personnes, une durée de conservation limitée et la sécurité. Les données sensibles (santé, opinions, origine, orientation sexuelle, données biométriques) bénéficient d’une protection renforcée.",
          "Au-delà des données personnelles, les secrets des affaires (prix, stratégie, code source, informations clients) et les obligations de confidentialité contractuelles s’appliquent aussi aux outils d’IA.",
        ],
      },
      {
        title: "Choisir et paramétrer un service",
        body: [
          "Les services d’IA diffèrent sur trois points à vérifier dans leurs conditions : l’utilisation éventuelle des conversations pour entraîner les modèles (et la possibilité de s’y opposer), la durée de conservation, et le lieu de traitement des données.",
          "Les offres professionnelles prévoient souvent un contrat de sous-traitance des données, l’exclusion de l’entraînement et des contrôles d’accès. Une entreprise devrait définir quels outils sont autorisés et pour quelles données.",
          "Réduire les risques : anonymiser ou pseudonymiser avant de transmettre (remplacer les noms par des étiquettes), résumer plutôt que copier un document entier, ne jamais coller de mots de passe, clés d’accès ou données bancaires.",
        ],
      },
      {
        title: "Le point de vigilance",
        body: [
          "Pseudonymiser n’est pas anonymiser : si l’on peut retrouver la personne en croisant des informations, les données restent personnelles.",
          "Un document transmis à un assistant peut contenir des instructions cachées (injection de prompt) ou être exposé par une extension mal sécurisée : n’autorise que les intégrations nécessaires, et vérifie leurs permissions.",
        ],
      },
    ],
    example: {
      title: "Exemple fictif · un compte rendu de réunion client",
      body: "Julie veut faire résumer un compte rendu de réunion client par un assistant gratuit. Le document contient les noms des participants, les tarifs négociés et un problème de santé évoqué par un interlocuteur. Elle remplace les noms par « Client A » et « Contact 1 », supprime la mention de santé et les tarifs, puis demande le résumé. Pour l’avenir, son entreprise souscrit une offre professionnelle qui exclut l’entraînement sur ses données.",
    },
    exercise: {
      prompt:
        "Classe ces informations selon qu’on peut les transmettre telles quelles à un assistant grand public : un article de presse public ; la liste des clients avec leurs adresses électroniques ; un compte rendu anonymisé ; le mot de passe d’un logiciel ; un brouillon de courrier sans données personnelles.",
      hint: "Demande-toi si l’information identifie une personne, est secrète ou donne un accès.",
      answer:
        "Transmissibles : l’article public, le compte rendu réellement anonymisé, le brouillon sans données personnelles. À ne pas transmettre : la liste de clients avec adresses (données personnelles) et le mot de passe (secret d’accès).",
      explanation:
        "La minimisation est le meilleur réflexe : ne transmettre que ce qui est nécessaire à la tâche, après avoir retiré ce qui identifie ou donne accès.",
    },
    quiz: [
      {
        id: "ia-donnees-1",
        question:
          "Quel principe du RGPD invite à ne transmettre à une IA que les données nécessaires ?",
        options: ["La portabilité.", "La minimisation.", "Le droit à l’oubli."],
        answer: 1,
        explanation:
          "La minimisation limite les données traitées à ce qui est strictement nécessaire à la finalité.",
      },
      {
        id: "ia-donnees-2",
        question:
          "Remplacer les noms par « Client A » suffit-il toujours à anonymiser un document ?",
        options: [
          "Oui, dès que les noms disparaissent.",
          "Non : si d’autres indices permettent de retrouver la personne, les données restent personnelles.",
          "Oui, si le document est court.",
        ],
        answer: 1,
        explanation:
          "C’est une pseudonymisation : l’anonymisation exige qu’aucune réidentification ne soit raisonnablement possible.",
      },
    ],
    application:
      "Liste les outils d’IA que tu utilises, vérifie pour chacun l’entraînement sur tes données et la durée de conservation, puis écris tes trois règles de ce qu’il ne faut jamais y coller.",
    idea: {
      title: "Ma charte d’usage de l’IA",
      description:
        "Outils autorisés, données interdites, réglages vérifiés et réflexes d’anonymisation.",
    },
    sources: [
      cnil,
      anssi,
      {
        title: "CNIL · comprendre le RGPD",
        url: "https://www.cnil.fr/fr/comprendre-le-rgpd",
      },
    ],
    version: "1.0.0",
    editorialStatus,
    flashcards: [
      {
        front: "Minimisation",
        back: "Ne traiter que les données strictement nécessaires à la finalité.",
      },
      {
        front: "Pseudonymiser ou anonymiser",
        back: "Pseudonymiser masque l’identité ; anonymiser rend toute réidentification impossible en pratique.",
      },
      {
        front: "Trois points à vérifier",
        back: "Entraînement sur les données, durée de conservation, lieu de traitement.",
      },
    ],
  },
  {
    id: "ia-cas-usage",
    title: "Choisir un bon cas d’usage de l’IA",
    domain: "Intelligence artificielle",
    level: 1,
    minutes: 18,
    summary:
      "Toutes les tâches ne gagnent pas à passer par l’IA. Repérer celles où elle fait gagner du temps sans risque excessif, et chiffrer le gain réel, vérification comprise.",
    skills: [
      "Critères d’un bon cas d’usage",
      "Gain net et coût de vérification",
      "Projet pilote",
    ],
    prerequisites: ["comprendre-llm"],
    sections: [
      {
        title: "Pourquoi apprendre ça ?",
        body: [
          "Beaucoup d’entreprises testent l’IA partout puis abandonnent, faute de gain mesurable. D’autres l’utilisent là où une erreur coûte cher, sans contrôle.",
          "Bien choisir son premier cas d’usage donne un résultat visible, rassure les équipes et apprend à travailler avec l’outil.",
        ],
      },
      {
        title: "Les critères",
        body: [
          "Une bonne tâche est fréquente ou volumineuse (le gain se répète), fondée sur du texte ou des données disponibles, vérifiable rapidement par une personne compétente, et tolérante à l’erreur ou facilement corrigible.",
          "Exemples souvent pertinents : premiers jets de courriers ou de fiches produit, résumés de documents longs, classement de demandes entrantes, extraction d’informations de factures avec contrôle, aide à la rédaction de code testée.",
          "À éviter ou à encadrer fortement : décisions qui affectent des personnes (recrutement, crédit, santé), chiffres non vérifiés présentés comme exacts, réponses juridiques ou médicales sans relecture par un professionnel.",
        ],
      },
      {
        title: "Chiffrer le gain",
        body: [
          "Gain net mensuel = (temps gagné par tâche × nombre de tâches × coût horaire) − (temps de vérification et de correction × coût horaire) − coût de l’outil. Le temps de vérification est souvent oublié : c’est lui qui décide.",
          "Le gain n’est pas seulement du temps : qualité plus régulière, délai de réponse, disponibilité. Mais il se mesure, sur un échantillon réel, avant de généraliser.",
          "Un projet pilote fixe la tâche, l’outil, la mesure de départ (temps et qualité sans IA), la durée et les critères de succès. À la fin, on décide : généraliser, ajuster ou arrêter.",
        ],
      },
      {
        title: "Le point de vigilance",
        body: [
          "L’IA déplace le travail : moins de rédaction, plus de relecture. Si la relecture est bâclée, les erreurs passent en production.",
          "Former les personnes concernées et définir qui est responsable du résultat final compte autant que l’outil choisi. Le règlement européen sur l’IA demande d’ailleurs aux organisations qui déploient des systèmes d’IA de veiller à un niveau suffisant de maîtrise de l’IA de leur personnel.",
        ],
      },
    ],
    example: {
      title: "Exemple fictif · un service client",
      body: "Une boutique en ligne reçoit 600 courriels par mois. Un agent met 6 minutes par réponse. Avec un assistant qui propose un brouillon, il met 2 minutes pour relire et corriger, plus 1 minute sur les cas difficiles qu’il réécrit. Le pilote d’un mois mesure 3 minutes gagnées en moyenne par courriel, soit 30 heures par mois, pour un abonnement de 60 €. La satisfaction client, mesurée avant et pendant, ne baisse pas : l’équipe généralise, avec une relecture obligatoire.",
    },
    exercise: {
      prompt:
        "Une tâche est faite 200 fois par mois en 10 minutes. Avec l’IA, elle prend 3 minutes de génération et 4 minutes de vérification. Le coût horaire est de 30 € et l’outil coûte 40 € par mois. Calcule le gain net mensuel.",
      hint: "Temps gagné par tâche = 10 − (3 + 4). Convertis en heures, multiplie par le coût horaire, retire le coût de l’outil.",
      answer:
        "Gain par tâche : 3 minutes. Sur 200 tâches : 600 minutes, soit 10 heures, donc 300 €. Gain net : 300 − 40 = 260 € par mois.",
      explanation:
        "Sans les 4 minutes de vérification, on aurait annoncé 7 minutes de gain : plus du double de la réalité.",
    },
    quiz: [
      {
        id: "ia-usage-1",
        question:
          "Quelle tâche est le meilleur premier candidat pour un pilote d’IA ?",
        options: [
          "Décider seul de l’acceptation des candidats à un emploi.",
          "Proposer des brouillons de réponses à des demandes fréquentes, relus par une personne.",
          "Calculer sans vérification les montants de factures clients.",
        ],
        answer: 1,
        explanation:
          "Fréquente, vérifiable et corrigible : la tâche limite le risque tout en offrant un gain mesurable.",
      },
      {
        id: "ia-usage-2",
        question:
          "Quel coût est le plus souvent oublié quand on estime le gain d’un outil d’IA ?",
        options: [
          "Le coût de l’électricité.",
          "Le temps de vérification et de correction des résultats.",
          "Le prix du clavier.",
        ],
        answer: 1,
        explanation:
          "La vérification est indispensable et peut absorber une grande partie du temps gagné.",
      },
    ],
    application:
      "Liste cinq tâches répétitives de ton activité, note-les sur les quatre critères, chiffre le gain net de la meilleure et définis un pilote d’un mois.",
    idea: {
      title: "Mon premier pilote d’IA",
      description:
        "Une tâche choisie sur quatre critères, son gain net chiffré et les règles du pilote.",
    },
    sources: [
      cnil,
      aiActEu,
      {
        title: "France Num · l’IA pour les TPE et PME",
        url: "https://www.francenum.gouv.fr/",
      },
    ],
    version: "1.0.0",
    editorialStatus,
    flashcards: [
      {
        front: "Bon cas d’usage",
        back: "Fréquent, fondé sur des données disponibles, vérifiable vite, tolérant à l’erreur.",
      },
      {
        front: "Gain net",
        back: "Temps gagné − temps de vérification, valorisés, moins le coût de l’outil.",
      },
      {
        front: "Projet pilote",
        back: "Tâche, mesure de départ, durée, critères de succès, puis décision.",
      },
    ],
  },
  {
    id: "ia-evaluer-fiabilite",
    title: "Évaluer et tester une IA",
    domain: "Intelligence artificielle",
    level: 2,
    minutes: 20,
    summary:
      "Une démonstration réussie ne prouve rien. Construire un jeu de cas, mesurer les erreurs graves, la variabilité et les biais avant de faire confiance à un outil.",
    skills: [
      "Jeu de cas de test",
      "Erreurs graves et variabilité",
      "Biais et supervision humaine",
    ],
    prerequisites: ["prompt-structure"],
    sections: [
      {
        title: "Pourquoi apprendre ça ?",
        body: [
          "Un modèle peut réussir dix exemples choisis et échouer sur le onzième, plus banal. Sans évaluation méthodique, on découvre les erreurs chez les clients.",
          "Évaluer permet aussi de comparer deux outils, deux consignes ou deux versions d’un modèle sur une base commune.",
        ],
      },
      {
        title: "Construire l’évaluation",
        body: [
          "Un jeu de cas de test rassemble des exemples réels représentatifs, avec le résultat attendu ou une grille de notation. Il inclut des cas faciles, des cas ambigus, des données manquantes, des contradictions et des contenus hostiles (injection de prompt).",
          "Les critères doivent être observables : exactitude des faits et des chiffres, respect du format, absence d’invention, signalement des incertitudes, ton adapté. On distingue les erreurs graves (fausse information transmise, donnée sensible exposée) des imperfections mineures.",
          "La référence de comparaison est le processus actuel : une IA qui se trompe dans 5 % des cas peut être meilleure qu’un processus humain pressé qui se trompe dans 8 % des cas, ou pire si ses erreurs sont plus graves.",
        ],
      },
      {
        title: "Variabilité, biais, supervision",
        body: [
          "Les modèles génératifs ne répondent pas toujours la même chose à la même question. Lancer plusieurs fois chaque cas mesure la stabilité ; une réponse correcte une fois sur deux n’est pas fiable.",
          "Les biais apparaissent quand le modèle traite différemment des cas comparables selon un critère non pertinent (genre, origine, âge, quartier). On les teste en faisant varier ce seul critère dans des cas par ailleurs identiques.",
          "La supervision humaine doit être réelle : une personne compétente, disposant du temps et de l’autorité pour corriger ou refuser le résultat. Une validation automatique « par habitude » n’est pas une supervision.",
        ],
      },
      {
        title: "Le point de vigilance",
        body: [
          "Réévaluer après chaque changement : nouvelle version du modèle, nouvelle consigne, nouveau type de données. Une performance mesurée une fois ne vaut pas pour toujours.",
          "Mesurer aussi le coût et le délai par tâche lorsque l’usage est répété : un outil très précis mais trop lent ou trop cher peut ne pas convenir.",
        ],
      },
    ],
    example: {
      title: "Exemple fictif · extraire des montants de factures",
      body: "Un cabinet teste un outil qui extrait montant, date et fournisseur de factures. Il prépare 50 factures réelles anonymisées, dont 10 difficiles (scans flous, devises étrangères, avoirs). Chaque facture est traitée trois fois. Résultat : 46 extractions correctes et stables, 3 erreurs de date, et 1 avoir lu comme une facture positive, l’erreur grave. Le cabinet ajoute une règle : tout montant négatif ou tout avoir passe en vérification manuelle.",
    },
    exercise: {
      prompt:
        "Sur 40 cas de test, un outil donne 34 réponses correctes, 4 imperfections mineures et 2 erreurs graves. Calcule le taux de réussite complète et le taux d’erreurs graves. L’outil peut-il être utilisé sans relecture ?",
      hint: "Taux = nombre de cas ÷ 40.",
      answer:
        "Réussite complète : 34 ÷ 40 = 85 %. Erreurs graves : 2 ÷ 40 = 5 %. Avec 5 % d’erreurs graves, l’outil ne peut pas être utilisé sans relecture ; il peut l’être avec une vérification ciblée si l’on sait détecter les cas à risque.",
      explanation:
        "Le taux moyen de réussite ne suffit pas : c’est la fréquence et la gravité des erreurs qui fixent le niveau de contrôle nécessaire.",
    },
    quiz: [
      {
        id: "ia-eval-1",
        question:
          "Pourquoi lancer plusieurs fois le même cas de test sur un modèle génératif ?",
        options: [
          "Pour obtenir une réponse plus longue.",
          "Pour mesurer la stabilité des réponses, qui peuvent varier d’un essai à l’autre.",
          "Pour réduire le coût de l’outil.",
        ],
        answer: 1,
        explanation:
          "Une réponse correcte seulement de temps en temps n’est pas fiable ; la répétition révèle cette variabilité.",
      },
      {
        id: "ia-eval-2",
        question:
          "Comment tester un biais dans un outil de tri de candidatures ?",
        options: [
          "Lui demander s’il est biaisé.",
          "Soumettre des dossiers identiques qui ne diffèrent que par un critère non pertinent, et comparer les résultats.",
          "Vérifier qu’il répond vite.",
        ],
        answer: 1,
        explanation:
          "Faire varier un seul critère dans des cas comparables isole son effet sur le résultat.",
      },
    ],
    application:
      "Pour un outil d’IA que tu utilises, constitue un jeu de dix cas réels dont trois difficiles, définis tes critères et ce qui constitue une erreur grave, puis lance chaque cas deux fois.",
    idea: {
      title: "Mon banc d’essai pour un outil d’IA",
      description:
        "Dix cas, des critères observables, les erreurs graves définies et la règle de supervision.",
    },
    sources: [
      cnil,
      anssi,
      {
        title: "NIST · AI Risk Management Framework",
        url: "https://www.nist.gov/itl/ai-risk-management-framework",
      },
    ],
    version: "1.0.0",
    editorialStatus,
    flashcards: [
      {
        front: "Jeu de cas de test",
        back: "Exemples réels représentatifs, avec résultat attendu, dont des cas difficiles et hostiles.",
      },
      {
        front: "Variabilité",
        back: "Un modèle génératif peut répondre différemment à la même question : tester plusieurs fois.",
      },
      {
        front: "Supervision réelle",
        back: "Une personne compétente qui a le temps et l’autorité de corriger ou refuser.",
      },
    ],
  },
  {
    id: "ia-cadre-legal",
    title: "Le cadre légal de l’IA en Europe",
    domain: "Intelligence artificielle",
    level: 2,
    minutes: 20,
    summary:
      "Le règlement européen sur l’IA classe les usages par niveau de risque. Savoir ce qui est interdit, encadré ou libre, et quelles obligations concernent une petite entreprise.",
    skills: [
      "Approche par les risques",
      "Calendrier d’application",
      "Transparence et droits d’auteur",
    ],
    prerequisites: ["ia-donnees-confidentialite"],
    sections: [
      {
        title: "Pourquoi apprendre ça ?",
        body: [
          "Le règlement européen sur l’intelligence artificielle (AI Act), entré en vigueur en août 2024, s’applique progressivement. Il concerne ceux qui développent des systèmes d’IA, mais aussi ceux qui les déploient dans leur activité.",
          "Pour une petite entreprise, l’enjeu est surtout de savoir si un usage est interdit, à haut risque, soumis à transparence ou libre.",
        ],
      },
      {
        title: "Quatre niveaux de risque",
        body: [
          "Interdits : certaines pratiques jugées inacceptables, comme la notation sociale des personnes, la manipulation exploitant leurs vulnérabilités ou certaines formes d’identification biométrique et de reconnaissance des émotions au travail et à l’école.",
          "Haut risque : des usages qui affectent fortement les personnes (recrutement et gestion des salariés, accès au crédit, éducation, santé, infrastructures, justice). Ils imposent gestion des risques, qualité des données, documentation, supervision humaine et contrôle de conformité.",
          "Transparence : informer qu’on interagit avec une IA (agent conversationnel), signaler les contenus générés ou manipulés (hypertrucages), marquer de façon détectable les contenus synthétiques. Risque minimal : la plupart des usages courants (filtres, aide à la rédaction) ne sont pas soumis à des obligations particulières, en dehors des règles générales.",
        ],
      },
      {
        title: "Le calendrier",
        body: [
          "Selon les sources consultées : les interdictions et l’obligation de maîtrise de l’IA par le personnel s’appliquent depuis février 2025 ; les obligations des modèles d’IA à usage général depuis août 2025 ; les obligations de transparence à partir d’août 2026.",
          "Un règlement de simplification adopté en 2026 (dit « omnibus numérique ») a reporté les obligations des systèmes à haut risque : au 2 décembre 2027 pour les usages listés à l’annexe III (emploi, crédit, éducation…), et au 2 août 2028 pour l’IA intégrée à des produits réglementés. Vérifie ces dates dans les textes publiés au Journal officiel de l’Union européenne.",
          "Le RGPD continue de s’appliquer en parallèle, tout comme le droit d’auteur : les contenus utilisés pour entraîner ou générés par une IA posent des questions de droits encore en évolution, et les titulaires de droits peuvent s’opposer à la fouille de leurs contenus.",
        ],
      },
      {
        title: "Le point de vigilance",
        body: [
          "Utiliser un outil d’IA pour trier des candidatures ou évaluer des salariés fait entrer dans la catégorie à haut risque : la supervision humaine, l’information des personnes et la documentation deviennent des obligations, pas des options.",
          "Les sanctions prévues peuvent être élevées. En cas de doute sur la qualification d’un usage, consulte les lignes directrices de la Commission européenne et les publications de la CNIL, ou un juriste.",
        ],
      },
    ],
    example: {
      title: "Exemple fictif · trois usages dans une PME",
      body: "Une PME utilise un assistant pour rédiger ses publications : risque minimal, mais elle forme ses équipes à son usage. Elle installe un agent conversationnel sur son site : elle doit indiquer aux visiteurs qu’ils échangent avec une IA. Elle envisage un logiciel qui classe automatiquement les candidatures : usage à haut risque, avec supervision humaine et information des candidats. Elle décide de garder un tri humain et d’utiliser l’outil seulement pour résumer les dossiers.",
    },
    exercise: {
      prompt:
        "Classe ces usages selon le niveau de risque du règlement : un filtre anti-spam ; un agent conversationnel de service client ; un logiciel qui note les salariés pour décider des promotions ; un système de notation sociale des citoyens.",
      hint: "Interdit, haut risque, transparence, risque minimal.",
      answer:
        "Filtre anti-spam : risque minimal. Agent conversationnel : obligation de transparence (informer qu’il s’agit d’une IA). Notation des salariés pour les promotions : haut risque. Notation sociale des citoyens : pratique interdite.",
      explanation:
        "Le niveau dépend de l’usage et de son effet sur les personnes, pas de la technologie employée.",
    },
    quiz: [
      {
        id: "ia-legal-1",
        question:
          "Une entreprise installe un agent conversationnel sur son site. Quelle obligation principale ?",
        options: [
          "Aucune obligation.",
          "Informer les utilisateurs qu’ils interagissent avec une IA.",
          "Obtenir une autorisation préalable de la CNIL.",
        ],
        answer: 1,
        explanation:
          "C’est une obligation de transparence : la personne doit savoir qu’elle ne parle pas à un humain.",
      },
      {
        id: "ia-legal-2",
        question:
          "Pourquoi le tri automatisé de candidatures relève-t-il du haut risque ?",
        options: [
          "Parce qu’il utilise beaucoup de données.",
          "Parce qu’il affecte l’accès à l’emploi, avec un risque d’atteinte aux droits des personnes.",
          "Parce qu’il est coûteux.",
        ],
        answer: 1,
        explanation:
          "Le règlement classe à haut risque les usages ayant un effet important sur la vie des personnes, comme l’emploi.",
      },
    ],
    application:
      "Liste les usages de l’IA dans ton activité, classe chacun selon les quatre niveaux de risque et note les obligations à respecter et leur date d’application.",
    idea: {
      title: "Cartographier mes usages de l’IA",
      description:
        "Usages listés, niveau de risque, obligations et calendrier à vérifier.",
    },
    sources: [
      aiActEu,
      cnil,
      {
        title:
          "EUR-Lex · règlement (UE) 2024/1689 sur l’intelligence artificielle",
        url: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
      },
    ],
    version: "1.0.0",
    editorialStatus,
    flashcards: [
      {
        front: "Quatre niveaux",
        back: "Interdit, haut risque, transparence, risque minimal.",
      },
      {
        front: "Haut risque",
        back: "Emploi, crédit, éducation, santé… : supervision humaine, documentation, gestion des risques.",
      },
      {
        front: "Report de 2026",
        back: "Haut risque de l’annexe III au 2 décembre 2027, produits réglementés au 2 août 2028 (à vérifier).",
      },
    ],
  },
];
