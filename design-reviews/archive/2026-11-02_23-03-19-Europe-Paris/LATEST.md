# Review design — passe 05 : premier rendu du mode « Et si ? »

Rendus du 2 novembre 2026 à 23:03, Europe/Paris.

**Statut : itération interne, correction mobile demandée avant livraison.**

La passe 04 a été acceptée par l’utilisateur avec « SUIT ». Le nouvel espace compare référence et scénario sur six mois : courbe de trésorerie monochrome, mois sélectionnables, hypothèses, résultat et encaissements distincts, sauvegarde de comparaisons et export Markdown.

[Desktop](latest-desktop.png) · [Mobile](latest-mobile.png)

La première suite complète passe : 30 tests navigateur et 101 cas unitaires dans six fichiers. Les 69 captures réelles ont été enregistrées. L’inspection a cependant relevé un défaut sur le premier viewport mobile : les montants sous les six boutons de mois sont trop serrés et se touchent. Ces données sont déjà disponibles dans le détail du mois sélectionné ; retirer leur répétition sur mobile permet de garder des contrôles lisibles et confortables.

Une correction CSS mobile et une nouvelle génération des rendus sont en cours. Cette archive conserve le premier jet pour expliquer la correction ; elle ne constitue ni le rendu final de la passe, ni une validation design externe. Les dernières images corrigées et les contrôles seront consignés dans la prochaine version de LATEST.md.

Viewport desktop 1440 × 1000 ; Pixel 7 émulé, viewport CSS 412 × 839, échelle 2,625. Données fictives, application lancée réellement dans Chromium. Les captures fixes ne remplacent ni les interactions, ni un contrôle sur appareil physique.
