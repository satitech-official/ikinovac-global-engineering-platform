import imageManifest from '@/data/image-manifest.json';

// The manifest is the single source of truth for every local catalogue image.
// Components consume a local path and accessible alt text, never a remote image URL.
const imageryById = new Map(imageManifest.map(asset => [asset.id, asset]));

export const getImageAsset = (...ids) => ids.map(id => imageryById.get(id)).find(Boolean) || null;

export const getImagePath = (ids, fallback = null) => {
  const candidates = Array.isArray(ids) ? ids : [ids];
  return getImageAsset(...candidates)?.localPath || fallback;
};

export const getImageAlt = (ids, fallback = 'Industrial engineering equipment') => {
  const candidates = Array.isArray(ids) ? ids : [ids];
  return getImageAsset(...candidates)?.alt || fallback;
};

export { imageManifest };
