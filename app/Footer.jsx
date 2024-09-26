import styles from './footer.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import footerNav from '@JSON/navs.json';
import socialLinks from '@JSON/socialLinks.json';
import { Logo } from '@ELEMENT/svgIcons';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <section className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <Logo size={250} />
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
                        <Link href={"/tasamem-express-terms-of-service"}>Terms</Link>
                        <Link href={"/tasamem-express-privacy-statement"}>Privacy</Link>
                    </section>
                    <ul className={styles.socialLinks}>
                        {socialLinks.map((y, j) => (
                            <li key={j}>
                                <Link href={y.href}>
                                    <Image
                                        className=""
                                        src={`/svg/${y.icon}.svg`}
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
