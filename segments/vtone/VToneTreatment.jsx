import styles from "./VToneTreatment.module.scss";

export default function VToneTreatment({ content }) {
  const {
    heading,
    subTitle,
    paragraph1,
    paragraph2,
    paragraph3,
    left_side_image,
    imageAlt,
  } = content;

  return (
    <section className={styles.wrap}>
      <div className={styles.container}>
        {/* LEFT — Text */}
        <article className={styles.left}>
          <h2 className={styles.heading}>{heading}</h2>
          {subTitle && <h3 className={styles.subTitle}>{subTitle}</h3>}
          <p className={styles.paragraph}>{paragraph1}</p>
          <p className={styles.paragraph}>{paragraph2}</p>
          <p className={styles.paragraph}>{paragraph3}</p>
        </article>

        {/* RIGHT — Image */}
        <aside className={styles.right}>
          <img src={left_side_image} alt={imageAlt} className={styles.image} />
        </aside>
      </div>
    </section>
  );
}
