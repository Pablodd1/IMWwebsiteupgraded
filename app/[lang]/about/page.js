import React from 'react';
import Team from '@SEGMENT/team';
import Values from '@SEGMENT/values';
import History from '@SEGMENT/history';
import styles from './page.module.scss';
import { getDictionary } from '@JSON/index';

const About =async ({params}) => {
    const LANG = params.lang
    const data = await getDictionary(LANG || 'en', `about.intro`);

  return (
    <div className={styles.about}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>{data.h1}</h1>
          <p>{data.p}</p>
        </div>
      </section>

      <section className={styles.section}>
        <h2>{data.h2}</h2>
        <p>{data.story}</p>
      </section>

      <Values  LANG={LANG}/>

      <History LANG={LANG} />

      <Team LANG={LANG} />
    </div>
  );
};

export default About;
