'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSettings } from '@/hooks/useSettings'
import { useProgress } from '@/hooks/useProgress'
import { useStreak } from '@/hooks/useStreak'
import vocabulary from '@/data/vocabulary.json'
import type { VocabItem, Language } from '@/types'
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
  const lang = languages[Math.floor(Math.random() * languages.length)]
  const isTrue = Math.random() > 0.5
  const shownWord = isTrue ? target[lang] : all[1][lang]
  return { target, lang, isTrue, shownWord }
}

type RoundState = 'playing' | 'correct' | 'wrong'

export default function TrueFalsePage() {
  const { settings } = useSettings()
  const { addCorrect } = useProgress()
  const { markPlayed } = useStreak()

  const langs = settings.languages.length > 0 ? settings.languages : (['de', 'nl', 'tr'] as Language[])

  const [round, setRound] = useState(() => buildRound(langs))
  const [state, setState] = useState<RoundState>('playing')
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)

  function nextRound() {
    setState('playing')
    setRound(buildRound(langs))
  }

  function handleAnswer(answer: boolean) {
    if (state !== 'playing') return
    const correct = answer === round.isTrue
    if (correct) {
      addCorrect()
      markPlayed()
      setScore(s => s + 1)
      setStreak(s => s + 1)
      setState('correct')
      setTimeout(nextRound, 900)
    } else {
      setStreak(0)
      setState('wrong')
      setTimeout(nextRound, 1300)
    }
  }

  const { target, lang, shownWord } = round

  return (
    <div className="flex flex-col min-h-dvh" style={{ background: '#0F0E1A' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4"
        style={{ background: 'linear-gradient(135deg, #064e3b 0%, #00D4AA 100%)' }}>
        <Link href="/"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white active:opacity-60 transition-opacity"
          style={{ background: 'rgba(255,255,255,0.15)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </Link>
        <div className="text-center">
          <div className="text-white font-black text-base">Wahr oder Falsch?</div>
          {streak >= 3 && <div className="font-bold text-xs animate-bounce-in" style={{ color: '#FEF08A' }}>🔥 {streak}x!</div>}
        </div>
        <div className="flex items-center gap-1.5 rounded-2xl px-3 py-1.5 font-black text-sm text-white"
          style={{ background: 'rgba(255,255,255,0.18)' }}>
          <span style={{ color: '#FEF08A' }}>⭐</span>{score}
        </div>
      </div>

      {/* Game */}
      <div className="flex flex-col items-center px-6 pt-8 pb-28 gap-6">

        {/* Emoji */}
        <div className="flex items-center justify-center rounded-4xl"
          style={{
            width: 180, height: 180,
            background: `${target.color}18`,
            border: `2px solid ${target.color}30`,
            boxShadow: `0 8px 40px ${target.color}25`,
          }}>
          <span style={{ fontSize: 108 }}>{target.emoji}</span>
        </div>

        {/* Question */}
        <div className="text-sm font-bold text-center" style={{ color: 'rgba(196,181,253,0.65)' }}>
          {LANG_FLAGS[lang]} Ist das das richtige Wort?
        </div>

        {/* Word display */}
        <div className="w-full rounded-3xl px-6 py-5 text-center text-4xl font-black transition-all duration-200"
          style={{
            background:
              state === 'correct' ? 'rgba(0,212,170,0.12)' :
              state === 'wrong'   ? 'rgba(239,68,68,0.12)' :
              '#1A1830',
            color:
              state === 'correct' ? '#00D4AA' :
              state === 'wrong'   ? '#F87171' :
              '#ffffff',
            border:
              state === 'correct' ? '1px solid rgba(0,212,170,0.3)' :
              state === 'wrong'   ? '1px solid rgba(239,68,68,0.3)' :
              '1px solid rgba(255,255,255,0.08)',
          }}>
          {shownWord}
        </div>

        {/* Correct answer hint on wrong */}
        {state === 'wrong' && (
          <div className="text-base font-bold animate-fade-up" style={{ color: '#00D4AA' }}>
            ✓ Richtig: {target[lang]}
          </div>
        )}

        {/* Result */}
        {state !== 'playing' && (
          <div className="text-2xl font-black animate-bounce-in"
            style={{ color: state === 'correct' ? '#00D4AA' : '#F87171' }}>
            {state === 'correct' ? '🎉 Richtig!' : '❌ Falsch!'}
          </div>
        )}

        {/* YES / NO buttons */}
        <div className="flex gap-4 w-full mt-auto pt-2">
          <button onClick={() => handleAnswer(false)} disabled={state !== 'playing'}
            className="flex-1 flex flex-col items-center gap-2 rounded-3xl py-7 font-black text-xl transition-all active:scale-95 disabled:opacity-40"
            style={{
              background: 'rgba(239,68,68,0.12)',
              color: '#F87171',
              border: '1.5px solid rgba(239,68,68,0.25)',
              boxShadow: '0 4px 20px rgba(239,68,68,0.12)',
            }}>
            <span className="text-5xl">❌</span>
            No
          </button>
          <button onClick={() => handleAnswer(true)} disabled={state !== 'playing'}
            className="flex-1 flex flex-col items-center gap-2 rounded-3xl py-7 font-black text-xl transition-all active:scale-95 disabled:opacity-40"
            style={{
              background: 'rgba(0,212,170,0.12)',
              color: '#00D4AA',
              border: '1.5px solid rgba(0,212,170,0.25)',
              boxShadow: '0 4px 20px rgba(0,212,170,0.12)',
            }}>
            <span className="text-5xl">✅</span>
            Yes
          </button>
        </div>
      </div>
    </div>
  )
}
