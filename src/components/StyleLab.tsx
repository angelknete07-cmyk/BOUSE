import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { ProgressRing } from "./ProgressRing";
import { Terrain } from "./Terrain";

/**
 * V4 jalon B — page de contrôle visuel interne (#labo-design).
 * Chargée seulement en développement : jamais présente dans le site publié.
 * Elle montre les vrais composants et calcule les contrastes à partir des
 * jetons réels.
 */

const swatches = [
  ["--bg", "Fond"],
  ["--surface", "Carte"],
  ["--raised", "Relief"],
  ["--text", "Texte"],
  ["--text-secondary", "Texte secondaire"],
  ["--muted", "Métadonnée"],
  ["--text-tertiary", "Tertiaire"],
  ["--ink-faint", "Trait faible"],
  ["--accent", "Argent"],
  ["--accent-violet", "Accent 1"],
  ["--accent-blue", "Accent 2"],
  ["--accent-emerald", "Accent 3"],
] as const;

function luminance(rgb: number[]) {
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

function resolve(token: string) {
  const probe = document.createElement("span");
  probe.style.color = `var(${token})`;
  document.body.appendChild(probe);
  const value = getComputedStyle(probe).color;
  probe.remove();
  return (value.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
}

function ratio(a: number[], b: number[]) {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x! + 0.05) / (y! + 0.05);
}

const hex = (rgb: number[]) =>
  "#" + rgb.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");

function Chart() {
  const reference = "M0,120 L60,112 L120,100 L180,92 L240,80 L300,70 L360,58";
  const active = "M0,130 L60,104 L120,108 L180,78 L240,70 L300,44 L360,30";
  return (
    <svg viewBox="0 0 360 150" className="style-lab-chart" role="img">
      <title>Courbe active et référence</title>
      {[30, 70, 110].map((y) => (
        <line key={y} x1="0" x2="360" y1={y} y2={y} className="grid" />
      ))}
      <path d={`${active} L360,150 L0,150Z`} className="area" />
      <path d={reference} className="reference" />
      <path d={active} className="active" />
      <circle cx="300" cy="44" r="4.5" className="point" />
    </svg>
  );
}

export function StyleLab() {
  const [rows, setRows] = useState<
    { token: string; label: string; value: string; bg: number; card: number }[]
  >([]);

  useEffect(() => {
    const bg = resolve("--bg");
    const card = resolve("--surface");
    setRows(
      swatches.map(([token, label]) => {
        const value = resolve(token);
        return {
          token,
          label,
          value: hex(value),
          bg: ratio(value, bg),
          card: ratio(value, card),
        };
      }),
    );
  }, []);

  return (
    <div className="style-lab">
      <style>{styleLabCss}</style>
      <header className="style-lab-head">
        <p className="eyebrow">Interne · développement seulement</p>
        <h1>Labo de style V4</h1>
        <p>
          Les vrais composants de BOUSE avec les jetons actuels. Rien ici n’est
          visible dans le site publié.
        </p>
      </header>

      <section className="style-lab-block">
        <h2>Typographie</h2>
        <p className="style-lab-meta">Finance · Leçon 02 · 18 min</p>
        <h3 className="style-lab-display">Trouver son seuil de rentabilité</h3>
        <p className="style-lab-reading">
          Une activité peut vendre beaucoup, dégager un bénéfice et manquer
          d’argent pour payer ses fournisseurs. Pour prendre une décision, il
          faut distinguer ce qui est vendu, ce qui est gagné et ce qui est
          disponible sur le compte.
        </p>
        <p className="style-lab-figures">
          <strong>27 €</strong> <span>contribution par vente</span>
          <strong>89</strong> <span>unités pour l’équilibre</span>
        </p>
        <p className="style-lab-scale">
          <span style={{ fontSize: "var(--type-coordinate)" }}>coordonnée</span>
          <span style={{ fontSize: "var(--type-annotation)" }}>annotation</span>
          <span style={{ fontSize: "var(--type-micro)" }}>micro</span>
          <span style={{ fontSize: "var(--type-caption)" }}>légende</span>
          <span style={{ fontSize: "var(--type-small)" }}>petit</span>
          <span style={{ fontSize: "var(--type-body)" }}>corps</span>
        </p>
      </section>

      <section className="style-lab-block">
        <h2>Boutons, champs, icônes</h2>
        <div className="style-lab-row">
          <button type="button" className="button primary">
            <Icon name="play" size={14} /> Continuer la leçon
          </button>
          <button type="button" className="button secondary">
            8 rappels prêts
          </button>
          <button type="button" className="text-button">
            Voir le plan complet <Icon name="arrow" size={14} />
          </button>
          <button type="button" className="button secondary" disabled>
            Indisponible
          </button>
        </div>
        <div className="style-lab-row">
          <label className="field">
            Prénom ou pseudo
            <input defaultValue="Camille" />
          </label>
          <label className="field">
            Temps par session
            <select defaultValue="20">
              <option value="20">20 minutes</option>
            </select>
          </label>
        </div>
        <div className="style-lab-row style-lab-icons">
          {[
            "home",
            "book",
            "clock",
            "node",
            "lab",
            "chart",
            "ai",
            "idea",
            "radar",
            "settings",
          ].map((name) => (
            <span key={name}>
              <Icon name={name} size={20} />
              <small>{name}</small>
            </span>
          ))}
        </div>
      </section>

      <section className="style-lab-block style-lab-grid">
        <div className="style-lab-card">
          <h2>Graphique</h2>
          <Chart />
          <p className="style-lab-meta">
            Trait plein = votre scénario · pointillé = référence
          </p>
        </div>
        <div className="style-lab-card">
          <h2>Anneaux</h2>
          <div className="style-lab-row">
            <ProgressRing value={0.07} size={96} stroke={6} label="7 %" />
            <ProgressRing
              value={0.42}
              size={96}
              stroke={6}
              label="42 %"
              tone="violet"
            />
            <ProgressRing
              value={0.75}
              size={96}
              stroke={6}
              label="75 %"
              tone="emerald"
            />
          </div>
        </div>
        <div className="style-lab-card style-lab-wave">
          <h2>Vague (inchangée)</h2>
          <div className="style-lab-wave-frame">
            <Terrain />
          </div>
        </div>
      </section>

      <section className="style-lab-block">
        <h2>Jetons et contrastes calculés</h2>
        <table className="style-lab-table">
          <thead>
            <tr>
              <th>Rôle</th>
              <th>Jeton</th>
              <th>Valeur</th>
              <th>sur fond</th>
              <th>sur carte</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.token}>
                <td>
                  <span
                    className="swatch"
                    style={{ background: `var(${row.token})` }}
                  />
                  {row.label}
                </td>
                <td>{row.token}</td>
                <td>{row.value}</td>
                <td className={row.bg < 4.5 ? "low" : ""}>
                  {row.bg.toFixed(1)}:1
                </td>
                <td className={row.card < 4.5 ? "low" : ""}>
                  {row.card.toFixed(1)}:1
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

const styleLabCss = `
.style-lab { display: grid; gap: 28px; max-width: var(--page-max); }
.style-lab h1 { font-family: var(--font-display); font-size: var(--type-page-fluid); letter-spacing: var(--tracking-display); font-weight: var(--weight-heading); margin: 4px 0; }
.style-lab h2 { font-family: var(--font-display); font-size: var(--type-title-md); letter-spacing: var(--tracking-heading); font-weight: var(--weight-heading); margin: 0 0 14px; }
.style-lab-head p { color: var(--text-secondary); margin: 0; }
.style-lab-switches { display: flex; flex-wrap: wrap; gap: 20px; margin-top: 18px; }
.style-lab-switches fieldset { border: 0; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.style-lab-switches legend { color: var(--muted); font-size: var(--type-small); margin-bottom: 6px; }
.style-lab-block { border: 1px solid var(--line); border-radius: 14px; padding: 22px; background: var(--surface-low); }
.style-lab-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
.style-lab-card { border: 1px solid var(--line); border-radius: 12px; padding: 18px; background: var(--surface); }
.style-lab-row { display: flex; flex-wrap: wrap; gap: 12px; align-items: end; margin-bottom: 14px; }
.style-lab-meta { color: var(--muted); font-size: var(--type-caption); margin: 0 0 6px; }
.style-lab-display { font-family: var(--font-display); font-size: var(--type-hero-fluid); letter-spacing: var(--tracking-display); font-weight: var(--weight-heading); line-height: var(--leading-tight); margin: 0 0 10px; }
.style-lab-reading { max-width: var(--measure-reading); font-size: var(--type-reading); line-height: var(--leading-reading); color: var(--text-secondary); }
.style-lab-figures { display: flex; gap: 10px; align-items: baseline; flex-wrap: wrap; font-variant-numeric: tabular-nums; }
.style-lab-figures strong { font-family: var(--font-display); font-size: var(--type-number); font-weight: var(--weight-figure); letter-spacing: var(--tracking-figure); }
.style-lab-figures span { color: var(--muted); font-size: var(--type-caption); margin-right: 18px; }
.style-lab-scale { display: flex; gap: 16px; flex-wrap: wrap; align-items: baseline; color: var(--text-tertiary); }
.style-lab-icons span { display: grid; justify-items: center; gap: 4px; color: var(--text-secondary); width: 64px; }
.style-lab-icons small { font-size: var(--type-caption); color: var(--muted); }
.style-lab-chart { width: 100%; height: auto; }
.style-lab-chart .grid { stroke: var(--line); }
.style-lab-chart .area { fill: rgb(var(--accent-violet-rgb) / calc(0.14 * var(--wash-k))); }
.style-lab-chart .reference { fill: none; stroke: var(--text-tertiary); stroke-width: 1.2; stroke-dasharray: 4 4; }
.style-lab-chart .active { fill: none; stroke: var(--accent-violet); stroke-width: 2; filter: drop-shadow(0 0 6px rgb(var(--accent-violet-rgb) / calc(0.8 * var(--glow-k)))); }
.style-lab-chart .point { fill: var(--accent-violet); stroke: var(--bg); stroke-width: 2; }
.style-lab-wave-frame { position: relative; height: 180px; overflow: hidden; border-radius: 10px; color: var(--accent); }
.style-lab-wave-frame svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.style-lab-table { width: 100%; border-collapse: collapse; font-size: var(--type-small); font-variant-numeric: tabular-nums; }
.style-lab-table th, .style-lab-table td { text-align: left; padding: 8px 10px; border-bottom: 1px solid var(--line); }
.style-lab-table th { color: var(--muted); font-weight: var(--weight-medium); }
.style-lab-table .low { color: var(--warning-text); }
.style-lab-table .swatch { display: inline-block; width: 14px; height: 14px; border-radius: 4px; border: 1px solid var(--line-strong); margin-right: 8px; vertical-align: -2px; }
`;
