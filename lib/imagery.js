import imageManifest from '@/data/image-manifest.json';

// The manifest is the single source of truth for every local catalogue image.
// Components consume a local path and accessible alt text, never a remote image URL.
const imageryById = new Map(imageManifest.map(asset => [asset.id, asset]));

// The approved IKINOVAC image pack uses filenames without the word "and" for
// these two product families, while the catalogue slugifier expands "&" to
// "and". Point the catalogue IDs at the approved local artwork so the old
// fallback/legacy photos are never shown.
const approvedPathOverrides = {
  'pipe-fittings-flanges-pipes-seamless-and-welded': '/images/catalog/pipe-fittings-flanges/pipes-seamless-welded/pipes-seamless-welded.webp',
  'equipment-vessels-and-tanks': '/images/catalog/equipment/vessels-tanks/vessels-tanks.webp'
};

export const getImageAsset = (...ids) => ids.map(id => imageryById.get(id)).find(Boolean) || null;

export const getImagePath = (ids, fallback = null) => {
  const candidates = Array.isArray(ids) ? ids : [ids];
  const approvedOverride = candidates.map(id => approvedPathOverrides[id]).find(Boolean);
  return approvedOverride || getImageAsset(...candidates)?.localPath || fallback;
};

export const getImageAlt = (ids, fallback = 'Industrial engineering equipment') => {
  const candidates = Array.isArray(ids) ? ids : [ids];
  return getImageAsset(...candidates)?.alt || fallback;
};

export { imageManifest };
