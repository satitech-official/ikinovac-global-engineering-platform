export default function manifest() {
  return {
    name: 'IKINOVAC GLOBAL',
    short_name: 'IKINOVAC',
    description: 'Global industrial sourcing, engineering procurement and project supply.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0C79D8',
    icons: [
      {
        src: '/assets/ikinovac-ig-emblem-header-v3.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      }
    ]
  };
}
