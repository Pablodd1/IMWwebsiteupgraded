import React from 'react';
import styles from './Health.module.scss';
import Box from '@ELEMENT/points';
import { getDictionary } from '@JSON/index'

const HealthAbout = async ({ LANG }) => {
    const health = await getDictionary(LANG || 'en', `homepage.health`);

    return (
        <section className={styles.wrap}>
            <section className={styles.container}>
                <article className={styles.left} >
                    <h3>
                        {health.heading}
                    </h3>
                    <p>
                        {health.paragraph}
                    </p>
                </article>
                <article className={styles.right}>
                    <iframe width="1280" height="720" src="https://www.youtube.com/embed/Exh9Q6gbEgA" title="Innovative Medical Wellness Welcome" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                    {/* <video controls>
                        <source src={'https://youtu.be/Exh9Q6gbEgA'} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video> */}
                </article>
            </section>
            <Box data={health.ul} />
        </section>
    );
};

export default HealthAbout;
