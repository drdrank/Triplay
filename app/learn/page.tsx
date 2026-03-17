'use client'

import { useState } from 'react'
import Link from 'next/link'
import VocabCard from '@/components/VocabCard'
import CardModal from '@/components/CardModal'
import { useSettings } from '@/hooks/useSettings'
import vocabulary from '@/data/vocabulary.json'
import type { VocabItem } from '@/types'

const CATEGORIES = [
  { id: 'all',       label: 'All',       icon: '✨' },
  { id: 'animals',   label: 'Animals',   icon: '🐾' },
  { id: 'food',      label: 'Food',      icon: '🍎' },
  { id: 'objects',   label: 'Things',    icon: '🧸' },
  { id: 'nature',    label: 'Nature',    icon: '🌿' },
  { id: 'music',     label: 'Music',     icon: '🎵' },
  { id: 'weather',   label: 'Weather',   icon: '⛅' },
  { id: 'toys',      label: 'Toys',      icon: '🪆' },
  { id: 'space',     label: 'Space',     icon: '🚀' },
  { id: 'ocean',     label: 'Ocean',     icon: '🌊' },
  { id: 'garden',    label: 'Garden',    icon: '🌻' },
  { id: 'jobs',      label: 'Jobs',      icon: '👷' },
  { id: 'farm',      label: 'Farm',      icon: '🐓' },
  { id: 'house',     label: 'House',     icon: '🏠' },
  { id: 'insects',   label: 'Insects',   icon: '🦋' },
  { id: 'sports',    label: 'Sports',    icon: '⚽' },
  { id: 'transport', label: 'Transport', icon: '🚌' },
  { id: 'clothes',   label: 'Clothes',   icon: '👕' },
  { id: 'family',    label: 'Family',    icon: '👨‍👩‍👧' },
  { id: 'feelings',  label: 'Feelings',  icon: '😊' },
  { id: 'places',    label: 'Places',    icon: '🏫' },
  { id: 'school',    label: 'School',    icon: '🎒' },
  { id: 'colors',    label: 'Colors',    icon: '🎨' },
  { id: 'body',      label: 'Body',      icon: '👁️' },
  { id: 'numbers',   label: 'Numbers',   icon: '🔢' },
]

export default function LearnPage() {
  const { settings } = useSettings()
  const [category, setCategory] = useState('all')
  const [selected, setSelected] = useState<VocabItem | null>(null)

  const items = (vocabulary as VocabItem[]).filter(
    (v) => category === 'all' || v.category === category
  )

  return (
    <div className="flex flex-col min-h-dvh" style={{ background: '#0F0E1A' }}>

      {/* Header */}
      <div
        className="px-5 pt-12 pb-4"
        style={{ background: 'linear-gradient(160deg, #110D2D 0%, #1A1554 50%, #2D1B69 100%)' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Link
            href="/"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white active:opacity-60 transition-opacity"
            style={{ background: 'rgba(255,255,255,0.12)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </Link>
          <h1 className="text-xl font-black text-white flex-1">Learn Words</h1>
          <span className="text-sm font-bold" style={{ color: '#C4B5FD' }}>{items.length}</span>
        </div>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map(({ id, label, icon }) => {
            const active = category === id
            return (
              <button
                key={id}
                onClick={() => setCategory(id)}
                className="flex-shrink-0 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all active:scale-95"
                style={
                  active
                    ? { background: '#5C4AE4', color: 'white', boxShadow: '0 2px 12px rgba(92,74,228,0.5)' }
                    : { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }
                }
              >
                <span>{icon}</span>
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Language badges */}
      <div className="px-4 pt-3 pb-2 flex gap-2 items-center">
        {settings.languages.map((lang) => (
          <span
            key={lang}
            className="rounded-full px-2.5 py-0.5 text-[11px] font-bold"
            style={{
              background: lang === 'de' ? 'rgba(74,222,128,0.15)' : lang === 'nl' ? 'rgba(96,165,250,0.15)' : 'rgba(248,113,113,0.15)',
              color: lang === 'de' ? '#4ADE80' : lang === 'nl' ? '#60A5FA' : '#F87171',
              border: `1px solid ${lang === 'de' ? 'rgba(74,222,128,0.3)' : lang === 'nl' ? 'rgba(96,165,250,0.3)' : 'rgba(248,113,113,0.3)'}`,
            }}
          >
            {lang === 'de' ? '🇩🇪 DE' : lang === 'nl' ? '🇳🇱 NL' : '🇹🇷 TR'}
          </span>
        ))}
        <span className="text-[11px] font-medium ml-1" style={{ color: 'rgba(196,181,253,0.5)' }}>tap to hear</span>
      </div>

      {/* Grid */}
      <div className="px-4 pb-28 grid grid-cols-2 gap-3">
        {items.map((item) => (
          <VocabCard
            key={item.id}
            item={item}
            languages={settings.languages}
            onTap={(v) => setSelected(v)}
          />
        ))}
      </div>

      {selected && (
        <CardModal
          item={selected}
          languages={settings.languages}
          audioSpeed={settings.audioSpeed}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
