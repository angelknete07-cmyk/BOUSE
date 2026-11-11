import { useEffect, useRef } from "react";
import {
  CATALOGUE_SKILLS,
  LEVEL_NAMES,
  type CatalogueLevel,
  type CatalogueSkill,
} from "../data/catalogue";
import { lessons } from "../data/lessons";
import {
  catalogueDomain,
  catalogueSkill,
  chosenDomainIds,
  nextSkill,
  skillStatuses,
  toggleDomain,
  type SkillStatus,
} from "../lib/catalogue";
import { latestCurrentAttempt } from "../lib/portfolio";
import type { AppState, StateUpdater } from "../lib/types";
import { useClock } from "../lib/useClock";
import { DomainPicker } from "./DomainPicker";

/**
 * Le catalogue des compétences dans l'appli (idées 13 et 15 d'Angel, maquette
 * maquette/catalogue.html) : choisir ses domaines, voir un domaine du
 * débutant à l'expert, et la fiche d'une compétence.
 */

type Props = {
  state: AppState;
  update: StateUpdater;
  onNavigate: (route: string) => void;
};

const LEVELS: CatalogueLevel[] = [0, 1, 2, 3];

function useStatuses(state: AppState) {
  const now = useClock();
  return skillStatuses(CATALOGUE_SKILLS, (id) => {
    const lesson = lessons.find((item) => item.id === id);
    const attempt = lesson
      ? latestCurrentAttempt(lesson, state.attempts, now)
      : undefined;
    return attempt ? (attempt.passed ? "passed" : "failed") : undefined;
  });
}

/** Où mène une compétence : sa leçon si elle est écrite, sinon sa fiche. */
export const skillRoute = (skill: CatalogueSkill) =>
  skill.lesson ? `lesson/${skill.lesson}` : `skill/${skill.id}`;

/** « Script d'entretien » → « script d'entretien », sans toucher aux sigles. */
const lower = (text: string) =>
  /^[A-ZÀ-Ý][a-zà-ÿ]/.test(text)
    ? text[0]!.toLowerCase() + text.slice(1)
    : text;
const countLabel = (n: number, word: string) =>
  `${n} ${word}${n > 1 ? "s" : ""}`;

/** Route « domains » : choisir ce qu'on veut apprendre. */
export function DomainChooser({ state, update, onNavigate }: Props) {
  const chosen = chosenDomainIds(state);
  return (
    <div className="cat-page">
      <p className="eyebrow">Ton parcours</p>
      <h1 className="cat-title">Qu’est-ce qui t’intéresse&nbsp;?</h1>
      <p className="cat-lead">
        Coche les domaines que tu veux apprendre. Tu peux en ajouter ou en
        retirer quand tu veux. Chaque domaine va du débutant total à l’expert.
      </p>
      <DomainPicker
        chosen={chosen}
        onToggle={(id) =>
          update((s) => ({
            ...s,
            domains: toggleDomain(chosenDomainIds(s), id),
          }))
        }
      />
      <div className="cat-foot">
        <span role="status">
          {countLabel(chosen.length, "domaine")} choisi
          {chosen.length > 1 ? "s" : ""}
        </span>
        <button
          type="button"
          className="button primary"
          onClick={() => onNavigate(`domain/${chosen[0]}`)}
        >
          C’est parti →
        </button>
      </div>
    </div>
  );
}

/** Dans l'Académie : ses domaines, et de quoi en ajouter. */
export function DomainStrip({
  state,
  onNavigate,
}: {
  state: AppState;
  onNavigate: (route: string) => void;
}) {
  const statuses = useStatuses(state);
  const chosen = chosenDomainIds(state);
  return (
    <section className="cat-strip" aria-labelledby="cat-strip-title">
      <h2 id="cat-strip-title">Tes domaines</h2>
      <div className="cat-pills">
        {chosen.map((id) => {
          const domain = catalogueDomain(id)!;
          const skills = CATALOGUE_SKILLS.filter((s) => s.domain === id);
          const done = skills.filter((s) => statuses[s.id] === "done").length;
          return (
            <button
              type="button"
              key={id}
              className="cat-pill"
              onClick={() => onNavigate(`domain/${id}`)}
            >
              {domain.name}
              <small>
                {done} / {skills.length}
              </small>
            </button>
          );
        })}
        <button
          type="button"
          className="cat-pill cat-add"
          onClick={() => onNavigate("domains")}
        >
          ＋ Ajouter un domaine
        </button>
      </div>
    </section>
  );
}

