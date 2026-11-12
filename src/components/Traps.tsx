import { useState } from "react";
import { foiledTraps, trapsToFoil, trapWhen, type Trap } from "../lib/traps";
import { useClock } from "../lib/useClock";

const SHOWN = 5;
/** Espace insécable devant ? ! : ; » et après « : pas de signe seul en bout de ligne. */
const fr = (text = "") =>
  text.replace(/ ([?!:;»])/g, "\u00a0$1").replace(/« /g, "«\u00a0");
const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);

/**
 * Le carnet « Mes pièges » (idée 19, maquette maquette/pieges.html) : en haut
 * des Révisions, les questions ratées avec la bonne réponse et le pourquoi.
 */
export function TrapNotebook({
  traps,
  onNavigate,
}: {
  traps: Trap[];
  onNavigate: (route: string) => void;
}) {
  const now = useClock();
  const toFoil = trapsToFoil(traps);
  const foiled = foiledTraps(traps);
  const [filter, setFilter] = useState<"todo" | "done">(
    toFoil.length ? "todo" : "done",
  );
  const [all, setAll] = useState(false);
  if (!traps.length) return null;

  const list = filter === "todo" ? toFoil : foiled;
  const shown = all ? list : list.slice(0, SHOWN);

  return (
    <section className="trap-notebook" aria-labelledby="traps-title">
      <div className="trap-head">
        <div>
          <p className="eyebrow">MES PIÈGES</p>
          <h2 id="traps-title">Tes pièges</h2>
          <p>
            Chaque question ratée est gardée ici, avec la bonne réponse et
            pourquoi. Un piège est déjoué quand tu réussis la question au quiz
            suivant.
          </p>
        </div>
        <div
          className="trap-filter"
          role="group"
          aria-label="Filtrer les pièges"
        >
          <button
            type="button"
            aria-pressed={filter === "todo"}
            onClick={() => {
              setFilter("todo");
              setAll(false);
            }}
          >
            À déjouer · {toFoil.length}
          </button>
          <button
            type="button"
            aria-pressed={filter === "done"}
            onClick={() => {
              setFilter("done");
              setAll(false);
            }}
          >
            Déjoués · {foiled.length}
          </button>
        </div>
      </div>

      {list.length === 0 ? (
        <p className="trap-empty">
          {filter === "todo"
            ? "Aucun piège à déjouer : toutes les questions ratées ont été réussies depuis."
            : "Aucun piège déjoué pour l’instant. Refais un quiz pour en déjouer un."}
        </p>
      ) : (
        <ul className="trap-list" key={filter}>
          {shown.map((trap) => (
            <TrapCard
              key={trap.id}
              trap={trap}
              now={now}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      )}
      {list.length > SHOWN && (
        <button
          type="button"
          className="text-button trap-more"
          onClick={() => setAll((v) => !v)}
        >
          {all
            ? "Voir moins"
            : `Voir ${list.length - SHOWN} ${plural(list.length - SHOWN, "autre piège", "autres pièges")}`}
        </button>
      )}
    </section>
  );
}

function TrapCard({
  trap,
  now,
  onNavigate,
}: {
  trap: Trap;
  now: Date;
  onNavigate: (route: string) => void;
}) {
  const lesson = trap.kind === "lesson";
  const source = `${lesson ? "Leçon" : "Compétence"} · ${trap.title}`;
  const when = trapWhen(trap.at, now);
  return (
    <li className={`trap-card ${trap.solved ? "is-done" : ""}`}>
      <p className="trap-meta">
        <span className={`trap-chip ${trap.wrongCount > 1 ? "is-hot" : ""}`}>
          {trap.solved
            ? "Déjoué"
            : `Raté ${trap.wrongCount} ${plural(trap.wrongCount, "fois", "fois")}`}
        </span>
        <span>{source}</span>
        <span>· {trap.solved ? `réussi ${when}` : when}</span>
      </p>
      <p className="trap-q">{fr(trap.question)}</p>
      {trap.solved ? (
        <p className="trap-ok">
          ✓ Réussie au dernier quiz{"\u00a0"}:{" "}
          {`«\u00a0${fr(trap.options[trap.answer])}\u00a0»`}.
        </p>
      ) : (
        <>
          <dl className="trap-answers">
            <div>
              <dt>Ta réponse</dt>
              <dd className="trap-wrong">
                <del>{fr(trap.options[trap.lastWrong])}</del>
              </dd>
            </div>
            <div>
              <dt>La bonne</dt>
              <dd className="trap-right">{fr(trap.options[trap.answer])}</dd>
            </div>
          </dl>
          <p className="trap-why">{fr(trap.why)}</p>
          <div className="trap-actions">
            <button
              type="button"
              className="button primary"
              onClick={() =>
                onNavigate(
                  lesson
                    ? `lesson/${trap.quizId}/quiz`
                    : `skill/${trap.quizId}/check`,
                )
              }
            >
              {lesson ? "Refaire le quiz →" : "Refaire le contrôle →"}
            </button>
            <button
              type="button"
              className="button secondary"
              onClick={() =>
                onNavigate(
                  lesson ? `lesson/${trap.quizId}` : `skill/${trap.quizId}`,
                )
              }
            >
              {lesson ? "Revoir la leçon" : "Revoir l’idée"}
            </button>
          </div>
        </>
      )}
    </li>
  );
}
