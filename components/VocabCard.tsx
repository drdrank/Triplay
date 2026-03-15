'use client'

import { useState } from 'react'
import { VocabItem, Language } from '@/types'

interface Props {
  item: VocabItem
  languages: Language[]
  onTap: (item: VocabItem) => void
}

export default function VocabCard({ item, languages, onTap }: Props) {
  const [popped, setPopped] = useState(false)

  function handleTap() {
    setPopped(true)
    setTimeout(() => setPopped(false), 280)
    onTap(item)
  }

  const primaryLang = languages[0] ?? 'de'

  return (
    <button
      onClick={handleTap}
      className="flex flex-col items-center justify-center rounded-3xl bg-white py-5 px-3 shadow-md transition-all card-press w-full"
      style={{
        boxShadow: `0 4px 16px ${item.color}22`,
        borderTop: `3px solid ${item.color}`,
        transform: popped ? 'scale(1.06)' : 'scale(1)',
      }}
    >
      {/* Emoji circle */}
      <div
        className="flex items-center justify-center rounded-2xl mb-3"
        style={{
          width: 72,
          height: 72,
          background: `${item.color}15`,
        }}
      >
        <span style={{ fontSize: 42, lineHeight: 1 }}>{item.emoji}</span>
      </div>

      {/* Word */}
      <span className="text-base font-extrabold text-gray-800 leading-tight text-center">
        {item[primaryLang]}
      </span>

      {/* Secondary languages */}
      {languages.length > 1 && (
        <div className="flex gap-1 mt-1.5 flex-wrap justify-center">
          {languages.slice(1).map((lang) => (
            <span
              key={lang}
              className="text-[11px] font-semibold rounded-full px-2 py-0.5"
              style={{
                background: lang === 'de' ? '#dcfce7' : lang === 'nl' ? '#dbeafe' : '#fee2e2',
                color:      lang === 'de' ? '#16a34a' : lang === 'nl' ? '#1d4ed8' : '#dc2626',
              }}
            >
              {item[lang]}
            </span>
          ))}
        </div>
      )}
    </button>
  )
}
