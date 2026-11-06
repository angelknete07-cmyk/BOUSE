import { domains, type Domain } from "../data/domains.ts";

type Placeable = { id: string; domain: Domain };
export type Point = { x: number; y: number };

/** Horizontal room kept for one notion and its two-line label, in pixels. */
export const ATLAS_STEP = 120;
const ATLAS_MARGIN = 80;
/** Vertical centre of each domain lane in the atlas, in percent. */
const LANE_CENTRES = [9, 27, 47, 68, 89];

/** Lessons grouped by domain, in catalogue order. */
export function byDomain<T extends Placeable>(items: readonly T[]) {
  return domains.map((domain) =>
    items.filter((item) => item.domain === domain),
  );
}

/**
 * Académie atlas: one lane per domain, notions in catalogue order. The canvas
 * grows with the longest lane, so a new lesson never overlaps another.
 */
export function atlasLayout<T extends Placeable>(items: readonly T[]) {
  const lanes = byDomain(items);
  const longest = Math.max(1, ...lanes.map((lane) => lane.length));
  const width = Math.max(1000, ATLAS_MARGIN * 2 + (longest - 1) * ATLAS_STEP);
  const positions: Record<string, Point & { lane: number; order: number }> = {};
  lanes.forEach((lane, laneIndex) =>
    lane.forEach((item, order) => {
      positions[item.id] = {
        x: ((ATLAS_MARGIN + order * ATLAS_STEP) / width) * 100,
        y: LANE_CENTRES[laneIndex] ?? 50,
        lane: laneIndex,
        order,
      };
    }),
  );
  return { positions, width };
}

/**
 * A link between two notions. Within a lane, a link that skips notions bows
 * above the row instead of running through the ones in between.
 */
export function atlasLinkPath(
  a: Point & { lane: number; order: number },
  b: Point & { lane: number; order: number },
) {
  const ax = a.x * 10,
    ay = a.y * 4.8,
    bx = b.x * 10,
    by = b.y * 4.8;
  if (a.lane === b.lane && Math.abs(a.order - b.order) > 1) {
    // Capped so the arc stays inside its own lane.
    const lift = Math.min(18 + Math.abs(a.order - b.order) * 4, 34);
    return `M${ax} ${ay} C${ax} ${ay - lift},${bx} ${by - lift},${bx} ${by}`;
  }
  const mid = (ax + bx) / 2;
  return `M${ax} ${ay} C${mid} ${ay},${mid} ${by},${bx} ${by}`;
}

/** Skills map: one column per domain, one row of 88 px per notion. */
export function columnLayout<T extends Placeable>(items: readonly T[]) {
  const columns = byDomain(items);
  const longest = Math.max(1, ...columns.map((column) => column.length));
  const top = 112;
  const row = 88;
  const height = Math.max(560, top + (longest - 1) * row + 110);
  const positions: Record<string, Point> = {};
  columns.forEach((column, index) => {
    const x = 10 + index * 20;
    column.forEach((item, order) => {
      positions[item.id] = { x, y: ((top + order * row) / height) * 100 };
    });
  });
  return { positions, height };
}

/**
 * Home trajectory: a short track stays on one line; a longer one zigzags so
 * neighbouring labels never collide.
 */
export function trackLayout(ids: readonly string[]) {
  const n = ids.length;
  return ids.map((id, index) => ({
    id,
    x: n === 1 ? 50 : 8 + (index * 84) / (n - 1),
    y: n <= 5 ? 50 : index % 2 ? 76 : 24,
  }));
}
