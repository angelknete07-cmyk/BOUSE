#!/usr/bin/env node
import { createHash, randomUUID } from "node:crypto";
import {
  copyFile,
  cp,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  realpath,
  rename,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const resultsRoot = join(projectRoot, "test-results");
const reviewRoot = join(projectRoot, "design-reviews");
const configPath = join(projectRoot, "playwright.config.ts");
const runPath = join(resultsRoot, ".last-run.json");
const requiredScreens = [
  "01-home.png",
  "00-home-viewport.png",
  "01-onboarding.png",
  "02-academy.png",
  "03-lecon-learn.png",
  "04-quiz-valide.png",
  "05-lab-financier.png",
  "06-ai-lab.png",
  "07-incubator.png",
  "03-recherche.png",
];
const projects = [
  { name: "desktop-chromium", directory: "desktop" },
  { name: "mobile-chromium", directory: "mobile" },
];
const args = process.argv.slice(2);
const checkOnly = args.includes("--check");
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
const toRelative = (path) => relative(projectRoot, path).split(sep).join("/");

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

async function filesBelow(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    ensure(
      !entry.isSymbolicLink(),
      `Lien symbolique non pris en charge : ${toRelative(path)}`,
    );
    if (entry.isDirectory()) paths.push(...(await filesBelow(path)));
    else if (entry.isFile()) paths.push(path);
  }
  return paths.sort();
}

