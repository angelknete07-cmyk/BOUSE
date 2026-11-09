import {
  createContext,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { glossary, type GlossaryTerm } from "../data/investingGlossary";
import { simpleDefinitions } from "../data/glossarySimple";
import { lessons } from "../data/lessons";
import {
  closeBubbles,
  glossaryFor,
  glossaryForDefinition,
  linkGlossary,
  openBubble,
  placeBubble,
  pruneHovered,
  type BubbleItem,
  type GlossarySegment,
} from "../lib/glossaryLinks";
import { Icon } from "./Icon";

/*
 * Definition bubbles, as on Wikipedia: a term in a lesson opens a short
 * definition in place (click, tap, Enter; hover on a computer). A term inside
 * a definition opens its own bubble on top, and so on, with a way back. All
 * bubbles of the page share one stack, so opening a term elsewhere closes the
 * others.
 */

let stack: BubbleItem[] = [];
const listeners = new Set<() => void>();
const anchors = new Map<string, HTMLElement>();
let pruneTimer: number | undefined;

function setStack(next: BubbleItem[]) {
  if (next === stack) return;
  stack = next;
  listeners.forEach((listener) => listener());
  if (stack.length) installListeners();
  else removeListeners();
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const useBubbles = () =>
  useSyncExternalStore(
    subscribe,
    () => stack,
    () => stack,
  );

/** Closes the bubble at `depth` (and deeper) and gives focus back to its term. */
function closeAt(depth: number, returnFocus: boolean) {
  const item = stack[depth];
  setStack(closeBubbles(stack, depth));
  if (returnFocus && item)
    anchors.get(item.key)?.focus({ preventScroll: true });
}

/** Depth the pointer or focus rests at: -1 outside every bubble and term. */
function depthOf(target: EventTarget | null) {
  if (!(target instanceof Element)) return -1;
  const bubble = target.closest<HTMLElement>("[data-glossary-bubble]");
  if (bubble) return Number(bubble.dataset.glossaryBubble);
  const term = target.closest<HTMLElement>("[data-glossary-term]");
  if (!term) return -1;
  const depth = Number(term.dataset.glossaryTerm);
  return stack[depth]?.key === term.dataset.glossaryKey ? depth : depth - 1;
}

const insideGlossary = (target: EventTarget | null) =>
  target instanceof Element &&
  !!target.closest("[data-glossary-bubble], [data-glossary-term]");

function onKeyDown(event: KeyboardEvent) {
  if (event.key !== "Escape" || !stack.length) return;
  event.preventDefault();
  event.stopPropagation();
  closeAt(stack.length - 1, true);
}
function onPointerDown(event: PointerEvent) {
  if (!insideGlossary(event.target)) setStack([]);
}
function onFocusIn(event: FocusEvent) {
  if (!insideGlossary(event.target)) setStack([]);
}
function onPointerOver(event: PointerEvent) {
  if (event.pointerType !== "mouse") return;
  const depth = depthOf(event.target);
  window.clearTimeout(pruneTimer);
  if (pruneHovered(stack, depth) === stack) return;
  pruneTimer = window.setTimeout(
    () => setStack(pruneHovered(stack, depth)),
    260,
  );
}

let installed = false;
function installListeners() {
  if (installed) return;
  installed = true;
  document.addEventListener("keydown", onKeyDown, true);
  document.addEventListener("pointerdown", onPointerDown, true);
  document.addEventListener("focusin", onFocusIn);
  document.addEventListener("pointerover", onPointerOver);
}
function removeListeners() {
  if (!installed) return;
  installed = false;
  window.clearTimeout(pruneTimer);
  document.removeEventListener("keydown", onKeyDown, true);
  document.removeEventListener("pointerdown", onPointerDown, true);
  document.removeEventListener("focusin", onFocusIn);
  document.removeEventListener("pointerover", onPointerOver);
}

const canHover = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(hover: hover) and (pointer: fine)").matches;

type Lesson = { id: string; prerequisites: string[] };
const GlossaryLesson = createContext<{
  lesson: Lesson;
  onNavigate: (route: string) => void;
} | null>(null);
/** Depth at which a term found here opens its bubble. */
const BubbleDepth = createContext(0);

const prerequisitesOf = (lessonId: string) =>
  lessons.find((item) => item.id === lessonId)?.prerequisites ?? [];

/**
 * A paragraph whose terms open a short definition in place, with a way to the
 * full lexique. Reading is never interrupted by a page change.
 */
export function GlossaryText({
  text,
  lesson,
  onNavigate,
}: {
  text: string;
  lesson: Lesson;
  onNavigate: (route: string) => void;
}) {
  const terms = useMemo(() => glossaryFor(lesson), [lesson]);
  const segments = useMemo(() => linkGlossary(text, terms), [text, terms]);
  const value = useMemo(() => ({ lesson, onNavigate }), [lesson, onNavigate]);
  return (
    <GlossaryLesson.Provider value={value}>
      <LinkedText segments={segments} />
    </GlossaryLesson.Provider>
  );
}

function LinkedText({ segments }: { segments: GlossarySegment[] }) {
  // An elided article (« l’ », « d’ ») stays glued to the term it introduces.
  const parts: ReactNode[] = [];
  segments.forEach((segment, index) => {
    if (typeof segment === "string") {
      parts.push(segment);
      return;
    }
    const previous = parts[parts.length - 1];
    const elision =
      typeof previous === "string" ? /(\p{L}{1,3}’)$/u.exec(previous) : null;
    if (elision && typeof previous === "string")
      parts[parts.length - 1] = previous.slice(0, -elision[1]!.length);
    const term = <GlossaryTermButton segment={segment} />;
    parts.push(
      elision ? (
        <span key={index} className="glossary-nowrap">
          {elision[1]}
          {term}
        </span>
      ) : (
        <Fragment key={index}>{term}</Fragment>
      ),
    );
  });
  return <>{parts}</>;
}

function GlossaryTermButton({
  segment,
}: {
  segment: Exclude<GlossarySegment, string>;
}) {
  const depth = useContext(BubbleDepth);
  const key = useId();
  const bubbleId = `bulle-${key.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const bubbles = useBubbles();
  const open = bubbles[depth]?.key === key;
  const hoverTimer = useRef<number | undefined>(undefined);
  const [focusOnOpen, setFocusOnOpen] = useState(false);
  const { entry } = segment;

  const register = useCallback(
    (node: HTMLButtonElement | null) => {
      if (node) anchors.set(key, node);
      else anchors.delete(key);
    },
    [key],
  );
  // A term that leaves the page (route change) takes its bubbles with it.
  useEffect(
    () => () => {
      window.clearTimeout(hoverTimer.current);
      if (stack[depth]?.key === key) setStack(closeBubbles(stack, depth));
    },
    [depth, key],
  );

  return (
    <>
      <button
        ref={register}
        type="button"
        className="glossary-inline-term"
        data-glossary-term={depth}
        data-glossary-key={key}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? bubbleId : undefined}
        aria-label={`${segment.text} : voir la définition`}
        onClick={() => {
          window.clearTimeout(hoverTimer.current);
          if (open && stack[depth]!.pinned) {
            setStack(closeBubbles(stack, depth));
            return;
          }
          setFocusOnOpen(true);
          setStack(
            openBubble(stack, depth, { key, entryId: entry.id, pinned: true }),
          );
        }}
        onPointerEnter={(event) => {
          if (event.pointerType !== "mouse" || !canHover()) return;
          // A bubble the reader chose to keep open is not replaced by a hover.
          if (stack.slice(depth).some((item) => item.pinned)) return;
          hoverTimer.current = window.setTimeout(() => {
            if (stack[depth]?.key === key) return;
            setFocusOnOpen(false);
            setStack(
              openBubble(stack, depth, {
                key,
                entryId: entry.id,
                pinned: false,
              }),
            );
          }, 320);
        }}
        onPointerLeave={() => window.clearTimeout(hoverTimer.current)}
      >
        {segment.text}
      </button>
      {open && (
        <GlossaryBubble
          id={bubbleId}
          depth={depth}
          entry={entry}
          anchorKey={key}
          focusOnOpen={focusOnOpen}
        />
      )}
    </>
  );
}

const entryById = new Map(glossary.map((entry) => [entry.id, entry]));

function GlossaryBubble({
  id,
  depth,
  entry,
  anchorKey,
  focusOnOpen,
}: {
  id: string;
  depth: number;
  entry: GlossaryTerm;
  anchorKey: string;
  focusOnOpen: boolean;
}) {
  const context = useContext(GlossaryLesson)!;
  const { lesson, onNavigate } = context;
  const ref = useRef<HTMLSpanElement>(null);
  const [precise, setPrecise] = useState(false);
  const bubbles = useBubbles();
  const covered = bubbles.length > depth + 1;
  const parent = depth > 0 ? entryById.get(bubbles[depth - 1]!.entryId) : null;
  const simple = simpleDefinitions[entry.id];
  const source = lessons.find((item) => item.id === entry.lessonId);
  const terms = useMemo(
    () => glossaryForDefinition(entry, lesson, prerequisitesOf),
    [entry, lesson],
  );
  const lead = useMemo(
    () => linkGlossary(simple ?? entry.definition, terms),
    [simple, entry.definition, terms],
  );
  const detail = useMemo(
    () => (simple ? linkGlossary(entry.definition, terms) : null),
    [simple, entry.definition, terms],
  );

  const place = useCallback(() => {
    const bubble = ref.current;
    const anchor = anchors.get(anchorKey);
    if (!bubble || !anchor) return;
    const rect = anchor.getClientRects()[0] ?? anchor.getBoundingClientRect();
    const dock = document.querySelector(".mobile-bottom-nav");
    const dockTop =
      dock && getComputedStyle(dock).display !== "none"
        ? dock.getBoundingClientRect().top
        : window.innerHeight;
    bubble.style.maxHeight = "none";
    const spot = placeBubble({
      anchor: rect,
      bubble: { width: 360, height: bubble.scrollHeight },
      viewport: {
        width: document.documentElement.clientWidth,
        height: window.innerHeight,
      },
      bottom: Math.min(dockTop, window.innerHeight),
    });
    Object.assign(bubble.style, {
      top: `${spot.top}px`,
      left: `${spot.left}px`,
      width: `${spot.width}px`,
      maxHeight: `${spot.maxHeight}px`,
    });
    bubble.style.setProperty("--bubble-arrow", `${spot.arrow}px`);
    bubble.dataset.side = spot.side;
  }, [anchorKey]);

  useLayoutEffect(() => {
    const bubble = ref.current;
    if (!bubble) return;
    try {
      bubble.showPopover?.();
    } catch {
      /* already shown */
    }
    place();
    if (focusOnOpen) bubble.focus({ preventScroll: true });
    let frame = 0;
    const follow = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(place);
    };
    window.addEventListener("scroll", follow, { capture: true, passive: true });
    window.addEventListener("resize", follow);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", follow, { capture: true });
      window.removeEventListener("resize", follow);
    };
    // Focus is only moved when the bubble first opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [place]);
  // Showing the precise definition changes the height.
  useLayoutEffect(place, [place, precise]);

  return (
    <span
      ref={ref}
      id={id}
      popover="manual"
      role="dialog"
      aria-labelledby={`${id}-titre`}
      tabIndex={-1}
      className="glossary-bubble"
      data-glossary-bubble={depth}
      data-covered={covered || undefined}
      data-depth={depth}
    >
      {parent && (
        <button
          type="button"
          className="glossary-bubble-back"
          onClick={() => closeAt(depth, true)}
        >
          <Icon name="arrow" size={14} />
          <span>
            Retour : <b>{parent.term}</b>
          </span>
        </button>
      )}
      <span className="glossary-bubble-head">
        <span>
          <strong id={`${id}-titre`}>{entry.term}</strong>
          <small>{entry.category}</small>
        </span>
        <button
          type="button"
          className="glossary-bubble-close"
          aria-label={`Fermer la définition : ${entry.term}`}
          onClick={() => closeAt(depth, true)}
        >
          <Icon name="close" size={16} />
        </button>
      </span>
      <BubbleDepth.Provider value={depth + 1}>
        <span className="glossary-bubble-body">
          <LinkedText segments={lead} />
        </span>
        {detail && (
          <>
            <button
              type="button"
              className="glossary-bubble-more"
              aria-expanded={precise}
              aria-controls={`${id}-precis`}
              onClick={() => setPrecise((value) => !value)}
            >
              {precise ? "Masquer la définition précise" : "Plus précis"}
              <Icon name="arrow" size={13} />
            </button>
            {precise && (
              <span id={`${id}-precis`} className="glossary-bubble-precise">
                <LinkedText segments={detail} />
              </span>
            )}
          </>
        )}
      </BubbleDepth.Provider>
      <span className="glossary-bubble-actions">
        <button
          type="button"
          className="text-button"
          onClick={() => {
            setStack([]);
            onNavigate(`lexique/${entry.id}`);
          }}
        >
          Ouvrir dans le lexique <Icon name="arrow" size={14} />
        </button>
        {source && source.id !== lesson.id && (
          <button
            type="button"
            className="text-button"
            onClick={() => {
              setStack([]);
              onNavigate(`lesson/${source.id}`);
            }}
          >
            Leçon : {source.title}
          </button>
        )}
      </span>
    </span>
  );
}
