'use client'
import React from 'react';
import { TypeAnimation } from 'react-type-animation';
import styles from './costCTA.module.scss';
import AnimatedAction from '@ELEMENT/Action';

const CostQueryCTA =  ({ services, data }) => {

    return (
        <div className={styles.ctaContainer}>
            <h2 className={styles.title}>{data.h2}</h2>
            {/* <div className={styles.animation}>
                <TypeAnimation
                    sequence={services.flatMap(service => [service, 2000])} // Shows each service name for 2 seconds
                    speed={50}
                    wrapper="span"
                    repeat={Infinity}
                />
            </div> */}
            <p className={styles.paragraph}>
                {data.p}
            </p>
            <div className={styles.animation}>
                <TypeAnimation
                    sequence={services.flatMap(service => [service, 4000])} // Shows each service name for 2 seconds
                    speed={50}
                    wrapper="span"
                    repeat={Infinity}
                />
            </div>
            <div className={styles.buttonContainer}>
                <AnimatedAction
                    label={data.button.about}
                    href={'/about'}
                    icon="emailSend-white"
                    hoverIcon={"emailSend-black"}
                    iconAlt={data.button.about}
                    iconSize="17"
                    iconClass=""
                    wrapperClass=""
                    btnclass={["darkGray"]}
                />
                <AnimatedAction
                    label={data.button.getCost}
                    href={'/contact'}
                    icon="emailSend-white"
                    hoverIcon={"emailSend-black"}
                    iconAlt={data.button.getCost}
                    iconSize="17"
                    iconClass=""
                    wrapperClass=""
                    btnclass={["green"]}
                />
            </div>
        </div>
    );
};

export default CostQueryCTA;
