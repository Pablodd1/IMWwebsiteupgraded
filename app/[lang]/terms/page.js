// pages/Terms.js

import React from 'react';
import styles from './page.module.scss';
const terms = [
    {
        h: "Introduction",
        p: "Welcome to our website. By accessing or using this website, you agree to comply with and be bound by the following policy and terms and conditions. If you do not agree to these terms, you should not use this website. We reserve the right to modify these terms at any time, and your continued use of the website constitutes acceptance of any changes."
    },
    {
        h: "1. Use of Website",
        p: "You are permitted to use the website for lawful purposes only. You may not use the website to transmit, distribute, store, or destroy material (a) in violation of any applicable law or regulation, (b) in a manner that will infringe the copyright, trademark, trade secret, or other intellectual property rights of others, or (c) in a manner that violates the privacy, publicity, or other personal rights of others."
    },
    {
        h: "2. User Obligations",
        p: "You agree not to use the website in any way that could damage, disable, overburden, or impair the website or interfere with any other party's use and enjoyment of the website. You must not obtain or attempt to obtain any materials or information through any means not intentionally made available or provided through the website."
    },
    {
        h: "3. Intellectual Property Rights",
        p: "All content on the website, including text, graphics, logos, images, and software, is the property of Innovative Medical Wellness LLC and is protected by international copyright laws. You may not modify, reproduce, distribute, create derivative works, or otherwise exploit the content in any way without prior written consent from Innovative Medical Wellness LLC."
    },
    {
        h: "4. Privacy Policy",
        p: "Your use of the website is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs the website and informs users of our data collection practices."
    },
    {
        h: "5. Disclaimers",
        p: "The information provided on this website is for general informational purposes only. All content and services are provided 'as is' without any guarantees or warranties. We do not warrant that the functions contained in any materials will be uninterrupted or error-free, that defects will be corrected, or that the website or the server that makes it available are free of viruses or other harmful components."
    },
    {
        h: "6. Limitation of Liability",
        p: "In no event shall Innovative Medical Wellness LLC be liable for any damages (including, without limitation, indirect, incidental, special, or consequential damages) arising out of the use or inability to use the website or any content provided on the website."
    },
    {
        h: "7. Governing Law",
        p: "These terms and conditions are governed by and construed in accordance with the laws of [Your Country/State], and you irrevocably submit to the exclusive jurisdiction of the courts in that location."
    },
    {
        h: "8. Termination",
        p: "We reserve the right to terminate or suspend your access to the website at any time, without notice, for conduct that we believe violates these Terms and Conditions or is harmful to other users of the website, us, or third parties, or for any other reason."
    },
    {
        h: "9. Changes to Terms and Conditions",
        p: "We reserve the right to change these Terms and Conditions at any time without prior notice. Your continued use of the website after any changes indicates your acceptance of the new Terms and Conditions."
    }
]
const Terms = () => {
    return (
        <section className={styles.termsContainer}>
            <h1 className={styles.title}>Website Policy and Terms & Conditions</h1>
            {
                terms.map(x => (
                    <article  key={x.h}>
                        <h2 className={styles.subtitle}>{x.h}</h2>
                        <p>
                            {x.p}
                        </p>
                    </article>
                ))
            }
        </section>
    );
};

export default Terms;
