'use client'
import React, { useState, useEffect, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { Thumb } from './thumbnails'
import './styles.scss';
import styles from './card.module.scss'

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
                            <div className={styles.testimonial}>
                                <div className={styles.shadow}></div>
                                <span className={`${styles.top} ${styles.border}`}></span>
                                <h1>{slide.split('-')[1]}</h1>
                                <p>{slide.split('-')[0]}</p>
                                <p className={styles.source}>&mdash; Medical Innovative Wellness</p>
                                <span className={`${styles.bottom} ${styles.border}`}></span>
                            </div>
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
                                index={slide.split('-')[1]} // Pass the actual index
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmblaCarousel
