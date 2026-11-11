import { CATALOGUE_DOMAINS, CATALOGUE_SKILLS } from "../data/catalogue";

const GROUPS = [...new Set(CATALOGUE_DOMAINS.map((d) => d.group))];
const countLabel = (n: number, word: string) =>
  `${n} ${word}${n > 1 ? "s" : ""}`;

/** Les cases à cocher des domaines, groupées ; partagées avec le début. */
export function DomainPicker({
  chosen,
  onToggle,
  compact = false,
}: {
  chosen: string[];
  onToggle: (id: string) => void;
  compact?: boolean;
}) {
  return (
    <div className={`cat-groups${compact ? " is-compact" : ""}`}>
      {GROUPS.map((group) => (
        <div className="cat-group" key={group}>
          <p className="cat-group-name">{group}</p>
          <div className="cat-domains">
            {CATALOGUE_DOMAINS.filter((d) => d.group === group).map((d) => {
              const skills = CATALOGUE_SKILLS.filter((s) => s.domain === d.id);
              const ready = skills.filter((s) => s.lesson).length;
              const on = chosen.includes(d.id);
              return (
                <button
                  type="button"
                  key={d.id}
                  className="cat-domain"
                  aria-pressed={on}
                  onClick={() => onToggle(d.id)}
                >
                  <i className="cat-tick" aria-hidden="true">
                    ✓
                  </i>
                  <b>{d.name}</b>
                  {!compact && <span>{d.promise}</span>}
                  {!compact && (
                    <small>
                      {countLabel(skills.length, "compétence")}
                      {ready ? ` · ${ready} déjà prêtes` : ""}
                    </small>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
