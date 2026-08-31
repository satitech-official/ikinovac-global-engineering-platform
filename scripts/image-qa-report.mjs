import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const audit = JSON.parse(await fs.readFile(path.join(root, 'tmp', 'commons-image-candidates.json'), 'utf8'));
const manifest = JSON.parse(await fs.readFile(path.join(root, 'data', 'image-manifest.json'), 'utf8').catch(() => '[]'));
const manifestById = new Map(manifest.map(asset => [asset.id, asset]));

const records = await Promise.all(audit.map(async ({ spec, choice }) => {
  const asset = manifestById.get(spec.id);
  const localExists = asset ? await fs.access(path.join(root, 'public', asset.localPath.replace(/^\//, ''))).then(() => true).catch(() => false) : false;
  return {
    id: spec.id,
    type: spec.entityType,
    family: spec.name,
    status: asset && localExists ? 'ready' : choice ? 'pending-local-sync' : 'needs-source-review',
    localPath: asset?.localPath || null,
    sourceUrl: asset?.sourceUrl || null,
    alt: asset?.alt || null,
    sourceFile: asset?.sourceFile || choice?.title || null
  };
}));

const duplicates = [...records.reduce((map, item) => {
  if (item.sourceFile) map.set(item.sourceFile, [...(map.get(item.sourceFile) || []), item.id]);
  return map;
}, new Map()).entries()]
  .filter(([, ids]) => ids.length > 1)
  .map(([sourceFile, ids]) => ({ sourceFile, ids }));

const summary = {
  expected: records.length,
  ready: records.filter(item => item.status === 'ready').length,
  pendingLocalSync: records.filter(item => item.status === 'pending-local-sync').length,
  needsSourceReview: records.filter(item => item.status === 'needs-source-review').length,
  duplicateSourceWarnings: duplicates.length
};

const report = { generatedAt: new Date().toISOString(), summary, records, duplicates };
await fs.writeFile(path.join(root, 'tmp', 'image-qa-report.json'), JSON.stringify(report, null, 2));
const rows = records.map(item => `| ${item.type} | ${item.family} | ${item.status} | ${item.localPath || '—'} | ${item.sourceUrl ? `[source](${item.sourceUrl})` : '—'} | ${item.alt || '—'} |`).join('\n');
const duplicateRows = duplicates.length
  ? duplicates.map(item => `| ${item.sourceFile} | ${item.ids.join(', ')} |`).join('\n')
  : '| None | — |';
await fs.writeFile(path.join(root, 'IMAGE_QA_REPORT.md'), `# IKINOVAC Global image QA report\n\n## Summary\n\n| Expected records | Ready local images | Pending local sync | Needs source review | Duplicate-source warnings |\n| ---: | ---: | ---: | ---: | ---: |\n| ${summary.expected} | ${summary.ready} | ${summary.pendingLocalSync} | ${summary.needsSourceReview} | ${summary.duplicateSourceWarnings} |\n\n## Coverage\n\n| Type | Product family / context | Status | Local asset | Source | Alt text |\n| --- | --- | --- | --- | --- | --- |\n${rows}\n\n## Duplicate-source warnings\n\n| Source file | Affected records |\n| --- | --- |\n${duplicateRows}\n`);
console.log(JSON.stringify(summary));
