# Passe 10 — consolidation de l’accès au clavier

La poursuite demandée après la passe Inter conduit au chantier d’accessibilité prévu dans la feuille de route. Cette passe conserve la composition monochrome existante et corrige son utilisation. Le « Go » autorise la suite du travail ; il ne constitue pas une review design indépendante.

## Constats et corrections

| Zone                                                         | Constat vérifié                                                                                                   | Correction                                                                                          |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Recherche et menu mobile                                     | Ctrl/⌘ K pouvait ouvrir la recherche au-dessus du menu ; Échap laissait ensuite le focus sur la page sans repère. | Une seule fenêtre active, retour au déclencheur disponible, focus du contenu après navigation.      |
| Recherche                                                    | Tab fonctionnait, mais les flèches ne parcouraient pas les résultats.                                             | Flèches, Home/End, Entrée ; compteur annoncé et état vide explicite. Les boutons restent natifs.    |
| Accueil, atlas, compétences, AI Lab, portfolio et simulation | Plusieurs `aria-label` remplaçaient les intitulés visibles par un autre texte.                                    | Noms issus des libellés visibles et descriptions complémentaires pour les graphes.                  |
| Navigation adaptative                                        | Certaines commandes perdaient leur texte quand elles devenaient des icônes.                                       | Nom explicite pour la recherche latérale et « Séquence précédente », libellé « Explorer » conservé. |
| Diagnostic et quiz                                           | Le contenu changeait sans déplacer le repère clavier vers l’étape ou la correction.                               | Focus sur le titre du diagnostic, la correction puis la question suivante.                          |
| Lecture des indices                                          | Les numéros de trajectoire mobile et « / FONDATIONS » manquaient de contraste.                                    | Utilisation du token de texte tertiaire, sans nouvelle couleur.                                     |
| Résultats de simulation                                      | Les légendes n’étaient pas des descriptions valides dans la liste de définitions.                                 | Balisage `dt`/`dd` cohérent, présentation conservée.                                                |

L’inspection intermédiaire a aussi révélé que `.sr-only` était limitée aux leçons : un texte d’assistance apparaissait dans la barre latérale et comprimait l’avatar. La règle est désormais commune ; les captures sont régénérées après cette correction.

L’examen des résultats axe marqués « à vérifier » a identifié des noms ARIA sur des éléments sans rôle adapté. Les sélecteurs et légendes deviennent des groupes nommés, la progression expose sa valeur et les montants comparés conservent leur contexte. Les opérateurs de l’équation mensuelle gagnent aussi en contraste. Les contrastes indéterminés sur les fonds complexes restent signalés dans le rapport final.

## Méthode et limites

Les scénarios couvrent l’onboarding, quatorze routes avec un profil et un projet de démonstration, la recherche et le menu mobile. Les contrôles automatisés WCAG A/AA sont complétés par des parcours clavier et l’inspection des rendus. Un résultat axe sans violation ne couvre pas l’ensemble des critères WCAG ni l’usage réel d’un lecteur d’écran. Chromium desktop et Pixel 7 émulé ; essais NVDA/VoiceOver, Safari/Firefox et appareils physiques encore à réaliser.

Les résultats finaux, les images avant/après et l’archive sont consignés dans [LATEST.md](LATEST.md).
