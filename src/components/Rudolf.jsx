import styles from './Rudolf.module.css'
import rudolfImg from '../assets/rudolf.jpg'

// Prateleira de poções (CSS puro) — usada nos dois lados do laboratório
function Shelf({ side }) {
  const bottles = ['emerald', 'amber', 'purple', 'blue', 'crimson']
  return (
    <div className={`${styles.shelf} ${styles[side]}`}>
      <div className={styles.shelfRow}>
        {bottles.map((c, i) => (
          <div key={`a${i}`} className={`${styles.bottle} ${styles[c]}`}>
            <span className={styles.liquid} />
          </div>
        ))}
      </div>
      <div className={styles.plank} />
      <div className={styles.shelfRow}>
        {[...bottles].reverse().map((c, i) => (
          <div key={`b${i}`} className={`${styles.bottle} ${styles[c]}`}>
            <span className={styles.liquid} />
          </div>
        ))}
      </div>
      <div className={styles.plank} />
    </div>
  )
}

export default function Rudolf() {
  return (
    <div className={styles.lab}>
      {/* Brilho ambiente do laboratório */}
      <div className={styles.ambient} />

      {/* Prateleiras laterais */}
      <Shelf side="left" />
      <Shelf side="right" />

      {/* Rudolf ao centro */}
      <div className={styles.center}>
        <div className={styles.smoke}>
          <div className={styles.wisp} />
          <div className={styles.wisp} />
          <div className={styles.wisp} />
        </div>

        <div className={styles.portraitFrame}>
          <span className={`${styles.candle} ${styles.candleLeft}`}>🕯️</span>
          <span className={`${styles.candle} ${styles.candleRight}`}>🕯️</span>
          <img src={rudolfImg} alt="Rudolf, o Alquimista" className={styles.rudolfImg} />
        </div>

        <span className={styles.name}>Rudolf, o Alquimista</span>
      </div>

      {/* Linha do balcão */}
      <div className={styles.counter} />
    </div>
  )
}
