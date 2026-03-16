'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSettings } from '@/hooks/useSettings'
import { speakSequence } from '@/lib/speech'
import { LANG_FLAGS } from '@/types'
import type { Language } from '@/types'

const NUMBERS = [
  { n: 1,  de: 'Eins',     nl: 'Één',      tr: 'Bir',      color: '#EF4444' },
  { n: 2,  de: 'Zwei',     nl: 'Twee',     tr: 'İki',      color: '#F97316' },
  { n: 3,  de: 'Drei',     nl: 'Drie',     tr: 'Üç',       color: '#EAB308' },
  { n: 4,  de: 'Vier',     nl: 'Vier',     tr: 'Dört',     color: '#22C55E' },
  { n: 5,  de: 'Fünf',     nl: 'Vijf',     tr: 'Beş',      color: '#06B6D4' },
  { n: 6,  de: 'Sechs',    nl: 'Zes',      tr: 'Altı',     color: '#3B82F6' },
  { n: 7,  de: 'Sieben',   nl: 'Zeven',    tr: 'Yedi',     color: '#8B5CF6' },
  { n: 8,  de: 'Acht',     nl: 'Acht',     tr: 'Sekiz',    color: '#EC4899' },
  { n: 9,  de: 'Neun',     nl: 'Negen',    tr: 'Dokuz',    color: '#F43F5E' },
  { n: 10, de: 'Zehn',     nl: 'Tien',     tr: 'On',       color: '#7C3AED' },
  { n: 11, de: 'Elf',      nl: 'Elf',      tr: 'On bir',   color: '#EF4444' },
  { n: 12, de: 'Zwölf',    nl: 'Twaalf',   tr: 'On iki',   color: '#F97316' },
  { n: 13, de: 'Dreizehn', nl: 'Dertien',  tr: 'On üç',    color: '#EAB308' },
  { n: 14, de: 'Vierzehn', nl: 'Veertien', tr: 'On dört',  color: '#22C55E' },
  { n: 15, de: 'Fünfzehn', nl: 'Vijftien', tr: 'On beş',   color: '#06B6D4' },
  { n: 16, de: 'Sechzehn', nl: 'Zestien',  tr: 'On altı',  color: '#3B82F6' },
  { n: 17, de: 'Siebzehn', nl: 'Zeventien',tr: 'On yedi',  color: '#8B5CF6' },
  { n: 18, de: 'Achtzehn', nl: 'Achttien', tr: 'On sekiz', color: '#EC4899' },
  { n: 19, de: 'Neunzehn', nl: 'Negentien',tr: 'On dokuz', color: '#F43F5E' },
  { n: 20, de: 'Zwanzig',  nl: 'Twintig',  tr: 'Yirmi',    color: '#7C3AED' },
]

type NumberItem = typeof NUMBERS[0]

function Dots({ n, color }: { n: number; color: string }) {
  const show = Math.min(n, 10)
  return (
    <div className="flex flex-wrap gap-1 justify-center">
      {Array.from({ length: show }).map((_, i) => (
        <div key={i} className="w-3 h-3 rounded-full" style={{ background: color }} />
      ))}
      {n > 10 && <span className="text-xs font-bold" style={{ color }}>+{n - 10}</span>}
    </div>
  )
}

export default function NumbersPage() {
  const { settings } = useSettings()
  const [active, setActive] = useState<NumberItem | null>(null)
  const rate = settings.audioSpeed === 'slow' ? 0.6 : 1

  async function handleNumber(item: NumberItem) {
    setActive(item)
    const words = (settings.languages as Language[]).map(lang => ({
      text: item[lang as keyof typeof item] as string,
      lang,
    }))
    await speakSequence(words, rate, 400)
  }

  async function speakItem(item: NumberItem) {
    const words = (settings.languages as Language[]).map(lang => ({
      text: item[lang as keyof typeof item] as string,
      lang,
    }))
    await speakSequence(words, rate, 400)
  }

  return (
    <div className="flex flex-col min-h-dvh bg-white">

      {/* Header */}
      <div
        className="px-5 pt-12 pb-5"
        style={{ background: 'linear-gradient(145deg, #92400e 0%, #d97706 50%, #f59e0b 100%)' }}
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
          <h1 className="text-xl font-black text-white">1 2 3 Numbers</h1>
        </div>
        <p className="text-amber-100/70 text-xs pl-12">Tap a number to hear it in all 3 languages!</p>
      </div>

      {/* Active number card */}
      {active && (
        <div
          className="mx-4 mt-4 rounded-3xl bg-white animate-bounce-in overflow-hidden"
          style={{ borderTop: `3px solid ${active.color}`, boxShadow: `0 4px 20px ${active.color}15, 0 0 0 1px rgba(0,0,0,0.04)` }}
        >
          <div className="flex items-center gap-4 p-5">
            <div
              className="flex items-center justify-center rounded-2xl w-20 h-20 flex-shrink-0 font-black text-4xl"
              style={{ background: `${active.color}14`, color: active.color }}
            >
              {active.n}
            </div>
            <div className="flex-1">
              {(settings.languages as Language[]).map(lang => (
                <div key={lang} className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-sm">{LANG_FLAGS[lang]}</span>
                  <span className="font-black text-lg text-surface-800">
                    {active[lang as keyof typeof active]}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => speakItem(active)}
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
          <div className="px-5 pb-4 pt-1 border-t border-surface-100">
            <Dots n={active.n} color={active.color} />
          </div>
        </div>
      )}

      {/* Number grid */}
      <div className="grid grid-cols-4 gap-2.5 px-4 pt-4 pb-28">
        {NUMBERS.map((item) => {
          const isActive = active?.n === item.n
          return (
            <button
              key={item.n}
              onClick={() => handleNumber(item)}
              className="aspect-square rounded-3xl flex flex-col items-center justify-center font-black text-3xl active:scale-90 transition-all"
              style={{
                background: isActive ? item.color : `${item.color}14`,
                color: isActive ? 'white' : item.color,
                boxShadow: isActive ? `0 4px 16px ${item.color}45` : 'none',
              }}
            >
              {item.n}
            </button>
          )
        })}
      </div>
    </div>
  )
}
