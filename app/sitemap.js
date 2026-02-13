import { getDictionary } from '@JSON/index';

export default async function sitemap() {
  const baseUrl = 'https://innovativemedicalwellness.com';
  const languages = ['en', 'es'];
  
  // Get all services and departments
  const enServices = await getDictionary('en', 'general.navs');
  const esServices = await getDictionary('es', 'general.navs');
  
  const services = [];
  
  // Extract service URLs from navigation
  enServices.forEach(group => {
    if (group.nav) {
      group.nav.forEach(item => {
        if (item.href && item.href !== '/contact' && item.href !== '/about') {
          services.push({
            url: item.href,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
          });
        }
      });
    }
  });

  // Main pages
  const staticPages = [
    { path: '', priority: 1.0, changefreq: 'daily' },
    { path: '/about', priority: 0.9, changefreq: 'weekly' },
    { path: '/contact', priority: 0.9, changefreq: 'weekly' },
    { path: '/terms', priority: 0.5, changefreq: 'monthly' },
    { path: '/v-tone', priority: 0.8, changefreq: 'weekly' },
  ];

  // Generate sitemap entries for all languages
  const entries = [];
  
  languages.forEach(lang => {
    // Static pages
    staticPages.forEach(page => {
      entries.push({
        url: `${baseUrl}/${lang}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changefreq,
        priority: page.priority,
        alternates: {
          languages: {
            'en-US': `${baseUrl}/en${page.path}`,
            'es-ES': `${baseUrl}/es${page.path}`,
          },
        },
      });
    });

    // Service pages
    services.forEach(service => {
      entries.push({
        url: `${baseUrl}/${lang}${service.url}`,
        lastModified: new Date(),
        changeFrequency: service.changeFrequency || 'weekly',
        priority: service.priority || 0.8,
        alternates: {
          languages: {
            'en-US': `${baseUrl}/en${service.url}`,
            'es-ES': `${baseUrl}/es${service.url}`,
          },
        },
      });
    });
  });

  // Add images to main pages
  const mainPagesWithImages = entries.map(entry => {
    if (entry.priority >= 0.9) {
      return {
        ...entry,
        images: [
          {
            loc: `${baseUrl}/raster/hero_cinematic.png`,
            title: 'Innovative Medical Wellness Clinic',
            caption: 'Integrative wellness and regenerative medicine in North Miami Beach',
          },
          {
            loc: `${baseUrl}/raster/logo-512.webp`,
            title: 'Innovative Medical Wellness Logo',
          },
        ],
      };
    }
    return entry;
  });

  return mainPagesWithImages;
}
