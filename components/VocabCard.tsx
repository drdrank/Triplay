'use client'

import { useState } from 'react'
import { VocabItem, Language, LANG_FLAGS } from '@/types'

interface Props {
  item: VocabItem
  languages: Language[]
  onTap: (item: VocabItem) => void
}

const LANG_FG: Record<Language, string> = {
  de: '#4ADE80',
  nl: '#60A5FA',
  tr: '#F87171',
}

export default function VocabCard({ item, languages, onTap }: Props) {
  const [pressed, setPressed] = useState(false)

  function handleTap() {
    setPressed(true)
    setTimeout(() => setPressed(false), 180)
    onTap(item)
  }

  return (
    <button
      onClick={handleTap}
      className="flex flex-col items-center rounded-3xl w-full overflow-hidden transition-all duration-150"
      style={{
        background: '#1A1830',
        boxShadow: pressed
          ? `0 2px 8px ${item.color}30`
          : '0 2px 12px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.06)',
        transform: pressed ? 'scale(0.96)' : 'scale(1)',
        borderTop: `3px solid ${item.color}`,
      }}
    >
      {/* Emoji */}
      <div
        className="flex items-center justify-center w-full py-5"
        style={{ background: `${item.color}18` }}
      >
        <span style={{ fontSize: 44, lineHeight: 1 }}>{item.emoji}</span>
      </div>

      {/* Languages */}
      <div className="w-full px-2 py-2.5 flex flex-col gap-1">
        {languages.map((lang, i) => (
          <div key={lang} className="flex items-center gap-1.5 justify-center">
            <span className="text-sm leading-none">{LANG_FLAGS[lang]}</span>
            <span
              className="font-black leading-tight text-center"
              style={{
                color: LANG_FG[lang],
                fontSize: i === 0 ? 15 : 13,
              }}
            >
              {item[lang]}
            </span>
          </div>
        ))}
      </div>
    </button>
  )
}
