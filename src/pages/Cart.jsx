import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { shopApi, tavernApi } from '../services/api'
import { playGoldSound } from '../utils/gold'
import GoldCounter from '../components/GoldCounter'
import MusicControl from '../components/MusicControl'
import styles from './Cart.module.css'

export default function Cart() {
  const [cart, setCart] = useState(null)
  const [gold, setGold] = useState(() => Number(localStorage.getItem('userGold') || 0))
  const [loading, setLoading] = useState(true)
  const [sealing, setSealing] = useState(false)
  const [sealed, setSealed] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    shopApi.get('/api/cart').then(({ data }) => setCart(data)).catch(() => {}).finally(() => setLoading(false))
    tavernApi.get('/api/auth/gold').then(({ data }) => {
      setGold(data.gold)
      localStorage.setItem('userGold', String(data.gold))
    }).catch(() => {})
  }, [])

  const handleRemove = async (productId) => {
    await shopApi.delete(`/api/cart/items/${productId}`).catch(() => {})
    const { data } = await shopApi.get('/api/cart')
    setCart(data)
  }

  const handleSeal = async () => {
    setError('')
    setSealing(true)
    try {
      const total = cart?.total ?? 0
      if (gold < total) {
        setError('Gold insuficiente para selar este acordo.')
        setSealing(false)
        return
      }

      // Deduz o gold antes de criar o pedido
      const { data: goldData } = await tavernApi.post('/api/auth/gold/deduct', { amount: total })
      setGold(goldData.gold)
      localStorage.setItem('userGold', String(goldData.gold))

      // Cria o pedido
      await shopApi.post('/api/orders')

      playGoldSound()
      setSealed(true)
    } catch (err) {
      const msg = err.response?.data?.message
      setError(msg || 'Algo perturbou o ritual. Tente novamente.')

      // Se o pedido falhou após deduzir gold, reembolsa
      if (cart?.total) {
        tavernApi.post('/api/auth/gold/add', { amount: cart.total }).then(({ data }) => {
          setGold(data.gold)
          localStorage.setItem('userGold', String(data.gold))
        }).catch(() => {})
      }
    } finally {
      setSealing(false)
    }
  }

  const total = cart?.total ?? 0
  const hasGold = gold >= total

  if (sealed) {
    return (
      <div className={styles.layout}>
        <header className={styles.header}>
          <div className={styles.logo}>⚗️ Empório do Rudolf</div>
        </header>
        <div className={styles.content}>
          <div className={styles.success}>
            <div className={styles.successIcon}>📜</div>
            <h2 className={styles.successTitle}>O acordo está selado!</h2>
            <p className={styles.successMsg}>
              "Satisfatório. Seus itens serão separados com o devido cuidado. Volte sempre... se tiver Gold suficiente."
            </p>
            <br />
            <button className={styles.sealBtn} style={{ marginTop: '1.5rem' }} onClick={() => navigate('/')}>
              Continuar comprando
            </button>
          </div>
        </div>
        <GoldCounter gold={gold} />
      </div>
    )
  }

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.logo}>⚗️ Empório do Rudolf</div>
        <div className={styles.headerRight}>
          <MusicControl />
          <button className={styles.backBtn} onClick={() => navigate('/')}>← Voltar à loja</button>
        </div>
      </header>

      <div className={styles.content}>
        <h2 className={styles.title}>🎒 Sua Bolsa de Couro</h2>

        {loading ? (
          <p className={styles.empty}>Abrindo a bolsa...</p>
        ) : !cart?.items?.length ? (
          <p className={styles.empty}>Sua bolsa está vazia, viajante.</p>
        ) : (
          <>
            {cart.items.map(item => (
              <div key={item.productId} className={styles.item}>
                <span className={styles.itemName}>{item.productName}</span>
                <span className={styles.itemQty}>x{item.quantity}</span>
                <span className={styles.itemPrice}>🪙 {item.subtotal.toLocaleString('pt-BR')}</span>
                <button className={styles.removeBtn} onClick={() => handleRemove(item.productId)} title="Remover">✕</button>
              </div>
            ))}

            <div className={styles.summary}>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Total do acordo:</span>
                <span className={styles.totalAmount}>🪙 {total.toLocaleString('pt-BR')} Gold</span>
              </div>
              <div className={styles.goldRow}>
                <span>Seu saldo:</span>
                <span className={!hasGold ? styles.insufficient : ''}>
                  🪙 {gold.toLocaleString('pt-BR')} Gold {!hasGold && '— insuficiente'}
                </span>
              </div>
              {error && <p className={styles.insufficient} style={{ marginBottom: '0.8rem', textAlign: 'center' }}>{error}</p>}
              <button
                className={styles.sealBtn}
                onClick={handleSeal}
                disabled={sealing || !hasGold}
              >
                {sealing ? 'Selando o acordo...' : '⚗️ Selar o Acordo com Rudolf'}
              </button>
            </div>
          </>
        )}
      </div>

      <GoldCounter gold={gold} />
    </div>
  )
}
