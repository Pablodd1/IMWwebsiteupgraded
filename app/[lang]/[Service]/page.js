import styles from './page.module.scss';
import GetSVG from '@SEGMENT/getSVG';
import Card from '@SEGMENT/Card';
import Specialist from '@SEGMENT/Specialist';
import AnimatedAction from '@ELEMENT/Action';
import NotFound from '../not-found';
import { getDictionary } from '@JSON/index'
export async function generateMetadata({ params, searchParams }, parent) {
    const PAGE = params.Service;
    const LANG = params.lang;
    // const t = await getDictionary(LANG)
    let data;
    data = PAGE && await getDictionary(LANG || 'en', `subtypes.${PAGE}`);

    return {
        title: data?.meta?.title,
        description: data?.meta?.desc,
    }
}
const Page = async ({ params }) => {
    let PAGE = params.Service;
    const LANG = params.lang;
    let data; 
    if (!PAGE)
        <NotFound />;
    data = PAGE && await getDictionary(LANG || 'en', `subtypes.${PAGE}`); 
    return (
        <main
            className={styles.Page}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <section className={styles.hero} style={{ backgroundImage: `url('/raster/Innovative Medical Wellness - ${PAGE}.jpg')` }} >
                <GetSVG num={5} />
                <div className={styles.heroContent}>
                    <h1>{data.heroSection.h1}</h1>
                    <p>{data.heroSection.p}</p>
                </div>
                <GetSVG num={2} />
            </section>
            <Card />
            <Specialist LANG={LANG} />
            <section className={styles.testimonials}>
                <h2>{data.story.h2}</h2>
                <p>{data.story.ul[0]}</p>
                <p>{data.story.ul[1]}</p>
            </section>

            <section className={styles.cta}>
                <h2>{data.cta.h2}</h2>
                <AnimatedAction
                    href={data.cta.link}
                    label={data.cta.btn}
                    icon="arrow-white"
                    hoverIcon="arrow-blue"
                    iconAlt="arrow right"
                    iconSize="17"
                    btnclass={["darkBlue"]}
                />
            </section>
        </main>
    );
};

export default Page;
