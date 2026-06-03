import { useEffect, useState } from 'react'

// Singleton de áudio em nível de módulo — sobrevive à navegação entre páginas.
// A música só para se o usuário mutar/pausar OU ao trocar de conta (logout).

let audio = null
const listeners = new Set()

let state = {
  playing: false,
  volume: Number(localStorage.getItem('alc-volume') ?? 0.3),
}

function getAudio() {
  if (!audio) {
    audio = new Audio('/sounds/alchemy-lab.mp3')
    audio.loop = true
    audio.volume = state.volume
    // Sincroniza estado se o áudio parar por conta própria
    audio.addEventListener('pause', () => {
      if (state.playing) setState({ playing: false })
    })
    audio.addEventListener('play', () => {
      if (!state.playing) setState({ playing: true })
    })
  }
  return audio
}

function setState(patch) {
  state = { ...state, ...patch }
  listeners.forEach((fn) => fn(state))
}

export const music = {
  getState: () => state,

  subscribe(fn) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },

  play() {
    getAudio()
      .play()
      .then(() => setState({ playing: true }))
      .catch(() => setState({ playing: false }))
  },

  pause() {
    if (audio) audio.pause()
    setState({ playing: false })
  },

  toggle() {
    if (state.playing) this.pause()
    else this.play()
  },

  setVolume(v) {
    const vol = Math.min(1, Math.max(0, v))
    localStorage.setItem('alc-volume', String(vol))
    if (audio) audio.volume = vol
    setState({ volume: vol })
  },

  // Para completamente e zera — usado ao trocar de conta (logout)
  stop() {
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
    setState({ playing: false })
  },
}

// Hook React para componentes reagirem ao estado da música
export function useMusic() {
  const [s, setS] = useState(music.getState())
  useEffect(() => music.subscribe(setS), [])
  return s
}
