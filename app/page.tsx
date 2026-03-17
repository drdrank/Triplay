'use client'

import Link from 'next/link'
import { useProgress } from '@/hooks/useProgress'
import { useStreak } from '@/hooks/useStreak'
import { useSettings } from '@/hooks/useSettings'
import stickers from '@/data/stickers.json'
import vocabulary from '@/data/vocabulary.json'
import type { VocabItem } from '@/types'
import { LANG_FLAGS } from '@/types'

function getWordOfDay(items: VocabItem[]): VocabItem {
  const epoch = Math.floor(Date.now() / 86_400_000)
  return items[epoch % items.length]
}

const MAIN_BUTTONS = [
  {
    href: '/learn',
    icon: '📖',
    label: 'Learn',
    sub: 'Lernen · Leren · Öğrenmek',
    gradient: 'linear-gradient(135deg, #5C4AE4 0%, #4338CA 100%)',
    glow: 'rgba(92,74,228,0.40)',
  },
  {
    href: '/game',
    icon: '🎮',
    label: 'Play',
    sub: 'Find the right word',
    gradient: 'linear-gradient(135deg, #FF6B35 0%, #DC2626 100%)',
    glow: 'rgba(255,107,53,0.40)',
  },
  {
    href: '/listen',
    icon: '🎧',
    label: 'Listen & Find',
    sub: 'Hear it · tap the emoji',
    gradient: 'linear-gradient(135deg, #00BFA5 0%, #0EA5E9 100%)',
    glow: 'rgba(0,191,165,0.40)',
  },
  {
    href: '/truefalse',
    icon: '✅',
    label: 'True or False',
    sub: 'Is this the right word?',
    gradient: 'linear-gradient(135deg, #00D4AA 0%, #059669 100%)',
    glow: 'rgba(0,212,170,0.40)',
  },
  {
    href: '/quiz',
    icon: '🔍',
    label: 'Find the Emoji',
    sub: 'Read the word · tap the emoji',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
    glow: 'rgba(139,92,246,0.40)',
  },
  {
    href: '/oddoneout',
    icon: '🔎',
    label: 'Odd One Out',
    sub: 'Find what doesn\'t belong',
    gradient: 'linear-gradient(135deg, #0c4a6e 0%, #7C3AED 100%)',
    glow: 'rgba(124,58,237,0.40)',
  },
  {
    href: '/memory',
    icon: '🃏',
    label: 'Memory',
    sub: 'Match emoji to word',
    gradient: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)',
    glow: 'rgba(236,72,153,0.40)',
  },
  {
    href: '/stickers',
    icon: '⭐',
    label: 'Stickers',
    sub: 'Collect your rewards',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    glow: 'rgba(245,158,11,0.40)',
  },
]

const QUICK_LINKS = [
  { href: '/abc',     icon: '🔤', label: 'ABC',    gradient: 'linear-gradient(135deg, #5C4AE4, #7C3AED)' },
  { href: '/numbers', icon: '🔢', label: '1 2 3',  gradient: 'linear-gradient(135deg, #FF6B35, #F59E0B)' },
  { href: '/colors',  icon: '🎨', label: 'Colors', gradient: 'linear-gradient(135deg, #EC4899, #8B5CF6)' },
]

