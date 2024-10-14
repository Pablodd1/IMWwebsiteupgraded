import React from 'react';
import styles from './points.module.scss';

const Box = ({data}) => {
    return (
        <ul className={styles.box}>
            {data?.map((item, i) => (
                <li className={styles.item} key={i}>
                    <h4>{item.heading}</h4>
                    <p>{item.des}</p>
                </li>
            ))}
        </ul>
    );
};

export default Box;
