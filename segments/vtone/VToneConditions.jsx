import styles from "./VToneConditions.module.scss";

export default function VToneConditions({ content }) {
  const { heading, paragraph1, paragraph2, left, imageAlt } = content;

  return (
    <section className={styles.wrap}>
      <div className={styles.container}>
        {/* LEFT — Image */}
        <aside className={styles.left}>
          <img src={left} alt={imageAlt} />
        </aside>

        {/* RIGHT — Text */}
        <article className={styles.right}>
          <h2 className={styles.heading}>{heading}</h2>
          <p className={styles.paragraph}>{paragraph1}</p>
          <p className={styles.paragraph}>{paragraph2}</p>
        </article>
      </div>
    </section>
  );
}
