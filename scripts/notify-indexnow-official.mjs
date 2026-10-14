/**
 * Submit IKINOVAC's published official-domain sitemap to participating
 * IndexNow search engines. Google Search does not support IndexNow.
 * This one-time task uses the public ownership key already hosted by the site.
 */
const origin = 'https://www.ikinovac.com';
const key = 'f100856d1ddf4a0c7d2c5160279e5cf3';
const keyLocation = `${origin}/${key}.txt`;
const timeout = 20000;

async function fetchOrThrow(url, options = {}) {
  const response = await fetch(url, { signal: AbortSignal.timeout(timeout), ...options });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  return response;
}

const ownershipKey = (await (await fetchOrThrow(keyLocation)).text()).trim();
if (ownershipKey !== key) {
  throw new Error('IndexNow ownership key is not published correctly on the official domain.');
}

const sitemapXml = await (await fetchOrThrow(`${origin}/sitemap.xml`)).text();
const urls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((match) => match[1].trim().replace(/&amp;/g, '&'))
  .filter((url) => url.startsWith(`${origin}/`));

const urlList = [...new Set(urls)];
if (urlList.length < 30 || urlList.length > 1000) {
  throw new Error(`Unexpected official sitemap URL count (${urlList.length}); submission aborted.`);
}
if (urlList.some((url) => url.includes('github.io') || url.includes('/products/compare/'))) {
  throw new Error('Unwanted sitemap URL detected; submission aborted.');
}

const result = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: 'www.ikinovac.com',
    key,
    keyLocation,
    urlList
  }),
  signal: AbortSignal.timeout(timeout)
});
const responseBody = (await result.text()).slice(0, 500);

if (result.status !== 200 && result.status !== 202) {
  throw new Error(`IndexNow submission failed with HTTP ${result.status}: ${responseBody}`);
}
console.log(`IndexNow received ${urlList.length} official IKINOVAC URLs (HTTP ${result.status}).`);
console.log('This is discovery notification for IndexNow participants, not a Google indexing request or ranking guarantee.');
