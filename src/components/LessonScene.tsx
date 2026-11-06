import { useState } from "react";
import { calculateEconomics } from "../lib/domain";
import {
  MICRO_RULES_2026,
  microEstimate,
  type MicroActivity,
} from "../lib/entrepreneurship";
import { projectInvestment } from "../lib/investing";
import { budgetBalance, loanPayment } from "../lib/personalFinance";
import {
  IncomeTaxScene,
  RebalanceScene,
  RentOrBuyScene,
  StatusScene,
  WorkingCapitalScene,
} from "./LessonScenesMore";

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
  if (lessonId === "inv-interets-composes") return <CompoundScene />;
  if (lessonId === "fp-budget") return <BudgetScene />;
  if (lessonId === "fp-credit-taux") return <CreditScene />;
  if (lessonId === "inv-risque-diversification") return <DrawdownScene />;
  if (lessonId === "ent-micro-entreprise") return <MicroScene />;
  if (lessonId === "fp-impot-revenu") return <IncomeTaxScene />;
  if (lessonId === "fin-bfr-tresorerie") return <WorkingCapitalScene />;
  if (lessonId === "fp-logement") return <RentOrBuyScene />;
  if (lessonId === "inv-allocation-profil") return <RebalanceScene />;
  if (lessonId === "ent-statut-juridique") return <StatusScene />;
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
      <div
        className="scene-segment"
        role="group"
        aria-label="Indicateur à explorer"
      >
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

/** Fictitious constant-rate projection: compounding versus fees. */
function CompoundScene() {
  const [fees, setFees] = useState(1);
  const [years, setYears] = useState(20);
  const projection = projectInvestment({
    initial: 10_000,
    monthly: 0,
    annualReturn: 5,
    annualFees: fees,
    inflation: 0,
    years,
  });
  const max = projection.finalWithoutFees;
  const x = (year: number) => 40 + (year / years) * 520;
  const y = (value: number) => 130 - (value / max) * 110;
  const line = (key: "value" | "valueWithoutFees") =>
    projection.years
      .map(
        (point, index) =>
          `${index ? "L" : "M"}${x(point.year)} ${y(point[key])}`,
      )
      .join(" ");
  return (
    <section
      className="scene-workbench"
      aria-label="Explorer les intérêts composés et les frais"
    >
      <div className="scene-heading">
        <div>
          <span className="eyebrow">FAITES VARIER LES FRAIS</span>
          <h3>Le temps compose. Les frais aussi.</h3>
        </div>
        <span className="scene-fiction">Taux fictif constant · 5 %</span>
      </div>
      <div className="scene-number-line">
        <div>
          <strong className="scene-number" aria-live="polite">
            {euros.format(projection.finalValue)}
          </strong>
          <span>
            après {years} ans, avec {fees.toLocaleString("fr-FR")} % de frais
            annuels
          </span>
        </div>
        <p>
          Sans frais :{" "}
          <strong>{euros.format(projection.finalWithoutFees)}</strong>. Les
          frais coûtent <strong>{euros.format(projection.feeCost)}</strong> sur
          la période.
        </p>
      </div>
      <svg
        className="scene-break-even"
        viewBox="0 0 600 155"
        role="img"
        aria-label={`10 000 € deviennent ${euros.format(projection.finalValue)} avec frais, contre ${euros.format(projection.finalWithoutFees)} sans frais.`}
      >
        <line x1="40" y1="130" x2="560" y2="130" className="scene-line-dim" />
        <path d={line("valueWithoutFees")} className="scene-cost-curve" />
        <path d={line("value")} className="scene-revenue-curve" />
        <text x="40" y="151">
          Aujourd’hui
        </text>
        <text x="560" y="151" textAnchor="end">
          {years} ans
        </text>
      </svg>
      <div className="scene-legend">
        <span>
          <i />
          Avec frais
        </span>
        <span>
          <i />
          Sans frais
        </span>
      </div>
      <label className="scene-range">
        Frais annuels <strong>{fees.toLocaleString("fr-FR")} %</strong>
        <input
          type="range"
          min="0"
          max="3"
          step="0.1"
          value={fees}
          aria-label="Frais annuels en pourcentage"
          onChange={(event) => setFees(Number(event.target.value))}
        />
      </label>
      <label className="scene-range">
        Durée <strong>{years} ans</strong>
        <input
          type="range"
          min="1"
          max="40"
          step="1"
          value={years}
          aria-label="Durée en années"
          onChange={(event) => setYears(Number(event.target.value))}
        />
      </label>
      <p className="scene-takeaway">
        10 000 € placés à un taux fictif constant de 5 %, gains réinvestis.{" "}
        <strong>Une illustration du mécanisme, pas une prévision.</strong>
      </p>
    </section>
  );
}

