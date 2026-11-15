import React from 'react';
import styles from './history.module.scss';
import { getDictionary } from '@JSON/index';

const History =async ({LANG}) => {
    const data = await getDictionary(LANG || 'en', `about.history`);
  return (
    <section className={styles.history}>
      <h2>{data.h2}</h2>
      <p>{data.p}</p>
      <ul>
        {data.ul.map((x, i) => <li key={x.pre || i}><strong>{x.pre}</strong>{x.p}</li>)}
      </ul>
    </section>
  );
};

export default History;
