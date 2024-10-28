'use client';

import { useCallback, useEffect, useState } from 'react';
import AnimatedAction from '@ELEMENT/Action';
import Image from 'next/image';

const OpenBlog = ({ idx, blogC, btn, styles, classN, active }) => {
    const [open, setOpen] = useState(false);
    const handleClick = useCallback(() => {
        setOpen(true)
        const blogSection = document.getElementById('blogSection');
        if (blogSection) blogSection.classList.add(classN);
        const blogRenderer = document.getElementById('blog_space');
        if (blogRenderer) blogRenderer.classList.add(blogC);
        
        const element = document.getElementById(idx);
        if (element) element.classList.add(active);
    }, [idx]);
    const handleClose = useCallback(() => {
        setOpen(false)
        const blogSection = document.getElementById('blogSection');
        if (blogSection) blogSection.classList.remove(classN);
        const blogRenderer = document.getElementById('blog_space');
        if (blogRenderer) blogRenderer.classList.remove(blogC);

        const element = document.getElementById(idx);
        if (element) element.classList.remove(active);
    }, [idx]);

   

    return (
        <>
            {
                open ?
                    <AnimatedAction
                        label={btn.back}
                        icon="emailSend-white"
                        hoverIcon="emailSend-black"
                        iconAlt="arrow right"
                        iconSize="17"
                        iconClass=""
                        btnclass={["btnSm", "darkBlue"]}
                        wrapperClass=""
                        onClick={handleClose}
                        type="button"
                    /> :
                    <AnimatedAction
                        label={btn.readMore}
                        icon="emailSend-white"
                        hoverIcon="emailSend-black"
                        iconAlt="arrow right"
                        iconSize="17"
                        iconClass=""
                        btnclass={["btnSm", "darkBlue"]}
                        wrapperClass=""
                        onClick={handleClick}
                        type="button"
                    />
            }
            <Image
                src={`/svg/close.svg`}
                alt={'Close icon' + 'Innovative Medical Wellness'}
                className={styles}
                width={50} height={50}
                onClick={handleClose}
            />
        </>
    );
};

export default OpenBlog;
