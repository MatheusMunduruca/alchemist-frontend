import { useEffect, useState } from 'react'
import styles from './GoldCounter.module.css'
import { formatGold } from '../utils/gold'

export default function GoldCounter({ gold }) {
  const [pop, setPop] = useState(false)

  useEffect(() => {
    setPop(true)
    const t = setTimeout(() => setPop(false), 400)
    return () => clearTimeout(t)
  }, [gold])

  return (
    <div className={styles.counter}>
      <svg viewBox="0 0 64 64" className={styles.bag} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bagG" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6b3fa0" />
            <stop offset="100%" stopColor="#2d1654" />
          </linearGradient>
          <linearGradient id="coinG" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffe066" />
            <stop offset="100%" stopColor="#c9a227" />
          </linearGradient>
        </defs>
        <path d="M 14 22 Q 12 28 14 38 Q 16 54 32 56 Q 48 54 50 38 Q 52 28 50 22 L 42 18 L 22 18 Z"
              fill="url(#bagG)" stroke="#4a2080" strokeWidth="1.5" />
        <path d="M 20 18 Q 32 12 44 18" fill="none" stroke="#4a2080" strokeWidth="2.5" />
        <text x="32" y="44" textAnchor="middle" fontFamily="serif" fontSize="20" fontWeight="bold"
              fill="url(#coinG)" stroke="#7a5a10" strokeWidth="0.5">G</text>
        <circle cx="22" cy="20" r="3" fill="url(#coinG)" stroke="#7a5a10" strokeWidth="0.8" />
        <circle cx="32" cy="16" r="3" fill="url(#coinG)" stroke="#7a5a10" strokeWidth="0.8" />
        <circle cx="42" cy="20" r="3" fill="url(#coinG)" stroke="#7a5a10" strokeWidth="0.8" />
      </svg>
      <span className={`${styles.amount} ${pop ? styles.pop : ''}`}>
        {formatGold(gold)}
      </span>
    </div>
  )
}
