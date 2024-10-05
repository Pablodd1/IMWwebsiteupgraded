import React from 'react';
import styles from './contact.module.scss';
import {  LocationIcon, Mail, PhoneIcon } from '@ELEMENT/svgIcons';
import Link from 'next/link';
import AnimatedLink from '@ELEMENT/Link';

const ContactUs = () => {
    return (
        <section className={styles.wrap}>
        <section className={styles.container}>
            <article className={styles.contact_details}>
                <h2>Contact Details</h2>
                <aside className={styles.aside} >
                <Link href={''}>
                    <LocationIcon color='#004166' />
                    470 Lucy Forks, Patriciafurt, YC7B 3UT
                </Link>
                <Link href={`tel:(123) 123-7891'}`}>
                    <PhoneIcon color='#004166' />
                    (123) 123-7891
                </Link>
                <Link href={`mailto:mail@demolink.org`}>
                    <Mail color='#004166' />
                    mail@demolink.org
                </Link>
                </aside>
            </article>

            <article className={styles.contact_form}>
                <h2>Contact Form</h2>
                <form action="" className={styles['contact-form']}>
                    <div className={styles.input_box}>
                        <input type="text" required={true} />
                        <span>Full Name</span>
                    </div>

                    <div className={styles.input_box}>
                        <input type="email" required={true} />
                        <span>Email</span>
                    </div>

                    <div className={styles.input_box}>
                        <textarea required={true}></textarea>
                        <span>Type your Message...</span>
                    </div>
                     
                        <AnimatedLink
                            href={``}
                            label={'Send Message'}
                            icon="emailSend-white"
                            hoverIcon={"emailSend-black"}
                            iconAlt="arrow right"
                            iconSize="17"
                            iconClass=""
                            btnclass={["btnSm","darkBlue"]}
                            wrapperClass=""
                        />
                </form>
            </article>
        </section>
        </section>
    );
};

export default ContactUs;
