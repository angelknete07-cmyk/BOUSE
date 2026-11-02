import { useState } from "react";
import { calculateEconomics } from "../lib/domain";
import "../lesson-scene.css";

const euros = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export function LessonScene({ lessonId }: { lessonId: string }) {
  if (lessonId === "ca-marge-tresorerie") return <CashScene />;
  if (lessonId === "seuil-rentabilite") return <BreakEvenScene />;
  if (lessonId === "validation-client") return <EvidenceScene />;
  if (lessonId === "comprendre-llm") return <LanguageScene />;
  if (lessonId === "prompt-structure") return <PromptScene />;
  if (lessonId === "automatisation-agent") return <WorkflowScene />;
  return null;
}

function CashScene() {
  const [day, setDay] = useState(60);
  const [view, setView] = useState("cash");
  const receiptX = 42 + (day / 90) * 516;
  const paidInMonth = day <= 30;
  return (
    <section
      className="scene-workbench scene-cash"
      aria-label="Explorer le résultat et la trésorerie"
    >
      <div className="scene-heading">
        <div>
          <span className="eyebrow">MANIPULEZ LE DÉCALAGE</span>
          <h3>Une vente. Deux horloges.</h3>
        </div>
        <span className="scene-fiction">Cas fictif · HT</span>
      </div>
      <div className="scene-segment" aria-label="Indicateur à explorer">
        <button
          type="button"
          aria-pressed={view === "cash"}
          onClick={() => setView("cash")}
        >
          Trésorerie
        </button>
        <button
          type="button"
          aria-pressed={view === "result"}
          onClick={() => setView("result")}
        >
          Résultat
        </button>
      </div>
      <div className="scene-number-line">
        <div>
          <strong className="scene-number" aria-live="polite">
            {euros.format(view === "cash" ? (paidInMonth ? 200 : -800) : 200)}
          </strong>
          <span>
            {view === "cash" ? "Solde simplifié à J30" : "Résultat de la vente"}
          </span>
        </div>
        <p>
          {view === "cash"
            ? paidInMonth
              ? "Le client a payé avant la fin du mois."
              : "La vente est rentable. Le règlement arrive plus tard."
            : "1 000 € de vente − 300 € de coûts variables − 500 € de charges fixes."}
        </p>
      </div>
      <div className="scene-timeline" aria-hidden="true">
        <svg viewBox="0 0 600 90">
          <line x1="42" y1="45" x2="558" y2="45" className="scene-line-dim" />
          <line
            x1="128"
            y1="45"
            x2={receiptX}
            y2="45"
            className="scene-line-focus"
          />
          <circle cx="128" cy="45" r="5" />
          <circle cx={receiptX} cy="45" r="7" className="scene-point-focus" />
          <text x="128" y="22" textAnchor="middle">
            J15 · −800 €
          </text>
          <text x={receiptX} y="76" textAnchor="middle">
            J{day} · +1 000 €
          </text>
        </svg>
      </div>
      <label className="scene-range">
        Règlement du client <strong>J{day}</strong>
        <input
          type="range"
          min="15"
          max="90"
          step="1"
          value={day}
          aria-label="Jour de règlement du client"
          onChange={(event) => setDay(Number(event.target.value))}
        />
      </label>
      <p className="scene-takeaway">
        Départ : 0 €. Charges payées à J15.{" "}
        {day > 15
          ? `${day - 15} jours à financer entre le paiement des charges et l’encaissement.`
          : "Charges et encaissement coïncident : pas de décalage dans ce modèle."}{" "}
        <strong>Le résultat reste 200 €.</strong>
      </p>
    </section>
  );
}

