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
  { id: 'objects',   label: 'Things',    icon: '🧸' },
  { id: 'animals',   label: 'Animals',   icon: '🐾' },
  { id: 'food',      label: 'Food',      icon: '🍎' },
  { id: 'nature',    label: 'Nature',    icon: '🌿' },
  { id: 'transport', label: 'Transport', icon: '🚌' },
  { id: 'clothes',   label: 'Clothes',   icon: '👕' },
  { id: 'family',    label: 'Family',    icon: '👨‍👩‍👧' },
  { id: 'feelings',  label: 'Feelings',  icon: '😊' },
  { id: 'places',    label: 'Places',    icon: '🏫' },
  { id: 'school',    label: 'School',    icon: '🎒' },
  { id: 'sports',    label: 'Sports',    icon: '⚽' },
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
    <div className="flex flex-col min-h-dvh bg-white">

      {/* Header */}
      <div
        className="px-5 pt-12 pb-4"
        style={{ background: 'linear-gradient(145deg, #1e1b4b 0%, #4338ca 50%, #6366f1 100%)' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Link
            href="/"
            className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-white font-bold active:opacity-60 transition-opacity"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </Link>
          <h1 className="text-xl font-black text-white flex-1">Learn Words</h1>
          <span className="text-indigo-200 text-sm font-bold">{items.length}</span>
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
                    ? { background: 'white', color: '#4338ca' }
                    : { background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.75)' }
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
              background: lang === 'de' ? '#f0fdf4' : lang === 'nl' ? '#eff6ff' : '#fef2f2',
              color: lang === 'de' ? '#15803d' : lang === 'nl' ? '#1d4ed8' : '#b91c1c',
            }}
          >
            {lang === 'de' ? '🇩🇪 DE' : lang === 'nl' ? '🇳🇱 NL' : '🇹🇷 TR'}
          </span>
        ))}
        <span className="text-[11px] text-surface-400 font-medium ml-1">tap to hear</span>
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
