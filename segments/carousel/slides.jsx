
import './styles.scss';
import styles from './card.module.scss'
const names = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']
export default function Testimonials({ slides }) {

    return (
        <>
            <div className="container">
                {
                    names.map(x => <input type="radio" name="nav" id={x} checked={x === "one"} />)
                }
                {/* <input type="radio" name="nav" id="first" checked />
                <input type="radio" name="nav" id="second" />
                <input type="radio" name="nav" id="third" /> */}
                {
                    names.map(x => <label for={x} className={x}></label>)
                }
                {/* <label for="first" className="first"></label>
                <label for="second" className="second"></label>
                <label for="third" className="third"></label> */}
                {
                    slides.map((x, i) => (
                        <article className={`${names[i]} slide`} >
                            <div className={styles.testimonial}>
                                <div className={styles.shadow}></div>
                                <span className={`${styles.top} ${styles.border}`}></span>
                                <h1>{x.split('-')[1]}</h1>
                                <p>{x.split('-')[0]}</p>
                                <p className={styles.source}>&mdash; Medical Innovative Wellness</p>
                                <span className={`${styles.bottom} ${styles.border}`}></span>
                            </div>
                        </article>
                    ))
                }
            </div>
        </>
    )
}