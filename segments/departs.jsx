import Image from "next/image";
import Link from "next/link";
import styles from './departs.module.scss'
import './fancyCard.scss';
import { getDictionary } from '@JSON/index'

const truncateDescription = (description, maxLength) => {
  if (description.length > maxLength) {
    return description.slice(0, maxLength) + '...';
  }
  return description;
};
const spans = Array.from({ length: 4 }, (_, index) => <span key={index} />);

const Departs = async ({ LANG }) => {
  const departs = await getDictionary(LANG || 'en', `homepage.departs`);

  return (
    <section className={styles.section1} >
      <h2 className={styles.h2}  >
        {departs.h2}
      </h2>
      <p className={styles.desc}  >
        {departs.p}
      </p>
      <ul className={styles.list}  >
        {
          departs.ul.map((x, i) => {
            return (
              <li key={i} className="card  ">
                <Image
                  className="card__background"
                  src={`/raster/departs/${x.image.src}`}
                  alt={x.image.alt + 'Innovative Medical Wellness'}
                  width={1024}
                  height={512}
                />
                <div className="card__content | flow">
                  <div className="card__content--container | flow">
                    <h3 className="card__title expert-h2 text-2xl md:text-4xl ">{x.label}</h3>
                    <p className="card__description expert-p">
                      {truncateDescription(x.description, 105)}
                    </p>
                  </div>
                  {/* <button className="card__button">Read more</button> */}
                </div>
              </li>
            )
          })
        }
      </ul>
    </section>
  )
}

export default Departs;