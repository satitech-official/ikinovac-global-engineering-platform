const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function assetUrl(path) {
  if (!path || /^(?:https?:|data:|blob:)/i.test(path)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (!basePath || normalized === basePath || normalized.startsWith(`${basePath}/`)) return normalized;
  return `${basePath}${normalized}`;
}