const TAG: Record<SkillStatus, string> = {
  done: "Validée",
  retry: "À reprendre",
  open: "Prête",
  wait: "Prête",
  soon: "Bientôt",
};

/** Route « domain/<id> » : un domaine, du débutant à l'expert. */
export function DomainPage({
  id,
  state,
  update,
  onNavigate,
}: Props & { id: string }) {
  const statuses = useStatuses(state);
  const domain = catalogueDomain(id);
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [id]);
  if (!domain) return <Missing onNavigate={onNavigate} />;
  const chosen = chosenDomainIds(state);
  const mine = chosen.includes(id);
  const skills = CATALOGUE_SKILLS.filter((s) => s.domain === id);
  const done = skills.filter((s) => statuses[s.id] === "done").length;
  const next = nextSkill(id, statuses);
  return (
    <div className="cat-page">
      <div
        className="cat-pills cat-switch"
        role="group"
        aria-label="Tes domaines"
      >
        {chosen.map((other) => (
          <button
            type="button"
            key={other}
            className="cat-pill"
            aria-pressed={other === id}
            onClick={() => onNavigate(`domain/${other}`)}
          >
            {catalogueDomain(other)!.name}
          </button>
        ))}
        <button
          type="button"
          className="cat-pill cat-add"
          onClick={() => onNavigate("domains")}
        >
          ＋ Ajouter un domaine
        </button>
      </div>
      <div className="cat-head">
        <div>
          <p className="eyebrow">Académie · {domain.group}</p>
          <h1 className="cat-title" ref={headingRef} tabIndex={-1}>
            {domain.name}
          </h1>
          <p className="cat-lead">{domain.promise}</p>
        </div>
        <div className="cat-head-side">
          <span className="cat-tag">
            {done} / {skills.length} validées
          </span>
          {!mine && (
            <button
              type="button"
              className="button secondary"
              onClick={() =>
                update((s) => ({
                  ...s,
                  domains: toggleDomain(chosenDomainIds(s), id),
                }))
              }
            >
              Ajouter à mes domaines
            </button>
          )}
        </div>
      </div>
      {next && (
        <section className="cat-next" aria-labelledby="cat-next-title">
          <p className="eyebrow">Ta prochaine étape</p>
          <div>
            <h2 id="cat-next-title">{next.title}</h2>
            <p>
              {next.does}
              {next.gesture ? ` Tu repars avec : ${lower(next.gesture)}.` : ""}
            </p>
          </div>
          <button
            type="button"
            className="button primary"
            onClick={() => onNavigate(skillRoute(next))}
          >
            {next.lesson ? "Commencer" : "Voir la compétence"} →
          </button>
        </section>
      )}
      <div className="cat-levels">
        {LEVELS.map((level) => {
          const list = skills.filter((s) => s.level === level);
          if (!list.length) return null;
          return (
            <section key={level} aria-labelledby={`cat-level-${level}`}>
              <div className="cat-level-head">
                <h2 id={`cat-level-${level}`}>{LEVEL_NAMES[level]}</h2>
                <small>{countLabel(list.length, "compétence")}</small>
                <i aria-hidden="true" />
              </div>
              <ul className="cat-skills">
                {list.map((skill) => {
                  const status = statuses[skill.id] ?? "soon";
                  return (
                    <li key={skill.id}>
                      <button
                        type="button"
                        className="cat-skill"
                        data-s={status}
                        onClick={() => onNavigate(skillRoute(skill))}
                      >
                        <span className="cat-dot" aria-hidden="true" />
                        <b>{skill.title}</b>
                        <span>{skill.does}</span>
                        <em>
                          <span
                            className={`cat-tag${status === "soon" ? "" : " is-ready"}`}
                          >
                            {TAG[status]}
                          </span>
                          {skill.gesture && (
                            <span className="cat-tag">
                              Modèle : {skill.gesture}
                            </span>
                          )}
                        </em>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
      <p className="cat-note">
        « Prête » : la leçon existe déjà. « Bientôt » : elle s’écrit peu à peu ;
        tu peux déjà voir ce qu’elle t’apprendra. L’arbre des compétences montre
        tous tes domaines, avec leurs liens.
      </p>
    </div>
  );
}

/** Route « skill/<id> » : la fiche d'une compétence. */
export function SkillSheet({
  id,
  state,
  onNavigate,
}: Omit<Props, "update"> & { id: string }) {
  const statuses = useStatuses(state);
  const skill = catalogueSkill(id);
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [id]);
  if (!skill) return <Missing onNavigate={onNavigate} />;
  const domain = catalogueDomain(skill.domain)!;
  const status = statuses[skill.id] ?? "soon";
  const before = skill.prerequisites.flatMap((p) => catalogueSkill(p) ?? []);
  const after = CATALOGUE_SKILLS.filter((s) => s.prerequisites.includes(id));
  const chip = (item: CatalogueSkill) => (
    <button
      type="button"
      key={item.id}
      className="cat-pill"
      data-s={statuses[item.id]}
      onClick={() => onNavigate(skillRoute(item))}
    >
      {item.title}
    </button>
  );
  return (
    <div className="cat-page">
      <button
        type="button"
        className="text-button cat-back"
        onClick={() => onNavigate(`domain/${domain.id}`)}
      >
        ← {domain.name}
      </button>
      <p className="eyebrow">
        {domain.name} · {LEVEL_NAMES[skill.level]} · 10 min
      </p>
      <h1 className="cat-title" ref={headingRef} tabIndex={-1}>
        {skill.title}
      </h1>
      <p className="cat-lead">{skill.does}</p>
      <ol className="cat-steps" aria-label="Comment elle se déroule">
        <li>
          <b>1. L’idée</b>2 min · ce qu’il faut comprendre
        </li>
        <li>
          <b>2. Le geste</b>6 min ·{" "}
          {skill.gesture
            ? `${lower(skill.gesture)} à remplir`
            : "un exercice pratique"}
        </li>
        <li>
          <b>3. Le contrôle</b>2 min · deux questions pour vérifier
        </li>
      </ol>
      <section className="cat-card" aria-label="Où en est cette compétence">
        {status === "soon" ? (
          <>
            <p className="cat-state" data-s="soon">
              <i aria-hidden="true" /> Bientôt : sa leçon s’écrit en ce moment.
            </p>
            <p>
              Tu vois déjà ce qu’elle t’apprendra. En attendant, avance sur ce
              qui vient avant, ou sur une compétence déjà prête de ce domaine.
            </p>
            <div className="cat-actions">
              <button
                type="button"
                className="button primary"
                onClick={() => onNavigate(`domain/${domain.id}`)}
              >
                Voir les compétences prêtes →
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="cat-state" data-s={status}>
              <i aria-hidden="true" /> {TAG[status]}
            </p>
            <div className="cat-actions">
              <button
                type="button"
                className="button primary"
                onClick={() => onNavigate(skillRoute(skill))}
              >
                {status === "done"
                  ? "Revoir la leçon"
                  : status === "retry"
                    ? "Réviser la leçon"
                    : "Ouvrir la leçon"}{" "}
                →
              </button>
            </div>
          </>
        )}
      </section>
      <div className="cat-rel">
        <p>
          {before.length
            ? "Il faut savoir avant"
            : "C’est une base : rien à savoir avant."}
        </p>
        {before.length > 0 && (
          <div className="cat-pills">{before.map(chip)}</div>
        )}
      </div>
      {after.length > 0 && (
        <div className="cat-rel">
          <p>Ça ouvre ensuite</p>
          <div className="cat-pills">{after.map(chip)}</div>
        </div>
      )}
      <p className="cat-note">
        Chaque compétence suit ce format court : une idée simple, un geste
        pratique avec un vrai modèle que tu gardes, un petit contrôle. Une fois
        réussie, elle se valide dans l’arbre.
      </p>
    </div>
  );
}

function Missing({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <div className="empty-state not-found">
      <h1>Ce domaine ou cette compétence n’existe pas.</h1>
      <p>Le lien est peut-être ancien. Ta progression n’est pas touchée.</p>
      <div className="not-found-actions">
        <button
          className="button primary"
          onClick={() => onNavigate("domains")}
        >
          Voir les domaines
        </button>
      </div>
    </div>
  );
}
