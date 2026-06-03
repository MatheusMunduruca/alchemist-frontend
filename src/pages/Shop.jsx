import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { shopApi, tavernApi } from '../services/api'
import Rudolf from '../components/Rudolf'
import DialogBox from '../components/DialogBox'
import PotionCard from '../components/PotionCard'
import GoldCounter from '../components/GoldCounter'
import MusicControl from '../components/MusicControl'
import { music } from '../utils/music'
import styles from './Shop.module.css'

const GREETINGS = [
  'O que você procura hoje, viajante? Tenho poções para qualquer necessidade...',
  'Ah, outro cliente... Escolha com sabedoria. Meus itens não são para amadores.',
  'Bem-vindo ao meu laboratório. Toque em nada sem permissão.',
  'Cada poção foi preparada com décadas de conhecimento. Respeite-as.',
]

export default function Shop() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCat, setSelectedCat] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cartCount, setCartCount] = useState(0)
  const [gold, setGold] = useState(() => Number(localStorage.getItem('userGold') || 0))
  const [dialog, setDialog] = useState(GREETINGS[Math.floor(Math.random() * GREETINGS.length)])
  const [tempDialog, setTempDialog] = useState(false)
  const dialogTimer = useRef(null)
  const userName = localStorage.getItem('userName') || 'Viajante'
  const navigate = useNavigate()

  // Busca gold real do backend
  useEffect(() => {
    tavernApi.get('/api/auth/gold').then(({ data }) => {
      setGold(data.gold)
      localStorage.setItem('userGold', String(data.gold))
    }).catch(() => {})
  }, [])

  // Exibe diálogo de boas-vindas (vindo do registro)
  useEffect(() => {
    const welcome = sessionStorage.getItem('welcomeDialogue')
    if (welcome) {
      sessionStorage.removeItem('welcomeDialogue')
      setTimeout(() => showDialog(welcome, 18000), 600)
    }
  }, [])

  // Carrega produtos e categorias
  useEffect(() => {
    shopApi.get('/api/categories').then(({ data }) => setCategories(data)).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = selectedCat ? { category: selectedCat } : {}
    shopApi.get('/api/products', { params })
      .then(({ data }) => setProducts(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [selectedCat])

  // Carrega contagem do carrinho
  useEffect(() => {
    shopApi.get('/api/cart').then(({ data }) => {
      setCartCount(data.items?.length ?? 0)
    }).catch(() => {})
  }, [])

  const showDialog = (msg, duration = 12000) => {
    clearTimeout(dialogTimer.current)
    setDialog(msg)
    setTempDialog(true)
    dialogTimer.current = setTimeout(() => {
      setDialog(GREETINGS[Math.floor(Math.random() * GREETINGS.length)])
      setTempDialog(false)
    }, duration)
  }

  const handleAddToCart = async (product) => {
    try {
      await shopApi.post('/api/cart/items', { productId: product.id, quantity: 1 })
      setCartCount(c => c + 1)
      showDialog(`Excelente escolha. "${product.name}" adicionado à sua bolsa.`)
    } catch (err) {
      const msg = err.response?.data?.message
      if (msg?.includes('toque') || err.response?.status === 400) {
        showDialog('Estoque insuficiente para essa quantidade, viajante.')
      } else {
        showDialog('Hmm... algo interferiu no processo. Tente novamente.')
      }
    }
  }

  const logout = () => {
    music.stop()   // só para a música ao trocar de conta
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    localStorage.removeItem('userGold')
    navigate('/login')
  }

  return (
    <div className={styles.layout}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>⚗️ Empório do Rudolf</div>
        <nav className={styles.nav}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Olá, {userName}</span>
          <Link to="/cart">
            <button className={styles.cartBtn}>
              🎒 Bolsa {cartCount > 0 && `(${cartCount})`}
            </button>
          </Link>
          <MusicControl />
          <button className={styles.logoutBtn} onClick={logout}>Sair</button>
        </nav>
      </header>

      {/* Rudolf + Dialog */}
      <div className={styles.scene}>
        <Rudolf />
        <div className={styles.dialogArea}>
          <DialogBox
            message={dialog}
            onDismiss={tempDialog ? () => {
              clearTimeout(dialogTimer.current)
              setDialog(GREETINGS[Math.floor(Math.random() * GREETINGS.length)])
              setTempDialog(false)
            } : undefined}
          />
        </div>
      </div>

      {/* Category filters */}
      <div className={styles.categories}>
        <button
          className={`${styles.catBtn} ${!selectedCat ? styles.active : ''}`}
          onClick={() => setSelectedCat(null)}
        >
          Tudo
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`${styles.catBtn} ${selectedCat === cat.id ? styles.active : ''}`}
            onClick={() => setSelectedCat(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Products */}
      {loading ? (
        <p className={styles.loading}>Consultando os grimórios de estoque...</p>
      ) : (
        <div className={styles.grid}>
          {products.length === 0
            ? <p className={styles.empty}>Nenhum item encontrado nessa prateleira.</p>
            : products.map(p => (
                <PotionCard key={p.id} product={p} onAddToCart={handleAddToCart} />
              ))
          }
        </div>
      )}

      <GoldCounter gold={gold} />
    </div>
  )
}
