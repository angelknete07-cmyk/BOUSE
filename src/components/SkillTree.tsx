import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createContext, useContext, useMemo } from "react";
import { createPortal } from "react-dom";
import type { TreeNode } from "../lib/catalogue";
import {
  TREE,
  skillTreeLayout,
  treeLinkPath,
  treePath,
} from "../lib/skillTree";

/**
 * L'arbre des compétences (idée 7 d'Angel, maquette validée le 11 novembre
 * 2026). Un aperçu dans la page, puis un grand arbre plein écran qui s'ouvre
 * depuis l'aperçu, qu'on promène au doigt ou à la souris et qu'on zoome.
 */

export type TreeStatus = "done" | "retry" | "open" | "wait" | "soon";

/** Les nœuds, leur placement et le nom des branches, calculés une fois. */
function makeModel(
  items: TreeNode[],
  laneNames: Record<string, string>,
  practiced: ReadonlySet<string>,
) {
  return {
    items,
    practiced,
    tree: skillTreeLayout(items),
    byId: new Map(items.map((item) => [item.id, item])),
    laneName: (domain: string) => laneNames[domain] ?? domain,
  };
}
type Model = ReturnType<typeof makeModel>;
const ModelContext = createContext<Model | null>(null);
function useModel() {
  const model = useContext(ModelContext)!;
  return { ...model, W: model.tree.width, H: model.tree.height };
}
const NODE_W = TREE.nodeWidth;
const NODE_H = TREE.nodeHeight;
const PHONE = "(max-width: 700px)";

const STATUS_TEXT: Record<TreeStatus, string> = {
  done: "Quiz validé",
  retry: "À reprendre",
  open: "À explorer, tu peux la faire",
  wait: "À explorer après ses prérequis",
  soon: "Bientôt, la leçon s’écrit",
};
const STATE_TEXT: Record<TreeStatus, string> = {
  done: "Validée : quiz réussi",
  retry: "À reprendre : le dernier quiz n’est pas passé",
  open: "Tu peux la faire maintenant",
  wait: "Il faut d’abord valider ce qui vient avant",
  soon: "Bientôt : la leçon s’écrit en ce moment",
};

type Props = {
  /** Les compétences des domaines choisis (catalogue). */
  items: TreeNode[];
  laneNames: Record<string, string>;
  statuses: Record<string, TreeStatus>;
  /** La leçon conseillée maintenant, si elle n'est pas déjà validée. */
  nextId: string | null;
  /** Ce qu'on choisit dans l'arbre s'affiche aussi dans la fiche de la page. */
  onSelect: (id: string) => void;
  onNavigate: (route: string) => void;
  /** Les compétences déjà utilisées dans une mission réelle. */
  practiced?: ReadonlySet<string>;
};
const NONE: ReadonlySet<string> = new Set();

function Check() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8.5l3.2 3.2L13 4.8" />
    </svg>
  );
}
function Retry() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3.5 8a4.5 4.5 0 1 0 1.4-3.3M4 2.5v2.6h2.6" />
    </svg>
  );
}

