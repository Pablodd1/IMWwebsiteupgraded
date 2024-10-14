import React from 'react';
import styles from './card.module.scss';
import Image from 'next/image';
import AnimatedAction from '@ELEMENT/Action';
import { getDictionary } from '@JSON/index';
import OpenBlog from './activateBlog';
import CloseBlog from './closeBlog';

const Card = async ({ LANG, PAGE, data }) => {
    const cardData = await getDictionary(LANG || 'en', `homepage.cards`);
    return (
        <section id="blogSection" className={styles.cardWrapper} style={{ backgroundImage: `url('/raster/departs/${PAGE}/Innovative Medical Wellness - ${PAGE}-2.webp')` }} >
            <div class={styles.overlay} />
             {data?.map((item, i) => (
                <figure id={`blog_${i}`} className={`${styles.inner} ${i === 0 ? styles.active : ''}`} key={i}>
                    <Image
                        src={`/raster/departs/${PAGE}/Innovative Medical Wellness - ${item.image}.webp`}
                        alt={item.heading}
                        width={448} height={348}
                    />
                   <CloseBlog id={`blog_${i}`} styles={styles.close} classN={styles.reading} />
                   <figcaption className={styles.cardBtn}>
                        <h3>{item.heading}</h3>
                        <p>{item.summary}</p>
                        <ul >
                            {item.blog.map(x => <li key={x}>{x}</li>)}
                        </ul>
                        <OpenBlog id={`blog_${i}`} btn={item.title} classN={styles.reading} />
                    </figcaption>
                </figure>
            ))}
        </section>
    );
};

export default Card;
