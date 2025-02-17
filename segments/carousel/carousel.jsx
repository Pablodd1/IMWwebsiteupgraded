'use client'
import React, { useState, useEffect, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { Thumb } from './thumbnails'
import './styles.scss';
import styles from './card.module.scss'
import Link from 'next/link';
import Image from 'next/image';
const truncateText = (text, limit) => (text.length > limit ? text.substring(0, limit) + "..." : text);

const EmblaCarousel = (props) => {
    const { slides, options } = props
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options)
    const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
        containScroll: 'keepSnaps',
        dragFree: true
    })

    // Handles thumbnail clicks
    const onThumbClick = useCallback(
        (index) => {
            if (!emblaMainApi || !emblaThumbsApi) return
            emblaMainApi.scrollTo(index)
        },
        [emblaMainApi, emblaThumbsApi]
    )

    // Handles selecting a new slide
    const onSelect = useCallback(() => {
        if (!emblaMainApi || !emblaThumbsApi) return
        const selectedIndex = emblaMainApi.selectedScrollSnap()
        setSelectedIndex(selectedIndex)
        emblaThumbsApi.scrollTo(selectedIndex)
    }, [emblaMainApi, emblaThumbsApi, setSelectedIndex])

    // Auto-slide functionality
    useEffect(() => {
        if (!emblaMainApi) return

        const autoSlide = setInterval(() => {
            emblaMainApi.scrollNext();
        }, 3000); // Adjust the delay as needed (3000ms = 3s)

        // Clear interval on component unmount
        return () => {
            clearInterval(autoSlide);
        }
    }, [emblaMainApi])

    // Initialize embla on select/reinit
    useEffect(() => {
        if (!emblaMainApi) return
        onSelect()

        emblaMainApi.on('select', onSelect)
        emblaMainApi.on('reInit', onSelect)
    }, [emblaMainApi, onSelect])

    return (
        <div className="embla">
            {/* Main Carousel */}
            <div className="embla__viewport" ref={emblaMainRef}>
                <div className="embla__container">
                    {slides.map((slide, index) => (
                        <div className="embla__slide" key={index}>
                            <Link href={slide?.href || ''} target='_blank' className={styles.testimonial}>
                                <div className={styles.shadow}></div>
                                <span className={`${styles.top} ${styles.border}`}></span>
                                <h1>{slide?.title}</h1>
                                <p>{truncateText(slide?.commit || "", 325)}</p>
                                <div className={styles.source}>
                                    {
                                        (new Array(slide?.star).fill('')).map((_,x)=>(
                                            <Image key={x} className={styles.im} src={'/svg/star.svg'} height={27} width={27} alt={`Rating: ${slide?.title} gives ${slide.star}`} />
                                        ))
                                    }
                                </div>
                                <span className={`${styles.bottom} ${styles.border}`}></span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Thumbnail Navigation */}
            <div className="embla-thumbs">
                <div className="embla-thumbs__viewport" ref={emblaThumbsRef}>
                    <div className="embla-thumbs__container">
                        {slides.map((slide, index) => (
                            <Thumb
                                key={index}
                                onClick={() => onThumbClick(index)} // Use the correct index
                                selected={index === selectedIndex}
                                index={slide?.title} // Pass the actual index
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmblaCarousel
