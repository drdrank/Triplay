'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSettings } from '@/hooks/useSettings'
import { speakSequence } from '@/lib/speech'
import { LANG_FLAGS } from '@/types'
import type { Language } from '@/types'

const NUMBERS = [
  { n: 1,  emoji: '1️⃣', de: 'Eins',     nl: 'Één',     tr: 'Bir',    color: '#EF4444' },
  { n: 2,  emoji: '2️⃣', de: 'Zwei',     nl: 'Twee',    tr: 'İki',    color: '#F97316' },
  { n: 3,  emoji: '3️⃣', de: 'Drei',     nl: 'Drie',    tr: 'Üç',     color: '#EAB308' },
  { n: 4,  emoji: '4️⃣', de: 'Vier',     nl: 'Vier',    tr: 'Dört',   color: '#22C55E' },
  { n: 5,  emoji: '5️⃣', de: 'Fünf',     nl: 'Vijf',    tr: 'Beş',    color: '#06B6D4' },
  { n: 6,  emoji: '6️⃣', de: 'Sechs',    nl: 'Zes',     tr: 'Altı',   color: '#3B82F6' },
  { n: 7,  emoji: '7️⃣', de: 'Sieben',   nl: 'Zeven',   tr: 'Yedi',   color: '#8B5CF6' },
  { n: 8,  emoji: '8️⃣', de: 'Acht',     nl: 'Acht',    tr: 'Sekiz',  color: '#EC4899' },
  { n: 9,  emoji: '9️⃣', de: 'Neun',     nl: 'Negen',   tr: 'Dokuz',  color: '#F43F5E' },
  { n: 10, emoji: '🔟',  de: 'Zehn',     nl: 'Tien',    tr: 'On',     color: '#7C3AED' },
  { n: 11, emoji: '🔢',  de: 'Elf',      nl: 'Elf',     tr: 'On bir', color: '#EF4444' },
  { n: 12, emoji: '🔢',  de: 'Zwölf',    nl: 'Twaalf',  tr: 'On iki', color: '#F97316' },
  { n: 13, emoji: '🔢',  de: 'Dreizehn', nl: 'Dertien', tr: 'On üç',  color: '#EAB308' },
  { n: 14, emoji: '🔢',  de: 'Vierzehn', nl: 'Veertien','tr': 'On dört',color:'#22C55E'},
  { n: 15, emoji: '🔢',  de: 'Fünfzehn', nl: 'Vijftien','tr': 'On beş',color:'#06B6D4' },
  { n: 16, emoji: '🔢',  de: 'Sechzehn', nl: 'Zestien', tr: 'On altı',color: '#3B82F6' },
  { n: 17, emoji: '🔢',  de: 'Siebzehn', nl: 'Zeventien','tr':'On yedi',color:'#8B5CF6'},
  { n: 18, emoji: '🔢',  de: 'Achtzehn', nl: 'Achttien','tr': 'On sekiz',color:'#EC4899'},
  { n: 19, emoji: '🔢',  de: 'Neunzehn', nl: 'Negentien','tr':'On dokuz',color:'#F43F5E'},
  { n: 20, emoji: '🔢',  de: 'Zwanzig',  nl: 'Twintig', tr: 'Yirmi',  color: '#7C3AED' },
]

type NumberItem = typeof NUMBERS[0]

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

  // Dot visualizer (max 10 dots)
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

  return (
    <div className="flex flex-col min-h-dvh pb-24" style={{ background: '#f8f7ff' }}>

      {/* Header */}
      <div className="px-5 pt-12 pb-5"
        style={{ background: 'linear-gradient(160deg,#f59e0b,#f97316)' }}>
        <div className="flex items-center gap-3 mb-1">
          <Link href="/" className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-lg active:opacity-60">←</Link>
          <h1 className="text-xl font-black text-white">1 2 3 Numbers</h1>
        </div>
        <p className="text-white/60 text-xs pl-12">Tap a number to hear it in all 3 languages!</p>
      </div>

      {/* Active number card */}
      {active && (
        <div className="mx-4 mt-4 rounded-3xl bg-white shadow-lg p-5 animate-bounce-in"
          style={{ borderTop: `4px solid ${active.color}` }}>
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center rounded-2xl w-20 h-20 flex-shrink-0 font-black text-4xl"
              style={{ background: active.color + '18', color: active.color }}>
              {active.n}
            </div>
            <div className="flex-1">
              {(settings.languages as Language[]).map(lang => (
                <div key={lang} className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-sm">{LANG_FLAGS[lang]}</span>
                  <span className="font-black text-lg text-gray-800">
                    {active[lang as keyof typeof active]}
                  </span>
                </div>
              ))}
            </div>
            <button onClick={() => speakItem(active)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-xl active:scale-90 transition-transform flex-shrink-0"
              style={{ background: active.color + '18' }}>
              🔊
            </button>
          </div>
          {/* Dot visualizer */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <Dots n={active.n} color={active.color} />
          </div>
        </div>
      )}

      {/* Number grid */}
      <div className="grid grid-cols-4 gap-3 px-4 pt-4">
        {NUMBERS.map((item) => {
          const isActive = active?.n === item.n
          return (
            <button
              key={item.n}
              onClick={() => handleNumber(item)}
              className="aspect-square rounded-3xl flex flex-col items-center justify-center font-black text-3xl active:scale-90 transition-all"
              style={{
                background: isActive ? item.color : item.color + '18',
                color: isActive ? 'white' : item.color,
                boxShadow: isActive ? `0 4px 16px ${item.color}50` : 'none',
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
