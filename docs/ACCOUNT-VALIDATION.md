# Comptes et synchronisation — mission du 6 novembre 2026

## Audit et périmètre

Point de départ : `63178e1393f4be84d980e5960fd2eeb6c859d691`, branche `claude/bouse-development-resume-gktqqs`. Six commits récents non intégrés dans `main` (le commit de squash de main explique la divergence). Aucune PR ouverte au démarrage. Production observée : `cfca367e509cae45e44704792ba34e0c2feb0aae`, déploiement `dpl_6xzGTWPwmfnQkMnsAnF83PATfdzk`. La preview V4 était déjà construite mais non publiée sur le domaine principal.

Supabase `uyrrsiufhynyhwdsyvlg` : actif, aucun utilisateur, aucune table publique, migration ni fonction serveur avant intervention. Les migrations existantes ont été relues. Aucun fournisseur IA payant ni nouvelle infrastructure n'a été activé.

La vague, le catalogue de 43 leçons, les simulateurs et les styles validés de la branche source sont conservés. Modifications UI limitées au compte, aux erreurs et aux mises à jour.

## Architecture livrée

- `AccountBoundary` attend la session avant d'afficher un espace et remonte l'application avec une clé différente au changement de compte. Les brouillons et composants de l'ancien compte sont démontés.
- Clés locales `bouse.academy.v1:guest` et `bouse.academy.v1:user:<uuid>`. La clé historique est copiée vers l'invité sans être supprimée ni transférée vers un compte.
- Import invité → compte volontaire par export/import JSON avec confirmation. Aucun rapprochement automatique par e-mail ni par prénom.
- Le document synchronisé est l'AppState complet : profil, quiz et réponses, positions de leçons, notes, projets/objectifs, révisions, expériences, décisions, simulations. Le portfolio est dérivé de ces données. Les brouillons non sauvegardés des outils ne sont pas des données synchronisées.
- Point de synchronisation conservé par compte, contrôle de révision serveur, relecture au retour réseau/focus et toutes les 15 secondes, envoi après une seconde de pause. Un changement pendant une requête n'est pas écrasé par son résultat.
- Conflit si les deux copies ont changé. Les deux versions sont archivées localement avant un choix explicite, exportables dans les paramètres. Pas de fusion silencieuse. Un conflit entre deux onglets bloque la sauvegarde et conserve une copie de récupération.
- Anciennes sauvegardes v1 acceptées. Une version inconnue/corrompue est conservée et bloque l'écriture automatique.
- RLS propriétaire + session serveur encore active. La suppression de compte supprime les sessions et les données par cascade. Les anciens JWT ne peuvent plus agir. Confirmation UI incluant les copies de ce compte sur l'appareil courant. Les copies hors ligne d'autres appareils ne peuvent pas être effacées à distance.
- Service worker : la nouvelle version attend la fermeture des anciens onglets, cache du shell cohérent avec ses assets, aucune donnée Supabase mise en cache, aucun effacement localStorage lors d'une mise à jour. Message de mise à jour disponible.

## Résultats au cours de la mission

- TypeScript et build : réussis.
- 254 tests unitaires : réussis, dont neuf nouveaux tests de séparation, deux appareils, reprise après coupure/rechargement, conflits, réponses tardives et sauvegardes incompatibles.
- API Supabase réelle : deux comptes techniques jetables authentifiés avec le service Auth, deux insertions propres réussies ; tentatives GET/PATCH/DELETE/INSERT croisés et réattribution de propriétaire refusées dans les deux sens ; accès anonyme refusé ; écriture périmée refusée et copie serveur conservée. Les jetons ne figurent ni dans ce dépôt ni dans les captures.
- Suite navigateur locale : lancement tenté, **86 scénarios non exécutés** (Chromium échoue avant le premier scénario : `socket() failed: Operation not permitted`). Ce n'est pas un résultat fonctionnel réussi.
- Nouveaux tests navigateur `accounts.spec.ts` : vrais SDK/UI, transport simulé ; distincts de la vérification RLS réelle. Exécution dédiée par CI avec `BOUSE_ACCOUNT_TESTS=1`.
- Contrôle interactif local via navigateur disponible : en cours. Aucune validation physique iPhone/Android, Safari/Firefox, ni livraison d'e-mail réel revendiquée.

