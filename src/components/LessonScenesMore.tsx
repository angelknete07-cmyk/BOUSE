import { useState } from "react";
import {
  incomeTax,
  raiseEffect,
  rebalance,
  rentOrBuy,
  suggestStatus,
  workingCapital,
  type StatusNeeds,
} from "../lib/lessonModels";

const euros = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});
const percent = (rate: number, digits = 0) =>
  `${(rate * 100).toLocaleString("fr-FR", { maximumFractionDigits: digits })} %`;

/** A row of choices sharing the scene segment style. */
function Choices<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="scene-choice-row">
      <span className="scene-choice-caption" aria-hidden="true">
        {label}
      </span>
      <div className="scene-segment" role="group" aria-label={label}>
        {options.map((option) => (
          <button
            key={String(option.value)}
            type="button"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Two alternatives side by side: a bar each, never stacked into a sum. */
function CompareBars({
  rows,
}: {
  rows: { label: string; amount: number; display: string; className: string }[];
}) {
  const max = Math.max(...rows.map((row) => Math.abs(row.amount)), 1);
  return (
    <div className="scene-compare" aria-hidden="true">
      {rows.map((row) => (
        <div className="scene-compare-row" key={row.label}>
          <span>{row.label}</span>
          <span className="scene-compare-track">
            <i
              className={row.className}
              style={{ width: `${(Math.abs(row.amount) / max) * 100}%` }}
            />
          </span>
          <strong>{row.display}</strong>
        </div>
      ))}
    </div>
  );
}

function Range({
  label,
  shown,
  ariaLabel,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  shown: string;
  ariaLabel: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="scene-range">
      {label} <strong>{shown}</strong>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={ariaLabel}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

/** A horizontal stacked bar; each part keeps a readable text label. */
function StackedBar({
  parts,
  total,
}: {
  parts: { label: string; amount: number; className: string }[];
  total: number;
}) {
  let x = 40;
  return (
    <svg className="scene-micro-bar" viewBox="0 0 600 110" aria-hidden="true">
      <rect x="40" y="30" width="520" height="40" className="scene-bar-dim" />
      {parts.map((part) => {
        const width = total > 0 ? (Math.max(0, part.amount) / total) * 520 : 0;
        const start = x;
        x += width;
        return (
          <g key={part.label}>
            {width > 0 && (
              <rect
                x={start}
                y="30"
                width={Math.min(width, 560 - start)}
                height="40"
                className={part.className}
              />
            )}
            {width > 70 && (
              <text x={start + 6} y="92">
                {part.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ---------- Impôt sur le revenu ---------- */

export function IncomeTaxScene() {
  const [income, setIncome] = useState(36_000);
  const [parts, setParts] = useState(1);
  const result = incomeTax(income, parts);
  const raise = raiseEffect(income, parts, 1_000);
  const shades = [
    "scene-bar-dim-fill",
    "scene-bar-soft",
    "scene-bar-solid",
    "scene-bar-silver",
    "scene-bar-focus",
  ];
  return (
    <section
      className="scene-workbench scene-micro"
      aria-label="Calculer un impôt avec le barème progressif"
    >
      <div className="scene-heading">
        <div>
          <span className="eyebrow">TRANCHE PAR TRANCHE</span>
          <h3>Changer de tranche ne fait jamais perdre d’argent.</h3>
        </div>
        <span className="scene-fiction">Barème 2026 · cas fictif</span>
      </div>
      <div className="scene-micro-choices">
        <Choices
          label="Foyer (seul, couple, couple et un enfant)"
          value={parts}
          onChange={setParts}
          options={[
            { value: 1, label: "1 part" },
            { value: 2, label: "2 parts" },
            { value: 2.5, label: "2,5 parts" },
          ]}
        />
      </div>
      <div className="scene-number-line">
        <div>
          <strong className="scene-number" aria-live="polite">
            {euros.format(result.tax)}
          </strong>
          <span>d’impôt brut sur l’année</span>
        </div>
        <p>
          Taux marginal : <strong>{percent(result.marginalRate)}</strong>. Taux
          moyen : <strong>{percent(result.averageRate, 1)}</strong>, toujours
          plus bas, car chaque tranche n’impose que ses propres euros.
        </p>
      </div>
      <StackedBar
        total={result.perPart || 1}
        parts={result.slices.map((slice, index) => ({
          label: percent(slice.rate),
          amount: slice.taxed,
          className: shades[index]!,
        }))}
      />
      <Range
        label="Revenu net imposable du foyer"
        shown={euros.format(income)}
        ariaLabel="Revenu net imposable en euros"
        min={0}
        max={150_000}
        step={1_000}
        value={income}
        onChange={setIncome}
      />
      <p className="financial-reading" aria-live="polite">
        <span>
          <strong>Une augmentation de 1 000 € :</strong>{" "}
          {euros.format(raise.extraTax)} d’impôt en plus, et{" "}
          {euros.format(raise.kept)} gardés.
        </span>
      </p>
      <p className="scene-takeaway">
        Avant plafonnement du quotient familial, décote, réductions et crédits
        d’impôt. Seuils de la loi de finances pour 2026, à vérifier sur
        impots.gouv.fr.{" "}
        <strong>
          Le taux marginal ne s’applique qu’aux euros au-dessus du seuil.
        </strong>
      </p>
    </section>
  );
}

/* ---------- Besoin en fonds de roulement ---------- */

export function WorkingCapitalScene() {
  const [clientDays, setClientDays] = useState(60);
  const [supplierDays, setSupplierDays] = useState(30);
  const [stockDays, setStockDays] = useState(30);
  const result = workingCapital({
    monthlySales: 30_000,
    purchaseShare: 0.5,
    clientDays,
    supplierDays,
    stockDays,
  });
  return (
    <section
      className="scene-workbench scene-micro"
      aria-label="Mesurer le besoin en fonds de roulement"
    >
      <div className="scene-heading">
        <div>
          <span className="eyebrow">LE CASH QUI ATTEND</span>
          <h3>Vendre plus peut vider la caisse.</h3>
        </div>
        <span className="scene-fiction">
          30 000 € de ventes par mois · fictif
        </span>
      </div>
      <div className="scene-micro-choices">
        <Choices
          label="Paiement des clients"
          value={clientDays}
          onChange={setClientDays}
          options={[0, 30, 45, 60, 90].map((days) => ({
            value: days,
            label: days ? `${days} j` : "Comptant",
          }))}
        />
      </div>
      <div className="scene-number-line">
        <div>
          <strong className="scene-number" aria-live="polite">
            {euros.format(result.need)}
          </strong>
          <span>
            {result.need > 0
              ? "à financer en permanence"
              : "d’avance : les fournisseurs financent l’activité"}
          </span>
        </div>
        <p>
          Créances clients : <strong>{euros.format(result.clients)}</strong>.
          Stock : <strong>{euros.format(result.stock)}</strong>. Crédit
          fournisseurs : <strong>−{euros.format(result.suppliers)}</strong>.
        </p>
      </div>
      <CompareBars
        rows={[
          {
            label: "Argent bloqué (clients + stock)",
            amount: result.clients + result.stock,
            display: euros.format(result.clients + result.stock),
            className: "is-solid",
          },
          {
            label: "Crédit des fournisseurs",
            amount: result.suppliers,
            display: `−${euros.format(result.suppliers)}`,
            className: "is-soft",
          },
        ]}
      />
      <Range
        label="Délai de paiement des fournisseurs"
        shown={`${supplierDays} jours`}
        ariaLabel="Délai fournisseurs en jours"
        min={0}
        max={90}
        step={15}
        value={supplierDays}
        onChange={setSupplierDays}
      />
      <Range
        label="Durée du stock"
        shown={`${stockDays} jours`}
        ariaLabel="Durée du stock en jours"
        min={0}
        max={90}
        step={15}
        value={stockDays}
        onChange={setStockDays}
      />
      {result.need > 0 && (
        <p className="financial-reading" aria-live="polite">
          <span>
            <strong>Si les ventes augmentent de 20 % :</strong> il faudra{" "}
            {euros.format(result.needIfGrowth20 - result.need)} de trésorerie en
            plus, avant d’encaisser le premier euro supplémentaire.
          </span>
        </p>
      )}
      <p className="scene-takeaway">
        Modèle simplifié : mois de 30 jours, achats égaux à la moitié des
        ventes, hors TVA.{" "}
        <strong>
          Raccourcir les délais clients libère du cash sans vendre plus.
        </strong>
      </p>
    </section>
  );
}

/* ---------- Louer ou acheter ---------- */

export function RentOrBuyScene() {
  const [years, setYears] = useState(8);
  const [growth, setGrowth] = useState(1);
  const result = rentOrBuy({
    price: 250_000,
    monthlyRent: 900,
    downPayment: 30_000,
    loanRate: 3.5,
    loanYears: 25,
    years,
    priceGrowth: growth,
    savingsReturn: 3,
  });
  const gap = result.rentCost - result.buyCost;
  return (
    <section
      className="scene-workbench scene-micro"
      aria-label="Comparer location et achat dans le temps"
    >
      <div className="scene-heading">
        <div>
          <span className="eyebrow">LA DURÉE DÉCIDE</span>
          <h3>Acheter se rentabilise avec le temps, pas tout de suite.</h3>
        </div>
        <span className="scene-fiction">250 000 € · loyer 900 € · fictif</span>
      </div>
      <div className="scene-micro-choices">
        <Choices
          label="Prix du logement par an"
          value={growth}
          onChange={setGrowth}
          options={[
            { value: -2, label: "−2 %" },
            { value: 0, label: "0 %" },
            { value: 1, label: "+1 %" },
            { value: 3, label: "+3 %" },
          ]}
        />
      </div>
      <div className="scene-number-line">
        <div>
          <strong className="scene-number" aria-live="polite">
            {euros.format(Math.abs(gap))}
          </strong>
          <span>
            {gap >= 0
              ? `d’avantage à l’achat sur ${years} ans`
              : `d’avantage à la location sur ${years} ans`}
          </span>
        </div>
        <p>
          Coût net de l’achat : <strong>{euros.format(result.buyCost)}</strong>{" "}
          (frais, intérêts, entretien, moins la valeur gagnée). Coût net de la
          location : <strong>{euros.format(result.rentCost)}</strong> (loyers,
          moins le rendement de l’apport placé).
        </p>
      </div>
      <CompareBars
        rows={[
          {
            label: "Acheter",
            amount: result.buyCost,
            display: euros.format(result.buyCost),
            className: "is-silver",
          },
          {
            label: "Louer",
            amount: result.rentCost,
            display: euros.format(result.rentCost),
            className: "is-soft",
          },
        ]}
      />
      <Range
        label="Années dans le logement"
        shown={`${years} an${years > 1 ? "s" : ""}`}
        ariaLabel="Durée d’occupation en années"
        min={1}
        max={25}
        step={1}
        value={years}
        onChange={setYears}
      />
      <p className="financial-reading" aria-live="polite">
        <span>
          <strong>Point de bascule :</strong>{" "}
          {result.breakEvenYear
            ? `l’achat devient moins coûteux à partir de ${result.breakEvenYear} an${result.breakEvenYear > 1 ? "s" : ""} dans ce scénario.`
            : "dans ce scénario, l’achat ne rattrape pas la location en 30 ans."}{" "}
          Mensualité du crédit : {euros.format(result.monthlyPayment)} sur 25
          ans à 3,5 %.
        </span>
      </p>
      <p className="scene-takeaway">
        Hypothèses fictives : frais de notaire d’environ 7,5 % dans l’ancien,
        entretien et taxe foncière à 1,5 % du prix par an, loyer +2 % par an,
        apport de 30 000 € placé à 3 % sinon.{" "}
        <strong>
          Le prix futur du logement est l’hypothèse la plus incertaine.
        </strong>
      </p>
    </section>
  );
}

/* ---------- Rééquilibrage ---------- */

export function RebalanceScene() {
  const [target, setTarget] = useState(60);
  const [move, setMove] = useState(0.3);
  const result = rebalance(10_000, target / 100, move, 0.02);
  return (
    <section
      className="scene-workbench scene-micro"
      aria-label="Rééquilibrer une allocation après un mouvement de marché"
    >
      <div className="scene-heading">
        <div>
          <span className="eyebrow">REVENIR À LA CIBLE</span>
          <h3>Vendre ce qui a monté, racheter ce qui a baissé.</h3>
        </div>
        <span className="scene-fiction">10 000 € · un an · fictif</span>
      </div>
      <div className="scene-micro-choices">
        <Choices
          label="Actions sur l’année"
          value={move}
          onChange={setMove}
          options={[
            { value: -0.3, label: "−30 %" },
            { value: -0.1, label: "−10 %" },
            { value: 0.1, label: "+10 %" },
            { value: 0.3, label: "+30 %" },
          ]}
        />
      </div>
      <div className="scene-number-line">
        <div>
          <strong className="scene-number" aria-live="polite">
            {percent(result.sharesWeight)}
          </strong>
          <span>
            d’actions après le mouvement, pour une cible de {target} %
          </span>
        </div>
        <p>
          Portefeuille : <strong>{euros.format(result.total)}</strong>, dont{" "}
          {euros.format(result.shares)} en actions et{" "}
          {euros.format(result.bonds)} en obligations (+2 % sur l’année).
        </p>
      </div>
      <StackedBar
        total={result.total || 1}
        parts={[
          {
            label: "Actions",
            amount: result.shares,
            className: "scene-bar-silver",
          },
          {
            label: "Obligations",
            amount: result.bonds,
            className: "scene-bar-soft",
          },
        ]}
      />
      <Range
        label="Part d’actions visée"
        shown={`${target} %`}
        ariaLabel="Part d’actions visée en pourcentage"
        min={20}
        max={90}
        step={10}
        value={target}
        onChange={setTarget}
      />
      <p className="financial-reading" aria-live="polite">
        <span>
          <strong>Pour revenir à la cible :</strong>{" "}
          {result.tradeShares === 0
            ? "aucun mouvement nécessaire."
            : result.tradeShares < 0
              ? `vendre ${euros.format(-result.tradeShares)} d’actions et acheter autant d’obligations.`
              : `acheter ${euros.format(result.tradeShares)} d’actions en vendant autant d’obligations.`}
        </span>
      </p>
      <p className="scene-takeaway">
        Exemple pédagogique, aucun conseil en investissement. Frais et fiscalité
        des arbitrages non comptés : dans un PEA ou une assurance-vie, arbitrer
        ne déclenche pas d’impôt immédiat.{" "}
        <strong>
          La règle décide à votre place quand l’émotion pousse à l’inverse.
        </strong>
      </p>
    </section>
  );
}

/* ---------- Choisir un statut ---------- */

const criteria: { key: keyof StatusNeeds; label: string }[] = [
  { key: "partners", label: "Je m’associe dès le départ" },
  { key: "investors", label: "Je prévois de lever des fonds" },
  {
    key: "employeeProtection",
    label: "Je veux une protection proche du salarié",
  },
  {
    key: "highRevenue",
    label: "Mon chiffre d’affaires dépassera les plafonds micro",
  },
  { key: "highExpenses", label: "Mes charges réelles seront élevées" },
];

export function StatusScene() {
  const [needs, setNeeds] = useState<StatusNeeds>({
    partners: false,
    highRevenue: false,
    highExpenses: false,
    employeeProtection: false,
    investors: false,
  });
  const result = suggestStatus(needs);
  return (
    <section
      className="scene-workbench scene-micro scene-status"
      aria-label="Voir quels critères orientent le choix d’un statut"
    >
      <div className="scene-heading">
        <div>
          <span className="eyebrow">CE QUI ORIENTE LE CHOIX</span>
          <h3>Votre situation, pas une mode, choisit le statut.</h3>
        </div>
        <span className="scene-fiction">Repère pédagogique</span>
      </div>
      <div
        className="scene-status-criteria"
        role="group"
        aria-label="Votre situation"
      >
        {criteria.map((criterion) => (
          <button
            key={criterion.key}
            type="button"
            aria-pressed={needs[criterion.key]}
            onClick={() =>
              setNeeds((current) => ({
                ...current,
                [criterion.key]: !current[criterion.key],
              }))
            }
          >
            <span aria-hidden="true">{needs[criterion.key] ? "✓" : ""}</span>
            {criterion.label}
          </button>
        ))}
      </div>
      <div className="scene-number-line">
        <div>
          <strong className="scene-status-result" aria-live="polite">
            {result.label}
          </strong>
          <span>la forme vers laquelle ces critères orientent</span>
        </div>
        <ul className="scene-status-reasons">
          {result.reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </div>
      <p className="scene-takeaway">
        Règles simplifiées pour comprendre, aucun conseil juridique ou fiscal :
        avant de créer, comparez avec un expert-comptable ou sur
        entreprendre.service-public.gouv.fr.{" "}
        <strong>
          On peut changer de statut plus tard, mais cela a un coût.
        </strong>
      </p>
    </section>
  );
}
