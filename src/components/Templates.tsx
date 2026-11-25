import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { lessons } from "../data/lessons";
import { ICONS } from "../lib/sceneArt";
import {
  buildDoc,
  buildSheet,
  exampleValues,
  fileStem,
  findTemplate,
  lineCount,
  TEMPLATES,
  templateProblems,
  type DocModel,
  type TemplateDef,
  type TemplateField,
  type Values,
} from "../lib/templates";
import type { AppState, StateUpdater } from "../lib/types";
import { buildXlsx, XLSX_MIME } from "../lib/xlsx";

/**
 * Idée 22 : la boîte à modèles. Un devis, une facture, un budget et un
 * prévisionnel à remplir, calculés en direct, à garder en PDF ou en Excel.
 */

type Props = {
  state: AppState;
  update: StateUpdater;
  onNavigate: (route: string) => void;
};

function ArtIcon({ name, size = 22 }: { name: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: ICONS[name] ?? "" }}
    />
  );
}

const filled = (values: Values | undefined) =>
  !!values && Object.values(values).some((v) => v.trim());

/** Route « modeles » : choisir un modèle. */
export function TemplateList({ state, onNavigate }: Omit<Props, "update">) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => titleRef.current?.focus({ preventScroll: true }), []);
  return (
    <div className="cat-page tp-page">
      <p className="eyebrow">Construire · Modèles</p>
      <h1 className="cat-title" ref={titleRef} tabIndex={-1}>
        Des modèles prêts à remplir
      </h1>
      <p className="cat-lead">
        Remplis les cases : les calculs se font tout seuls et le document
        apparaît en direct. Garde-le ensuite en PDF ou en Excel.
      </p>
      <ul className="tp-grid">
        {TEMPLATES.map((t) => {
          const started = filled(state.templates?.[t.id]);
          return (
            <li key={t.id}>
              <button
                type="button"
                className="tp-card"
                onClick={() => onNavigate(`modele/${t.id}`)}
              >
                <span className="tp-card-icon">
                  <ArtIcon name={t.icon} size={24} />
                </span>
                <b>{t.title}</b>
                <span className="tp-card-what">{t.what}</span>
                <span className="tp-card-foot">
                  <span className="cat-tag">PDF · Excel</span>
                  {started && <span className="tp-state">Commencé</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="cat-note">
        Ce que tu tapes reste enregistré avec ta progression, sur cet appareil
        (et sur ton compte si tu es connecté). Rien n’est envoyé ailleurs.
      </p>
    </div>
  );
}

/** Route « modele/<id> » : remplir un modèle et voir le document. */
export function TemplatePage({ id, state, update, onNavigate }: Props & { id: string }) {
  const def = findTemplate(id);
  const [values, setValues] = useState<Values>(() => state.templates?.[id] ?? {});
  const [view, setView] = useState<"form" | "doc">("form");
  const [confirmClear, setConfirmClear] = useState(false);
  const [notice, setNotice] = useState("");
  const [printing, setPrinting] = useState(false);
  const [flash, setFlash] = useState(0);
  const dirty = useRef(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => titleRef.current?.focus({ preventScroll: true }), [id]);

  // Enregistré un instant après la frappe, et en quittant la page.
  const latest = useRef(values);
  latest.current = values;
  const save = () => {
    if (!dirty.current) return;
    dirty.current = false;
    const current = latest.current;
    update((s) => {
      const templates = { ...(s.templates ?? {}) };
      if (filled(current)) templates[id] = current;
      else delete templates[id];
      return { ...s, templates };
    });
  };
  useEffect(() => {
    const timer = window.setTimeout(save, 400);
    return () => window.clearTimeout(timer);
  }, [values]);
  useEffect(() => save, []);

  // Impression : seul le document part à l'imprimante (ou en PDF).
  useEffect(() => {
    if (!printing) return;
    document.body.classList.add("tp-printing");
    const done = () => {
      document.body.classList.remove("tp-printing");
      setPrinting(false);
    };
    window.addEventListener("afterprint", done, { once: true });
    const frame = requestAnimationFrame(() => window.print());
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("afterprint", done);
      document.body.classList.remove("tp-printing");
    };
  }, [printing]);

  if (!def)
    return (
      <div className="empty-state">
        <h1>Modèle introuvable.</h1>
        <button className="button primary" onClick={() => onNavigate("modeles")}>
          Voir les modèles
        </button>
      </div>
    );

  const set = (key: string, value: string) => {
    dirty.current = true;
    setValues((v) => ({ ...v, [key]: value }));
    setFlash((n) => n + 1);
    setNotice("");
  };
  const replace = (next: Values) => {
    dirty.current = true;
    setValues(next);
    setFlash((n) => n + 1);
  };
  const doc = buildDoc(def, values);
  const problems = templateProblems(def, values);
  const stem = fileStem(def, values);

  function exportExcel() {
    const bytes = buildXlsx(buildSheet(def!, values));
    const url = URL.createObjectURL(new Blob([bytes as Uint8Array<ArrayBuffer>], { type: XLSX_MIME }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${stem}.xlsx`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice(`Fichier Excel préparé : ${stem}.xlsx.`);
  }

  return (
    <div className="cat-page tp-page">
      <p className="eyebrow">
        <button type="button" className="tp-back" onClick={() => onNavigate("modeles")}>
          Modèles
        </button>{" "}
        · {def.title}
      </p>
      <h1 className="cat-title" ref={titleRef} tabIndex={-1}>
        {def.title}
      </h1>
      <p className="cat-lead">{def.what}</p>

      <div className="tp-bar">
        <div className="tp-toggle" role="group" aria-label="Affichage">
          <button type="button" aria-pressed={view === "form"} onClick={() => setView("form")}>
            Remplir
          </button>
          <button type="button" aria-pressed={view === "doc"} onClick={() => setView("doc")}>
            Voir le document
          </button>
        </div>
        <div className="tp-tools">
          <button type="button" className="button secondary" onClick={() => replace(exampleValues(def))}>
            Remplir avec un exemple
          </button>
          {filled(values) &&
            (confirmClear ? (
              <span className="tp-confirm" role="group" aria-label="Confirmer">
                Tout effacer ?
                <button
                  type="button"
                  className="text-button"
                  onClick={() => {
                    replace({});
                    setConfirmClear(false);
                  }}
                >
                  Oui
                </button>
                <button type="button" className="text-button" onClick={() => setConfirmClear(false)}>
                  Non
                </button>
              </span>
            ) : (
              <button type="button" className="text-button" onClick={() => setConfirmClear(true)}>
                Tout effacer
              </button>
            ))}
        </div>
      </div>

      <div className="tp-work" data-view={view}>
        <section className="cat-card tp-form" aria-label="À remplir">
          {def.sections.map((section) => (
            <fieldset key={section.title} className="tp-set">
              <legend>{section.title}</legend>
              <div className="ms-fields">
                {section.fields.map((field) => (
                  <FieldInput
                    key={field.id}
                    field={field}
                    value={values[field.id] ?? ""}
                    onChange={(v) => set(field.id, v)}
                  />
                ))}
              </div>
            </fieldset>
          ))}
          {def.lines && <LinesEditor def={def} values={values} set={set} replace={replace} />}
          {def.grid && <GridEditor def={def} values={values} set={set} />}
          {problems.length > 0 && filled(values) && (
            <ul className="tp-problems" aria-live="polite">
              {problems.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          )}
        </section>

        <div className="tp-side">
          <DocPaper doc={doc} flash={flash} />
          <div className="tp-export">
            <button type="button" className="button primary" onClick={() => setPrinting(true)}>
              Garder en PDF
            </button>
            <button type="button" className="button secondary" onClick={exportExcel}>
              Ouvrir dans Excel
            </button>
            <small>
              PDF : choisis « Enregistrer en PDF » dans la fenêtre d’impression.
              Excel : les totaux sont de vraies formules.
            </small>
            {notice && (
              <small role="status" className="tp-notice">
                {notice}
              </small>
            )}
          </div>
          <p className="tp-caution">{def.caution}</p>
          <div className="tp-lessons">
            <span>Pour comprendre :</span>
            {def.lessons.map((lessonId) => (
              <button
                key={lessonId}
                type="button"
                className="ms-use"
                onClick={() => onNavigate(`lesson/${lessonId}`)}
              >
                {lessons.find((l) => l.id === lessonId)?.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {printing &&
        createPortal(
          <div className="tp-print">
            <DocPaper doc={doc} />
          </div>,
          document.body,
        )}
      {/* Pour garder le même nom au fichier PDF (titre de l'onglet). */}
      {printing && <PrintTitle title={stem} />}
    </div>
  );
}

function PrintTitle({ title }: { title: string }) {
  useEffect(() => {
    const before = document.title;
    document.title = title;
    return () => {
      document.title = before;
    };
  }, [title]);
  return null;
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: TemplateField;
  value: string;
  onChange: (value: string) => void;
}) {
  const label = `${field.label}${field.kind === "money" ? " (€)" : ""}${field.optional ? " · facultatif" : ""}`;
  return (
    <label data-inline={field.inline || undefined}>
      <span>{label}</span>
      {field.kind === "choice" ? (
        <select value={value || field.options![0]![0]} onChange={(e) => onChange(e.target.value)}>
          {field.options!.map(([v, text]) => (
            <option key={v} value={v}>
              {text}
            </option>
          ))}
        </select>
      ) : field.kind === "long" ? (
        <textarea rows={3} value={value} placeholder={`Ex. : ${field.example}`} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input
          type={field.kind === "date" ? "date" : "text"}
          value={value}
          placeholder={field.kind === "date" ? undefined : `Ex. : ${field.example}`}
          inputMode={field.kind === "money" || field.kind === "number" ? "decimal" : undefined}
          maxLength={200}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

function LinesEditor({
  def,
  values,
  set,
  replace,
}: {
  def: TemplateDef;
  values: Values;
  set: (key: string, value: string) => void;
  replace: (values: Values) => void;
}) {
  const lines = def.lines!;
  const [extra, setExtra] = useState(0);
  const count = Math.min(lines.max, lineCount(values, lines.max) + extra);
  function remove(index: number) {
    const next: Values = {};
    for (const [key, value] of Object.entries(values)) {
      const match = /^l(\d+)\.(.+)$/.exec(key);
      if (!match) {
        next[key] = value;
        continue;
      }
      const i = Number(match[1]);
      if (i === index) continue;
      next[`l${i > index ? i - 1 : i}.${match[2]}`] = value;
    }
    setExtra((n) => Math.max(0, n - 1));
    replace(next);
  }
  return (
    <fieldset className="tp-set">
      <legend>{lines.title}</legend>
      <div className="tp-lines">
        <div className="tp-line tp-line-head" aria-hidden="true">
          {lines.columns.map((c) => (
            <span key={c.id}>
              {c.label}
              {c.kind === "money" ? " (€)" : ""}
            </span>
          ))}
          <span />
        </div>
        {Array.from({ length: count }, (_, i) => (
          <div className="tp-line" key={i}>
            {lines.columns.map((c) => (
              <input
                key={c.id}
                aria-label={`${c.label}, ligne ${i + 1}`}
                value={values[`l${i}.${c.id}`] ?? ""}
                placeholder={i === 0 ? c.example : ""}
                inputMode={c.kind === "text" ? undefined : "decimal"}
                maxLength={200}
                onChange={(e) => set(`l${i}.${c.id}`, e.target.value)}
              />
            ))}
            <button
              type="button"
              className="tp-remove"
              aria-label={`Retirer la ligne ${i + 1}`}
              disabled={count === 1}
              onClick={() => remove(i)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      {count < lines.max && (
        <button type="button" className="text-button tp-add" onClick={() => setExtra((n) => n + 1)}>
          + Ajouter une ligne
        </button>
      )}
    </fieldset>
  );
}

function GridEditor({
  def,
  values,
  set,
}: {
  def: TemplateDef;
  values: Values;
  set: (key: string, value: string) => void;
}) {
  const grid = def.grid!;
  return (
    <fieldset className="tp-set">
      <legend>{grid.title}</legend>
      <div className="tp-grid-edit">
        <span />
        {grid.columns.map((c) => (
          <span key={c} className="tp-grid-head">
            {c}
          </span>
        ))}
        {grid.rows.map((row) => (
          <div key={row.id} className="tp-grid-row">
            <span className="tp-grid-label">
              {row.label} (€)
              <small>{row.hint}</small>
            </span>
            {grid.columns.map((c, i) => (
              <input
                key={c}
                aria-label={`${row.label}, ${c}`}
                value={values[`${row.id}.${i + 1}`] ?? ""}
                placeholder={row.examples[i]}
                inputMode="decimal"
                maxLength={20}
                onChange={(e) => set(`${row.id}.${i + 1}`, e.target.value)}
              />
            ))}
          </div>
        ))}
      </div>
    </fieldset>
  );
}

/** Le document, comme une feuille : à l'écran et à l'impression. */
function DocPaper({ doc, flash }: { doc: DocModel; flash?: number }) {
  return (
    <article className="tp-paper" aria-label="Le document, en direct">
      <header className="tp-doc-head">
        <div>
          <h2>{doc.heading}</h2>
          {doc.subtitle && <p>{doc.subtitle}</p>}
        </div>
        {doc.meta.length > 0 && (
          <dl>
            {doc.meta.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        )}
      </header>
      {doc.parties.length > 0 && (
        <div className="tp-parties">
          {doc.parties.map((p) => (
            <div key={p.title}>
              <b>{p.title}</b>
              {p.lines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </div>
          ))}
        </div>
      )}
      {doc.table && (
        <table>
          <thead>
            <tr>
              {doc.table.head.map((h, i) => (
                <th key={i} data-num={doc.table!.numeric[i] || undefined}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {doc.table.rows.length ? (
              doc.table.rows.map((row, r) => (
                <tr key={r} data-strong={doc.table!.strong?.includes(r) || undefined}>
                  {row.map((cell, i) => (
                    <td key={i} data-num={doc.table!.numeric[i] || undefined}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={doc.table.head.length} className="tp-empty">
                  Les lignes apparaîtront ici.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      {doc.totals.length > 0 && (
      <dl className="tp-totals" key={flash ?? 0} data-live={flash ? "" : undefined}>
        {doc.totals.map((t) => (
          <div key={t.label} data-strong={t.strong || undefined} data-tone={t.tone}>
            <dt>{t.label}</dt>
            <dd>{t.value}</dd>
          </div>
        ))}
      </dl>
      )}
      {doc.notes.length > 0 && (
        <ul className="tp-notes">
          {doc.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      )}
      <small className="tp-foot">Fait avec BOOST · document à vérifier avant tout usage officiel.</small>
    </article>
  );
}
