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
      setTimeout(() => {
        setState('playing')
        setSelectedId(null)
      }, 900)
    }
  }

  const { target, choices } = round

  return (
    <div className="flex flex-col min-h-dvh bg-white">
      <Confetti active={showConfetti} count={60} />

      {/* Header */}
      <div
        className="flex items-center justify-between px-5 pt-12 pb-4"
        style={{ background: 'linear-gradient(145deg, #065f46 0%, #059669 50%, #10b981 100%)' }}
      >
        <Link
          href="/"
          className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-white active:opacity-60 transition-opacity"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </Link>

        <div className="text-center">
          <div className="text-white font-black text-base">Find the Emoji!</div>
          {streak >= 3 && (
            <div className="text-amber-300 font-bold text-xs animate-bounce-in">🔥 {streak} in a row!</div>
          )}
        </div>

        <div
          className="flex items-center gap-1.5 rounded-2xl px-3 py-1.5 text-white font-black text-sm"
          style={{ background: 'rgba(255,255,255,0.15)' }}
        >
          <span className="text-amber-300">⭐</span>
          {score}
        </div>
      </div>

      {/* Words in all languages */}
      <div className="px-5 pt-6 pb-4">
        <div
          className="rounded-3xl p-5"
          style={{
            background: `${target.color}10`,
            border: `1.5px solid ${target.color}25`,
          }}
        >
          <p className="text-xs font-bold uppercase tracking-widest mb-3 text-center" style={{ color: target.color }}>
            Which emoji is this?
          </p>
          <div className="flex flex-col gap-2">
            {langs.map((lang) => (
              <div key={lang} className="flex items-center gap-2 justify-center">
                <span className="text-xl">{LANG_FLAGS[lang]}</span>
                <span className="text-2xl font-black" style={{ color: '#18181b' }}>
                  {target[lang]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emoji grid — 2×2 */}
      <div className="px-5 pb-28 grid grid-cols-2 gap-3">
        {choices.map((item) => {
          const isSelected = selectedId === item.id
          const isCorrect = item.id === target.id
          const showGreen = isSelected && state === 'correct'
          const showGreenReveal = state === 'correct' && isCorrect
          const showRed = isSelected && state === 'wrong'

          return (
            <button
              key={item.id}
              onClick={() => handleChoice(item)}
              className={`rounded-3xl flex items-center justify-center transition-all active:scale-95
                ${showGreen || showGreenReveal ? 'animate-pop' : ''}
                ${showRed ? 'animate-shake' : ''}
              `}
              style={{
                height: 130,
                background:
                  showGreen || showGreenReveal ? 'linear-gradient(135deg, #16a34a, #22c55e)' :
                  showRed ? 'linear-gradient(135deg, #dc2626, #ef4444)' :
                  `${item.color}12`,
                border: `2px solid ${
                  showGreen || showGreenReveal ? '#16a34a' :
                  showRed ? '#dc2626' :
                  `${item.color}30`
                }`,
                boxShadow:
                  showGreen || showGreenReveal ? '0 4px 20px rgba(34,197,94,0.35)' :
                  showRed ? '0 4px 20px rgba(239,68,68,0.35)' :
                  `0 2px 12px ${item.color}15`,
              }}
            >
              <span style={{ fontSize: 72 }}>{item.emoji}</span>
            </button>
          )
        })}
      </div>

      {/* Sticker modal */}
      {state === 'sticker' && newSticker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)' }}
        >
          <div
            className="modal-panel w-full max-w-xs rounded-4xl bg-white p-8 text-center"
            style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.25)' }}
          >
            <div className="text-9xl mb-4 animate-bounce-in">{newSticker.emoji}</div>
            <div className="text-2xl font-black text-surface-800 mb-1">New Sticker!</div>
            <div className="text-base font-bold mb-8" style={{ color: '#10b981' }}>{newSticker.name}</div>
            <button
              onClick={nextRound}
              className="w-full rounded-2xl py-4 text-lg font-black text-white active:scale-95 transition-transform"
              style={{
                background: 'linear-gradient(135deg, #059669, #10b981)',
                boxShadow: '0 6px 20px rgba(16,185,129,0.35)',
              }}
            >
              Keep Playing →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
