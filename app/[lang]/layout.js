import "./globals.css";
import Link from "next/link";
import { ContactUS, Mail,  PhoneIcon } from "@ELEMENT/svgIcons";
import styles from './layout.module.scss';
import Footer from "./Footer";
import { Suspense } from "react";
import Image from 'next/image';
import Script from "next/script";

export const metadata = {
  metadataBase: new URL('https://innovativemedicalwellness.com'),
  title: 'Innovative Medical Wellness | Miami Healthcare',
  keywords: 'regenerative medicine, IV therapy, aesthetic treatments, weight loss programs, brain health',
  description: 'Innovative Medical Wellness: regenerative medicine, IV therapy, aesthetic & weight loss solutions to boost vitality, recovery & overall wellness.',
  generator: 'Next.js',
  applicationName: 'IMW App',
  creator: 'MyAbabeel - M Talha',
  alternates: {
    canonical: 'https://innovativemedicalwellness.com'
  },
  // verification: {
  //   google: '5mY7Mp4Wz4jdKB94tgnuTNF1g1I5MV447Cm--rsF3SI',
  // },
  manifest: '/logos/manifest.json',
  icons: {
    icon: '/logos/logo.png',
    shortcut: '/logos/logo.png',
    apple: '/logos/apple-icon.png'
  },
}

const iconItems = [
  { label: 'Call', icon: <PhoneIcon key={0} />, href: 'tel:(305)864-1373' },
  { label: 'Mail', icon: <Mail key={1} />, href: 'mailto:info@innovativemedicalwellness.com' },
  { label: 'Contact', icon: <ContactUS key={2} />, href: '/contact' },
];
const renderIconButton = ({ label, icon, href }) => (
  <Link key={label} title={label} href={href} aria-label={label}>
    {icon}
  </Link>
);
export default async function RootLayout({ children, params  }) {
  const par = await params
  const LANG = par.lang
  
  return (
    <html lang="en">
      <body >
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
        <Script src='/tawk.to.js' strategy='lazyOnload' />
      </body>
    </html>
  );
}
