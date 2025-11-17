import Image from "next/image";
import styles from "./Featured.module.scss";

export default function VToneFeatured({ content }) {
  const { heading, logos } = content;

  return (
    <section className={styles.wrap}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>{heading}</h2>
        <ul className={styles.logos}>
          {logos.map((l, i) => (
            <li key={i} className={styles.logoItem}>
              <Image src={l.src} alt={l.alt} width={120} height={120} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
