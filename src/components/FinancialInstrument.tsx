import { useState } from "react";
import { calculateEconomics } from "../lib/domain";
import { Icon } from "./Icon";
const euros = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});
const number = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 });
const compactNumber = new Intl.NumberFormat("fr-FR", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const axisNumber = (value: number) =>
  value > 1e12 ? value.toExponential(1) : compactNumber.format(value);
type Values = {
  price: string;
  unitCost: string;
  units: string;
  fixedCosts: string;
};
const controls = [
  {
    key: "price",
    label: "Prix de vente unitaire HT",
    short: "Prix de vente",
    unit: "€",
    max: 200,
    step: "0.5",
  },
  {
    key: "unitCost",
    label: "Coût variable unitaire HT",
    short: "Coût variable",
    unit: "€",
    max: 200,
    step: "0.5",
  },
  {
    key: "units",
    label: "Quantité vendue par mois",
    short: "Volume mensuel",
    unit: "unités",
    max: 1000,
    step: "1",
  },
  {
    key: "fixedCosts",
    label: "Charges fixes mensuelles",
    short: "Charges fixes",
    unit: "€",
    max: 20000,
    step: "50",
  },
] as const;
function EquilibriumPlot({
  values,
  result,
}: {
  values: Values;
  result: ReturnType<typeof calculateEconomics>;
}) {
  const price = Number(values.price),
    cost = Number(values.unitCost),
    units = Number(values.units),
    fixed = Number(values.fixedCosts);
  const maxUnits = Math.max(units, result.breakEvenUnits ?? 0, 1);
  const ceiling = Math.max(price * maxUnits, cost * maxUnits + fixed, 1);
  if (!Number.isFinite(ceiling))
    return (
      <p className="financial-scale-note">
        Ces montants dépassent l’échelle du graphique. Consultez les résultats
        numériques.
      </p>
    );
  const x = (v: number) => 56 + (v / maxUnits) * 640;
  const y = (v: number) => 278 - (v / ceiling) * 236;
  const revY = y(price * maxUnits),
    costY = y(cost * maxUnits + fixed);
  return (
    <svg
      className="equilibrium-plot"
      viewBox="0 0 760 330"
      role="img"
      aria-label={
        result.breakEvenUnits === null
          ? "La droite des ventes reste sous celle des coûts : aucun seuil fini."
          : `Ventes et coûts : seuil arrondi à ${result.breakEvenUnits} unités. Volume actuel : ${units}.`
      }
    >
      <defs>
        <linearGradient id="finance-area" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="var(--accent)" stopOpacity=".15" />
          <stop offset="1" stopColor="var(--accent)" stopOpacity=".01" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <g key={t}>
          <path d={`M56 ${278 - t * 236}H696`} className="plot-grid" />
          <text x="44" y={282 - t * 236} textAnchor="end">
            {axisNumber(ceiling * t)}
          </text>
        </g>
      ))}
      <path
        d={`M56 ${y(fixed)}L696 ${costY}L696 ${revY}L56 278Z`}
        fill="url(#finance-area)"
        className="plot-area"
      />
      <path d={`M56 ${y(fixed)}L696 ${costY}`} className="plot-cost" />
      <path d={`M56 278L696 ${revY}`} className="plot-revenue" />
      {result.breakEvenUnits !== null && (
        <g className="plot-threshold">
          <path d={`M${x(result.breakEvenUnits)} 30V278`} />
          <text
            x={Math.min(x(result.breakEvenUnits) + 8, 690)}
            y="24"
            textAnchor={
              result.breakEvenUnits / maxUnits > 0.8 ? "end" : "start"
            }
          >
            SEUIL · {number.format(result.breakEvenUnits)}
          </text>
          <circle
            cx={x(result.breakEvenUnits)}
            cy={y(price * result.breakEvenUnits)}
            r="5"
          />
        </g>
      )}
      <g className="plot-current">
        <path
          d={`M${x(units)} ${y(price * units)}V${y(cost * units + fixed)}`}
        />
        <circle cx={x(units)} cy={y(price * units)} r="6" />
        <circle cx={x(units)} cy={y(cost * units + fixed)} r="4" />
      </g>
      <text x="56" y="309">
        0 unité
      </text>
      <text x="696" y="309" textAnchor="end">
        {number.format(maxUnits)} unités
      </text>
      <text x="56" y="24">
        Montants HT · €
      </text>
    </svg>
  );
}
export function Lab({ onNavigate }: { onNavigate: (route: string) => void }) {
  const [values, setValues] = useState<Values>({
    price: "45",
    unitCost: "18",
    units: "120",
    fixedCosts: "2400",
  });
  const [savedScenario, setSavedScenario] = useState<ReturnType<
    typeof calculateEconomics
  > | null>(null);
  let result: ReturnType<typeof calculateEconomics> | null = null;
  let error = "";
  try {
    if (Object.values(values).some((value) => value.trim() === ""))
      throw new Error(
        "Complétez les quatre hypothèses pour calculer le scénario.",
      );
    result = calculateEconomics({
      price: Number(values.price),
      unitCost: Number(values.unitCost),
      units: Number(values.units),
      fixedCosts: Number(values.fixedCosts),
    });
  } catch (cause) {
    error =
      cause instanceof Error
        ? cause.message
        : "Vérifiez vos hypothèses : utilisez des nombres positifs, avec un prix supérieur à zéro.";
  }
  function control(index: number) {
    const item = controls[index]!;
    return (
      <div className="financial-control" key={item.key}>
        <label htmlFor={`economics-${item.key}`}>{item.label}</label>
        <div className="financial-input-value">
          <input
            id={`economics-${item.key}`}
            type="number"
            min={item.key === "price" ? "0.01" : "0"}
            step="any"
            value={values[item.key]}
            onChange={(e) =>
              setValues((previous) => ({
                ...previous,
                [item.key]: e.target.value,
              }))
            }
          />
          <span>{item.unit}</span>
        </div>
        <input
          type="range"
          aria-label={`Ajuster : ${item.label}`}
          min={item.key === "price" ? "0.5" : "0"}
          max={Math.max(item.max, Number(values[item.key]) || 0)}
          step={item.step}
          value={Number(values[item.key]) || 0}
          onChange={(e) =>
            setValues((previous) => ({
              ...previous,
              [item.key]: e.target.value,
            }))
          }
        />
      </div>
    );
  }
  return (
    <div className="financial-instrument art-page">
      <header className="art-heading">
        <div>
          <span className="instrument-index">
            Lab financier <i /> Instrument 01
          </span>
          <h1>L’économie d’une vente.</h1>
        </div>
        <div className="financial-heading-side">
          <p>
            Prix, coût variable, volume et charges : voyez où naît l’équilibre.
          </p>
          <button
            className="text-button"
            onClick={() => onNavigate("simulation")}
          >
            Explorer six mois avec « Et si ? » <Icon name="arrow" size={16} />
          </button>
        </div>
      </header>
      <section className="unit-economy" aria-label="Économie d’une vente">
        <div className="instrument-caption">
          <span>01 / Décomposer une vente</span>
          <span>Modèle fictif · HT</span>
        </div>
        <div className="unit-equation">
          {control(0)}
          <span className="math-operator" aria-hidden="true">
            −
          </span>
          {control(1)}
          <span className="math-operator" aria-hidden="true">
            =
          </span>
          <div className="unit-contribution">
            <span>Contribution par vente</span>
            <strong
              key={
                result ? Number(values.price) - Number(values.unitCost) : "none"
              }
            >
              {result
                ? euros.format(Number(values.price) - Number(values.unitCost))
                : "—"}
            </strong>
            <small>Pour financer les charges, puis le résultat.</small>
          </div>
        </div>
      </section>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <div className="financial-observatory">
        <section className="financial-chart">
          <div className="instrument-caption">
            <span>02 / Trouver le point de bascule</span>
            <span>Ventes / coûts</span>
          </div>
          {result ? (
            <>
              <EquilibriumPlot values={values} result={result} />
              <div className="financial-legend">
                <span>
                  <i />
                  Chiffre d’affaires
                </span>
                <span>
                  <i />
                  Coûts totaux
                </span>
                <span>Les points suivent votre volume.</span>
              </div>
              <h2>
                {result.breakEvenUnits === null
                  ? "Ce modèle ne couvre pas ses charges."
                  : `${number.format(result.breakEvenUnits)} unités pour atteindre l’équilibre`}
              </h2>
              <p>
                {result.breakEvenUnits === null
                  ? "Le prix ne dépasse pas le coût variable unitaire. Vendre davantage ne finance pas les charges fixes."
                  : `À ${number.format(Number(values.units))} ventes, le résultat simplifié est de ${euros.format(result.profit)}. Le seuil est arrondi à l’unité supérieure.`}
              </p>
            </>
          ) : (
            <div className="financial-awaiting">
              <Icon name="chart" size={40} />
              <p>Le tracé apparaît avec quatre hypothèses valides.</p>
            </div>
          )}
        </section>
        <aside className="financial-levers">
          <div className="instrument-caption">
            <span>Vos leviers</span>
            <Icon name="lab" size={15} />
          </div>
          {control(2)}
          {control(3)}
          <p>
            Déplacez un curseur.
            <br />
            L’équation et le seuil suivent.
          </p>
        </aside>
      </div>
      {result && (
        <section
          className="monthly-economy"
          aria-label="Résultats du scénario"
          aria-live="polite"
        >
          <div className="instrument-caption">
            <span>03 / Lire un mois d’activité</span>
            <span>CA mensuel · {euros.format(result.revenue)}</span>
          </div>
          <div className="monthly-equation">
            <div>
              <strong>
                {euros.format(Number(values.price) - Number(values.unitCost))}
              </strong>
              <small>Contribution unitaire</small>
            </div>
            <span>×</span>
            <div>
              <strong>{number.format(Number(values.units))}</strong>
              <small>Ventes</small>
            </div>
            <span>−</span>
            <div>
              <strong>{euros.format(Number(values.fixedCosts))}</strong>
              <small>Charges fixes</small>
            </div>
            <span>=</span>
            <div className="financial-profit">
              <strong key={result.profit}>{euros.format(result.profit)}</strong>
              <small>Résultat simplifié mensuel</small>
            </div>
          </div>
          <div className="financial-reference">
            <span>
              Marge sur coûts variables : {euros.format(result.contribution)} ·{" "}
              {number.format(result.contributionRate * 100)} % du chiffre
              d’affaires
            </span>
            <button
              className="text-button"
              onClick={() => setSavedScenario(result)}
            >
              Garder comme référence <Icon name="plus" size={15} />
            </button>
          </div>
          {savedScenario && (
            <p className="financial-saved" role="status">
              Référence de cette session : résultat{" "}
              {euros.format(savedScenario.profit)}. Écart actuel :{" "}
              {euros.format(result.profit - savedScenario.profit)}.
            </p>
          )}
        </section>
      )}
      <footer className="instrument-principle">
        <span>Les limites du modèle</span>
        <p>Un résultat n’est pas de la trésorerie.</p>
        <small>
          Exemple fictif hors TVA, à prix et coûts constants ; toute la
          production est vendue. Stocks, délais de paiement, financement,
          impôts, capacité et variation de la demande ne sont pas modélisés.
        </small>
      </footer>
    </div>
  );
}
