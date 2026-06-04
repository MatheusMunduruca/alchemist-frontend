import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { tavernApi } from '../services/api'
import { music } from '../utils/music'
import styles from './Auth.module.css'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fadingOut, setFadingOut] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await tavernApi.post('/api/auth/login', form)
      localStorage.setItem('token', data.token)
      localStorage.setItem('userName', data.name)
      localStorage.setItem('userEmail', data.email)
      localStorage.setItem('userGold', String(data.goldBalance ?? 0))
      music.play()   // inicia a música do Empório (clique do login = gesto permitido)
      setFadingOut(true)
      setTimeout(() => navigate('/'), 1200)
    } catch {
      setError('Pergaminho ou senha inválidos.')
      setLoading(false)
    }
  }

  return (
    <div className={`${styles.container} ${fadingOut ? styles.fadeOut : ''}`}>
      <div className={`${styles.orb} ${styles.orb1}`} />
      <div className={`${styles.orb} ${styles.orb2}`} />
      <div className={`${styles.orb} ${styles.orb3}`} />

      <div className={styles.card}>
        <div className={styles.emblem}>⚗️</div>
        <h1 className={styles.title}>Empório do Rudolf</h1>
        <p className={styles.subtitle}>Apresente suas credenciais, visitante</p>
        <div className={styles.divider}>✦ ✦ ✦</div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email" name="email" placeholder="Pergaminho (e-mail)"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
            className={styles.input} required
          />
          <input
            type="password" name="password" placeholder="Senha secreta"
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
            className={styles.input} required
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Abrindo portões...' : 'Adentrar'}
          </button>
        </form>

        <p className={styles.link}>
          Sem conta? <Link to="/register">Registrar-se</Link>
        </p>

        <div className={styles.gregor}>
          <p className={styles.gregorLink}>
            🍺 Prefere uma cerveja? <a href="http://localhost:5173" target="_blank" rel="noreferrer">Visitar a Taverna do Gregor</a>
          </p>
        </div>
      </div>
    </div>
  )
}
