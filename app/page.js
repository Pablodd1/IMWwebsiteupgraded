import Image from "next/image";
import { Suspense } from "react";
import About from "@SEGMENT/About";
import Card from "@SEGMENT/Card";
import HealthAbout from "@SEGMENT/HealthAbout";
import styles from './page.module.scss'
import Departs from "@SEGMENT/departs";
import ContactUs from "@SEGMENT/ContactUs";
import GetSVG from "@SEGMENT/getSVG";

export default function Home() {
  return (
    <main >
      <section className={styles.heroSec} >
        <header className={styles.header}>
            <h1>Innovative <br/> Medical Wellness</h1>
            <p>The Best Health and Wellness Center in Miami – focusing on integrated holistic medicine.  Serving the community since 1982.</p>
        </header>
       <GetSVG num={4} />
      </section>
      <Suspense >
        <About />
      </Suspense>
      <Suspense >
        <Card />
      </Suspense>
      <Suspense >
        <HealthAbout />
      </Suspense>
      <Suspense >
        <Departs />
      </Suspense>
      <ContactUs />
    </main>
  );
}
