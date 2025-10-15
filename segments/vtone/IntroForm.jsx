// segments/VTone/IntroForm.jsx
import styles from "./IntroForm.module.scss";
import SubmitForm from "../submitForm";

export default function VToneIntroForm({ content }) {
  const { title, subtitle, description, consultationForm } = content;

  const contactUS = {
    form: consultationForm,
  };

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

          <SubmitForm
            styles={{ form: styles.form, input: styles.input }}
            contactUS={contactUS}
          />

          <p className={styles.consent}>{consultationForm.consentText}</p>
        </aside>
      </div>
    </section>
  );
}
