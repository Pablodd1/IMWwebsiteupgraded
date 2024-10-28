'use client';

import { usePathname, useRouter } from 'next/navigation'; // Use router for navigation
import Image from 'next/image';
import styles from './switchLang.module.scss';

const ToggleLanguage = ({ lang }) => {
    const pathname = usePathname();
    const router = useRouter(); // Use Next.js router for navigation

    const newLang = lang === 'en' ? 'es' : 'en'; // Toggle language

    const switchLocale = () => {
        // Construct new path with the toggled language
        const newPath = pathname.replace(`/${lang}`, `/${newLang}`);
        
        // Navigate to the new path using router.push for proper routing
        router.push(newPath);
    };

    return (
        <button onClick={switchLocale} className={styles.btn}>
            <Image
                src={`/svg/language.svg`}
                className={styles.icon}
                alt={'Language icon' + 'Innovative Medical Wellness'}
                width={17}
                height={25}
            />
            {lang === 'en' ? 'Switch to Spanish' : 'Switch to English'}
        </button>
    );
};

export default ToggleLanguage;
