'use client'

import Link from 'next/link'
import { useProgress } from '@/hooks/useProgress'
import { useStreak } from '@/hooks/useStreak'
import { useSettings } from '@/hooks/useSettings'
import stickers from '@/data/stickers.json'
import vocabulary from '@/data/vocabulary.json'
import type { VocabItem } from '@/types'
import { LANG_FLAGS } from '@/types'

// Deterministic "word of the day" — same word all day, rotates daily
function getWordOfDay(items: VocabItem[]): VocabItem {
  const epoch = Math.floor(Date.now() / 86_400_000) // days since unix epoch
  return items[epoch % items.length]
}

const MAIN_BUTTONS = [
  {
    href: '/learn',
    icon: '📖',
    label: 'Learn',
    sub: 'Lernen · Leren · Öğrenmek',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    glow: 'rgba(99,102,241,0.30)',
  },
  {
    href: '/game',
    icon: '🎮',
    label: 'Play',
    sub: 'Find the right word',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
    glow: 'rgba(245,158,11,0.30)',
  },
  {
    href: '/listen',
    icon: '🎧',
    label: 'Listen & Find',
    sub: 'Hear it · tap the emoji',
    gradient: 'linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)',
    glow: 'rgba(14,165,233,0.30)',
  },
  {
    href: '/memory',
    icon: '🃏',
    label: 'Memory',
    sub: 'Gedächtnis · Geheugen · Hafıza',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
    glow: 'rgba(236,72,153,0.30)',
  },
  {
    href: '/stickers',
    icon: '⭐',
    label: 'Stickers',
    sub: 'Sticker · Stickers · Çıkartmalar',
    gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
    glow: 'rgba(217,119,6,0.30)',
  },
]

const QUICK_LINKS = [
  { href: '/abc',     icon: '🔤', label: 'ABC',    bg: '#eef2ff', fg: '#6366f1' },
  { href: '/numbers', icon: '🔢', label: '1 2 3',  bg: '#fffbeb', fg: '#d97706' },
  { href: '/colors',  icon: '🎨', label: 'Colors', bg: '#fdf4ff', fg: '#a855f7' },
]

