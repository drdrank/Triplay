'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import Confetti from '@/components/Confetti'
import { useSettings } from '@/hooks/useSettings'
import { useProgress } from '@/hooks/useProgress'
import { speakWord } from '@/lib/speech'
import vocabulary from '@/data/vocabulary.json'
import type { VocabItem, Language, StickerItem } from '@/types'
import { LANG_FLAGS, LANG_LABELS } from '@/types'

type GameState = 'playing' | 'correct' | 'wrong' | 'sticker'

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
  // 3 wrong words — all in the same quiz language
  const wrong = all.slice(1, 4)
  const lang = languages[Math.floor(Math.random() * languages.length)]
  // Choices are just the words (strings), shuffled
  const choices = shuffle([target, ...wrong])
  return { target, choices, lang }
}

export default function GamePage() {
  const { settings } = useSettings()
  const { addCorrect } = useProgress()

  const langs = settings.languages.length > 0 ? settings.languages : (['de', 'nl', 'tr'] as Language[])
  const rate  = settings.audioSpeed === 'slow' ? 0.6 : 1

  const [round, setRound]           = useState(() => buildRound(langs))
  const [state, setState]           = useState<GameState>('playing')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [newSticker, setNewSticker] = useState<StickerItem | null>(null)
  const [score, setScore]           = useState(0)
  const [streak, setStreak]         = useState(0)

  const speakTarget = useCallback(() => {
    speakWord(round.target[round.lang], round.lang, rate)
  }, [round, rate])

  useEffect(() => {
    const t = setTimeout(speakTarget, 350)
    return () => { clearTimeout(t); window.speechSynthesis?.cancel() }
  }, [round]) // eslint-disable-line

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
      setScore(s => s + 1)
      setStreak(s => s + 1)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 80)

      if (sticker) {
        setNewSticker(sticker as StickerItem)
        setState('sticker')
      } else {
        setState('correct')
        setTimeout(nextRound, 1000)
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

  const { target, choices, lang } = round

  return (
    <div className="flex flex-col min-h-dvh" style={{ background: '#f8f7ff' }}>
      <Confetti active={showConfetti} count={60} />

      {/* ── Header ─────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-5 pt-12 pb-4"
        style={{ background: 'linear-gradient(160deg,#7c3aed,#a855f7)' }}
      >
        <Link href="/" className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-lg active:opacity-60">
          ←
        </Link>
        <div className="text-center">
          <div className="text-white font-black text-lg">Find the word!</div>
          {streak >= 3 && (
            <div className="text-yellow-300 font-bold text-xs animate-bounce-in">
              🔥 {streak} streak!
            </div>
          )}
        </div>
        <div className="bg-white/20 rounded-xl px-3 py-1.5 text-white font-black text-base">
          ⭐ {score}
        </div>
      </div>

      {/* ── Illustration ───────────────────────────────────────── */}
      <div className="flex flex-col items-center px-6 pt-6 pb-4">
        {/* Big emoji card */}
        <div
          className="flex items-center justify-center rounded-4xl mb-3 shadow-lg"
          style={{
            width: 160,
            height: 160,
            background: target.color + '18',
            border: `3px solid ${target.color}30`,
          }}
        >
          <span style={{ fontSize: 96 }}>{target.emoji}</span>
        </div>

        {/* Language label + speak */}
        <div className="flex items-center gap-2">
          <span
            className="rounded-full px-3 py-1 text-sm font-bold text-white"
            style={{ background: lang === 'de' ? '#22c55e' : lang === 'nl' ? '#3b82f6' : '#ef4444' }}
          >
            {LANG_FLAGS[lang]} {LANG_LABELS[lang]}
          </span>
          <button
            onClick={speakTarget}
            className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-lg active:scale-90 transition-transform"
          >
            🔊
          </button>
        </div>
      </div>

      {/* ── Word choices ───────────────────────────────────────── */}
      <div className="flex flex-col gap-3 px-5 pb-28">
        {choices.map((item) => {
          const isCorrect = item.id === target.id
          const isSelected = selectedId === item.id
          const showGreen = isSelected && state === 'correct'
          const showRed   = isSelected && state === 'wrong'
          // After correct, highlight the right answer green even if not selected
          const isReveal  = state === 'correct' && isCorrect

          return (
            <button
              key={item.id}
              onClick={() => handleChoice(item)}
              className={`w-full rounded-3xl py-4 px-6 text-center font-black text-xl transition-all active:scale-95
                ${showGreen || isReveal ? 'animate-pop' : ''}
                ${showRed              ? 'animate-shake' : ''}
              `}
              style={{
                background: showGreen || isReveal
                  ? '#22c55e'
                  : showRed
                  ? '#ef4444'
                  : 'white',
                color: showGreen || isReveal || showRed ? 'white' : '#1f2937',
                boxShadow: showGreen || isReveal
                  ? '0 4px 20px rgba(34,197,94,0.4)'
                  : showRed
                  ? '0 4px 20px rgba(239,68,68,0.4)'
                  : '0 2px 12px rgba(0,0,0,0.08)',
              }}
            >
              {item[lang]}
              {(showGreen || isReveal) && ' ✅'}
              {showRed && ' ❌'}
            </button>
          )
        })}
      </div>

      {/* ── Sticker modal ──────────────────────────────────────── */}
      {state === 'sticker' && newSticker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
        >
          <div className="modal-panel w-full max-w-xs rounded-4xl bg-white p-8 text-center shadow-2xl">
            <div className="text-9xl mb-4 animate-bounce-in">{newSticker.emoji}</div>
            <div className="text-3xl font-black text-gray-800 mb-1">New Sticker!</div>
            <div className="text-base font-bold text-purple-500 mb-8">{newSticker.name}</div>
            <button
              onClick={nextRound}
              className="w-full rounded-3xl py-4 text-xl font-black text-white active:scale-95 transition-transform"
              style={{ background: 'linear-gradient(135deg,#a855f7,#7c3aed)', boxShadow: '0 6px 24px rgba(168,85,247,0.4)' }}
            >
              Keep Playing! 🎮
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
