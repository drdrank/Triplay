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
    <div className="flex flex-col min-h-dvh bg-white">

      {/* Header */}
      <div
        className="px-5 pt-12 pb-5"
        style={{ background: 'linear-gradient(145deg, #1e1b4b 0%, #4338ca 50%, #6366f1 100%)' }}
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
          <h1 className="text-xl font-black text-white">A B C</h1>
        </div>
        <p className="text-indigo-200/70 text-xs pl-12">Tap a letter to learn the word!</p>
      </div>

      {/* Active letter card */}
      {active ? (
        <div
          className="mx-4 mt-4 rounded-3xl bg-white animate-bounce-in overflow-hidden"
          style={{ boxShadow: `0 4px 24px ${active.color}20, 0 0 0 1.5px ${active.color}20` }}
        >
          <div
            className="flex items-center gap-4 p-5"
            style={{ borderTop: `3px solid ${active.color}` }}
          >
            <div
              className="flex items-center justify-center rounded-2xl w-20 h-20 flex-shrink-0 text-6xl font-black"
              style={{ background: `${active.color}12`, color: active.color }}
            >
              {active.letter}
            </div>
            <div className="flex-1">
              <div className="text-4xl mb-2">{active.emoji}</div>
              <div className="space-y-1">
                {(settings.languages as Language[]).map(lang => (
                  <div key={lang} className="flex items-center gap-1.5">
                    <span className="text-sm">{LANG_FLAGS[lang]}</span>
                    <span className="font-bold text-surface-700 text-sm">{active[lang]}</span>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => speakAll(active)}
              className="w-10 h-10 rounded-full flex items-center justify-center active:scale-90 transition-transform flex-shrink-0"
              style={{ background: `${active.color}15` }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M15.54 8.46a5 5 0 010 7.07"/>
                <path d="M19.07 4.93a10 10 0 010 14.14"/>
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="mx-4 mt-4 rounded-3xl py-5 text-center text-surface-400 text-sm font-semibold" style={{ background: '#f4f4f5' }}>
          Tap any letter below 👇
        </div>
      )}

      {/* Alphabet grid */}
      <div className="grid grid-cols-5 gap-2 px-4 pt-4 pb-28">
        {alphabet.map((item) => {
          const isActive = active?.letter === item.letter
          return (
            <button
              key={item.letter}
              onClick={() => handleLetter(item)}
              className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-0.5 font-black text-2xl active:scale-90 transition-all"
              style={{
                background: isActive ? item.color : `${item.color}14`,
                color: isActive ? 'white' : item.color,
                boxShadow: isActive ? `0 4px 14px ${item.color}40` : 'none',
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
