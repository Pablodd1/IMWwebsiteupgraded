import Image from "next/image";
import styles from './action.module.scss';
import Link from "next/link";

const Body = ({ label, icon, hoverIcon, iconSize, iconAlt, iconClass, }) => (
    <>
        <span className={styles.button__line}></span>
        <span className={styles.button__line}></span>
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
        <span className={styles.button__drow1}></span>
        <span className={styles.button__drow2}></span>
    </>
)

const AnimatedAction = ({ href,onClick, type, btnclass, wrapperClass, ...rest }) => {
    const wc = `${wrapperClass ? wrapperClass.map(cls => styles[cls]).join(' ') : undefined}`;
    const bc = `${btnclass ? btnclass.map(cls => styles[cls]).join(' ') : undefined}`;
console.log(type)
    return (
        <section className={styles.btnWrap} >
            {
                type ?
                    <button onClick={onClick} type={type || 'button'} className={`${styles.button} ${bc ? bc : styles.darkBue}`}>
                        <Body {...rest} />
                    </button> :
                    <Link href={href || ''} className={`${styles.button} ${bc ? bc : styles.darkBue}`}>
                        <Body {...rest} />
                    </Link>
            }
        </section>
    );
}

export default AnimatedAction;
