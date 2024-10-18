'use client';
import { useState } from 'react';
import AnimatedAction from '@ELEMENT/Action';
import styles from './submitform.module.scss';

export default function SubmitForm({ contactUS }) {
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page refresh
        setIsSubmitting(true);
        setErrorMessage(''); // Reset any previous errors
        setSuccessMessage(''); // Reset success message

        try {
            const response = await fetch('/server/submitform', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to submit form');
            }

            // Set success message
            setSuccessMessage('Form submitted successfully!');

            // Reset form data
            setFormData({
                fullname: '',
                email: '',
                message: ''
            });
        } catch (error) {
            setErrorMessage('An error occurred while submitting the form.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.input}>
                <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleInputChange}
                    required
                />
                <span>{contactUS.form.fullname}</span>
            </div>

            <div className={styles.input}>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                />
                <span>{contactUS.form.email}</span>
            </div>

            <div className={styles.input}>
                <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                ></textarea>
                <span>{contactUS.form.msg}</span>
            </div>

            <AnimatedAction
                label={isSubmitting ? 'Submitting...' : contactUS.form.btn}
                icon="emailSend-white"
                type={'submit'}
                hoverIcon={"emailSend-black"}
                iconAlt={contactUS.form.btn}
                iconSize="17"
                iconClass=""
                wrapperClass=""
                btnclass={["darkBlue"]}
                disabled={isSubmitting}
            />

            {/* Display success or error messages */}
            {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
            {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        </form>
    );
}
