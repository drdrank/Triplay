'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Confetti from '@/components/Confetti'
import { useSettings } from '@/hooks/useSettings'
import { useProgress } from '@/hooks/useProgress'
import { speakWord } from '@/lib/speech'
import vocabulary from '@/data/vocabulary.json'
import type { VocabItem, Language } from '@/types'
import { LANG_FLAGS } from '@/types'

interface Card {
  uid: string       // unique per card instance
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

function buildDeck(items: VocabItem[], lang: Language): Card[] {
  const cards: Card[] = []
  items.forEach((item) => {
    cards.push({ uid: item.id + '-img',  item, type: 'image', flipped: false, matched: false })
    cards.push({ uid: item.id + '-word', item, type: 'word',  flipped: false, matched: false })
  })
  return shuffle(cards)
}

const GRID_SIZES = [
  { pairs: 4,  label: 'Easy',   cols: 4 },
  { pairs: 6,  label: 'Medium', cols: 4 },
  { pairs: 8,  label: 'Hard',   cols: 4 },
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
    setDeck(buildDeck(items, lang))
    setSelected([])
    setLocked(false)
    setMoves(0)
    setWon(false)
    setDifficulty(pairs)
  }

  // Speak word when a word-card is flipped
  function speakCard(card: Card) {
    if (card.type === 'word') {
      speakWord(card.item[lang], lang, rate)
    }
  }

  function handleFlip(uid: string) {
    if (locked) return
    if (selected.includes(uid)) return

    const card = deck.find(c => c.uid === uid)
    if (!card || card.matched || card.flipped) return

    // Flip it
    const newDeck = deck.map(c => c.uid === uid ? { ...c, flipped: true } : c)
    setDeck(newDeck)
    speakCard(card)

    const newSelected = [...selected, uid]

    if (newSelected.length === 2) {
      setLocked(true)
      setMoves(m => m + 1)

      const [a, b] = newSelected.map(id => newDeck.find(c => c.uid === id)!)

      if (a.item.id === b.item.id) {
        // Match!
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
        // No match — flip back after delay
        setTimeout(() => {
          setDeck(d => d.map(c =>
            c.uid === a.uid || c.uid === b.uid ? { ...c, flipped: false } : c
          ))
          setSelected([])
          setLocked(false)
        }, 1000)
      }
      if (newSelected.length < 2) setSelected(newSelected)
      else setSelected([])
    } else {
      setSelected(newSelected)
    }
  }

  const pairs = difficulty ?? 4
  const matched = deck.filter(c => c.matched).length / 2

  // ── Difficulty picker ──────────────────────────────────────────
  if (difficulty === null) {
    return (
      <div className="flex flex-col min-h-dvh" style={{ background: '#f8f7ff' }}>
        <div className="px-5 pt-12 pb-6"
          style={{ background: 'linear-gradient(160deg,#0891b2,#06b6d4)' }}>
          <div className="flex items-center gap-3">
            <Link href="/" className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-lg active:opacity-60">←</Link>
            <h1 className="text-xl font-black text-white">Memory Game</h1>
          </div>
          <p className="text-white/70 text-sm mt-1 pl-12">Match the image to the word!</p>
        </div>

        <div className="flex flex-col gap-4 px-5 pt-10">
          <p className="text-center text-gray-500 font-bold mb-2">Choose difficulty</p>
          {GRID_SIZES.map(({ pairs, label }) => (
            <button
              key={pairs}
              onClick={() => startGame(pairs)}
              className="rounded-3xl py-5 text-white font-black text-xl active:scale-95 transition-transform"
              style={{
                background: pairs === 4
                  ? 'linear-gradient(135deg,#22c55e,#16a34a)'
                  : pairs === 6
                  ? 'linear-gradient(135deg,#f97316,#ea580c)'
                  : 'linear-gradient(135deg,#ef4444,#dc2626)',
                boxShadow: pairs === 4
                  ? '0 6px 20px rgba(34,197,94,0.35)'
                  : pairs === 6
                  ? '0 6px 20px rgba(249,115,22,0.35)'
                  : '0 6px 20px rgba(239,68,68,0.35)',
              }}
            >
              {label} — {pairs} pairs
            </button>
          ))}

          <div className="mt-4 rounded-3xl bg-white p-4 shadow-md text-center">
            <p className="text-sm text-gray-500">
              Playing in <strong>{LANG_FLAGS[lang]} {lang.toUpperCase()}</strong> · tap a word card to hear it!
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ── Game board ─────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-dvh" style={{ background: '#f8f7ff' }}>
      <Confetti active={showConfetti} count={60} />

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4"
        style={{ background: 'linear-gradient(160deg,#0891b2,#06b6d4)' }}>
        <button onClick={() => setDifficulty(null)}
          className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-lg active:opacity-60">←</button>
        <div className="text-center">
          <div className="text-white font-black">Memory</div>
          <div className="text-white/70 text-xs">{matched}/{pairs} matched</div>
        </div>
        <div className="bg-white/20 rounded-xl px-3 py-1.5 text-white font-black text-sm">
          {moves} moves
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-100">
        <div className="h-full transition-all duration-500"
          style={{ width: `${(matched / pairs) * 100}%`, background: 'linear-gradient(to right,#06b6d4,#0891b2)' }} />
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-4 gap-2 p-3 flex-1">
        {deck.map((card) => {
          const isFlipped  = card.flipped || card.matched
          const isMatched  = card.matched

          return (
            <button
              key={card.uid}
              onClick={() => handleFlip(card.uid)}
              className="aspect-square rounded-2xl transition-all active:scale-90 relative overflow-hidden"
              style={{
                background: isMatched
                  ? '#f0fdf4'
                  : isFlipped
                  ? 'white'
                  : 'linear-gradient(135deg,#0891b2,#06b6d4)',
                boxShadow: isMatched
                  ? '0 2px 8px rgba(34,197,94,0.25)'
                  : isFlipped
                  ? '0 2px 12px rgba(0,0,0,0.1)'
                  : '0 2px 8px rgba(8,145,178,0.3)',
                border: isMatched ? '2px solid #86efac' : '2px solid transparent',
                transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(0deg)',
              }}
            >
              {isFlipped ? (
                <div className="flex flex-col items-center justify-center h-full p-1 gap-0.5">
                  {card.type === 'image' ? (
                    <span style={{ fontSize: 36 }}>{card.item.emoji}</span>
                  ) : (
                    <span className="text-xs font-black text-gray-700 text-center leading-tight px-1">
                      {card.item[lang]}
                    </span>
                  )}
                  {isMatched && <span className="text-xs">✅</span>}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-2xl opacity-60">?</span>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Won overlay */}
      {won && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
          <div className="modal-panel w-full max-w-xs rounded-4xl bg-white p-8 text-center shadow-2xl">
            <div className="text-8xl mb-4 animate-bounce-in">🎉</div>
            <div className="text-3xl font-black text-gray-800 mb-1">You did it!</div>
            <div className="text-base text-gray-500 mb-2">{pairs} pairs in {moves} moves</div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => startGame(pairs)}
                className="flex-1 rounded-3xl py-4 font-black text-white active:scale-95 transition-transform text-base"
                style={{ background: 'linear-gradient(135deg,#06b6d4,#0891b2)' }}>
                Play Again
              </button>
              <button onClick={() => setDifficulty(null)}
                className="flex-1 rounded-3xl py-4 font-black bg-gray-100 text-gray-600 active:scale-95 transition-transform text-base">
                Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
