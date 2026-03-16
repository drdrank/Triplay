'use client'

import Link from 'next/link'
import { useProgress } from '@/hooks/useProgress'
import stickers from '@/data/stickers.json'

export default function StickersPage() {
  const { progress } = useProgress()
  const unlocked = progress.unlockedStickers

  const pct = Math.round((unlocked.length / stickers.length) * 100)

  return (
    <div className="flex flex-col min-h-dvh bg-white">

      {/* Header */}
      <div
        className="px-5 pt-12 pb-6"
        style={{ background: 'linear-gradient(145deg, #92400e 0%, #d97706 50%, #f59e0b 100%)' }}
      >
        <div className="flex items-center gap-3 mb-5">
          <Link
            href="/"
            className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-white font-bold active:opacity-60 transition-opacity"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </Link>
          <h1 className="text-xl font-black text-white flex-1">My Stickers</h1>
          <span className="text-amber-100 font-bold text-sm">
            {unlocked.length}/{stickers.length}
          </span>
        </div>

        {/* Progress */}
        <div className="rounded-2xl bg-white/15 p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/80 text-xs font-bold">Collection progress</span>
            <span className="text-white font-black text-sm">{pct}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, background: 'white' }}
            />
          </div>
          <p className="text-white/60 text-xs font-medium mt-2">
            {progress.totalCorrect} correct answers total
          </p>
        </div>
      </div>

      {/* Empty state */}
      {unlocked.length === 0 && (
        <div className="flex flex-col items-center px-8 py-12 text-center">
          <div className="text-6xl mb-4">🎮</div>
          <p className="text-lg font-bold text-surface-600 mb-1">No stickers yet!</p>
          <p className="text-sm text-surface-400 mb-6">Play the game to earn your first sticker</p>
          <Link
            href="/game"
            className="rounded-2xl px-8 py-3.5 text-white font-black text-base active:scale-95 transition-transform"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
            }}
          >
            Start Playing →
          </Link>
        </div>
      )}

      {/* Sticker grid */}
      <div className="px-4 pt-4 pb-28 grid grid-cols-3 gap-3">
        {stickers.map((sticker) => {
          const isUnlocked = unlocked.includes(sticker.id)
          const remaining = sticker.requiredScore - progress.totalCorrect

          return (
            <div
              key={sticker.id}
              className="flex flex-col items-center justify-center rounded-3xl py-5 px-2 aspect-square transition-all"
              style={
                isUnlocked
                  ? {
                      background: 'white',
                      boxShadow: '0 2px 12px rgba(245,158,11,0.20), 0 0 0 1.5px #fcd34d',
                    }
                  : {
                      background: '#fafafa',
                      border: '1.5px dashed #e4e4e7',
                    }
              }
            >
              <span
                className="text-5xl mb-1.5"
                style={{
                  filter: isUnlocked ? 'none' : 'grayscale(1)',
                  opacity: isUnlocked ? 1 : 0.3,
                }}
              >
                {isUnlocked ? sticker.emoji : '🔒'}
              </span>
              <span
                className="text-[11px] font-bold text-center px-1 leading-tight"
                style={{ color: isUnlocked ? '#27272a' : '#a1a1aa' }}
              >
                {isUnlocked ? sticker.name : `${sticker.requiredScore} ✓`}
              </span>
              {!isUnlocked && remaining > 0 && (
                <span className="text-[10px] text-surface-400 mt-0.5 font-medium">
                  {remaining} more
                </span>
              )}
            </div>
          )
        })}
      </div>

      {unlocked.length === stickers.length && (
        <div className="text-center px-6 pb-8">
          <div className="text-5xl mb-2">🏆</div>
          <p className="text-xl font-black text-amber-600">You collected them all!</p>
        </div>
      )}
    </div>
  )
}
