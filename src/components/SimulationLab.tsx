import { useId, useRef, useState, type FormEvent } from "react";
import type { AppState, StateUpdater } from "../lib/types";
import {
  calculateSimulation,
  createSimulationSnapshot,
  defaultSimulationInput,
  SIMULATION_VERSION,
  simulationMarkdown,
  type SimulationBase,
  type SimulationChange,
  type SimulationInput,
  type SimulationSnapshot,
} from "../lib/simulation";
import { downloadFile } from "../lib/storage";
import { Icon } from "./Icon";
import "../simulation-lab.css";

type Props = {
  state: AppState;
  update: StateUpdater;
  onNavigate: (route: string) => void;
};
type Draft<T> = { [Key in keyof T]: string };
type Comparison = ReturnType<typeof calculateSimulation>;
type Preset = "delay" | "customer" | "costs" | "hire" | "price";
const presets: { id: Preset; title: string; change: string }[] = [
  { id: "delay", title: "Paiements retardés", change: "Encaisser plus tard" },
  { id: "customer", title: "Perte d’un client", change: "−40 % de volume" },
  {
    id: "costs",
    title: "Coûts fournisseurs",
    change: "+25 % de coût variable",
  },
  { id: "hire", title: "Recrutement", change: "+2 500 € de charges fixes" },
  { id: "price", title: "Prix +15 %", change: "Volume maintenu par hypothèse" },
];
const money = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});
const preciseMoney = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2,
});
const compactMoney = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  notation: "compact",
  maximumFractionDigits: 1,
});
const date = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Paris",
});

function draft<T extends object>(input: T): Draft<T> {
  return Object.fromEntries(
    Object.entries(input).map(([key, value]) => [key, String(value)]),
  ) as Draft<T>;
}
function numbers<T extends object>(input: Draft<T>): T {
  if (Object.values(input).some((value) => String(value).trim() === ""))
    throw new Error("Complétez chaque hypothèse pour afficher la comparaison.");
  return Object.fromEntries(
    Object.entries(input).map(([key, value]) => [key, Number(value)]),
  ) as T;
}
function scenario(preset: Preset, delay: number): SimulationChange {
  const next: SimulationChange = {
    priceChangePct: 0,
    volumeChangePct: 0,
    unitCostChangePct: 0,
    additionalFixedCosts: 0,
    collectionDelayMonths: delay,
  };
  if (preset === "delay") next.collectionDelayMonths = 3;
  if (preset === "customer") next.volumeChangePct = -40;
  if (preset === "costs") next.unitCostChangePct = 25;
  if (preset === "hire") next.additionalFixedCosts = 2500;
  if (preset === "price") next.priceChangePct = 15;
  return next;
}

