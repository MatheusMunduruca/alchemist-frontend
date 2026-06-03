import styles from './Rudolf.module.css'
import rudolfImg from '../assets/rudolf.jpg'

export default function Rudolf() {
  return (
    <div className={styles.scene}>
      <div className={styles.smoke}>
        <div className={styles.wisp} />
        <div className={styles.wisp} />
        <div className={styles.wisp} />
      </div>
      <div className={styles.candles}>
        <span className={styles.candle}>🕯️</span>
        <span className={styles.candle}>🕯️</span>
      </div>
      <img src={rudolfImg} alt="Rudolf, o Alquimista" className={styles.rudolfImg} />
      <span className={styles.name}>Rudolf</span>
    </div>
  )
}
