"use client";
import Masonry from "react-masonry-css";
import Image from "next/image";
import styles from "./VToneTestimonials.module.scss";

export default function VToneTestimonials({ content }) {
  const { section } = content || {};
  const { heading, testimonials = [] } = section || {};

  const breakpointColumnsObj = {
    default: 3,
    1200: 2,
    768: 1,
  };

  return (
    <section className={styles.wrap}>
      <div className={styles.container}>
        <h2 className={styles.heading}>{heading}</h2>

        <Masonry
          breakpointCols={breakpointColumnsObj}
          className={styles.masonryGrid}
          columnClassName={styles.masonryColumn}
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`${styles.card} ${t.image ? styles.imageCard : ""}`}
            >
              {t.image ? (
                <div className={styles.imageWrapper}>
                  <img
                    src={t.image}
                    alt={t.name || "testimonial image"}
                    className={styles.image}
                  />
                </div>
              ) : (
                <>
                  <p className={styles.text}>“{t.text}”</p>
                  <p className={styles.name}>– {t.name}</p>
                </>
              )}
            </div>
          ))}
        </Masonry>
      </div>
    </section>
  );
}
