'use client'

import { useState } from 'react'
import { VocabItem, Language } from '@/types'

interface Props {
  item: VocabItem
  languages: Language[]
  onTap: (item: VocabItem) => void
}

const LANG_BG: Record<Language, string> = {
  de: '#f0fdf4',
  nl: '#eff6ff',
  tr: '#fef2f2',
}
const LANG_FG: Record<Language, string> = {
  de: '#15803d',
  nl: '#1d4ed8',
  tr: '#b91c1c',
}

export default function VocabCard({ item, languages, onTap }: Props) {
  const [pressed, setPressed] = useState(false)

  function handleTap() {
    setPressed(true)
    setTimeout(() => setPressed(false), 200)
    onTap(item)
  }

  const primaryLang = languages[0] ?? 'de'

  return (
    <button
      onClick={handleTap}
      className="flex flex-col items-center rounded-3xl bg-white w-full overflow-hidden transition-all duration-150"
      style={{
        boxShadow: pressed
          ? `0 2px 8px ${item.color}20`
          : `0 2px 12px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)`,
        transform: pressed ? 'scale(0.96)' : 'scale(1)',
        borderTop: `3px solid ${item.color}`,
      }}
    >
      {/* Emoji area */}
      <div
        className="flex items-center justify-center w-full py-5"
        style={{ background: `${item.color}10` }}
      >
        <span style={{ fontSize: 44, lineHeight: 1 }}>{item.emoji}</span>
      </div>

      {/* Words */}
      <div className="w-full px-3 py-3 flex flex-col gap-1.5">
        <span className="text-base font-extrabold text-surface-800 leading-tight text-center">
          {item[primaryLang]}
        </span>

        {languages.length > 1 && (
          <div className="flex flex-wrap gap-1 justify-center">
            {languages.slice(1).map((lang) => (
              <span
                key={lang}
                className="text-[11px] font-bold rounded-lg px-1.5 py-0.5"
                style={{ background: LANG_BG[lang], color: LANG_FG[lang] }}
              >
                {item[lang]}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  )
}
