import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const catalogueFile = path.join(root, "data", "catalog.ts");
const manifestFile = path.join(root, "data", "product-images.json");
const productRoot = path.join(root, "public", "images", "products");
const commonsApi = "https://commons.wikimedia.org/w/api.php";

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const hashFile = (content) => crypto.createHash("sha256").update(content).digest("hex");

async function fetchWithRetry(url, options, label) {
  let lastError;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    try {
      return await fetch(url, options);
    } catch (error) {
      lastError = error;
      if (attempt === 5) break;
      await sleep(2_000 * (attempt + 1));
    }
  }
  throw new Error(`Unable to fetch ${label}: ${lastError instanceof Error ? lastError.message : String(lastError)}`);
}

function productsFromCatalogue() {
  const source = fs.readFileSync(catalogueFile, "utf8");
  const start = source.indexOf("const catalogSeeds");
  const end = source.indexOf("\n};", start);
  if (start < 0 || end < 0) throw new Error("Unable to read product records from data/catalog.ts.");
  const block = source.slice(start, end);
  const categoryMatches = [...block.matchAll(/^\s*(?:"([^"]+)"|([a-z][a-z-]*)):\s*\[/gm)];
  return categoryMatches.flatMap((match, index) => {
    const category = match[1] ?? match[2];
    const nextStart = categoryMatches[index + 1]?.index ?? block.length;
    return [...block.slice(match.index, nextStart).matchAll(/\["([^"]+)"/g)].map((entry) => ({ category, name: entry[1], slug: slugify(entry[1]) }));
  });
}

async function api(params) {
  const url = new URL(commonsApi);
  for (const [key, value] of Object.entries({ format: "json", origin: "*", ...params })) url.searchParams.set(key, value);
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const response = await fetchWithRetry(url, { headers: { "user-agent": "IKINOVAC-Global-Catalogue/1.0 (catalogue asset sync)", "api-user-agent": "IKINOVAC-Global-Catalogue/1.0 (catalogue asset sync)" } }, "Wikimedia Commons API");
    if (response.ok) return response.json();
    if (response.status !== 429 || attempt === 5) throw new Error(`Commons request failed (${response.status}) for ${params.action}.`);
    const retryAfter = Number(response.headers.get("retry-after"));
    await sleep(Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 3_000 * (attempt + 1));
  }
  throw new Error("Commons request retry loop exhausted.");
}

function searchTerms(product) {
  const simplified = product.name.replace(/\bIndustrial\b/gi, "").replace(/\bProduct\b/gi, "").trim();
  const categoryTerms = {
    valves: "industrial valve",
    "pipes-tubes": "steel pipe industrial",
    "pipe-fittings": "industrial pipe fitting",
    flanges: "pipe flange industrial",
    fasteners: "industrial fastener",
    "gaskets-seals": "industrial gasket seal",
    instrumentation: "industrial process instrument",
    pumps: "industrial pump",
    electrical: "industrial electrical equipment",
    automation: "industrial automation equipment",
    "bearings-power-transmission": "industrial bearing",
    hydraulics: "industrial hydraulic equipment",
    pneumatics: "industrial pneumatic equipment",
    "industrial-safety": "industrial safety equipment",
    "tools-maintenance": "industrial hand tool",
  };
  return [...new Set([product.name, simplified, `${simplified} ${product.category.replace(/-/g, " ")}`, categoryTerms[product.category]])].filter(Boolean);
}

async function findCandidates(product) {
  const titles = [];
  for (const query of searchTerms(product)) {
    const result = await api({ action: "query", list: "search", srsearch: query, srnamespace: "6", srlimit: "12", srwhat: "text" });
    for (const item of result.query?.search ?? []) {
      if (!/\.(?:jpe?g|png|webp)$/i.test(item.title)) continue;
      if (!titles.includes(item.title)) titles.push(item.title);
    }
    if (titles.length >= 8) break;
    await sleep(80);
  }
  if (!titles.length) return [];
  const details = await api({ action: "query", titles: titles.join("|"), prop: "imageinfo", iiprop: "url|extmetadata", iiurlwidth: "960" });
  return Object.values(details.query?.pages ?? []).flatMap((page) => {
    const info = page.imageinfo?.[0];
    if (!info?.thumburl || !info.extmetadata) return [];
    const license = String(info.extmetadata.LicenseShortName?.value ?? "").replace(/<[^>]*>/g, "").trim();
    const author = String(info.extmetadata.Artist?.value ?? "Wikimedia Commons contributor").replace(/<[^>]*>/g, "").trim();
    return [{ title: page.title, url: info.thumburl, source: `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title.replace(/^File:/, "File:"))}`, license, author }];
  });
}

function imageExtension(contentType, sourceUrl) {
  if (/image\/png/i.test(contentType)) return "png";
  if (/image\/webp/i.test(contentType)) return "webp";
  if (/image\/jpe?g/i.test(contentType)) return "jpg";
  const extension = path.extname(new URL(sourceUrl).pathname).replace(".", "").toLowerCase();
  return ["jpg", "jpeg", "png", "webp"].includes(extension) ? extension.replace("jpeg", "jpg") : "jpg";
}

const products = productsFromCatalogue();
const manifest = fs.existsSync(manifestFile) ? JSON.parse(fs.readFileSync(manifestFile, "utf8")) : {};
const usedUrls = new Set(Object.values(manifest).map((record) => record.src));
const usedHashes = new Set();

for (const record of Object.values(manifest)) {
  const existing = path.join(root, "public", record.src.replace(/^\//, ""));
  if (fs.existsSync(existing)) usedHashes.add(hashFile(fs.readFileSync(existing)));
}

const unresolved = [];
let updated = 0;
for (const product of products) {
  const key = `${product.category}/${product.slug}`;
  const existing = manifest[key];
  if (existing?.src.startsWith("http")) continue;
  const existingFile = existing && path.join(root, "public", existing.src.replace(/^\//, ""));
  if (existingFile && fs.existsSync(existingFile)) continue;

  let chosen;
  for (const candidate of await findCandidates(product)) {
    if (usedUrls.has(candidate.url)) continue;
    const response = await fetchWithRetry(candidate.url, { headers: { "user-agent": "IKINOVAC-Global-Catalogue/1.0 (asset sync)" } }, candidate.title);
    const contentType = response.headers.get("content-type") ?? "";
    if (!response.ok || !/^image\//i.test(contentType)) continue;
    const content = Buffer.from(await response.arrayBuffer());
    if (content.length < 8_000 || content.length > 6_000_000) continue;
    const contentHash = hashFile(content);
    if (usedHashes.has(contentHash)) continue;
    chosen = { ...candidate, content, contentHash, extension: imageExtension(contentType, candidate.url) };
    break;
  }

  if (!chosen) {
    unresolved.push(product.name);
    continue;
  }

  const relative = `/images/products/${product.category}/${product.slug}.${chosen.extension}`;
  const destination = path.join(root, "public", relative.replace(/^\//, ""));
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, chosen.content);
  manifest[key] = { src: relative, source: chosen.source, license: chosen.license || "Wikimedia Commons licence", author: chosen.author || "Wikimedia Commons contributor" };
  usedUrls.add(chosen.url);
  usedHashes.add(chosen.contentHash);
  fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
  updated += 1;
  process.stdout.write(`Synced ${product.name}\n`);
  await sleep(850);
}

fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Synced ${Object.keys(manifest).length}/${products.length} unique Commons product photos (${updated} new).`);
if (unresolved.length) {
  console.error(`No unique photo found for: ${unresolved.join(", ")}`);
  process.exitCode = 1;
}
