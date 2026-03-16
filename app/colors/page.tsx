'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSettings } from '@/hooks/useSettings'
import { speakSequence } from '@/lib/speech'
import { LANG_FLAGS } from '@/types'
import type { Language } from '@/types'

const COLORS = [
  { id: 'red',    de: 'Rot',         nl: 'Rood',    tr: 'Kırmızı',    hex: '#EF4444', dark: false },
  { id: 'orange', de: 'Orange',      nl: 'Oranje',  tr: 'Turuncu',    hex: '#F97316', dark: false },
  { id: 'yellow', de: 'Gelb',        nl: 'Geel',    tr: 'Sarı',       hex: '#EAB308', dark: false },
  { id: 'green',  de: 'Grün',        nl: 'Groen',   tr: 'Yeşil',      hex: '#22C55E', dark: false },
  { id: 'blue',   de: 'Blau',        nl: 'Blauw',   tr: 'Mavi',       hex: '#3B82F6', dark: false },
  { id: 'purple', de: 'Lila',        nl: 'Paars',   tr: 'Mor',        hex: '#A855F7', dark: false },
  { id: 'pink',   de: 'Rosa',        nl: 'Roze',    tr: 'Pembe',      hex: '#EC4899', dark: false },
  { id: 'brown',  de: 'Braun',       nl: 'Bruin',   tr: 'Kahverengi', hex: '#92400E', dark: false },
  { id: 'black',  de: 'Schwarz',     nl: 'Zwart',   tr: 'Siyah',      hex: '#1E293B', dark: false },
  { id: 'white',  de: 'Weiß',        nl: 'Wit',     tr: 'Beyaz',      hex: '#F1F5F9', dark: true  },
  { id: 'gray',   de: 'Grau',        nl: 'Grijs',   tr: 'Gri',        hex: '#6B7280', dark: false },
  { id: 'gold',   de: 'Gold',        nl: 'Goud',    tr: 'Altın',      hex: '#F59E0B', dark: false },
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
    <div className="flex flex-col min-h-dvh bg-white">

      {/* Header */}
      <div
        className="px-5 pt-12 pb-5"
        style={{ background: 'linear-gradient(145deg, #701a75 0%, #a21caf 50%, #d946ef 100%)' }}
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
          <h1 className="text-xl font-black text-white">🎨 Colors</h1>
        </div>
        <p className="text-fuchsia-100/70 text-xs pl-12">Tap a color to hear it in all 3 languages!</p>
      </div>

      {/* Active color display */}
      {active ? (
        <div
          className="mx-4 mt-4 rounded-3xl overflow-hidden animate-bounce-in"
          style={{ boxShadow: `0 4px 24px ${active.hex}30, 0 0 0 1.5px ${active.hex}20` }}
        >
          <div
            className="h-28 flex items-center justify-center"
            style={{ background: active.hex }}
          >
            <span
              className="text-5xl font-black"
              style={{ color: active.dark ? '#374151' : 'rgba(255,255,255,0.95)' }}
            >
              {active.de}
            </span>
          </div>
          <div className="bg-white p-4 flex items-center justify-between">
            <div className="space-y-1.5">
              {(settings.languages as Language[]).map(lang => (
                <div key={lang} className="flex items-center gap-2">
                  <span className="text-base">{LANG_FLAGS[lang]}</span>
                  <span className="font-black text-xl text-surface-800">
                    {active[lang as keyof typeof active]}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => handleColor(active)}
              className="w-12 h-12 rounded-full flex items-center justify-center active:scale-90 transition-transform"
              style={{ background: `${active.hex}18` }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active.hex} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M15.54 8.46a5 5 0 010 7.07"/>
                <path d="M19.07 4.93a10 10 0 010 14.14"/>
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="mx-4 mt-4 rounded-3xl py-5 text-center text-surface-400 text-sm font-semibold" style={{ background: '#f4f4f5' }}>
          Tap any color below 👇
        </div>
      )}

      {/* Color swatches */}
      <div className="grid grid-cols-3 gap-2.5 px-4 pt-4 pb-28">
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
                  ? `0 0 0 3px white, 0 0 0 5px ${item.hex}, 0 4px 16px ${item.hex}40`
                  : '0 2px 8px rgba(0,0,0,0.08)',
              }}
            >
              <span
                className="font-black text-base text-center leading-tight px-2"
                style={{ color: item.dark ? '#374151' : 'white' }}
              >
                {item.de}
              </span>
              <span
                className="text-xs font-semibold text-center px-2"
                style={{ color: item.dark ? '#6B7280' : 'rgba(255,255,255,0.72)' }}
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
