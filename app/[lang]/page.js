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

export default async function Home({ params }) {
  const LANG = params.lang
  const intro = await getDictionary(LANG || 'en', `homepage.intro`);
  return (
    <main >
      <section className={styles.heroSec} >
        <header className={styles.header}>
          <h1>Innovative <br /> Medical Wellness</h1>
          <p>{intro.p}</p>
        </header>
        <GetSVG num={4} />
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
