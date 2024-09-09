import React from 'react';
import styles from './main.module.scss'; // Import the SCSS module

const Button = ({ title }) => {
    return (
        <button className={styles.btn}>
            {title}
        </button>
    );
};

export default Button;
