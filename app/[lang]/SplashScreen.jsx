'use client';

import { useEffect, useState } from 'react';
import styles from './splashScreen.module.scss';

const STORAGE_KEY = 'imw_info_splash_v1';

export default function SplashScreen() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hasSeen = window.localStorage.getItem(STORAGE_KEY);
    if (!hasSeen) {
      const timer = setTimeout(() => setIsOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const closeSplash = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, 'true');
    }
    setIsOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, success: false, error: '' });

    try {
      const response = await fetch('/server/submitform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullname: formData.name,
          email: formData.email,
          message: 'Info request from splash screen.',
        }),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      setStatus({ loading: false, success: true, error: '' });
      closeSplash();
    } catch (error) {
      setStatus({ loading: false, success: false, error: 'Unable to submit right now.' });
    }
  };

  if (!isOpen) return null;

  return (
    <aside className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.card}>
        <button className={styles.close} type="button" onClick={closeSplash} aria-label="Close">
          ✕
        </button>
        <div className={styles.copy}>
          <p className={styles.kicker}>Welcome to Innovative Medical Wellness</p>
          <h2>Want personalized information?</h2>
          <p>
            Leave your name and email, and our front desk team will send the most relevant services and pricing details.
          </p>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            <span>Name</span>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              autoComplete="name"
            />
          </label>
          <label>
            <span>Email</span>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </label>
          {status.error ? <p className={styles.error}>{status.error}</p> : null}
          <button className={styles.submit} type="submit" disabled={status.loading}>
            {status.loading ? 'Sending...' : 'Send me details'}
          </button>
          <button className={styles.skip} type="button" onClick={closeSplash}>
            Not now
          </button>
          <a className={styles.call} href="tel:(305)864-1373">
            Prefer a call? (305) 864-1373
          </a>
        </form>
      </div>
    </aside>
  );
}
