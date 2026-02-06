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
    default: 'Innovative Medical Wellness | Miami Integrative Healthcare',
    template: '%s | Innovative Medical Wellness',
  },
  description: 'Miami integrative wellness clinic offering regenerative medicine, IV therapy, aesthetics, brain health, weight loss, and personalized care since 1982.',
  keywords: [
    'Innovative Medical Wellness',
    'Miami wellness clinic',
    'regenerative medicine Miami',
    'IV therapy Miami',
    'aesthetic treatments Miami',
    'weight loss programs',
    'brain health',
    'chiropractic and physical therapy',
  ],
  generator: 'Next.js',
  applicationName: 'IMW App',
  creator: 'MyAbabeel - M Talha',
  category: 'Healthcare',
  alternates: {
    canonical: 'https://innovativemedicalwellness.com'
  },
  manifest: '/logos/manifest.json',
  icons: {
    icon: '/logos/logo.png',
    shortcut: '/logos/logo.png',
    apple: '/logos/apple-icon.png'
  },
  openGraph: {
    title: 'Innovative Medical Wellness | Miami Integrative Healthcare',
    description: 'Regenerative medicine, IV therapy, aesthetics, brain health, weight loss, and personalized wellness programs in Miami.',
    url: 'https://innovativemedicalwellness.com',
    siteName: 'Innovative Medical Wellness',
    images: [
      {
        url: '/raster/Innovative Medical Wellness - cover.webp',
        width: 1200,
        height: 630,
        alt: 'Innovative Medical Wellness clinic interior',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Innovative Medical Wellness | Miami Integrative Healthcare',
    description: 'Integrated wellness, regenerative care, and IV therapy tailored to Miami patients.',
    images: ['/raster/Innovative Medical Wellness - cover.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  themeColor: '#005d93',
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
    <html lang={LANG || 'en'}>
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
        <Script src='/tawk.to.js' strategy='lazyOnload' />
      </body>
    </html>
  );
}
