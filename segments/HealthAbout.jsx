import React from 'react';
import styles from './Health.module.scss'; // Importing the SCSS module
import { health_data } from '@JSON/health_about';
import Box from '@ELEMENT/Box';
const HealthAbout = () => {
    return (
        <>
            <div className={styles.container}>
                {health_data.map((item, i) => {
                    return (
                        <div className={styles.left} key={i}>
                            <h4>
                                {item.heading}<br />
                            </h4>
                            <p>
                                {item.paragraphs}
                            </p>
                        </div>
                    )
                })}

                <div className={styles.right}>
                    <video controls>
                        <source src={health_data[0].right_side_video} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>

            <Box />
       

        </>
    );
};

export default HealthAbout;
