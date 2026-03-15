'use client'

import { useEffect, useState, useCallback } from 'react'
import { VocabItem, Language, LANG_FLAGS, LANG_LABELS } from '@/types'
import { speakSequence, speakWord } from '@/lib/speech'

interface Props {
  item: VocabItem
  languages: Language[]
  audioSpeed: 'normal' | 'slow'
  onClose: () => void
}

export default function CardModal({ item, languages, audioSpeed, onClose }: Props) {
  const [speaking, setSpeaking] = useState(false)
  const [activeLang, setActiveLang] = useState<Language | null>(null)

  const rate = audioSpeed === 'slow' ? 0.6 : 1

  const playAll = useCallback(async () => {
    if (speaking) return
    setSpeaking(true)
    for (const lang of languages) {
      setActiveLang(lang)
      await speakWord(item[lang], lang, rate)
      await new Promise((r) => setTimeout(r, 400))
    }
    setActiveLang(null)
    setSpeaking(false)
  }, [item, languages, rate, speaking])

  // Auto-play when modal opens
  useEffect(() => {
    const t = setTimeout(playAll, 300)
    return () => {
      clearTimeout(t)
      window.speechSynthesis?.cancel()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleSingleLang(lang: Language) {
    if (speaking) return
    setSpeaking(true)
    setActiveLang(lang)
    speakWord(item[lang], lang, rate).then(() => {
      setActiveLang(null)
      setSpeaking(false)
    })
  }

  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-6"
      onClick={onClose}
    >
      <div
        className="modal-panel w-full max-w-sm rounded-4xl bg-white p-6 shadow-card-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Emoji */}
        <div
          className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-3xl text-7xl shadow-card"
          style={{ backgroundColor: item.color + '20' }}
        >
          {item.emoji}
        </div>

        {/* Language badges */}
        <div className="space-y-3 mb-6">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => handleSingleLang(lang)}
              className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 transition-all duration-150 ${
                activeLang === lang
                  ? 'scale-105 shadow-btn'
                  : 'hover:scale-102'
              }`}
              style={{
                backgroundColor: activeLang === lang ? item.color + '25' : '#F8F9FA',
                borderWidth: 2,
                borderColor: activeLang === lang ? item.color : 'transparent',
                borderStyle: 'solid',
              }}
            >
              <span className="text-2xl">{LANG_FLAGS[lang]}</span>
              <span className="flex-1 text-center text-2xl font-bold text-gray-800">
                {item[lang]}
              </span>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                {LANG_LABELS[lang]}
              </span>
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <button
            onClick={playAll}
            disabled={speaking}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-coral-500 py-3 text-white font-bold text-lg shadow-btn transition-all active:scale-95 disabled:opacity-60"
            style={{ backgroundColor: '#FF6B35' }}
          >
            <span className="text-xl">{speaking ? '🔊' : '▶️'}</span>
            Play All
          </button>
          <button
            onClick={onClose}
            className="rounded-2xl bg-gray-100 px-4 py-3 text-2xl font-bold text-gray-500 transition-all active:scale-95"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Slow mode hint */}
        {audioSpeed === 'slow' && (
          <p className="mt-3 text-center text-xs text-gray-400">🐌 Slow mode on</p>
        )}
      </div>
    </div>
  )
}
