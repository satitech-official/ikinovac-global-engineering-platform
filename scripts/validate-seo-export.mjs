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
console.log(`SEO export verified: ${urlCount} official-domain sitemap URLs, valid canonicals and robots.`);
