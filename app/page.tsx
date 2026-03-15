'use client'

import Link from 'next/link'
import { useProgress } from '@/hooks/useProgress'
import stickers from '@/data/stickers.json'

const BUTTONS = [
  {
    href: '/learn',
    icon: '📖',
    label: 'Learn',
    sub: 'Lernen · Leren · Öğrenmek',
    from: '#f97316',
    to: '#ea580c',
    glow: 'rgba(249,115,22,0.35)',
  },
  {
    href: '/game',
    icon: '🎮',
    label: 'Play',
    sub: 'Spielen · Spelen · Oynamak',
    from: '#a855f7',
    to: '#7c3aed',
    glow: 'rgba(168,85,247,0.35)',
  },
  {
    href: '/stickers',
    icon: '⭐',
    label: 'Stickers',
    sub: 'Sticker · Stickers · Çıkartmalar',
    from: '#f59e0b',
    to: '#d97706',
    glow: 'rgba(245,158,11,0.35)',
  },
]

export default function Home() {
  const { progress } = useProgress()
  const unlockedCount = progress.unlockedStickers.length

  return (
    <div className="flex flex-col min-h-dvh" style={{ background: '#f8f7ff' }}>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <div
        className="relative flex flex-col items-center justify-center pt-16 pb-12 px-6"
        style={{
          background: 'linear-gradient(160deg, #7c3aed 0%, #a855f7 45%, #ec4899 100%)',
          borderRadius: '0 0 40px 40px',
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-4 right-6 text-5xl opacity-20 animate-pulse-soft">✦</div>
        <div className="absolute bottom-8 left-4 text-4xl opacity-20 animate-pulse-soft" style={{ animationDelay: '0.8s' }}>✦</div>

        <div className="text-7xl mb-3 animate-bounce-in drop-shadow-lg">🌍</div>
        <h1 className="text-5xl font-black text-white tracking-tight drop-shadow mb-1">
          TriPlay
        </h1>
        <p className="text-white/70 font-semibold text-sm mb-6">
          Learn 3 languages through play!
        </p>

        {/* Flags */}
        <div className="flex gap-3 text-4xl">
          {['🇩🇪', '🇳🇱', '🇹🇷'].map((flag, i) => (
            <span
              key={i}
              className="animate-bounce-in drop-shadow"
              style={{ animationDelay: `${0.1 + i * 0.1}s` }}
            >
              {flag}
            </span>
          ))}
        </div>

        {/* Score pill */}
        <div
          className="absolute -bottom-5 flex items-center gap-3 rounded-full px-5 py-2 shadow-lg"
          style={{ background: 'white' }}
        >
          <span className="text-sm font-bold text-gray-500">
            ⭐ {unlockedCount}/{stickers.length} stickers
          </span>
          <span className="text-gray-200">·</span>
          <span className="text-sm font-bold text-gray-500">
            🏆 {progress.totalCorrect} correct
          </span>
        </div>
      </div>

      {/* ── Buttons ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 px-5 pt-14 pb-8 flex-1">
        {BUTTONS.map(({ href, icon, label, sub, from, to, glow }, i) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-5 rounded-3xl px-6 py-5 animate-slide-up active:scale-95 transition-transform"
            style={{
              background: `linear-gradient(135deg, ${from}, ${to})`,
              boxShadow: `0 8px 24px ${glow}`,
              animationDelay: `${i * 0.07}s`,
            }}
          >
            <span className="text-5xl drop-shadow animate-pulse-soft">{icon}</span>
            <div>
              <div className="text-2xl font-black text-white leading-tight">{label}</div>
              <div className="text-xs text-white/65 font-semibold mt-0.5">{sub}</div>
            </div>
            <span className="ml-auto text-white/50 text-2xl">›</span>
          </Link>
        ))}

        {/* Parent mode */}
        <Link
          href="/parent"
          className="flex items-center justify-center gap-2 mt-2 py-3 rounded-2xl text-sm font-bold text-gray-400 active:opacity-60"
          style={{ background: '#F3F4F6' }}
        >
          👨‍👩‍👧 Parent Mode
        </Link>
      </div>
    </div>
  )
}
