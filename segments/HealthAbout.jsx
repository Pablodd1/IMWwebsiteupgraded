import React from 'react';
import styles from './Health.module.scss'; 
import Box from '@ELEMENT/points';
import { getDictionary } from '@JSON/index'

const HealthAbout = async ({LANG}) => {
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
                    <video controls>
                        <source src={health.right_side_video} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </article>
            </section>
            <Box data={health.ul} />
        </section>
    );
};

export default HealthAbout;