/** Le dessin, commun à l'aperçu et au plein écran. */
function TreeCanvas({
  statuses,
  nextId,
  selected,
  interactive,
  onPick,
  canvasRef,
}: {
  statuses: Record<string, TreeStatus>;
  nextId: string | null;
  selected: string | null;
  interactive: boolean;
  onPick?: (id: string) => void;
  canvasRef?: React.Ref<HTMLDivElement>;
}) {
  const { items, tree, W, H, laneName } = useModel();
  const path = selected ? treePath(items, selected) : null;
  return (
    <div
      ref={canvasRef}
      className="tr-canvas"
      data-focus={path ? "" : undefined}
      style={{ width: W, height: H }}
      role={interactive ? "group" : undefined}
      aria-label={interactive ? "Les compétences de l’arbre" : undefined}
      aria-hidden={interactive ? undefined : true}
    >
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        {tree.links.map((link) => {
          const a = tree.positions[link.from]!;
          const b = tree.positions[link.to]!;
          const both =
            statuses[link.from] === "done" && statuses[link.to] === "done";
          const onPath = !!path && path.has(link.from) && path.has(link.to);
          return (
            <g key={`${link.from}-${link.to}`}>
              <path
                className={`tr-link${link.bridge ? " tr-bridge" : ""}`}
                data-done={both ? "" : undefined}
                data-path={onPath ? "" : undefined}
                d={treeLinkPath(a, b)}
              />
              <path
                className="tr-arrow"
                data-path={onPath ? "" : undefined}
                d={`M${b.x - 7} ${b.y + NODE_H / 2 - 4}l6 4-6 4z`}
              />
            </g>
          );
        })}
      </svg>
      {tree.lanes.map((lane) => {
        const count = lane.ids.filter((id) => statuses[id] === "done").length;
        return (
          <div key={lane.domain}>
            <div
              className="tr-lane"
              style={{
                left: TREE.padX - 18,
                top: lane.top,
                width: W - 2 * TREE.padX + 36,
                height: lane.height,
              }}
            />
            <div
              className="tr-lane-name"
              style={{ left: TREE.padX, top: lane.top + 18 }}
            >
              <strong>{laneName(lane.domain)}</strong>
              <span>
                {count} / {lane.ids.length} validées
              </span>
            </div>
          </div>
        );
      })}
      {tree.links
        .filter((link) => link.bridge)
        .map((link) => {
          const a = tree.positions[link.from]!;
          const b = tree.positions[link.to]!;
          return (
            <span
              key={`tag-${link.from}-${link.to}`}
              className="tr-bridge-tag"
              style={{
                left: (a.x + NODE_W + b.x) / 2,
                top: (a.y + b.y) / 2 + NODE_H / 2,
              }}
            >
              passerelle
            </span>
          );
        })}
      {items.map((lesson) => {
        const point = tree.positions[lesson.id];
        if (!point) return null;
        const status = statuses[lesson.id] ?? "wait";
        const label = lesson.label;
        const next = lesson.id === nextId;
        return (
          <button
            key={lesson.id}
            type="button"
            className="tr-node"
            data-id={lesson.id}
            data-s={status}
            data-next={next ? "" : undefined}
            data-path={path?.has(lesson.id) ? "" : undefined}
            tabIndex={interactive ? undefined : -1}
            aria-pressed={interactive ? selected === lesson.id : undefined}
            aria-label={`${label} · ${STATUS_TEXT[status]}${next ? " · à faire maintenant" : ""}`}
            title={lesson.title}
            style={{ left: point.x, top: point.y }}
            onClick={onPick ? () => onPick(lesson.id) : undefined}
          >
            {next && (
              <span className="tr-tag" aria-hidden="true">
                À faire maintenant
              </span>
            )}
            <span className="tr-dot" aria-hidden="true">
              {status === "done" ? (
                <Check />
              ) : status === "retry" ? (
                <Retry />
              ) : null}
            </span>
            <span className="tr-label" aria-hidden="true">
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

type Opening = { nodeId: string | null; lane: string | null };

export function SkillTree({
  items,
  laneNames,
  practiced = NONE,
  ...rest
}: Props) {
  const model = useMemo(
    () => makeModel(items, laneNames, practiced),
    [items, laneNames, practiced],
  );
  return (
    <ModelContext.Provider value={model}>
      <InlineTree {...rest} />
    </ModelContext.Provider>
  );
}

function InlineTree({
  statuses,
  nextId,
  onSelect,
  onNavigate,
}: Omit<Props, "items" | "laneNames">) {
  const model = useModel();
  const { tree, W, items, laneName } = model;
  const frameRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const [scale, setScale] = useState(0.6);
  const [opening, setOpening] = useState<Opening | null>(null);
  const done = Object.values(statuses).filter((s) => s === "done").length;

  // L'aperçu montre l'arbre à la largeur de la page.
  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const fit = () => setScale(Math.min(1, (frame.clientWidth - 8) / W));
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [W]);

  // À la fermeture, le clavier revient sur « Agrandir l'arbre » (une fois la
  // page redevenue active).
  const wasOpen = useRef(false);
  useEffect(() => {
    if (opening) wasOpen.current = true;
    else if (wasOpen.current) {
      wasOpen.current = false;
      ctaRef.current?.focus({ preventScroll: true });
    }
  }, [opening]);

  const open = (nodeId: string | null, lane: string | null = null) =>
    setOpening({ nodeId, lane });

  return (
    <div className="tr-inline">
      <div className="tr-head">
        <p>
          Chaque branche part des bases. Un trait relie une compétence à celle
          qu’il faut savoir avant. {done} sur {items.length} validées.
        </p>
        <ul className="tr-legend" aria-label="Légende">
          <li>
            <i data-s="done" /> Validée
          </li>
          <li>
            <i data-s="retry" /> À reprendre
          </li>
          <li>
            <i data-s="open" /> Tu peux la faire
          </li>
          <li>
            <i data-s="wait" /> Il faut d’abord la précédente
          </li>
          <li>
            <i data-s="soon" /> Bientôt
          </li>
        </ul>
      </div>
      <ul className="tr-branches" aria-label="Les branches de l’arbre">
        {tree.lanes.map((lane) => {
          const count = lane.ids.filter((id) => statuses[id] === "done").length;
          return (
            <li key={lane.domain}>
              <button type="button" onClick={() => open(null, lane.domain)}>
                <strong>{laneName(lane.domain)}</strong>
                <span>
                  {count} / {lane.ids.length}
                  <span className="sr-only"> validées</span>
                </span>
                <span
                  className="tr-bar"
                  style={
                    {
                      "--p": `${(count / lane.ids.length) * 100}%`,
                    } as CSSProperties
                  }
                  aria-hidden="true"
                >
                  <span />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div
        ref={frameRef}
        className="tr-frame"
        data-hidden={opening ? "" : undefined}
        onClick={(event) => {
          if ((event.target as HTMLElement).closest(".tr-cta")) return;
          const node = (event.target as HTMLElement).closest<HTMLElement>(
            ".tr-node",
          );
          open(node?.dataset.id ?? null);
        }}
      >
        <div
          className="tr-fit"
          style={{ transform: `translate(4px, 6px) scale(${scale})` }}
        >
          <TreeCanvas
            statuses={statuses}
            nextId={nextId}
            selected={null}
            interactive={false}
          />
        </div>
        <button
          ref={ctaRef}
          type="button"
          className="tr-cta"
          onClick={() => open(null)}
        >
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M9.5 2.5h4v4M6.5 13.5h-4v-4M13.5 2.5 9 7M2.5 13.5 7 9" />
          </svg>
          Agrandir l’arbre
        </button>
      </div>
      {opening &&
        createPortal(
          <ModelContext.Provider value={model}>
            <FullTree
              opening={opening}
              statuses={statuses}
              nextId={nextId}
              done={done}
              frame={frameRef.current}
              scale={scale}
              onSelect={onSelect}
              onNavigate={onNavigate}
              onClosed={() => setOpening(null)}
            />
          </ModelContext.Provider>,
          document.body,
        )}
    </div>
  );
}

function FullTree({
  opening,
  statuses,
  nextId,
  done,
  frame,
  scale,
  onSelect,
  onNavigate,
  onClosed,
}: {
  opening: Opening;
  statuses: Record<string, TreeStatus>;
  nextId: string | null;
  done: number;
  frame: HTMLElement | null;
  scale: number;
  onSelect: (id: string) => void;
  onNavigate: (route: string) => void;
  onClosed: () => void;
}) {
  const { items, tree, byId, W, H, laneName, practiced } = useModel();
  const rootRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const zoomRef = useRef<HTMLOutputElement>(null);
  const view = useRef({ tx: 0, ty: 0, k: 1, timer: 0 });
  const closing = useRef(false);
  const [selected, setSelected] = useState<string | null>(opening.nodeId);
  const [on, setOn] = useState(false);
  const [ready, setReady] = useState(false);
  const [moved, setMoved] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [phone] = useState(() => matchMedia(PHONE).matches);
  const selectedRef = useRef(selected);
  selectedRef.current = selected;

  const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const apply = useCallback((fly: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const v = view.current;
    window.clearTimeout(v.timer);
    if (fly && !reduce()) {
      canvas.dataset.fly = "";
      v.timer = window.setTimeout(() => delete canvas.dataset.fly, 600);
    } else delete canvas.dataset.fly;
    canvas.style.transform = `translate(${v.tx}px, ${v.ty}px) scale(${v.k})`;
    if (zoomRef.current) zoomRef.current.value = `${Math.round(v.k * 100)} %`;
  }, []);
  const clampK = (k: number) => Math.min(1.8, Math.max(0.3, k));
  const zoomAt = useCallback(
    (factor: number, cx: number, cy: number, fly: boolean) => {
      const v = view.current;
      const k = clampK(v.k * factor);
      v.tx = cx - ((cx - v.tx) * k) / v.k;
      v.ty = cy - ((cy - v.ty) * k) / v.k;
      v.k = k;
      apply(fly);
    },
    [apply],
  );
  const panelWidth = (withPanel: boolean) =>
    innerWidth > 700 && withPanel ? 346 : 0;
  const centerOn = useCallback(
    (id: string, k: number | null, withPanel: boolean) => {
      const point = tree.positions[id]!;
      const v = view.current;
      v.k = k ?? v.k;
      const sheet = innerWidth <= 700 && withPanel ? innerHeight * 0.3 : 0;
      v.tx =
        (innerWidth - panelWidth(withPanel)) / 2 - (point.x + NODE_W / 2) * v.k;
      v.ty = (innerHeight - sheet) / 2 - (point.y + NODE_H / 2) * v.k;
      apply(true);
    },
    [apply],
  );
  const fitAll = useCallback(() => {
    const v = view.current;
    v.k = clampK(Math.min((innerWidth - 40) / W, (innerHeight - 150) / H));
    v.tx = (innerWidth - W * v.k) / 2;
    v.ty = 96 + (innerHeight - 120 - H * v.k) / 2;
    apply(true);
  }, [apply]);
  // La branche au milieu de l'écran, sous la barre d'outils.
  const showLane = useCallback(
    (domain: string, nearId?: string) => {
      const lane = tree.lanes.find((item) => item.domain === domain);
      if (!lane) return;
      const v = view.current;
      const small = innerWidth <= 700;
      v.k = small
        ? nearId
          ? 0.7
          : 0.62
        : clampK(Math.min(1, (innerWidth - 80) / W));
      v.tx = small
        ? nearId
          ? 4 - Math.max(0, tree.positions[nearId]!.x - TREE.column - 8) * v.k
          : 12
        : (innerWidth - W * v.k) / 2;
      const top = small ? 150 : 104;
      const room = innerHeight - top - (small ? 120 : 70);
      v.ty = top - lane.top * v.k + Math.max(0, (room - lane.height * v.k) / 2);
      apply(true);
    },
    [apply],
  );

  const pick = useCallback(
    (id: string | null, fly = true) => {
      setSelected(id);
      if (!id) return;
      onSelect(id);
      if (fly)
        requestAnimationFrame(() =>
          centerOn(
            id,
            Math.max(view.current.k, innerWidth <= 700 ? 0.9 : 0.85),
            true,
          ),
        );
    },
    [centerOn, onSelect],
  );

  const close = useCallback(
    (then?: () => void) => {
      if (closing.current) return;
      closing.current = true;
      setReady(false);
      setSelected(null);
      const v = view.current;
      if (frame) {
        const rect = frame.getBoundingClientRect();
        v.tx = rect.left + 4;
        v.ty = rect.top + 6;
        v.k = scale;
      }
      apply(true);
      const quick = reduce();
      window.setTimeout(() => setOn(false), quick ? 0 : 260);
      window.setTimeout(
        () => {
          onClosed();
          then?.();
        },
        quick ? 10 : 600,
      );
    },
    [apply, frame, onClosed, scale],
  );

  // Ouverture : le dessin part exactement d'où il est dans la page (FLIP).
  useLayoutEffect(() => {
    const v = view.current;
    const source = frame?.querySelector(".tr-canvas")?.getBoundingClientRect();
    v.tx = source?.left ?? 0;
    v.ty = source?.top ?? 0;
    v.k = scale;
    apply(false);
    const root = document.getElementById("root");
    const previousOverflow = document.body.style.overflow;
    if (root) root.inert = true;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    let readyTimer = 0;
    const raf = requestAnimationFrame(() => {
      setOn(true);
      if (opening.nodeId) centerOn(opening.nodeId, phone ? 0.95 : 1, false);
      else if (opening.lane) showLane(opening.lane);
      else if (nextId) showLane(byId.get(nextId)!.domain, nextId);
      else fitAll();
      readyTimer = window.setTimeout(
        () => {
          setReady(true);
          if (opening.nodeId) {
            onSelect(opening.nodeId);
            centerOn(opening.nodeId, null, true);
          }
        },
        reduce() ? 0 : 380,
      );
    });
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(readyTimer);
      window.clearTimeout(view.current.timer);
      if (root) root.inert = false;
      document.body.style.overflow = previousOverflow;
    };
    // L'ouverture ne se joue qu'une fois.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Glisser (souris, doigt), pincer (deux doigts), molette.
  useEffect(() => {
    const element = viewRef.current;
    if (!element) return;
    const points = new Map<number, { x: number; y: number }>();
    let last: { x: number; y: number } | null = null;
    let travel = 0;
    let pinch: { d: number; k: number } | null = null;
    let swallowClick = false;
    const down = (event: PointerEvent) => {
      points.set(event.pointerId, { x: event.clientX, y: event.clientY });
      last = { x: event.clientX, y: event.clientY };
      travel = 0;
      if (points.size === 2) {
        const [a, b] = [...points.values()] as [
          { x: number; y: number },
          { x: number; y: number },
        ];
        pinch = { d: Math.hypot(a.x - b.x, a.y - b.y) || 1, k: view.current.k };
      }
    };
    const move = (event: PointerEvent) => {
      if (!points.has(event.pointerId) || !last) return;
      points.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (points.size === 2 && pinch) {
        const [a, b] = [...points.values()] as [
          { x: number; y: number },
          { x: number; y: number },
        ];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        zoomAt(
          (pinch.k * d) / pinch.d / view.current.k,
          (a.x + b.x) / 2,
          (a.y + b.y) / 2,
          false,
        );
        travel = 99;
        swallowClick = true;
        return;
      }
      const dx = event.clientX - last.x;
      const dy = event.clientY - last.y;
      travel += Math.abs(dx) + Math.abs(dy);
      last = { x: event.clientX, y: event.clientY };
      // Un vrai glissé seulement après quelques pixels : un clic reste un clic.
      if (travel <= 4) return;
      if (!element.hasPointerCapture(event.pointerId))
        element.setPointerCapture(event.pointerId);
      swallowClick = true;
      setDragging(true);
      setMoved(true);
      view.current.tx += dx;
      view.current.ty += dy;
      apply(false);
    };
    const up = (event: PointerEvent) => {
      points.delete(event.pointerId);
      if (points.size < 2) pinch = null;
      if (points.size === 1) last = [...points.values()][0]!;
      if (!points.size) {
        setDragging(false);
        // Le clic qui suit un glissé ne choisit rien.
        if (swallowClick) window.setTimeout(() => (swallowClick = false), 0);
      }
    };
    const click = (event: MouseEvent) => {
      if (swallowClick) {
        event.stopPropagation();
        event.preventDefault();
        swallowClick = false;
        return;
      }
      if (
        !(event.target as HTMLElement).closest(".tr-node") &&
        selectedRef.current
      )
        setSelected(null);
    };
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      setMoved(true);
      if (event.ctrlKey || event.metaKey)
        zoomAt(
          Math.exp(-event.deltaY * 0.01),
          event.clientX,
          event.clientY,
          false,
        );
      else {
        view.current.tx -= event.deltaX;
        view.current.ty -= event.deltaY;
        apply(false);
      }
    };
    element.addEventListener("pointerdown", down);
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerup", up);
    element.addEventListener("pointercancel", up);
    element.addEventListener("click", click, true);
    element.addEventListener("wheel", wheel, { passive: false });
    return () => {
      element.removeEventListener("pointerdown", down);
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerup", up);
      element.removeEventListener("pointercancel", up);
      element.removeEventListener("click", click, true);
      element.removeEventListener("wheel", wheel);
    };
  }, [apply, zoomAt]);

  // Le clavier partout dans la fenêtre : Échap, + et −, les flèches.
  const keys = useRef<(event: KeyboardEvent) => void>(() => {});
  keys.current = (event: KeyboardEvent) => {
    const cx = innerWidth / 2;
    const cy = innerHeight / 2;
    if (event.key === "Escape") {
      event.stopPropagation();
      if (selectedRef.current) setSelected(null);
      else close();
    } else if (event.key === "+" || event.key === "=")
      zoomAt(1.2, cx, cy, true);
    else if (event.key === "-") zoomAt(1 / 1.2, cx, cy, true);
    else if (
      event.key.startsWith("Arrow") &&
      !(event.target as HTMLElement).closest(".tr-node, .tr-chips, .tr-rel")
    ) {
      event.preventDefault();
      const step = 60;
      view.current.tx +=
        event.key === "ArrowLeft"
          ? step
          : event.key === "ArrowRight"
            ? -step
            : 0;
      view.current.ty +=
        event.key === "ArrowUp" ? step : event.key === "ArrowDown" ? -step : 0;
      apply(true);
    }
  };
  useEffect(() => {
    const listen = (event: KeyboardEvent) => keys.current(event);
    window.addEventListener("keydown", listen);
    return () => window.removeEventListener("keydown", listen);
  }, []);

  const lesson = selected ? byId.get(selected) : undefined;
  const status = selected ? (statuses[selected] ?? "wait") : "wait";
  const before = lesson
    ? lesson.prerequisites.flatMap((id) => byId.get(id) ?? [])
    : [];
  const after = lesson
    ? items.filter((item) => item.prerequisites.includes(lesson.id))
    : [];
  const chip = (item: TreeNode) => (
    <button
      type="button"
      key={item.id}
      data-s={statuses[item.id]}
      onClick={() => pick(item.id)}
    >
      {item.label}
    </button>
  );

  return (
    <div
      ref={rootRef}
      className="tr-full"
      data-on={on ? "" : undefined}
      data-ready={ready ? "" : undefined}
      data-moved={moved ? "" : undefined}
      data-panel={lesson && ready ? "" : undefined}
      role="dialog"
      aria-modal="true"
      aria-label="L’arbre de tes compétences"
    >
      <div
        ref={viewRef}
        className="tr-view"
        data-drag={dragging ? "" : undefined}
        onFocus={(event) => {
          // Une leçon atteinte au clavier vient se montrer à l'écran.
          const node = (event.target as HTMLElement).closest<HTMLElement>(
            ".tr-node",
          );
          if (!node?.dataset.id) return;
          const rect = node.getBoundingClientRect();
          const right = innerWidth - panelWidth(!!selectedRef.current) - 20;
          if (
            rect.left < 20 ||
            rect.right > right ||
            rect.top < 110 ||
            rect.bottom > innerHeight - 80
          )
            centerOn(node.dataset.id, null, !!selectedRef.current);
        }}
      >
        <TreeCanvas
          canvasRef={canvasRef}
          statuses={statuses}
          nextId={nextId}
          selected={selected}
          interactive
          onPick={(id) => pick(id)}
        />
      </div>
      <div className="tr-scrim" aria-hidden="true" />
      <div className="tr-top">
        <div className="tr-title">
          <h2>L’arbre de tes compétences</h2>
          <span>
            {done} sur {items.length} validées · glisse pour te déplacer
          </span>
        </div>
        <div className="tr-chips" role="group" aria-label="Aller à une branche">
          {tree.lanes.map((lane) => (
            <button
              type="button"
              key={lane.domain}
              onClick={() => {
                setSelected(null);
                showLane(lane.domain);
              }}
            >
              {laneName(lane.domain)}
            </button>
          ))}
        </div>
        <button
          ref={closeRef}
          type="button"
          className="tr-icon tr-close"
          aria-label="Fermer l’arbre"
          onClick={() => close()}
        >
          ×
        </button>
      </div>
      <div className="tr-zoom" role="group" aria-label="Zoom">
        <button
          type="button"
          aria-label="Dézoomer"
          onClick={() => zoomAt(0.8, innerWidth / 2, innerHeight / 2, true)}
        >
          −
        </button>
        <output ref={zoomRef} aria-live="off">
          100 %
        </output>
        <button
          type="button"
          aria-label="Zoomer"
          onClick={() => zoomAt(1.25, innerWidth / 2, innerHeight / 2, true)}
        >
          +
        </button>
        <button
          type="button"
          onClick={() => {
            setSelected(null);
            fitAll();
          }}
        >
          Tout voir
        </button>
      </div>
      <p className="tr-hint" aria-hidden="true">
        {phone
          ? "Glisse pour te promener · pince pour zoomer"
          : "Glisse pour te promener · pince ou molette pour zoomer · touche une leçon"}
      </p>
      <aside
        className="tr-panel"
        aria-label="La leçon choisie"
        aria-hidden={lesson && ready ? undefined : true}
        inert={!(lesson && ready)}
      >
        {lesson && (
          <div key={lesson.id} className="tr-panel-content">
            <button
              type="button"
              className="tr-icon tr-panel-x"
              aria-label="Fermer la fiche"
              onClick={() => setSelected(null)}
            >
              ×
            </button>
            <p className="tr-kicker">
              {laneName(lesson.domain)} · {lesson.minutes} min
            </p>
            <h3>{lesson.title}</h3>
            <p className="tr-state" data-s={status}>
              <i aria-hidden="true" />
              {STATE_TEXT[status]}
            </p>
            {practiced.has(lesson.id) && (
              <p className="tr-sum">
                Mise en pratique dans une mission réelle.
              </p>
            )}
            <p className="tr-sum">{lesson.summary}</p>
            {!lesson.lesson && lesson.gesture && (
              <p className="tr-sum">Tu repars avec : {lesson.gesture}.</p>
            )}
            {before.length ? (
              <div className="tr-rel">
                <span>Il faut savoir avant</span>
                <div>{before.map(chip)}</div>
              </div>
            ) : (
              <div className="tr-rel">
                <span>C’est une base : rien à savoir avant.</span>
              </div>
            )}
            {after.length > 0 && (
              <div className="tr-rel">
                <span>Ça ouvre ensuite</span>
                <div>{after.map(chip)}</div>
              </div>
            )}
            <button
              type="button"
              className="tr-go"
              onClick={() => {
                const target = lesson.lesson
                  ? `lesson/${lesson.lesson}`
                  : `skill/${lesson.id}`;
                close(() => onNavigate(target));
              }}
            >
              {status === "soon"
                ? "Voir la compétence"
                : status === "done"
                  ? "Revoir la leçon"
                  : status === "retry"
                    ? "Réviser la leçon"
                    : "Ouvrir la leçon"}{" "}
              →
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
