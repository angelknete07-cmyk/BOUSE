import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";
import {
  FLY_TIME,
  accountAt,
  chartPaths,
  money,
  progress,
  richText,
  waterfallLayout,
  type SceneItem,
  type Storyboard,
  type TextItem,
  type Tone,
} from "../lib/lessonScenes";
import { CHARACTERS, ICONS } from "../lib/sceneArt";

/* La vidéo animée d'une leçon : rend les scènes du scénario à l'instant `time`
   de la voix. Aucun minuteur propre : tout découle du temps, donc avancer,
   reculer ou accélérer garde l'image juste. */

type Props = { board: Storyboard; time: number; kicker: string };

const style = (vars: Record<string, string | number>) => vars as CSSProperties;
const toneClass = (tone?: Tone) => (tone ? ` is-${tone}` : "");

function Svg({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span
      className={`ls-ico ${className}`}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: `<svg viewBox="0 0 24 24">${ICONS[name] ?? ICONS.question}</svg>` }}
    />
  );
}
function Person({ name, small }: { name: string; small?: boolean }) {
  return (
    <span
      className={`ls-person${small ? " is-small" : ""}`}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: `<svg viewBox="0 0 64 84">${CHARACTERS[name] ?? CHARACTERS.client}</svg>` }}
    />
  );
}
const Coin = ({ dir }: { dir?: "in" | "out" }) => (
  <span className={`ls-coin${dir === "out" ? " is-out" : ""}`} aria-hidden="true" dangerouslySetInnerHTML={{ __html: `<svg viewBox="0 0 24 24">${ICONS.coin}</svg>` }} />
);

/** Un élément qui apparaît à `at` (et s'efface à `out`). */
function Show({
  t,
  at,
  out,
  hide,
  pop,
  k,
  children,
  className = "",
}: {
  t: number;
  at: number;
  out?: number;
  hide?: boolean;
  pop?: boolean;
  k?: string;
  children: ReactNode;
  className?: string;
}) {
  const on = t >= at;
  const gone = out !== undefined && t >= out;
  return (
    <div
      className={`ls-a${pop ? " is-pop" : ""}${on ? " is-in" : ""}${gone ? (hide ? " is-hidden" : " is-gone") : ""} ${className}`}
      data-k={k}
    >
      {children}
    </div>
  );
}

function Rich({ item, t }: { item: TextItem; t: number }) {
  const parts = richText(item.text);
  return (
    <>
      {parts.map((p, i) => {
        const mark = item.mark;
        const cls = p.tone ? `ls-tone${toneClass(p.tone)}` : undefined;
        if (mark && p.text.includes(mark.text)) {
          const at = p.text.indexOf(mark.text);
          return (
            <span key={i} className={cls}>
              {p.text.slice(0, at)}
              <span className="ls-mk" style={style({ "--g": progress(t, mark.at, mark.at + 0.8) })}>
                {mark.text}
              </span>
              {p.text.slice(at + mark.text.length)}
            </span>
          );
        }
        return (
          <span key={i} className={cls}>
            {p.text}
          </span>
        );
      })}
    </>
  );
}

const round = (v: number, a: number, b: number) =>
  Number.isInteger(a) && Number.isInteger(b) ? Math.round(v) : Math.round(v * 10) / 10;

