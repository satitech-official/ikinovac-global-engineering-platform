const pagesRepository = "ikinovac-global-engineering-platform";

/**
 * Resolve public assets in both local development and the repository-scoped
 * GitHub Pages deployment. Static HTML is also rebased during export, so this
 * stays correct before and after client hydration on deeply nested routes.
 */
export function publicAsset(path: string) {
  const cleanPath = path.replace(/^\/+/, "");
  const isGitHubPages = typeof window !== "undefined" && window.location.hostname.endsWith(".github.io");
  return `${isGitHubPages ? `/${pagesRepository}` : ""}/${cleanPath}`;
}
