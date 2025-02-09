import React from 'react';
import styles from './card.module.scss';
import Image from 'next/image';
import { getDictionary } from '@JSON/index';
import OpenBlog from './blog/activateBlog';
import Blog from './blog/blog';

const Card = async ({ LANG, PAGE, data }) => {
    const btn = await getDictionary(LANG || 'en', `general.btn`);
    return (
        <section id="blogSection" className={styles.cardWrapper} style={{ backgroundImage: `url('/raster/departs/${PAGE}/Innovative Medical Wellness - ${PAGE}-2.webp')` }} >
            <div className={styles.overlay} />
            {data?.map((item, i) => (
                <section id={`blog_${i}`} className={`${styles.inner}`} key={i}>
                    <Image
                        src={`/raster/departs/${PAGE}/Innovative Medical Wellness - ${item.image}.webp`}
                        alt={item.heading + 'Innovative Medical Wellness'}
                        className={styles.img}
                        width={448} height={348}
                    />{console.log(item,item.blog)}
                    <section className={styles.text}>
                        <h3>{item.heading}</h3>
                        <p>{item.summary}</p>
                        <Blog BLOG={`blogs.${item.blog}`} LANG={LANG} />
                        <OpenBlog blog={'red-light-therapy'} blogC={styles.blog_space} idx={`blog_${i}`} active={styles.active} btn={btn} styles={styles.close} classN={styles.reading} />
                    </section>
                </section>
            ))}
        </section>
    );
};

export default Card;
