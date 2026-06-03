import { useEffect, useRef, useState } from 'react'
import styles from './MusicPlayer.module.css'

export default function MusicPlayer() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(() => Number(localStorage.getItem('alc-volume') ?? 0.3))

  useEffect(() => {
    const audio = new Audio('/sounds/alchemy-lab.mp3')
    audio.loop = true
    audio.volume = volume
    audioRef.current = audio
    return () => { audio.pause(); audio.src = '' }
  }, [])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
    localStorage.setItem('alc-volume', String(volume))
  }, [volume])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) { audio.pause(); setPlaying(false) }
    else { audio.play().catch(() => {}); setPlaying(true) }
  }

  return (
    <div className={styles.player}>
      <span className={styles.candle}>🕯️</span>
      <button className={styles.btn} onClick={toggle} title={playing ? 'Pausar música' : 'Tocar música'}>
        {playing ? '⏸' : '▶'}
      </button>
      <span className={styles.label}>Alchemy Lab</span>
      <input
        type="range" min="0" max="1" step="0.05"
        value={volume}
        onChange={e => setVolume(Number(e.target.value))}
        className={styles.volume}
        title="Volume"
      />
    </div>
  )
}
