export function formatGold(amount) {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(1)}k`
  return String(Math.floor(amount))
}

export function playGoldSound() {
  try {
    const audio = new Audio('/sounds/gold.mp3')
    const v = Number(localStorage.getItem('alc-volume') ?? 0.6)
    audio.volume = Math.min(1, Math.max(0.75, v * 2.0))
    audio.play().catch(() => {})
  } catch {}
}

// Tocado sempre que o estoque de Rudolf é renovado (timer de 6h ou refresh admin)
export function playStockSound() {
  try {
    const audio = new Audio('/sounds/stock.mp3')
    const v = Number(localStorage.getItem('alc-volume') ?? 0.6)
    audio.volume = Math.min(1, Math.max(0.5, v * 1.6))
    audio.play().catch(() => {})
  } catch {}
}
