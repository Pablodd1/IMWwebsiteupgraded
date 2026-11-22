export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/llms.txt',
          '/llms-full.txt',
          '/agent-permissions.json',
          '/sitemap.xml',
          '/raster/',
          '/svg/',
          '/logos/',
        ],
        disallow: [
          '/private/',
          '/admin/',
          '/api/',
          '/server/',
          '/forms/',
          '/404',
          '/500',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/private/', '/admin/', '/api/', '/server/', '/forms/'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: ['/raster/', '/svg/', '/logos/', '/gallery/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/private/', '/admin/', '/api/', '/server/', '/forms/'],
      },
      {
        userAgent: 'DuckDuckBot',
        allow: '/',
      },
      {
        userAgent: 'GPTBot',
        allow: ['/', '/llms.txt', '/llms-full.txt', '/agent-permissions.json', '/sitemap.xml'],
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: ['/', '/llms.txt', '/llms-full.txt', '/agent-permissions.json', '/sitemap.xml'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: ['/', '/llms.txt', '/llms-full.txt', '/agent-permissions.json', '/sitemap.xml'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: ['/', '/llms.txt', '/llms-full.txt', '/agent-permissions.json', '/sitemap.xml'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: ['/', '/llms.txt', '/llms-full.txt', '/agent-permissions.json', '/sitemap.xml'],
      },
      {
        userAgent: 'anthropic-ai',
        allow: ['/', '/llms.txt', '/llms-full.txt', '/agent-permissions.json', '/sitemap.xml'],
      },
      {
        userAgent: 'Google-Extended',
        allow: ['/', '/llms.txt', '/llms-full.txt', '/agent-permissions.json'],
      },
      {
        userAgent: 'Applebot-Extended',
        allow: ['/', '/llms.txt', '/llms-full.txt'],
      },
      {
        userAgent: 'meta-externalagent',
        allow: ['/', '/llms.txt', '/llms-full.txt'],
      },
    ],
    sitemap: 'https://innovativemedicalwellness.com/sitemap.xml',
    host: 'https://innovativemedicalwellness.com',
  };
}
