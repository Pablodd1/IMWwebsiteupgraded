import Image from "next/image";
import { Suspense } from "react";
import About from "@SEGMENT/About";
import Exomind from "@SEGMENT/Exomind";
import HealthAbout from "@SEGMENT/HealthAbout";
import styles from './page.module.scss';
import Departs from "@SEGMENT/departs";
import ContactUs from "@SEGMENT/ContactUs";
import GetSVG from "@SEGMENT/getSVG";
import { getDictionary } from '@JSON/index';
import { Mail, PhoneIcon } from "@ELEMENT/svgIcons";
import Link from "next/link";
import dynamic from "next/dynamic";
const Gallery = dynamic(() => import('@ELEMENT/getGallery'));
import InteractiveCTA from "@ELEMENT/InteractiveCTA";

const BASE_URL = 'https://innovativemedicalwellness.com';

export async function generateMetadata({ params }) {
  const par = await params;
  const LANG = par?.lang === 'es' ? 'es' : 'en';
  const isEs = LANG === 'es';

  const title = isEs
    ? 'Clínica de Medicina Integrativa en North Miami Beach'
    : 'Integrative Healthcare Clinic in North Miami Beach';
  const description = isEs
    ? 'Clínica líder en medicina integrativa y regenerativa en North Miami Beach, FL. Terapia IV, ExoMind TMS, V-Tone, quiropráctica y antienvejecimiento. ¡Agenda hoy!'
    : 'Top-rated integrative wellness clinic in North Miami Beach, FL. Regenerative medicine, IV therapy, ExoMind TMS, anti-aging & personalized care near Aventura.';

  return {
    title,
    description,
    keywords: [
      'medical wellness clinic North Miami Beach',
      'Aventura wellness center',
      'integrative clinic Miami FL',
      'functional medicine Aventura',
      'anti-aging clinic North Miami Beach',
      'regenerative medicine Miami',
      'IV therapy North Miami Beach',
      'TMS brain health clinic',
      'ExoMind Miami Beach',
      'hormone replacement therapy Aventura',
      'medical weight loss Miami',
      'PRP therapy North Miami Beach',
      'biohacking center Miami',
    ],
    alternates: {
      canonical: `${BASE_URL}/${LANG}`,
      languages: {
        'en-US': `${BASE_URL}/en`,
        'es-ES': `${BASE_URL}/es`,
        'x-default': `${BASE_URL}/en`,
      },
    },
    openGraph: {
      title: `${title} | Innovative Medical Wellness`,
      description,
      url: `${BASE_URL}/${LANG}`,
      siteName: 'Innovative Medical Wellness',
      images: [
        {
          url: '/raster/hero_cinematic.png',
          width: 1200,
          height: 630,
          alt: 'Innovative Medical Wellness - North Miami Beach Clinic',
        },
      ],
      locale: isEs ? 'es_ES' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/raster/hero_cinematic.png'],
    },
  };
}

export default async function Home({ params }) {
  const par = await params;
  const LANG = par?.lang === 'es' ? 'es' : 'en';
  const intro = await getDictionary(LANG, `homepage.intro`);
  const socialLinks = await getDictionary(LANG, `general.socialLinks`);

  return (
    <main>
      <section className={styles.heroSec}>
        <div className={styles.heroMedia}>
          <video
            className={styles.heroVideo}
            autoPlay
            muted
            loop
            playsInline
            poster="/raster/futuristic_clinic_hero_placeholder.webp"
          >
            <source src="/videos/new-hero-video.mp4" type="video/mp4" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/raster/futuristic_clinic_hero_placeholder.webp" alt="Innovative Medical Wellness Clinic in North Miami Beach" className={styles.heroVideo} />
          </video>
          <div className={styles.heroOverlay} />
        </div>
        <header className={styles.header}>
          <ul className={styles.socialLinks}>
            {socialLinks.map((y, j) => (
              <li key={j}>
                <Link href={y.href} aria-label={y.label}>
                  <Image
                    className=""
                    src={`/svg/${y.icon}-white.svg`}
                    width={50}
                    height={50}
                    alt={`${y.label} - Innovative Medical Wellness North Miami Beach`}
                  />
                </Link>
              </li>
            ))}
          </ul>
          <section>
            <h1>Innovative Medical Wellness <br />
              <span style={{ fontSize: '0.6em', fontWeight: 400 }}>
                {LANG === 'es'
                  ? 'Clínica Integrativa Líder en North Miami Beach y Aventura'
                  : "North Miami Beach & Aventura's Premier Integrative Clinic"}
              </span>
            </h1>
            <p>{intro.p}</p>
            <InteractiveCTA />
            <footer className={styles.cta_footer}>
              <Link href="mailto:info@innovativemedicalwellness.com" className={styles.email} aria-label="Email Innovative Medical Wellness">
                <Mail />
              </Link>
              <Link href="tel:(305)864-1373" className={styles.phone}>
                <PhoneIcon />
                (305) 864-1373
              </Link>
            </footer>
          </section>
        </header>
        <GetSVG num={4} styles={styles.svg_bottom} />
      </section>

      <Suspense>
        <About LANG={LANG} />
      </Suspense>
      <Suspense>
        <Exomind LANG={LANG} />
      </Suspense>
      <Suspense>
        <HealthAbout LANG={LANG} />
      </Suspense>
      <Suspense>
        <Gallery />
      </Suspense>
      <Suspense>
        <Departs LANG={LANG} />
      </Suspense>
      <Suspense>
        <ContactUs LANG={LANG} />
      </Suspense>
    </main>
  );
}
