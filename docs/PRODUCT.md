# BOUSE — produit et périmètre

BOUSE est une académie personnelle francophone de business, de finance et d’intelligence artificielle. Sa première version privilégie une boucle complète : **comprendre → pratiquer → démontrer → appliquer à un projet**. Le document maître fourni par l’utilisateur définit la vision à long terme ; il ne constitue pas une liste de fonctionnalités déjà livrées.

## Première version

| Espace                | Périmètre de la version 0.1                                                                                                                                                                                                                                                      |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Premier lancement     | Profil court : niveau déclaré, objectif, intérêts, temps disponible, préférence d’apprentissage ; diagnostic de trois questions.                                                                                                                                                 |
| Tableau de bord       | Prochaine action utile, progression issue des tentatives et accès aux projets. Aucun historique prérempli présenté comme personnel.                                                                                                                                              |
| Académie              | Six leçons de fondations, deux piliers finance et IA, prérequis explicites, quiz corrigés, flashcards et notes.                                                                                                                                                                  |
| Révisions             | Sessions de cinq cartes maximum après un quiz de la version courante, rappel avant révélation, autoévaluation et échéances transparentes. Les notes de quiz restent distinctes.                                                                                                  |
| Compétences           | Carte des prérequis et portfolio reliant quiz de la version courante, notes, dossiers et explorations ; export Markdown. Aucun score de certification professionnelle.                                                                                                           |
| Lab                   | Calculateur de rentabilité et mode « Et si ? » sur six mois : scénarios comparés, trésorerie, délais clients, hypothèses sauvegardées et export Markdown.                                                                                                                        |
| Atelier IA            | Grille de relecture de prompt et trame réutilisable. Analyse déterministe et explicite, sans appel à un modèle.                                                                                                                                                                  |
| Projets               | Création et modification de projets, ateliers de tests terrain et journal de décisions. Plans et attentes initiales conservés ; observations, preuves et bilans ajoutés ensuite. Changer d’étape consigne une décision personnelle ; cela ne prouve pas la validation du marché. |
| Sources (ex-Radar)    | Sources sélectionnées et pistes de recherche. Aucune surveillance automatique ni actualité prétendument en temps réel.                                                                                                                                                           |
| Navigation et données | Recherche, palette de commandes, interface adaptative, sauvegarde locale, export/import JSON et suppression volontaire.                                                                                                                                                          |

Les contrôles réellement exécutés et leurs résultats sont consignés lors de la livraison. Cette fiche décrit le périmètre fonctionnel ; elle ne certifie ni déploiement ni aptitude à une utilisation en production.

## Exigences pédagogiques

- Commencer par l’intuition et définir le vocabulaire avant la notation professionnelle.
- Relier chaque leçon à une décision concrète. Proposer exercice, explication des erreurs et application au projet, avec indices avant solution quand cela convient.
- Expliquer les hypothèses des calculs. Distinguer marge, résultat et trésorerie ; le calculateur simplifié n’est pas une comptabilité complète.
- Conserver les prérequis et relier finance et IA par des applications utiles, sans dépendre d’un fournisseur de modèle.
- Montrer les limites d’une règle simple et distinguer résultat de quiz, révision nécessaire et preuve de réalisation.
- Donner une version au contenu, des références identifiables et un statut de vérification honnête.

## Sources et actualité

Une source **proposée** est une piste à consulter. Une source **consultée et vérifiée** doit correspondre à une page réellement examinée, avec la date et le périmètre de cette vérification. Un lien accessible ne suffit pas à prouver qu’une leçon entière est correcte. Aucune date de vérification ne doit être inventée.

Les exercices utilisent des situations fictives annoncées comme telles. Les informations fiscales, juridiques, financières courantes et les cas d’entreprises réelles nécessitent une recherche spécifique avant publication. Le Radar initial est une sélection éditoriale de références, pas un moteur de veille. Les informations technologiques consultées pour choisir la stack ne valent pas validation de toutes les futures leçons.

## Données personnelles

