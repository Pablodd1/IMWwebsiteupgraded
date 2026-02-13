'use client';
import styles from './floatingActionMenu.module.scss';
import { useState } from 'react';
import Image from 'next/image';
import membershipImg from './membership.png';

const FloatingActionMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const openPopup = (e) => {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => setIsVisible(true), 10);
    };

    const closePopup = () => {
        setIsVisible(false);
        setTimeout(() => setIsOpen(false), 300);
    };

    return (
        <>
            <div className={`${styles.container} ${styles.alwaysOpen}`}>
                <button onClick={openPopup} className={styles.btn} title="Membership">
                    <span className={styles.label}>Membership</span>
                </button>

                <a href="https://exomindmiamibeach.com/" target="_blank" className={styles.btn} title="ExoMind">
                    <span className={styles.label}>ExoMind Service</span>
                </a>

                <a href="/v-tone" className={styles.btn} title="V-Tone">
                    <span className={styles.label}>V-Tone Therapy</span>
                </a>

                <a href="https://www.agingbiohacking.com/" target="_blank" className={`${styles.btn} ${styles.highlight}`} title="Aging Biohacking">
                    <span className={styles.label}>Aging Biohacking</span>
                </a>
            </div>

            {isOpen && (
                <div className={`${styles.overlay} ${isVisible ? styles.open : ''}`} onClick={closePopup}>
                    <div className={`${styles.popup} ${isVisible ? styles.visible : ''}`} onClick={(e) => e.stopPropagation()}>
                        <button onClick={closePopup} className={styles.closeButton}>
                            &times;
                        </button>
                        <Image src={membershipImg} alt="Membership Plan Innovative Medical Wellness" className={styles.image} />
                    </div>
                </div>
            )}
        </>
    );
};

export default FloatingActionMenu;
