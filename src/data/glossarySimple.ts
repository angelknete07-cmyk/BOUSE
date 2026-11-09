/**
 * Définitions « pour tous » du lexique : une ou deux phrases en mots de tous
 * les jours, pour quelqu'un qui découvre le sujet. La définition précise de
 * `investingGlossary.ts` reste affichée juste en dessous (« Plus précis »).
 * Les mots du lexique cités ici deviennent eux-mêmes cliquables dans la bulle.
 */
export const simpleDefinitions: Record<string, string> = {
  action:
    "Un petit morceau d’une entreprise que l’on peut acheter. Si l’entreprise va bien, ce morceau peut valoir plus ; si elle va mal, il peut perdre toute sa valeur. L’entreprise peut aussi vous verser un dividende.",
  obligation:
    "Un prêt que vous faites à un État ou à une entreprise. En échange, il vous verse des intérêts (le coupon), puis vous rend votre argent à une date prévue, s’il le peut.",
  coupon:
    "Les intérêts que vous recevez, à intervalles réguliers, quand vous avez prêté de l’argent en achetant une obligation.",
  dividende:
    "Une partie des bénéfices qu’une entreprise choisit de reverser à ceux qui possèdent ses actions. Elle peut aussi décider de ne rien verser.",
  "rendement-dividende":
    "Ce que le dividende vous rapporte chaque année, comparé au prix de l’action. Exemple : 3 € de dividende pour une action à 100 €, c’est 3 %.",
  cours:
    "Le prix d’une action ou d’un autre titre au moment où vous regardez : celui du dernier achat-vente. Il change tout au long de la journée.",
  capitalisation:
    "Ce que vaut une entreprise en bourse : le prix d’une action multiplié par le nombre total d’actions.",
  "marche-primaire":
    "Le moment où une entreprise ou un État vend de nouveaux titres pour la première fois. L’argent payé va directement à celui qui les crée.",
  "marche-secondaire":
    "L’endroit où les investisseurs s’achètent et se vendent des titres entre eux, comme un marché de l’occasion. L’entreprise ne touche rien.",
  "introduction-bourse":
    "Le jour où une entreprise met ses actions en vente en bourse pour la première fois : n’importe qui peut alors en acheter.",
  indice:
    "Un chiffre qui résume la santé d’un groupe d’entreprises cotées, comme une moyenne. Le CAC 40 en est un exemple.",
  cac40:
    "L’indice boursier qui suit les quarante plus grandes entreprises de la bourse de Paris. S’il monte, ces entreprises valent globalement plus.",
  liquidite:
    "La facilité à transformer un placement en argent disponible, vite et sans perdre au passage. Un billet est très liquide ; une maison l’est peu.",
  per: "Combien d’années de bénéfices vous payez quand vous achetez une action. Un chiffre élevé veut dire que l’action coûte cher par rapport à ce que l’entreprise gagne aujourd’hui.",
  "interets-composes":
    "Quand les intérêts gagnés rapportent à leur tour des intérêts, l’argent grossit de plus en plus vite, comme une boule de neige.",
  "regle-72":
    "Une astuce de calcul : divisez 72 par le taux par an pour savoir en combien d’années votre argent double. À 6 % par an, environ 12 ans.",
  inflation:
    "La hausse des prix dans le temps. Avec la même somme, on peut acheter un peu moins chaque année : le pouvoir d’achat baisse.",
  "rendement-nominal":
    "Ce qu’un placement affiche comme gain, sans tenir compte de l’inflation (la hausse des prix).",
  "rendement-reel":
    "Ce que vous gagnez vraiment une fois l’inflation (la hausse des prix) retirée. Un placement à 3 % quand les prix montent de 2 % rapporte environ 1 % réel.",
  "frais-courants":
    "Ce que coûte chaque année un fonds d’investissement pour être géré. Ces frais sont pris directement sur votre argent placé, sans facture.",
  "frais-courtage":
    "Ce que vous payez à votre banque ou votre courtier à chaque achat ou vente en bourse, comme un ticket de passage.",
  volatilite:
    "À quel point un prix monte et descend fort. Très volatil : de grosses hausses et de grosses baisses, souvent sans prévenir.",
  "perte-maximale":
    "La plus grosse chute subie par un placement, de son plus haut à son plus bas. Attention : perdre la moitié demande ensuite de doubler pour revenir au départ.",
  diversification:
    "Ne pas mettre tous ses œufs dans le même panier : répartir son argent entre beaucoup d’entreprises, de pays et de types de placements. Elle ne protège pas du risque de marché.",
  correlation:
    "Le fait que deux placements montent et baissent en même temps. Pour se protéger, mieux vaut des placements qui ne bougent pas pareil.",
  horizon:
    "Le temps pendant lequel vous pouvez laisser votre argent placé sans y toucher. Plus il est long, plus on peut attendre qu’une baisse passe.",
  "risque-marche":
    "Le risque que presque tout baisse en même temps, par exemple lors d’une crise. Répartir son argent (la diversification) n’y change rien.",
  defaut:
    "Quand quelqu’un qui a emprunté ne peut plus payer ses intérêts ou rendre l’argent prêté.",
  sri: "Une note de 1 à 7, écrite dans le document d’informations clés, qui indique à quel point un placement est risqué : 1 bouge peu, 7 peut beaucoup monter ou beaucoup baisser.",
  "epargne-precaution":
    "De l’argent mis de côté pour les coups durs (panne, perte d’emploi) et que l’on peut retirer tout de suite, sans risque de perte.",
  "effet-levier":
    "Investir plus que ce que l’on a vraiment, souvent en empruntant. Les gains sont plus gros, mais les pertes aussi, parfois plus que la mise.",
  fonds:
    "Un grand panier commun où beaucoup de personnes mettent leur argent ; des professionnels l’investissent pour tous selon des règles annoncées.",
  "gestion-active":
    "Des professionnels choisissent eux-mêmes les placements pour essayer de faire mieux que le marché. C’est en général plus cher.",
  "gestion-indicielle":
    "Au lieu de choisir, on copie simplement un indice boursier. C’est en général moins cher que la gestion active.",
  etf: "Un fonds qui copie un indice boursier et que l’on achète en bourse comme une action. Il monte et baisse avec cet indice.",
  dic: "Une fiche obligatoire de quelques pages qui résume un placement : son but, son risque, ce qu’il peut rapporter ou faire perdre et ce qu’il coûte.",
  "fonds-euros":
    "Une partie de l’assurance-vie où l’assureur protège en principe votre argent placé. Ce qu’il rapporte change chaque année.",
  "unite-compte":
    "Une partie de l’assurance-vie investie en bourse ou dans des fonds. Elle peut rapporter plus que le fonds en euros, mais aussi baisser.",
  "compte-titres":
    "Un compte pour acheter presque tout ce qui se vend en bourse, sans avantage d’impôt particulier.",
  pea: "Un compte pour acheter des actions européennes avec un avantage d’impôt si vous gardez l’argent plusieurs années. Les règles exactes se vérifient au moment de décider.",
  "assurance-vie":
    "Un contrat pour faire fructifier son épargne sur le long terme, avec des règles d’impôt et de transmission à ses proches qui lui sont propres.",
  "support-enveloppe":
    "Le support, c’est ce que vous achetez (une action, un fonds) ; l’enveloppe, c’est la boîte qui le contient et fixe les règles d’impôt (un PEA, une assurance-vie).",
  "carnet-ordres":
    "La liste, en direct, de tous ceux qui veulent acheter ou vendre un titre, avec leur prix et leur quantité.",
  spread:
    "L’écart entre le prix auquel on peut acheter tout de suite et celui auquel on peut vendre tout de suite. Plus il est grand, plus un aller-retour coûte.",
  "ordre-marche":
    "Une demande d’achat ou de vente « au prix du moment, quel qu’il soit ». Elle passe presque toujours, mais le prix n’est pas connu d’avance.",
  "ordre-limite":
    "Une demande d’achat ou de vente avec un prix à ne pas dépasser. Vous maîtrisez le prix, mais l’achat ou la vente peut ne pas se faire.",
  "ordre-seuil":
    "Une demande qui se déclenche toute seule quand le prix atteint un niveau choisi, par exemple pour limiter une perte : elle devient alors un ordre au marché. En cas de chute rapide, le prix obtenu peut être bien pire.",
  "versements-programmes":
    "Placer la même petite somme à date fixe, chaque mois par exemple, au lieu de tout placer d’un coup. Cela évite de tout miser sur un mauvais moment.",
  reequilibrage:
    "Remettre régulièrement son épargne dans les proportions prévues, parce que ce qui a monté a pris trop de place.",
  "aversion-perte":
    "Une perte fait plus mal qu’un gain de même taille ne fait plaisir. Ce réflexe pousse à garder trop longtemps ce qui baisse.",
  ancrage:
    "Rester accroché à un chiffre, comme le prix auquel on a acheté, alors qu’il ne dit rien de ce qui va se passer.",
  "exces-confiance":
    "Se croire plus capable de prévoir l’avenir qu’on ne l’est vraiment, en oubliant la part de chance.",
  "biais-confirmation":
    "Ne voir que les informations qui nous donnent raison et ignorer celles qui nous contredisent.",
  "reste-a-vivre":
    "L’argent qui reste chaque mois une fois payées les charges fixes (loyer, abonnements…), pour vivre et épargner.",
  "charges-fixes":
    "Les dépenses qui reviennent chaque mois, au même montant : loyer, abonnements, assurances, crédits.",
  "payer-premier":
    "Mettre de côté son épargne dès que le salaire arrive, avant toute autre dépense, puis vivre avec ce qui reste.",
  "epargne-precaution-terme":
    "Une réserve d’argent sans risque, disponible tout de suite, souvent égale à quelques mois de dépenses essentielles, pour faire face aux imprévus.",
  "livret-reglemente":
    "Un livret d’épargne sans risque, comme le Livret A, dont l’État fixe le taux et le montant maximum.",
  mensualite: "La somme que l’on rembourse chaque mois pour un crédit.",
  "taux-nominal":
    "Le taux qui sert à calculer les intérêts d’un crédit, sans compter les frais ni l’assurance.",
  taeg: "Le vrai prix d’un crédit en pourcentage par an, frais et assurance obligatoire compris, plus complet que le taux nominal. C’est le chiffre à comparer entre deux offres.",
  "cout-total-credit":
    "Tout ce que le crédit vous coûte en plus de la somme empruntée : intérêts, frais et assurance.",
  amortissement:
    "Le tableau qui montre, pour chaque mensualité, ce qui part en intérêts, ce qui rembourse vraiment la somme empruntée et ce qu’il reste à rembourser.",
  "taux-endettement":
    "La part de vos revenus qui part chaque mois dans vos mensualités de crédit.",
  "credit-renouvelable":
    "Une réserve d’argent prêtée que l’on peut réutiliser à mesure qu’on rembourse. Pratique, mais souvent très cher et long à rembourser.",
  "pouvoir-achat":
    "Ce que votre argent permet réellement d’acheter. Si les prix montent plus vite que votre revenu, il baisse.",
  "salaire-reel":
    "Votre salaire une fois retirée l’inflation : une augmentation de 2 % quand les prix montent de 3 % est en fait une baisse.",
  ipc: "Le chiffre officiel qui mesure l’inflation, c’est-à-dire si les prix montent, à partir d’un panier de dépenses courantes.",
  "chiffre-affaires":
    "Le total des ventes d’une entreprise sur une période, avant de retirer ce que ces ventes ont coûté.",
  "marge-couts-variables":
    "Ce qui reste du chiffre d’affaires une fois payé ce que chaque vente coûte directement (les coûts variables). Il faut encore payer les charges fixes : ce n’est pas encore le bénéfice.",
  tresorerie:
    "L’argent réellement présent sur les comptes de l’entreprise aujourd’hui. On peut bien vendre et en manquer si les clients paient tard.",
  resultat:
    "Ce que l’entreprise a gagné ou perdu sur une période : le chiffre d’affaires moins toutes les dépenses. Ce n’est pas la trésorerie, l’argent disponible.",
  "creance-client":
    "L’argent qu’un client vous doit pour une vente déjà faite mais pas encore payée.",
  "delai-paiement":
    "Le temps qu’un client met à payer après avoir reçu la facture. Pendant ce temps, l’argent manque à votre trésorerie.",
  bfr: "L’argent bloqué dans l’activité : le stock pas encore vendu et les factures pas encore payées (les créances clients), moins ce que vous devez vous-même à vos fournisseurs.",
  "seuil-rentabilite":
    "Le niveau de chiffre d’affaires à partir duquel on ne perd plus d’argent. En dessous, on perd ; au-dessus, on commence à gagner.",
  "cout-variable":
    "Une dépense qui augmente avec chaque vente : la matière, la livraison, la commission.",
  hypothese:
    "Une idée que l’on croit vraie, par exemple « les clients paieraient pour ça », écrite de façon à pouvoir la vérifier.",
  "proposition-valeur":
    "En une phrase : pour qui est votre offre, quel problème elle règle et ce que le client y gagne.",
  llm: "Le type d’IA derrière les assistants qui écrivent. Elle a lu énormément de textes et devine, token par token, la suite la plus probable.",
  token:
    "Le petit morceau de texte que l’IA lit et écrit : un mot, un bout de mot ou un signe.",
  contexte:
    "Tout ce que l’IA a sous les yeux pour répondre : votre message, vos consignes, les documents fournis. Sa taille est limitée.",
  hallucination:
    "Quand l’IA invente une réponse qui a l’air juste mais qui est fausse, comme une source ou un chiffre qui n’existent pas.",
  inference:
    "Le moment où l’IA, déjà entraînée, produit une réponse. Discuter avec elle ne la fait pas apprendre.",
  prompt:
    "La consigne que l’on donne à l’IA : ce qu’on veut, avec quelles informations, quelles règles et sous quelle forme.",
  "few-shot":
    "Donner à l’IA quelques exemples de ce qu’on attend, pour qu’elle comprenne mieux la tâche.",
  "injection-prompt":
    "Un piège : un texte caché dans un document ou une page se fait passer pour une consigne et pousse l’IA à faire autre chose que ce que vous vouliez.",
  workflow:
    "Une suite d’étapes prévues à l’avance pour faire une tâche, avec des vérifications en chemin.",
  agent:
    "Une IA qui ne se contente pas de répondre : elle choisit elle-même certaines actions ou outils pour atteindre un but, dans des limites fixées.",
  "moindre-privilege":
    "Ne donner à un outil que les accès dont il a vraiment besoin, et rien de plus, pour limiter les dégâts en cas d’erreur.",
  idempotence:
    "Le fait qu’une action faite deux fois par erreur n’ait pas d’effet en plus : par exemple, ne pas rembourser deux fois le même client.",
  "micro-entreprise":
    "La façon la plus simple de travailler à son compte : peu de paperasse, et des cotisations calculées sur le chiffre d’affaires encaissé.",
  "entreprise-individuelle":
    "Travailler à son compte en son nom, sans créer de société. Vos biens personnels sont en principe protégés des dettes de l’activité.",
  eurl: "Une société avec un seul propriétaire, dont le patron cotise comme un indépendant.",
  sasu: "Une société avec un seul propriétaire, dont le patron est assimilé salarié : il cotise presque comme un salarié, mais sans droit au chômage.",
  sas: "Une société à plusieurs propriétaires, aux règles très souples, souvent choisie pour faire entrer des investisseurs.",
  "assimile-salarie":
    "Un patron de société (SAS ou SASU) qui a presque la même protection sociale qu’un salarié, sans le chômage.",
  "impot-societes":
    "L’impôt qu’une société paie sur son bénéfice. Ce que le patron en retire est imposé à part.",
  "franchise-tva":
    "Tant que l’on vend peu, on peut ne pas ajouter la TVA à ses prix. En échange, on ne récupère pas celle payée sur ses achats.",
  "versement-liberatoire":
    "Pour un micro-entrepreneur, une option qui permet de payer son impôt en même temps que ses cotisations, en petit pourcentage de chaque encaissement.",
  "abattement-forfaitaire":
    "Une réduction automatique appliquée au chiffre d’affaires d’un micro-entrepreneur, censée représenter ses dépenses, pour calculer son impôt.",
  "guichet-unique":
    "Le site officiel où l’on fait toutes les démarches pour créer, modifier ou fermer une entreprise.",
  siret:
    "Le numéro d’identité de chaque lieu d’activité d’une entreprise, à indiquer sur les factures.",
  "pret-honneur":
    "Un prêt sans intérêt fait à la personne qui crée l’entreprise, par des associations d’aide, pour l’aider à démarrer.",
  dilution:
    "Quand de nouveaux associés entrent dans une société, la part de chaque ancien associé devient plus petite.",
  "cout-acquisition":
    "Ce qu’il faut dépenser en moyenne pour gagner un nouveau client : publicité, temps passé, cadeaux de bienvenue.",
  "valeur-vie-client":
    "Ce qu’un client rapporte au total pendant toute la durée où il reste client. Il doit rapporter plus qu’il n’a coûté à gagner.",
  "produit-minimum-viable":
    "La toute première version, la plus simple possible, d’une offre : juste de quoi voir si des clients l’utilisent et la paient.",
  "taux-conversion":
    "Sur 100 personnes à une étape, combien passent à la suivante. Exemple : 3 visiteurs sur 100 qui demandent un devis, c’est 3 %.",
  "cout-revient":
    "Ce que coûte vraiment un produit vendu : ses coûts directs plus sa part des dépenses fixes de l’entreprise.",
  "tva-collectee":
    "La TVA ajoutée à vos prix et payée par vos clients. Elle ne vous appartient pas : vous la reversez à l’État.",
  "tva-deductible":
    "La TVA que l’entreprise a payée sur ses achats et qu’elle peut retirer de la TVA collectée avant de reverser le reste à l’État.",
  avoir:
    "Un document qui annule ou corrige une facture déjà envoyée. On ne supprime jamais une facture : on fait un avoir.",
  "facture-electronique":
    "Une facture envoyée sous forme de données lisibles par les logiciels, via une plateforme agréée. Elle devient peu à peu obligatoire entre entreprises.",
  "compte-resultat":
    "Le document qui dit si l’entreprise a gagné ou perdu de l’argent sur l’année : ce qu’elle a vendu face à ce qu’elle a dépensé.",
  bilan:
    "Une photo de l’entreprise à une date : d’un côté ce qu’elle possède, de l’autre comment c’est payé, avec ses dettes et ses capitaux propres.",
  "capitaux-propres":
    "L’argent qui appartient aux propriétaires de l’entreprise : ce qu’ils ont apporté et les bénéfices laissés dedans.",
  ebe: "Ce que le métier de l’entreprise rapporte vraiment avant les intérêts, les impôts et l’usure du matériel. Il montre si l’activité fabrique de la trésorerie.",
  "plan-tresorerie":
    "Un tableau, mois par mois, de l’argent qui va entrer et sortir, à la date où il bouge vraiment.",
  "fonds-roulement":
    "L’argent stable dont dispose l’entreprise (apports, emprunts longs) une fois payés ses gros équipements.",
  "analyse-sensibilite":
    "Changer un seul chiffre de son prévisionnel à la fois (prix, ventes, coûts) pour voir lequel peut le plus faire échouer le projet.",
  immobilisation:
    "Un bien acheté pour servir plusieurs années, comme un ordinateur, une machine ou un véhicule.",
  "amortissement-comptable":
    "Étaler le coût d’une immobilisation (un gros achat) sur les années où elle sert. Un ordinateur de 1 500 € utilisé 3 ans compte 500 € par an.",
  caf: "La trésorerie que l’activité permet de dégager pour investir ou rembourser ses emprunts, sans aide extérieure.",
  "delai-recuperation":
    "Le temps qu’il faut pour qu’un investissement rapporte autant qu’il a coûté.",
  "taux-marge":
    "La part du prix de vente qui reste en marge. Exemple : 30 € de marge sur 100 € de chiffre d’affaires, c’est 30 %.",
  agios:
    "Ce que la banque vous fait payer quand votre compte passe dans le rouge (découvert).",
  hameconnage:
    "Une arnaque par SMS ou courriel qui se fait passer pour votre banque ou un organisme connu pour vous voler vos codes.",
  "taux-marginal":
    "Le taux d’impôt de la tranche la plus haute que vous atteignez. Il ne touche que la partie de vos revenus au-dessus de ce seuil, pas tout.",
  "taux-moyen":
    "La part réelle de vos revenus qui part en impôt : l’impôt total divisé par vos revenus. Il est toujours plus bas que le taux marginal.",
  "quotient-familial":
    "Le calcul qui adapte l’impôt à la taille de la famille : on divise les revenus par un nombre de « parts » selon les personnes à charge.",
  "prelevement-source":
    "L’impôt sur le revenu est retiré directement chaque mois de votre salaire. Il faut quand même faire sa déclaration chaque année.",
  "credit-impot":
    "Un avantage qui diminue votre impôt ; si vous n’en devez pas assez, l’État vous rembourse la différence.",
  "franchise-assurance":
    "La petite partie d’un dommage que vous payez vous-même ; l’assurance paie le reste.",
  "frais-acquisition":
    "Les taxes et frais en plus du prix quand on achète un logement, souvent appelés « frais de notaire ».",
  repartition:
    "Le système où l’argent que versent les gens qui travaillent aujourd’hui paie directement les pensions des retraités d’aujourd’hui.",
  "taux-plein":
    "Une retraite sans réduction, parce qu’on a assez travaillé ou qu’on a atteint un certain âge.",
  "plan-epargne-retraite":
    "Une épargne bloquée jusqu’à la retraite, sauf exceptions. On paie souvent moins d’impôt en versant, et on le paie à la sortie.",
  duration:
    "Un chiffre qui dit à quel point le prix d’une obligation réagit quand les taux d’intérêt bougent. Plus il est grand, plus le prix bouge.",
  "spread-credit":
    "Le supplément d’intérêt que demande un prêteur à un emprunteur plus risqué qu’un État solide. Plus le risque de défaut est grand, plus il est élevé.",
  notation:
    "Une note donnée par une agence spécialisée qui dit si un emprunteur a de bonnes chances de rembourser, comme un bulletin scolaire.",
  "liste-noire":
    "La liste publique des sites et sociétés qui n’ont pas le droit de proposer des placements en France. À regarder avant de verser le moindre euro.",
  orias:
    "Le registre officiel où l’on vérifie qu’un conseiller en placements ou en assurance a bien le droit d’exercer.",
  scpi: "Une façon d’investir dans l’immobilier sans acheter un logement : on achète des parts d’un ensemble d’immeubles loués. Frais d’entrée élevés, argent non garanti.",
  "rendement-locatif":
    "Ce que rapporte vraiment un logement loué chaque année, une fois retirés charges, taxes et mois sans locataire, comparé à son prix d’achat total.",
  "micro-foncier":
    "Pour qui loue un logement vide et touche peu de loyers : on n’est imposé que sur 70 % des loyers, sans calcul compliqué.",
  blockchain:
    "Un grand registre partagé entre de nombreux ordinateurs, où chaque échange est inscrit et presque impossible à modifier ensuite.",
  "crypto-actif":
    "Une monnaie ou un jeton numérique comme le bitcoin, inscrit sur une blockchain. Il ne produit aucun revenu et son prix peut s’effondrer.",
  stablecoin:
    "Un crypto-actif qui essaie de valoir toujours autant qu’une vraie monnaie (souvent 1 dollar), grâce à des réserves plus ou moins solides.",
  mica: "Les règles européennes qui encadrent les entreprises qui vendent ou gardent des crypto-actifs.",
  "profil-risque":
    "Votre portrait d’épargnant : combien de temps vous pouvez attendre, combien vous pouvez perdre sans être en difficulté, et ce que vous supportez de voir baisser.",
  "allocation-actifs":
    "Comment vous répartissez votre épargne entre les grandes familles : argent disponible, obligations, actions, immobilier.",
  pfu: "L’impôt appliqué par défaut sur ce que rapportent vos placements (intérêts, dividendes, plus-values), à un taux unique, prélèvements sociaux compris.",
  "prelevements-sociaux":
    "Des contributions qui financent la protection sociale, prélevées en plus de l’impôt sur ce que rapportent vos placements.",
  rgpd: "Les règles européennes qui protègent toutes les informations sur une personne : ce qu’on a le droit de collecter et ce qu’on doit en faire.",
  minimisation:
    "Une règle du RGPD : ne collecter que les informations vraiment nécessaires, rien de plus « au cas où ».",
  pseudonymisation:
    "Remplacer le nom ou les coordonnées d’une personne par un code. Si l’on peut encore la retrouver, ses informations restent protégées par la loi.",
  "cas-usage":
    "Une tâche précise où l’on pense utiliser l’IA, choisie parce qu’elle revient souvent et qu’on peut vérifier le résultat.",
  "projet-pilote":
    "Un essai court et limité, avec des objectifs mesurables, avant d’utiliser un outil partout.",
  "jeu-cas-test":
    "Une série d’exemples réels dont on connaît la bonne réponse, pour vérifier si un outil d’IA se trompe souvent.",
  biais:
    "Quand un outil traite injustement des personnes semblables différemment, par exemple selon leur genre ou leur origine.",
  "supervision-humaine":
    "Une personne compétente vérifie ce que l’IA produit et a le temps et le droit de le corriger ou de le refuser.",
  "ai-act":
    "La loi européenne sur l’intelligence artificielle : plus un usage est risqué pour les gens, plus les règles sont strictes.",
  "haut-risque":
    "Un usage de l’IA qui peut beaucoup changer la vie des gens (emploi, crédit, école, santé) et qui doit donc respecter les règles plus strictes de l’AI Act.",
  hypertrucage:
    "Une fausse image, voix ou vidéo fabriquée par l’intelligence artificielle pour avoir l’air vraie. La loi oblige à dire qu’elle est fabriquée.",
};

/** La définition à montrer en premier : la simple si elle existe. */
export const plainDefinition = (entry: { id: string; definition: string }) =>
  simpleDefinitions[entry.id] ?? entry.definition;
