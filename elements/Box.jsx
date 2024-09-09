import React from 'react';
import styles from './main.module.scss'; 
import { box_data } from '@JSON/health_about';

const Box = () => {
    return (
        <div className={styles.box}>
            {box_data.map((item, i) => (
                <div className={styles.item} key={i}>
                    <div className={styles.check}>✔</div>
                    <div className={styles.content}>
                        <h2>{item.heading}</h2>
                        <p>{item.des}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Box;