/** Losses and gains are not symmetric: the recovery needed after a fall. */
function DrawdownScene() {
  const [loss, setLoss] = useState(30);
  const remaining = 100 - loss;
  const recovery = remaining > 0 ? (loss / remaining) * 100 : null;
  const percent = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 });
  return (
    <section
      className="scene-workbench"
      aria-label="Explorer la hausse nécessaire après une baisse"
    >
      <div className="scene-heading">
        <div>
          <span className="eyebrow">CHOISISSEZ UNE BAISSE</span>
          <h3>Perdre puis remonter.</h3>
        </div>
        <span className="scene-fiction">Calcul exact · sans frais</span>
      </div>
      <div className="scene-number-line">
        <div>
          <strong className="scene-number" aria-live="polite">
            {recovery === null ? "—" : `+${percent.format(recovery)} %`}
          </strong>
          <span>pour revenir au point de départ</span>
        </div>
        <p>
          10 000 € perdent {loss} % et deviennent{" "}
          <strong>{euros.format(remaining * 100)}</strong>. Il faut ensuite
          regagner {euros.format(loss * 100)} sur une base plus petite.
        </p>
      </div>
      <svg
        className="scene-break-even"
        viewBox="0 0 600 155"
        aria-hidden="true"
      >
        <line x1="40" y1="130" x2="560" y2="130" className="scene-line-dim" />
        <rect
          x="90"
          y={130 - 110}
          width="120"
          height="110"
          className="scene-bar-dim"
        />
        <rect
          x="240"
          y={130 - remaining * 1.1}
          width="120"
          height={remaining * 1.1}
          className="scene-bar-focus"
        />
        <rect
          x="390"
          y={130 - 110}
          width="120"
          height="110"
          className="scene-bar-dim"
        />
        <text x="150" y="151" textAnchor="middle">
          Départ
        </text>
        <text x="300" y="151" textAnchor="middle">
          Après −{loss} %
        </text>
        <text x="450" y="151" textAnchor="middle">
          Retour
        </text>
      </svg>
      <label className="scene-range">
        Baisse <strong>−{loss} %</strong>
        <input
          type="range"
          min="5"
          max="90"
          step="5"
          value={loss}
          aria-label="Baisse en pourcentage"
          onChange={(event) => setLoss(Number(event.target.value))}
        />
      </label>
      <p className="scene-takeaway">
        Hausse nécessaire = baisse ÷ (100 − baisse).{" "}
        <strong>
          Plus la chute est profonde, plus la remontée est longue.
        </strong>
      </p>
    </section>
  );
}