## Exploitation et prérequis à vérifier

Vercel existant conserve son projet et son domaine. Variables publiques `VITE_SUPABASE_URL` et `VITE_SUPABASE_PUBLISHABLE_KEY` configurées. Aucun secret serveur dans `VITE_*`.

Supabase Auth expose Email activé, inscriptions autorisées, confirmation d'adresse obligatoire. L'accès aux réglages SMTP et aux URL Auth n'est pas fourni par les outils Supabase de cette session. Il faut vérifier dans le Dashboard :

1. Authentication → URL Configuration : Site URL `https://bouse.vercel.app`, Redirect URL exacte `https://bouse.vercel.app/` (et seulement les origines de test explicitement approuvées).
2. Authentication → Email / SMTP : configurer un expéditeur permettant les e-mails vers les amis. Le service SMTP par défaut peut être restreint aux membres du projet ; ne pas supposer qu'un formulaire de connexion prouve la délivrabilité. Aucun abonnement à activer sans accord.
3. Tester un vrai lien reçu sur PC et un autre sur téléphone. Le flux PKCE demande d'ouvrir le lien dans le navigateur qui l'a demandé (attention aux navigateurs intégrés des applications mail).

Advisors : RLS activée ; avertissement prévu sur `delete_my_account`, SECURITY DEFINER nécessaire pour supprimer uniquement auth.uid() après vérification de session, aucun argument d'identité fourni par le client. Protection des mots de passe compromis non activée : l'interface produit n'utilise pas de mot de passe. Aucun plan payant activé pour lever cet avertissement.

## Usage

Ouvrir BOUSE, utiliser le formulaire « Compte et synchronisation », saisir son e-mail et demander un lien. L'ami utilise la même URL et son propre e-mail. Le mode invité est indépendant et accessible sans compte. Pour reprendre une ancienne sauvegarde : export JSON depuis l'invité, connexion au bon compte, import et confirmation dans Préférences. Sur un autre appareil, se connecter au même compte et attendre l'état « Synchronisé ». Avant de fermer après une modification importante, attendre ce statut ; une page fermée hors ligne ne peut pas envoyer ses données jusqu'à sa réouverture.

Installation : Safari iPhone → Partager → Sur l'écran d'accueil ; Chrome Android → menu → Installer l'application/Ajouter à l'écran d'accueil selon la version. Ce sont des instructions, pas des essais physiques réalisés.

Mises à jour : migrations SQL additives d'abord, build/CI ensuite, déploiement du commit vérifié. Ne pas changer les clés de stockage ni supprimer des champs v1. Exporter avant une opération volontaire de remplacement. Ne pas revenir à une version antérieure à cette isolation avec des comptes activés. Un rollback de code ne doit jamais réinitialiser la base.

Suppression : Préférences → Supprimer mon compte et mes données → confirmation. Pour un appareil partagé, se déconnecter avant de changer de personne. L'isolation applicative ne chiffre pas les données locales contre quelqu'un ayant accès aux outils développeur du même profil OS ; utiliser des profils navigateur/OS séparés pour ce besoin.

## Identifiants des migrations

L’API Supabase a attribué ses horodatages réels aux deux migrations. Les noms des fichiers SQL du dépôt ont été alignés sur ces versions après vérification par `list_migrations`, sans modifier le SQL initial ni les données. La tentative de réécriture de l’historique serveur a été rejetée par la revue automatique ; aucune réécriture serveur n’a été effectuée. Si une autre installation a déjà appliqué l’ancien identifiant `20261105120000`, vérifier son historique avant toute commande `db push` : ne pas rejouer la migration initiale.
