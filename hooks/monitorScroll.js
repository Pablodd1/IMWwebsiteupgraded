'use client'
import { useEffect } from 'react';

const UseScrollEffect = ({navbarId, activeClass, threshold = 100}) => {
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.getElementById(navbarId);
      if (!navbar) return;

      if (window.scrollY > threshold) {
        navbar.classList.add(activeClass);
      } else {
        navbar.classList.remove(activeClass);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navbarId, activeClass, threshold]);
};

export default UseScrollEffect;
