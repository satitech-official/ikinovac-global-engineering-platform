import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const catalogueFile = path.join(projectRoot, "data", "catalog.ts");
const outputRoot = path.join(projectRoot, "public", "images", "products");

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function hash(value) {
  let result = 2166136261;
  for (const character of value) {
    result ^= character.charCodeAt(0);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function escapeXml(value) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[character]);
}

function readSeeds() {
  const source = fs.readFileSync(catalogueFile, "utf8");
  const start = source.indexOf("const catalogSeeds");
  const end = source.indexOf("\n};", start);
  if (start < 0 || end < 0) throw new Error("Unable to read catalogue seeds from data/catalog.ts.");

  const section = source.slice(start, end);
  const categoryMatches = [...section.matchAll(/^\s*(?:"([^"]+)"|([a-z][a-z-]*)):\s*\[/gm)];
  return categoryMatches.flatMap((match, index) => {
    const category = match[1] ?? match[2];
    const nextStart = categoryMatches[index + 1]?.index ?? section.length;
    const entries = section.slice(match.index, nextStart);
    return [...entries.matchAll(/\["([^"]+)"/g)].map((entry) => ({ category, name: entry[1] }));
  });
}

function productGeometry(category, variant, accent, metal) {
  const rotate = (variant % 7) * 3 - 9;
  const shift = (variant % 5) * 8 - 16;
  const transforms = `translate(${shift} 0) rotate(${rotate} 600 360)`;
  const valve = `<g transform="${transforms}" fill="none" stroke="${metal}" stroke-width="18" stroke-linejoin="round"><path d="M355 360h118M727 360h118"/><rect x="468" y="294" width="260" height="132" rx="20" fill="#183353"/><circle cx="598" cy="360" r="64"/><path d="M598 296v-73M544 223h108M598 223l-40-45M598 223l40-45" stroke="${accent}"/></g>`;
  const pipe = `<g transform="${transforms}" fill="none" stroke-linecap="round"><path d="M295 382h612" stroke="#47617d" stroke-width="74"/><path d="M295 364h612" stroke="${metal}" stroke-width="38"/><path d="M340 345h75m58 0h75m58 0h75m58 0h75" stroke="${accent}" stroke-width="7"/><ellipse cx="300" cy="382" rx="42" ry="44" fill="#163250" stroke="${accent}" stroke-width="10"/></g>`;
  const flange = `<g transform="${transforms}" fill="none" stroke-linejoin="round"><circle cx="600" cy="360" r="137" fill="#163250" stroke="${metal}" stroke-width="20"/><circle cx="600" cy="360" r="69" stroke="${accent}" stroke-width="18"/>${Array.from({ length: 8 }, (_, index) => `<circle cx="600" cy="${247 + index * 0}" r="13" fill="${accent}" transform="rotate(${index * 45} 600 360) translate(0 -100)"/>`).join("")}</g>`;
  const instrument = `<g transform="${transforms}" fill="none" stroke-linejoin="round"><circle cx="600" cy="320" r="128" fill="#f0f4f6" stroke="${metal}" stroke-width="22"/><circle cx="600" cy="320" r="100" stroke="#486078" stroke-width="4"/><path d="M600 320l${variant % 2 ? "65 -44" : "-58 -26"}" stroke="${accent}" stroke-width="13" stroke-linecap="round"/><circle cx="600" cy="320" r="15" fill="${accent}"/><path d="M560 465h80l25 120H535z" fill="#173452" stroke="${metal}" stroke-width="18"/></g>`;
  const pump = `<g transform="${transforms}" fill="none" stroke-linejoin="round"><path d="M390 462h406l-38 75H428z" fill="#163250" stroke="${metal}" stroke-width="18"/><circle cx="522" cy="348" r="128" fill="#193957" stroke="${metal}" stroke-width="22"/><circle cx="522" cy="348" r="51" stroke="${accent}" stroke-width="18"/><path d="M630 330h116v-116h80v183H692" stroke="${metal}" stroke-width="30"/><path d="M540 458v-122" stroke="${accent}" stroke-width="13"/></g>`;
  const electrical = `<g transform="${transforms}" fill="none" stroke-linejoin="round"><rect x="410" y="172" width="380" height="395" rx="18" fill="#183453" stroke="${metal}" stroke-width="19"/><rect x="460" y="225" width="280" height="143" rx="8" fill="#071a31" stroke="${accent}" stroke-width="9"/><circle cx="502" cy="442" r="23" fill="${accent}"/><circle cx="600" cy="442" r="23" fill="#d9e2e9"/><path d="M690 411v83M464 511h270" stroke="#7590a7" stroke-width="8"/></g>`;
  const motion = `<g transform="${transforms}" fill="none" stroke-linejoin="round"><path d="M330 430h540" stroke="#38546f" stroke-width="58" stroke-linecap="round"/><path d="M330 430h540" stroke="${metal}" stroke-width="24" stroke-linecap="round"/><rect x="490" y="220" width="220" height="210" rx="25" fill="#183654" stroke="${accent}" stroke-width="16"/><path d="M548 272h104m-104 54h104m-104 54h104" stroke="#b5c7d6" stroke-width="11"/></g>`;
  const bearing = `<g transform="${transforms}" fill="none" stroke-linejoin="round"><circle cx="600" cy="355" r="159" fill="#173350" stroke="${metal}" stroke-width="22"/><circle cx="600" cy="355" r="78" stroke="${accent}" stroke-width="22"/>${Array.from({ length: 10 }, (_, index) => `<circle cx="600" cy="230" r="24" fill="#d8e2e8" transform="rotate(${index * 36} 600 355)"/>`).join("")}</g>`;
  const fluid = `<g transform="${transforms}" fill="none" stroke-linejoin="round"><rect x="365" y="265" width="430" height="172" rx="55" fill="#183654" stroke="${metal}" stroke-width="20"/><path d="M454 265v-86h82v86m46 172v83h82v-83" stroke="${metal}" stroke-width="28"/><path d="M455 350h250" stroke="${accent}" stroke-width="14" stroke-linecap="round"/><circle cx="508" cy="351" r="30" fill="#0a203d" stroke="${accent}" stroke-width="9"/></g>`;
  const safety = `<g transform="${transforms}" fill="none" stroke-linejoin="round"><path d="M600 175c-125 0-202 80-202 185 0 119 88 188 202 242 114-54 202-123 202-242 0-105-77-185-202-185z" fill="#d69818" stroke="${metal}" stroke-width="18"/><path d="M510 352l58 59 122-144" stroke="#f7fbff" stroke-width="29" stroke-linecap="round"/><path d="M471 202l55 74h148l55-74" stroke="#f4cf68" stroke-width="12"/></g>`;
  const tool = `<g transform="${transforms}" fill="none" stroke-linejoin="round"><path d="M462 506l194-194c48-48 23-129-42-129-18 0-35 6-49 16l56 56-53 53-57-56c-10 15-16 32-16 49 0 23 10 44 27 60l-196 196z" fill="#193653" stroke="${metal}" stroke-width="18"/><path d="M702 198l68 68" stroke="${accent}" stroke-width="18" stroke-linecap="round"/></g>`;

  if (category === "valves") return valve;
  if (category === "pipes-tubes") return pipe;
  if (category === "pipe-fittings" || category === "flanges" || category === "gaskets-seals") return flange;
  if (category === "instrumentation") return instrument;
  if (category === "pumps") return pump;
  if (category === "electrical") return electrical;
  if (category === "automation") return motion;
  if (category === "bearings-power-transmission") return bearing;
  if (category === "hydraulics" || category === "pneumatics") return fluid;
  if (category === "industrial-safety") return safety;
  if (category === "tools-maintenance" || category === "fasteners") return tool;
  return valve;
}

function productSvg({ category, name }, index) {
  const identity = `${category}:${name}`;
  const value = hash(identity);
  const accent = ["#E7B43A", "#FFD875", "#D7981C", "#F4C85E"][value % 4];
  const metal = ["#D9E3EA", "#BFCEDB", "#E8EDF0", "#A9BDCD"][Math.floor(value / 7) % 4];
  const code = `IKV-${category.slice(0, 3).toUpperCase()}-${String(index + 1).padStart(3, "0")}`;
  const patternOffset = value % 91;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="900" viewBox="0 0 1200 900" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(name)}</title><desc id="desc">IKINOVAC Global technical product visual for ${escapeXml(name)}</desc>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#020B18"/><stop offset=".58" stop-color="#09284A"/><stop offset="1" stop-color="#06182F"/></linearGradient>
    <radialGradient id="halo" cx="50%" cy="45%" r="62%"><stop stop-color="${accent}" stop-opacity=".22"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient>
    <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffffff"/><stop offset=".36" stop-color="${metal}"/><stop offset=".7" stop-color="#6f879d"/><stop offset="1" stop-color="#e3edf4"/></linearGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse" patternTransform="translate(${patternOffset} ${patternOffset / 2})"><path d="M48 0H0V48" fill="none" stroke="#b9cfdf" stroke-opacity=".09" stroke-width="1"/></pattern>
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="8" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="1200" height="900" fill="url(#bg)"/><rect width="1200" height="900" fill="url(#grid)"/><ellipse cx="600" cy="390" rx="420" ry="330" fill="url(#halo)"/>
  <path d="M88 736H1112" stroke="#E7B43A" stroke-opacity=".56" stroke-width="2"/><path d="M88 730V790H148" fill="none" stroke="#E7B43A" stroke-opacity=".7" stroke-width="3"/>
  ${productGeometry(category, value, accent, "url(#metal)")}
  <g fill="#F4F8FA"><text x="88" y="797" font-family="Arial, sans-serif" font-size="26" font-weight="700" letter-spacing="5">IKINOVAC GLOBAL</text><text x="88" y="834" font-family="Arial, sans-serif" font-size="20" fill="${accent}" letter-spacing="3">${escapeXml(code)} · PRODUCT VISUAL</text></g>
  <circle cx="1088" cy="120" r="10" fill="${accent}" filter="url(#glow)"/><path d="M1008 120h56" stroke="${accent}" stroke-width="3"/>
</svg>`;
}

const products = readSeeds();
let changed = 0;
for (const [index, product] of products.entries()) {
  const filename = `${slugify(product.name)}.svg`;
  const output = path.join(outputRoot, product.category, filename);
  const content = productSvg(product, index);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  if (!fs.existsSync(output) || fs.readFileSync(output, "utf8") !== content) {
    fs.writeFileSync(output, content);
    changed += 1;
  }
}

console.log(`Generated ${products.length} product-specific local SVG assets (${changed} updated).`);
