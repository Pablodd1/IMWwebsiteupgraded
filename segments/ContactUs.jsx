import React from 'react';
import styles from './contact.module.scss';
import {  LocationIcon, Mail, PhoneIcon } from '@ELEMENT/svgIcons';
import Link from 'next/link';
import AnimatedAction from '@ELEMENT/Action';
import { getDictionary } from '@JSON/index'

const ContactUs = async ({LANG}) => {
  const contactUS = await getDictionary(LANG || 'en', `general.contactUS`);

    return (
        <section className={styles.wrap}>
        <section className={styles.container}>
            <article className={styles.contact_details}>
                <h2>{contactUS.details.h2}</h2>
                <aside className={styles.aside} >
                <Link href={''}>
                    <LocationIcon color='#004166' />
                    {contactUS.details.address}
                </Link>
                <Link href={`tel:${contactUS.details.phone}`}>
                    <PhoneIcon color='#004166' />
                    {contactUS.details.phone}
                </Link>
                <Link href={`mailto:${contactUS.details.email}`}>
                    <Mail color='#004166' />
                    {contactUS.details.email}
                </Link>
                </aside>
            </article>

            <article className={styles.contact_form}>
                <h2>{contactUS.form.h2}</h2>
                <form action="" className={styles['contact-form']}>
                    <div className={styles.input_box}>
                        <input type="text" required={true} />
                        <span>{contactUS.form.fullname}</span>
                    </div>

                    <div className={styles.input_box}>
                        <input type="email" required={true} />
                        <span>{contactUS.form.email}</span>
                    </div>

                    <div className={styles.input_box}>
                        <textarea required={true}></textarea>
                        <span>{contactUS.form.msg}</span>
                    </div>
                     
                        <AnimatedAction
                            href={``}
                            label={contactUS.form.btn}
                            icon="emailSend-white"
                            hoverIcon={"emailSend-black"}
                            iconAlt={contactUS.form.btn}
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