function parisTimestamp(now) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Paris",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(now)
      .map(({ type, value }) => [type, value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}_${parts.hour}-${parts.minute}-${parts.second}-Europe-Paris`;
}

async function uniqueArchive(prefix) {
  const archiveRoot = join(reviewRoot, "archive");
  await mkdir(archiveRoot, { recursive: true });
  for (let suffix = 0; suffix < 100; suffix += 1) {
    const candidate = join(
      archiveRoot,
      `${prefix}${suffix ? `-${suffix + 1}` : ""}`,
    );
    try {
      await mkdir(candidate);
      return candidate;
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
    }
  }
  throw new Error(
    "Impossible de créer une archive unique sans écraser l’historique.",
  );
}

async function assertReviewPath(directory) {
  const actual = await realpath(directory);
  const root = await realpath(reviewRoot);
  ensure(
    actual === root || actual.startsWith(`${root}${sep}`),
    "Le dossier de review sort du projet.",
  );
}

async function atomicCopy(source, target) {
  await mkdir(dirname(target), { recursive: true });
  await assertReviewPath(dirname(target));
  const temporary = `${target}.${randomUUID()}.tmp`;
  try {
    await copyFile(source, temporary);
    await rename(temporary, target);
  } finally {
    await rm(temporary, { force: true });
  }
}

async function main() {
  if (args.includes("--help")) {
    console.log(
      "Usage : node scripts/save-design-review.mjs [--check]\n--check valide les rendus et leur fraîcheur sans modifier design-reviews/.",
    );
    return;
  }
  ensure(
    args.every((arg) => arg === "--check"),
    "Option inconnue. Utilisez --help.",
  );
  const run = JSON.parse(await readFile(runPath, "utf8"));
  const runStat = await stat(runPath);
  ensure(
    run.status === "passed" &&
      Array.isArray(run.failedTests) &&
      run.failedTests.length === 0,
    "Le dernier run Playwright n’a pas réussi. Relancez npm run test:e2e avant de sauvegarder les rendus.",
  );

  // Loading the repository's existing config resolves the real device preset.
  // It uses the already-installed test tooling; no package is installed here.
  const { default: config } = await import(pathToFileURL(configPath).href);
  const inputs = [
    ...(await filesBelow(join(projectRoot, "src"))),
    ...(await filesBelow(join(projectRoot, "public"))),
    configPath,
    join(projectRoot, "index.html"),
    join(projectRoot, "package.json"),
    join(projectRoot, "package-lock.json"),
    join(projectRoot, "tests", "design.spec.ts"),
  ].sort();
  const sourceFiles = [];
  let newestInput = 0;
  for (const path of inputs) {
    const info = await stat(path);
    ensure(
      info.mtimeMs <= runStat.mtimeMs,
      `Les sources ont changé après les tests : ${toRelative(path)}. Générer de nouveaux rendus.`,
    );
    newestInput = Math.max(newestInput, info.mtimeMs);
    sourceFiles.push({
      path: toRelative(path),
      sha256: digest(await readFile(path)),
    });
  }

  const captures = [];
  const viewports = {};
  const resultDirectories = await readdir(resultsRoot, { withFileTypes: true });
  for (const project of projects) {
    const settings = config.projects?.find(
      (entry) => entry.name === project.name,
    )?.use;
    const viewport = settings?.viewport ?? config.use?.viewport;
    ensure(
      viewport &&
        Number.isFinite(viewport.width) &&
        Number.isFinite(viewport.height),
      `Viewport absent du projet ${project.name}.`,
    );
    viewports[project.directory] = {
      project: project.name,
      viewport,
      deviceScaleFactor:
        settings.deviceScaleFactor ?? config.use?.deviceScaleFactor ?? 1,
      isMobile: settings.isMobile ?? false,
      hasTouch: settings.hasTouch ?? false,
      browser: settings.defaultBrowserType ?? "chromium",
    };
    const seen = new Set();
    for (const entry of resultDirectories) {
      if (
        !entry.isDirectory() ||
        !entry.name.startsWith("design-") ||
        !entry.name.endsWith(`-${project.name}`)
      )
        continue;
      const directory = join(resultsRoot, entry.name);
      for (const image of await readdir(directory, { withFileTypes: true })) {
        if (!image.isFile() || !/^\d{2}-.+\.png$/.test(image.name)) continue;
        ensure(
          !seen.has(image.name),
          `Capture ambiguë pour ${project.directory}/${image.name}.`,
        );
        seen.add(image.name);
        const source = join(directory, image.name);
        const imageStat = await stat(source);
        ensure(
          imageStat.mtimeMs >= newestInput,
          `Capture antérieure aux dernières sources : ${toRelative(source)}.`,
        );
        ensure(
          imageStat.mtimeMs <= runStat.mtimeMs,
          `Capture postérieure au résultat des tests : ${toRelative(source)}.`,
        );
        const bytes = await readFile(source);
        ensure(
          bytes.length >= 24 &&
            bytes
              .subarray(0, 8)
              .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) &&
            bytes.toString("ascii", 12, 16) === "IHDR",
          `Capture PNG illisible : ${toRelative(source)}.`,
        );
        captures.push({
          source,
          path: `screens/${project.directory}/${image.name}`,
          project: project.name,
          capturedAt: imageStat.mtime.toISOString(),
          width: bytes.readUInt32BE(16),
          height: bytes.readUInt32BE(20),
          sha256: digest(bytes),
        });
      }
    }
    for (const name of requiredScreens)
      ensure(
        seen.has(name),
        `Capture requise absente : ${project.directory}/${name}. Exécuter toute la galerie de tests/design.spec.ts.`,
      );
  }

  const now = new Date();
  const manifest = {
    schemaVersion: 1,
    generatedAt: now.toISOString(),
    generatedAtParis: parisTimestamp(now),
    testRunCompletedAt: runStat.mtime.toISOString(),
    testRunStatus: run.status,
    captureMode: "latest: viewport; screens: full-page and viewport",
    viewports,
    sourceSha256: digest(JSON.stringify(sourceFiles)),
    sourceFiles,
    internalReview:
      "Captures issues d’un run réussi ; inspection visuelle à consigner dans LATEST.md.",
    externalReview: "pending",
    images: captures
      .sort((a, b) => a.path.localeCompare(b.path))
      .map(({ source, ...image }) => ({
        ...image,
        source: toRelative(source),
      })),
  };
  if (checkOnly) {
    console.log(
      `${captures.length} captures fraîches et valides. Viewports : ${Object.entries(
        viewports,
      )
        .map(
          ([name, metadata]) =>
            `${name} ${metadata.viewport.width}×${metadata.viewport.height}`,
        )
        .join(" ; ")}. Aucun fichier modifié.`,
    );
    return;
  }

  await mkdir(reviewRoot, { recursive: true });
  const actualReviewRoot = await realpath(reviewRoot);
  const actualProjectRoot = await realpath(projectRoot);
  ensure(
    actualReviewRoot.startsWith(`${actualProjectRoot}${sep}`),
    "design-reviews/ doit rester dans le projet.",
  );
  const staging = await mkdtemp(join(reviewRoot, ".review-capture-"));
  try {
    for (const image of captures) {
      const target = join(staging, image.path);
      await mkdir(dirname(target), { recursive: true });
      await copyFile(image.source, target);
    }
    for (const project of projects)
      await copyFile(
        join(staging, "screens", project.directory, "00-home-viewport.png"),
        join(staging, `latest-${project.directory}.png`),
      );
    await writeFile(
      join(staging, "render-manifest.json"),
      `${JSON.stringify(manifest, null, 2)}\n`,
    );

    const previousFiles = [
      "latest-desktop.png",
      "latest-mobile.png",
      "render-manifest.json",
      "LATEST.md",
      "screens",
    ];
    if (
      (
        await Promise.all(
          previousFiles.map((name) => exists(join(reviewRoot, name))),
        )
      ).some(Boolean)
    ) {
      const previous = await uniqueArchive(`${parisTimestamp(now)}-previous`);
      for (const name of previousFiles)
        if (await exists(join(reviewRoot, name)))
          await cp(join(reviewRoot, name), join(previous, name), {
            recursive: true,
            errorOnExist: true,
            force: false,
          });
    }
    const archive = await uniqueArchive(parisTimestamp(now));
    for (const name of await readdir(staging)) {
      await cp(join(staging, name), join(archive, name), {
        recursive: true,
        errorOnExist: true,
        force: false,
      });
    }
    for (const image of captures)
      await atomicCopy(join(staging, image.path), join(reviewRoot, image.path));
    for (const name of [
      "latest-desktop.png",
      "latest-mobile.png",
      "render-manifest.json",
    ])
      await atomicCopy(join(staging, name), join(reviewRoot, name));
    console.log(
      `${captures.length} captures enregistrées dans design-reviews/screens/.\nPaire principale : latest-desktop.png et latest-mobile.png.\nArchive : ${toRelative(archive)}.\nInspecter les images et mettre à jour design-reviews/LATEST.md ; aucune validation externe n’est déduite des tests.`,
    );
  } finally {
    await rm(staging, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(`Sauvegarde des rendus refusée : ${error.message}`);
  process.exitCode = 1;
});
