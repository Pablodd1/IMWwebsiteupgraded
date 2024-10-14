import React from 'react';
import styles from './card.module.scss';
import Image from 'next/image';
import AnimatedAction from '@ELEMENT/Action';
import { getDictionary } from '@JSON/index'

const Card = async ({LANG}) => {
    const cardData = await getDictionary(LANG || 'en', `homepage.cards`);
    return (
        <section className={styles.cardWrapper}>
            {cardData.map((item, i) => (
                <figure className={styles.inner} key={i}>
                    <Image 
                    src={`/raster/cards/${item.image}.jpg`} 
                    alt={item.heading} 
                    width={448} height={348}
                    />
                    <figcaption className={styles.cardBtn}>
                        <h3>{item.heading}</h3>
                        <p>{item.desc}</p>
                        <AnimatedAction
                            href={``}
                            label={item.title}
                            icon="emailSend-white"
                            hoverIcon={"emailSend-black"}
                            iconAlt="arrow right"
                            iconSize="17"
                            iconClass=""
                            btnclass={["btnSm","darkBlue"]}
                            wrapperClass=""
                        />
                    </figcaption>
                </figure>
            ))}
        </section>
    );
};

export default Card;