function BreakEvenScene() {
  const [price, setPrice] = useState(40);
  const result = calculateEconomics({
    price,
    unitCost: 16,
    units: 100,
    fixedCosts: 2400,
  });
  const max = Math.max(price * 300, 7200);
  const y = (amount: number) => 130 - (amount / max) * 110;
  const threshold = result.breakEvenUnits!;
  const thresholdX = 40 + (threshold / 300) * 520;
  return (
    <section
      className="scene-workbench"
      aria-label="Explorer le seuil de rentabilité"
    >
      <div className="scene-heading">
        <div>
          <span className="eyebrow">DÉPLACEZ LE POINT D’ÉQUILIBRE</span>
          <h3>Que change votre prix ?</h3>
        </div>
        <span className="scene-fiction">Cas fictif · HT</span>
      </div>
      <div className="scene-number-line">
        <div>
          <strong className="scene-number" aria-live="polite">
            {threshold}
            <small> unités</small>
          </strong>
          <span>pour couvrir 2 400 € de charges fixes</span>
        </div>
        <p>
          Chaque vente contribue pour{" "}
          <strong>{euros.format(price - 16)}</strong>, après 16 € de coût
          variable.
        </p>
      </div>
      <svg
        className="scene-break-even"
        viewBox="0 0 600 155"
        role="img"
        aria-label={`Les ventes couvrent les charges à partir de ${threshold} unités.`}
      >
        <line x1="40" y1="130" x2="560" y2="130" className="scene-line-dim" />
        <path
          d={`M40 ${y(2400)} L560 ${y(7200)}`}
          className="scene-cost-curve"
        />
        <path
          d={`M40 130 L560 ${y(price * 300)}`}
          className="scene-revenue-curve"
        />
        <line
          x1={thresholdX}
          y1={y(price * threshold)}
          x2={thresholdX}
          y2="130"
          className="scene-crosshair"
        />
        <circle
          cx={thresholdX}
          cy={y(price * threshold)}
          r="5"
          className="scene-point-focus"
        />
        <text x="40" y="151">
          0 vente
        </text>
        <text x="560" y="151" textAnchor="end">
          300 ventes
        </text>
      </svg>
      <div className="scene-legend">
        <span>
          <i />
          Chiffre d’affaires
        </span>
        <span>
          <i />
          Charges totales
        </span>
      </div>
      <label className="scene-range">
        Prix de vente <strong>{euros.format(price)}</strong>
        <input
          type="range"
          min="25"
          max="70"
          step="1"
          value={price}
          aria-label="Prix de vente du mini modèle"
          onChange={(event) => setPrice(Number(event.target.value))}
        />
      </label>
      <p className="scene-takeaway">
        Ce modèle suppose un coût stable et une demande inchangée.{" "}
        <strong>Un seuil plus bas ne garantit pas les ventes.</strong>
      </p>
    </section>
  );
}

