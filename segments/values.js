import React from 'react';
import styles from './values.module.scss';
import { getDictionary } from '@JSON/index';

const Values =async ({ LANG }) => {
    const data = await getDictionary(LANG || 'en', `about.values`);

    return (
        <section className={styles.values}>
            <h2>{data.h2}</h2>
            <ul className={styles.grid}>
                {
                    data.ul.map(x => (
                        <li key={x} className={styles.valueItem}>
                            <h3>{x.h3}</h3>
                            <p>{x.p}</p>
                        </li>
                    ))
                }
            </ul>
        </section>
    );
};

export default Values;
