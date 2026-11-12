import type { SkillContent } from "./types";

/** Tableur : les compétences sans leçon longue. */
export const skills: SkillContent[] = [
  {
    id: "tab-bases",
    idea: [
      "Un tableur (Excel, Google Sheets) est une grande grille. Chaque petite case s’appelle une cellule. Les colonnes portent des lettres (A, B, C…), les lignes des numéros (1, 2, 3…) : la cellule B3, c’est la colonne B, ligne 3.",
      "Tu y écris du texte, des nombres ou des formules. Une formule commence toujours par le signe = : par exemple =B2+B3 additionne deux cellules. La case se met à jour toute seule quand tu changes un nombre.",
      "Pour une somme, utilise SOMME (en anglais SUM) : =SOMME(B2:B10) additionne toutes les cellules de B2 à B10. Mets une ligne de titres en haut, un type d’information par colonne, et ton tableau sera clair.",
    ],
    keys: [
      "Une cellule se repère par sa colonne et sa ligne : B3.",
      "Une formule commence par le signe =.",
      "=SOMME(B2:B10) (SUM en anglais) additionne une plage.",
      "Une ligne de titres, un type d’information par colonne.",
    ],
    gesture: {
      intro:
        "Fabrique ton premier tableau : tes dépenses du mois. Recopie cette structure dans un tableur vide.",
      fields: [
        { label: "Ligne 1 (titres)", example: "A1 : Dépense | B1 : Montant" },
        { label: "Première dépense", example: "A2 : Courses | B2 : 85" },
        { label: "Deuxième dépense", example: "A3 : Transport | B3 : 40" },
        { label: "Troisième dépense", example: "A4 : Loisirs | B4 : 30" },
        {
          label: "Formule du total",
          example: "B5 : =SOMME(B2:B4) (SUM en anglais)",
        },
        { label: "Résultat attendu", example: "155" },
      ],
      tip: "Écris le total dans une cellule à part avec une formule : il se recalcule tout seul quand tu modifies un montant.",
    },
    check: [
      {
        q: "Que désigne la cellule C4 ?",
        options: [
          "Colonne C, ligne 4",
          "Ligne C, colonne 4",
          "Les cellules C et 4",
        ],
        answer: 0,
        why: "La lettre indique la colonne, le chiffre indique la ligne.",
      },
      {
        q: "Par quoi commence une formule ?",
        options: ["Un point", "Le signe =", "Une parenthèse"],
        answer: 1,
        why: "Le signe = dit au tableur que ce qui suit est un calcul.",
      },
      {
        q: "Quelle formule additionne les cellules de B2 à B10 ?",
        options: ["=B2+B10", "=SOMME(B2:B10)", "=SOMME(B2;B10;)"],
        answer: 1,
        why: "SOMME(B2:B10) (SUM en anglais) additionne toute la plage.",
      },
    ],
  },
  {
    id: "tab-formules",
    idea: [
      "Cinq formules couvrent presque tous les besoins : SOMME (SUM) additionne, MOYENNE (AVERAGE) calcule la moyenne, MIN et MAX donnent le plus petit et le plus grand, et SI (IF) fait un choix selon une condition.",
      'Exemples : =MOYENNE(B2:B10) donne la moyenne ; =MAX(B2:B10) la plus grande valeur. La formule SI s’écrit =SI(condition ; si vrai ; si faux), par exemple =SI(B2>100;"Cher";"OK") : elle affiche « Cher » si B2 dépasse 100, sinon « OK ».',
      "Attention au séparateur : en français, les arguments se séparent par un point-virgule (;). Les versions anglaises utilisent la virgule (,). Si une formule ne marche pas, vérifie d’abord ça et les parenthèses.",
    ],
    keys: [
      "SOMME (SUM), MOYENNE (AVERAGE), MIN, MAX, SI (IF).",
      "=SI(condition ; si vrai ; si faux) fait un choix automatique.",
      "En français : point-virgule ; en anglais : virgule.",
      "Une formule qui échoue : vérifie parenthèses et séparateurs.",
    ],
    gesture: {
      intro:
        "Exerce-toi sur une colonne de notes en B2:B6 (12, 15, 9, 18, 14). Écris chaque formule dans une cellule et vérifie le résultat.",
      fields: [
        { label: "Somme", example: "=SOMME(B2:B6) → 68" },
        { label: "Moyenne", example: "=MOYENNE(B2:B6) → 13,6" },
        { label: "Plus petite valeur", example: "=MIN(B2:B6) → 9" },
        { label: "Plus grande valeur", example: "=MAX(B2:B6) → 18" },
        { label: "Condition", example: '=SI(B2>=10;"Reçu";"À revoir") → Reçu' },
      ],
      tip: "Si ton tableur est en anglais, remplace SOMME par SUM, MOYENNE par AVERAGE, SI par IF, et les ; par des virgules.",
    },
    check: [
      {
        q: "Quelle formule donne la moyenne de B2 à B6 ?",
        options: ["=MOYENNE(B2:B6)", "=MAX(B2:B6)", "=SOMME(B2:B6)"],
        answer: 0,
        why: "MOYENNE (AVERAGE en anglais) calcule la moyenne d’une plage.",
      },
      {
        q: '=SI(B2>=10;"Reçu";"À revoir") affiche « Reçu » quand :',
        options: [
          "B2 est plus petit que 10",
          "B2 vaut 10 ou plus",
          "B2 est vide",
        ],
        answer: 1,
        why: "Si la condition B2>=10 est vraie, on obtient la première valeur : « Reçu ».",
      },
      {
        q: "Ta formule ne marche pas dans un tableur en français. Premier réflexe ?",
        options: [
          "Vérifier les parenthèses et le point-virgule",
          "Changer d’ordinateur",
          "Effacer tout le tableau",
        ],
        answer: 0,
        why: "Les erreurs les plus courantes viennent des parenthèses et du séparateur.",
      },
    ],
  },
  {
    id: "tab-trier",
    idea: [
      "Quand un tableau contient beaucoup de lignes, trier et filtrer te fait gagner un temps fou. Trier réorganise les lignes (par ordre alphabétique, du plus petit au plus grand, par date). Filtrer cache les lignes qui ne t’intéressent pas, sans les supprimer.",
      "Pour que ça marche, ton tableau doit avoir une ligne de titres et pas de ligne ni colonne vide au milieu. Sélectionne une cellule du tableau, puis active le tri ou le filtre depuis le menu Données (le bouton en forme d’entonnoir).",
      "Un tri doit toujours concerner toutes les colonnes ensemble : sinon une colonne se mélange avec les autres et les données ne correspondent plus. Un filtre est réversible : tu peux l’enlever à tout moment pour retrouver toutes les lignes.",
    ],
    keys: [
      "Trier réorganise les lignes ; filtrer cache celles qui ne servent pas.",
      "Il faut une ligne de titres et aucun trou dans le tableau.",
      "Trie toujours toutes les colonnes ensemble.",
      "Un filtre se retire sans rien perdre.",
    ],
    gesture: {
      intro:
        "Prépare un tableau de ventes et exerce-toi au tri et au filtre. Note ce que tu obtiens à chaque étape.",
      fields: [
        {
          label: "Colonnes du tableau",
          example: "Date | Client | Produit | Montant",
        },
        {
          label: "Trier par montant décroissant",
          example: "les plus grosses ventes en haut",
        },
        { label: "Trier par date", example: "du plus ancien au plus récent" },
        { label: "Filtrer sur un client", example: "Client = Martin" },
        { label: "Filtrer sur un montant", example: "Montant supérieur à 100" },
        { label: "Retirer le filtre", example: "toutes les lignes reviennent" },
      ],
      tip: "Fais d’abord une copie de ton fichier avant ton premier tri : en cas d’erreur, tu retrouves l’original.",
    },
    check: [
      {
        q: "Quelle est la différence entre trier et filtrer ?",
        options: [
          "Trier réorganise ; filtrer cache certaines lignes",
          "Les deux suppriment des lignes",
          "Il n’y en a aucune",
        ],
        answer: 0,
        why: "Le tri change l’ordre ; le filtre masque temporairement certaines lignes.",
      },
      {
        q: "Que faut-il éviter pour trier correctement ?",
        options: [
          "Une ligne de titres",
          "Trier une seule colonne séparément des autres",
          "Un tableau bien rangé",
        ],
        answer: 1,
        why: "Trier une seule colonne désaligne les données par rapport aux autres colonnes.",
      },
      {
        q: "Un filtre supprime-t-il des données ?",
        options: [
          "Oui, définitivement",
          "Non, il les masque et on peut le retirer",
          "Oui, mais seulement les vides",
        ],
        answer: 1,
        why: "Un filtre cache les lignes sans les effacer : on peut le retirer à tout moment.",
      },
    ],
  },
  {
    id: "tab-graphique",
    idea: [
      "Un graphique montre en un coup d’œil ce que des chiffres disent mal. Pour qu’il soit utile, il faut choisir le bon type selon ce que tu veux montrer : comparer, suivre une évolution ou montrer une répartition.",
      "Les barres (ou colonnes) comparent des catégories : les ventes par produit. La courbe suit une évolution dans le temps : les ventes mois après mois. Le camembert montre la part de chacun dans un total, à condition d’avoir peu de parts (cinq au maximum).",
      "Pour le créer : sélectionne les données (titres inclus), puis insère un graphique depuis le menu Insertion. Donne-lui un titre clair, nomme les axes et enlève tout ce qui décore sans informer.",
    ],
    keys: [
      "Barres : comparer. Courbe : suivre une évolution. Camembert : répartition.",
      "Le camembert se limite à quelques parts.",
      "Sélectionne les données avec leurs titres avant d’insérer.",
      "Un titre clair, des axes nommés, aucune décoration inutile.",
    ],
    gesture: {
      intro:
        "Choisis le bon graphique pour chaque question, puis crée-en un avec tes propres chiffres.",
      fields: [
        {
          label: "La question à illustrer",
          example: "Quel produit se vend le mieux ?",
        },
        { label: "Le type de graphique", example: "barres" },
        {
          label: "Les données sélectionnées",
          example: "A1:B6 (produits et ventes, titres inclus)",
        },
        {
          label: "Le titre du graphique",
          example: "Ventes par produit en mars",
        },
        {
          label: "Les axes à nommer",
          example: "produits en bas, ventes en euros à gauche",
        },
        {
          label: "Ce que le graphique montre",
          example: "le produit C se vend deux fois plus que les autres",
        },
      ],
      tip: "Un graphique doit répondre à une seule question. S’il en pose deux, fais-en deux.",
    },
    check: [
      {
        q: "Quel graphique pour suivre les ventes mois après mois ?",
        options: ["Camembert", "Courbe", "Aucun"],
        answer: 1,
        why: "La courbe montre une évolution dans le temps.",
      },
      {
        q: "Quand utiliser un camembert ?",
        options: [
          "Pour montrer la part de chacun dans un total, avec peu de parts",
          "Pour suivre une évolution sur douze mois",
          "Pour comparer vingt catégories",
        ],
        answer: 0,
        why: "Le camembert montre une répartition, il devient illisible avec trop de parts.",
      },
      {
        q: "Que mettre sur un graphique pour qu’il soit clair ?",
        options: [
          "Un titre clair et des axes nommés",
          "Le plus de couleurs possible",
          "Aucun titre",
        ],
        answer: 0,
        why: "Un titre et des axes nommés disent ce que montre le graphique.",
      },
    ],
  },
  {
    id: "tab-tcd",
    idea: [
      "Un tableau croisé dynamique (TCD) est un tableau qui résume une longue liste en quelques lignes, sans écrire de formule. Par exemple : mille lignes de ventes deviennent le total par produit ou par mois, en quelques clics.",
      "Tu choisis quatre choses : les lignes (par quoi regrouper : produit), les colonnes (une seconde façon de regrouper : mois), les valeurs (ce qu’on calcule : la somme des ventes) et éventuellement un filtre. Tu les glisses dans les zones prévues.",
      "Ta liste de départ doit être propre : une ligne de titres, une information par colonne, pas de trou. Le TCD se crée depuis le menu Insertion (Excel : Tableau croisé dynamique ; Google Sheets : Tableau croisé dynamique aussi). Il se met à jour quand tu actualises.",
    ],
    keys: [
      "Un TCD résume une longue liste sans formule.",
      "Lignes, colonnes, valeurs, filtre : tu choisis et tu glisses.",
      "La liste de départ doit être propre, sans trou.",
      "Il faut l’actualiser quand les données changent.",
    ],
    gesture: {
      intro:
        "À partir d’une liste de ventes (Date, Produit, Client, Montant), prépare ton TCD. Note ce que tu places dans chaque zone.",
      fields: [
        { label: "Les données de départ", example: "A1:D1000 avec titres" },
        { label: "Zone Lignes", example: "Produit" },
        { label: "Zone Colonnes (facultatif)", example: "Mois" },
        { label: "Zone Valeurs", example: "Somme de Montant" },
        { label: "Zone Filtre (facultatif)", example: "Client" },
        {
          label: "Ce que je lis dans le résultat",
          example: "le produit B rapporte le plus en mai",
        },
      ],
      tip: "Si le TCD affiche des résultats bizarres, vérifie que tes montants sont bien des nombres et pas du texte.",
    },
    check: [
      {
        q: "À quoi sert un tableau croisé dynamique ?",
        options: [
          "À résumer une longue liste sans formule",
          "À écrire des lettres",
          "À supprimer des lignes",
        ],
        answer: 0,
        why: "Il regroupe et calcule en quelques clics à partir d’une longue liste.",
      },
      {
        q: "Où places-tu ce que tu veux calculer (la somme des ventes) ?",
        options: ["Dans Lignes", "Dans Valeurs", "Dans Filtre"],
        answer: 1,
        why: "La zone Valeurs contient les nombres à additionner ou à moyenner.",
      },
      {
        q: "Comment doit être la liste de départ ?",
        options: [
          "Avec des cases vides au milieu",
          "Propre : titres en haut, une info par colonne, sans trou",
          "Peu importe",
        ],
        answer: 1,
        why: "Un TCD lit ta liste ligne par ligne : elle doit être régulière.",
      },
    ],
  },
  {
    id: "tab-recherchev",
    idea: [
      "Parfois, l’information dont tu as besoin est dans un autre tableau. Par exemple : une liste de commandes avec seulement le code produit, et une liste de produits avec leurs prix. Une formule de recherche va chercher le prix dans la bonne ligne.",
      "La formule moderne est RECHERCHEX (XLOOKUP en anglais), disponible dans les versions récentes d’Excel et dans Google Sheets. Elle s’écrit =RECHERCHEX(ce_que_je_cherche ; où_chercher ; quoi_renvoyer). Les anciennes versions utilisent RECHERCHEV (VLOOKUP) ; elle sert au même but.",
      "Pour que la recherche réussisse, le code cherché doit être écrit exactement pareil dans les deux tableaux (même orthographe, pas d’espace en trop). Ajoute « si introuvable » pour afficher un message clair plutôt qu’une erreur.",
    ],
    keys: [
      "On cherche une valeur dans un tableau pour récupérer une autre info.",
      "RECHERCHEX (XLOOKUP) est la formule moderne ; RECHERCHEV (VLOOKUP) l’ancienne.",
      "Le code cherché doit être écrit exactement pareil des deux côtés.",
      "Prévois un message si la valeur est introuvable.",
    ],
    gesture: {
      intro:
        "Relie deux tableaux : commandes en feuille 1 (code produit en A2) et produits en feuille 2 (codes en A2:A20, prix en C2:C20). Complète la formule du prix.",
      fields: [
        {
          label: "Ce que je cherche",
          example: "A2 (le code produit de la commande)",
        },
        {
          label: "Où je cherche",
          example: "Produits!A2:A20 (colonne des codes)",
        },
        {
          label: "Ce que je veux récupérer",
          example: "Produits!C2:C20 (colonne des prix)",
        },
        { label: "Si introuvable", example: '"Code inconnu"' },
        {
          label: "Formule complète",
          example:
            '=RECHERCHEX(A2;Produits!A2:A20;Produits!C2:C20;"Code inconnu")',
        },
        {
          label: "Résultat attendu",
          example: "le prix du produit, par exemple 12,50",
        },
      ],
      tip: "Si ton tableur est en anglais, écris XLOOKUP à la place de RECHERCHEX et utilise des virgules au lieu des points-virgules.",
    },
    check: [
      {
        q: "À quoi sert RECHERCHEX (XLOOKUP) ?",
        options: [
          "À chercher une valeur et renvoyer une info d’un autre tableau",
          "À trier un tableau",
          "À créer un graphique",
        ],
        answer: 0,
        why: "Elle trouve une ligne dans un tableau et renvoie l’information voulue.",
      },
      {
        q: "Pourquoi la recherche peut-elle échouer alors que le code existe ?",
        options: [
          "Le code est écrit un peu différemment (espace en trop, faute)",
          "Le tableur est trop vieux",
          "Le code est trop long",
        ],
        answer: 0,
        why: "Les codes doivent être identiques : un espace en trop suffit à faire échouer la recherche.",
      },
      {
        q: 'Dans =RECHERCHEX(A2;codes;prix;"Inconnu"), que fait « Inconnu » ?',
        options: [
          "Il s’affiche si le code est introuvable",
          "Il remplace tous les prix",
          "Il trie les codes",
        ],
        answer: 0,
        why: "Le dernier argument donne le message à afficher quand rien n’est trouvé.",
      },
    ],
  },
  {
    id: "tab-modele",
    idea: [
      "Construire un outil dans un tableur, c’est faire un fichier que quelqu’un d’autre peut utiliser sans rien casser : un devis, un suivi de stock, un budget. Il doit être clair, protégé et simple à remplir.",
      "Sépare toujours trois choses : les zones à remplir (les saisies), les calculs (les formules) et les résultats. Mets les cases à remplir d’une couleur, protège les cellules de formules pour qu’on ne les efface pas, et ajoute des listes déroulantes pour éviter les fautes de frappe.",
      "Ajoute un petit onglet « Mode d’emploi » : trois lignes qui expliquent quoi remplir. Teste ton outil avec des valeurs normales, puis avec des valeurs bizarres (zéro, vide, texte) pour vérifier qu’il ne plante pas. Fais-le essayer à quelqu’un d’autre.",
    ],
    keys: [
      "Sépare saisies, calculs et résultats.",
      "Colore les cases à remplir, protège celles des formules.",
      "Une liste déroulante évite les fautes de frappe.",
      "Teste avec des valeurs bizarres et fais essayer par quelqu’un.",
    ],
    gesture: {
      intro:
        "Fais le plan de ton outil avant de le construire. Remplis cette fiche, puis crée le fichier en suivant ton plan.",
      fields: [
        {
          label: "Le but de l’outil",
          example: "faire un devis pour mes clients",
        },
        { label: "Qui va l’utiliser", example: "moi et mon associé" },
        {
          label: "Les cases à remplir (en couleur)",
          example: "client, produit, quantité",
        },
        {
          label: "Les calculs automatiques",
          example: "prix = quantité × prix unitaire ; total avec TVA",
        },
        {
          label: "Les protections",
          example: "cellules de formules verrouillées",
        },
        {
          label: "Mon mode d’emploi en 3 lignes",
          example:
            "1) choisis le produit 2) saisis la quantité 3) lis le total",
        },
      ],
      tip: "Un bon outil se reconnaît à ceci : une personne qui ne l’a jamais vu sait le remplir sans te poser de question.",
    },
    check: [
      {
        q: "Pourquoi protéger les cellules de formules ?",
        options: [
          "Pour qu’on ne les efface pas par erreur",
          "Pour cacher le tableau",
          "Pour ralentir le fichier",
        ],
        answer: 0,
        why: "Les formules sont le cœur de l’outil : les protéger évite qu’il casse.",
      },
      {
        q: "Une liste déroulante sert surtout à :",
        options: [
          "Embellir le tableau",
          "Éviter les fautes de frappe en proposant des choix",
          "Augmenter la taille du fichier",
        ],
        answer: 1,
        why: "On choisit dans une liste au lieu de taper : plus de fautes ni de variantes.",
      },
      {
        q: "Comment vérifier qu’un outil est solide ?",
        options: [
          "Le tester avec des valeurs bizarres et le faire essayer par quelqu’un",
          "Ne jamais le tester",
          "Le tester une seule fois avec des valeurs parfaites",
        ],
        answer: 0,
        why: "Des valeurs bizarres révèlent les défauts, et un autre utilisateur voit ce que tu ne vois plus.",
      },
    ],
  },
];
