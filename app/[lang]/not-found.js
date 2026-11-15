import AnimatedAction from '@ELEMENT/Action';
import styles from './not-found.module.scss';

export default function NotFound() {
  return (
    <section className={styles.Wrap}>
      <h1>Not Found</h1>
      <p>Could not find requested resource</p>
      <AnimatedAction
        link={`/`}
        label={'Return Home'}
        icon="arrow-white"
        hoverIcon="arrow-blue"
        iconAlt="arrow right"
        iconSize="17"
        btnclass={["darkBlue"]}
      />
    </section>
  )
}