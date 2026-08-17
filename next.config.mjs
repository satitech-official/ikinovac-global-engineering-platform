/** @type {import('next').NextConfig} */
const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === 'true';
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/').pop() || 'ikinovac-global-engineering-platform';
const publicBasePath = isGitHubPagesBuild ? `/${repositoryName}` : '';

const nextConfig = {
  output: isGitHubPagesBuild ? 'export' : undefined,
  trailingSlash: isGitHubPagesBuild,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: publicBasePath }
};

export default nextConfig;
