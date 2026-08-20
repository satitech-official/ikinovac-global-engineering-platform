import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const projectRoot = process.cwd();
const outputRoot = path.join(projectRoot, "dist", "client");
const publicRoot = path.join(projectRoot, "public");
const repo = process.env.GITHUB_REPOSITORY?.split("/").pop() || "ikinovac-global-engineering-platform";
const prefix = `/${repo}`;
const textExts = new Set([".html", ".js", ".css", ".json", ".txt", ".rsc", ".map", ".xml", ".svg"]);

function assertDirectory(directory, label) {
  if (!fs.existsSync(directory) || !fs.statSync(directory).isDirectory()) {
    throw new Error(`${label} is missing: ${directory}`);
  }
}

assertDirectory(outputRoot, "Vinext client export");

// Make the Pages artifact deterministic. Vinext normally carries public files
// into dist/client, but explicitly copying them prevents logos, hero artwork,
// favicons or other public assets from disappearing when the exporter changes.
if (fs.existsSync(publicRoot)) {
  fs.cpSync(publicRoot, outputRoot, { recursive: true, force: true });
  console.log("Copied public assets into the GitHub Pages export.");
}

const localRoots = [
  "/_next/",
  "/products",
  "/catalogues",
  "/admin",
  "/images/",
  "/assets/",
  "/brand/",
  "/og.png",
  "/favicon.svg",
  "/favicon.ico",
];

function rebaseLocalUrls(text) {
  let next = text;
  for (const localRoot of localRoots) {
    const replacements = [
      [`\"${localRoot}`, `\"${prefix}${localRoot}`],
      [`'${localRoot}`, `'${prefix}${localRoot}`],
      [`(${localRoot}`, `(${prefix}${localRoot}`],
    ];
    for (const [from, to] of replacements) next = next.split(from).join(to);
  }

  return next
    .split('href="/"').join(`href="${prefix}/"`)
    .split("href='/'").join(`href='${prefix}/'`);
}

function routeCandidates(route) {
  if (route === "/") return [path.join(outputRoot, "index.html")];
  const clean = route.replace(/^\/+|\/+$/g, "");
  return [
    path.join(outputRoot, `${clean}.html`),
    path.join(outputRoot, clean, "index.html"),
  ];
}

function hasRoute(route) {
  return routeCandidates(route).some((candidate) => fs.existsSync(candidate));
}

async function renderRoute(route, destination) {
  const serverEntry = path.join(projectRoot, "dist", "server", "index.js");
  if (!fs.existsSync(serverEntry)) {
    throw new Error(`Cannot recover ${route}: Vinext server entry is missing at ${serverEntry}`);
  }

  const workerUrl = pathToFileURL(serverEntry);
  workerUrl.searchParams.set("pages-export", `${Date.now()}-${Math.random()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request(`http://localhost${route}`, { headers: { accept: "text/html" } }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  const contentType = response.headers.get("content-type") || "";
  const html = await response.text();
  if (!response.ok || !/^text\/html\b/i.test(contentType) || !/<html[\s>]/i.test(html)) {
    throw new Error(
      `Could not recover static route ${route}: status=${response.status}, content-type=${contentType || "unknown"}`,
    );
  }

  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, html);
  console.log(`Recovered skipped static route ${route} -> ${path.relative(outputRoot, destination)}`);
}

function createHomepageFallback(destination) {
  // Vinext can classify a client-heavy root route as dynamic and its server
  // renderer currently returns a 500 for that route. The Pages source always
  // contains the last known-good RSC document, so retain that shell and switch
  // it to the current build's hashed client assets. The existing RSC module
  // identity for app/page.tsx is stable, so hydration then renders the latest
  // homepage rather than leaving the prior static markup in place.
  const previousShell = path.join(projectRoot, "index.html");
  if (!fs.existsSync(previousShell)) {
    throw new Error("Could not recover /: Vinext did not render it and no previous homepage shell exists.");
  }

  const chunksRoot = path.join(outputRoot, "_next", "static", "chunks");
  const cssRoot = path.join(outputRoot, "_next", "static", "css");
  const pick = (directory, matcher, label) => {
    const match = fs.readdirSync(directory).find((file) => matcher.test(file));
    if (!match) throw new Error(`Missing generated ${label} asset for homepage fallback.`);
    return match;
  };
  const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const assets = {
    css: pick(cssRoot, /^index\.[A-Za-z0-9_-]+\.css$/, "stylesheet"),
    index: pick(chunksRoot, /^index-[A-Za-z0-9_-]+\.js$/, "bootstrap chunk"),
    runtime: pick(chunksRoot, /^rolldown-runtime-[A-Za-z0-9_-]+\.js$/, "runtime chunk"),
    framework: pick(chunksRoot, /^framework-[A-Za-z0-9_-]+\.js$/, "framework chunk"),
    layout: pick(chunksRoot, /^layout-segment-context-[A-Za-z0-9_-]+\.js$/, "layout chunk"),
    page: pick(chunksRoot, /^page-[A-Za-z0-9_-]+\.js$/, "homepage chunk"),
  };

  let html = fs.readFileSync(previousShell, "utf8");
  const replaceAsset = (directory, stem, filename, extension) => {
    const pattern = new RegExp(
      String.raw`(?:\/[^\/"']+)?\/${escapeRegex(directory)}\/${escapeRegex(stem)}[A-Za-z0-9_-]+${escapeRegex(extension)}`,
      "g",
    );
    html = html.replace(pattern, `/${directory}/${filename}`);
  };

  replaceAsset("_next/static/css", "index.", assets.css, ".css");
  replaceAsset("_next/static/chunks", "index-", assets.index, ".js");
  replaceAsset("_next/static/chunks", "rolldown-runtime-", assets.runtime, ".js");
  replaceAsset("_next/static/chunks", "framework-", assets.framework, ".js");
  replaceAsset("_next/static/chunks", "layout-segment-context-", assets.layout, ".js");
  replaceAsset("_next/static/chunks", "page-", assets.page, ".js");
  html = html
    .replace(/<link rel="modulepreload"[^>]*\/_next\/static\/chunks\/catalog-[^>]*>\s*/g, "")
    .replaceAll("sales@ikinovac.com", "info@ikinovac.com");

  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, html);
  console.log(`Created homepage fallback -> ${path.relative(outputRoot, destination)}`);
}

