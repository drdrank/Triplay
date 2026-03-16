'use client'

import { useState } from 'react'
import Link from 'next/link'
import Confetti from '@/components/Confetti'
import { useSettings } from '@/hooks/useSettings'
import { useProgress } from '@/hooks/useProgress'
import { speakWord } from '@/lib/speech'
import vocabulary from '@/data/vocabulary.json'
import type { VocabItem, Language } from '@/types'
import { LANG_FLAGS } from '@/types'

interface Card {
  uid: string
  item: VocabItem
  type: 'image' | 'word'
  flipped: boolean
  matched: boolean
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
  { pairs: 4, label: 'Easy',   sub: '4 pairs',  gradient: 'linear-gradient(135deg, #16a34a, #22c55e)', glow: 'rgba(34,197,94,0.3)' },
  { pairs: 6, label: 'Medium', sub: '6 pairs',  gradient: 'linear-gradient(135deg, #d97706, #f59e0b)', glow: 'rgba(245,158,11,0.3)' },
  { pairs: 8, label: 'Hard',   sub: '8 pairs',  gradient: 'linear-gradient(135deg, #dc2626, #ef4444)', glow: 'rgba(239,68,68,0.3)' },
]

export default function MemoryPage() {
  const { settings } = useSettings()
  const { addCorrect } = useProgress()

  const lang = settings.languages[0] ?? 'de'
  const rate = settings.audioSpeed === 'slow' ? 0.6 : 1

  const [difficulty, setDifficulty] = useState<null | number>(null)
  const [deck, setDeck]             = useState<Card[]>([])
  const [selected, setSelected]     = useState<string[]>([])
  const [locked, setLocked]         = useState(false)
  const [moves, setMoves]           = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [won, setWon]               = useState(false)

  function startGame(pairs: number) {
    const items = shuffle(vocabulary as VocabItem[]).slice(0, pairs)
    setDeck(buildDeck(items))
    setSelected([])
    setLocked(false)
    setMoves(0)
    setWon(false)
    setDifficulty(pairs)
  }

  function handleFlip(uid: string) {
    if (locked) return
    if (selected.includes(uid)) return
    const card = deck.find(c => c.uid === uid)
    if (!card || card.matched || card.flipped) return

    const newDeck = deck.map(c => c.uid === uid ? { ...c, flipped: true } : c)
    setDeck(newDeck)
    if (card.type === 'word') speakWord(card.item[lang], lang, rate)

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
        }, 900)
      }
      setSelected([])
    } else {
      setSelected(newSelected)
    }
  }

  const pairs = difficulty ?? 4
  const matched = deck.filter(c => c.matched).length / 2

  // Difficulty picker
  if (difficulty === null) {
    return (
      <div className="flex flex-col min-h-dvh bg-white">
        <div
          className="px-5 pt-12 pb-6"
          style={{ background: 'linear-gradient(145deg, #0c4a6e 0%, #0369a1 50%, #0ea5e9 100%)' }}
        >
          <div className="flex items-center gap-3">
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
          <p className="text-sky-100/70 text-sm mt-1 pl-12">Match the image to the word!</p>
        </div>

        <div className="flex flex-col gap-3 px-5 pt-8 pb-28">
          <p className="text-sm font-bold text-surface-500 mb-1">Choose difficulty</p>

          {DIFFICULTIES.map(({ pairs, label, sub, gradient, glow }) => (
            <button
              key={pairs}
              onClick={() => startGame(pairs)}
              className="rounded-3xl py-5 px-6 text-white active:scale-[0.97] transition-transform flex items-center justify-between"
              style={{ background: gradient, boxShadow: `0 6px 20px ${glow}` }}
            >
              <div className="text-left">
                <div className="font-black text-xl">{label}</div>
                <div className="text-white/65 text-sm font-medium">{sub}</div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          ))}

          <div
            className="mt-2 rounded-2xl p-4 text-center text-sm text-surface-500"
            style={{ background: '#f4f4f5' }}
          >
            Playing in <strong>{LANG_FLAGS[lang]} {lang.toUpperCase()}</strong> · tap a word card to hear it
          </div>
        </div>
      </div>
    )
  }

  // Game board
  return (
    <div className="flex flex-col min-h-dvh bg-white">
      <Confetti active={showConfetti} count={60} />

      {/* Header */}
      <div
        className="flex items-center justify-between px-5 pt-12 pb-4"
        style={{ background: 'linear-gradient(145deg, #0c4a6e 0%, #0369a1 50%, #0ea5e9 100%)' }}
      >
        <button
          onClick={() => setDifficulty(null)}
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

        <div
          className="rounded-2xl px-3 py-1.5 text-white font-bold text-sm"
          style={{ background: 'rgba(255,255,255,0.15)' }}
        >
          {moves} moves
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-surface-100">
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${(matched / pairs) * 100}%`,
            background: 'linear-gradient(to right, #0ea5e9, #0369a1)',
          }}
        />
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-4 gap-2 p-3 flex-1">
        {deck.map((card) => {
          const isFlipped = card.flipped || card.matched
          const isMatched = card.matched

          return (
            <button
              key={card.uid}
              onClick={() => handleFlip(card.uid)}
              className="aspect-square rounded-2xl transition-all active:scale-90 overflow-hidden"
              style={{
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
                <div className="flex flex-col items-center justify-center h-full p-1">
                  {card.type === 'image' ? (
                    <span style={{ fontSize: 34 }}>{card.item.emoji}</span>
                  ) : (
                    <span className="text-[11px] font-black text-surface-700 text-center leading-tight px-1">
                      {card.item[lang]}
                    </span>
                  )}
                  {isMatched && <span className="text-[10px] mt-0.5">✓</span>}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-2xl text-white/50 font-black">?</span>
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
            <div className="text-8xl mb-4 animate-bounce-in">🎉</div>
            <div className="text-2xl font-black text-surface-800 mb-1">You did it!</div>
            <div className="text-sm text-surface-400 mb-2 font-medium">{pairs} pairs · {moves} moves</div>
            <div className="flex gap-2.5 mt-6">
              <button
                onClick={() => startGame(pairs)}
                className="flex-1 rounded-2xl py-3.5 font-black text-white active:scale-95 transition-transform text-sm"
                style={{ background: 'linear-gradient(135deg, #0369a1, #0ea5e9)' }}
              >
                Play Again
              </button>
              <button
                onClick={() => setDifficulty(null)}
                className="flex-1 rounded-2xl py-3.5 font-black text-surface-600 active:scale-95 transition-transform text-sm"
                style={{ background: '#f4f4f5' }}
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
