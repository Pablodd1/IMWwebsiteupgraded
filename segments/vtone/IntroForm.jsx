// segments/VTone/IntroForm.jsx
import styles from "./IntroForm.module.scss";

export default function VToneIntroForm({ content }) {
  const { title, subtitle, description, consultationForm } = content;

  return (
    <section className={styles.wrap}>
      <div className={styles.container}>
        {/* Left content */}
        <article className={styles.copy}>
          <h2 className={styles.title}>{title}</h2>
          <h3 className={styles.subtitle}>{subtitle}</h3>

          <p className={styles.p}>{description.paragraph1}</p>
          <p className={styles.p}>{description.paragraph2}</p>

          {description.offer ? (
            <div className={styles.offer}>{description.offer}</div>
          ) : null}
        </article>

        {/* Right form */}
        <aside className={styles.formCard}>
          {/* <header className={styles.formHeader}>
            <h3>{consultationForm.heading}</h3>
            <span className={styles.service}>{consultationForm.service}</span>
          </header> */}
          <header className={styles.formHeader}>
            <h3>{consultationForm.heading}</h3>
            <span className={styles.service}>
              {consultationForm.service.toUpperCase()}
            </span>
          </header>

          {/* ────────────────────────────────────────────────────────────
              HIGHLEVEL FORM EMBED ZONE — INACTIVE PLACEHOLDER
              Replace everything between HL-START and HL-END with the
              dedicated HighLevel form embed code when it is ready.
              The live page (master branch) keeps its current form.
              ──────────────────────────────────────────────────────────── */}
          {/* HL-START */}
          <div
            className={styles.hlPlaceholder}
            data-hl-form="callback"
            aria-hidden="true"
          >
            <span className={styles.hlPlaceholderTag}>
              Form area — placeholder
            </span>
            <p className={styles.hlPlaceholderText}>
              HighLevel callback form will be embedded in this space.
            </p>
            <button
              type="button"
              disabled
              className={styles.hlPlaceholderBtn}
              tabIndex={-1}
            >
              {consultationForm.btn || "Request a callback"}
            </button>
          </div>
          {/* HL-END */}

          <p className={styles.consent}>{consultationForm.consentText}</p>
        </aside>
      </div>
    </section>
  );
}