export default function Home() {
  const { progress } = useProgress()
  const { streak } = useStreak()
  const { settings } = useSettings()

  const unlockedCount = progress.unlockedStickers.length
  const wordOfDay = getWordOfDay(vocabulary as VocabItem[])
  const displayLangs = settings.languages.length > 0 ? settings.languages : (['de', 'nl', 'tr'] as const)

  return (
    <div className="flex flex-col min-h-dvh bg-white">

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <div
        className="relative"
        style={{ background: 'linear-gradient(145deg, #1e1b4b 0%, #3730a3 40%, #6366f1 100%)' }}
      >
        {/* Decorative blobs — clipped separately so pill stays visible */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #a5b4fc, transparent)' }} />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #818cf8, transparent)' }} />
        </div>

        <div className="relative flex flex-col items-center pt-14 pb-12 px-6">
          <div className="text-7xl mb-3 animate-bounce-in drop-shadow-xl">🌍</div>

          <h1 className="text-5xl font-black text-white tracking-tight leading-none mb-1">
            TriPlay
          </h1>
          <p className="text-indigo-200 font-medium text-sm mb-5">
            Learn 3 languages through play
          </p>

          <div className="flex gap-3 text-4xl mb-2">
            {(['🇩🇪', '🇳🇱', '🇹🇷'] as const).map((flag, i) => (
              <span
                key={i}
                className="animate-bounce-in drop-shadow-lg"
                style={{ animationDelay: `${0.08 + i * 0.08}s` }}
              >
                {flag}
              </span>
            ))}
          </div>
        </div>

        {/* Stats pill */}
        <div
          className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3 rounded-full px-5 py-2.5 shadow-card-lg whitespace-nowrap"
          style={{ background: 'white', border: '1px solid rgba(0,0,0,0.06)' }}
        >
          {streak > 0 && (
            <>
              <span className="text-sm font-black" style={{ color: streak >= 7 ? '#d97706' : '#f97316' }}>
                🔥 {streak}d
              </span>
              <div className="w-px h-4 bg-surface-200" />
            </>
          )}
          <span className="text-sm font-bold text-surface-500">
            ⭐ {unlockedCount}/{stickers.length}
          </span>
          <div className="w-px h-4 bg-surface-200" />
          <span className="text-sm font-bold text-surface-500">
            🏆 {progress.totalCorrect}
          </span>
        </div>
      </div>

      {/* ── Word of the Day ────────────────────────────────────────── */}
      <div className="px-4 pt-12 pb-0">
        <div
          className="rounded-3xl overflow-hidden animate-fade-up"
          style={{
            background: 'white',
            border: '1.5px solid #e4e4e7',
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
          }}
        >
          {/* Header strip */}
          <div
            className="px-4 py-2 flex items-center gap-2"
            style={{ background: `${wordOfDay.color}12`, borderBottom: `1.5px solid ${wordOfDay.color}20` }}
          >
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: wordOfDay.color }}>
              ✦ Word of the Day
            </span>
          </div>

          <div className="flex items-center gap-4 p-4">
            {/* Emoji */}
            <div
              className="flex items-center justify-center rounded-2xl flex-shrink-0"
              style={{
                width: 64,
                height: 64,
                background: `${wordOfDay.color}14`,
                fontSize: 40,
              }}
            >
              {wordOfDay.emoji}
            </div>

            {/* Words */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                {displayLangs.map(lang => (
                  <div key={lang} className="flex items-center gap-1.5">
                    <span className="text-sm">{LANG_FLAGS[lang]}</span>
                    <span className="text-base font-black text-surface-800">
                      {wordOfDay[lang]}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-surface-400 font-medium mt-1 capitalize">
                {wordOfDay.category}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Streak banner (only if streak > 0) ─────────────────────── */}
      {streak > 0 && (
        <div className="px-4 pt-3">
          <div
            className="rounded-2xl px-4 py-3 flex items-center gap-3"
            style={{
              background: streak >= 7
                ? 'linear-gradient(135deg, #92400e, #d97706)'
                : 'linear-gradient(135deg, #ea580c, #f97316)',
              boxShadow: streak >= 7
                ? '0 4px 16px rgba(217,119,6,0.3)'
                : '0 4px 16px rgba(249,115,22,0.25)',
            }}
          >
            <span className="text-2xl">{streak >= 7 ? '🔥' : '⚡'}</span>
            <div className="flex-1">
              <div className="text-white font-black text-sm">
                {streak} day streak!
                {streak >= 7 && ' You&apos;re on fire!'}
                {streak >= 30 && ' Incredible!!'}
              </div>
              <div className="text-white/65 text-xs font-medium">
                Come back tomorrow to keep it going
              </div>
            </div>
            <div className="text-white/40 text-xl font-black">{streak}🔥</div>
          </div>
        </div>
      )}

      {/* ── Main buttons ───────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 px-4 pt-4 pb-4">
        {MAIN_BUTTONS.map(({ href, icon, label, sub, gradient, glow }, i) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-4 rounded-3xl px-5 py-4 animate-slide-up active:scale-[0.97] transition-transform"
            style={{
              background: gradient,
              boxShadow: `0 6px 20px ${glow}`,
              animationDelay: `${i * 0.05}s`,
            }}
          >
            <div
              className="flex items-center justify-center rounded-2xl text-4xl flex-shrink-0"
              style={{ width: 52, height: 52, background: 'rgba(255,255,255,0.15)' }}
            >
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xl font-black text-white leading-tight">{label}</div>
              <div className="text-[11px] text-white/60 font-semibold mt-0.5 truncate">{sub}</div>
            </div>
            <svg className="text-white/40 flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </Link>
        ))}
      </div>

      {/* ── Quick learn row ────────────────────────────────────────── */}
      <div className="px-4 pb-4">
        <p className="text-xs font-bold text-surface-400 uppercase tracking-wider mb-2.5 px-1">
          Quick Learn
        </p>
        <div className="flex gap-2.5">
          {QUICK_LINKS.map(({ href, icon, label, bg, fg }) => (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center gap-1.5 py-4 rounded-2xl font-bold text-sm active:scale-95 transition-transform"
              style={{ background: bg, color: fg }}
            >
              <span className="text-2xl">{icon}</span>
              <span className="text-xs font-bold">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Parent mode ────────────────────────────────────────────── */}
      <div className="px-4 pb-28">
        <Link
          href="/parent"
          className="flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold active:opacity-70 transition-opacity"
          style={{ background: '#f4f4f5', color: '#71717a' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
          </svg>
          Parent Mode
        </Link>
      </div>

    </div>
  )
}
