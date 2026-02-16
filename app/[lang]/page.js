import Image from "next/image";
import { Suspense } from "react";
import About from "@SEGMENT/About";
import Exomind from "@SEGMENT/Exomind";
import HealthAbout from "@SEGMENT/HealthAbout";
import styles from './page.module.scss'
import Departs from "@SEGMENT/departs";
import ContactUs from "@SEGMENT/ContactUs";
import GetSVG from "@SEGMENT/getSVG";
import { getDictionary } from '@JSON/index'
import { Mail, PhoneIcon } from "@ELEMENT/svgIcons";
import Link from "next/link";
import dynamic from "next/dynamic";
const Gallery = dynamic(() => import('@ELEMENT/getGallery'));
import InteractiveCTA from "@ELEMENT/InteractiveCTA";

export const metadata = {
  title: 'North Miami Beach Integrative Healthcare & Wellness Clinic',
  description: 'Top-rated integrative wellness clinic in North Miami Beach, FL. Expert regenerative medicine, IV therapy, TMS brain therapy, anti-aging & personalized wellness. Serving Aventura, Miami Beach & Miami. Book your free consultation today!',
  keywords: [
    'North Miami Beach wellness clinic',
    'Aventura medical spa',
    'Miami Beach anti-aging clinic',
    'integrative medicine North Miami Beach FL',
    'regenerative medicine Aventura',
    'IV therapy Miami Beach',
    'TMS therapy North Miami Beach',
    'brain health clinic Miami',
    'wellness center 33162',
    'medical clinic North Miami Beach',
    'functional medicine Aventura',
    'biohacking Miami Beach',
    'stem cell therapy Florida',
    'PRP treatment North Miami Beach',
  ],
  alternates: {
    canonical: 'https://innovativemedicalwellness.com',
  },
  openGraph: {
    title: 'North Miami Beach Integrative Healthcare & Wellness',
    description: 'Premier wellness clinic in North Miami Beach. Regenerative medicine, IV therapy, brain health & anti-aging. Serving Aventura & Miami.',
    url: 'https://innovativemedicalwellness.com',
    siteName: 'Innovative Medical Wellness',
    images: [
      {
        url: '/raster/hero_cinematic.png',
        width: 1200,
        height: 630,
        alt: 'Innovative Medical Wellness - North Miami Beach Clinic',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default async function Home({ params }) {
  const par = await params
  const LANG = par.lang
  const intro = await getDictionary(LANG, `homepage.intro`);
  const socialLinks = await getDictionary(LANG, `general.socialLinks`);

  return (
    <main >
      {/* Hero Section with Local SEO H1 */}
      <section className={styles.heroSec} >
        <div className={styles.heroMedia}>
          <video
            className={styles.heroVideo}
            autoPlay
            muted
            loop
            playsInline
            poster="/raster/exomind_brain_hero.webp"
          >
            <source src="/videos/exomind_brain_hero.mp4" type="video/mp4" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/raster/exomind_brain_hero.webp" alt="Innovative Medical Wellness Clinic in North Miami Beach" className={styles.heroVideo} />
          </video>
          <div className={styles.heroOverlay} />
        </div>
        <header className={styles.header}>
          <ul className={styles.socialLinks}>
            {socialLinks.map((y, j) => (
              <li key={j}>
                <Link href={y.href}>
                  <Image
                    className=""
                    src={`/svg/${y.icon}-white.svg`}
                    width={50}
                    height={50}
                    alt={y.label + 'Innovative Medical Wellness North Miami Beach'}
                  />
                </Link>
              </li>
            ))}
          </ul>
          <section >
            <h1>Innovative Medical Wellness <br />
              <span style={{ fontSize: '0.6em', fontWeight: 400 }}>North Miami Beach & Aventura&apos;s Premier Integrative Clinic</span>
            </h1>
            <p>{intro.p}</p>
            <InteractiveCTA />
            <footer className={styles.cta_footer} >
              <Link href="mailto:info@innovativemedicalwellness.com" className={styles.email} >
                <Mail />
              </Link>
              <Link href={"tel:(305)864-1373"} className={styles.phone} >
                <PhoneIcon />
                (305) 864-1373
              </Link>
            </footer>
          </section>
        </header>
        <GetSVG num={4} styles={styles.svg_bottom} />
      </section>

      <Suspense >
        <About LANG={LANG} />
      </Suspense>
      <Suspense >
        <Exomind LANG={LANG} />
      </Suspense>
      <Suspense >
        <HealthAbout LANG={LANG} />
      </Suspense>
      <Suspense >
        <Gallery />
      </Suspense>
      <Suspense >
        <Departs LANG={LANG} />
      </Suspense>
      <Suspense >
        <ContactUs LANG={LANG} />
      </Suspense>
    </main>
  );
}
