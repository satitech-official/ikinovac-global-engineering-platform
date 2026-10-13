// Produce compact, crawlable favicon variants from the original IKINOVAC IG emblem.
// No redesign or replacement of the site's original logo is performed.
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const publicDir = join(process.cwd(), 'public');
const source = join(publicDir, 'favicon.png');
const original = await readFile(source);
const dimensions = await sharp(original).metadata();
if (!dimensions.width || !dimensions.height) throw new Error('Original IG emblem is not a valid image.');

const resizePng = size => sharp(original)
  .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ compressionLevel: 9, effort: 8 })
  .toBuffer();

for (const size of [48, 96, 192, 512]) {
  await writeFile(join(publicDir, 'favicon-' + size + '.png'), await resizePng(size));
}
await writeFile(join(publicDir, 'apple-touch-icon.png'), await resizePng(180));

// The ICO container embeds real PNG frames at 16, 32, 48 and 64 pixels.
// This gives search crawlers and legacy browsers a standard /favicon.ico endpoint.
const sizes = [16, 32, 48, 64];
const frames = await Promise.all(sizes.map(resizePng));
const header = Buffer.alloc(6 + sizes.length * 16);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
for (let i = 0; i < sizes.length; i++) {
  const position = 6 + i * 16;
  header.writeUInt8(sizes[i], position);
  header.writeUInt8(sizes[i], position + 1);
  header.writeUInt8(0, position + 2);
  header.writeUInt8(0, position + 3);
  header.writeUInt16LE(1, position + 4);
  header.writeUInt16LE(32, position + 6);
  header.writeUInt32LE(frames[i].length, position + 8);
  header.writeUInt32LE(offset, position + 12);
  offset += frames[i].length;
}
await writeFile(join(publicDir, 'favicon.ico'), Buffer.concat([header, ...frames]));
console.log('Generated branded favicon.ico and PNG variants from the IKINOVAC IG emblem.');
