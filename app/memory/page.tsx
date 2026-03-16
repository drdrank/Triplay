'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Confetti from '@/components/Confetti'
import { useSettings } from '@/hooks/useSettings'
import { useProgress } from '@/hooks/useProgress'
import { speakWord } from '@/lib/speech'
import vocabulary from '@/data/vocabulary.json'
import type { VocabItem, Language } from '@/types'
import { LANG_FLAGS, LANG_LABELS } from '@/types'

interface Card {
  uid: string
  item: VocabItem
  type: 'image' | 'word'
  flipped: boolean
  matched: boolean
}

const LANG_FG: Record<Language, string> = {
  de: '#15803d',
  nl: '#1d4ed8',
  tr: '#b91c1c',
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildDeck(items: VocabItem[]): Card[] {
  const cards: Card[] = []
  items.forEach((item) => {
    cards.push({ uid: item.id + '-img',  item, type: 'image', flipped: false, matched: false })
    cards.push({ uid: item.id + '-word', item, type: 'word',  flipped: false, matched: false })
  })
  return shuffle(cards)
}

const DIFFICULTIES = [
  { pairs: 4,  label: 'Easy',      sub: '4 pairs · 8 cards',   gradient: 'linear-gradient(135deg,#16a34a,#22c55e)', glow: 'rgba(34,197,94,0.3)'   },
  { pairs: 6,  label: 'Medium',    sub: '6 pairs · 12 cards',  gradient: 'linear-gradient(135deg,#d97706,#f59e0b)', glow: 'rgba(245,158,11,0.3)'  },
  { pairs: 8,  label: 'Hard',      sub: '8 pairs · 16 cards',  gradient: 'linear-gradient(135deg,#dc2626,#ef4444)', glow: 'rgba(239,68,68,0.3)'   },
  { pairs: 10, label: 'Expert',    sub: '10 pairs · 20 cards', gradient: 'linear-gradient(135deg,#7c3aed,#a855f7)', glow: 'rgba(168,85,247,0.3)'  },
  { pairs: 12, label: 'Champion',  sub: '12 pairs · 24 cards', gradient: 'linear-gradient(135deg,#0369a1,#0ea5e9)', glow: 'rgba(14,165,233,0.3)'  },
]

function formatTime(s: number) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`
}

export default function MemoryPage() {
  const { settings } = useSettings()
  const { addCorrect } = useProgress()

  const langs = (settings.languages.length > 0 ? settings.languages : ['de', 'nl', 'tr']) as Language[]
  const rate  = settings.audioSpeed === 'slow' ? 0.6 : 1

  const [difficulty, setDifficulty] = useState<null | number>(null)
  const [deck, setDeck]             = useState<Card[]>([])
  const [selected, setSelected]     = useState<string[]>([])
  const [locked, setLocked]         = useState(false)
  const [moves, setMoves]           = useState(0)
  const [timer, setTimer]           = useState(0)
  const [running, setRunning]       = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [won, setWon]               = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [running])

  function startGame(pairs: number) {
    const items = shuffle(vocabulary as VocabItem[]).slice(0, pairs)
    setDeck(buildDeck(items))
    setSelected([])
    setLocked(false)
    setMoves(0)
    setTimer(0)
    setWon(false)
    setRunning(true)
    setDifficulty(pairs)
  }

  async function speakAllLangs(item: VocabItem) {
    for (const lang of langs) {
      await speakWord(item[lang], lang, rate)
      await new Promise(r => setTimeout(r, 300))
    }
  }

  function handleFlip(uid: string) {
    if (locked) return
    if (selected.includes(uid)) return
    const card = deck.find(c => c.uid === uid)
    if (!card || card.matched || card.flipped) return

    const newDeck = deck.map(c => c.uid === uid ? { ...c, flipped: true } : c)
    setDeck(newDeck)

    // Speak all languages when a word card is flipped
    if (card.type === 'word') speakAllLangs(card.item)

    const newSelected = [...selected, uid]

    if (newSelected.length === 2) {
      setLocked(true)
      setMoves(m => m + 1)
      const [a, b] = newSelected.map(id => newDeck.find(c => c.uid === id)!)

      if (a.item.id === b.item.id) {
        const matched = newDeck.map(c =>
          c.uid === a.uid || c.uid === b.uid ? { ...c, matched: true } : c
        )
        setDeck(matched)
        setSelected([])
        setLocked(false)
        addCorrect()
        if (matched.every(c => c.matched)) {
          setShowConfetti(true)
          setRunning(false)
          setTimeout(() => setShowConfetti(false), 100)
          setWon(true)
        }
      } else {
        setTimeout(() => {
          setDeck(d => d.map(c =>
            c.uid === a.uid || c.uid === b.uid ? { ...c, flipped: false } : c
          ))
          setSelected([])
          setLocked(false)
        }, 1100)
      }
      setSelected([])
    } else {
      setSelected(newSelected)
    }
  }

  const pairs   = difficulty ?? 4
  const matched = deck.filter(c => c.matched).length / 2
  // More pairs → more columns
  const cols    = pairs <= 6 ? 3 : 4

  // ── Difficulty picker ───────────────────────────────────────────
  if (difficulty === null) {
    return (
      <div className="flex flex-col min-h-dvh bg-white">
        <div
          className="px-5 pt-12 pb-6"
          style={{ background: 'linear-gradient(145deg, #0c4a6e 0%, #0369a1 50%, #0ea5e9 100%)' }}
        >
          <div className="flex items-center gap-3 mb-1">
            <Link
              href="/"
              className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-white active:opacity-60 transition-opacity"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </Link>
            <h1 className="text-xl font-black text-white">Memory Game</h1>
          </div>
          <p className="text-sky-100/70 text-sm pl-12">Match the emoji to all 3 words!</p>
        </div>

        <div className="flex flex-col gap-3 px-5 pt-6 pb-28">
          <p className="text-xs font-bold text-surface-400 uppercase tracking-wider mb-1">Choose difficulty</p>

          {DIFFICULTIES.map(({ pairs, label, sub, gradient, glow }) => (
            <button
              key={pairs}
              onClick={() => startGame(pairs)}
              className="rounded-3xl py-4 px-5 text-white active:scale-[0.97] transition-transform flex items-center justify-between"
              style={{ background: gradient, boxShadow: `0 6px 20px ${glow}` }}
            >
              <div className="text-left">
                <div className="font-black text-lg">{label}</div>
                <div className="text-white/65 text-sm font-medium">{sub}</div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          ))}

          {/* Languages being used */}
          <div className="mt-1 rounded-2xl p-4 flex flex-col gap-2" style={{ background: '#f4f4f5' }}>
            <p className="text-xs font-bold text-surface-500 text-center">Word cards show all your active languages:</p>
            <div className="flex justify-center gap-3">
              {langs.map(lang => (
                <div key={lang} className="flex items-center gap-1.5 rounded-xl px-3 py-1.5"
                  style={{ background: 'white', border: `1.5px solid ${LANG_FG[lang]}30` }}>
                  <span className="text-base">{LANG_FLAGS[lang]}</span>
                  <span className="text-xs font-bold" style={{ color: LANG_FG[lang] }}>{LANG_LABELS[lang]}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-surface-400 text-center">Tap a word card to hear all languages!</p>
          </div>
        </div>
      </div>
    )
  }

  // ── Game board ──────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-dvh bg-white">
      <Confetti active={showConfetti} count={80} />

      {/* Header */}
      <div
        className="flex items-center justify-between px-5 pt-12 pb-4"
        style={{ background: 'linear-gradient(145deg, #0c4a6e 0%, #0369a1 50%, #0ea5e9 100%)' }}
      >
        <button
          onClick={() => { setRunning(false); setDifficulty(null) }}
          className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-white active:opacity-60 transition-opacity"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>

        <div className="text-center">
          <div className="text-white font-black text-base">Memory</div>
          <div className="text-sky-200 text-xs font-medium">{matched}/{pairs} matched</div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="rounded-xl px-3 py-1 text-white font-bold text-sm" style={{ background: 'rgba(255,255,255,0.15)' }}>
            ⏱ {formatTime(timer)}
          </div>
          <div className="text-sky-200 text-[10px] font-medium">{moves} moves</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5" style={{ background: '#e4e4e7' }}>
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${(matched / pairs) * 100}%`,
            background: 'linear-gradient(to right, #0ea5e9, #0369a1)',
          }}
        />
      </div>

      {/* Card grid */}
      <div
        className="grid gap-2 p-3 flex-1"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {deck.map((card) => {
          const isFlipped = card.flipped || card.matched
          const isMatched = card.matched

          return (
            <button
              key={card.uid}
              onClick={() => handleFlip(card.uid)}
              className="rounded-2xl transition-all active:scale-90 overflow-hidden"
              style={{
                aspectRatio: card.type === 'word' ? '3/4' : '1/1',
                background: isMatched
                  ? '#f0fdf4'
                  : isFlipped
                  ? 'white'
                  : 'linear-gradient(135deg, #0369a1, #0ea5e9)',
                boxShadow: isMatched
                  ? '0 2px 8px rgba(34,197,94,0.2), 0 0 0 1.5px #86efac'
                  : isFlipped
                  ? '0 2px 8px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)'
                  : '0 2px 8px rgba(3,105,161,0.25)',
              }}
            >
              {isFlipped ? (
                card.type === 'image' ? (
                  /* Image card */
                  <div className="flex flex-col items-center justify-center h-full gap-1 p-1">
                    <span style={{ fontSize: pairs <= 6 ? 40 : 30 }}>{card.item.emoji}</span>
                    {isMatched && (
                      <span className="text-xs font-black" style={{ color: '#16a34a' }}>✓</span>
                    )}
                  </div>
                ) : (
                  /* Word card — shows ALL languages */
                  <div className="flex flex-col items-center justify-center h-full gap-1 p-2">
                    {langs.map((lang) => (
                      <div key={lang} className="flex items-center gap-1 w-full justify-center">
                        <span style={{ fontSize: pairs <= 6 ? 13 : 11 }}>{LANG_FLAGS[lang]}</span>
                        <span
                          className="font-black text-center leading-tight"
                          style={{
                            fontSize: pairs <= 6 ? 12 : 10,
                            color: isMatched ? LANG_FG[lang] : LANG_FG[lang],
                          }}
                        >
                          {card.item[lang]}
                        </span>
                      </div>
                    ))}
                    {isMatched && (
                      <span className="text-[10px] font-black mt-0.5" style={{ color: '#16a34a' }}>✓</span>
                    )}
                  </div>
                )
              ) : (
                /* Card back */
                <div className="flex items-center justify-center h-full">
                  <span className="text-white/40 font-black" style={{ fontSize: pairs <= 6 ? 22 : 18 }}>?</span>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Won overlay */}
      {won && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)' }}
        >
          <div
            className="modal-panel w-full max-w-xs rounded-4xl bg-white p-8 text-center"
            style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.25)' }}
          >
            <div className="text-8xl mb-3 animate-bounce-in">🎉</div>
            <div className="text-2xl font-black text-surface-800 mb-4">You did it!</div>

            {/* Stats */}
            <div className="flex gap-3 mb-6">
              <div className="flex-1 rounded-2xl py-3" style={{ background: '#eff6ff' }}>
                <div className="text-xl font-black" style={{ color: '#2563eb' }}>{moves}</div>
                <div className="text-[11px] font-bold text-surface-400 mt-0.5">moves</div>
              </div>
              <div className="flex-1 rounded-2xl py-3" style={{ background: '#f0fdf4' }}>
                <div className="text-xl font-black" style={{ color: '#16a34a' }}>{formatTime(timer)}</div>
                <div className="text-[11px] font-bold text-surface-400 mt-0.5">time</div>
              </div>
              <div className="flex-1 rounded-2xl py-3" style={{ background: '#fdf4ff' }}>
                <div className="text-xl font-black" style={{ color: '#9333ea' }}>{pairs}</div>
                <div className="text-[11px] font-bold text-surface-400 mt-0.5">pairs</div>
              </div>
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={() => startGame(pairs)}
                className="flex-1 rounded-2xl py-3.5 font-black text-white active:scale-95 transition-transform text-sm"
                style={{ background: 'linear-gradient(135deg, #0369a1, #0ea5e9)' }}
              >
                Play Again
              </button>
              <button
                onClick={() => setDifficulty(null)}
                className="flex-1 rounded-2xl py-3.5 font-black active:scale-95 transition-transform text-sm"
                style={{ background: '#f4f4f5', color: '#52525b' }}
              >
                Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
