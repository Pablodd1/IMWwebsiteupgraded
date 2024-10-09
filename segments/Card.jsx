import React from 'react';
import styles from './card.module.scss';
import Image from 'next/image';
import cardData from '@JSON/card_data'
import AnimatedAction from '@ELEMENT/Action';

const Card = () => {
    return (
        <section className={styles.cardWrapper}>
            {cardData.map((item, i) => (
                <figure className={styles.inner} key={i}>
                    <Image src={item.image} alt={item.heading} />
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
