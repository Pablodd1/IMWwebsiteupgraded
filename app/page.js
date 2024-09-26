import Image from "next/image";
import { Suspense } from "react";
import About from "@SEGMENT/About";
import Card from "@SEGMENT/Card";
import HealthAbout from "@SEGMENT/HealthAbout";
import styles from './page.module.scss'
import Departs from "@SEGMENT/departs";

export default function Home() {
  return (
   <main >
<section className={styles.heroSec} >

</section>
    <Suspense >
      <About />
    </Suspense>
    <Suspense >
      <Card />
    </Suspense>
    <Suspense >
      <Departs />
    </Suspense>
    <Suspense >
      <HealthAbout />
    </Suspense>
   </main>
  );
}
