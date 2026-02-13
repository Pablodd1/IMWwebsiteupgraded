"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./Hero.module.scss";

export default function VToneHero({ content }) {
  const { title, subtitle, ctaText, ctaHref, image, badgeLeft, badgeRight } =
    content;

  return (
    <section className={styles.hero}>
      {/* Video Background */}
      <div className={styles.videoContainer}>
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={image}
          className={styles.videoBg}
        >
          <source 
            src="https://herovideo.my.canva.site/dahbi4hg8o8/_assets/video/12fe4b297bc9f236038d29ea1d948090.mp4" 
            type="video/mp4" 
          />
          {/* Fallback to image if video fails */}
          <Image
            className={styles.bg}
            src={image}
            alt={title}
            fill
            priority
            sizes="100vw"
          />
        </video>
        {/* Overlay for text readability */}
        <div className={styles.videoOverlay}></div>
      </div>

      <div className={styles.inner}>
        {/* <div className={styles.radiant}> */}
        <h1 className={styles.heading}>{title}</h1>
        <p className={styles.paragraph}>{subtitle}</p>
        <Link href={ctaHref} className={styles.cta}>
          {ctaText}
        </Link>
        {/* </div> */}
        <div className={styles.badges}>
          {badgeLeft ? (
            <Image src={badgeLeft} alt="Badge" width={120} height={120} />
          ) : null}
          {badgeRight ? (
            <Image src={badgeRight} alt="Badge" width={120} height={120} />
          ) : null}
        </div>
      </div>
    </section>
  );
}
