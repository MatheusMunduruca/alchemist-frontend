import { useState, useEffect, useRef } from 'react'
import styles from './StockTimer.module.css'

// Janela de 6 horas — idêntica à lógica do backend (Unix epoch UTC / 21600s).
const WINDOW_MS = 6 * 60 * 60 * 1000

function nextResetMs() {
  const now = Date.now()
  return (Math.floor(now / WINDOW_MS) + 1) * WINDOW_MS
}

function format(ms) {
  if (ms < 0) ms = 0
  const total = Math.floor(ms / 1000)
  const h = String(Math.floor(total / 3600)).padStart(2, '0')
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0')
  const s = String(total % 60).padStart(2, '0')
  return `${h}:${m}:${s}`
}

export default function StockTimer({ onReset }) {
  const target = useRef(nextResetMs())
  const [remaining, setRemaining] = useState(target.current - Date.now())
  const onResetRef = useRef(onReset)

  useEffect(() => { onResetRef.current = onReset }, [onReset])

  useEffect(() => {
    const id = setInterval(() => {
      const rem = target.current - Date.now()
      if (rem <= 0) {
        // Virou a janela: recalcula o alvo e dispara o recarregamento do estoque
        target.current = nextResetMs()
        setRemaining(target.current - Date.now())
        onResetRef.current?.()
      } else {
        setRemaining(rem)
      }
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className={styles.timer} title="Tempo até o estoque de Rudolf renovar">
      <span className={styles.icon}>⏳</span>
      <span className={styles.label}>Estoque renova em</span>
      <span className={styles.clock}>{format(remaining)}</span>
    </div>
  )
}
