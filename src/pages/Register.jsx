import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { tavernApi } from '../services/api'
import { playGoldSound } from '../utils/gold'
import { music } from '../utils/music'
import styles from './Auth.module.css'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fadingOut, setFadingOut] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await tavernApi.post('/api/auth/register', form)
      localStorage.setItem('token', data.token)
      localStorage.setItem('userName', data.name)
      localStorage.setItem('userEmail', data.email)
      localStorage.setItem('userGold', String(data.goldBalance ?? 0))

      // Toca o som de gold ao receber as 1000 moedas de boas-vindas
      if (data.goldBalance > 0) playGoldSound()

      // Inicia a música do Empório (clique do registro = gesto permitido)
      music.play()

      // Salva o diálogo do Rudolf para exibir na loja
      if (data.welcomeDialogue) {
        sessionStorage.setItem('welcomeDialogue', data.welcomeDialogue)
      }

      setFadingOut(true)
      setTimeout(() => navigate('/'), 1400)
    } catch (err) {
      const msg = err.response?.data?.message
      const isDuplicate =
        msg === 'Email already in use.' ||
        msg === 'E-mail já cadastrado.'

      if (isDuplicate) {
        setError('Este pergaminho já existe. Use suas credenciais para adentrar.')
      } else if (!err.response) {
        setError('Não foi possível contactar o servidor. Verifique se as APIs estão ativas.')
      } else {
        setError(msg || 'Erro ao criar conta. Tente novamente.')
      }
      setLoading(false)
    }
  }

  return (
    <div className={`${styles.container} ${fadingOut ? styles.fadeOut : ''}`}>
      <div className={`${styles.orb} ${styles.orb1}`} />
      <div className={`${styles.orb} ${styles.orb2}`} />
      <div className={`${styles.orb} ${styles.orb3}`} />

      <div className={styles.card}>
        <div className={styles.emblem}>🧪</div>
        <h1 className={styles.title}>Forjar Identidade</h1>
        <p className={styles.subtitle}>Registre-se e receba 1.000 Gold Coins</p>
        <div className={styles.divider}>✦ ✦ ✦</div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text" name="name" placeholder="Seu nome"
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
            className={styles.input} required
          />
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
            {loading ? 'Selando o pacto...' : 'Selar o Pacto'}
          </button>
        </form>

        <p className={styles.link}>
          Já registrado? <Link to="/login">Adentrar</Link>
        </p>

        <div className={styles.gregor}>
          <p className={styles.gregorLink}>
            🍺 Conta compartilhada com <a href="http://localhost:5173" target="_blank" rel="noreferrer">a Taverna do Gregor</a>
          </p>
          <p className={styles.gregorLink} style={{ marginTop: '0.4rem', fontSize: '0.8rem', opacity: 0.8 }}>
            Conta do Gregor? <Link to="/login" style={{ color: 'var(--amber)', textDecoration: 'none' }}>Entre diretamente aqui →</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
