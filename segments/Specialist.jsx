import React from 'react'
import styles from "./specialist.module.scss";
import Image from 'next/image';
import { FacebookIcon, LinkedinIcon, PinterestIcon, YoutubeIcon } from '@ELEMENT/svgIcons';
import Link from 'next/link';
import { getDictionary } from '@JSON/index'
const Specialist = async ({LANG}) => {
  const profile = await getDictionary(LANG || 'en', `homepage.specialist`);

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Meet our certified specialist</h2>
            <ul className={styles.cont}>
                {profile.map((item, i) => (
                    <li className={styles.item} key={i}>
                        <header className={styles.profile}>
                            <Image
                                src={
                                    item.image
                                        ? `/raster/specialists/${item.image}.webp`
                                        : `/svg/specialist-innovative-medical-wellness.svg`}
                                alt={item.name + 'Innovative Medical Wellness'}
                                width={250} height={250}
                                className={styles.img}
                            />
                            <h2>{item.name}</h2>
                        </header>
                        <section className={styles.content}>
                            <nav className={styles.social_link}>
                            <p>{item.position}</p>
                                <Link key={1} href=""><FacebookIcon /></Link>
                                <Link key={2} href=""><PinterestIcon /></Link>
                                <Link key={3} href=""><LinkedinIcon /></Link>
                                <Link key={4} href=""><YoutubeIcon /></Link>
                            </nav>
                            {item.description}
                        </section>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Specialist