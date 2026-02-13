import styles from './page.module.scss';
import GetSVG from '@SEGMENT/getSVG';
import dynamic from 'next/dynamic';
import slides from '@JSON/testimonials.json'
import Script from 'next/script';
const Card = dynamic(() => import('@SEGMENT/Card'));
const EmblaCarousel = dynamic(() => import('@SEGMENT/carousel/carousel'));
const Specialist = dynamic(() => import('@SEGMENT/Specialist'));
const AnimatedAction = dynamic(() => import('@ELEMENT/Action'));
const CostQueryCTA = dynamic(() => import('@SEGMENT/costCTA'));
import NotFound from '../not-found';
import { getDictionary } from '@JSON/index'
import { serviceLocalKeywords } from '../../seo/local-seo-config';

export async function generateMetadata({ params, searchParams }, parent) {
    const par = await params
    const LANG = par.lang
    const PAGE = par.Service;
    let data;
    data = PAGE && await getDictionary(LANG || 'en', `subtypes.${PAGE}`);

    // Get local keywords for this service
    const localKeywords = serviceLocalKeywords[PAGE] || [];
    const allKeywords = [...(data?.meta?.keywords || []), ...localKeywords];

    return {
        title: `${data?.meta?.title} | North Miami Beach, Aventura, Miami`,
        description: `${data?.meta?.desc} Serving North Miami Beach, Aventura, Miami Beach, and Miami, FL. Book your consultation today!`,
        keywords: allKeywords,
        alternates: {
            canonical: `https://innovativemedicalwellness.com/${LANG}/${PAGE}`,
            languages: {
                'en-US': `https://innovativemedicalwellness.com/en/${PAGE}`,
                'es-ES': `https://innovativemedicalwellness.com/es/${PAGE}`,
            },
        },
        openGraph: {
            title: `${data?.meta?.title} | North Miami Beach`,
            description: `${data?.meta?.desc} Expert care in North Miami Beach, Aventura & Miami.`,
            url: `https://innovativemedicalwellness.com/${LANG}/${PAGE}`,
            siteName: 'Innovative Medical Wellness',
            images: [
                {
                    url: `/raster/departs/${PAGE}/Innovative Medical Wellness - ${PAGE}.webp`,
                    width: 1200,
                    height: 630,
                    alt: `${data?.meta?.title} - North Miami Beach`,
                },
            ],
            locale: 'en_US',
            type: 'article',
        },
    }
}

const Page = async ({ params }) => {
    const par = await params
    const LANG = par.lang
    let PAGE = par.Service;
    let data;
    if (!PAGE)
        <NotFound />;
    data = PAGE && await getDictionary(LANG || 'en', `subtypes.${PAGE}`);
    const cost_data = await getDictionary(LANG || 'en', `general.costCTA`);

    // Service Schema with Local SEO
    const serviceSchema = {
        '@context': 'https://schema.org',
        '@type': 'MedicalWebPage',
        '@id': `https://innovativemedicalwellness.com/${LANG}/${PAGE}#medicalwebpage`,
        name: data?.meta?.title,
        description: data?.meta?.desc,
        url: `https://innovativemedicalwellness.com/${LANG}/${PAGE}`,
        mainEntity: {
            '@type': 'MedicalProcedure',
            name: data?.heroSection?.h1,
            description: data?.heroSection?.p,
            procedureType: data?.meta?.title,
            serviceType: 'Medical Procedure',
            provider: {
                '@type': 'MedicalClinic',
                '@id': 'https://innovativemedicalwellness.com/#medicalclinic',
            },
            areaServed: [
                {
                    '@type': 'City',
                    name: 'North Miami Beach',
                },
                {
                    '@type': 'City',
                    name: 'Aventura',
                },
                {
                    '@type': 'City',
                    name: 'Miami Beach',
                },
                {
                    '@type': 'City',
                    name: 'Miami',
                },
            ],
        },
        breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
                {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: 'https://innovativemedicalwellness.com',
                },
                {
                    '@type': 'ListItem',
                    position: 2,
                    name: data?.meta?.title,
                    item: `https://innovativemedicalwellness.com/${LANG}/${PAGE}`,
                },
            ],
        },
    };

    return (
        <main className={styles.Page} >
            {/* Service Schema */}
            <Script
                id={`service-schema-${PAGE}`}
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
            />

            <section className={styles.hero} style={{ backgroundImage: `url('/raster/departs/${PAGE}/Innovative Medical Wellness - ${PAGE}.webp')` }} >
                <GetSVG num={5} />
                <div className={styles.heroContent}>
                    <h1>{data.heroSection.h1} <br />
                        <span style={{ fontSize: '0.5em', fontWeight: 400 }}>in North Miami Beach, FL</span>
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
