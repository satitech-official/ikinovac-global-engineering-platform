/**
 * Production SEO smoke test.
 * Keep the custom-domain build indexable and stop an accidental return
 * to the GitHub repository path from being published as a canonical URL.
 */
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const output = process.env.SEO_EXPORT_DIR || 'out';
const origin = 'https://www.ikinovac.com';
const read = path => {
  const filename = join(output, path);
  assert.ok(existsSync(filename), `Missing production SEO route: ${filename}`);
  return readFileSync(filename, 'utf8');
};

const homepage = read('index.html');
const sitemap = read('sitemap.xml');
const robots = read('robots.txt');
const cname = read('CNAME').trim();

assert.equal(cname, 'www.ikinovac.com', 'Custom domain must be www.ikinovac.com');
assert.ok(robots.includes('Sitemap: https://www.ikinovac.com/sitemap.xml'));
assert.ok(!sitemap.includes('satitech-official.github.io'), 'Sitemap must not publish GitHub URLs');
const urlCount = (sitemap.match(/<loc>/g) || []).length;
assert.ok(urlCount >= 30, `Sitemap unexpectedly contains only ${urlCount} URLs`);

const requiredPaths = [
  '/',
  '/products/',
  '/global-presence/',
  '/global-presence/uae/',
  '/global-presence/saudi-arabia/',
  '/global-presence/kenya/',
  '/contact/'
];
for (const path of requiredPaths) {
  const file = path === '/' ? 'index.html' : path.slice(1) + 'index.html';
  const html = path === '/' ? homepage : read(file);
  const expected = origin + path;
  assert.ok(sitemap.includes('<loc>' + expected + '</loc>'), `Sitemap missing: ${expected}`);
  const canonicalTags = html.match(/<link\b[^>]*\brel="canonical"[^>]*>/gi) || [];
  assert.equal(canonicalTags.length, 1, `Expected one canonical at ${path}`);
  assert.ok(canonicalTags[0].includes('href="' + expected + '"'),
    `Wrong canonical for ${path}: ${canonicalTags[0]}`);
  assert.ok(!/<meta\b[^>]*name="robots"[^>]*content="noindex/i.test(html),
    `Official domain was accidentally made noindex at ${path}`);
}
// Guard every indexed market and product-category page against reverting to
// a GitHub Pages project URL or a wrong official-domain canonical.
const marketSlugs = ['usa', 'uk', 'uae', 'saudi-arabia', 'south-africa', 'nigeria', 'kenya', 'egypt', 'ghana', 'tanzania', 'morocco', 'angola', 'mozambique'];
const categorySlugs = ['valves', 'automation', 'pipe-fittings-flanges', 'instrumentation', 'equipment', 'sealing-items', 'mining-machinery', 'motors', 'welding', 'safety', 'process-utility', 'filtration'];
for (const path of [...marketSlugs.map(slug => `/global-presence/${slug}/`), ...categorySlugs.map(slug => `/products/${slug}/`)]) {
  const html = read(path.slice(1) + 'index.html');
  const canonical = origin + path;
  assert.ok(sitemap.includes('<loc>' + canonical + '</loc>'), `Official sitemap missing ${canonical}`);
  const tags = html.match(/<link\\b[^>]*\\brel="canonical"[^>]*>/gi) || [];
  assert.equal(tags.length, 1, `Expected exactly one canonical at ${path}`);
  assert.ok(tags[0].includes('href="' + canonical + '"'), `Non-official canonical at ${path}: ${tags[0]}`);
  assert.ok(!/<meta\\b[^>]*name="robots"[^>]*content="noindex/i.test(html), `Official page must remain indexable at ${path}`);
}
assert.ok(homepage.includes('legacy-ikinovac-pages-redirect'), 'Legacy GitHub Pages URL redirect safety script missing');
console.log('Official-domain canonical / sitemap safeguards validated for 13 markets and 12 product categories.');

const brandedIcons = ['favicon.ico', 'favicon-48.png', 'favicon-96.png', 'favicon-192.png', 'favicon-512.png', 'apple-touch-icon.png'];
for (const icon of brandedIcons) {
  const filename = join(output, icon);
  assert.ok(existsSync(filename), 'Required branded favicon missing from build: ' + icon);
}
const ico = readFileSync(join(output, 'favicon.ico'));
assert.equal(ico.readUInt16LE(0), 0, 'Favicon ICO header is invalid');
assert.equal(ico.readUInt16LE(2), 1, 'Favicon must be an ICO image');
assert.equal(ico.readUInt16LE(4), 4, 'Favicon must contain four sizes');
assert.ok(homepage.includes('/favicon.ico'), 'Homepage must advertise favicon.ico');
assert.ok(homepage.includes('/favicon-48.png'), 'Homepage must advertise the 48px branded icon');
console.log('Branded favicon ICO/PNG variants and homepage icon links validated.');
console.log(`SEO export verified: ${urlCount} official-domain sitemap URLs, valid canonicals and robots.`);
