import styles from "./About.module.scss";

export default function VToneAbout({ content }) {
  const {
    heading,
    paragraph1,
    paragraph2,
    left_side_video,
    right_side_image,
    imageAlt,
  } = content;

  return (
    <section className={styles.wrap}>
      <div className={styles.container}>
        <article className={styles.left}>
          <h2 className={styles.heading}>{heading}</h2>

          <p className={styles.paragraph}>{paragraph1}</p>
          <p className={styles.paragraph}>{paragraph2}</p>
          {/* <div className={styles.videoWrapper}>
            <iframe
              width="560"
              height="315"
              src={left_side_video}
              title={heading}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div> */}
        </article>

        <aside className={styles.right}>
          <img src={right_side_image} alt={imageAlt} className={styles.image} />
        </aside>
      </div>
    </section>
  );
}
