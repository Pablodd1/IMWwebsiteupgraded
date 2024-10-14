import React from 'react';
import Image from 'next/image';
import styles from './team.module.scss';
import { getDictionary } from '@JSON/index'

const Team = async ({LANG}) => {
  const profile = await getDictionary(LANG || 'en', `homepage.specialist`);
  const teamMembers = [
        { name: 'John Doe', position: 'CEO', img: '/team/john.jpg' },
        { name: 'Jane Smith', position: 'CTO', img: '/team/jane.jpg' },
        { name: 'Mike Johnson', position: 'COO', img: '/team/mike.jpg' },
        { name: 'Emily Brown', position: 'Head of Marketing', img: '/team/emily.jpg' }
    ];

    return (
        <section className={styles.team}>
            <h2>Meet Our Team</h2>
            <div className={styles.grid}>
                {profile.map((member, index) => (
                    <div key={index} className={styles.teamMember}>
                        <Image
                            src={
                                member.image
                                    ? `/raster/specialists/${member.image}.webp`
                                    : `/svg/specialist-innovative-medical-wellness.svg`}
                            alt={member.name}
                            width={250} height={250}
                            className={styles.img}
                        />
                        <h3>{member.name}</h3>
                        <p>{member.position}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Team;
