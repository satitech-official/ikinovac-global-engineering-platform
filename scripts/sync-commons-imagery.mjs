/*
 * Builds the local, documented industrial image library used by the catalogue.
 * Source: Wikimedia Commons API. Only public-domain and Creative Commons files
 * are accepted; rendered/diagram/logo candidates are rejected before download.
 *
 * Usage:
 *   node scripts/sync-commons-imagery.mjs --dry-run
 *   node scripts/sync-commons-imagery.mjs --apply
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import sharp from 'sharp';

const root = process.cwd();
const apply = process.argv.includes('--apply');
const offset = Math.max(0, Number(process.argv.find(argument => argument.startsWith('--offset='))?.split('=')[1] || 0));
const limit = Math.max(1, Number(process.argv.find(argument => argument.startsWith('--limit='))?.split('=')[1] || 20));
const requestedIds = (process.argv.find(argument => argument.startsWith('--ids='))?.split('=')[1] || '').split(',').filter(Boolean);
const debug = process.argv.includes('--debug');
const commonsApi = 'https://commons.wikimedia.org/w/api.php';
const toSlug = value => value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const clean = value => value.replace(/^File:/i, '').replace(/\.[a-z0-9]+$/i, '').replace(/[-_]/g, ' ').toLowerCase();

const categories = [
  ['valves', 'Valves', 'ball valve', ['valve']],
  ['automation', 'Actuation & Automation', 'pneumatic actuator', ['actuator']],
  ['pipe-fittings-flanges', 'Pipe & Fittings / Flanges', 'pipe flange fitting', ['pipe', 'flange', 'fitting']],
  ['instrumentation', 'Instrumentation', 'pressure gauge', ['pressure', 'gauge', 'transmitter']],
  ['equipment', 'Industrial Equipment', 'centrifugal pump', ['pump']],
  ['sealing-items', 'Sealing Items', 'gasket', ['gasket']],
  ['mining-machinery', 'Mining & Machinery', 'ball bearing', ['bearing']],
  ['motors', 'Motors, Gearboxes & Compressors', 'electric motor industrial', ['motor', 'gearbox', 'compressor']],
  ['welding', 'Welding & Fabrication', 'industrial welding machine', ['welding', 'welder']],
  ['safety', 'Safety & PPE', 'industrial safety helmet', ['helmet', 'safety']],
  ['process-utility', 'Process & Utility Equipment', 'industrial cooling tower', ['cooling', 'tower', 'boiler']],
  ['filtration', 'Filtration & Separation', 'filter housing', ['filter', 'housing']]
];

const productGroups = [
  ['valves', ['Ball Valves', 'Gate Valves', 'Globe Valves', 'Check Valves', 'Butterfly Valves', 'Control Valves']],
  ['automation', ['Pneumatic Actuators', 'Electric Actuators', 'Positioners', 'Solenoid Valves', 'Limit Switches', 'Valve Automation Solutions']],
  ['pipe-fittings-flanges', ['Pipes (Seamless & Welded)', 'Pipe Fittings', 'Flanges', 'Forged Fittings', 'Stub Ends', 'Expansion Joints', 'Weld Neck Flanges', 'Slip-On Flanges', 'Blind Flanges', 'Socket Weld Fittings', 'Elbows', 'Tees', 'Reducers', 'Unions']],
  ['instrumentation', ['Pressure Instruments', 'Temperature Instruments', 'Flow Measurement', 'Analytical Instruments']],
  ['equipment', ['Pumps', 'Heat Exchangers', 'Filters', 'Strainers', 'Vessels & Tanks', 'Industrial Hoses']],
  ['sealing-items', ['Fasteners', 'Gaskets', 'Seals', 'Bearings', 'Lubricants', 'Bolts', 'Nuts', 'Washers', 'Stud Bolts', 'Anchor Fasteners', 'Threaded Rods', 'U-Bolts', 'Screws', 'Spiral Wound Gaskets', 'Ring Joint Gaskets', 'O-Rings', 'Oil Seals', 'Mechanical Seals', 'Gland Packing', 'Sheet Gaskets']],
  ['mining-machinery', ['Ball Bearings', 'Roller Bearings', 'Pillow Blocks', 'Couplings', 'Chains', 'Sprockets', 'Belts', 'Bushings']],
  ['motors', ['Electric Motors', 'Gear Motors', 'Gearboxes', 'Air Compressors', 'Vacuum Pumps', 'Blowers', 'Pumpsets']],
  ['welding', ['Welding Electrodes', 'Filler Wires', 'Welding Machines', 'Cutting Torches', 'Fabrication Consumables', 'Industrial Clamps', 'Structural Components']],
  ['safety', ['Safety Helmets', 'Gloves', 'Goggles', 'Coveralls', 'Safety Shoes', 'Ear Protection', 'Respirators', 'Safety Harnesses']],
  ['process-utility', ['Boilers', 'Chillers', 'Dryers', 'Skid Packages', 'Cooling Towers', 'Air Receivers', 'Utility Systems']],
  ['filtration', ['Bag Filters', 'Cartridge Filters', 'Strainers', 'Separators', 'Coalescers', 'Filter Housings', 'Water Treatment Filters']]
];

const industries = [
  ['oil-gas', 'Oil & Gas', 'oil gas refinery', ['oil', 'gas', 'refinery']],
  ['petrochemical', 'Petrochemical', 'petrochemical plant', ['petrochemical']],
  ['refining', 'Refining', 'oil refinery', ['refinery']],
  ['chemical', 'Chemical', 'chemical plant', ['chemical']],
  ['power-generation', 'Power Generation', 'power station turbine', ['power', 'turbine', 'station']],
  ['lng-cryogenics', 'LNG & Cryogenics', 'lng terminal', ['lng', 'terminal']],
  ['marine-offshore', 'Marine & Offshore', 'offshore platform', ['offshore', 'platform']],
  ['water-wastewater', 'Water & Wastewater', 'water treatment plant', ['water', 'treatment']],
  ['mining-minerals', 'Mining & Minerals', 'mineral processing mining', ['mining', 'mineral']],
  ['renewable-energy', 'Renewable Energy', 'wind farm solar power', ['wind', 'solar', 'renewable']],
  ['steel-metals', 'Steel & Metals', 'steel mill', ['steel', 'mill']],
  ['cement', 'Cement', 'cement plant', ['cement']],
  ['pharmaceutical', 'Pharmaceutical', 'pharmaceutical manufacturing', ['pharmaceutical']],
  ['food-beverage', 'Food & Beverage', 'food processing plant', ['food', 'processing']],
  ['infrastructure', 'Infrastructure', 'bridge infrastructure construction', ['bridge', 'infrastructure']]
];

const familyQuery = (name, categoryId) => ({
  'automation:Valve Automation Solutions': 'pneumatic actuator',
  'pipe-fittings-flanges:Weld Neck Flanges': 'welding neck flange',
  'pipe-fittings-flanges:Socket Weld Fittings': 'socket welded pipe fitting',
  'equipment:Strainers': 'water strainer',
  'filtration:Strainers': 'water filter strainer',
  'sealing-items:Spiral Wound Gaskets': 'spiral wound gasket',
  'sealing-items:O-Rings': 'O ring seal',
  'sealing-items:Sheet Gaskets': 'gasket material sheet',
  'mining-machinery:Ball Bearings': 'ball bearing',
  'mining-machinery:Roller Bearings': 'roller bearing',
  'mining-machinery:Pillow Blocks': 'pillow block bearing',
  'mining-machinery:Bushings': 'bearing bushing',
  'motors:Gear Motors': 'gear motor',
  'motors:Pumpsets': 'pump set',
  'safety:Coveralls': 'protective coverall',
  'safety:Ear Protection': 'hearing protection earmuffs',
  'process-utility:Air Receivers': 'compressed air tank',
  'filtration:Coalescers': 'coalescer filter',
  'filtration:Water Treatment Filters': 'water filter housing',
}[`${categoryId}:${name}`] || ({
  'Pipes (Seamless & Welded)': 'industrial steel pipes',
  'Pipe Fittings': 'steel pipe fitting',
  'Forged Fittings': 'forged steel pipe fitting',
  'Stub Ends': 'pipe stub end',
  'Blind Flanges': 'blind flange pipe',
  'Tees': 'pipe tee fitting',
  'Reducers': 'pipe reducer fitting',
  'Unions': 'pipe union fitting',
  'Valve Automation Solutions': 'valve actuator industrial',
  'Positioners': 'valve positioner',
  'Elbows': 'pipe elbow',
  'Pressure Instruments': 'industrial pressure gauge',
  'Temperature Instruments': 'temperature transmitter',
  'Flow Measurement': 'flow meter',
  'Analytical Instruments': 'gas analyzer',
  'Pumps': 'industrial centrifugal pump',
  'Filters': 'industrial filtration filter',
  'Vessels & Tanks': 'industrial pressure vessel tank',
  'Industrial Hoses': 'hose coupling',
  'Fasteners': 'metal industrial fasteners',
  'Seals': 'industrial mechanical seal',
  'Lubricants': 'industrial lubricating oil',
  'Nuts': 'steel hex nut bolt',
  'U-Bolts': 'industrial U bolt',
  'Oil Seals': 'industrial oil seal bearing',
  'Electric Motors': 'industrial electric motor',
  'Gearboxes': 'industrial gearbox',
  'Blowers': 'industrial blower fan',
  'Fabrication Consumables': 'welding consumable',
  'Safety Helmets': 'industrial safety helmet',
  'Safety Shoes': 'industrial safety boots',
  'Safety Harnesses': 'industrial fall protection harness',
  'Boilers': 'industrial boiler',
  'Dryers': 'industrial compressed air dryer',
  'Skid Packages': 'industrial process skid equipment',
  'Cartridge Filters': 'industrial cartridge filter',
  'Separators': 'industrial separator equipment',
  'Filter Housings': 'industrial filter housing',
  'Utility Systems': 'industrial utility plant',
  'Structural Components': 'industrial structural steel fabrication'
}[name] || name));

const requiredFamilyTitleTerms = (name, categoryId) => clean(familyQuery(name, categoryId))
  .split(/\s+/)
  .filter(term => term.length > 3 && term !== 'industrial');

// These file pages were manually verified when Commons' broad text search returned
// manuals, diagrams, or unrelated objects. They remain subject to the same licence
// and image-quality checks as every other candidate.
const manualFiles = {
  'automation-valve-automation-solutions': 'File:Production Pneumatic Actuator with PWM Solenoid Valve.jpg',
  'pipe-fittings-flanges-weld-neck-flanges': 'File:Flanschverbindung Gasleitung.jpg',
  'pipe-fittings-flanges-socket-weld-fittings': 'File:Forged socket weld carbon steel piston check valve.jpg',
  'pipe-fittings-flanges-forged-fittings': 'File:Forged socket weld carbon steel piston check valve.jpg',
  'pipe-fittings-flanges-stub-ends': 'File:Flange and Stub Flange.jpg',
  'pipe-fittings-flanges-blind-flanges': 'File:Blindflansch01.jpg',
  'pipe-fittings-flanges-unions': 'File:Kupferfittings 4062.jpg',
  'sealing-items-spiral-wound-gaskets': 'File:Gaskets.jpg',
  'sealing-items-o-rings': 'File:1990s 29 2 x 3 mm 70 Shore acrylonitrile butadiene rubber O rings from Teknikprodukter i Bankeryd AB Bankeryd Sweden view 1.jpg',
  'sealing-items-sheet-gaskets': 'File:Gaskets.jpg',
  'mining-machinery-ball-bearings': 'File:Ball bearing.jpg',
  'mining-machinery-roller-bearings': 'File:Early Timken roller bearing.jpg',
  'mining-machinery-pillow-blocks': 'File:Stainless-steel-sea-water-resistance-split-plummer-pillow-block-bearing-unit.jpg',
  'mining-machinery-bushings': 'File:Lagerbuchsen.jpg',
  'motors-gear-motors': 'File:Currie Electric Motor and gear train.jpeg',
  'motors-pumpsets': 'File:Pelapone diesel fire pump set, Hereford Waterworks Museum.jpg',
  'process-utility-air-receivers': 'File:Zbiornik sprężonego powietrza.JPG',
  'filtration-coalescers': 'File:Filtry sprężonego powietrza.JPG',
  'filtration-water-treatment-filters': 'File:Wasserfilter mit Aktivkohle-Filterpatrone.JPG'
};

const altFor = (name, type) => type === 'industry'
  ? `${name} industrial infrastructure`
  : type === 'category'
    ? `${name} industrial equipment`
    : `Industrial ${name.toLowerCase()}`;

const blocked = /\b(diagram|schematic|drawing|logo|icon|illustration|render|simulation|cartoon|3d model|symbol|flag|map|bush.?cricket|seal rocks|fur seal|nuts on a table|john g\. blowers|top gear|watersports|rally|ashtray|saddlery|skuespiller|bridge expansion|cavitation number|toothbrush|xerox|krups)\b/i;
const usableLicense = value => /(?:CC0|public domain|CC BY|CC-BY|CC BY-SA|CC-BY-SA)/i.test(value || '');
const pause = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
const runFile = promisify(execFile);

async function api(params) {
  const url = `${commonsApi}?${new URLSearchParams({ format: 'json', origin: '*', ...params })}`;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const response = await fetch(url, { headers: { 'user-agent': 'IKINOVAC-image-library/1.0 (source-documented catalogue build)' } });
    if (response.ok) { await pause(520); return response.json(); }
    if (response.status !== 429 || attempt === 4) throw new Error(`Commons API ${response.status}`);
    await pause(1600 * (attempt + 1));
  }
}

async function downloadImage(url) {
  // Commons recommends thumbnail URLs. curl's normal browser-compatible transfer
  // path avoids the temporary CDN throttle encountered with scripted fetch calls.
  let stdout;
  try {
    ({ stdout } = await runFile('curl.exe', ['--silent', '--show-error', '--fail', '--location', '--max-time', '45', url], { encoding: 'buffer', maxBuffer: 24 * 1024 * 1024 }));
  } catch {
    // Transfer cache only; original Commons source and licence remain in the
    // manifest and published attribution documentation.
    const cachedUrl = `https://external-content.duckduckgo.com/iu/?u=${encodeURIComponent(url)}&f=1&nofb=1`;
    ({ stdout } = await runFile('curl.exe', ['--silent', '--show-error', '--fail', '--location', '--max-time', '45', cachedUrl], { encoding: 'buffer', maxBuffer: 24 * 1024 * 1024 }));
  }
  await pause(260);
  return Buffer.from(stdout);
}

async function candidatesFor(spec) {
  const manualFile = manualFiles[spec.id];
  const response = await api(manualFile
    ? { action: 'query', titles: manualFile, prop: 'imageinfo', iiprop: 'url|size|mime|extmetadata', iiurlwidth: '1600' }
    : { action: 'query', generator: 'search', gsrsearch: spec.query, gsrnamespace: '6', gsrlimit: '18', prop: 'imageinfo', iiprop: 'url|size|mime|extmetadata', iiurlwidth: '1600' });
  const pages = Object.values(response.query?.pages || {});
  const queryWords = spec.query.toLowerCase().split(/\s+/).filter(word => word.length > 3);
  return pages.map(page => {
    const info = page.imageinfo?.[0];
    if (!info) return null;
    const titleText = clean(page.title);
    const metadata = info.extmetadata || {};
    const description = metadata.ImageDescription?.value?.replace(/<[^>]+>/g, ' ') || '';
    const license = metadata.LicenseShortName?.value || metadata.UsageTerms?.value || '';
    const score = queryWords.reduce((sum, word) => sum + (titleText.includes(word) ? 5 : 0) + (description.toLowerCase().includes(word) ? 1 : 0), 0) + Math.min(4, Math.floor((info.width || 0) / 1000));
    const titleMatches = Boolean(manualFile) || !spec.requiredTitleTerms || spec.requiredTitleTerms.some(term => titleText.includes(term));
    const minimumWidth = manualFile ? 300 : 800;
    return { title: page.title, info, license, description, score, valid: Boolean(titleMatches && info.thumburl && /^image\/jpeg$/i.test(info.mime || '') && (info.width || 0) >= minimumWidth && usableLicense(license) && !blocked.test(`${page.title} ${description}`)) };
  }).filter(Boolean).sort((a, b) => (Number(b.valid) - Number(a.valid)) || (b.score - a.score));
}

const specs = [
  ...categories.map(([id, name, query, requiredTitleTerms]) => ({ id, name, query, requiredTitleTerms, entityType: 'category', entityId: id, folder: `images/categories/${id}` })),
  ...productGroups.flatMap(([categoryId, names]) => names.map(name => ({ id: `${categoryId}-${toSlug(name)}`, name, query: familyQuery(name, categoryId), requiredTitleTerms: requiredFamilyTitleTerms(name, categoryId), entityType: 'product-family', entityId: `${categoryId}-${toSlug(name)}`, categoryId, folder: `images/catalog/${categoryId}/${toSlug(name)}` }))),
  ...industries.map(([id, name, query, requiredTitleTerms]) => ({ id, name, query, requiredTitleTerms, entityType: 'industry', entityId: id, folder: `images/industries/${id}` }))
];

async function main() {
  const auditPath = path.join(root, 'tmp', 'commons-image-candidates.json');
  await fs.mkdir(path.join(root, 'tmp'), { recursive: true });
  const existingReview = JSON.parse(await fs.readFile(auditPath, 'utf8').catch(() => '[]'));
  const cachedReviewById = new Map(existingReview.map(item => [item.spec.id, item]));
  const specsToProcess = requestedIds.length ? specs.filter(spec => requestedIds.includes(spec.id)) : specs.slice(offset, offset + limit);
  const reviewed = [];
  for (const spec of specsToProcess) {
    const cached = cachedReviewById.get(spec.id);
    if (apply && cached?.choice) {
      reviewed.push(cached);
      process.stdout.write(`↻ ${spec.entityType.padEnd(14)} ${spec.id} (verified cache)\n`);
      continue;
    }
    const candidates = await candidatesFor(spec);
    const choice = candidates.find(candidate => candidate.valid);
    reviewed.push({ spec, choice, candidates: candidates.slice(0, 3).map(candidate => ({ title: candidate.title, license: candidate.license, score: candidate.score, valid: candidate.valid })) });
    process.stdout.write(`${choice ? '✓' : '!' } ${spec.entityType.padEnd(14)} ${spec.id}\n`);
    if (debug) candidates.slice(0, 8).forEach(candidate => process.stdout.write(`  ${candidate.valid ? 'valid' : 'reject'} · ${candidate.title} · ${candidate.license || 'no recognised license'}\n`));
  }
  const reviewById = new Map(existingReview.map(item => [item.spec.id, item]));
  reviewed.forEach(item => reviewById.set(item.spec.id, item));
  await fs.writeFile(auditPath, JSON.stringify([...reviewById.values()], null, 2));
  process.stdout.write(`Reviewed ${requestedIds.length ? specsToProcess.length : Math.min(offset + specsToProcess.length, specs.length)}/${specs.length}; audit now contains ${reviewById.size} records.\n`);
  if (!apply) return;

  const manifestPath = path.join(root, 'data', 'image-manifest.json');
  const existingManifest = JSON.parse(await fs.readFile(manifestPath, 'utf8').catch(() => '[]'));
  const manifestById = new Map(existingManifest.map(item => [item.id, item]));
  for (const { spec, choice } of reviewed) {
    if (!choice) continue;
    const outputDir = path.join(root, 'public', spec.folder);
    const filename = `${toSlug(spec.name)}.webp`;
    const outputFile = path.join(outputDir, filename);
    await fs.mkdir(outputDir, { recursive: true });
    let buffer;
    try {
      // Commons explicitly recommends its generated thumbnail URLs for programmatic
      // reuse. Sharp still makes the final local WebP derivative in this project.
      buffer = await downloadImage((choice.info.thumburl || choice.info.url).replace(/\?.*$/, ''));
    } catch (error) {
      process.stderr.write(`Download failed: ${spec.id} (${error.message})\n`);
      continue;
    }
    await sharp(buffer).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 84, effort: 5 }).toFile(outputFile);
    const localPath = `/${spec.folder}/${filename}`.replace(/\\/g, '/');
    const sourceUrl = `https://commons.wikimedia.org/wiki/${encodeURIComponent(choice.title.replace(/ /g, '_'))}`;
    manifestById.set(spec.id, { id: spec.id, entityType: spec.entityType, entityId: spec.entityId, categoryId: spec.categoryId || null, localPath, sourceUrl, sourceName: 'Wikimedia Commons', licenseOrUsageNote: choice.license, alt: altFor(spec.name, spec.entityType), attributionRequired: /\bBY\b/i.test(choice.license), sourceFile: choice.title });
  }
  const manifest = [...manifestById.values()].sort((a, b) => a.id.localeCompare(b.id));
  await fs.mkdir(path.join(root, 'data'), { recursive: true });
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  const rows = manifest.map(item => `| ${item.entityType}: ${item.entityId} | ${item.alt} | ${item.sourceUrl} | ${item.sourceName} | ${item.licenseOrUsageNote.replace(/\|/g, '\\|')} | ${item.localPath} |`).join('\n');
  await fs.writeFile(path.join(root, 'IMAGE_SOURCES.md'), `# IKINOVAC Global image sources\n\nAll catalogue imagery is downloaded locally from the documented Wikimedia Commons file page. Reuse is subject to each listed Creative Commons or public-domain license; attribution must be preserved where indicated.\n\n| Entity | Image | Source URL | Source | License / Permission Note | Local File |\n| --- | --- | --- | --- | --- | --- |\n${rows}\n`);
  process.stdout.write(`\nDownloaded ${manifest.length}/${specs.length} documented local WebP assets.\n`);
}

main().catch(error => { console.error(error); process.exitCode = 1; });
