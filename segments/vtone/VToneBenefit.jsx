import styles from "./VToneBenefit.module.scss";

export default function VToneBenefit({ content }) {
  const {
    heading,
    subTitle,
    content: sectionContent,
    left_side_image,
    imageAlt,
  } = content;
  const sections = sectionContent?.sections || [];

  return (
    <section className={styles.wrap}>
      <div className={styles.container}>
        <aside className={styles.left}>
          <img src={left_side_image} alt={imageAlt} className={styles.image} />
        </aside>

        <article className={styles.right}>
          <h2 className={styles.heading}>{heading}</h2>
          {subTitle && <h3 className={styles.subTitle}>{subTitle}</h3>}

          {sections.map((item, idx) => (
            <div key={idx} className={styles.block}>
              <h4 className={styles.subHeading}>{item.subHeading}</h4>
              <p className={styles.paragraph}>{item.paragraph}</p>
            </div>
          ))}
        </article>
      </div>
    </section>
  );
}
