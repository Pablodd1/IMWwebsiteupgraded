'use client';
import Image from 'next/image';
import { useCallback } from 'react';
import AnimatedAction from '@ELEMENT/Action';
const CloseBlog = ({id, styles,classN }) => {
    const handleClick = useCallback(() => {
        const blogSection = document.getElementById('blogSection');
        if (blogSection) blogSection.classList.remove(classN);

        const element = document.getElementById(id);
        if (element) element.classList.remove('active');
    }, [id]);

    return (
        <Image
            src={`/svg/close.svg`}
            alt={'Close icon'}
            className={styles}
            width={50} height={50}
            onClick={handleClick}
        />
    );
};

export default CloseBlog;
