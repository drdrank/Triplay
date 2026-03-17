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
  de: '#4ADE80',
  nl: '#60A5FA',
  tr: '#F87171',
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
  { pairs: 4,  label: 'Leicht',    sub: '4 Paare · 8 Karten',   gradient: 'linear-gradient(135deg,#16a34a,#00D4AA)', glow: 'rgba(0,212,170,0.35)'  },
  { pairs: 6,  label: 'Mittel',    sub: '6 Paare · 12 Karten',  gradient: 'linear-gradient(135deg,#FF6B35,#F59E0B)', glow: 'rgba(255,107,53,0.35)' },
  { pairs: 8,  label: 'Schwer',    sub: '8 Paare · 16 Karten',  gradient: 'linear-gradient(135deg,#DC2626,#EF4444)', glow: 'rgba(239,68,68,0.35)'  },
  { pairs: 10, label: 'Experte',   sub: '10 Paare · 20 Karten', gradient: 'linear-gradient(135deg,#5C4AE4,#8B5CF6)', glow: 'rgba(92,74,228,0.35)'  },
  { pairs: 12, label: 'Champion',  sub: '12 Paare · 24 Karten', gradient: 'linear-gradient(135deg,#EC4899,#BE185D)', glow: 'rgba(236,72,153,0.35)' },
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
  const cols    = pairs <= 6 ? 3 : 4

  // ── Difficulty picker ───────────────────────────────────────────
  if (difficulty === null) {
    return (
      <div className="flex flex-col min-h-dvh" style={{ background: '#0F0E1A' }}>
        <div className="px-5 pt-12 pb-6"
          style={{ background: 'linear-gradient(135deg, #1e0a3c 0%, #5C4AE4 100%)' }}>
          <div className="flex items-center gap-3 mb-1">
            <Link href="/"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white active:opacity-60 transition-opacity"
              style={{ background: 'rgba(255,255,255,0.15)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </Link>
            <h1 className="text-xl font-black text-white">Memory Spiel</h1>
          </div>
          <p className="text-sm pl-12" style={{ color: 'rgba(196,181,253,0.7)' }}>Ordne das Emoji dem Wort zu!</p>
        </div>

        <div className="flex flex-col gap-3 px-5 pt-6 pb-28">
          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(196,181,253,0.45)' }}>
            Schwierigkeit wählen
          </p>

          {DIFFICULTIES.map(({ pairs, label, sub, gradient, glow }) => (
            <button key={pairs} onClick={() => startGame(pairs)}
              className="rounded-3xl py-4 px-5 text-white active:scale-[0.97] transition-transform flex items-center justify-between"
              style={{ background: gradient, boxShadow: `0 6px 24px ${glow}` }}>
              <div className="text-left">
                <div className="font-black text-lg">{label}</div>
                <div className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.65)' }}>{sub}</div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          ))}

          {/* Languages preview */}
          <div className="mt-1 rounded-2xl p-4 flex flex-col gap-2"
            style={{ background: '#1A1830', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-xs font-bold text-center" style={{ color: 'rgba(196,181,253,0.6)' }}>
              Wortkarten zeigen alle aktiven Sprachen:
            </p>
            <div className="flex justify-center gap-3">
              {langs.map(lang => (
                <div key={lang} className="flex items-center gap-1.5 rounded-xl px-3 py-1.5"
                  style={{ background: `${LANG_FG[lang]}12`, border: `1.5px solid ${LANG_FG[lang]}30` }}>
                  <span className="text-base">{LANG_FLAGS[lang]}</span>
                  <span className="text-xs font-bold" style={{ color: LANG_FG[lang] }}>{LANG_LABELS[lang]}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-center" style={{ color: 'rgba(196,181,253,0.4)' }}>Tippe eine Wortkarte um alle Sprachen zu hören!</p>
          </div>
        </div>
      </div>
    )
  }

  // ── Game board ──────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-dvh" style={{ background: '#0F0E1A' }}>
      <Confetti active={showConfetti} count={80} />

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4"
        style={{ background: 'linear-gradient(135deg, #1e0a3c 0%, #5C4AE4 100%)' }}>
        <button onClick={() => { setRunning(false); setDifficulty(null) }}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white active:opacity-60 transition-opacity"
          style={{ background: 'rgba(255,255,255,0.15)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <div className="text-center">
          <div className="text-white font-black text-base">Memory</div>
          <div className="text-xs font-medium" style={{ color: 'rgba(196,181,253,0.7)' }}>{matched}/{pairs} gefunden</div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="rounded-xl px-3 py-1 text-white font-bold text-sm"
            style={{ background: 'rgba(255,255,255,0.15)' }}>
            ⏱ {formatTime(timer)}
          </div>
          <div className="text-[10px] font-medium" style={{ color: 'rgba(196,181,253,0.6)' }}>{moves} Züge</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div className="h-full transition-all duration-500"
          style={{ width: `${(matched / pairs) * 100}%`, background: 'linear-gradient(to right, #5C4AE4, #00D4AA)' }} />
      </div>

      {/* Card grid */}
      <div className="grid gap-2 p-3 flex-1"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {deck.map((card) => {
          const isFlipped = card.flipped || card.matched
          const isMatched = card.matched
          return (
            <button key={card.uid} onClick={() => handleFlip(card.uid)}
              className="rounded-2xl transition-all active:scale-90 overflow-hidden"
              style={{
                aspectRatio: card.type === 'word' ? '3/4' : '1/1',
                background: isMatched
                  ? 'rgba(0,212,170,0.12)'
                  : isFlipped
                  ? '#1A1830'
                  : 'linear-gradient(135deg, #2D1B69, #5C4AE4)',
                boxShadow: isMatched
                  ? '0 2px 12px rgba(0,212,170,0.2), 0 0 0 1.5px rgba(0,212,170,0.4)'
                  : isFlipped
                  ? '0 2px 8px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.08)'
                  : '0 2px 12px rgba(92,74,228,0.3)',
              }}>
              {isFlipped ? (
                card.type === 'image' ? (
                  <div className="flex flex-col items-center justify-center h-full gap-1 p-1">
                    <span style={{ fontSize: pairs <= 6 ? 40 : 30 }}>{card.item.emoji}</span>
                    {isMatched && <span className="text-xs font-black" style={{ color: '#00D4AA' }}>✓</span>}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-1 p-2">
                    {langs.map((lang) => (
                      <div key={lang} className="flex items-center gap-1 w-full justify-center">
                        <span style={{ fontSize: pairs <= 6 ? 13 : 11 }}>{LANG_FLAGS[lang]}</span>
                        <span className="font-black text-center leading-tight"
                          style={{ fontSize: pairs <= 6 ? 12 : 10, color: LANG_FG[lang] }}>
                          {card.item[lang]}
                        </span>
                      </div>
                    ))}
                    {isMatched && <span className="text-[10px] font-black mt-0.5" style={{ color: '#00D4AA' }}>✓</span>}
                  </div>
                )
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="font-black" style={{ fontSize: pairs <= 6 ? 22 : 18, color: 'rgba(255,255,255,0.25)' }}>?</span>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Won overlay */}
      {won && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)' }}>
          <div className="modal-panel w-full max-w-xs rounded-4xl p-8 text-center"
            style={{ background: '#1A1830', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}>
            <div className="text-8xl mb-3 animate-bounce-in">🎉</div>
            <div className="text-2xl font-black text-white mb-4">Geschafft!</div>
            <div className="flex gap-3 mb-6">
              {[
                { val: moves,             label: 'Züge',  color: '#60A5FA' },
                { val: formatTime(timer), label: 'Zeit',  color: '#00D4AA' },
                { val: pairs,             label: 'Paare', color: '#C4B5FD' },
              ].map(({ val, label, color }) => (
                <div key={label} className="flex-1 rounded-2xl py-3"
                  style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
                  <div className="text-xl font-black" style={{ color }}>{val}</div>
                  <div className="text-[11px] font-bold mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-2.5">
              <button onClick={() => startGame(pairs)}
                className="flex-1 rounded-2xl py-3.5 font-black text-white active:scale-95 transition-transform text-sm"
                style={{ background: 'linear-gradient(135deg, #5C4AE4, #8B5CF6)', boxShadow: '0 4px 16px rgba(92,74,228,0.4)' }}>
                Nochmal spielen
              </button>
              <button onClick={() => setDifficulty(null)}
                className="flex-1 rounded-2xl py-3.5 font-black active:scale-95 transition-transform text-sm"
                style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}>
                Menü
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