Le profil, les réponses, les tentatives, les autoévaluations de rappel, les notes et les projets sont conservés dans le `localStorage` du navigateur courant. Ils servent à reprendre l’apprentissage et les projets. Ils restent jusqu’à leur suppression dans l’application ou par le navigateur. Sans configuration, il n’existe ni compte, ni synchronisation entre appareils, ni sauvegarde distante. Si l’installation est reliée à un projet Supabase, la personne peut se connecter par lien e-mail : une copie de l’état est alors enregistrée dans son compte, protégée par des politiques d’accès par utilisateur. Le navigateur reste la source affichée ; deux versions différentes ne sont jamais fusionnées ni écrasées sans choix explicite. La suppression du compte efface la copie en ligne sans toucher au navigateur.

L’export JSON permet une sauvegarde volontaire ; ce fichier contient des données personnelles en clair. L’import remplace l’état local après validation et confirmation : conserver un export avant d’importer. La suppression doit être explicite. Si le stockage est indisponible, l’application explique l’erreur ; la persistance ne doit jamais être supposée réussie.

L’Atelier IA n’envoie pas les prompts à un service externe. Le mentor, s’il est configuré, envoie la question et le texte de la leçon au fournisseur d’IA (Anthropic) via une fonction serveur authentifiée ; l’écran le dit avant l’envoi. Les échanges ne sont pas conservés, les réponses sont marquées « brouillon non vérifié » et un quota quotidien limite les coûts. Les liens de sources ouvrent des sites tiers à l’initiative de l’utilisateur. Aucun secret ni document sensible ne doit être placé dans le code, les notes de démonstration ou une variable de compilation publique.

## Feuille de route ordonnée

1. **Consolider les fondations** : affiner les contenus après retours utilisateurs, preuves de compétences, révisions espacées, portfolio et export Markdown/Obsidian (versions locales livrées). Navigation clavier, libellés et contrastes consolidés ; compléter les essais avec technologies d’assistance et appareils physiques. Étendre les tests aux parcours réellement ajoutés.
2. **Persistance et comptes** : Supabase/PostgreSQL, migration, connexion par lien e-mail, politiques d’accès par utilisateur, synchronisation locale d’abord avec gestion des conflits, suppression de compte (version initiale livrée, inactive sans configuration). Restent un schéma normalisé, les sauvegardes serveur planifiées et l’essai sur un vrai projet. Ne connecter aucun projet existant sans inspection préalable.
3. **Mentor et recherche IA** : fonction serveur, contrat neutre vis-à-vis du fournisseur, quota quotidien, citations des passages de leçon et réponses marquées « brouillon » (version initiale livrée, inactive sans configuration). Restent l’évaluation de la qualité des réponses, la recherche documentaire et des permissions plus fines. Aucun faux dialogue de mentor.
4. **Projets approfondis** : fiches d’idées, validation terrain, journal de décision, parcours d’apprentissage et liens entre objectifs et projets (versions locales livrées), puis analyse contradictoire et applications plus avancées.
5. **Simulation** : laboratoire financier « et si ? » sur six mois (version locale livrée), puis modèle d’entreprise plus complet, scénarios à compromis et points de vue de direction distincts. Les effets doivent venir d’un modèle testable, pas de chiffres arbitraires.
6. **Recherche et contenu vivant** : collecte autorisée, déduplication, vérification, historique des versions, révision humaine et publication. Ajouter ensuite cas d’entreprises, analyses de documents et opportunités assorties d’incertitudes.
7. **Extension du curriculum** : économie, finance personnelle, marketing/vente, stratégie, RH, vie professionnelle, droit et fiscalité français, puis niveaux avancés et projets de fin de module. Publier seulement les branches suffisamment profondes et vérifiées.
   - **Finance personnelle** (première version livrée le 5 novembre 2026) : budget et « se payer en premier », épargne de précaution, crédit (taux nominal, TAEG, coût total, simulateur testé), inflation et pouvoir d'achat. Aucun taux réglementé ni plafond chiffré ; exemples fictifs.
   - **Bourse et investissement** (demande de l'utilisateur du 5 novembre 2026 ; première version livrée : 5 leçons, lexique, simulateur de frais) : fonctionnement des marchés, actions, obligations, ETF/fonds, indices, vocabulaire (dividende, PER, capitalisation, ordre au marché/limité, spread, volatilité…), risque/rendement, diversification, horizon, frais, intérêts composés, biais comportementaux, enveloppes françaises (PEA, assurance-vie, compte-titres) et lecture d'un document d'information clé. Module pédagogique, jamais un conseil en investissement : exemples et portefeuilles fictifs annoncés comme tels, aucune recommandation de titre, sources institutionnelles vérifiées (AMF, Banque de France, Institut pour l'éducation financière du public) avec date de vérification, règles fiscales datées. Simulateurs déterministes (intérêts composés, frais, diversification) testés comme le Lab.
