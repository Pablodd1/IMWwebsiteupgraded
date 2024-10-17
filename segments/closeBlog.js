'use client';
import Image from 'next/image';
import { useCallback } from 'react';

const CloseBlog = ({idx, styles,classN,active }) => {
    const handleClick = useCallback(() => {
        const blogSection = document.getElementById('blogSection');
        if (blogSection) blogSection.classList.remove(classN);

        const element = document.getElementById(idx);
        if (element) element.classList.remove(active);
    }, [idx]);

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
