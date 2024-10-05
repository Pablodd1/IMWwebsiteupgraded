import React from 'react';
import styles from './Health.module.scss'; // Importing the SCSS module
import { health_data } from '@JSON/health_about';
import Box from '@ELEMENT/points';
const HealthAbout = () => {
    return (
        <section className={styles.wrap}>
            <section className={styles.container}>
                {health_data.map((item, i) => {
                    return (
                        <article className={styles.left} key={i}>
                            <h3>
                                {item.heading}
                            </h3>
                            <p>
                                {item.paragraphs}
                            </p>
                        </article>
                    )
                })}

                <article className={styles.right}>
                    <video controls>
                        <source src={health_data[0].right_side_video} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </article>
            </section>
            <Box />    
        </section>
    );
};

export default HealthAbout;
