import { music, useMusic } from '../utils/music'
import styles from './MusicControl.module.css'

export default function MusicControl() {
  const { playing, volume } = useMusic()

  return (
    <div className={styles.control} title="Alchemy Lab">
      <button
        className={styles.btn}
        onClick={() => music.toggle()}
        title={playing ? 'Pausar música' : 'Tocar música'}
      >
        {playing ? '🔊' : '🔈'}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={volume}
        onChange={(e) => music.setVolume(Number(e.target.value))}
        className={styles.volume}
        title="Volume"
      />
    </div>
  )
}
