'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSettings } from '@/hooks/useSettings'
import { speakWord } from '@/lib/speech'
import alphabet from '@/data/alphabet.json'
import { LANG_FLAGS } from '@/types'
import type { Language } from '@/types'

type AlphabetItem = typeof alphabet[0]

export default function ABCPage() {
  const { settings } = useSettings()
  const [active, setActive] = useState<AlphabetItem | null>(null)
  const rate = settings.audioSpeed === 'slow' ? 0.6 : 1

  async function handleLetter(item: AlphabetItem) {
    setActive(item)
    // Speak the letter then the word in each active language
    for (const lang of settings.languages as Language[]) {
      await speakWord(item[lang], lang, rate)
      await new Promise(r => setTimeout(r, 350))
    }
  }

  async function speakAll(item: AlphabetItem) {
    for (const lang of settings.languages as Language[]) {
      await speakWord(item[lang], lang, rate)
      await new Promise(r => setTimeout(r, 350))
    }
  }

  return (
    <div className="flex flex-col min-h-dvh pb-24" style={{ background: '#f8f7ff' }}>

      {/* Header */}
      <div className="px-5 pt-12 pb-5"
        style={{ background: 'linear-gradient(160deg,#7c3aed,#a855f7)' }}>
        <div className="flex items-center gap-3 mb-1">
          <Link href="/" className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-lg active:opacity-60">←</Link>
          <h1 className="text-xl font-black text-white">A B C</h1>
        </div>
        <p className="text-white/60 text-xs pl-12">Tap a letter to learn the word!</p>
      </div>

      {/* Active letter card */}
      {active ? (
        <div className="mx-4 mt-4 rounded-3xl bg-white shadow-lg p-5 flex items-center gap-4 animate-bounce-in"
          style={{ borderTop: `4px solid ${active.color}` }}>
          <div className="flex items-center justify-center rounded-2xl w-20 h-20 flex-shrink-0 text-6xl font-black"
            style={{ background: active.color + '18', color: active.color }}>
            {active.letter}
          </div>
          <div className="flex-1">
            <div className="text-4xl mb-2">{active.emoji}</div>
            <div className="space-y-0.5">
              {(settings.languages as Language[]).map(lang => (
                <div key={lang} className="flex items-center gap-1.5">
                  <span className="text-sm">{LANG_FLAGS[lang]}</span>
                  <span className="font-bold text-gray-700 text-sm">{active[lang]}</span>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => speakAll(active)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-xl active:scale-90 transition-transform flex-shrink-0"
            style={{ background: active.color + '18' }}>
            🔊
          </button>
        </div>
      ) : (
        <div className="mx-4 mt-4 rounded-3xl bg-white/60 p-4 text-center text-gray-400 text-sm font-semibold">
          Tap any letter below 👇
        </div>
      )}

      {/* Alphabet grid */}
      <div className="grid grid-cols-5 gap-2.5 px-4 pt-4">
        {alphabet.map((item) => {
          const isActive = active?.letter === item.letter
          return (
            <button
              key={item.letter}
              onClick={() => handleLetter(item)}
              className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-0.5 font-black text-2xl active:scale-90 transition-all"
              style={{
                background: isActive ? item.color : item.color + '18',
                color: isActive ? 'white' : item.color,
                boxShadow: isActive ? `0 4px 12px ${item.color}40` : 'none',
              }}
            >
              {item.letter}
              <span className="text-base leading-none">{item.emoji}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
