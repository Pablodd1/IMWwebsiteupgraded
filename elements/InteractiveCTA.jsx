'use client';

import Link from 'next/link';
import styles from './interactiveCTA.module.scss';
import { Mail, PhoneIcon } from './svgIcons';

export default function InteractiveCTA() {
    return (
        <div className={styles.container}>
            <Link href="tel:(305)864-1373" className={styles.mainBtn}>
                <span className={styles.text}>Book a Free Consultation</span>
                <div className={styles.iconContainer}>
                    <PhoneIcon className={styles.icon} />
                </div>
            </Link>

            <div className={styles.secondaryGroup}>
                <Link href="#contact" className={styles.secondaryBtn}>
                    Request Info <Mail />
                </Link>
            </div>
        </div>
    );
}
