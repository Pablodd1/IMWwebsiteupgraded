'use client'
import { ProGallery } from 'pro-gallery';
import 'pro-gallery/dist/statics/main.css';
import sizes from './sizes';
const options = {
    layoutParams: {
        structure: {
            galleryLayout: 0,
            scrollDirection: "HORIZONTAL",
            itemSpacing: 0,
            scatter: {
                randomScatter: 1
            }
        },
        groups: {
            density: 0.9
        },
        navigationArrows: {
            position: "MOUSE_CURSOR",
            type: "ARROW_3"
        }
    },
    behaviorParams: { // Note the corrected spelling
        item: {
            overlay: {
                hoverAnimation: "EXPAND"
            },
            content: {
                hoverAnimation: "TILT",
                placementAnimation: "SLIDE"
            }
        },
        gallery: {
            layoutDirection: "RIGHT_TO_LEFT",
            scrollAnimation: "FADE_IN"
        }
    }
};



const container = {
    width: 2000,
    height: 500,
}
export default function Gallery() {
    const images = new Array(8).fill(null).map((_, x) => ({
        itemId: 'Innovative Medical Wellness - ' + (x + 1),
        mediaUrl: `/gallery/Innovative Medical Wellness - ${x + 1}.webp`,
        metaData: {
            type: 'image',
            height: sizes[x].height,
            width: sizes[x].height,
            title: 'Innovative Medical Wellness - ' + (x + 1),
            description: 'Innovative Medical Wellness - ' + (x + 1),
            focalPoint: [0, 0],
        }
    }));
    const options = {
        galleryLayout: 0,
    };
    return (
        <div id='gallery' >
            <ProGallery
                id={'service_gallery'}
                items={images}
                options={options}
                container={container}
                scrollingElement={document?.getElementById('gallery') || window}
            />
        </div>)
}