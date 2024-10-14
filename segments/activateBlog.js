'use client';

import { useCallback } from 'react';
import AnimatedAction from '@ELEMENT/Action';
const OpenBlog = ({ id, btn, classN }) => {
    const handleClick = useCallback(() => {
        const blogSection = document.getElementById('blogSection');
        if (blogSection) blogSection.classList.add(classN);
        
        const element = document.getElementById(id);
        if (element) element.classList.add('active');
    }, [id]);

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
