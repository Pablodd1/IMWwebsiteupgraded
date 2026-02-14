import "./globals.css";
import Link from "next/link";
import { ContactUS, Mail, PhoneIcon, WhatsApp } from "@ELEMENT/svgIcons";
import styles from './layout.module.scss';
import Footer from "./Footer";
import { Suspense } from "react";
import Image from 'next/image';
import Script from "next/script";
import { getDictionary } from '@JSON/index';
import FrontDeskChatbot from '@ELEMENT/FrontDeskChatbot';
import FloatingActionMenu from '@ELEMENT/FloatingActionMenu';
// import SplashScreen from './SplashScreen';

export const metadata = {
  metadataBase: new URL('https://innovativemedicalwellness.com'),
  title: {
    default: 'Innovative Medical Wellness | North Miami Beach Medical Clinic',
    template: '%s | Innovative Medical Wellness Miami',
  },
  description: 'Top-rated integrative wellness clinic in North Miami Beach, FL. Specializing in regenerative medicine, IV therapy, TMS brain therapy, anti-aging, and personalized wellness programs. Serving Aventura, Miami Beach, and Miami since 1982. Book your consultation today!',
  keywords: [
    'Innovative Medical Wellness',
    'North Miami Beach medical clinic',
    'Aventura wellness center',
    'Miami integrative medicine',
    'North Miami Beach IV therapy',
    'Aventura regenerative medicine',
    'Miami Beach anti-aging clinic',
    'TMS therapy North Miami Beach',
    'brain health Miami',
    'wellness clinic North Miami Beach FL',
    'medical spa Aventura',
    'regenerative medicine Miami',
    'IV vitamin therapy North Miami Beach',
    'biohacking Miami',
    'functional medicine North Miami Beach',
    'aesthetic medicine Aventura',
    'weight loss clinic Miami',
    'hormone therapy North Miami Beach',
    'chiropractic North Miami Beach',
    'physical therapy Miami',
    'stem cell therapy Florida',
    'PRP treatment Miami',
    'exosomes therapy North Miami Beach',
    'medical wellness 33162',
    'wellness center 33180',
    'anti-aging clinic 33154',
    'TMS depression treatment Miami',
    'ketamine therapy North Miami Beach',
    'medical weight loss Aventura',
    'wellness programs Miami Beach',
  ],
  authors: [{ name: 'Innovative Medical Wellness Team' }],
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
    canonical: '/',
    languages: {
      'en-US': '/en',
      'es-ES': '/es',
    },
  },
  openGraph: {
    title: 'Innovative Medical Wellness | North Miami Beach Medical Clinic',
    description: 'Premier integrative wellness clinic in North Miami Beach. Regenerative medicine, IV therapy, brain health & personalized wellness programs. Serving Aventura & Miami.',
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
  twitter: {
    card: 'summary_large_image',
    title: 'Innovative Medical Wellness | North Miami Beach',
    description: 'Top integrative wellness clinic in North Miami Beach & Aventura. Regenerative medicine, IV therapy & brain health.',
    images: ['/raster/hero_cinematic.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logos/logo.png',
    apple: '/logos/apple-icon.png',
  },
  manifest: '/logos/manifest.json',
  other: {
    'geo.region': 'US-FL',
    'geo.placename': 'North Miami Beach',
    'geo.position': '25.933150;-80.162550',
    'ICBM': '25.933150, -80.162550',
  },
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
  const par = await params
  const LANG = par.lang
  const contactUS = await getDictionary(LANG || 'en', 'general.contactUS');
  const navs = await getDictionary(LANG || 'en', 'general.navs');
  const intro = await getDictionary(LANG || 'en', 'homepage.intro');

  const services = navs
    .flatMap((group) => group.nav || [])
    .filter((item) => item.label && item.label !== 'Contact' && item.label !== 'About' && item.label !== 'Support')
    .map((item) => item.label);

  // Local Business Schema
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    '@id': 'https://innovativemedicalwellness.com/#medicalclinic',
    name: 'Innovative Medical Wellness',
    alternateName: 'IMW',
    url: 'https://innovativemedicalwellness.com',
    logo: 'https://innovativemedicalwellness.com/raster/logo-512.webp',
    image: 'https://innovativemedicalwellness.com/raster/hero_cinematic.png',
    description: 'Premier integrative wellness clinic in North Miami Beach specializing in regenerative medicine, IV therapy, TMS brain therapy, and personalized wellness programs.',
    telephone: contactUS?.details?.phone || '+1-305-864-1373',
    email: contactUS?.details?.email || 'info@innovativemedicalwellness.com',
    priceRange: '$$',
    currenciesAccepted: 'USD',
    paymentAccepted: 'Cash, Credit Card, Insurance',
    address: {
      '@type': 'PostalAddress',
      streetAddress: contactUS?.details?.address || '12345 Biscayne Blvd',
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
      {
        '@type': 'City',
        name: 'North Miami Beach',
        containedInPlace: {
          '@type': 'State',
          name: 'Florida',
        },
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
      {
        '@type': 'City',
        name: 'Sunny Isles Beach',
      },
      {
        '@type': 'City',
        name: 'Bal Harbour',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Wellness Services',
      itemListElement: services.map((service, index) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'MedicalProcedure',
          name: service,
        },
      })),
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '127',
      bestRating: '5',
    },
    review: [
      {
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: 'Sarah M.',
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
        },
        reviewBody: 'Amazing experience at Innovative Medical Wellness! The staff is professional and the treatments really work.',
      },
    ],
    sameAs: [
      'https://www.facebook.com/innovativemedicalwellness',
      'https://www.instagram.com/innovativemedicalwellness',
      'https://www.linkedin.com/company/innovative-medical-wellness',
      'https://www.yelp.com/biz/innovative-medical-wellness-north-miami-beach',
      'https://www.google.com/maps/place/Innovative+Medical+Wellness',
    ],
  };

  // Website Schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://innovativemedicalwellness.com/#website',
    url: 'https://innovativemedicalwellness.com',
    name: 'Innovative Medical Wellness',
    description: 'Integrative wellness clinic in North Miami Beach',
    publisher: {
      '@id': 'https://innovativemedicalwellness.com/#medicalclinic',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://innovativemedicalwellness.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://innovativemedicalwellness.com',
      },
    ],
  };

  return (
    <html lang={LANG || 'en'} suppressHydrationWarning>
      <head>
        {/* Geo Meta Tags for Local SEO */}
        <meta name="geo.region" content="US-FL" />
        <meta name="geo.placename" content="North Miami Beach" />
        <meta name="geo.position" content="25.933150;-80.162550" />
        <meta name="ICBM" content="25.933150, -80.162550" />

        {/* Additional SEO Meta Tags */}
        <meta name="msvalidate.01" content="YOUR_BING_VERIFICATION_CODE" />
        <meta name="google-site-verification" content="YOUR_GOOGLE_VERIFICATION_CODE" />
        <meta name="yandex-verification" content="YOUR_YANDEX_CODE" />
        <meta name="baidu-site-verification" content="YOUR_BAIDU_CODE" />

        {/* Mobile App Capable */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Innovative Medical Wellness" />
        <meta name="application-name" content="Innovative Medical Wellness" />
        <meta name="theme-color" content="#005d93" />
      </head>
      <body >
        {/* <SplashScreen /> Removed as per easy access cleanup */}
        <header className={styles.nav} id="navbar">
          <Link className={styles.logo} href="/">
            <Image
              src={`/raster/logo-150.webp`}
              alt={'Innovative Medical Wellness - Logo'}
              width={150} height={150}
            />
            <h1><span >Medical</span> <br />INNOVATIVE WELLNESS</h1>
          </Link>
          <nav className={styles.shortMenu}>{iconItems.map(renderIconButton)}</nav>
        </header>
        {children}
        <Suspense >
          <Footer LANG={LANG || 'en'} />
        </Suspense>
        <FloatingActionMenu />
        <FrontDeskChatbot
          clinicName="Innovative Medical Wellness"
          intro={intro?.p}
          address={contactUS?.details?.address}
          phone={contactUS?.details?.phone}
          email={contactUS?.details?.email}
          services={services}
        />

        {/* Schema.org JSON-LD Structured Data */}
        <Script
          id="local-business-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <Script
          id="website-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <Script
          id="breadcrumb-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />

      </body>
    </html>
  );
}