// Vinext may classify a client-heavy route as "unknown" and skip its export.
// Recover the two entry routes that GitHub Pages must always have.
if (!hasRoute("/")) {
  const destination = path.join(outputRoot, "index.html");
  try {
    await renderRoute("/", destination);
  } catch (error) {
    console.warn(`Vinext server recovery for / failed: ${error.message}`);
    createHomepageFallback(destination);
  }
}
if (!hasRoute("/products")) {
  await renderRoute("/products", path.join(outputRoot, "products.html"));
}

const htmlFiles = [];
let changedFiles = 0;

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }

    if (entry.name.endsWith(".html")) htmlFiles.push(full);
    if (!textExts.has(path.extname(entry.name))) continue;

    let text;
    try {
      text = fs.readFileSync(full, "utf8");
    } catch {
      continue;
    }

    const next = rebaseLocalUrls(text);
    if (next !== text) {
      fs.writeFileSync(full, next);
      changedFiles += 1;
    }
  }
}

walk(outputRoot);

// Mirror foo.html to foo/index.html so GitHub Pages clean URLs work without redirects.
for (const source of htmlFiles) {
  const relative = path.relative(outputRoot, source);
  if (relative === "index.html" || relative === "404.html" || path.basename(relative) === "index.html") continue;
  const target = path.join(outputRoot, relative.slice(0, -".html".length), "index.html");
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

const requiredAssets = [
  "brand/ikinovac-logo.jpeg",
  "images/ikinovac-global-supply-cover.png",
  "og.png",
];
for (const asset of requiredAssets) {
  const full = path.join(outputRoot, asset);
  if (!fs.existsSync(full)) throw new Error(`Missing required deployed asset: ${asset}`);
}

const requiredRoutes = ["/", "/products"];
for (const route of requiredRoutes) {
  if (!hasRoute(route)) {
    const candidates = routeCandidates(route).map((file) => path.relative(outputRoot, file)).join(" or ");
    throw new Error(`Missing required static route ${route}. Expected ${candidates}`);
  }
}

const leftovers = [];
function verifyRebasedPaths(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      verifyRebasedPaths(full);
      continue;
    }
    if (!textExts.has(path.extname(entry.name))) continue;

    let text;
    try {
      text = fs.readFileSync(full, "utf8");
    } catch {
      continue;
    }

    const patterns = [
      /["']\/(?:brand|images|assets|_next)\//,
      /["']\/og\.png/,
      /url\(\/(?:brand|images|assets|_next)\//,
    ];
    if (patterns.some((pattern) => pattern.test(text))) leftovers.push(path.relative(outputRoot, full));
  }
}
verifyRebasedPaths(outputRoot);

if (leftovers.length) {
  throw new Error(`Unrebased GitHub Pages asset references remain in: ${leftovers.slice(0, 20).join(", ")}`);
}

// Validate that local CSS/JS/module references from the home page resolve to files in the export.
const homeHtml = fs.readFileSync(path.join(outputRoot, "index.html"), "utf8");
const localAssetRefs = new Set();
for (const match of homeHtml.matchAll(/(?:href|src)=["']([^"']+)["']/g)) {
  const value = match[1];
  if (!value.startsWith(`${prefix}/`)) continue;
  if (!/\.(?:css|js|svg|png|jpe?g|webp)(?:\?|$)/i.test(value)) continue;
  localAssetRefs.add(value.split("?")[0]);
}

const missingReferencedAssets = [];
for (const ref of localAssetRefs) {
  const relative = ref.slice(prefix.length + 1);
  if (!fs.existsSync(path.join(outputRoot, relative))) missingReferencedAssets.push(relative);
}
if (missingReferencedAssets.length) {
  throw new Error(`Home page references missing deployed assets: ${missingReferencedAssets.join(", ")}`);
}

console.log(`GitHub Pages export ready: ${changedFiles} generated files rebased to ${prefix}.`);
console.log(`Verified routes: ${requiredRoutes.join(", ")}`);
console.log(`Verified required assets: ${requiredAssets.join(", ")}`);
