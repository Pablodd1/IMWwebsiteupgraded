export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/private/',
          '/admin/',
          '/api/',
          '/server/',
          '/*.json$',
          '/_next/',
          '/404',
          '/500',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/private/',
          '/admin/',
        ],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: [
          '/raster/',
          '/svg/',
          '/logos/',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
      },
      {
        userAgent: 'DuckDuckBot',
        allow: '/',
      },
    ],
    sitemap: 'https://innovativemedicalwellness.com/sitemap.xml',
    host: 'https://innovativemedicalwellness.com',
  };
}
