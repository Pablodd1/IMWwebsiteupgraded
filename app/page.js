import Image from "next/image";
import { Suspense } from "react";
import About from "@SEGMENT/About";
import Card from "@SEGMENT/Card";
import HealthAbout from "@SEGMENT/HealthAbout";
import Footer from "@SEGMENT/Footer";

export default function Home() {
  return (
   <main >

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
      <Footer />
    </Suspense>
   </main>
  );
}
