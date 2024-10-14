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
        {"Deprtments"}
      </h2>
      <p className={styles.desc}  >
        {"It does not matter if one of the property values is missing, as long as the other ones are in this order. Note that we do not use the background-attachment property in the examples above, as it does not have a value.It does not matter if one of the property values is missing, as long as the other ones are in this order. Note that we do not use the background-attachment property in the examples above, as it does not have a value.It does not matter if one of the property values is missing, as long as the other ones are in this order. Note that we do not use the background-attachment property in the examples above, as it does not have a value."}
      </p>
      <ul className={styles.list}  >
        {
          departs.map((x, i) => {
            return (
              <li key={i} className="card  ">
                <Image
                  className="card__background"
                  src={`/raster/departs/${x.image.src}`}
                  alt={x.image.alt}
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
                  <button className="card__button">Read more</button>
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