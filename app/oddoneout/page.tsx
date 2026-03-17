'use client'

import { useState } from 'react'
import Link from 'next/link'
import Confetti from '@/components/Confetti'
import { useSettings } from '@/hooks/useSettings'
import { useProgress } from '@/hooks/useProgress'
import { useStreak } from '@/hooks/useStreak'
import vocabulary from '@/data/vocabulary.json'
import type { VocabItem, StickerItem } from '@/types'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Categories that have enough words (≥ 4 unique emojis)
const ELIGIBLE_CATS = [
  'animals','food','clothes','family','feelings','transport','places',
  'school','sports','music','weather','toys','space','ocean','garden',
  'jobs','farm','house','insects','nature','objects','fantasy','party','beach',
]

function buildRound() {
  const vocab = vocabulary as VocabItem[]

  // Pick a main category with ≥ 3 unique-emoji items
  const shuffledCats = shuffle(ELIGIBLE_CATS)
  let mainCat = shuffledCats[0]
  let mainItems: VocabItem[] = []

  for (const cat of shuffledCats) {
    const items = vocab.filter(v => v.category === cat)
    // dedupe by emoji within the set
    const seen = new Set<string>()
    const unique = items.filter(v => { if (seen.has(v.emoji)) return false; seen.add(v.emoji); return true })
    if (unique.length >= 3) {
      mainCat = cat
      mainItems = unique
      break
    }
  }

  const three = shuffle(mainItems).slice(0, 3)
  const usedEmojis = new Set(three.map(v => v.emoji))

  // Pick the odd one from a different category, unique emoji
  const otherItems = vocab.filter(v => v.category !== mainCat && !usedEmojis.has(v.emoji))
  const oddOne = shuffle(otherItems)[0]

  const cards = shuffle([...three, oddOne])
  return { cards, oddId: oddOne.id, mainCat }
}

type RoundState = 'playing' | 'correct' | 'wrong' | 'sticker'

// Friendly category display names
const CAT_LABELS: Record<string, string> = {
  animals: 'Animals 🐾', food: 'Food 🍽️', clothes: 'Clothes 👕', family: 'Family 👨‍👩‍👧',
  feelings: 'Feelings 😊', transport: 'Transport 🚗', places: 'Places 🏠', school: 'School 🎒',
  sports: 'Sports ⚽', music: 'Music 🎵', weather: 'Weather ⛅', toys: 'Toys 🪁',
  space: 'Space 🚀', ocean: 'Ocean 🌊', garden: 'Garden 🌱', jobs: 'Jobs 👷',
  farm: 'Farm 🌾', house: 'House 🏠', insects: 'Bugs 🐛', nature: 'Nature 🌿',
  objects: 'Objects 📦', fantasy: 'Fantasy 🦄', party: 'Party 🎉', beach: 'Beach 🏖️',
}

export default function OddOneOutPage() {
  const { addCorrect } = useProgress()
  const { markPlayed } = useStreak()
  const { settings } = useSettings()

  const [round, setRound] = useState(() => buildRound())
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
    setRound(buildRound())
  }

  function handleChoice(item: VocabItem) {
    if (state !== 'playing') return
    setSelectedId(item.id)

    if (item.id === round.oddId) {
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
        setTimeout(nextRound, 1100)
      }
    } else {
      setStreak(0)
      setState('wrong')
      setTimeout(() => { setState('playing'); setSelectedId(null) }, 1100)
    }
  }

  const { cards, oddId, mainCat } = round
  const langs = settings.languages.length > 0 ? settings.languages : (['de', 'nl', 'tr'] as const)

  // Find the odd item for the "reveal" hint
  const oddItem = cards.find(c => c.id === oddId)!

  return (
    <div className="flex flex-col min-h-dvh" style={{ background: '#0F0E1A' }}>
      <Confetti active={showConfetti} count={60} />

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4"
        style={{ background: 'linear-gradient(135deg, #0c4a6e 0%, #7C3AED 100%)' }}>
        <Link href="/"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white active:opacity-60 transition-opacity"
          style={{ background: 'rgba(255,255,255,0.15)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </Link>
        <div className="text-center">
          <div className="text-white font-black text-base">Odd One Out!</div>
          {streak >= 3 && <div className="font-bold text-xs animate-bounce-in" style={{ color: '#FEF08A' }}>🔥 {streak} in a row!</div>}
        </div>
        <div className="flex items-center gap-1.5 rounded-2xl px-3 py-1.5 font-black text-sm text-white"
          style={{ background: 'rgba(255,255,255,0.18)' }}>
          <span style={{ color: '#FEF08A' }}>⭐</span>{score}
        </div>
      </div>

      {/* Category hint */}
      <div className="flex flex-col items-center px-6 pt-7 pb-4">
        <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: 'rgba(196,181,253,0.6)' }}>
          Which one doesn&apos;t belong?
        </p>
        <div className="rounded-2xl px-5 py-2.5 mb-1"
          style={{ background: 'rgba(124,58,237,0.15)', border: '1.5px solid rgba(124,58,237,0.35)' }}>
          <span className="font-black text-base" style={{ color: '#A78BFA' }}>
            {CAT_LABELS[mainCat] ?? mainCat} — find the odd one!
          </span>
        </div>
      </div>

      {/* 2×2 grid */}
      <div className="px-5 pb-28 grid grid-cols-2 gap-3">
        {cards.map((item) => {
          const isSelected = selectedId === item.id
          const isOdd = item.id === oddId
          const showGreen = isSelected && state === 'correct'
          const showGreenReveal = state === 'correct' && isOdd
          const showRed = isSelected && state === 'wrong'
          const dimWrong = state === 'correct' && !isOdd

          return (
            <button key={item.id} onClick={() => handleChoice(item)}
              className={`rounded-3xl flex flex-col items-center justify-center gap-2 transition-all active:scale-95 ${showGreen || showGreenReveal ? 'animate-pop' : ''} ${showRed ? 'animate-shake' : ''}`}
              style={{
                height: 140,
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
                opacity: dimWrong ? 0.35 : 1,
              }}>
              <span style={{ fontSize: 62 }}>{item.emoji}</span>
              {(showGreen || showGreenReveal) && (
                <span className="text-white text-xs font-black px-2 text-center leading-tight">
                  {item[langs[0]]}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Wrong answer hint — show correct word */}
      {state === 'wrong' && (
        <div className="fixed bottom-32 left-0 right-0 flex justify-center px-6 pointer-events-none">
          <div className="rounded-2xl px-5 py-3 text-center animate-bounce-in"
            style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.35)' }}>
            <p className="text-sm font-black" style={{ color: '#F87171' }}>
              ❌ Nope! The odd one was {oddItem.emoji} — {oddItem[langs[0]]}
            </p>
          </div>
        </div>
      )}

      {/* Sticker modal */}
      {state === 'sticker' && newSticker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)' }}>
          <div className="modal-panel w-full max-w-xs rounded-4xl p-8 text-center"
            style={{ background: '#1A1830', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}>
            <div className="text-9xl mb-4 animate-bounce-in">{newSticker.emoji}</div>
            <div className="text-2xl font-black text-white mb-1">New Sticker!</div>
            <div className="text-base font-bold mb-8" style={{ color: '#A78BFA' }}>{newSticker.name}</div>
            <button onClick={nextRound}
              className="w-full rounded-2xl py-4 text-lg font-black text-white active:scale-95 transition-transform"
              style={{ background: 'linear-gradient(135deg, #0c4a6e, #7C3AED)', boxShadow: '0 6px 24px rgba(124,58,237,0.45)' }}>
              Keep Playing →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
