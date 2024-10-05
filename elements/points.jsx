import React from 'react';
import styles from './points.module.scss';
import { box_data } from '@JSON/health_about';

const Box = () => {
    return (
        <ul className={styles.box}>
            {box_data.map((item, i) => (
                <li className={styles.item} key={i}>
                    <h4>{item.heading}</h4>
                    <p>{item.des}</p>
                </li>
            ))}
        </ul>
    );
};

export default Box;