function CashChart({
  comparison,
  selectedMonth,
  onSelect,
}: {
  comparison: Comparison;
  selectedMonth: number;
  onSelect: (month: number) => void;
}) {
  const gradient = useId().replace(/:/g, "");
  const reference = comparison.baseline.months.map((m) => m.closingCash);
  const current = comparison.scenario.months.map((m) => m.closingCash);
  const low = Math.min(0, ...reference, ...current);
  const high = Math.max(1, ...reference, ...current);
  const padding = (high - low) * 0.12;
  const minimum = low - padding;
  const maximum = high + padding;
  const x = (index: number) => ((index + 0.5) / 6) * 100;
  const y = (value: number) =>
    100 - ((value - minimum) / (maximum - minimum)) * 100;
  const path = (values: number[]) =>
    values
      .map((value, index) => `${index ? "L" : "M"} ${x(index)} ${y(value)}`)
      .join(" ");
  const scenarioPath = path(current);
  const selected = comparison.scenario.months[selectedMonth - 1]!;
  const ticks = [high, 0, ...(low < 0 ? [low] : [])];
  return (
    <figure
      className="simulation-chart"
      aria-label="Trésorerie comparée sur six mois"
    >
      <div className="simulation-chart-heading">
        <div>
          <p className="eyebrow">Ce qui reste réellement disponible</p>
          <h2>La trajectoire de votre trésorerie.</h2>
        </div>
        <div className="simulation-legend">
          <span>
            <i className="reference" /> Référence
          </span>
          <span>
            <i /> Votre scénario
          </span>
        </div>
      </div>
      <div className="simulation-chart-canvas" aria-hidden="true">
        {ticks.map((value) => (
          <div
            key={value}
            className={`simulation-gridline${value === 0 ? " zero" : ""}`}
            style={{ top: `${y(value)}%` }}
          >
            <span>{compactMoney.format(value)}</span>
          </div>
        ))}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.11" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={`${scenarioPath} L ${x(5)} 100 L ${x(0)} 100 Z`}
            fill={`url(#${gradient})`}
          />
          <path className="simulation-reference-path" d={path(reference)} />
          <path className="simulation-scenario-path" d={scenarioPath} />
          <path
            className="simulation-selected-line"
            d={`M ${x(selectedMonth - 1)} 0 V 100`}
          />
        </svg>
        <span
          className="simulation-chart-point"
          style={{
            left: `${x(selectedMonth - 1)}%`,
            top: `${y(selected.closingCash)}%`,
          }}
        />
      </div>
      <div className="simulation-months" aria-label="Explorer les mois">
        {comparison.scenario.months.map((month) => (
          <button
            key={month.month}
            aria-pressed={selectedMonth === month.month}
            aria-label={`Mois ${month.month}`}
            onClick={() => onSelect(month.month)}
          >
            <span>Mois {month.month}</span>
            <small>{compactMoney.format(month.closingCash)}</small>
          </button>
        ))}
      </div>
      <figcaption>
        Trésorerie en fin de mois · Sélectionnez un mois pour suivre les
        encaissements et les dépenses.
      </figcaption>
    </figure>
  );
}

const baselineFields: {
  key: Exclude<keyof SimulationBase, "collectionDelayMonths">;
  label: string;
  min: number;
  max: number;
}[] = [
  {
    key: "price",
    label: "Prix de vente unitaire HT",
    min: 0.01,
    max: 1_000_000,
  },
  {
    key: "unitCost",
    label: "Coût variable unitaire HT",
    min: 0,
    max: 1_000_000,
  },
  { key: "units", label: "Volume mensuel moyen", min: 0, max: 1_000_000 },
  {
    key: "fixedCosts",
    label: "Charges fixes de référence",
    min: 0,
    max: 1_000_000_000,
  },
  {
    key: "openingCash",
    label: "Trésorerie de départ",
    min: 0,
    max: 1_000_000_000_000,
  },
];
const changeFields: {
  key: Exclude<keyof SimulationChange, "collectionDelayMonths">;
  label: string;
  min: number;
  max: number;
  step: number;
  suffix: string;
}[] = [
  {
    key: "priceChangePct",
    label: "Variation du prix (%)",
    min: -90,
    max: 200,
    step: 1,
    suffix: "%",
  },
  {
    key: "volumeChangePct",
    label: "Variation du volume (%)",
    min: -100,
    max: 200,
    step: 1,
    suffix: "%",
  },
  {
    key: "unitCostChangePct",
    label: "Variation du coût variable (%)",
    min: -100,
    max: 200,
    step: 1,
    suffix: "%",
  },
  {
    key: "additionalFixedCosts",
    label: "Charges fixes supplémentaires",
    min: 0,
    max: 1_000_000_000,
    step: 100,
    suffix: "€/mois",
  },
];