/** Pay yourself first: where 1 800 € go in a fictitious month. */
function BudgetScene() {
  const income = 1800;
  const fixedCharges = 1100;
  const [savings, setSavings] = useState(150);
  const [variable, setVariable] = useState(450);
  const result = budgetBalance({
    income,
    fixedCharges,
    variableSpending: variable,
    savings,
  });
  const width = (amount: number) => (Math.max(0, amount) / income) * 520;
  let x = 40;
  const segments = [
    {
      label: "Charges fixes",
      amount: fixedCharges,
      className: "scene-bar-solid",
    },
    { label: "Épargne", amount: savings, className: "scene-bar-silver" },
    { label: "Variables", amount: variable, className: "scene-bar-soft" },
  ].map((segment) => {
    const start = x;
    x += width(segment.amount);
    return { ...segment, x: start, w: width(segment.amount) };
  });
  return (
    <section
      className="scene-workbench"
      aria-label="Explorer un budget mensuel"
    >
      <div className="scene-heading">
        <div>
          <span className="eyebrow">RÉPARTISSEZ LE MOIS</span>
          <h3>Se payer en premier.</h3>
        </div>
        <span className="scene-fiction">Budget fictif · 1 800 € nets</span>
      </div>
      <div className="scene-number-line">
        <div>
          <strong className="scene-number" aria-live="polite">
            {euros.format(result.remaining)}
          </strong>
          <span>
            {result.remaining >= 0
              ? "de marge en fin de mois"
              : "de dépassement : le mois ne tient pas"}
          </span>
        </div>
        <p>
          Épargne programmée : <strong>{euros.format(savings)}</strong>, soit{" "}
          {result.savingsRate.toLocaleString("fr-FR", {
            maximumFractionDigits: 1,
          })}
          {"\u00a0"}% des revenus. Charges fixes{"\u00a0"}:{" "}
          {result.fixedShare.toLocaleString("fr-FR", {
            maximumFractionDigits: 1,
          })}
          {"\u00a0"}%.
        </p>
      </div>
      <svg
        className="scene-break-even"
        viewBox="0 0 600 155"
        aria-hidden="true"
      >
        <rect x="40" y="50" width="520" height="40" className="scene-bar-dim" />
        {segments.map((segment) => (
          <rect
            key={segment.label}
            x={segment.x}
            y="50"
            width={Math.min(segment.w, Math.max(0, 560 - segment.x))}
            height="40"
            className={segment.className}
          />
        ))}
        {segments.map((segment) =>
          segment.w > 60 ? (
            <text key={segment.label} x={segment.x + 6} y="112">
              {segment.label}
            </text>
          ) : null,
        )}
        <text x="40" y="36">
          0 €
        </text>
        <text x="560" y="36" textAnchor="end">
          1 800 €
        </text>
      </svg>
      <label className="scene-range">
        Épargne programmée <strong>{euros.format(savings)}</strong>
        <input
          type="range"
          min="0"
          max="500"
          step="10"
          value={savings}
          aria-label="Épargne programmée en euros"
          onChange={(event) => setSavings(Number(event.target.value))}
        />
      </label>
      <label className="scene-range">
        Dépenses variables <strong>{euros.format(variable)}</strong>
        <input
          type="range"
          min="200"
          max="900"
          step="10"
          value={variable}
          aria-label="Dépenses variables en euros"
          onChange={(event) => setVariable(Number(event.target.value))}
        />
      </label>
      <p className="scene-takeaway">
        L’épargne passe avant les dépenses variables.{" "}
        <strong>
          Ce qui reste se dépense ; ce qui est programmé s’épargne.
        </strong>
      </p>
    </section>
  );
}

/** Same loan, different durations: monthly payment versus total cost. */
function CreditScene() {
  const [months, setMonths] = useState(24);
  const [rate, setRate] = useState(6);
  const result = loanPayment({ capital: 3000, annualRate: rate, months });
  const decimal = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  });
  return (
    <section
      className="scene-workbench"
      aria-label="Explorer la mensualité et le coût d’un crédit"
    >
      <div className="scene-heading">
        <div>
          <span className="eyebrow">ALLONGEZ OU RACCOURCISSEZ</span>
          <h3>Moins par mois, plus au total.</h3>
        </div>
        <span className="scene-fiction">
          3 000 € · taux fictif · hors frais
        </span>
      </div>
      <div className="scene-number-line">
        <div>
          <strong className="scene-number" aria-live="polite">
            {decimal.format(result.monthlyPayment)}
          </strong>
          <span>par mois pendant {months} mois</span>
        </div>
        <p>
          Coût total des intérêts :{" "}
          <strong>{decimal.format(result.totalInterest)}</strong>. Total
          remboursé : {decimal.format(result.totalPaid)}.
        </p>
      </div>
      <svg
        className="scene-break-even"
        viewBox="0 0 600 155"
        aria-hidden="true"
      >
        <line x1="40" y1="130" x2="560" y2="130" className="scene-line-dim" />
        <rect
          x="90"
          y={130 - (3000 / 4000) * 110}
          width="160"
          height={(3000 / 4000) * 110}
          className="scene-bar-dim"
        />
        <rect
          x="90"
          y={130 - (3000 / 4000) * 110 - (result.totalInterest / 4000) * 110}
          width="160"
          height={(result.totalInterest / 4000) * 110}
          className="scene-bar-focus"
        />
        <text x="170" y="150" textAnchor="middle">
          Capital + intérêts
        </text>
        <text x="420" y="60" textAnchor="middle">
          {months} mensualités
        </text>
        <text x="420" y="84" textAnchor="middle">
          de {decimal.format(result.monthlyPayment)}
        </text>
      </svg>
      <label className="scene-range">
        Durée <strong>{months} mois</strong>
        <input
          type="range"
          min="6"
          max="60"
          step="6"
          value={months}
          aria-label="Durée du crédit en mois"
          onChange={(event) => setMonths(Number(event.target.value))}
        />
      </label>
      <label className="scene-range">
        Taux nominal <strong>{rate.toLocaleString("fr-FR")} %</strong>
        <input
          type="range"
          min="1"
          max="20"
          step="0.5"
          value={rate}
          aria-label="Taux nominal annuel en pourcentage"
          onChange={(event) => setRate(Number(event.target.value))}
        />
      </label>
      <p className="scene-takeaway">
        Le TAEG ajoute frais et assurance exigée.{" "}
        <strong>Comparez le coût total, pas seulement la mensualité.</strong>
      </p>
    </section>
  );
}

