'use client' 
import AnimatedAction from '@ELEMENT/Action';
import styles from './error.module.scss';
 
export default function Error({ error, reset ,...rest}) {
 console.log(rest)
  
  return (
    <div  className={styles.Wrap}>
      <h2>Section Error!</h2>
      <p >{error.message}</p>
      <AnimatedAction
        onClick={() => reset()}
        type={'button'}
        label={'Try again'}
        icon="arrow-white"
        hoverIcon="arrow-blue"
        iconAlt="arrow right"
        iconSize="17"
        btnclass={["darkGreen"]}
      />
    </div>
  )
}