import sizes from './sizes';
import Image from 'next/image';
import styles from './gallery.module.scss';

export default function Gallery() {

    const images = new Array(8).fill(null).map((_, x) => ({
        title: 'Innovative Medical Wellness - ' + (x + 1),
        src: `/gallery/Innovative Medical Wellness - ${x + 1}.webp`,
        height: sizes[x].height,
        width: sizes[x].width,
        col: sizes[x].col,
        row: sizes[x].row,
    }));


    return (
        <section id="gallery" className={styles.gallery} >
            {
                images.map(x => (
                    <figure key={x.title} style={{ gridRow: `span ${x.row}`, gridColumn: `span ${x.col}` }} >
                        <Image
                            src={x.src}                            
                            title={x.title}
                            alt={x.title}
                            width={x.height}
                            height={x.height}
                            loading='lazy'
                        />
                    </figure>
                ))
            }
        </section>
    );
}
