'use client'

import Link from 'next/link'
import { useProgress } from '@/hooks/useProgress'
import stickers from '@/data/stickers.json'

export default function StickersPage() {
  const { progress } = useProgress()
  const unlocked = progress.unlockedStickers
  const pct = Math.round((unlocked.length / stickers.length) * 100)

  return (
    <div className="flex flex-col min-h-dvh" style={{ background: '#0F0E1A' }}>

      {/* Header */}
      <div className="px-5 pt-12 pb-6"
        style={{ background: 'linear-gradient(135deg, #78350f 0%, #F59E0B 100%)' }}>
        <div className="flex items-center gap-3 mb-5">
          <Link href="/"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white active:opacity-60 transition-opacity"
            style={{ background: 'rgba(255,255,255,0.15)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </Link>
          <h1 className="text-xl font-black text-white flex-1">Meine Sticker</h1>
          <span className="font-bold text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
            {unlocked.length}/{stickers.length}
          </span>
        </div>

        {/* Progress */}
        <div className="rounded-2xl p-3" style={{ background: 'rgba(0,0,0,0.2)' }}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.7)' }}>Sammelfortschritt</span>
            <span className="text-white font-black text-sm">{pct}%</span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, background: 'white' }} />
          </div>
          <p className="text-xs font-medium mt-2" style={{ color: 'rgba(255,255,255,0.55)' }}>
            {progress.totalCorrect} richtige Antworten gesamt
          </p>
        </div>
      </div>

      {/* Empty state */}
      {unlocked.length === 0 && (
        <div className="flex flex-col items-center px-8 py-12 text-center">
          <div className="text-6xl mb-4">🎮</div>
          <p className="text-lg font-black text-white mb-1">Noch keine Sticker!</p>
          <p className="text-sm font-medium mb-6" style={{ color: 'rgba(196,181,253,0.6)' }}>Spiele ein Spiel um deinen ersten Sticker zu verdienen</p>
          <Link href="/game"
            className="rounded-2xl px-8 py-3.5 text-white font-black text-base active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(135deg, #FF6B35, #DC2626)', boxShadow: '0 4px 20px rgba(255,107,53,0.45)' }}>
            Jetzt spielen →
          </Link>
        </div>
      )}

      {/* Sticker grid */}
      <div className="px-4 pt-4 pb-28 grid grid-cols-3 gap-3">
        {stickers.map((sticker) => {
          const isUnlocked = unlocked.includes(sticker.id)
          const remaining  = sticker.requiredScore - progress.totalCorrect
          return (
            <div key={sticker.id}
              className="flex flex-col items-center justify-center rounded-3xl py-5 px-2 aspect-square transition-all"
              style={isUnlocked ? {
                background: '#1A1830',
                boxShadow: '0 2px 16px rgba(245,158,11,0.25), 0 0 0 1.5px rgba(245,158,11,0.4)',
              } : {
                background: 'rgba(255,255,255,0.03)',
                border: '1.5px dashed rgba(255,255,255,0.10)',
              }}>
              <span className="text-5xl mb-1.5"
                style={{ filter: isUnlocked ? 'none' : 'grayscale(1)', opacity: isUnlocked ? 1 : 0.2 }}>
                {isUnlocked ? sticker.emoji : '🔒'}
              </span>
              <span className="text-[11px] font-bold text-center px-1 leading-tight"
                style={{ color: isUnlocked ? 'white' : 'rgba(255,255,255,0.25)' }}>
                {isUnlocked ? sticker.name : `${sticker.requiredScore} ✓`}
              </span>
              {!isUnlocked && remaining > 0 && (
                <span className="text-[10px] mt-0.5 font-medium" style={{ color: 'rgba(196,181,253,0.35)' }}>
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
          <p className="text-xl font-black" style={{ color: '#F59E0B' }}>Du hast alle gesammelt!</p>
        </div>
      )}
    </div>
  )
}
