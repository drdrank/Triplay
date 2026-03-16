'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSettings } from '@/hooks/useSettings'
import { speakSequence } from '@/lib/speech'
import { LANG_FLAGS } from '@/types'
import type { Language } from '@/types'

const COLORS = [
  { id: 'red',    de: 'Rot',         nl: 'Rood',    tr: 'Kırmızı',    hex: '#EF4444', textDark: false },
  { id: 'orange', de: 'Orange',      nl: 'Oranje',  tr: 'Turuncu',    hex: '#F97316', textDark: false },
  { id: 'yellow', de: 'Gelb',        nl: 'Geel',    tr: 'Sarı',       hex: '#EAB308', textDark: false },
  { id: 'green',  de: 'Grün',        nl: 'Groen',   tr: 'Yeşil',      hex: '#22C55E', textDark: false },
  { id: 'blue',   de: 'Blau',        nl: 'Blauw',   tr: 'Mavi',       hex: '#3B82F6', textDark: false },
  { id: 'purple', de: 'Lila',        nl: 'Paars',   tr: 'Mor',        hex: '#A855F7', textDark: false },
  { id: 'pink',   de: 'Rosa',        nl: 'Roze',    tr: 'Pembe',      hex: '#EC4899', textDark: false },
  { id: 'brown',  de: 'Braun',       nl: 'Bruin',   tr: 'Kahverengi', hex: '#92400E', textDark: false },
  { id: 'black',  de: 'Schwarz',     nl: 'Zwart',   tr: 'Siyah',      hex: '#1E293B', textDark: false },
  { id: 'white',  de: 'Weiß',        nl: 'Wit',     tr: 'Beyaz',      hex: '#F1F5F9', textDark: true  },
  { id: 'gray',   de: 'Grau',        nl: 'Grijs',   tr: 'Gri',        hex: '#6B7280', textDark: false },
  { id: 'gold',   de: 'Gold',        nl: 'Goud',    tr: 'Altın',      hex: '#F59E0B', textDark: false },
]

type ColorItem = typeof COLORS[0]

export default function ColorsPage() {
  const { settings } = useSettings()
  const [active, setActive] = useState<ColorItem | null>(null)
  const rate = settings.audioSpeed === 'slow' ? 0.6 : 1

  async function handleColor(item: ColorItem) {
    setActive(item)
    const words = (settings.languages as Language[]).map(lang => ({
      text: item[lang as keyof typeof item] as string,
      lang,
    }))
    await speakSequence(words, rate, 400)
  }

  return (
    <div className="flex flex-col min-h-dvh pb-24" style={{ background: '#f8f7ff' }}>

      {/* Header */}
      <div className="px-5 pt-12 pb-5"
        style={{ background: 'linear-gradient(160deg,#ec4899,#a855f7)' }}>
        <div className="flex items-center gap-3 mb-1">
          <Link href="/" className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-lg active:opacity-60">←</Link>
          <h1 className="text-xl font-black text-white">🎨 Colors</h1>
        </div>
        <p className="text-white/60 text-xs pl-12">Tap a color to hear it in all 3 languages!</p>
      </div>

      {/* Active color display */}
      {active ? (
        <div className="mx-4 mt-4 rounded-3xl overflow-hidden shadow-lg animate-bounce-in">
          {/* Big color swatch */}
          <div
            className="h-32 flex items-center justify-center"
            style={{ background: active.hex }}
          >
            <span className="text-5xl font-black"
              style={{ color: active.textDark ? '#374151' : 'white', opacity: 0.9 }}>
              {active.de}
            </span>
          </div>
          {/* Words */}
          <div className="bg-white p-4 flex items-center justify-between">
            <div className="space-y-1">
              {(settings.languages as Language[]).map(lang => (
                <div key={lang} className="flex items-center gap-2">
                  <span className="text-base">{LANG_FLAGS[lang]}</span>
                  <span className="font-black text-xl text-gray-800">
                    {active[lang as keyof typeof active]}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => handleColor(active)}
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl active:scale-90 transition-transform"
              style={{ background: active.hex + '20' }}
            >
              🔊
            </button>
          </div>
        </div>
      ) : (
        <div className="mx-4 mt-4 rounded-3xl bg-white/60 p-4 text-center text-gray-400 text-sm font-semibold">
          Tap any color below 👇
        </div>
      )}

      {/* Color swatches grid */}
      <div className="grid grid-cols-3 gap-3 px-4 pt-4">
        {COLORS.map((item) => {
          const isActive = active?.id === item.id
          return (
            <button
              key={item.id}
              onClick={() => handleColor(item)}
              className="rounded-3xl flex flex-col items-center justify-center py-6 gap-1 active:scale-90 transition-all"
              style={{
                background: item.hex,
                boxShadow: isActive
                  ? `0 0 0 4px white, 0 0 0 6px ${item.hex}`
                  : '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <span
                className="font-black text-base text-center leading-tight px-2"
                style={{ color: item.textDark ? '#374151' : 'white' }}
              >
                {item.de}
              </span>
              <span
                className="text-xs font-semibold opacity-75 text-center px-2"
                style={{ color: item.textDark ? '#6B7280' : 'rgba(255,255,255,0.8)' }}
              >
                {item.nl} · {item.tr}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
