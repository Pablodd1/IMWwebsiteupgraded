import React from 'react';
import styles from './contact.module.scss';
import { FaxIcon, LocationIcon, Mail, PhoneIcon } from '@ELEMENT/svgIcons';
import Link from 'next/link';
import { getDictionary } from '@JSON/index'
import SubmitForm from './submitForm';

const ContactUs = async ({ LANG }) => {
    const contactUS = await getDictionary(LANG || 'en', `general.contactUS`);

    if (!contactUS || !contactUS.details || !contactUS.form) {
        return <div>Contact information currently unavailable. Please call us directly.</div>;
    }

    return (
        <section className={styles.wrap} id="contact">
            <section className={styles.container}>
                <article className={styles.contact_details}>
                    <h2>{contactUS.details.h2}</h2>
                    <aside className={styles.aside} >
                        <Link href={'https://www.google.com/maps/search/?api=1&query=16100+NE+16th+Ave+North+Miami+Beach+FL+33162'} target="_blank">
                            <LocationIcon color='#007BA7' />
                            {contactUS.details.address}
                        </Link>
                        <Link href={`tel:${contactUS.details.phone}`}>
                            <PhoneIcon color='#007BA7' />
                            {contactUS.details.phone}
                        </Link>
                        <Link href={`fax:${contactUS.details.fax}`}>
                            <FaxIcon color='#007BA7' />
                            {contactUS.details.fax}
                        </Link>
                        <Link href={`mailto:${contactUS.details.email}`}>
                            <Mail color='#007BA7' />
                            {contactUS.details.email}
                        </Link>
                    </aside>
                </article>

                <article className={styles.contact_form}>
                    <h2>{contactUS.form.h2}</h2>
                    <SubmitForm styles={{ form: styles['contact-form'], input: styles.input_box }} contactUS={contactUS} />
                </article>
            </section>
        </section>
    );
};

export default ContactUs;