8. **Distribution** : PWA, hors-ligne, exploitation et déploiement après validation de la sécurité, de la confidentialité et des besoins réels.

Ces étapes restent des travaux futurs tant que leurs capacités et validations ne sont pas explicitement livrées.

## Règle des révisions locales

Un premier quiz inscrit les repères de sa version de leçon. Un échec rend les cartes de cette leçon prioritaires ; il ne permet pas de diagnostiquer une faiblesse précise sur une carte. Sans échec, le premier rappel vient 24 h après le premier quiz. Une nouvelle réussite ne repousse pas une carte déjà due. Une nouvelle erreur peut avancer le rappel.

Après avoir révélé les repères, « À reprendre » propose 24 h et remet le palier au début ; « Encore fragile » propose 24 h sans avancer ; « Retrouvé sans aide » progresse par 3, 7, 14 puis 30 jours. Ce sont des intervalles explicites de l’application, sans promesse de personnalisation scientifique. Les dates sont conservées en UTC et présentées en heure de Paris ; un jour de planification correspond à 24 heures, y compris aux changements d’heure.

Passer ou quitter une carte ne crée aucune réussite. Une session contient au maximum cinq cartes fixées au départ. Les brouillons ne durent que pendant la session ; les autoévaluations rejoignent la sauvegarde locale et l’export JSON. Elles ne changent ni résultat de quiz ni niveau de compétence. Une version révisée de contenu exige un quiz sur cette version avant inscription aux révisions.

## Atelier de projet local

Chaque projet possède un espace Terrain / Décisions / Repères. Un test enregistre une hypothèse, un protocole, un critère de réussite et une date de revue. Les observations et preuves sont consignées ensuite avec une conclusion personnelle : hypothèse confortée, fragilisée ou résultat non concluant. Cette conclusion ne valide pas automatiquement un marché et ne fait pas avancer le projet.

Le journal conserve contexte et hypothèses, alternatives, choix, résultat attendu, confiance déclarée, risque et date de revue. Un bilan ultérieur compare observé et attendu, avec un apprentissage. Les attentes de départ et les bilans enregistrés ne sont pas réécrits ; un nouveau test ou une nouvelle décision sert à poursuivre l’apprentissage. Cette règle est expliquée avant sauvegarde.

Les données restent dans le navigateur et l’export JSON. Un dossier Markdown exporte uniquement le projet ouvert, ses tests, décisions, preuves et leçons liées. Les notes de preuve sont saisies par l’utilisateur ; l’application ne contacte personne, ne vérifie pas les observations et n’attribue aucune probabilité de succès.

## Laboratoire « Et si ? »

Une référence et un scénario sont comparés sur six mois. Prix, volume moyen vendu, coût variable, charges fixes, trésorerie initiale et délai client sont des hypothèses explicites. Les changements s’appliquent dès le mois 1 ; aucun effet automatique du prix sur la demande n’est inventé. Les scénarios proposés sont fictifs et modifiables : paiement retardé, perte de volume client, coût fournisseur, recrutement et hausse de prix.

