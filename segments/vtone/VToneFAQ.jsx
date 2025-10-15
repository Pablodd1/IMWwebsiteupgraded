"use client";
import { useState } from "react";
import styles from "./VToneFAQ.module.scss";
import { FiChevronRight } from "react-icons/fi";

export default function VToneFAQ({ content }) {
  const { section } = content || {};
  const { heading, faqs = [] } = section || {};
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className={styles.wrap}>
      <div className={styles.container}>
        <h2 className={styles.heading}>{heading}</h2>

        <div className={styles.accordion}>
          {faqs.map((item, i) => (
            <div key={i} className={styles.item}>
              <button
                className={`${styles.question} ${
                  activeIndex === i ? styles.active : ""
                }`}
                onClick={() => toggleFAQ(i)}
              >
                <span>{item.question}</span>
                <FiChevronRight className={styles.icon} />
              </button>

              <div
                className={`${styles.answerWrapper} ${
                  activeIndex === i ? styles.open : ""
                }`}
              >
                <p className={styles.answer}>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
