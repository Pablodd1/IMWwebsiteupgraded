'use client'
import React, { useState } from 'react';
import styles from './floatButton.module.scss';
import Image from 'next/image';
import membership from './membership.png';

const MembershipPopup = () => {
  const [isOpen, setIsOpen] = useState(false);     // Controls visibility
  const [isVisible, setIsVisible] = useState(false); // Controls animation state

  const openPopup = () => {
    setIsOpen(true);
    setTimeout(() => setIsVisible(true), 10); // Small delay for CSS transition
  };

  const closePopup = () => {
    setIsVisible(false);
    setTimeout(() => setIsOpen(false), 300); // Wait for the transition to finish
  };

  return (
    <div className={styles.container}>
      <button onClick={openPopup} className={styles.button}>
        Membership
      </button>

      {isOpen && (
        <div className={`${styles.overlay} ${isVisible ? styles.open : ''}`} onClick={closePopup}>
          <div className={`${styles.popup} ${isVisible ? styles.visible : ''}`} onClick={(e) => e.stopPropagation()}>
            <button onClick={closePopup} className={styles.closeButton}>
              &times;
            </button>
            <Image src={membership} alt="Membership Plan Innovative Medical Wellness" className={styles.image}  />
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipPopup;
