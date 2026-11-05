import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Fills the service worker with every emitted file and a content-derived
 * version, so each screen opens offline after one online visit and a new
 * release replaces the old cache.
 */
function precacheServiceWorker(): Plugin {
  let outDir = "dist";
  return {
    name: "bouse-precache-service-worker",
    apply: "build",
    configResolved(config) {
      outDir = config.build.outDir;
    },
    closeBundle() {
      const files: string[] = [];
      const walk = (dir: string) => {
        for (const name of readdirSync(dir)) {
          const path = join(dir, name);
          if (statSync(path).isDirectory()) walk(path);
          else files.push("/" + relative(outDir, path).split(sep).join("/"));
        }
      };
      walk(outDir);
      const precache = files
        .filter(
          (file) =>
            file !== "/sw.js" &&
            !file.endsWith(".md") &&
            !file.endsWith(".txt"),
        )
        .sort();
      const hash = createHash("sha256");
      for (const file of precache)
        hash.update(file).update(readFileSync(join(outDir, file)));
      const swPath = join(outDir, "sw.js");
      const source = readFileSync(swPath, "utf8")
        .replace(
          'const VERSION = "bouse-dev";',
          `const VERSION = "bouse-${hash.digest("hex").slice(0, 12)}";`,
        )
        .replace(
          "const PRECACHE = [];",
          `const PRECACHE = ${JSON.stringify(precache)};`,
        );
      writeFileSync(swPath, source);
    },
  };
}

export default defineConfig({ plugins: [react(), precacheServiceWorker()] });
