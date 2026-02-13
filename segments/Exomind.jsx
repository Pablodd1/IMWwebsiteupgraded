import React from 'react';
import styles from "./exomind.module.scss";
import Image from 'next/image';
import Link from 'next/link';
// import { getDictionary } from '@JSON/index' // Not used for now, hardcoded content

const Exomind = ({ LANG }) => {
    return (
        <article className={styles.about}>
            {/* Reusing 'about' class name structure for style compatibility if desired, but using exomind.module.scss */}
            <section className={styles.left_side}>
                <h2>ExoMind: Revolutionary Brain Health Therapy</h2>
                <p>
                    Unlock your brain's potential with ExoTMS™ technology.
                    Our non-invasive brain stimulation therapy enhances neural connectivity to improve mood, focus, and emotional resilience.
                    Drug-free, non-surgical, and designed for your mental wellness.
                </p>

                <Link href="https://exomindmiamibeach.com/" target="_blank" className={styles.cta_button}>
                    Visit ExoMind Miami Beach
                </Link>
            </section>

            <figure className={styles.right_side}>
                <Image
                    className={styles.img}
                    src={`/raster/exomind_brain_hero.webp`}
                    alt={"ExoMind Brain Therapy at Innovative Medical Wellness"}
                    width={1024} height={1024}
                />
                <figcaption>
                    <Image className={styles.infoIcon} src={'/svg/info.svg'} width={50} height={50} alt="Info" />
                    Discover the future of cognitive health with ExoTMS.
                </figcaption>
            </figure>
        </article>
    );
};

export default Exomind;
