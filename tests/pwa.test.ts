import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const manifest = JSON.parse(
  readFileSync("public/manifest.webmanifest", "utf8"),
) as {
  name: string;
  short_name: string;
  lang: string;
  display: string;
  start_url: string;
  icons: { src: string; sizes: string; purpose: string }[];
};

test("the manifest makes BOUSE installable in French with existing icons", () => {
  assert.equal(manifest.short_name, "BOUSE");
  assert.equal(manifest.lang, "fr");
  assert.equal(manifest.display, "standalone");
  assert.ok(manifest.start_url.startsWith("/"));
  for (const size of ["192x192", "512x512"])
    assert.ok(
      manifest.icons.some(
        (icon) => icon.sizes === size && icon.purpose === "any",
      ),
    );
  assert.ok(manifest.icons.some((icon) => icon.purpose === "maskable"));
  for (const icon of manifest.icons)
    assert.ok(existsSync(`public${icon.src}`), `${icon.src} exists`);
});

test("the service worker keeps placeholders for the build and never caches other origins", () => {
  const source = readFileSync("public/sw.js", "utf8");
  assert.match(source, /const VERSION = "bouse-dev";/);
  assert.match(source, /const PRECACHE = \[\];/);
  assert.match(source, /url\.origin !== self\.location\.origin\) return;/);
  assert.match(source, /ignoreVary: true/);
  for (const path of source.match(/"\/[^"]+\.(png|webmanifest)"/g) ?? [])
    assert.ok(existsSync(`public${JSON.parse(path)}`), `${path} exists`);
});
