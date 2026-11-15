'use client';
import styles from './floatingActionMenu.module.scss';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import membershipImg from './membership.png';

const FloatingActionMenu = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const wrapRef = useRef(null);

    const openPopup = (e) => {
        e.preventDefault();
        setMenuOpen(false);
        setIsOpen(true);
        setTimeout(() => setIsVisible(true), 10);
    };

    const closePopup = () => {
        setIsVisible(false);
        setTimeout(() => setIsOpen(false), 300);
    };

    useEffect(() => {
        if (!menuOpen) return;
        const onDocClick = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        const onKeyDown = (e) => {
            if (e.key === 'Escape') setMenuOpen(false);
        };
        document.addEventListener('mousedown', onDocClick);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('mousedown', onDocClick);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [menuOpen]);

    return (
        <>
            <div ref={wrapRef} className={`${styles.container} ${menuOpen ? styles.expanded : ''}`}>
                <button
                    type="button"
                    onClick={() => setMenuOpen((prev) => !prev)}
                    className={styles.trigger}
                    aria-expanded={menuOpen}
                    aria-label={menuOpen ? 'Close quick links menu' : 'Open quick links menu'}
                >
                    <span className={styles.triggerText}>{menuOpen ? 'Close' : 'Services'}</span>
                    <span className={styles.triggerArrow} aria-hidden="true">{menuOpen ? '✕' : '▸'}</span>
                </button>

                {menuOpen && (
                    <div className={styles.drawer} role="region" aria-label="Quick service links">
                        <button type="button" onClick={openPopup} className={styles.btn} title="Membership">
                            <span className={styles.label}>Membership</span>
                        </button>

                        <a href="https://exomindmiamibeach.com/" target="_blank" rel="noopener noreferrer" className={styles.btn} title="ExoMind">
                            <span className={styles.label}>ExoMind Service</span>
                        </a>

                        <a href="/v-tone" className={styles.btn} title="V-Tone">
                            <span className={styles.label}>V-Tone Therapy</span>
                        </a>

                        <a href="https://www.agingbiohacking.com/" target="_blank" rel="noopener noreferrer" className={`${styles.btn} ${styles.highlight}`} title="Aging Biohacking">
                            <span className={styles.label}>Aging Biohacking</span>
                        </a>
                    </div>
                )}
            </div>

            {isOpen && (
                <div className={`${styles.overlay} ${isVisible ? styles.open : ''}`} onClick={closePopup}>
                    <div className={`${styles.popup} ${isVisible ? styles.visible : ''}`} onClick={(e) => e.stopPropagation()}>
                        <button onClick={closePopup} className={styles.closeButton} aria-label="Close membership modal">
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
