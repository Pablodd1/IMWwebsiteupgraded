import React from 'react';
import styles from './footer.module.scss';
import { IoIosArrowForward } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import footer from "@IMAGE/footer_image.png"
import Image from 'next/image';
import { quickLinks, contacts, para, social_icon } from '@JSON/footer'

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.row}>
                    <div className={styles['footer-col']}>
                        <h4>Your <span><Image src={footer} alt="" /></span> Health</h4>
                        <p>
                            {para}
                        </p>
                    </div>

                    <div className={styles['footer-col']}>
                        <h2>Quick Links:</h2>
                        <ul >
                            {quickLinks.map((item, i) => {
                                return (<>
                                    <li key={i}><IoIosArrowForward /><a href="#">{item.text}</a></li>

                                </>)
                            })}
                        </ul>
                    </div>

                    <div className={styles['footer-col']}>
                        <h2>Contacts:</h2>
                        <ul>
                            <li><FaPhoneAlt style={{ marginTop: "-20px" }} /><a href="#">Call us now
                                <span>  {contacts.number}</span></a></li>
                            <li><IoMdMail style={{ marginTop: "-26px" }} /><a href="#">Email us
                                <span>  {contacts.email}</span></a></li>
                            <div className={styles['social-links']}>
                                {social_icon.map((item, i) => {
                                    return (<>
                                        <a href={item.url}>{item.facebook}</a>

                                    </>)
                                })}

                            </div>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>

    );
};

export default Footer;
