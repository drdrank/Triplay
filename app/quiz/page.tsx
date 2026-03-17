'use client'

import { useState } from 'react'
import Link from 'next/link'
import Confetti from '@/components/Confetti'
import { useSettings } from '@/hooks/useSettings'
import { useProgress } from '@/hooks/useProgress'
import { useStreak } from '@/hooks/useStreak'
import vocabulary from '@/data/vocabulary.json'
import type { VocabItem, Language, StickerItem } from '@/types'
import { LANG_FLAGS } from '@/types'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildRound(languages: Language[]) {
  const all = shuffle(vocabulary as VocabItem[])
  const target = all[0]
  const distractors = all.slice(1, 4)
  const choices = shuffle([target, ...distractors])
  return { target, choices, languages }
}

type RoundState = 'playing' | 'correct' | 'wrong' | 'sticker'

export default function QuizPage() {
  const { settings } = useSettings()
  const { addCorrect } = useProgress()
  const { markPlayed } = useStreak()

  const langs = settings.languages.length > 0 ? settings.languages : (['de', 'nl', 'tr'] as Language[])

  const [round, setRound] = useState(() => buildRound(langs))
  const [state, setState] = useState<RoundState>('playing')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [newSticker, setNewSticker] = useState<StickerItem | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)

  function nextRound() {
    setState('playing')
    setSelectedId(null)
    setNewSticker(null)
    setRound(buildRound(langs))
  }

  function handleChoice(item: VocabItem) {
    if (state !== 'playing') return
    setSelectedId(item.id)

    if (item.id === round.target.id) {
      const { newSticker: sticker } = addCorrect()
      markPlayed()
      setScore(s => s + 1)
      setStreak(s => s + 1)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 80)
      if (sticker) {
        setNewSticker(sticker as StickerItem)
        setState('sticker')
      } else {
        setState('correct')
        setTimeout(nextRound, 900)
      }
    } else {
      setStreak(0)
      setState('wrong')
      setTimeout(() => { setState('playing'); setSelectedId(null) }, 900)
    }
  }

  const { target, choices } = round

  return (
    <div className="flex flex-col min-h-dvh" style={{ background: '#0F0E1A' }}>
      <Confetti active={showConfetti} count={60} />

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4"
        style={{ background: 'linear-gradient(135deg, #3b0764 0%, #8B5CF6 100%)' }}>
        <Link href="/"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white active:opacity-60 transition-opacity"
          style={{ background: 'rgba(255,255,255,0.15)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </Link>
        <div className="text-center">
          <div className="text-white font-black text-base">Find the Emoji!</div>
          {streak >= 3 && <div className="font-bold text-xs animate-bounce-in" style={{ color: '#FEF08A' }}>🔥 {streak} in a row!</div>}
        </div>
        <div className="flex items-center gap-1.5 rounded-2xl px-3 py-1.5 font-black text-sm text-white"
          style={{ background: 'rgba(255,255,255,0.18)' }}>
          <span style={{ color: '#FEF08A' }}>⭐</span>{score}
        </div>
      </div>

      {/* Word display */}
      <div className="px-5 pt-6 pb-4">
        <div className="rounded-3xl p-5 glass-card">
          <p className="text-xs font-black uppercase tracking-widest mb-3 text-center" style={{ color: '#C4B5FD' }}>
            Which emoji is this?
          </p>
          <div className="flex flex-col gap-2">
            {langs.map((lang) => (
              <div key={lang} className="flex items-center gap-2 justify-center">
                <span className="text-xl">{LANG_FLAGS[lang]}</span>
                <span className="text-2xl font-black text-white">{target[lang]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emoji grid 2×2 */}
      <div className="px-5 pb-28 grid grid-cols-2 gap-3">
        {choices.map((item) => {
          const isSelected = selectedId === item.id
          const isCorrect  = item.id === target.id
          const showGreen  = isSelected && state === 'correct'
          const showGreenReveal = state === 'correct' && isCorrect
          const showRed    = isSelected && state === 'wrong'

          return (
            <button key={item.id} onClick={() => handleChoice(item)}
              className={`rounded-3xl flex items-center justify-center transition-all active:scale-95 ${showGreen || showGreenReveal ? 'animate-pop' : ''} ${showRed ? 'animate-shake' : ''}`}
              style={{
                height: 130,
                background:
                  showGreen || showGreenReveal ? 'linear-gradient(135deg, #16a34a, #00D4AA)' :
                  showRed ? 'linear-gradient(135deg, #dc2626, #ef4444)' :
                  '#1A1830',
                border: showGreen || showGreenReveal || showRed
                  ? 'none'
                  : '1px solid rgba(255,255,255,0.08)',
                boxShadow:
                  showGreen || showGreenReveal ? '0 4px 24px rgba(0,212,170,0.45)' :
                  showRed ? '0 4px 24px rgba(239,68,68,0.45)' :
                  '0 2px 8px rgba(0,0,0,0.25)',
              }}>
              <span style={{ fontSize: 72 }}>{item.emoji}</span>
            </button>
          )
        })}
      </div>

      {/* Sticker modal */}
      {state === 'sticker' && newSticker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)' }}>
          <div className="modal-panel w-full max-w-xs rounded-4xl p-8 text-center"
            style={{ background: '#1A1830', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}>
            <div className="text-9xl mb-4 animate-bounce-in">{newSticker.emoji}</div>
            <div className="text-2xl font-black text-white mb-1">New Sticker!</div>
            <div className="text-base font-bold mb-8" style={{ color: '#C4B5FD' }}>{newSticker.name}</div>
            <button onClick={nextRound}
              className="w-full rounded-2xl py-4 text-lg font-black text-white active:scale-95 transition-transform"
              style={{ background: 'linear-gradient(135deg, #3b0764, #8B5CF6)', boxShadow: '0 6px 24px rgba(139,92,246,0.45)' }}>
              Keep Playing →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
