import React from 'react';
import Team from '@SEGMENT/team';
import Values from '@SEGMENT/values';
import History from '@SEGMENT/history';
import styles from './page.module.scss';
import { getDictionary } from '@JSON/index';

const BASE_URL = 'https://innovativemedicalwellness.com';

export async function generateMetadata({ params }) {
  const par = await params;
  const LANG = par?.lang === 'es' ? 'es' : 'en';
  const isEs = LANG === 'es';

  const title = isEs
    ? 'Sobre Nosotros | Clínica Médica en North Miami Beach'
    : 'About Our Integrative Medical Team in North Miami Beach';
  const description = isEs
    ? 'Conoce al equipo médico de Innovative Medical Wellness. Más de 40 años brindando medicina integrativa y regenerativa en North Miami Beach y Aventura.'
    : 'Meet the physicians and specialists at Innovative Medical Wellness in North Miami Beach, FL. Over 40 years of integrative, holistic, and regenerative care.';

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${LANG}/about`,
      languages: {
        'en-US': `${BASE_URL}/en/about`,
        'es-ES': `${BASE_URL}/es/about`,
        'x-default': `${BASE_URL}/en/about`,
      },
    },
    openGraph: {
      title: `${title} | Innovative Medical Wellness`,
      description,
      url: `${BASE_URL}/${LANG}/about`,
      siteName: 'Innovative Medical Wellness',
      images: [
        {
          url: '/raster/Innovative Medical Wellness - about.webp',
          width: 1200,
          height: 630,
          alt: 'About Innovative Medical Wellness',
        },
      ],
      locale: isEs ? 'es_ES' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/raster/Innovative Medical Wellness - about.webp'],
    },
  };
}

const About = async ({ params }) => {
  const par = await params;
  const LANG = par?.lang === 'es' ? 'es' : 'en';
  const data = await getDictionary(LANG, `about.intro`);

  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${BASE_URL}/${LANG}/about#aboutpage`,
    name: data.h1,
    description: data.p,
    url: `${BASE_URL}/${LANG}/about`,
    mainEntity: {
      '@type': 'MedicalClinic',
      '@id': `${BASE_URL}/#medicalclinic`,
    },
  };

  return (
    <main className={styles.about}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>{data.h1}</h1>
          <p>{data.p}</p>
        </div>
      </section>

      <section className={styles.section}>
        <h2>{data.h2}</h2>
        <p>{data.story}</p>
      </section>

      <Values LANG={LANG} />

      <History LANG={LANG} />

      <Team LANG={LANG} />
    </main>
  );
};

export default About;
