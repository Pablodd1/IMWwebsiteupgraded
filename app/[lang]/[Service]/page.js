import styles from './page.module.scss';
import GetSVG from '@SEGMENT/getSVG';
import dynamic from 'next/dynamic';
import slides from '@JSON/testimonials.json';
import { notFound } from 'next/navigation';
const Card = dynamic(() => import('@SEGMENT/Card'));
const EmblaCarousel = dynamic(() => import('@SEGMENT/carousel/carousel'));
const Specialist = dynamic(() => import('@SEGMENT/Specialist'));
const AnimatedAction = dynamic(() => import('@ELEMENT/Action'));
const CostQueryCTA = dynamic(() => import('@SEGMENT/costCTA'));
import { getDictionary } from '@JSON/index';
import { serviceLocalKeywords } from '../../seo/local-seo-config';

const BASE_URL = 'https://innovativemedicalwellness.com';

const VALID_SERVICES = new Set([
    'anti-aging-medicine',
    'chiropractic-and-physical-therapy',
    'iv-therapy',
    'regenerative-medicine',
    'brain-health',
    'aesthetic-treatments',
    'personal-injury',
    'weight-loss-programs',
    'biohacking-and-optimization',
]);

async function loadServiceDictionary(lang, slug) {
    if (!slug || !VALID_SERVICES.has(slug)) {
        return null;
    }
    try {
        return await getDictionary(lang === 'es' ? 'es' : 'en', `subtypes.${slug}`);
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }) {
    const par = await params;
    const LANG = par?.lang === 'es' ? 'es' : 'en';
    const PAGE = par?.Service;
    const data = await loadServiceDictionary(LANG, PAGE);

    if (!data) {
        return {
            title: 'Service Not Found',
            robots: { index: false, follow: false },
        };
    }

    const localKeywords = serviceLocalKeywords[PAGE] || [];
    const allKeywords = [...(data?.meta?.keywords || []), ...localKeywords];
    const cleanTitle = (data?.meta?.title || PAGE).replace(/\s*\|\s*Innovative Medical Wellness.*$/i, '').trim();
    const rawDesc = data?.meta?.desc || data?.heroSection?.p || '';
    const description = rawDesc.length > 155 ? `${rawDesc.slice(0, 152)}...` : rawDesc;

    return {
        title: `${cleanTitle} North Miami Beach`,
        description,
        keywords: allKeywords,
        alternates: {
            canonical: `${BASE_URL}/${LANG}/${PAGE}`,
            languages: {
                'en-US': `${BASE_URL}/en/${PAGE}`,
                'es-ES': `${BASE_URL}/es/${PAGE}`,
                'x-default': `${BASE_URL}/en/${PAGE}`,
            },
        },
        openGraph: {
            title: `${cleanTitle} | Innovative Medical Wellness North Miami Beach`,
            description,
            url: `${BASE_URL}/${LANG}/${PAGE}`,
            siteName: 'Innovative Medical Wellness',
            images: [
                {
                    url: `/raster/departs/${PAGE}/Innovative Medical Wellness - ${PAGE}.webp`,
                    width: 1200,
                    height: 630,
                    alt: `${cleanTitle} - North Miami Beach`,
                },
            ],
            locale: LANG === 'es' ? 'es_ES' : 'en_US',
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${cleanTitle} | North Miami Beach`,
            description,
            images: [`/raster/departs/${PAGE}/Innovative Medical Wellness - ${PAGE}.webp`],
        },
    };
}

const Page = async ({ params }) => {
    const par = await params;
    const LANG = par?.lang === 'es' ? 'es' : 'en';
    const PAGE = par?.Service;
    const data = await loadServiceDictionary(LANG, PAGE);

    if (!data) {
        notFound();
    }

    const cost_data = await getDictionary(LANG, `general.costCTA`);

    const serviceSchema = {
        '@context': 'https://schema.org',
        '@type': 'MedicalWebPage',
        '@id': `${BASE_URL}/${LANG}/${PAGE}#medicalwebpage`,
        name: data?.meta?.title,
        description: data?.meta?.desc,
        url: `${BASE_URL}/${LANG}/${PAGE}`,
        inLanguage: LANG === 'es' ? 'es-ES' : 'en-US',
        mainEntity: {
            '@type': 'MedicalProcedure',
            name: data?.heroSection?.h1,
            description: data?.heroSection?.p,
            procedureType: data?.meta?.title,
            serviceType: 'Medical Procedure',
            provider: {
                '@type': 'MedicalClinic',
                '@id': `${BASE_URL}/#medicalclinic`,
            },
            areaServed: [
                { '@type': 'City', name: 'North Miami Beach' },
                { '@type': 'City', name: 'Aventura' },
                { '@type': 'City', name: 'Miami Beach' },
                { '@type': 'City', name: 'Miami' },
            ],
        },
        breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
                {
                    '@type': 'ListItem',
                    position: 1,
                    name: LANG === 'es' ? 'Inicio' : 'Home',
                    item: `${BASE_URL}/${LANG}`,
                },
                {
                    '@type': 'ListItem',
                    position: 2,
                    name: data?.meta?.title,
                    item: `${BASE_URL}/${LANG}/${PAGE}`,
                },
            ],
        },
    };

    return (
        <main className={styles.Page}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
            />

            <section className={styles.hero} style={{ backgroundImage: `url('/raster/departs/${PAGE}/Innovative Medical Wellness - ${PAGE}.webp')` }}>
                <GetSVG num={5} />
                <div className={styles.heroContent}>
                    <h1>{data.heroSection.h1} <br />
                        <span style={{ fontSize: '0.5em', fontWeight: 400 }}>
                            {LANG === 'es' ? 'en North Miami Beach, FL' : 'in North Miami Beach, FL'}
                        </span>
                    </h1>
                    <p>{data.heroSection.p}</p>
                </div>
                <GetSVG num={2} />
            </section>
            <Card PAGE={PAGE} data={data.services} LANG={LANG} />
            <CostQueryCTA services={data.services.map(x => x.heading)} data={cost_data} />
            <Specialist LANG={LANG} />
            <section className={styles.testimonials}>
                <h2>{data.story.h2}</h2>
                <EmblaCarousel slides={slides} />
            </section>
            <section className={styles.cta}>
                <h2>{data.cta.h2}</h2>
                <AnimatedAction
                    href={data.cta.link}
                    label={data.cta.btn}
                    icon="arrow-white"
                    hoverIcon="arrow-blue"
                    iconAlt="arrow right"
                    iconSize="17"
                    btnclass={["darkBlue"]}
                />
            </section>
        </main>
    );
};

export default Page;
