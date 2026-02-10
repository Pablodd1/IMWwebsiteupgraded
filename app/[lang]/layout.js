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
import SplashScreen from './SplashScreen';

export const metadata = {
  metadataBase: new URL('https://innovativemedicalwellness.com'),
  title: {
    default: 'Innovative Medical Wellness | Clinical Wellness & Regenerative Medicine Miami',
    template: '%s | Innovative Medical Wellness',
  },
  description: 'Expert integrative wellness clinic in Miami specializing in regenerative medicine, IV therapy, clinical aesthetics, brain health, and personalized wellness programs since 1982.',
  keywords: [
    'Innovative Medical Wellness',
    'Miami integrative doctor',
    'regenerative medicine Miami',
    'IV therapy Miami',
    'anti-aging Miami',
    'lifestyle medicine Miami',
    'clinical wellness Miami',
    'medical weight loss Miami',
    'brain wellness clinic',
  ],
  authors: [{ name: 'Innovative Medical Wellness Team' }],
  creator: 'Innovative Medical Wellness',
  publisher: 'Innovative Medical Wellness',
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
    title: 'Innovative Medical Wellness | Miami Integrative Healthcare',
    description: 'Transform your health with personalized regenerative and wellness care in Miami.',
    url: 'https://innovativemedicalwellness.com',
    siteName: 'Innovative Medical Wellness',
    images: [
      {
        url: '/raster/hero_cinematic.png',
        width: 1200,
        height: 630,
        alt: 'Innovative Medical Wellness - Miami Wellness Clinic',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Innovative Medical Wellness Miami',
    description: 'Advanced clinical wellness and regenerative care tailored for you.',
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
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name: 'Innovative Medical Wellness',
    url: 'https://innovativemedicalwellness.com',
    telephone: contactUS?.details?.phone,
    email: contactUS?.details?.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: contactUS?.details?.address,
      addressLocality: 'North Miami Beach',
      addressRegion: 'FL',
      postalCode: '33162',
      addressCountry: 'US',
    },
    medicalSpecialty: services,
  };
  return (
    <html lang={LANG || 'en'} suppressHydrationWarning>
      <body >
        <SplashScreen />
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
        <FrontDeskChatbot
          clinicName="Innovative Medical Wellness"
          intro={intro?.p}
          address={contactUS?.details?.address}
          phone={contactUS?.details?.phone}
          email={contactUS?.details?.email}
          services={services}
        />
        <Script
          id="imw-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

      </body>
    </html>
  );
}
