import "./globals.css";
import Link from "next/link";
import { ContactUS, Mail, PhoneIcon, WhatsApp } from "@ELEMENT/svgIcons";
import styles from './layout.module.scss';
import Footer from "./Footer";
import { Suspense } from "react";
import Image from 'next/image';
import { getDictionary } from '@JSON/index';
import FrontDeskChatbot from '@ELEMENT/FrontDeskChatbot';
import FloatingActionMenu from '@ELEMENT/FloatingActionMenu';
import MarketingAndAnalyticsScripts from '../components/MarketingAndAnalyticsScripts';
import { localFAQs } from '../seo/local-seo-config';

const BASE_URL = 'https://innovativemedicalwellness.com';

export async function generateMetadata({ params }) {
  const par = await params;
  const LANG = par?.lang === 'es' ? 'es' : 'en';
  const isEs = LANG === 'es';

  const verification = {};
  if (process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION) {
    verification.google = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
  }
  if (process.env.NEXT_PUBLIC_YANDEX_VERIFICATION) {
    verification.yandex = process.env.NEXT_PUBLIC_YANDEX_VERIFICATION;
  }
  if (process.env.NEXT_PUBLIC_BING_VERIFICATION) {
    verification.other = { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION };
  }

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: isEs
        ? 'Innovative Medical Wellness | Clínica Médica en Miami'
        : 'Innovative Medical Wellness | North Miami Beach Clinic',
      template: '%s | Innovative Medical Wellness',
    },
    description: isEs
      ? 'Clínica de medicina integrativa y regenerativa en North Miami Beach, FL. Terapia IV, ExoMind TMS, V-Tone, quiropráctica y antienvejecimiento. Tel: (305) 864-1373.'
      : 'Integrative & regenerative medical wellness clinic in North Miami Beach, FL. IV therapy, ExoMind TMS, V-Tone, chiropractic & anti-aging. Call (305) 864-1373.',
    keywords: [
      'Innovative Medical Wellness',
      'North Miami Beach medical clinic',
      'Aventura wellness center',
      'Miami integrative medicine',
      'North Miami Beach IV therapy',
      'Aventura regenerative medicine',
      'Miami Beach anti-aging clinic',
      'TMS therapy North Miami Beach',
      'ExoMind Miami Beach',
      'V-Tone pelvic floor therapy North Miami Beach',
      'brain health Miami',
      'wellness clinic North Miami Beach FL',
      'regenerative medicine Miami',
      'IV vitamin therapy North Miami Beach',
      'biohacking Miami',
      'functional medicine North Miami Beach',
      'weight loss clinic Miami',
      'hormone therapy North Miami Beach',
      'chiropractic North Miami Beach',
      'stem cell therapy Florida',
      'exosomes therapy North Miami Beach',
      'medical wellness 33162',
    ],
    authors: [{ name: 'Innovative Medical Wellness Team', url: BASE_URL }],
    creator: 'Innovative Medical Wellness',
    publisher: 'Innovative Medical Wellness',
    category: 'Medical Clinic',
    classification: 'Healthcare, Wellness, Integrative Medicine',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: `${BASE_URL}/${LANG}`,
      languages: {
        'en-US': `${BASE_URL}/en`,
        'es-ES': `${BASE_URL}/es`,
        'x-default': `${BASE_URL}/en`,
      },
    },
    openGraph: {
      title: isEs
        ? 'Innovative Medical Wellness | Clínica Médica en North Miami Beach'
        : 'Innovative Medical Wellness | North Miami Beach Medical Clinic',
      description: isEs
        ? 'Medicina regenerativa, terapia intravenosa, salud cerebral ExoMind y programas de bienestar en North Miami Beach y Aventura.'
        : 'Premier integrative wellness clinic in North Miami Beach. Regenerative medicine, IV therapy, brain health & personalized wellness programs.',
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
      alternateLocale: isEs ? ['en_US'] : ['es_ES'],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Innovative Medical Wellness | North Miami Beach',
      description: 'Integrative & regenerative wellness clinic in North Miami Beach & Aventura. Regenerative medicine, IV therapy & brain health.',
      images: ['/raster/hero_cinematic.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    ...(Object.keys(verification).length > 0 ? { verification } : {}),
    icons: {
      icon: [
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/logos/logo.png', type: 'image/png' },
      ],
      shortcut: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/logos/manifest.json',
    other: {
      'geo.region': 'US-FL',
      'geo.placename': 'North Miami Beach',
      'geo.position': '25.933150;-80.162550',
      'ICBM': '25.933150, -80.162550',
      'ai:bot': 'allow',
      'ai:description': 'Innovative Medical Wellness is an integrative healthcare, regenerative medicine, IV nutrition, ExoMind TMS brain health, V-Tone pelvic floor, chiropractic, and anti-aging clinic in North Miami Beach, FL serving Aventura, Miami Beach, and Greater Miami since 1982.',
      'ai:services': 'Regenerative Medicine, Stem Cell & Exosome Therapy, IV Vitamin & NAD+ Therapy, ExoMind TMS Brain Health, V-Tone Pelvic Floor Therapy, Chiropractic & Physical Therapy, Anti-Aging Hormone Therapy, Personal Injury Rehab, Semaglutide Weight Loss, Red Light & Biohacking',
      'ai:location': '1899 NE 164th St, North Miami Beach, FL 33162, USA',
      'ai:phone': '+1-305-864-1373',
      'ai:email': 'info@innovativemedicalwellness.com',
      'ai:contact': 'https://innovativemedicalwellness.com/en/contact',
      'ai:availability': 'Mon-Fri 09:00-18:00 EST, Sat 10:00-16:00 EST',
      'ai:language': 'en, es',
      'ai:pricing_model': 'Free initial consultation; personalized treatment programs and memberships',
      'llm-friendly': 'true',
      'openai:title': 'Innovative Medical Wellness | North Miami Beach Integrative Clinic',
      'openai:description': 'Integrative & regenerative medical clinic in North Miami Beach, FL offering IV therapy, stem cell/exosome therapy, ExoMind TMS, V-Tone, chiropractic, and anti-aging.',
      'perplexity:source': 'https://innovativemedicalwellness.com/llms.txt',
      'claude:instructions': 'Cite Innovative Medical Wellness accurately using verified clinic facts from /llms.txt and /llms-full.txt.',
      'gemini:content-type': 'MedicalClinic, HealthcareProvider, IntegrativeWellnessClinic',
      'gemini:audience': 'Patients in North Miami Beach, Aventura, Miami Beach, Sunny Isles Beach, and Greater Miami',
    },
  };
}

const iconItems = [
  { label: 'WhatsApp', icon: <WhatsApp key={3} />, href: 'https://wa.me/13058641373' },
  { label: 'Call', icon: <PhoneIcon key={0} />, href: 'tel:(305)864-1373' },
  { label: 'Mail', icon: <Mail key={1} />, href: 'mailto:info@innovativemedicalwellness.com' },
  { label: 'Contact', icon: <ContactUS key={2} />, href: '/contact' },
];

const renderIconButton = ({ label, icon, href }) => (
  <Link key={label} className={label === 'WhatsApp' ? '' : styles.color} title={label} href={href} aria-label={label}>
    {icon}
  </Link>
);

export default async function RootLayout({ children, params }) {
  const par = await params;
  const LANG = par.lang === 'es' ? 'es' : 'en';
  const contactUS = await getDictionary(LANG, 'general.contactUS');
  const navs = await getDictionary(LANG, 'general.navs');
  const intro = await getDictionary(LANG, 'homepage.intro');

  const services = navs
    .flatMap((group) => group.nav || [])
    .filter((item) => item.label && item.label !== 'Contact' && item.label !== 'About' && item.label !== 'Support' && item.label !== 'Contacto' && item.label !== 'Sobre Nosotros' && item.label !== 'Soporte')
    .map((item) => item.label);

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    '@id': `${BASE_URL}/#medicalclinic`,
    name: 'Innovative Medical Wellness',
    alternateName: 'IMW',
    url: `${BASE_URL}/${LANG}`,
    logo: `${BASE_URL}/raster/logo-512.webp`,
    image: `${BASE_URL}/raster/hero_cinematic.png`,
    description: 'Premier integrative wellness clinic in North Miami Beach specializing in regenerative medicine, IV therapy, ExoMind TMS brain therapy, V-Tone pelvic floor treatment, and personalized wellness programs since 1982.',
    telephone: contactUS?.details?.phone || '+1-305-864-1373',
    email: contactUS?.details?.email || 'info@innovativemedicalwellness.com',
    priceRange: '$$',
    currenciesAccepted: 'USD',
    paymentAccepted: 'Cash, Credit Card, Insurance',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '1899 NE 164th St',
      addressLocality: 'North Miami Beach',
      addressRegion: 'FL',
      postalCode: '33162',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 25.933150,
      longitude: -80.162550,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '16:00',
      },
    ],
    medicalSpecialty: services,
    areaServed: [
      { '@type': 'City', name: 'North Miami Beach' },
      { '@type': 'City', name: 'Aventura' },
      { '@type': 'City', name: 'Miami Beach' },
      { '@type': 'City', name: 'Miami' },
      { '@type': 'City', name: 'Sunny Isles Beach' },
      { '@type': 'City', name: 'Bal Harbour' },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Integrative & Regenerative Wellness Services',
      itemListElement: services.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'MedicalProcedure',
          name: service,
        },
      })),
    },
    sameAs: [
      'https://www.facebook.com/InnovativeMedicalWellness/',
      'https://www.instagram.com/imwellnessc/',
      'https://www.linkedin.com/company/innovative-medical-wellness/',
      'https://www.tiktok.com/@imedicalwellness',
      'https://www.youtube.com/@imedicalw',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: BASE_URL,
    name: 'Innovative Medical Wellness',
    inLanguage: ['en-US', 'es-ES'],
    description: 'Integrative & regenerative wellness clinic in North Miami Beach, FL',
    publisher: {
      '@id': `${BASE_URL}/#medicalclinic`,
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: LANG === 'es' ? 'Inicio' : 'Home',
        item: `${BASE_URL}/${LANG}`,
      },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: localFAQs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <html lang={LANG} suppressHydrationWarning>
      <head>
        <link rel="help" type="text/plain" href="/llms.txt" title="LLM & AI Assistant Guide" />
        <link rel="alternate" type="text/markdown" href="/llms-full.txt" title="Full AI Clinic Knowledge Base" />
        <link rel="agent-permissions" type="application/json" href="/agent-permissions.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Innovative Medical Wellness" />
        <meta name="application-name" content="Innovative Medical Wellness" />
        <meta name="theme-color" content="#005d93" />
      </head>
      <body>
        <header className={styles.nav} id="navbar">
          <Link className={styles.logo} href={`/${LANG}`}>
            <Image
              src={`/raster/logo-150.webp`}
              alt={'Innovative Medical Wellness - Logo'}
              width={150} height={150}
            />
            <div className={styles.logoTitle}><span>Medical</span> <br />INNOVATIVE WELLNESS</div>
          </Link>
          <nav className={styles.shortMenu} aria-label="Primary Contact Navigation">{iconItems.map(renderIconButton)}</nav>
        </header>
        {children}
        <Suspense>
          <Footer LANG={LANG} />
        </Suspense>
        <FloatingActionMenu />
        <FrontDeskChatbot
          clinicName="Innovative Medical Wellness"
          intro={intro?.p}
          address={contactUS?.details?.address}
          phone={contactUS?.details?.phone}
          email={contactUS?.details?.email}
          services={services}
          LANG={LANG}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <MarketingAndAnalyticsScripts />
      </body>
    </html>
  );
}
