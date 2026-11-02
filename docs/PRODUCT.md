# BOUSE — produit et périmètre

BOUSE est une académie personnelle francophone de business, de finance et d’intelligence artificielle. Sa première version privilégie une boucle complète : **comprendre → pratiquer → démontrer → appliquer à un projet**. Le document maître fourni par l’utilisateur définit la vision à long terme ; il ne constitue pas une liste de fonctionnalités déjà livrées.

## Première version

| Espace                | Périmètre de la version 0.1                                                                                                                                                                                                                                                      |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Premier lancement     | Profil court : niveau déclaré, objectif, intérêts, temps disponible, préférence d’apprentissage ; diagnostic de trois questions.                                                                                                                                                 |
| Tableau de bord       | Prochaine action utile, progression issue des tentatives et accès aux projets. Aucun historique prérempli présenté comme personnel.                                                                                                                                              |
| Academy               | Six leçons de fondations, deux piliers finance et IA, prérequis explicites, quiz corrigés, flashcards et notes.                                                                                                                                                                  |
| Révisions             | Sessions de cinq cartes maximum après un quiz de la version courante, rappel avant révélation, autoévaluation et échéances transparentes. Les notes de quiz restent distinctes.                                                                                                  |
| Compétences           | Indicateurs fondés sur le diagnostic et les tentatives ; accès aux preuves et aux notions à retravailler. Une bonne réponse ne constitue pas une certification professionnelle.                                                                                                  |
| Lab                   | Calculateur de chiffre d’affaires, contribution, résultat simplifié et seuil de rentabilité. Hypothèses modifiables, cas limites expliqués.                                                                                                                                      |
| AI Lab                | Grille de relecture de prompt et trame réutilisable. Analyse déterministe et explicite, sans appel à un modèle.                                                                                                                                                                  |
| Incubator             | Création et modification de projets, ateliers de tests terrain et journal de décisions. Plans et attentes initiales conservés ; observations, preuves et bilans ajoutés ensuite. Changer d’étape consigne une décision personnelle ; cela ne prouve pas la validation du marché. |
| Radar                 | Sources sélectionnées et pistes de recherche. Aucune surveillance automatique ni actualité prétendument en temps réel.                                                                                                                                                           |
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

Le profil, les réponses, les tentatives, les autoévaluations de rappel, les notes et les projets sont conservés dans le `localStorage` du navigateur courant. Ils servent à reprendre l’apprentissage et les projets. Ils restent jusqu’à leur suppression dans l’application ou par le navigateur. Il n’existe dans cette version ni compte, ni synchronisation entre appareils, ni sauvegarde distante.

L’export JSON permet une sauvegarde volontaire ; ce fichier contient des données personnelles en clair. L’import remplace l’état local après validation et confirmation : conserver un export avant d’importer. La suppression doit être explicite. Si le stockage est indisponible, l’application explique l’erreur ; la persistance ne doit jamais être supposée réussie.

L’AI Lab initial n’envoie pas les prompts à un service externe. Les liens de sources ouvrent des sites tiers à l’initiative de l’utilisateur. Aucun secret ni document sensible ne doit être placé dans le code, les notes de démonstration ou une variable de compilation publique.

## Feuille de route ordonnée

1. **Consolider les fondations** : affiner les contenus après retours utilisateurs, preuves de compétences, révisions espacées (version locale livrée), export Markdown/Obsidian et accessibilité. Étendre les tests aux parcours réellement ajoutés.
2. **Persistance et comptes** : Supabase/PostgreSQL, migrations, authentification, politiques d’accès par utilisateur, sauvegardes et suppression de compte. Ne connecter aucun projet existant sans inspection préalable.
3. **Mentor et recherche IA** : adaptateurs de fournisseurs côté serveur, permissions, budgets, évaluation, citations et distinction entre brouillon et contenu validé. Aucun faux dialogue de mentor en attendant.
4. **Projets approfondis** : fiches d’idées, validation terrain et journal de décision (atelier local livré), analyse contradictoire et liens bidirectionnels compétences/projets.
5. **Simulation** : modèle d’entreprise explicable, scénarios à compromis, laboratoire « et si ? », puis points de vue de direction distincts. Les effets doivent venir d’un modèle testable, pas de chiffres arbitraires.
6. **Recherche et contenu vivant** : collecte autorisée, déduplication, vérification, historique des versions, révision humaine et publication. Ajouter ensuite cas d’entreprises, analyses de documents et opportunités assorties d’incertitudes.
7. **Extension du curriculum** : économie, finance personnelle, marketing/vente, stratégie, RH, vie professionnelle, droit et fiscalité français, puis niveaux avancés et projets de fin de module. Publier seulement les branches suffisamment profondes et vérifiées.
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
