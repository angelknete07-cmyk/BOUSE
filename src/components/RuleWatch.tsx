import { DATED_RULES, type DatedRule } from "../data/datedRules";
import { lessons } from "../data/lessons";
import {
  isStale,
  markRulesSeen,
  monthLabel,
  recentChanges,
  ruleAlerts,
  rulesForLesson,
} from "../lib/ruleWatch";
import type { AppState, StateUpdater } from "../lib/types";

/**
 * Idée 33 : contenu daté et vérifié. Les règles qui changent avec la loi sont
 * datées ; quand l'une change après que tu as réussi sa leçon, tu es prévenu.
 */

const lessonTitle = (id: string) => lessons.find((l) => l.id === id)?.title ?? id;

function Change({ rule }: { rule: DatedRule }) {
  return (
    <span className="rw-change">
      {rule.before && (
        <>
          <s>{rule.before}</s>
          <span aria-hidden="true"> → </span>
          <span className="sr-only">devient </span>
        </>
      )}
      <b>{rule.now}</b>
    </span>
  );
}

/** Sur l'accueil : « Une règle a changé depuis ta leçon ». */
export function RuleAlerts({
  state,
  update,
  onNavigate,
}: {
  state: AppState;
  update?: StateUpdater;
  onNavigate: (route: string) => void;
}) {
  const alerts = ruleAlerts(state);
  if (!alerts.length) return null;
  return (
    <section className="rw-alert" aria-labelledby="rw-alert-title">
      <div className="rw-alert-head">
        <span className="eyebrow">À JOUR</span>
        <h2 id="rw-alert-title">
          {alerts.length === 1
            ? "Une règle a changé depuis ta leçon"
            : `${alerts.length} règles ont changé depuis tes leçons`}
        </h2>
      </div>
      <ul>
        {alerts.map((rule, i) => (
          <li key={rule.id}>
            <span className="rw-topic">{rule.topic}</span>
            <Change rule={rule} />
            {alerts[i + 1]?.lesson !== rule.lesson && (
            <button
              type="button"
              className="text-button"
              onClick={() => onNavigate(`lesson/${rule.lesson}`)}
            >
              Revoir « {lessonTitle(rule.lesson)} »
            </button>
            )}
          </li>
        ))}
      </ul>
      {update && (
        <button
          type="button"
          className="button secondary"
          onClick={() => update((s) => markRulesSeen(s, alerts))}
        >
          C’est noté
        </button>
      )}
    </section>
  );
}

/** Dans une leçon : ce qui a changé récemment, et les règles datées. */
export function LessonRules({ lessonId }: { lessonId: string }) {
  const rules = rulesForLesson(lessonId);
  if (!rules.length) return null;
  const now = new Date();
  const changed = recentChanges(lessonId, now);
  return (
    <details className="rw-lesson" open={changed.length > 0 || undefined}>
      <summary>
        <span className="eyebrow">CHIFFRES DATÉS</span>
        <span>
          {changed.length
            ? `Mis à jour en ${monthLabel(changed[0]!.changedAt!)} : ${changed.length === 1 ? "une règle a changé" : `${changed.length} règles ont changé`}`
            : `${rules.length} règle${rules.length > 1 ? "s" : ""} qui change${rules.length > 1 ? "nt" : ""} avec la loi`}
        </span>
      </summary>
      <ul>
        {rules.map((rule) => (
          <li key={rule.id} data-changed={changed.includes(rule) || undefined}>
            <span className="rw-topic">{rule.topic}</span>
            <Change rule={rule} />
            <small>
              {rule.since ? `${rule.since} · ` : ""}
              {isStale(rule, now) ? (
                <em>vérifié en {monthLabel(rule.checkedAt)}, à revérifier</em>
              ) : (
                `vérifié en ${monthLabel(rule.checkedAt)}`
              )}{" "}
              ·{" "}
              <a href={rule.where.url} target="_blank" rel="noopener noreferrer">
                {rule.where.label}
              </a>
            </small>
          </li>
        ))}
      </ul>
    </details>
  );
}

/** Dans Sources : toutes les règles datées, et leur date de vérification. */
export function RulesRegister({ onNavigate }: { onNavigate?: (route: string) => void }) {
  const now = new Date();
  return (
    <section className="rw-register" aria-labelledby="rw-register-title">
      <h2 id="rw-register-title">Les chiffres qui changent avec la loi</h2>
      <p>
        Taux, plafonds et calendriers enseignés dans les leçons, avec la date
        où ils ont été vérifiés. Quand l’un change, la leçon est corrigée et
        celles et ceux qui l’avaient faite sont prévenus sur leur accueil.
      </p>
      <ul>
        {DATED_RULES.map((rule) => (
          <li key={rule.id}>
            <span className="rw-topic">{rule.topic}</span>
            <Change rule={rule} />
            <small>
              {isStale(rule, now) ? (
                <em>à revérifier</em>
              ) : (
                `vérifié en ${monthLabel(rule.checkedAt)}`
              )}{" "}
              ·{" "}
              {onNavigate ? (
                <button
                  type="button"
                  className="text-button inline"
                  onClick={() => onNavigate(`lesson/${rule.lesson}`)}
                >
                  {lessonTitle(rule.lesson)}
                </button>
              ) : (
                lessonTitle(rule.lesson)
              )}{" "}
              ·{" "}
              <a href={rule.where.url} target="_blank" rel="noopener noreferrer">
                {rule.where.label}
              </a>
            </small>
          </li>
        ))}
      </ul>
    </section>
  );
}
