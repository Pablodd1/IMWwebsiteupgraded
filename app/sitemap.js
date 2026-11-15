export default function sitemap() {
  const baseUrl = 'https://innovativemedicalwellness.com';
  const lastModified = new Date();
  const locales = ['en', 'es'];

  const staticRoutes = [
    { path: '', changeFrequency: 'weekly', priority: 1.0 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.85 },
    { path: '/support', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/v-tone', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/terms', changeFrequency: 'yearly', priority: 0.3 },
  ];

  const serviceRoutes = [
    '/chiropractic-and-physical-therapy',
    '/regenerative-medicine',
    '/iv-therapy',
    '/anti-aging-medicine',
    '/aesthetic-treatments',
    '/brain-health',
    '/personal-injury',
    '/weight-loss-programs',
    '/biohacking-and-optimization',
  ].map((path) => ({
    path,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const allRoutes = [...staticRoutes, ...serviceRoutes];

  const entries = [];
  for (const route of allRoutes) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}${route.path}`,
        lastModified,
        changeFrequency: route.changeFrequency,
        priority: locale === 'en' ? route.priority : Number(Math.max(0.2, route.priority - 0.1).toFixed(1)),
        alternates: {
          languages: {
            'en-US': `${baseUrl}/en${route.path}`,
            'es-ES': `${baseUrl}/es${route.path}`,
            'x-default': `${baseUrl}/en${route.path}`,
          },
        },
      });
    }
  }

  return entries;
}
