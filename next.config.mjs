/** @type {import('next').NextConfig} */
const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === 'true';
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/').pop() || 'ikinovac-global-engineering-platform';
const basePath = isGitHubPagesBuild ? `/${repositoryName}` : '';

const nextConfig = {
  output: isGitHubPagesBuild ? 'export' : undefined,
  trailingSlash: isGitHubPagesBuild,
  basePath,
  assetPrefix: basePath,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath }
};

export default nextConfig;
