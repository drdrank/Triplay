'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import Confetti from '@/components/Confetti'
import { useSettings } from '@/hooks/useSettings'
import { useProgress } from '@/hooks/useProgress'
import { useStreak } from '@/hooks/useStreak'
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
  const decoys = all.slice(1, 5) // 4 decoys → 5 total emojis
  const lang = languages[Math.floor(Math.random() * languages.length)]
  const choices = shuffle([target, ...decoys])
  return { target, choices, lang }
}

const LANG_COLOR: Record<Language, string> = {
  de: '#16a34a',
  nl: '#2563eb',
  tr: '#dc2626',
}

export default function ListenPage() {
  const { settings } = useSettings()
  const { addCorrect } = useProgress()
  const { markPlayed } = useStreak()

  const langs = settings.languages.length > 0 ? settings.languages : (['de', 'nl', 'tr'] as Language[])
  const rate  = settings.audioSpeed === 'slow' ? 0.6 : 1

  const [round, setRound]               = useState(() => buildRound(langs))
  const [state, setState]               = useState<GameState>('playing')
  const [selectedId, setSelectedId]     = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [newSticker, setNewSticker]     = useState<StickerItem | null>(null)
  const [score, setScore]               = useState(0)
  const [streak, setStreak]             = useState(0)
  const [revealed, setRevealed]         = useState(false)

  const speakTarget = useCallback(() => {
    speakWord(round.target[round.lang], round.lang, rate)
  }, [round, rate])

  useEffect(() => {
    setRevealed(false)
    const t = setTimeout(speakTarget, 400)
    return () => { clearTimeout(t); window.speechSynthesis?.cancel() }
  }, [round]) // eslint-disable-line

  function nextRound() {
    setState('playing')
    setSelectedId(null)
    setNewSticker(null)
    setRevealed(false)
    setRound(buildRound(langs))
  }

  function handleChoice(item: VocabItem) {
    if (state !== 'playing') return
    setSelectedId(item.id)
    setRevealed(true)

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
        setTimeout(nextRound, 1000)
      }
    } else {
      setStreak(0)
      setState('wrong')
      setTimeout(() => {
        setState('playing')
        setSelectedId(null)
        setRevealed(false)
      }, 1000)
    }
  }

  const { target, choices, lang } = round

  return (
    <div className="flex flex-col min-h-dvh bg-white">
      <Confetti active={showConfetti} count={60} />

      {/* Header */}
      <div
        className="flex items-center justify-between px-5 pt-12 pb-4"
        style={{ background: 'linear-gradient(145deg, #0c4a6e 0%, #0369a1 50%, #0ea5e9 100%)' }}
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
          <div className="text-white font-black text-base">Listen &amp; Find!</div>
          {streak >= 3 && (
            <div className="text-amber-300 font-bold text-xs animate-bounce-in">
              🔥 {streak} streak!
            </div>
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

      {/* Audio cue card */}
      <div className="flex flex-col items-center px-6 pt-7 pb-5">
        <p className="text-surface-400 text-sm font-semibold mb-4">
          Which emoji matches the word you hear?
        </p>

        {/* The spoken word — revealed after answer */}
        <div
          className="flex flex-col items-center justify-center rounded-4xl mb-4 w-44"
          style={{
            height: 120,
            background: revealed ? `${LANG_COLOR[lang]}12` : 'linear-gradient(135deg, #0369a1, #0ea5e9)',
            border: revealed ? `2px solid ${LANG_COLOR[lang]}25` : 'none',
            boxShadow: revealed ? `0 4px 20px ${LANG_COLOR[lang]}18` : '0 8px 32px rgba(3,105,161,0.3)',
            transition: 'all 0.35s ease',
          }}
        >
          {revealed ? (
            <div className="flex flex-col items-center gap-1">
              <span className="text-4xl font-black" style={{ color: LANG_COLOR[lang] }}>
                {target[lang]}
              </span>
              <div className="flex items-center gap-1">
                <span className="text-base">{LANG_FLAGS[lang]}</span>
                <span className="text-xs font-bold" style={{ color: LANG_COLOR[lang] }}>
                  {LANG_LABELS[lang]}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M15.54 8.46a5 5 0 010 7.07"/>
                <path d="M19.07 4.93a10 10 0 010 14.14"/>
              </svg>
              <span className="text-white/70 text-xs font-bold uppercase tracking-wider">
                {LANG_FLAGS[lang]} {LANG_LABELS[lang]}
              </span>
            </div>
          )}
        </div>

        {/* Replay button */}
        <button
          onClick={speakTarget}
          className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold active:scale-95 transition-all"
          style={{
            background: '#eff6ff',
            color: '#2563eb',
            border: '1.5px solid #bfdbfe',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
          </svg>
          Hear it again
        </button>
      </div>

      {/* Emoji choices — 2×3 grid */}
      <div className="grid grid-cols-3 gap-3 px-5 pb-28">
        {choices.map((item) => {
          const isCorrect  = item.id === target.id
          const isSelected = selectedId === item.id
          const showGreen  = revealed && isCorrect
          const showRed    = isSelected && state === 'wrong'

          return (
            <button
              key={item.id}
              onClick={() => handleChoice(item)}
              className={`aspect-square rounded-3xl flex flex-col items-center justify-center gap-1.5 transition-all active:scale-90
                ${showGreen ? 'animate-pop' : ''}
                ${showRed   ? 'animate-shake' : ''}
              `}
              style={{
                background: showGreen
                  ? 'linear-gradient(135deg, #16a34a, #22c55e)'
                  : showRed
                  ? 'linear-gradient(135deg, #dc2626, #ef4444)'
                  : '#f4f4f5',
                boxShadow: showGreen
                  ? '0 4px 16px rgba(34,197,94,0.4)'
                  : showRed
                  ? '0 4px 16px rgba(239,68,68,0.35)'
                  : 'none',
              }}
            >
              <span style={{ fontSize: 44 }}>{item.emoji}</span>
              {showGreen && <span className="text-white text-sm font-black">{item[lang]}</span>}
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
            <div className="text-base font-bold mb-8" style={{ color: '#0ea5e9' }}>{newSticker.name}</div>
            <button
              onClick={nextRound}
              className="w-full rounded-2xl py-4 text-lg font-black text-white active:scale-95 transition-transform"
              style={{
                background: 'linear-gradient(135deg, #0369a1, #0ea5e9)',
                boxShadow: '0 6px 20px rgba(3,105,161,0.35)',
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
