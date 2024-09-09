import React from 'react';
import styles from "./about.module.scss"; // Importing the CSS module
import Image from 'next/image';
import aboutdata from '@JSON/about_data.js'


const About = () => {
    return (
        <div className={styles.about}>
            <div className={styles.about_inner}>
                {aboutdata.map((section, index) => (
                    <React.Fragment key={index}>
                        <div className={styles.left_side}>
                            <h2>{section.heading}</h2>
                            {section.paragraphs.map((para, paraIndex) => (
                                <p key={paraIndex}>{para}</p>
                            ))}
                        </div>
                        <div className={styles.right_side}>
                            <Image src={section.image} alt="About Image" />
                            <p>{section.right_side_desc}</p>
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default About;
