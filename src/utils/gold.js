export function formatGold(amount) {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(1)}k`
  return String(Math.floor(amount))
}

export function playGoldSound() {
  try {
    const audio = new Audio('/sounds/gold.mp3')
    const v = Number(localStorage.getItem('alc-volume') ?? 0.3)
    audio.volume = Math.min(1, v * 1.4)
    audio.play().catch(() => {})
  } catch {}
}
