/** @type {import('next').NextConfig} */
const nextConfig = {
  // Make sure the bot's editable config + website JSON are bundled into the serverless functions on Vercel.
  outputFileTracingIncludes: {
    '/api/**/*': ['./bot/config/**/*', './json/en/**/*'],
  },
  async headers() {
    return [
      {
        // The embeddable script and widget iframe page must be loadable from partner sites.
        source: '/embed.js',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=300' }, { key: 'Access-Control-Allow-Origin', value: '*' }],
      },
    ];
  },
};

export default nextConfig;
