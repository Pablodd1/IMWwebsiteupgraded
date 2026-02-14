export default function sitemap() {
    const baseUrl = 'https://innovativemedicalwellness.com';

    // Base routes
    const routes = [
        '',
        '/about',
        '/support',
        '/contact',
        '/chiropractic-and-physical-therapy',
        '/regenerative-medicine',
        '/iv-therapy',
        '/anti-aging-medicine',
        '/aesthetic-treatments',
        '/brain-health',
        '/personal-injury',
        '/weight-loss-programs',
        '/biohacking-and-optimization',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
    }));

    return [...routes];
}