export function SimulationLab({ state, update, onNavigate }: Props) {
  const [baseline, setBaseline] = useState(() =>
    draft(defaultSimulationInput.baseline),
  );
  const [change, setChange] = useState(() =>
    draft(defaultSimulationInput.change),
  );
  const [activePreset, setActivePreset] = useState<Preset | "custom">("delay");
  const [selectedMonth, setSelectedMonth] = useState(3);
  const [title, setTitle] = useState("Paiements retardés");
  const [saveOpen, setSaveOpen] = useState(false);
  const [notice, setNotice] = useState<{ text: string; error: boolean } | null>(
    null,
  );
  const titleRef = useRef<HTMLInputElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const saving = useRef(false);
  let input: SimulationInput | null = null;
  let comparison: Comparison | null = null;
  let error = "";
  try {
    input = {
      baseline: numbers<SimulationBase>(baseline),
      change: numbers<SimulationChange>(change),
    };
    comparison = calculateSimulation(input);
  } catch (cause) {
    error =
      cause instanceof Error
        ? cause.message
        : "Vérifiez les hypothèses de la comparaison.";
  }
  const saved = [...(state.simulations ?? [])].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  const month = comparison?.scenario.months[selectedMonth - 1];
  function choosePreset(preset: Preset) {
    const delay = Number(baseline.collectionDelayMonths);
    setChange(
      draft(
        scenario(
          preset,
          Number.isInteger(delay) && delay >= 0 && delay <= 3 ? delay : 1,
        ),
      ),
    );
    setActivePreset(preset);
    setTitle(presets.find((entry) => entry.id === preset)!.title);
    setNotice(null);
  }
  function changeValue(key: keyof SimulationChange, value: string) {
    setChange((previous) => ({ ...previous, [key]: value }));
    setActivePreset("custom");
    setTitle("Scénario personnalisé");
    setNotice(null);
  }
  function openSave() {
    saving.current = false;
    setSaveOpen(true);
    setNotice(null);
    requestAnimationFrame(() => titleRef.current?.focus());
  }
  function save(event: FormEvent) {
    event.preventDefault();
    if (!input || !comparison || saving.current) return;
    try {
      const snapshot = createSimulationSnapshot(
        input,
        title,
        crypto.randomUUID(),
        new Date(),
      );
      saving.current = true;
      update((previous) =>
        previous.simulations?.some((entry) => entry.id === snapshot.id)
          ? previous
          : {
              ...previous,
              simulations: [...(previous.simulations ?? []), snapshot],
            },
      );
      setSaveOpen(false);
      setNotice({
        text: "Comparaison conservée avec ses hypothèses de départ. Elle reste dans ce navigateur et votre sauvegarde JSON.",
        error: false,
      });
    } catch (cause) {
      setNotice({
        text:
          cause instanceof Error
            ? cause.message
            : "La comparaison n’a pas pu être conservée.",
        error: true,
      });
    }
  }
  function load(snapshot: SimulationSnapshot) {
    const copy = structuredClone(snapshot.input);
    setBaseline(draft(copy.baseline));
    setChange(draft(copy.change));
    setActivePreset("custom");
    setTitle(snapshot.title);
    setSaveOpen(false);
    setSelectedMonth(3);
    setNotice({
      text: "Copie chargée. Vos ajustements ne modifieront pas la comparaison conservée.",
      error: false,
    });
    requestAnimationFrame(() => {
      headingRef.current?.focus({ preventScroll: true });
      headingRef.current?.scrollIntoView({
        block: "start",
        behavior: "instant",
      });
    });
  }
  function exportComparison() {
    if (!input || !comparison) return;
    try {
      downloadFile(
        "bouse-comparaison-financiere.md",
        simulationMarkdown(input, title),
        "text/markdown;charset=utf-8",
      );
    } catch (cause) {
      setNotice({
        text:
          cause instanceof Error
            ? cause.message
            : "La comparaison n’a pas pu être exportée.",
        error: true,
      });
    }
  }

  return (
    <div className="simulation-lab">
      <div className="simulation-topline">
        <button className="text-button" onClick={() => onNavigate("lab")}>
          <Icon name="back" size={16} /> Revenir au Lab
        </button>
        <span>
          MODÈLE {SIMULATION_VERSION} <i /> 6 MOIS
        </span>
      </div>
      <header className="simulation-heading">
        <p className="eyebrow">Lab / L’expérience « Et si ? »</p>
        <h1 ref={headingRef} tabIndex={-1}>
          Rentable. Mais à court de cash ?
        </h1>
        <p>
          Changez une hypothèse. Comparez le résultat et l’argent réellement
          disponible.
        </p>
      </header>

      <div className="simulation-cases" aria-label="Choisir une expérience">
        {presets.map((preset, index) => (
          <button
            key={preset.id}
            aria-pressed={activePreset === preset.id}
            onClick={() => choosePreset(preset.id)}
          >
            <small aria-hidden="true">0{index + 1}</small>
            <span>{preset.title}</span>
            <Icon name="external" size={14} />
          </button>
        ))}
      </div>

      <div className="simulation-studio">
        <div className="simulation-stage">
          {comparison && input ? (
            <>
              <CashChart
                comparison={comparison}
                selectedMonth={selectedMonth}
                onSelect={setSelectedMonth}
              />
              <section
                className="simulation-month-detail"
                aria-label={`Flux du mois ${selectedMonth}`}
              >
                <p className="eyebrow">Mois {selectedMonth} / Votre scénario</p>
                <dl>
                  <div>
                    <dt>Facturé</dt>
                    <dd>{money.format(month!.revenue)}</dd>
                  </div>
                  <div>
                    <dt>Encaissé</dt>
                    <dd>{money.format(month!.collections)}</dd>
                  </div>
                  <div>
                    <dt>Décaissé</dt>
                    <dd>
                      {money.format(month!.variableCosts + month!.fixedCosts)}
                    </dd>
                  </div>
                  <div>
                    <dt>Trésorerie finale</dt>
                    <dd>{money.format(month!.closingCash)}</dd>
                  </div>
                </dl>
              </section>
            </>
          ) : (
            <div className="simulation-invalid" role="alert">
              <Icon name="lab" size={28} />
              <h2>Une hypothèse à préciser.</h2>
              <p>{error}</p>
              <span>La courbe reprend dès que les données sont valides.</span>
            </div>
          )}
        </div>

        <section
          className="simulation-console"
          aria-labelledby="simulation-controls-title"
        >
          <div className="simulation-console-heading">
            <p className="eyebrow">Le point de bascule</p>
            <h2 id="simulation-controls-title">Votre scénario.</h2>
            <p>
              Les changements s’appliquent dès le mois 1, pendant les six mois.
            </p>
          </div>
          <label className="simulation-delay">
            <span>Délai de paiement du scénario</span>
            <select
              aria-label="Délai de paiement du scénario"
              value={change.collectionDelayMonths}
              onChange={(event) =>
                changeValue("collectionDelayMonths", event.target.value)
              }
            >
              {[0, 1, 2, 3].map((value) => (
                <option key={value} value={value}>
                  {value === 0
                    ? "Le mois de la vente"
                    : `${value} mois après la vente`}
                </option>
              ))}
            </select>
          </label>
          {changeFields.map((field) => (
            <div className="simulation-control" key={field.key}>
              <label htmlFor={`simulation-${field.key}`}>{field.label}</label>
              <div className="simulation-number">
                <input
                  id={`simulation-${field.key}`}
                  type="number"
                  min={field.min}
                  max={field.max}
                  step="any"
                  value={change[field.key]}
                  onChange={(event) =>
                    changeValue(field.key, event.target.value)
                  }
                />
                <span aria-hidden="true">{field.suffix}</span>
              </div>
              <input
                type="range"
                aria-label={`Ajuster : ${field.label}`}
                min={field.min}
                max={
                  field.key === "additionalFixedCosts"
                    ? Math.max(5000, Number(change[field.key]) || 0)
                    : field.max
                }
                step={field.step}
                value={Number(change[field.key]) || 0}
                onChange={(event) => changeValue(field.key, event.target.value)}
              />
            </div>
          ))}
          <p className="simulation-control-note">
            Le volume est une hypothèse indépendante : aucun effet automatique
            du prix sur la demande n’est inventé.
          </p>
        </section>
      </div>

      {comparison && input && (
        <section
          className="simulation-impact"
          aria-label="Comparaison à six mois"
        >
          <div className="simulation-impact-heading">
            <p className="eyebrow">Lire le compromis</p>
            <h2>Un bénéfice n’est pas un encaissement.</h2>
            <p>
              Référence <span className="simulation-reference-dash" />{" "}
              <span>Votre scénario</span>
            </p>
          </div>
          <dl>
            <div>
              <dt>Résultat cumulé</dt>
              <dd>
                <span aria-label="Résultat cumulé de la référence">
                  {money.format(comparison.baseline.totalProfit)}
                </span>
                <strong aria-label="Résultat cumulé du scénario">
                  {money.format(comparison.scenario.totalProfit)}
                </strong>
              </dd>
              <small>Ventes − charges sur six mois</small>
            </div>
            <div>
              <dt>Trésorerie finale</dt>
              <dd>
                <span aria-label="Trésorerie finale de la référence">
                  {money.format(comparison.baseline.closingCash)}
                </span>
                <strong aria-label="Trésorerie finale du scénario">
                  {money.format(comparison.scenario.closingCash)}
                </strong>
              </dd>
              <small>Argent disponible à la fin du mois 6</small>
            </div>
            <div>
              <dt>Ventes encore à encaisser</dt>
              <dd>
                <span>
                  {money.format(comparison.baseline.endingReceivables)}
                </span>
                <strong>
                  {money.format(comparison.scenario.endingReceivables)}
                </strong>
              </dd>
              <small>Créances clients à la fin du mois 6</small>
            </div>
          </dl>
          <div className="simulation-funding">
            <span className="simulation-funding-mark" aria-hidden="true">
              <Icon name="chart" size={22} />
            </span>
            <div>
              <p className="eyebrow">
                Besoin théorique de financement du scénario
              </p>
              <h3>
                {money.format(comparison.scenario.financingNeed)}{" "}
                <small>au point le plus bas</small>
              </h3>
              <p>
                {comparison.scenario.firstNegativeMonth
                  ? `La trésorerie devient négative à la fin du mois ${comparison.scenario.firstNegativeMonth}. La projection continue pour rendre le besoin visible, sans financement automatique.`
                  : "La trésorerie reste positive ou nulle à chaque fin de mois dans ces hypothèses."}
              </p>
              <p className="simulation-funding-baseline">
                Besoin de la référence :{" "}
                {money.format(comparison.baseline.financingNeed)}. Le calcul ne
                voit pas les variations à l’intérieur du mois.
              </p>
            </div>
          </div>
          <div className="simulation-identity">
            <span>Le lien entre les deux</span>
            <p>
              Trésorerie de départ{" "}
              <strong>{money.format(input.baseline.openingCash)}</strong> +
              résultat{" "}
              <strong>{money.format(comparison.scenario.totalProfit)}</strong> −
              créances{" "}
              <strong>
                {money.format(comparison.scenario.endingReceivables)}
              </strong>{" "}
              = trésorerie finale{" "}
              <strong>{money.format(comparison.scenario.closingCash)}</strong>.
            </p>
          </div>
        </section>
      )}

      <details className="simulation-reference">
        <summary>
          <span>Hypothèses de référence</span>
          <small>Cas fictif · activité nouvelle</small>
          <Icon name="plus" size={17} />
        </summary>
        <p>
          Le cas démarre au mois 1, sans activité ni créances antérieures. Les
          ventes et les coûts sont constants. Modifier cette base recalcule
          aussi le scénario.
        </p>
        <div className="simulation-base-fields">
          {baselineFields.map((field) => (
            <label className="field" key={field.key}>
              <span>{field.label}</span>
              <input
                aria-label={field.label}
                type="number"
                min={field.min}
                max={field.max}
                step="any"
                value={baseline[field.key]}
                onChange={(event) => {
                  setBaseline((previous) => ({
                    ...previous,
                    [field.key]: event.target.value,
                  }));
                  setActivePreset("custom");
                  setNotice(null);
                }}
              />
            </label>
          ))}
          <label className="field">
            <span>Délai de paiement de référence</span>
            <select
              aria-label="Délai de paiement de référence"
              value={baseline.collectionDelayMonths}
              onChange={(event) => {
                setBaseline((previous) => ({
                  ...previous,
                  collectionDelayMonths: event.target.value,
                }));
                setActivePreset("custom");
                setNotice(null);
              }}
            >
              {[0, 1, 2, 3].map((value) => (
                <option key={value} value={value}>
                  {value === 0
                    ? "Le mois de la vente"
                    : `${value} mois après la vente`}
                </option>
              ))}
            </select>
          </label>
        </div>
      </details>

      {comparison && (
        <details className="simulation-table-detail">
          <summary>
            <span>Tous les flux, mois par mois</span>
            <small>Les chiffres derrière la courbe</small>
            <Icon name="plus" size={17} />
          </summary>
          <div
            className="simulation-table-scroll"
            tabIndex={0}
            role="region"
            aria-label="Tableau comparatif défilable"
          >
            <table>
              <caption>Scénario et référence · montants HT en euros</caption>
              <thead>
                <tr>
                  <th scope="col">Mois</th>
                  <th scope="col">Facturé</th>
                  <th scope="col">Encaissé</th>
                  <th scope="col">Décaissé</th>
                  <th scope="col">Résultat</th>
                  <th scope="col">Trésorerie scénario</th>
                  <th scope="col">Trésorerie référence</th>
                </tr>
              </thead>
              <tbody>
                {comparison.scenario.months.map((entry, index) => (
                  <tr key={entry.month}>
                    <th scope="row">M{entry.month}</th>
                    <td>{preciseMoney.format(entry.revenue)}</td>
                    <td>{preciseMoney.format(entry.collections)}</td>
                    <td>
                      {preciseMoney.format(
                        entry.variableCosts + entry.fixedCosts,
                      )}
                    </td>
                    <td>{preciseMoney.format(entry.profit)}</td>
                    <td>{preciseMoney.format(entry.closingCash)}</td>
                    <td>
                      {preciseMoney.format(
                        comparison.baseline.months[index]!.closingCash,
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}

      <section
        className="simulation-keep"
        aria-labelledby="simulation-keep-title"
      >
        <div>
          <p className="eyebrow">Garder le raisonnement</p>
          <h2 id="simulation-keep-title">Une comparaison à retrouver.</h2>
          <p>
            Conservez vos hypothèses ou exportez les calculs et leurs limites en
            Markdown.
          </p>
        </div>
        <div className="simulation-keep-actions">
          <button
            className="button primary"
            disabled={!comparison}
            onClick={openSave}
          >
            Conserver la comparaison <Icon name="plus" size={16} />
          </button>
          <button
            className="button"
            disabled={!comparison}
            onClick={exportComparison}
          >
            Exporter la comparaison <Icon name="external" size={16} />
          </button>
        </div>
      </section>
      {saveOpen && (
        <form className="simulation-save-form" onSubmit={save}>
          <label className="field">
            <span>Nom de la comparaison</span>
            <input
              ref={titleRef}
              aria-label="Nom de la comparaison"
              required
              maxLength={140}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>
          <p>
            Les hypothèses sont conservées ensemble. Vous pourrez en charger une
            copie pour poursuivre l’expérience.
          </p>
          <div>
            <button
              className="button primary"
              type="submit"
              disabled={!comparison}
            >
              Enregistrer la comparaison
            </button>
            <button
              className="text-button"
              type="button"
              onClick={() => setSaveOpen(false)}
            >
              Annuler
            </button>
          </div>
        </form>
      )}
      {notice && (
        <p
          className={`simulation-notice${notice.error ? " error" : ""}`}
          role={notice.error ? "alert" : "status"}
        >
          {notice.text}
        </p>
      )}

      <section
        className="simulation-saved"
        aria-labelledby="simulation-saved-title"
      >
        <h2 id="simulation-saved-title">
          Comparaisons conservées{" "}
          <span>{saved.length.toString().padStart(2, "0")}</span>
        </h2>
        {saved.length ? (
          <div className="simulation-saved-list">
            {saved.map((entry) => (
              <button
                key={entry.id}
                aria-label={`Charger : ${entry.title}`}
                onClick={() => load(entry)}
              >
                <span>
                  <strong>{entry.title}</strong>
                  <small>
                    {date.format(new Date(entry.createdAt))} · modèle{" "}
                    {entry.modelVersion}
                  </small>
                </span>
                <span>
                  Charger une copie <Icon name="arrow" size={16} />
                </span>
              </button>
            ))}
          </div>
        ) : (
          <p>
            Aucune comparaison conservée. Les exemples restent des simulations
            fictives, sans historique personnel prérempli.
          </p>
        )}
      </section>

      <footer className="simulation-model-note">
        <Icon name="lab" size={18} />
        <div>
          <p>Un modèle pour comprendre, pas une prévision.</p>
          <p>
            Montants HT, ventes constantes, dépenses réglées le mois de la vente
            et encaissements décalés par mois entiers. Sans TVA, impôts, stocks,
            emprunts, intérêts, impayés ni capacité de production. Le calcul
            n’estime ni probabilité de survie, ni effet commercial d’une
            décision. Les comparaisons restent locales au navigateur.
          </p>
        </div>
      </footer>
    </div>
  );
}
