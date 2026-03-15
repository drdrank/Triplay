'use client'

import { useEffect, useRef } from 'react'

const COLORS = [
  '#FF6B35', '#FFD93D', '#6BCB77', '#4D96FF',
  '#FF6B6B', '#C77DFF', '#51CF66', '#FFA94D',
]

interface Particle {
  x: number
  left: string
  color: string
  duration: number
  delay: number
  size: number
  shape: 'rect' | 'circle'
}

function randomParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    x: i,
    left: `${Math.random() * 100}%`,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    duration: 1.0 + Math.random() * 0.8,
    delay: Math.random() * 0.4,
    size: 8 + Math.random() * 8,
    shape: Math.random() > 0.5 ? 'rect' : 'circle',
  }))
}

interface Props {
  active: boolean
  count?: number
}

export default function Confetti({ active, count = 40 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!active) return
    const container = containerRef.current
    if (!container) return

    container.innerHTML = ''
    const particles = randomParticles(count)

    particles.forEach((p) => {
      const el = document.createElement('div')
      el.style.cssText = `
        position: fixed;
        left: ${p.left};
        top: -12px;
        width: ${p.size}px;
        height: ${p.size}px;
        background: ${p.color};
        border-radius: ${p.shape === 'circle' ? '50%' : '2px'};
        animation: confettiFall ${p.duration}s linear ${p.delay}s forwards;
        pointer-events: none;
        z-index: 9999;
      `
      container.appendChild(el)
    })

    const cleanup = setTimeout(() => {
      container.innerHTML = ''
    }, 2500)

    return () => {
      clearTimeout(cleanup)
      container.innerHTML = ''
    }
  }, [active, count])

  return <div ref={containerRef} aria-hidden="true" />
}
