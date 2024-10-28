import styles from './page.module.scss';
import GetSVG from '@SEGMENT/getSVG';
import dynamic from 'next/dynamic';
const Card = dynamic(() => import('@SEGMENT/Card'));
const EmblaCarousel = dynamic(() => import('@SEGMENT/carousel/carousel'));
const Specialist = dynamic(() => import('@SEGMENT/Specialist'));
const AnimatedAction = dynamic(() => import('@ELEMENT/Action'));
const CostQueryCTA = dynamic(() => import('@SEGMENT/costCTA'));
import NotFound from '../not-found';
import { getDictionary } from '@JSON/index'
export async function generateMetadata({ params, searchParams }, parent) {
    const par = await params
    const LANG = par.lang
    const PAGE = par.Service;
    let data;
    data = PAGE && await getDictionary(LANG || 'en', `subtypes.${PAGE}`);

    return {
        title: data?.meta?.title,
        description: data?.meta?.desc,
    }
}
const Page = async ({ params }) => {
    const par = await params
    const LANG = par.lang
    let PAGE = par.Service;
    let data;
    if (!PAGE)
        <NotFound />;
    data = PAGE && await getDictionary(LANG || 'en', `subtypes.${PAGE}`);
    const cost_data = await getDictionary(LANG || 'en', `general.costCTA`);
    return (
        <main className={styles.Page} >
            <section className={styles.hero} style={{ backgroundImage: `url('/raster/departs/${PAGE}/Innovative Medical Wellness - ${PAGE}.webp')` }} >
                <GetSVG num={5} />
                <div className={styles.heroContent}>
                    <h1>{data.heroSection.h1}</h1>
                    <p>{data.heroSection.p}</p>
                </div>
                <GetSVG num={2} />
            </section>
            <Card PAGE={PAGE} data={data.services} LANG={LANG} />
            <CostQueryCTA services={data.services.map(x => x.heading)} data={cost_data} />
            <Specialist LANG={LANG} />
            <section className={styles.testimonials}>
                <h2>{data.story.h2}</h2>
                <EmblaCarousel slides={data.story?.ul} />
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
