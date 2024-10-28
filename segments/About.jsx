import React from 'react';
import styles from "./about.module.scss"; // Importing the CSS module
import Image from 'next/image';
import { getDictionary } from '@JSON/index'
import Link from 'next/link';


const About = async ({LANG}) => {
    const about = await getDictionary(LANG || 'en', `homepage.about`);
    const socialLinks = await getDictionary(LANG || 'en', `general.socialLinks`);

    return (
        <article className={styles.about}>
            <section className={styles.left_side}>
                <h2>{about.heading}</h2>
                {about.paragraphs.map((para, paraIndex) => (
                    <p key={paraIndex}>{para}</p>
                ))}
                <ul className={styles.socialLinks}>
                        {socialLinks.map((y, j) => (
                            <li key={j}>
                                <Link href={y.href}>
                                    <Image
                                        className=""
                                        src={`/svg/${y.icon}.svg`}
                                        width={50}
                                        height={50}
                                        alt={y.label + 'Innovative Medical Wellness'}
                                    />
                                </Link>
                            </li>
                        ))}
                    </ul>
            </section>
            <figure className={styles.right_side}>
                <Image
                    className={styles.img}
                    src={`/raster/about/${about.image}.webp`}
                    alt={"About Image" + 'Innovative Medical Wellness'}
                    width={1024} height={1024}
                />
                <figcaption>
                    <Image className={styles.infoIcon} src={'/svg/info.svg'} width={50} height={50} alt={"info icon" + 'Innovative Medical Wellness'} />
                    {about.right_side_desc}
                </figcaption>
            </figure>
        </article>
    );
};

export default About;
