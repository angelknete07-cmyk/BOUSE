import { useId, useMemo } from "react";
import { lessons } from "../data/lessons";
import {
  glossaryFor,
  linkGlossary,
  type GlossarySegment,
} from "../lib/glossaryLinks";
import { Icon } from "./Icon";

/**
 * A paragraph whose finance terms open a short definition in place, with a way
 * to the full lexique. Reading is never interrupted by a page change.
 */
export function GlossaryText({
  text,
  lesson,
  onNavigate,
}: {
  text: string;
  lesson: { id: string; prerequisites: string[] };
  onNavigate: (route: string) => void;
}) {
  const terms = useMemo(() => glossaryFor(lesson), [lesson]);
  const segments = useMemo(() => linkGlossary(text, terms), [text, terms]);
  return (
    <>
      {segments.map((segment, index) =>
        typeof segment === "string" ? (
          segment
        ) : (
          <GlossaryTerm
            key={index}
            segment={segment}
            currentLessonId={lesson.id}
            onNavigate={onNavigate}
          />
        ),
      )}
    </>
  );
}

function GlossaryTerm({
  segment,
  currentLessonId,
  onNavigate,
}: {
  segment: Exclude<GlossarySegment, string>;
  currentLessonId: string;
  onNavigate: (route: string) => void;
}) {
  const id = `terme-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const { entry } = segment;
  const source = lessons.find((item) => item.id === entry.lessonId);
  return (
    <>
      <button
        type="button"
        className="glossary-inline-term"
        popoverTarget={id}
        aria-label={`${segment.text} : voir la définition`}
      >
        {segment.text}
      </button>
      <span
        id={id}
        popover="auto"
        role="dialog"
        aria-label={`Définition : ${entry.term}`}
        className="glossary-popover"
      >
        <span className="glossary-popover-head">
          <strong>{entry.term}</strong>
          <small>{entry.category}</small>
        </span>
        <span className="glossary-popover-body">{entry.definition}</span>
        <span className="glossary-popover-actions">
          <button
            type="button"
            className="text-button"
            onClick={() => onNavigate(`lexique/${entry.id}`)}
          >
            Ouvrir dans le lexique <Icon name="arrow" size={14} />
          </button>
          {source && source.id !== currentLessonId && (
            <button
              type="button"
              className="text-button"
              onClick={() => onNavigate(`lesson/${source.id}`)}
            >
              Leçon : {source.title}
            </button>
          )}
          <button
            type="button"
            className="text-button"
            popoverTarget={id}
            popoverTargetAction="hide"
          >
            Fermer
          </button>
        </span>
      </span>
    </>
  );
}
