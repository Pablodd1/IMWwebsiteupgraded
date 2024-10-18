import Image from "next/image";
import { Suspense } from "react";
import About from "@SEGMENT/About";
import Card from "@SEGMENT/Card";
import HealthAbout from "@SEGMENT/HealthAbout";
import styles from './page.module.scss'
import Departs from "@SEGMENT/departs";
import ContactUs from "@SEGMENT/ContactUs";
import GetSVG from "@SEGMENT/getSVG";
import { getDictionary } from '@JSON/index'
import { Mail, PhoneIcon } from "@ELEMENT/svgIcons";
import Link from "next/link";

export default async function Home({ params }) {
  const LANG = params.lang
  const intro = await getDictionary(LANG || 'en', `homepage.intro`);
  const socialLinks = await getDictionary(LANG || 'en', `general.socialLinks`);

  return (
    <main >
      <section className={styles.heroSec} >
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
                    alt={y.label}
                  />
                </Link>
              </li>
            ))}
          </ul>
          <section >
            <h1>Innovative <br /> Medical Wellness</h1>
            <p>{intro.p}</p>
            <footer className={styles.cta_footer} >
              <Link href="mailto:info@innovativemedicalwellness.com" className={styles.email} >
                <Mail />
              </Link>
              <Link href={"tel:(305)864-1373"} className={styles.phone} >
                <PhoneIcon />
                (305)864-1373
              </Link>
            </footer>
          </section>
        </header>
        <GetSVG num={4} styles={styles.svg_bottom} />
      </section>
      <Suspense >
        <About LANG={LANG} />
      </Suspense>
      {/* <Suspense >
        <Card LANG={LANG} />
      </Suspense> */}
      <Suspense >
        <HealthAbout LANG={LANG} />
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