L’activité commence au mois 1 sans créances initiales. Les ventes sont constantes ; les dépenses variables et fixes sont payées le mois de la vente. Les encaissements sont décalés de zéro à trois mois entiers. La trésorerie initiale et les flux mensuels sont arrondis au centime. Le résultat cumulé et la trésorerie restent distincts : `trésorerie finale = trésorerie initiale + résultat cumulé − créances finales`.

Le besoin maximal de financement mesure le plus bas solde négatif aux fins de mois. La projection se poursuit pour rendre ce besoin visible ; elle ne suppose aucun financement automatique et ne calcule aucune probabilité de faillite. Elle exclut les variations à l’intérieur du mois, TVA, impôts, stocks, impayés, dette, intérêts, capacité et comportement de la demande.

Conserver une comparaison enregistre les deux jeux d’hypothèses et la version du modèle. Modifier le brouillon ou charger une comparaison ne réécrit pas les sauvegardes. Ces simulations restent distinctes des observations terrain et des preuves de compétence. Elles sont incluses dans l’export JSON ; un export Markdown rend les calculs et limites lisibles hors de l’application.

## Portfolio d’apprentissage

Le portfolio relie les notions du catalogue aux quiz, aux notes personnelles et aux dossiers de projet. Il présente aussi les tests avec observations, les bilans de décision et les simulations conservées, en distinguant leurs natures. Il dérive ces traces des données existantes ; consulter ou exporter le portfolio ne modifie aucune progression.

L’état d’un quiz vient de la dernière tentative chronologique admissible de la version courante. Une ancienne tentative sans version correspond au catalogue initial `1.0.0`. Les dates invalides ou futures et les anciennes versions restent archivées et exportables, sans devenir des preuves actuelles. Une réussite suivie d’un échec donne « À reprendre » ; la meilleure note historique n’efface pas cet échec. Cette règle est partagée avec l’accueil, la carte, les leçons et les prérequis.

Les notes n’ont pas de date enregistrée ; aucune date de rédaction n’est inventée. Une fiche de projet, une conclusion terrain et une autoévaluation restent déclaratives. Une simulation est une exploration fictive, sans réussite certifiée. Les exercices et teach-back ne sont pas comptés comme réalisés : leurs réponses ne sont pas conservées. Aucun score global ne transforme ces traces en diplôme.

Un fichier Markdown exporte les traces, leurs versions, les notes hors catalogue et les hypothèses des simulations avec une date d’export explicite. Il peut être ouvert dans Obsidian ; l’application n’accède pas au coffre et ne le synchronise pas. La sauvegarde JSON reste le format de restauration de l’application.

## Parcours d’apprentissage par projet

L’onglet Repères permet de choisir des objectifs parmi les notions du catalogue. Ces choix sont distincts des apprentissages associés depuis Apply. Une ancienne fiche sans objectifs reste vide à cet endroit ; les associations ne sont pas transformées automatiquement en besoins ou en réussites.

Le parcours ajoute les prérequis, les déduplique et les ordonne. Les états utilisent la règle commune des quiz courants : validé, disponible, à reprendre ou prérequis à travailler. La prochaine notion proposée respecte les prérequis ; une réussite avancée ne masque pas un prérequis à reprendre. Les minutes concernent les contenus disponibles restant à travailler, sans prédire le temps nécessaire pour réaliser le projet.

Les objectifs absents du catalogue restent visibles et exportables. Ils ne disparaissent qu’après un retrait explicite. Les quiz validés du parcours n’établissent ni application réelle au projet, ni marché validé, ni certification professionnelle. Modifier les objectifs ne change ni les associations, ni la prochaine action terrain, ni le stade.

La carte montre séparément les notions choisies comme objectifs dans des projets. Depuis une leçon, objectif ou prérequis, un lien revient directement au plan. Les sauvegardes JSON et les exports Markdown du dossier et du portfolio conservent les objectifs ; les prérequis et états du parcours se recalculent depuis le catalogue courant.

## Ce que le profil change

Chaque choix du profil a un effet visible, expliqué à l'endroit où il agit (passe 18) :

