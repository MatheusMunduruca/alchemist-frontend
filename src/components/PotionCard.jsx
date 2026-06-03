import styles from './PotionCard.module.css'

// Mapa de cores por categoria
const PALETTE = {
  default:     { liquid: '#2ecc71', glow: '#2ecc71', bubble: '#7dffb3' },
  poções:      { liquid: '#2ecc71', glow: '#2ecc71', bubble: '#7dffb3' },
  ingredientes:{ liquid: '#c9a227', glow: '#ffd700', bubble: '#ffe599' },
  grimórios:   { liquid: '#7b4bbf', glow: '#a855f7', bubble: '#d8b4fe' },
  equipamentos:{ liquid: '#3b82f6', glow: '#60a5fa', bubble: '#bfdbfe' },
}

function getPalette(categoryName = '') {
  const key = Object.keys(PALETTE).find(k => categoryName.toLowerCase().includes(k)) || 'default'
  return PALETTE[key]
}

export default function PotionCard({ product, onAddToCart }) {
  const pal = getPalette(product.categoryName)
  const outOfStock = product.stockQuantity === 0

  return (
    <div className={styles.card}>
      {/* Potion bottle illustration */}
      <div className={styles.bottleWrap}>
        <svg viewBox="0 0 80 100" className={styles.bottle} xmlns="http://www.w3.org/2000/svg">
          {/* Cork */}
          <rect x="30" y="4" width="20" height="10" rx="3" fill="#8B6914" />
          <rect x="32" y="2" width="16" height="5" rx="2" fill="#a07820" />
          {/* Neck */}
          <rect x="28" y="13" width="24" height="16" rx="3" fill="#1a0a2e" stroke={pal.liquid} strokeWidth="1.5" />
          {/* Body */}
          <ellipse cx="40" cy="68" rx="28" ry="34" fill="#0d0520" stroke={pal.liquid} strokeWidth="1.5" />
          {/* Liquid fill */}
          <ellipse cx="40" cy="72" rx="24" ry="28" fill={pal.liquid} opacity="0.3" />
          {/* Liquid surface shimmer */}
          <ellipse cx="40" cy="48" rx="22" ry="4" fill={pal.liquid} opacity="0.5" />
          {/* Label */}
          <rect x="20" y="62" width="40" height="22" rx="3" fill="#f0e6d3" opacity="0.15" stroke={pal.liquid} strokeWidth="0.8" />
          {/* Shine */}
          <ellipse cx="28" cy="55" rx="4" ry="10" fill="white" opacity="0.1" transform="rotate(-20 28 55)" />
        </svg>

        {/* Animated bubbles */}
        {[
          { size: 5, left: 35, bottom: 18, dur: '2.1s', delay: '0s' },
          { size: 4, left: 50, bottom: 25, dur: '2.8s', delay: '0.7s' },
          { size: 6, left: 42, bottom: 30, dur: '1.9s', delay: '1.4s' },
        ].map((b, i) => (
          <div
            key={i}
            className={styles.bubble}
            style={{
              width: b.size, height: b.size,
              left: b.left, bottom: b.bottom,
              background: pal.bubble,
              '--dur': b.dur,
              '--delay': b.delay,
            }}
          />
        ))}

        {/* Glow */}
        <div className={styles.glow} style={{ background: pal.glow }} />
      </div>

      <h3 className={styles.name}>{product.name}</h3>
      <p className={styles.description}>{product.description || 'Uma concoção misteriosa...'}</p>

      <div className={styles.footer}>
        <span className={styles.price}>
          <span className={styles.coin}>🪙</span>
          {product.price.toLocaleString('pt-BR')} Gold
        </span>
        <span className={`${styles.stock} ${product.stockQuantity <= 3 ? styles.low : ''}`}>
          {outOfStock ? 'Esgotado' : `${product.stockQuantity} em estoque`}
        </span>
      </div>

      <button
        className={styles.addBtn}
        onClick={() => onAddToCart(product)}
        disabled={outOfStock}
      >
        {outOfStock ? 'Esgotado' : '+ Bolsa'}
      </button>
    </div>
  )
}
