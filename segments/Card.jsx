import React from 'react';
import styles from './card.module.scss'; 
import Image from 'next/image';
import Button from '@ELEMENT/Button';
import cardData from '@JSON/card_data'

const Card = () => {
    return (
        <section className={styles.cardWrapper}>
            {cardData.map((item, i) => (
                <article className={styles.inner} key={i}>
                    <header>
                        <Image src={item.image} alt={item.heading} />
                        <h2>{item.heading}</h2>
                    </header>
                    <p>{item.desc}</p>
                    <footer className={styles.cardBtn}>
                        <Button title={item.title} />
                    </footer>
                </article>
            ))}
        </section>
    );
};

export default Card;
