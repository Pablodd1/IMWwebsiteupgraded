import React from 'react';
import styles from "./about.module.scss"; // Importing the CSS module
import Image from 'next/image';
import aboutdata from '@JSON/about_data.js'


const About = () => {
    return (
        <article className={styles.about}>
            {aboutdata.map((section, index) => (
                <React.Fragment key={index}>
                    <section className={styles.left_side}>
                        <h2>{section.heading}</h2>
                        {section.paragraphs.map((para, paraIndex) => (
                            <p key={paraIndex}>{para}</p>
                        ))}
                    </section>
                    <figure className={styles.right_side}>
                        <Image className={styles.img} src={section.image} alt="About Image" />
                        <figcaption>
                            <Image className={styles.infoIcon} src={'/svg/info.svg'} width={50} height={50} alt="info icon" />
                            {section.right_side_desc}
                        </figcaption>
                    </figure>
                </React.Fragment>
            ))}
        </article>
    );
};

export default About;
