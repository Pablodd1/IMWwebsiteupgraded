import Image from "next/image";
import Link from "next/link";
import styles from './departs.module.scss'
import './fancyCard.scss';

const expertise = [
  {
    "label": "REGENERATIVE MEDICINE",
    "image": {
      "src": "prostate-cancer-sexual-dysfunction-in-a-clinic-room-female-doctor-appointment-at-the-desk-1024x577.jpg",
      "alt": ""
    },
    "description": "Unlock your body’s potential for healing with our advanced regenerative medicine treatments. Tailored to promote natural recovery and long-term wellness, our approach targets the root causes of your health issues for optimal results."
  },
  {
    "label": "Executive Performance (CEO)",
    "image": {
      "src": "african-american-ceo-analyzing-business-reports-with-his-team-during-a-briefing-in-the-office--1024x682.jpg",
      "alt": ""
    },
    "description": "Elevate CEO Performance with Our Tailored IV Therapy and Lifestyle Modification Program. At our clinic, we specialize in optimizing the health and performance of top executives through personalized IV treatments and comprehensive lifestyle strategies. Experience enhanced cognitive function, increased energy, and improved stress resilience, all designed to help you perform at your peak in the boardroom and beyond."
  },
  {
    "label": "SEXUAL WELLNESS",
    "image": {
      "src": "pablo-heimplatz-EAvS-4KnGrk-unsplash-1024x683-1.webp",
      "alt": ""
    },
    "description": "Revitalize your intimate health with our comprehensive sexual wellness services. Our personalized treatments and expert guidance aim to improve your sexual vitality, confidence, and overall well-being."
  }
]
const truncateDescription = (description, maxLength) => {
  if (description.length > maxLength) {
    return description.slice(0, maxLength) + '...';
  }
  return description;
};
const spans = Array.from({ length: 4 }, (_, index) => <span key={index} />);

const Departs = () => {

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
            expertise.map((x, i) => {
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