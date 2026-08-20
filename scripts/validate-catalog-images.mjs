import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const source = fs.readFileSync(path.join(root, "data", "catalog.ts"), "utf8");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "data", "product-images.json"), "utf8"));
const start = source.indexOf("const catalogSeeds");
const end = source.indexOf("\n};", start);
if (start < 0 || end < 0) throw new Error("Unable to inspect product catalogue data.");

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const block = source.slice(start, end);
const categoryMatches = [...block.matchAll(/^\s*(?:"([^"]+)"|([a-z][a-z-]*)):\s*\[/gm)];
const primaryImages = categoryMatches.flatMap((match, index) => {
  const category = match[1] ?? match[2];
  const nextStart = categoryMatches[index + 1]?.index ?? block.length;
  return [...block.slice(match.index, nextStart).matchAll(/\["([^"]+)"/g)]
    .map((entry) => manifest[`${category}/${slugify(entry[1])}`]?.src ?? "");
});

const duplicateImages = primaryImages.filter((image, index) => primaryImages.indexOf(image) !== index);
const isRemoteImage = (image) => /^https?:\/\//i.test(image);
const missingImages = primaryImages.filter((image) => !image || (!isRemoteImage(image) && !fs.existsSync(path.join(root, "public", image))));
const hashes = primaryImages
  .filter((image) => image && !isRemoteImage(image))
  .map((image) => crypto.createHash("sha256").update(fs.readFileSync(path.join(root, "public", image))).digest("hex"));
const duplicateFileHashes = hashes.filter((hash, index) => hashes.indexOf(hash) !== index);

console.log("Duplicate product images:", JSON.stringify([...new Set(duplicateImages)]));
console.log("Primary images are unique:", new Set(primaryImages).size === primaryImages.length);
console.log("Missing product images:", JSON.stringify(missingImages));
console.log("Duplicate product file hashes:", JSON.stringify([...new Set(duplicateFileHashes)]));

if (duplicateImages.length || missingImages.length || duplicateFileHashes.length) process.exitCode = 1;
