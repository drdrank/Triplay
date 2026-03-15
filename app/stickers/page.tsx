'use client'

import Link from 'next/link'
import { useProgress } from '@/hooks/useProgress'
import stickers from '@/data/stickers.json'

export default function StickersPage() {
  const { progress } = useProgress()
  const unlocked = progress.unlockedStickers

  const pct = Math.round((unlocked.length / stickers.length) * 100)

  return (
    <div className="flex flex-col min-h-dvh" style={{ background: '#f8f7ff' }}>

      {/* ── Header ───────────────────────────────────────────────── */}
      <div
        className="px-5 pt-12 pb-6"
        style={{ background: 'linear-gradient(160deg,#f59e0b,#f97316)' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Link href="/" className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-lg active:opacity-60">
            ←
          </Link>
          <h1 className="text-xl font-black text-white">My Stickers</h1>
          <span className="ml-auto text-white/70 font-bold text-sm">
            {unlocked.length}/{stickers.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-3 rounded-full bg-white/25 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: 'white' }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-white/60 text-xs font-semibold">{progress.totalCorrect} correct answers</span>
          <span className="text-white/60 text-xs font-semibold">{pct}%</span>
        </div>
      </div>

      {/* ── Sticker grid ──────────────────────────────────────────── */}
      <div className="px-4 pt-4 pb-28 grid grid-cols-3 gap-3">
        {stickers.map((sticker) => {
          const isUnlocked = unlocked.includes(sticker.id)
          const remaining = sticker.requiredScore - progress.totalCorrect

          return (
            <div
              key={sticker.id}
              className="flex flex-col items-center justify-center rounded-3xl aspect-square transition-all"
              style={{
                background: isUnlocked
                  ? 'white'
                  : 'rgba(0,0,0,0.04)',
                boxShadow: isUnlocked
                  ? '0 4px 16px rgba(245,158,11,0.2)'
                  : 'none',
                border: isUnlocked
                  ? '2px solid #fde68a'
                  : '2px dashed #e5e7eb',
              }}
            >
              <span
                className="text-5xl mb-1"
                style={{ filter: isUnlocked ? 'none' : 'grayscale(1)', opacity: isUnlocked ? 1 : 0.35 }}
              >
                {isUnlocked ? sticker.emoji : '🔒'}
              </span>
              <span
                className="text-[11px] font-bold text-center px-1 leading-tight"
                style={{ color: isUnlocked ? '#374151' : '#9CA3AF' }}
              >
                {isUnlocked ? sticker.name : `${sticker.requiredScore} ✓`}
              </span>
              {!isUnlocked && remaining > 0 && (
                <span className="text-[10px] text-gray-400 mt-0.5">
                  {remaining} more
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Empty state ───────────────────────────────────────────── */}
      {unlocked.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-10 text-center pointer-events-none mt-32">
          <span className="text-6xl">🎮</span>
          <p className="text-lg font-bold text-gray-500 pointer-events-auto">
            Play the game to earn your first sticker!
          </p>
          <Link
            href="/game"
            className="pointer-events-auto rounded-3xl px-8 py-4 text-white font-black text-base active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(135deg,#a855f7,#7c3aed)', boxShadow: '0 6px 20px rgba(168,85,247,0.4)' }}
          >
            Start Playing! 🎮
          </Link>
        </div>
      )}

      {unlocked.length === stickers.length && (
        <div className="text-center py-6">
          <span className="text-5xl">🏆</span>
          <p className="text-xl font-black text-yellow-600 mt-2">You got them all!</p>
        </div>
      )}

    </div>
  )
}