| Choix             | Effet                                                                                                                                                                        |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Point de départ   | Une notion manquée (ou « Je ne sais pas encore ») dans un centre d'intérêt passe en tête de la leçon proposée.                                                               |
| Centres d'intérêt | Départagent les notions accessibles.                                                                                                                                         |
| Objectif          | Départage ensuite selon les domaines qui le servent ; l'accueil le cite dans « Pourquoi celle-ci ? ».                                                                        |
| Niveau            | « Je découvre » : la notion la plus douce d'abord. « Je pratique déjà » et « Je veux approfondir » : une leçon jamais ouverte propose « Vérifier directement au quiz ».      |
| Temps par session | L'accueil découpe la séance : rappels prêts, puis la leçon entière ou un nombre de séquences.                                                                                |
| Façon d'apprendre | Choisit la suite proposée après un quiz réussi : s'exercer (Lab, Atelier IA, projet), la prochaine leçon ou l'application à un projet. Les autres choix restent disponibles. |

Une seule prochaine leçon existe dans l'application (`src/lib/recommendation.ts`). Les prérequis ne sont jamais sautés par la recommandation ; le passage direct au quiz est une proposition, pas une validation.

## Reprendre où l'on s'est arrêté

Une leçon retient la séquence où elle a été quittée et y rouvre, en l'annonçant, avec « Revenir au début » (passe 19). L'accueil découpe la séance à partir de cette séquence. La trajectoire de l'accueil couvre trois parcours (Fondations, Finance personnelle, Investissement), soit les 5 domaines, et s'ouvre sur celui de la leçon recommandée.

## Lexique dans les leçons

Dans le texte des leçons, les termes du lexique ouvrent une définition courte sur place, avec un lien vers le lexique et vers la leçon qui les explique (passe 20). Les mots courants ne sont reconnus que dans les leçons qui les définissent ou s'appuient dessus. Le point de départ compte cinq questions, une par domaine principal.

Passe 21 : le lexique devient le « Lexique de l'Académie » (91 termes, dont les notions de base en entreprise et en IA). Les cas pratiques et les énoncés d'exercice sont reliés au lexique ; les quiz ne le sont pas, pour ne pas souffler la réponse. Les quiz restent à deux questions : en ajouter changerait la version des leçons et ferait repasser « à revoir » les quiz déjà validés.

## Catalogue (passe 22)

43 leçons réparties en cinq domaines : Finance (7), Entrepreneuriat (9), Intelligence artificielle (7), Finance personnelle (9), Investissement (11). Les nouvelles leçons sont ajoutées en fin de catalogue pour que les numéros des leçons existantes restent stables. L'atlas, la carte des compétences et la trajectoire de l'accueil se construisent automatiquement à partir du catalogue (`src/lib/mapLayout.ts`). Les faits réglementaires récents sont datés de novembre 2026 et marqués « à vérifier ».

## Boucle d'engagement (passe 25)

Chaque leçon suit la même boucle : **découvrir → comprendre → manipuler → réussir → voir sa progression → avoir envie de la suite**.

- **Découvrir.** La première séquence pose une question de départ (la première question du quiz). La leçon promet d'y répondre, et le quiz la signale comme « votre question de départ ».
- **Réussir et voir sa progression.** Un quiz réussi affiche les notions acquises, le compte du domaine et du parcours, puis la leçon suivante avec son résumé et sa durée.
- **Pratique pertinente seulement.** Un espace d'exercice n'est proposé que s'il manipule vraiment la notion. Sinon, la suite est la leçon suivante.
- **Continuité.** L'accueil explique qu'une leçon « prolonge » celle qui vient d'être validée, ou rappelle la dernière notion validée.
- **S'arrêter sans culpabilité.** L'écran de réussite dit que c'est un bon point d'arrêt, que tout est enregistré et que la suite attendra, sans rappel ni compte à rebours.

Interdits : séries de jours, compte à rebours, formulation de perte, notification insistante, récompense sans apprentissage.
