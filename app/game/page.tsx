'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import Confetti from '@/components/Confetti'
import { useSettings } from '@/hooks/useSettings'
import { useProgress } from '@/hooks/useProgress'
import { speakWord } from '@/lib/speech'
import vocabulary from '@/data/vocabulary.json'
import type { VocabItem, Language, StickerItem } from '@/types'
import { LANG_FLAGS, LANG_LABELS, LANG_COLORS } from '@/types'

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
  const choices = shuffle([target, ...all.slice(1, 4)])
  const lang = languages[Math.floor(Math.random() * languages.length)]
  return { target, choices, lang }
}

const LANG_GRADIENT: Record<Language, string> = {
  de: 'linear-gradient(135deg,#16a34a,#15803d)',
  nl: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
  tr: 'linear-gradient(135deg,#dc2626,#b91c1c)',
}

export default function GamePage() {
  const { settings } = useSettings()
  const { addCorrect } = useProgress()

  const langs = settings.languages.length > 0 ? settings.languages : (['de', 'nl', 'tr'] as Language[])
  const rate = settings.audioSpeed === 'slow' ? 0.6 : 1

  const [round, setRound] = useState(() => buildRound(langs))
  const [state, setState] = useState<GameState>('playing')
  const [wrongId, setWrongId] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [newSticker, setNewSticker] = useState<StickerItem | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)

  const speakTarget = useCallback(() => {
    speakWord(round.target[round.lang], round.lang, rate)
  }, [round, rate])

  useEffect(() => {
    const t = setTimeout(speakTarget, 350)
    return () => { clearTimeout(t); window.speechSynthesis?.cancel() }
  }, [round]) // eslint-disable-line

  function nextRound() {
    setState('playing')
    setWrongId(null)
    setNewSticker(null)
    setRound(buildRound(langs))
  }

  function handleChoice(item: VocabItem) {
    if (state !== 'playing') return

    if (item.id === round.target.id) {
      const { newSticker: sticker } = addCorrect()
      setScore((s) => s + 1)
      setStreak((s) => s + 1)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 80)

      if (sticker) {
        setNewSticker(sticker as StickerItem)
        setState('sticker')
      } else {
        setState('correct')
        setTimeout(nextRound, 1100)
      }
    } else {
      setStreak(0)
      setWrongId(item.id)
      setState('wrong')
      setTimeout(() => { setState('playing'); setWrongId(null) }, 900)
    }
  }

  const { target, choices, lang } = round

  return (
    <div className="flex flex-col min-h-dvh" style={{ background: '#f8f7ff' }}>
      <Confetti active={showConfetti} count={60} />

      {/* ── Header ─────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-5 pt-12 pb-5"
        style={{ background: 'linear-gradient(160deg,#7c3aed,#a855f7)' }}
      >
        <Link href="/" className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-lg active:opacity-60">
          ←
        </Link>
        <div className="text-center">
          <div className="text-white font-black text-lg">Find It!</div>
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

      {/* ── Prompt card ────────────────────────────────────────── */}
      <div className="px-4 -mt-0.5">
        <div
          className="rounded-3xl p-5 text-center shadow-lg"
          style={{
            background: LANG_GRADIENT[lang],
            boxShadow: `0 8px 32px ${lang === 'de' ? 'rgba(22,163,74,0.35)' : lang === 'nl' ? 'rgba(37,99,235,0.35)' : 'rgba(220,38,38,0.35)'}`,
          }}
        >
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-3 text-xs font-bold text-white/80"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            {LANG_FLAGS[lang]} {LANG_LABELS[lang]}
          </div>
          <div className="text-5xl font-black text-white tracking-tight drop-shadow mb-4">
            {target[lang]}
          </div>
          <button
            onClick={speakTarget}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold active:scale-90 transition-transform"
            style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}
          >
            🔊 Hear it
          </button>
        </div>
      </div>

      {/* ── Answer cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 px-4 pt-4 pb-28">
        {choices.map((item) => {
          const isCorrect = state === 'correct' && item.id === target.id
          const isWrong   = wrongId === item.id

          return (
            <button
              key={item.id}
              onClick={() => handleChoice(item)}
              className={`card-press flex flex-col items-center justify-center rounded-3xl bg-white py-6 gap-2 shadow-md
                ${isCorrect ? 'animate-pop' : ''}
                ${isWrong   ? 'animate-shake' : ''}
              `}
              style={{
                borderWidth: 3,
                borderStyle: 'solid',
                borderColor: isCorrect ? '#22c55e' : isWrong ? '#ef4444' : 'transparent',
                backgroundColor: isCorrect ? '#f0fdf4' : isWrong ? '#fef2f2' : 'white',
                boxShadow: isCorrect
                  ? '0 4px 20px rgba(34,197,94,0.25)'
                  : isWrong
                  ? '0 4px 20px rgba(239,68,68,0.25)'
                  : '0 2px 12px rgba(0,0,0,0.08)',
              }}
            >
              <span className="text-6xl leading-none">{item.emoji}</span>
              {/* All 3 languages */}
              <div className="flex flex-col items-center gap-0.5 w-full px-1">
                {langs.map((l) => (
                  <span
                    key={l}
                    className="text-xs font-bold rounded-full px-2 py-0.5 w-full text-center truncate"
                    style={{
                      background: l === lang ? LANG_COLORS[l] + '20' : 'transparent',
                      color: l === lang ? LANG_COLORS[l] : '#6B7280',
                      fontWeight: l === lang ? 800 : 600,
                      fontSize: l === lang ? '15px' : '11px',
                    }}
                  >
                    {LANG_FLAGS[l]} {item[l]}
                  </span>
                ))}
              </div>
              {isCorrect && <span className="text-2xl animate-bounce-in">✅</span>}
              {isWrong   && <span className="text-2xl animate-bounce-in">❌</span>}
            </button>
          )
        })}
      </div>

      {/* ── Feedback message ───────────────────────────────────── */}
      {state === 'correct' && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 animate-bounce-in z-30">
          <div className="rounded-full px-6 py-3 shadow-lg text-white font-black text-lg"
            style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)' }}>
            {streak > 1 ? `🔥 ${streak}× streak!` : '⭐ Great job!'}
          </div>
        </div>
      )}
      {state === 'wrong' && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 animate-bounce-in z-30">
          <div className="rounded-full px-6 py-3 shadow-lg text-white font-black text-lg"
            style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}>
            💪 Try again!
          </div>
        </div>
      )}

      {/* ── New sticker modal ──────────────────────────────────── */}
      {state === 'sticker' && newSticker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
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