function Item({ item, t }: { item: SceneItem; t: number }): ReactNode {
  const base = { t, at: item.at, out: item.out, hide: item.hide, k: item.id };
  switch (item.type) {
    case "text":
      return (
        <Show {...base} pop={item.size === "title" || item.size === "big"}>
          <p className={`ls-text is-${item.size ?? "mid"}${toneClass(item.tone)}`}>
            <Rich item={item} t={t} />
          </p>
        </Show>
      );
    case "icon":
      return (
        <Show {...base} pop>
          <div className={`ls-col${toneClass(item.tone)}`}>
            <Svg name={item.icon} className={`is-${item.size ?? "m"}`} />
            {item.label && <span className="ls-text is-small">{item.label}</span>}
          </div>
        </Show>
      );
    case "icons":
      return (
        <div className="ls-icons">
          {Array.from({ length: item.count }, (_, i) => (
            <Show key={i} t={t} at={item.at + i * (item.step ?? 0.3)} out={item.out} hide={item.hide} pop k={item.id ? `${item.id}-${i}` : undefined}>
              <div className="ls-col">
                <Svg name={item.icon} className={item.count > 6 ? "is-s" : "is-m"} />
                {item.label && <span className="ls-text is-small">{item.label}</span>}
              </div>
            </Show>
          ))}
        </div>
      );
    case "chips":
      return (
        <Show {...base}>
          <div className="ls-row">
            {item.items.map((c, i) => (
              <Show key={i} t={t} at={c.at} pop>
                {/^[+−\-×÷=→≠<>≈]$/.test(c.text) ? (
                  <span className="ls-op">{c.text}</span>
                ) : (
                  <span className={`ls-chip${toneClass(c.tone)}`}>{c.text}</span>
                )}
              </Show>
            ))}
          </div>
        </Show>
      );
    case "cards":
      return (
        <div className="ls-row is-stretch">
          {item.items.map((c, i) => (
            <Show key={i} t={t} at={c.at} out={item.out} hide={item.hide} pop>
              <div className={`ls-card${c.accent ? " is-accent" : ""}`}>
                {c.icon && <Svg name={c.icon} />}
                <p className={`ls-text is-mid${toneClass(c.tone)}`}>{c.title}</p>
                {c.sub && (
                  <Show t={t} at={c.subAt ?? c.at}>
                    <span className="ls-text is-small">{c.sub}</span>
                  </Show>
                )}
              </div>
            </Show>
          ))}
        </div>
      );
    case "counter": {
      const from = item.from ?? 0;
      const v = from + (item.to - from) * progress(t, item.at, item.until);
      const max = item.max ?? Math.max(Math.abs(from), Math.abs(item.to), 1);
      return (
        <Show {...base}>
          <div className="ls-col">
            {item.bar && (
              <span className="ls-meter">
                <i style={style({ "--g": Math.max(0, v) / max })} />
              </span>
            )}
            <div className="ls-row is-tight">
              <span className="ls-text is-small">{item.label}</span>
              <span className={`ls-num${toneClass(item.tone)}`}>{money(round(v, from, item.to), item.unit ?? " €")}</span>
            </div>
          </div>
        </Show>
      );
    }
    case "stats":
      return (
        <div className="ls-row is-stretch">
          {item.items.map((s, i) => {
            const v = s.value * progress(t, s.at, s.until ?? s.at + 1.2);
            return (
              <Show key={i} t={t} at={s.at} out={item.out} hide={item.hide} pop>
                <div className={`ls-card${s.accent ? " is-accent" : ""}`}>
                  <span className="ls-text is-small">{s.label}</span>
                  <span className={`ls-num${toneClass(s.tone)}`}>{money(round(v, 0, s.value), s.unit ?? " €")}</span>
                </div>
              </Show>
            );
          })}
        </div>
      );
    case "bars": {
      const max = Math.max(...item.items.map((b) => Math.abs(b.value)), 1);
      return (
        <div className="ls-bars">
          {item.items.map((b, i) => (
            <Show key={i} t={t} at={b.at} out={item.out} hide={item.hide}>
              <div className="ls-bar-col">
                <span className={`ls-text is-small${toneClass(b.tone)}`}>{money(b.value, item.unit ?? " €")}</span>
                <i
                  className={`ls-vbar${toneClass(b.tone)}`}
                  style={style({ "--h": `${Math.max(4, (Math.abs(b.value) / max) * 100)}%`, "--g": progress(t, b.at, b.at + 1.2) })}
                />
                <span className="ls-text is-small">{b.label}</span>
              </div>
            </Show>
          ))}
        </div>
      );
    }
    case "waterfall": {
      const layout = waterfallLayout(item.rows);
      return (
        <div className="ls-wf">
          {item.rows.map((r, i) => {
            const l = layout[i]!;
            const kind = r.kind === "minus" ? " is-minus" : r.kind === "plus" ? " is-plus" : "";
            const sign = r.kind === "minus" ? "− " : r.kind === "plus" ? "+ " : "";
            return (
              <Show key={i} t={t} at={r.at} out={item.out} hide={item.hide} className="ls-wf-row">
                <span className="ls-wf-label">{r.label}</span>
                <span className="ls-wf-track">
                  <i
                    className={`ls-hbar${kind}${toneClass(r.tone)}`}
                    style={style({ "--x": `${l.left * 100}%`, "--w": `${Math.max(l.width * 100, 1)}%`, "--g": progress(t, r.at + 0.1, r.at + 1.3) })}
                  />
                </span>
                <span className="ls-wf-val">
                  {sign}
                  {money(Math.abs(r.value), item.unit ?? " €")}
                </span>
              </Show>
            );
          })}
        </div>
      );
    }
    case "account": {
      const value = accountAt(item, t);
      const inflows = item.flows.filter((f) => f.dir === "in");
      const outflows = item.flows.filter((f) => f.dir === "out");
      const key = item.id ?? "compte";
      const flow = (f: (typeof item.flows)[number], i: number) => (
        <Show key={`${f.dir}${i}`} t={t} at={f.at} pop k={`${key}-${f.dir}${i}`}>
          <div className={`ls-flow${f.dir === "in" ? " is-gain" : " is-loss"}`}>
            {f.dir === "in" ? (
              <>
                {f.label} <i /> + {money(f.amount, item.unit ?? " €")}
              </>
            ) : (
              <>
                <i /> − {money(f.amount, item.unit ?? " €")} {f.label}
              </>
            )}
          </div>
          {f.note && <span className="ls-tag">{f.note}</span>}
        </Show>
      );
      return (
        <Show {...base} pop>
          <div className="ls-bank">
            <div className="ls-flows">{inflows.map(flow)}</div>
            <div className="ls-vault" data-k={key}>
              <Svg name="bank" className="is-l" />
              <span className="ls-text is-small">{item.label ?? "sur le compte"}</span>
              <span key={value} className="ls-num is-pulse">
                {money(value, item.unit ?? " €")}
              </span>
            </div>
            <div className="ls-flows">{outflows.map(flow)}</div>
          </div>
          {inflows.map((f, i) =>
            [0, 1].map((c) => (
              <i key={`fi${i}${c}`} className="ls-fly" data-fly={`${f.at + c * 0.18},${f.at + FLY_TIME + c * 0.18}`} data-a={`${key}-in${i}`} data-b={key}>
                <Coin />
              </i>
            )),
          )}
          {outflows.map((f, i) =>
            [0, 1].map((c) => (
              <i key={`fo${i}${c}`} className="ls-fly" data-fly={`${f.at + c * 0.18},${f.at + FLY_TIME + c * 0.18}`} data-a={key} data-b={`${key}-out${i}`}>
                <Coin dir="out" />
              </i>
            )),
          )}
        </Show>
      );
    }
    case "timeline":
      return (
        <Show {...base}>
          <div className="ls-timeline">
            <span className="ls-axis" />
            {item.span && (
              <>
                <i
                  className="ls-span"
                  style={style({ left: `${item.span.from}%`, width: `${item.span.to - item.span.from}%`, "--g": progress(t, item.span.at, item.span.at + 1.4) })}
                />
                <span className="ls-span-label" style={{ left: `${(item.span.from + item.span.to) / 2}%` }}>
                  <Show t={t} at={item.span.at + 0.6} pop>
                    <span className="ls-chip is-accent">{item.span.label}</span>
                  </Show>
                </span>
              </>
            )}
            {item.points.map((p, i) => (
              <span key={i} className="ls-dot" style={{ left: `${p.pos}%` }}>
                <Show t={t} at={p.at} pop>
                  <b />
                  <span className="ls-text is-small">
                    <strong>{p.label}</strong>
                    {p.sub ? ` · ${p.sub}` : ""}
                  </span>
                </Show>
              </span>
            ))}
          </div>
        </Show>
      );
    case "chart": {
      const { lines, baseline } = chartPaths(item);
      return (
        <Show {...base}>
          <svg className="ls-chart" viewBox="0 0 600 200" aria-hidden="true">
            {baseline !== null && (
              <>
                <line x1="0" x2="600" y1={baseline} y2={baseline} className="ls-base" />
                <text x="604" y={baseline + 4}>
                  {item.baseline!.label}
                </text>
              </>
            )}
            {item.lines.map((l, i) => {
              const g = progress(t, l.at, l.until);
              return (
                <g key={i} className={`ls-line${toneClass(l.tone)}`}>
                  <path d={lines[i]!.d} pathLength={1} style={style({ "--g": g })} data-path={i} />
                  <circle r="6" data-follow={i} style={{ opacity: g > 0.01 ? 1 : 0 }} />
                  <text x={Math.min(lines[i]!.end[0], 540)} y={lines[i]!.end[1] - 12} style={{ opacity: g > 0.95 ? 1 : 0 }}>
                    {l.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </Show>
      );
    }
    case "list":
      return (
        <div className="ls-list">
          {item.items.map((l, i) => {
            const kind = l.style ?? item.style ?? "num";
            return (
              <Show key={i} t={t} at={l.at} out={item.out} hide={item.hide} className="is-left">
                <div className="ls-li">
                  <b className={`ls-bullet is-${kind}`}>{kind === "num" ? i + 1 : kind === "check" ? "✓" : kind === "cross" ? "✕" : ""}</b>
                  {l.text}
                </div>
              </Show>
            );
          })}
        </div>
      );
    case "steps":
      return (
        <div className="ls-steps">
          {item.items.map((s, i) => (
            <Show key={i} t={t} at={s.at} out={item.out} hide={item.hide} pop>
              <div className="ls-step">
                {i > 0 && <i className="ls-step-arrow" />}
                <div className="ls-col">
                  {s.icon ? <Svg name={s.icon} /> : <b className="ls-bullet is-num">{i + 1}</b>}
                  <span className="ls-text is-small is-ink">{s.text}</span>
                </div>
              </div>
            </Show>
          ))}
        </div>
      );
    case "split": {
      let left = 0;
      return (
        <Show {...base}>
          <div className="ls-split">
            {item.label && <span className="ls-text is-small">{item.label}</span>}
            <div className="ls-split-bar">
              {item.parts.map((p, i) => {
                const w = (p.value / item.total) * 100;
                const x = left;
                left += w;
                return (
                  <i
                    key={i}
                    className={`ls-part${toneClass(p.tone)}${i % 2 ? " is-alt" : ""}`}
                    style={style({ left: `${x}%`, width: `${w}%`, "--g": progress(t, p.at, p.at + 0.9) })}
                  />
                );
              })}
            </div>
            <div className="ls-split-legend">
              {item.parts.map((p, i) => (
                <Show key={i} t={t} at={p.at} pop>
                  <span className={`ls-chip${toneClass(p.tone)}`}>
                    {p.label} · {money(p.value, item.unit ?? " €")}
                  </span>
                </Show>
              ))}
            </div>
          </div>
        </Show>
      );
    }
    case "gauge": {
      const g = progress(t, item.at, item.until);
      const v = item.value * g;
      return (
        <Show {...base} pop>
          <div className="ls-col">
            <svg className={`ls-gauge${toneClass(item.tone)}`} viewBox="0 0 120 120" aria-hidden="true">
              <circle cx="60" cy="60" r="50" className="ls-gauge-bg" />
              <circle cx="60" cy="60" r="50" pathLength={100} style={style({ "--v": v })} className="ls-gauge-fg" />
              <text x="60" y="68">
                {Math.round(v).toLocaleString("fr-FR")} %
              </text>
            </svg>
            <span className="ls-text is-small is-ink">{item.label}</span>
          </div>
        </Show>
      );
    }
    case "compare":
      return (
        <Show {...base}>
          <div className="ls-compare">
            {[item.left, item.right].map((side, s) => (
              <div key={s} className={`ls-card is-left${s === 1 ? " is-accent" : ""}`}>
                <div className="ls-row is-tight">
                  {side.icon && <Svg name={side.icon} className="is-s" />}
                  <p className="ls-text is-mid">{side.title}</p>
                </div>
                {side.items.map((x, i) => (
                  <Show key={i} t={t} at={x.at} className="is-left">
                    <span className="ls-text is-small is-ink">· {x.text}</span>
                  </Show>
                ))}
              </div>
            ))}
          </div>
        </Show>
      );
    case "dialog":
      return (
        <div className="ls-dialog">
          {item.items.map((d, i) => (
            <Show key={i} t={t} at={d.at} out={item.out} hide={item.hide} className={d.side === "right" ? "is-right" : "is-left"}>
              <div className={`ls-row is-tight${d.side === "right" ? " is-reverse" : ""}`}>
                <div className="ls-col is-tight">
                  <Person name={d.character} small />
                  {d.name && <span className="ls-who">{d.name}</span>}
                </div>
                <div className={`ls-bubble${d.side === "right" ? " is-accent" : ""}`}>{d.text}</div>
              </div>
            </Show>
          ))}
        </div>
      );
    case "actor":
      return (
        <Show {...base} className="ls-side">
          <div className="ls-col is-tight">
            <Person name={item.character} />
            {item.name && <span className="ls-who">{item.name}</span>}
          </div>
          {item.think && (
            <Show t={t} at={item.think.at} pop className="ls-think-wrap">
              <span className="ls-think">{item.think.text}</span>
            </Show>
          )}
        </Show>
      );
    case "fly":
      return (
        <>
          {Array.from({ length: item.count ?? 1 }, (_, i) => {
            const count = item.count ?? 1;
            const span = item.until - item.at;
            const each = count > 1 ? span * 0.5 : span;
            const lag = count > 1 ? (i * (span - each)) / (count - 1) : 0;
            return (
              <i key={i} className="ls-fly" data-fly={`${item.at + lag},${item.at + lag + each}`} data-a={item.from} data-b={item.to}>
                <Coin dir={item.dir} />
              </i>
            );
          })}
        </>
      );
    case "row":
      return (
        <div className="ls-row">
          {item.items.map((x, i) => (
            <Item key={i} item={x} t={t} />
          ))}
        </div>
      );
  }
}

export function LessonScenes({ board, time, kicker }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const near = board.scenes
    .map((scene, i) => ({ scene, i }))
    .filter(({ scene }) => time >= scene.from - 1.2 && time < scene.to + 1.2);

  // Pièces qui volent et points au bout des courbes : il faut la position réelle.
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    el.querySelectorAll<HTMLElement>(".ls-scene").forEach((scene) => {
      const on = scene.classList.contains("is-on");
      const cam = scene.firstElementChild as HTMLElement;
      const camBox = cam.getBoundingClientRect();
      const k = cam.offsetWidth ? camBox.width / cam.offsetWidth : 1;
      scene.querySelectorAll<HTMLElement>("[data-fly]").forEach((fly) => {
        const [a, b] = fly.dataset.fly!.split(",").map(Number) as [number, number];
        const raw = (time - a) / (b - a);
        const host = (fly.offsetParent as HTMLElement | null)?.getBoundingClientRect();
        const A = scene.querySelector(`[data-k="${fly.dataset.a}"]`)?.getBoundingClientRect();
        const B = scene.querySelector(`[data-k="${fly.dataset.b}"]`)?.getBoundingClientRect();
        if (!on || raw <= 0 || raw >= 1 || !host || !A || !B) {
          fly.style.opacity = "0";
          return;
        }
        const p = 1 - Math.pow(1 - raw, 2);
        const ax = (A.left + A.width / 2 - host.left) / k;
        const ay = (A.top + A.height / 2 - host.top) / k;
        const bx = (B.left + B.width / 2 - host.left) / k;
        const by = (B.top + B.height / 2 - host.top) / k;
        const half = fly.offsetWidth / 2;
        const x = ax + (bx - ax) * p - half;
        const y = ay + (by - ay) * p - Math.sin(Math.PI * p) * (camBox.height / k) * 0.08 - half;
        fly.style.opacity = String(Math.min(1, raw * 6, (1 - raw) * 6));
        fly.style.transform = `translate(${x}px, ${y}px) rotate(${p * 200}deg) scale(${1 - 0.25 * p})`;
      });
      // Un personnage ne cache jamais le contenu : s'il le touche, il s'efface.
      scene.querySelectorAll<HTMLElement>(".ls-side").forEach((side) => {
        const r = side.getBoundingClientRect();
        const hit = [...cam.children].some((child) => {
          if (child === side || child.classList.contains("ls-side") || child.classList.contains("ls-fly")) return false;
          return [...child.querySelectorAll<HTMLElement>(".ls-text, .ls-card, .ls-chip, .ls-wf-row, .ls-bubble, .ls-ico, .ls-li")].some((el) => {
            const o = el.getBoundingClientRect();
            return o.width > 0 && o.left < r.right - 4 && o.right > r.left + 4 && o.top < r.bottom - 4 && o.bottom > r.top + 4;
          });
        });
        side.classList.toggle("is-crowded", hit);
      });
      scene.querySelectorAll<SVGPathElement>("path[data-path]").forEach((path) => {
        const dot = path.parentElement?.querySelector<SVGCircleElement>("circle[data-follow]");
        if (!dot) return;
        const g = Number(path.style.getPropertyValue("--g")) || 0;
        const pt = path.getPointAtLength(path.getTotalLength() * g);
        dot.setAttribute("cx", String(pt.x));
        dot.setAttribute("cy", String(pt.y));
      });
    });
  });

  return (
    <div className="ls-root" ref={root} aria-hidden="true">
      <div className="ls-kick">{kicker}</div>
      {near.map(({ scene, i }) => {
        const on = time >= scene.from - 0.05 && time < scene.to;
        const z = 1 + 0.03 * Math.max(0, Math.min(1, (time - scene.from) / (scene.to - scene.from)));
        return (
          <div key={i} className={`ls-scene${on ? " is-on" : ""}`} data-scene={i}>
            <div className="ls-cam" style={style({ "--z": z })}>
              {scene.items.map((item, j) => (
                <Item key={j} item={item} t={time} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
