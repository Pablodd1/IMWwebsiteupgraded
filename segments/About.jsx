import React from 'react';
import styles from "./about.module.scss"; // Importing the CSS module
import Image from 'next/image';
import { getDictionary } from '@JSON/index'


const About = async ({LANG}) => {
    const about = await getDictionary(LANG || 'en', `homepage.about`);

    return (
        <article className={styles.about}>
            <section className={styles.left_side}>
                <h2>{about.heading}</h2>
                {about.paragraphs.map((para, paraIndex) => (
                    <p key={paraIndex}>{para}</p>
                ))}
            </section>
            <figure className={styles.right_side}>
                <Image
                    className={styles.img}
                    src={`/raster/about/${about.image}.png`}
                    alt="About Image"
                    width={1024} height={1024}
                />
                <figcaption>
                    <Image className={styles.infoIcon} src={'/svg/info.svg'} width={50} height={50} alt="info icon" />
                    {about.right_side_desc}
                </figcaption>
            </figure>
        </article>
    );
};

export default About;
