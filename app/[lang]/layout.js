import UseScrollEffect from "@HOOK/monitorScroll";
import "./globals.css";
import Link from "next/link";
import { ContactUS, Mail, Logo, PhoneIcon } from "@ELEMENT/svgIcons";
import styles from './layout.module.scss';
import Footer from "./Footer";
import { Suspense } from "react";
import Image from 'next/image';

export const metadata = {
  metadataBase: new URL('https://innovativemedicalwellness.com'),
  title: 'Innovative Medical Wellness | Miami Healthcare',
  keywords: 'Locksmith, Miami locksmith, locksmith services, emergency locksmith, car locksmith, lost car keys, key replacement, 24-hour locksmith, Miami Beach locksmith, Miami Gardens locksmith, Miami Oklahoma locksmith, Miami airport locksmith, security solutions, lockout assistance, spare car keys, car key replacement, new car keys, locksmith team, reliable locksmith, trusted locksmith, professional locksmith, Miami security, locksmith expertise, locksmith history, locksmith values',
  description: 'Get locked in the car? Trust our 24/7 Miami locksmith for expert solutions. Lost keys, lockouts, and security expertise for a decade-long commitment.',
  generator: 'Next.js',
  applicationName: 'DP Locksmith',
  creator: 'MyAbabeel - M Talha',
  alternates: {
    canonical: 'https://innovativemedicalwellness.com'
  },
  verification: {
    google: '5mY7Mp4Wz4jdKB94tgnuTNF1g1I5MV447Cm--rsF3SI',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/apple-icon.png'
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
export default async function RootLayout({ children, params }) {
  const LANG = params.lang
  
  return (
    <html lang="en">
      <body >
        <header className={styles.nav} id="navbar">
          <Link className={styles.logo} href="/">
            {/* <Logo /> */}
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
      </body>
    </html>
  );
}
