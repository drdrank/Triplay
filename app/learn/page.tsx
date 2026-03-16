'use client'

import { useState } from 'react'
import Link from 'next/link'
import VocabCard from '@/components/VocabCard'
import CardModal from '@/components/CardModal'
import { useSettings } from '@/hooks/useSettings'
import vocabulary from '@/data/vocabulary.json'
import type { VocabItem } from '@/types'

const CATEGORIES = [
  { id: 'all',       label: 'All',       icon: '✨', color: '#f97316' },
  { id: 'objects',   label: 'Things',    icon: '🧸', color: '#3b82f6' },
  { id: 'animals',   label: 'Animals',   icon: '🐾', color: '#22c55e' },
  { id: 'food',      label: 'Food',      icon: '🍎', color: '#ef4444' },
  { id: 'nature',    label: 'Nature',    icon: '🌿', color: '#16a34a' },
  { id: 'transport', label: 'Transport', icon: '🚌', color: '#f97316' },
  { id: 'clothes',   label: 'Clothes',   icon: '👕', color: '#6366f1' },
  { id: 'family',    label: 'Family',    icon: '👨‍👩‍👧', color: '#ec4899' },
  { id: 'feelings',  label: 'Feelings',  icon: '😊', color: '#eab308' },
  { id: 'places',    label: 'Places',    icon: '🏫', color: '#0891b2' },
  { id: 'school',    label: 'School',    icon: '🎒', color: '#f97316' },
  { id: 'sports',    label: 'Sports',    icon: '⚽', color: '#22c55e' },
  { id: 'colors',    label: 'Colors',    icon: '🎨', color: '#a855f7' },
  { id: 'body',      label: 'Body',      icon: '👁️', color: '#06b6d4' },
  { id: 'numbers',   label: 'Numbers',   icon: '🔢', color: '#f59e0b' },
]

export default function LearnPage() {
  const { settings } = useSettings()
  const [category, setCategory] = useState('all')
  const [selected, setSelected] = useState<VocabItem | null>(null)

  const activeCat = CATEGORIES.find((c) => c.id === category)!
  const items = (vocabulary as VocabItem[]).filter(
    (v) => category === 'all' || v.category === category
  )

  return (
    <div className="flex flex-col min-h-dvh" style={{ background: '#f8f7ff' }}>

      {/* ── Header ───────────────────────────────────────────────── */}
      <div
        className="px-5 pt-12 pb-5"
        style={{ background: 'linear-gradient(160deg,#f97316,#ec4899)' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Link href="/" className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-lg active:opacity-60">
            ←
          </Link>
          <h1 className="text-xl font-black text-white">Learn Words</h1>
          <span className="ml-auto text-white/60 text-sm font-bold">{items.length} words</span>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map(({ id, label, icon, color }) => {
            const active = category === id
            return (
              <button
                key={id}
                onClick={() => setCategory(id)}
                className="flex-shrink-0 flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition-all active:scale-95"
                style={
                  active
                    ? { background: 'white', color: color }
                    : { background: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.85)' }
                }
              >
                <span>{icon}</span>
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Language badges ───────────────────────────────────────── */}
      <div className="px-4 pt-3 pb-2 flex gap-2">
        {settings.languages.map((lang) => (
          <span
            key={lang}
            className="rounded-full px-3 py-0.5 text-xs font-bold text-white"
            style={{
              background: lang === 'de' ? '#22c55e' : lang === 'nl' ? '#3b82f6' : '#ef4444',
            }}
          >
            {lang === 'de' ? '🇩🇪 DE' : lang === 'nl' ? '🇳🇱 NL' : '🇹🇷 TR'}
          </span>
        ))}
        <span className="text-xs text-gray-400 self-center">tap to hear!</span>
      </div>

      {/* ── Grid ─────────────────────────────────────────────────── */}
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