const MICRO_SAMPLES: Record<
  MicroActivity,
  {
    label: string;
    revenue: number;
    charges: number;
    maxRevenue: number;
    maxCharges: number;
    step: number;
  }
> = {
  services: {
    label: "Prestations de services",
    revenue: 30_000,
    charges: 3_000,
    maxRevenue: 100_000,
    maxCharges: 50_000,
    step: 1_000,
  },
  vente: {
    label: "Vente de marchandises",
    revenue: 60_000,
    charges: 36_000,
    maxRevenue: 220_000,
    maxCharges: 160_000,
    step: 2_000,
  },
};

const percent = (rate: number) =>
  `${(rate * 100).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %`;

/** One year of a micro-entreprise: what the revenue really leaves. */
function MicroScene() {
  const [activity, setActivity] = useState<MicroActivity>("services");
  const sample = MICRO_SAMPLES[activity];
  const [revenue, setRevenue] = useState(sample.revenue);
  const [charges, setCharges] = useState(sample.charges);
  const [liberatoire, setLiberatoire] = useState(false);
  const rule = MICRO_RULES_2026[activity];
  const result = microEstimate({
    revenue,
    activity,
    realCharges: charges,
    liberatoire,
  });
  function choose(next: MicroActivity) {
    setActivity(next);
    setRevenue(MICRO_SAMPLES[next].revenue);
    setCharges(MICRO_SAMPLES[next].charges);
  }
  const scale = (amount: number) =>
    (Math.max(0, amount) / sample.maxRevenue) * 520;
  let x = 40;
  const end = 40 + scale(revenue);
  const segments = [
    {
      label: "Cotisations",
      amount: result.contributions,
      className: "scene-bar-silver",
    },
    {
      label: "Impôt",
      amount: result.liberatoireTax,
      className: "scene-bar-focus",
    },
    { label: "Charges", amount: charges, className: "scene-bar-soft" },
    {
      label: "Reste",
      amount: Math.max(0, result.remaining),
      className: "scene-bar-solid",
    },
  ].map((segment) => {
    const start = Math.min(x, end);
    x += scale(segment.amount);
    return { ...segment, x: start, w: Math.max(0, Math.min(x, end) - start) };
  });
  const marks = [
    { label: "TVA", amount: rule.vatThreshold },
    { label: "Plafond", amount: rule.ceiling },
  ].filter((mark) => mark.amount <= sample.maxRevenue);
  const warnings = [
    result.overCeiling &&
      `Au-dessus du plafond micro (${euros.format(rule.ceiling)}) : une année isolée est tolérée, deux années de suite font sortir du régime.`,
    result.overVatThreshold &&
      `Au-dessus du seuil de franchise (${euros.format(rule.vatThreshold)}) : vous facturez la TVA et la reversez, en plus des cotisations.`,
    result.chargesExceedAllowance &&
      `Vos charges réelles dépassent l’abattement de ${percent(rule.allowance)} : l’impôt porte sur un bénéfice plus élevé que le vrai. Le régime réel peut alors coûter moins.`,
  ].filter((warning): warning is string => Boolean(warning));
  return (
    <section
      className="scene-workbench scene-micro"
      aria-label="Simuler une année de micro-entreprise"
    >
      <div className="scene-heading">
        <div>
          <span className="eyebrow">SIMULEZ UNE ANNÉE</span>
          <h3>Ce que le chiffre d’affaires laisse vraiment.</h3>
        </div>
        <span className="scene-fiction">Cas fictif · 2026</span>
      </div>
      <div className="scene-micro-choices">
        <div className="scene-segment" role="group" aria-label="Activité">
          {(Object.keys(MICRO_SAMPLES) as MicroActivity[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={activity === key}
              onClick={() => choose(key)}
            >
              {MICRO_SAMPLES[key].label}
            </button>
          ))}
        </div>
        <div
          className="scene-segment"
          role="group"
          aria-label="Impôt sur le revenu"
        >
          <button
            type="button"
            aria-pressed={!liberatoire}
            onClick={() => setLiberatoire(false)}
          >
            Impôt au barème
          </button>
          <button
            type="button"
            aria-pressed={liberatoire}
            onClick={() => setLiberatoire(true)}
          >
            Versement libératoire
          </button>
        </div>
      </div>
      <div className="scene-number-line">
        <div>
          <strong className="scene-number" aria-live="polite">
            {euros.format(result.remaining)}
          </strong>
          <span>
            {liberatoire
              ? "restent sur l’année, impôt déjà payé"
              : "restent sur l’année, avant impôt sur le revenu"}
          </span>
        </div>
        <p>
          Cotisations : <strong>{euros.format(result.contributions)}</strong> (
          {percent(rule.contribution)} du chiffre d’affaires).{" "}
          {liberatoire
            ? `Impôt libératoire : ${euros.format(result.liberatoireTax)} (${percent(rule.liberatoire)}).`
            : `Bénéfice retenu par le fisc : ${euros.format(result.taxableProfit)}, après l’abattement de ${percent(rule.allowance)}.`}
        </p>
      </div>
      <svg className="scene-micro-bar" viewBox="0 0 600 150" aria-hidden="true">
        <rect x="40" y="62" width="520" height="40" className="scene-bar-dim" />
        {segments.map((segment) =>
          segment.w > 0 ? (
            <rect
              key={segment.label}
              x={segment.x}
              y="62"
              width={segment.w}
              height="40"
              className={segment.className}
            />
          ) : null,
        )}
        {marks.map((mark) => (
          <g key={mark.label}>
            <line
              x1={40 + scale(mark.amount)}
              y1="48"
              x2={40 + scale(mark.amount)}
              y2="112"
              className="scene-line-focus"
            />
            <text x={40 + scale(mark.amount)} y="38" textAnchor="middle">
              {mark.label} {euros.format(mark.amount)}
            </text>
          </g>
        ))}
        {segments.map((segment) =>
          segment.w > 78 ? (
            <text key={segment.label} x={segment.x + 6} y="132">
              {segment.label}
            </text>
          ) : null,
        )}
      </svg>
      <label className="scene-range">
        Chiffre d’affaires encaissé sur l’année{" "}
        <strong>{euros.format(revenue)}</strong>
        <input
          type="range"
          min="0"
          max={sample.maxRevenue}
          step={sample.step}
          value={revenue}
          aria-label="Chiffre d’affaires annuel en euros"
          onChange={(event) => setRevenue(Number(event.target.value))}
        />
      </label>
      <label className="scene-range">
        Charges réelles (achats, outils, déplacements){" "}
        <strong>{euros.format(charges)}</strong>
        <input
          type="range"
          min="0"
          max={sample.maxCharges}
          step={sample.step / 2}
          value={charges}
          aria-label="Charges réelles annuelles en euros"
          onChange={(event) => setCharges(Number(event.target.value))}
        />
      </label>
      <div className="scene-micro-warnings" aria-live="polite">
        {warnings.length ? (
          warnings.map((warning) => <p key={warning}>{warning}</p>)
        ) : (
          <p className="scene-micro-ok">
            Dans les seuils : pas de TVA à facturer, et l’abattement couvre vos
            charges réelles.
          </p>
        )}
      </div>
      <p className="scene-takeaway">
        Les cotisations se calculent sur le chiffre d’affaires, pas sur le
        bénéfice. Taux 2026 à vérifier sur le site de l’Urssaf ; hors
        contribution à la formation professionnelle et activités libérales, dont
        le taux dépend de la caisse.{" "}
        <strong>
          Plus vos charges sont lourdes, moins la micro est avantageuse.
        </strong>
      </p>
    </section>
  );
}
