import test from "node:test";
import assert from "node:assert/strict";
import { lessons } from "../src/data/lessons.ts";
import {
  atlasLayout,
  columnLayout,
  trackLayout,
} from "../src/lib/mapLayout.ts";

test("every lesson gets a place in the atlas and in the skills map", () => {
  const atlas = atlasLayout(lessons);
  const columns = columnLayout(lessons);
  for (const lesson of lessons) {
    assert.ok(atlas.positions[lesson.id], lesson.id);
    assert.ok(columns.positions[lesson.id], lesson.id);
  }
});

test("no two notions share a spot, and the canvas widens with its longest lane", () => {
  const atlas = atlasLayout(lessons);
  const spots = Object.values(atlas.positions).map(
    (p) => `${p.x.toFixed(2)}:${p.y}`,
  );
  assert.equal(new Set(spots).size, spots.length);
  const many = Array.from({ length: 12 }, (_, i) => ({
    id: `x${i}`,
    domain: "Entrepreneuriat" as const,
  }));
  const wide = atlasLayout(many);
  assert.ok(wide.width > 1000);
  const xs = many.map((item) => wide.positions[item.id]!.x);
  assert.ok(xs.every((x, i) => i === 0 || x > xs[i - 1]!));
  assert.ok(Math.max(...xs) < 100);
});

test("the skills map grows taller with its longest column", () => {
  const few = columnLayout([{ id: "a", domain: "Finance" as const }]);
  const many = columnLayout(
    Array.from({ length: 10 }, (_, i) => ({
      id: `y${i}`,
      domain: "Finance" as const,
    })),
  );
  assert.ok(many.height > few.height);
});

test("long home tracks zigzag, short ones stay on one line", () => {
  assert.ok(trackLayout(["a", "b", "c"]).every((p) => p.y === 50));
  const long = trackLayout(["a", "b", "c", "d", "e", "f", "g"]);
  assert.notEqual(long[0]!.y, long[1]!.y);
  assert.equal(long[0]!.y, long[2]!.y);
});
