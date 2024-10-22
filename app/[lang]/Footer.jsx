import styles from './footer.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { Logo } from '@ELEMENT/svgIcons';
import ToggleLanguage from '@ELEMENT/switchLang';
import { getDictionary } from '@JSON/index'

const Footer = async ({ LANG }) => {
    let footerNav, socialLinks;
    footerNav = await getDictionary(LANG || 'en', `general.navs`);
    socialLinks = await getDictionary(LANG || 'en', `general.socialLinks`);
 
    return (
        <footer className={styles.footer}>
            <section className={styles.container}>
                <Link href="/" className={styles.logo}>
                    {/* <Logo size={250} /> */}
                    <Image
                        src={`/raster/logo-512.webp`}
                        alt={'Innovative Medical Wellness - Logo'}
                        width={512} height={256}
                    />
                </Link>
                <nav className={styles.nav}>
                    {footerNav.map((x, i) => {
                        return (
                            <div key={i} className={styles.navItem}>
                                <h3>{x.label}</h3>
                                <ul>
                                    {x.nav.map((y, j) => (
                                        <li key={j}>
                                            <Link href={y.href}>{y.label}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </nav>
            </section>
            <section className={styles.bottom} >
                <footer className={styles.footer}>
                    <section className={styles.footerLinks}>
                        <p>© All Rights Reserved.</p>
                        <Link href={"/terms"}>Terms</Link>
                        <ToggleLanguage lang={LANG} />
                    </section>
                    <ul className={styles.socialLinks}>
                        {socialLinks.map((y, j) => (
                            <li key={j}>
                                <Link href={y.href}>
                                    <Image
                                        className=""
                                        src={`/svg/${y.icon}-white.svg`}
                                        width={50}
                                        height={50}
                                        alt={y.label}
                                    />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </footer>
            </section>
        </footer>
    );
};

export default Footer;