export default function Home() {
  const { progress } = useProgress()
  const { streak } = useStreak()
  const { settings } = useSettings()

  const unlockedCount = progress.unlockedStickers.length
  const wordOfDay = getWordOfDay(vocabulary as VocabItem[])
  const displayLangs = settings.languages.length > 0 ? settings.languages : (['de', 'nl', 'tr'] as const)

  return (
    <div className="flex flex-col min-h-dvh" style={{ background: '#0F0E1A' }}>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div
        className="relative"
        style={{ background: 'linear-gradient(160deg, #110D2D 0%, #1A1554 45%, #2D1B69 100%)' }}
      >
        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-25"
            style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)' }}
          />
          <div
            className="absolute -bottom-12 -left-12 w-56 h-56 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #00D4AA, transparent)' }}
          />
        </div>

        <div className="relative flex flex-col items-center pt-14 pb-12 px-6">
          <div className="text-7xl mb-3 animate-bounce-in" style={{ filter: 'drop-shadow(0 4px 24px rgba(92,74,228,0.6))' }}>
            🌍
          </div>
          <h1
            className="font-black text-white tracking-tight leading-none mb-2"
            style={{ fontSize: 56, textShadow: '0 2px 30px rgba(92,74,228,0.5)' }}
          >
            TriPlay
          </h1>
          <p className="font-semibold text-sm mb-6" style={{ color: '#C4B5FD' }}>
            Learn 3 languages through play
          </p>
          <div className="flex gap-4 mb-2">
            {(['🇩🇪', '🇳🇱', '🇹🇷'] as const).map((flag, i) => (
              <span
                key={i}
                className="animate-bounce-in"
                style={{ fontSize: 38, animationDelay: `${0.1 + i * 0.1}s`, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' }}
              >
                {flag}
              </span>
            ))}
          </div>
        </div>

        {/* Stats pill */}
        <div
          className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3 rounded-full px-5 py-2.5 whitespace-nowrap"
          style={{
            background: '#1A1830',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}
        >
          {streak > 0 && (
            <>
              <span className="text-sm font-black" style={{ color: streak >= 7 ? '#F59E0B' : '#FF6B35' }}>
                🔥 {streak}d
              </span>
              <div className="w-px h-4" style={{ background: 'rgba(255,255,255,0.15)' }} />
            </>
          )}
          <span className="text-sm font-bold" style={{ color: '#C4B5FD' }}>
            ⭐ {unlockedCount}/{stickers.length}
          </span>
          <div className="w-px h-4" style={{ background: 'rgba(255,255,255,0.15)' }} />
          <span className="text-sm font-bold" style={{ color: '#C4B5FD' }}>
            🏆 {progress.totalCorrect}
          </span>
        </div>
      </div>

      {/* ── Word of the Day ──────────────────────────────────────── */}
      <div className="px-4 pt-10 pb-0">
        <div
          className="rounded-3xl overflow-hidden animate-fade-up glass-card"
        >
          <div
            className="px-4 py-2.5 flex items-center gap-2"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
          >
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#00D4AA' }}>
              ✦ Word of the Day
            </span>
          </div>
          <div className="flex items-center gap-4 p-4">
            <div
              className="flex items-center justify-center rounded-2xl flex-shrink-0"
              style={{ width: 64, height: 64, background: `${wordOfDay.color}20`, fontSize: 38 }}
            >
              {wordOfDay.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                {displayLangs.map(lang => (
                  <div key={lang} className="flex items-center gap-1.5">
                    <span className="text-sm">{LANG_FLAGS[lang]}</span>
                    <span className="text-base font-black text-white">{wordOfDay[lang]}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs font-semibold mt-1 capitalize" style={{ color: 'rgba(196,181,253,0.55)' }}>
                {wordOfDay.category}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Streak banner ────────────────────────────────────────── */}
      {streak > 0 && (
        <div className="px-4 pt-3">
          <div
            className="rounded-2xl px-4 py-3 flex items-center gap-3"
            style={{
              background: streak >= 7
                ? 'linear-gradient(135deg, #B45309, #D97706)'
                : 'linear-gradient(135deg, #C2410C, #FF6B35)',
              boxShadow: streak >= 7
                ? '0 4px 20px rgba(180,83,9,0.5)'
                : '0 4px 20px rgba(255,107,53,0.45)',
            }}
          >
            <span className="text-2xl animate-flame">🔥</span>
            <div className="flex-1">
              <div className="text-white font-black text-sm">
                {streak} day streak! {streak >= 7 && "You're on fire!"}
              </div>
              <div className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Come back tomorrow to keep it going
              </div>
            </div>
            <div className="font-black text-xl" style={{ color: 'rgba(255,255,255,0.3)' }}>{streak}🔥</div>
          </div>
        </div>
      )}

      {/* ── Main buttons ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 px-4 pt-4 pb-2">
        {MAIN_BUTTONS.map(({ href, icon, label, sub, gradient, glow }, i) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-4 px-5 py-4 animate-slide-up active:scale-[0.98] transition-transform"
            style={{
              background: gradient,
              boxShadow: `0 6px 24px ${glow}`,
              borderRadius: 20,
              animationDelay: `${i * 0.05}s`,
            }}
          >
            <div
              className="flex items-center justify-center rounded-2xl text-3xl flex-shrink-0"
              style={{
                width: 52,
                height: 52,
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xl font-black text-white leading-tight">{label}</div>
              <div className="text-xs font-semibold mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.65)' }}>{sub}</div>
            </div>
            <svg className="flex-shrink-0" style={{ color: 'rgba(255,255,255,0.5)' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </Link>
        ))}
      </div>

      {/* ── Quick learn row ──────────────────────────────────────── */}
      <div className="px-4 pt-2 pb-4">
        <p className="text-xs font-bold uppercase tracking-wider mb-2.5 px-1" style={{ color: 'rgba(196,181,253,0.45)' }}>
          Quick Learn
        </p>
        <div className="flex gap-2.5">
          {QUICK_LINKS.map(({ href, icon, label, gradient }) => (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center gap-1.5 py-4 rounded-2xl active:scale-95 transition-transform"
              style={{ background: gradient }}
            >
              <span className="text-2xl">{icon}</span>
              <span className="text-xs font-black text-white">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Parent mode ──────────────────────────────────────────── */}
      <div className="px-4 pb-28">
        <Link
          href="/parent"
          className="flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold active:opacity-70 transition-opacity"
          style={{
            background: 'rgba(255,255,255,0.04)',
            color: 'rgba(196,181,253,0.5)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
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
