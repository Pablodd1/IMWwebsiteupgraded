'use server'
import Link from 'next/link';
import styles from './page.module.scss';
// import { Angle, BagIcon, Logo, PhoneIcon, SearchIcon } from '@reusable/svgIcons';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Angle } from '@ELEMENT/svgIcons';

// const Watches = dynamic(() => import('@reusable/navbar/segments').then(mod => mod.Watches), { suspense: true });
// const NewArrival = dynamic(() => import('@reusable/navbar/segments').then(mod => mod.NewArrival), { suspense: true });
// const Collections = dynamic(() => import('@reusable/navbar/segments').then(mod => mod.Collections), { suspense: true });

const menuItems = [
    { id: 1, label: 'Chiropractic', link: '/chiropractic', submenu: ['Posture'] },
    { id: 2, label: 'Regenerative Medicine', link: '/regenerative-medicine', submenu: ['Hair Restoration', 'Joint Rejuvenation', 'Brain Restoration'] },
    { id: 3, label: 'Wellness', link: '/wellness', submenu: ['Medical Weight Loss'] },
    { id: 4, label: 'Anti-Aging', link: '/anti-aging', submenu: ['Hormone replacement', 'Facial Rejuvenation', 'Peptide Therapy', 'IV therapy'] },
    { id: 5, label: 'About us', link: '/about' },
];

const renderMenuItem = ({ label, link, submenu }) => (
    <li key={label}>
        <Link href={link} className={styles.menuLink}>
            <span>{label}</span>
            {submenu && <Angle />}
        </Link>
        {submenu ? (
            <ul className={`${styles.submenu} ${label === 'New Arrival' ? styles.shrink : ''}`}>
                <Suspense fallback={'Loading...'}>
                    {submenu.map(x => <li key={x} className={styles.li} ><Link href={x.replace(' ', '-')}>{x}</Link> </li>)}
                </Suspense>
            </ul>
        )
            : ''
        }

    </li>
);

const renderIconButton = ({ label, icon, onClick }) => (
    <button key={label} onClick={'onClick'} aria-label={label}>
        {icon}
    </button>
);

export default async function NavBar(props) {
    const { params, searchParams } = props
    
    return (
        searchParams?.viewport !== ('mobile' || 'tablet')
            ? <ul className={styles.menu}>{menuItems.map(renderMenuItem)}</ul>
            : <p ></p>
    );
};