const evidence = [
  {
    label: "Avis positif",
    quote: "« C’est une bonne idée. »",
    fact: "Une personne exprime un intérêt.",
    limit: "Elle n’a encore consacré ni temps ni argent au problème.",
    next: "Demandez un exemple récent, concret, vécu.",
  },
  {
    label: "Problème observé",
    quote: "« Hier, j’ai perdu deux heures à rapprocher mes factures. »",
    fact: "Une difficulté précise est décrite, avec une pratique actuelle.",
    limit: "L’entretien ne prouve ni achat futur ni taille de marché.",
    next: "Observez les alternatives et les efforts déjà engagés.",
  },
  {
    label: "Pilote payé",
    quote: "« Je paie un premier essai pour traiter mes factures. »",
    fact: "Un client engage de l’argent pour essayer une solution.",
    limit: "Un premier paiement ne garantit ni rétention ni rentabilité.",
    next: "Mesurez l’usage, le résultat obtenu et le renouvellement.",
  },
];
function EvidenceScene() {
  const [selected, setSelected] = useState(0);
  const item = evidence[selected]!;
  return (
    <section
      className="scene-workbench scene-evidence"
      aria-label="Comparer les preuves de validation client"
    >
      <div className="scene-heading">
        <div>
          <span className="eyebrow">REMONTÉE VERS LES PREUVES</span>
          <h3>De l’opinion à l’engagement.</h3>
        </div>
        <span className="scene-fiction">Situations fictives</span>
      </div>
      <div className="scene-evidence-track">
        {evidence.map((entry, index) => (
          <button
            key={entry.label}
            type="button"
            aria-pressed={selected === index}
            onClick={() => setSelected(index)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {entry.label}
          </button>
        ))}
      </div>
      <blockquote key={selected} className="scene-quote">
        {item.quote}
      </blockquote>
      <div className="scene-comparison">
        <div>
          <span>Ce qui est observé</span>
          <p>{item.fact}</p>
        </div>
        <div>
          <span>Ce que cela ne prouve pas</span>
          <p>{item.limit}</p>
        </div>
      </div>
      <p className="scene-takeaway">
        <strong>Prochaine question :</strong> {item.next}
      </p>
    </section>
  );
}

const languageStages = [
  {
    label: "Contexte",
    title: "Les données disponibles.",
    text: "Offre A : 1 000 €. Offre B : 900 €. Compare les prix à périmètre identique.",
    note: "Le modèle ne voit que les informations fournies ou retrouvées par ses outils.",
  },
  {
    label: "Génération",
    title: "Plausible n’est pas exact.",
    text: "« L’offre A est la plus économique. »",
    note: "Sortie illustrative volontairement erronée : une phrase convaincante peut contredire les données.",
  },
  {
    label: "Vérification",
    title: "Revenir aux faits.",
    text: "900 € < 1 000 € : l’offre B coûte 100 € de moins.",
    note: "Le calcul et les documents d’origine permettent de contrôler cette affirmation précise.",
  },
];
function LanguageScene() {
  const [selected, setSelected] = useState(0);
  const stage = languageStages[selected]!;
  return (
    <section
      className="scene-workbench scene-language"
      aria-label="Explorer les étapes d’une réponse de modèle de langage"
    >
      <div className="scene-heading">
        <div>
          <span className="eyebrow">DÉMONTER LE MÉCANISME</span>
          <h3>Une réponse n’est pas une preuve.</h3>
        </div>
      </div>
      <div className="scene-pipeline">
        {languageStages.map((item, index) => (
          <button
            key={item.label}
            type="button"
            aria-pressed={selected === index}
            onClick={() => setSelected(index)}
          >
            <span className="scene-pipeline-node">{index + 1}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      <div className="scene-output" key={selected}>
        <span className="scene-output-label">{stage.title}</span>
        <p>{stage.text}</p>
      </div>
      <p className="scene-takeaway">{stage.note}</p>
      <span className="scene-fiction">
        Schéma pédagogique · aucun modèle exécuté
      </span>
    </section>
  );
}

const promptLayers = [
  {
    label: "Objectif",
    text: "Compare trois devis de maintenance et prépare une aide à la décision.",
    hint: "Une action et un résultat concret, plutôt qu’un rôle vague.",
  },
  {
    label: "Contexte",
    text: "Je gère un atelier de cinq personnes ; une panne bloque les livraisons.",
    hint: "La situation et le public changent les critères utiles.",
  },
  {
    label: "Données",
    text: "Utilise uniquement les trois devis joints ; distingue services inclus et options.",
    hint: "Indiquer ce qui est disponible, sans inventer ce qui manque.",
  },
  {
    label: "Contraintes",
    text: "N’invente aucun tarif. Signale les informations absentes et les points à clarifier.",
    hint: "Le périmètre et les limites protègent la décision.",
  },
  {
    label: "Format",
    text: "Un tableau : coût annuel, délai d’intervention, exclusions, question à poser.",
    hint: "Le format doit servir l’usage de la réponse.",
  },
  {
    label: "Vérification",
    text: "Pour chaque chiffre, précise le devis et la page. Sépare faits et hypothèses.",
    hint: "Préparer le contrôle ; une citation doit encore être vérifiée.",
  },
];
function PromptScene() {
  const [selected, setSelected] = useState(0);
  const layer = promptLayers[selected]!;
  return (
    <section
      className="scene-workbench scene-prompt"
      aria-label="Explorer les six couches d’un prompt structuré"
    >
      <div className="scene-heading">
        <div>
          <span className="eyebrow">UNE DEMANDE, SIX COUCHES</span>
          <h3>Construire la précision.</h3>
        </div>
        <span className="scene-fiction">Exemple fictif</span>
      </div>
      <div className="scene-prompt-layers">
        {promptLayers.map((item, index) => (
          <button
            key={item.label}
            type="button"
            aria-pressed={selected === index}
            onClick={() => setSelected(index)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {item.label}
          </button>
        ))}
      </div>
      <div className="scene-output" key={selected}>
        <span className="scene-output-label">
          {layer.label} <small>{selected + 1} / 6</small>
        </span>
        <p>{layer.text}</p>
      </div>
      <p className="scene-takeaway">
        {layer.hint}{" "}
        <strong>La structure aide ; elle ne garantit pas la qualité.</strong>
      </p>
    </section>
  );
}

function WorkflowScene() {
  const [task, setTask] = useState("reminder");
  const deterministic = task === "reminder";
  const nodes = deterministic
    ? ["Échéance", "Règle à J30", "Brouillon", "Validation"]
    : ["Objectif", "Recherche", "Évaluation", "Synthèse"];
  return (
    <section
      className="scene-workbench scene-workflow"
      aria-label="Comparer un workflow connu et un chemin adaptatif"
    >
      <div className="scene-heading">
        <div>
          <span className="eyebrow">LE BON DEGRÉ D’AUTONOMIE</span>
          <h3>Quel chemin pour cette tâche ?</h3>
        </div>
      </div>
      <div className="scene-segment">
        <button
          type="button"
          aria-pressed={deterministic}
          onClick={() => setTask("reminder")}
        >
          Relancer à échéance
        </button>
        <button
          type="button"
          aria-pressed={!deterministic}
          onClick={() => setTask("research")}
        >
          Comparer des marchés
        </button>
      </div>
      <div
        className={`scene-workflow-map ${deterministic ? "" : "scene-workflow-loop"}`}
        role="group"
        aria-label="Chemin proposé, exemple pédagogique"
      >
        {nodes.map((node, index) => (
          <div key={node}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{node}</strong>
          </div>
        ))}
        {!deterministic && (
          <span className="scene-loop-label">
            Rechercher à nouveau si les preuves manquent
          </span>
        )}
      </div>
      <div className="scene-output">
        <span className="scene-output-label">
          {deterministic ? "Le chemin est connu." : "Le chemin peut s’adapter."}
        </span>
        <p>
          {deterministic
            ? "Une date, une condition, un brouillon à valider : un workflow déterministe suffit souvent."
            : "Le choix des recherches dépend des résultats. Un agent peut aider, avec un périmètre, un budget et des contrôles."}
        </p>
      </div>
      <p className="scene-takeaway">
        {deterministic
          ? "L’envoi n’est pas exécuté ici. Les règles et l’approbation restent explicites."
          : "Un workflow de recherche guidé peut aussi suffire. L’autonomie doit répondre à un besoin, pas devenir un objectif."}
      </p>
    </section>
  );
}
