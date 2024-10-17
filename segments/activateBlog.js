'use client';

import { useCallback } from 'react';
import AnimatedAction from '@ELEMENT/Action';
const OpenBlog = ({ idx, btn, classN,active }) => {
    const handleClick = useCallback(() => {
        const blogSection = document.getElementById('blogSection');
        if (blogSection) blogSection.classList.add(classN);
        
        const element = document.getElementById(idx);
        if (element) element.classList.add(active);
    }, [idx]);

    return (
        <AnimatedAction
            label={btn}
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
    );
};

export default OpenBlog;
