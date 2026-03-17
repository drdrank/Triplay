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
  const wrong = all.slice(1, 4)
  const lang = languages[Math.floor(Math.random() * languages.length)]
  const choices = shuffle([target, ...wrong])
  return { target, choices, lang }
}

const LANG_COLOR: Record<Language, string> = {
  de: '#4ADE80',
  nl: '#60A5FA',
  tr: '#F87171',
}

export default function GamePage() {
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
      }, 800)
    }
  }

  const { target, choices, lang } = round

  return (
    <div className="flex flex-col min-h-dvh" style={{ background: '#0F0E1A' }}>
      <Confetti active={showConfetti} count={60} />

      {/* Header */}
      <div
        className="flex items-center justify-between px-5 pt-12 pb-4"
        style={{ background: 'linear-gradient(135deg, #C2410C 0%, #FF6B35 100%)' }}
      >
        <Link
          href="/"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white active:opacity-60 transition-opacity"
          style={{ background: 'rgba(255,255,255,0.15)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </Link>

        <div className="text-center">
          <div className="text-white font-black text-base">Finde das Wort!</div>
          {streak >= 3 && (
            <div className="font-bold text-xs animate-bounce-in" style={{ color: '#FEF08A' }}>
              🔥 {streak}x!
            </div>
          )}
        </div>

        <div
          className="flex items-center gap-1.5 rounded-2xl px-3 py-1.5 text-white font-black text-sm"
          style={{ background: 'rgba(255,255,255,0.18)' }}
        >
          <span style={{ color: '#FEF08A' }}>⭐</span>
          {score}
        </div>
      </div>

      {/* Emoji card */}
      <div className="flex flex-col items-center px-6 pt-7 pb-5">
        <div
          className="flex items-center justify-center rounded-4xl mb-4"
          style={{
            width: 164,
            height: 164,
            background: `${target.color}18`,
            border: `2px solid ${target.color}30`,
            boxShadow: `0 8px 40px ${target.color}25`,
          }}
        >
          <span style={{ fontSize: 100 }}>{target.emoji}</span>
        </div>

        {/* Language badge + speak */}
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5"
            style={{
              background: `${LANG_COLOR[lang]}15`,
              border: `1.5px solid ${LANG_COLOR[lang]}35`,
            }}
          >
            <span className="text-base">{LANG_FLAGS[lang]}</span>
            <span className="text-sm font-bold" style={{ color: LANG_COLOR[lang] }}>
              {LANG_LABELS[lang]}
            </span>
          </div>
          <button
            onClick={speakTarget}
            className="w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-transform"
            style={{
              background: '#1A1830',
              border: '1px solid rgba(255,255,255,0.10)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5C4AE4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M15.54 8.46a5 5 0 010 7.07"/>
              <path d="M19.07 4.93a10 10 0 010 14.14"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Choices */}
      <div className="flex flex-col gap-2.5 px-5 pb-28">
        {choices.map((item) => {
          const isCorrect  = item.id === target.id
          const isSelected = selectedId === item.id
          const showGreen  = (isSelected && state === 'correct') || (state === 'correct' && isCorrect)
          const showRed    = isSelected && state === 'wrong'

          return (
            <button
              key={item.id}
              onClick={() => handleChoice(item)}
              className={`w-full rounded-2xl py-4 px-5 text-left font-black text-lg transition-all active:scale-[0.97]
                ${showGreen ? 'animate-pop' : ''}
                ${showRed   ? 'animate-shake' : ''}
              `}
              style={{
                background: showGreen
                  ? 'linear-gradient(135deg, #16a34a, #00D4AA)'
                  : showRed
                  ? 'linear-gradient(135deg, #dc2626, #ef4444)'
                  : '#1A1830',
                color: showGreen || showRed ? 'white' : '#ffffff',
                border: showGreen
                  ? 'none'
                  : showRed
                  ? 'none'
                  : '1px solid rgba(255,255,255,0.08)',
                boxShadow: showGreen
                  ? '0 4px 20px rgba(0,212,170,0.4)'
                  : showRed
                  ? '0 4px 20px rgba(239,68,68,0.4)'
                  : '0 2px 8px rgba(0,0,0,0.2)',
              }}
            >
              <div className="flex items-center justify-between">
                <span>{item[lang]}</span>
                {showGreen && <span className="text-xl">✓</span>}
                {showRed   && <span className="text-xl">✗</span>}
              </div>
            </button>
          )
        })}
      </div>

      {/* Sticker modal */}
      {state === 'sticker' && newSticker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)' }}
        >
          <div
            className="modal-panel w-full max-w-xs rounded-4xl p-8 text-center"
            style={{
              background: '#1A1830',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
            }}
          >
            <div className="text-9xl mb-4 animate-bounce-in">{newSticker.emoji}</div>
            <div className="text-2xl font-black text-white mb-1">Neuer Sticker!</div>
            <div className="text-base font-bold mb-8" style={{ color: '#00D4AA' }}>{newSticker.name}</div>
            <button
              onClick={nextRound}
              className="w-full rounded-2xl py-4 text-lg font-black text-white active:scale-95 transition-transform"
              style={{
                background: 'linear-gradient(135deg, #FF6B35, #DC2626)',
                boxShadow: '0 6px 24px rgba(255,107,53,0.45)',
              }}
            >
              Weiter spielen →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
