import Image from "next/image";
import styles from './link.module.scss';
import Link from "next/link";

const AnimatedLink = ({ href, type, label, icon, hoverIcon, iconSize, iconAlt, iconClass, btnclass, wrapperClass }) => {
    const wc = `${wrapperClass ? wrapperClass.map(cls => styles[cls]).join(' ') : undefined}`;
    const bc = `${btnclass ? btnclass.map(cls => styles[cls]).join(' ') : undefined}`;

    return (
        <section className={styles.btnWrap} >
            <Link href={href || ''} type={type || 'button'} className={`${styles.button} ${bc ? bc : styles.darkBue}`}>
                <div className={styles.button__line}></div>
                <div className={styles.button__line}></div>
                <span className={`${styles.button__text} ${hoverIcon ? styles.hoverEffect : ''}`}>
                    {/* <Image
                    src={`/svg/${icon}.svg`}
                    className={`ms-2 ${styles.icon} ${styles.show} ${iconClass}`}
                    alt={`${iconAlt}`}
                    width={iconSize ? iconSize : 17}
                    height={25}
                /> */}
                    {/* {hoverIcon &&
                    <Image
                        src={`/svg/${hoverIcon}.svg`}
                        className={`ms-2 ${styles.icon} ${styles.onHover} ${iconClass}`}
                        alt={iconAlt}
                        width={iconSize ? iconSize : 17}
                        height={25}
                    />} */}
                    {label}
                </span>
                <div className={styles.button__drow1}></div>
                <div className={styles.button__drow2}></div>
            </Link>
        </section>
    );
}

export default AnimatedLink;
