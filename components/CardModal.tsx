'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { VocabItem, Language, LANG_FLAGS, LANG_LABELS } from '@/types'
import { speakWord } from '@/lib/speech'

interface Props {
  item: VocabItem
  languages: Language[]
  audioSpeed: 'normal' | 'slow'
  onClose: () => void
}

const LANG_BG: Record<Language, string> = {
  de: 'rgba(74,222,128,0.12)',
  nl: 'rgba(96,165,250,0.12)',
  tr: 'rgba(248,113,113,0.12)',
}
const LANG_BORDER: Record<Language, string> = {
  de: 'rgba(74,222,128,0.35)',
  nl: 'rgba(96,165,250,0.35)',
  tr: 'rgba(248,113,113,0.35)',
}
const LANG_FG: Record<Language, string> = {
  de: '#4ADE80',
  nl: '#60A5FA',
  tr: '#F87171',
}

export default function CardModal({ item, languages, audioSpeed, onClose }: Props) {
  const [speaking, setSpeaking] = useState(false)
  const [activeLang, setActiveLang] = useState<Language | null>(null)
  const speakingRef = useRef(false)

  const rate = audioSpeed === 'slow' ? 0.6 : 1

  const playAll = useCallback(async () => {
    if (speakingRef.current) return
    speakingRef.current = true
    setSpeaking(true)
    setActiveLang(null)

    for (const lang of languages) {
      if (!speakingRef.current) break
      setActiveLang(lang)
      await speakWord(item[lang], lang, rate)
      await new Promise<void>((r) => setTimeout(r, 350))
    }

    speakingRef.current = false
    setSpeaking(false)
    setActiveLang(null)
  }, [item, languages, rate])

  useEffect(() => {
    const t = setTimeout(playAll, 300)
    return () => {
      clearTimeout(t)
      speakingRef.current = false
      window.speechSynthesis?.cancel()
    }
  }, [playAll])

  async function handleSingleLang(lang: Language) {
    if (speakingRef.current) {
      speakingRef.current = false
      window.speechSynthesis?.cancel()
      setSpeaking(false)
      setActiveLang(null)
      await new Promise<void>((r) => setTimeout(r, 80))
    }
    speakingRef.current = true
    setSpeaking(true)
    setActiveLang(lang)
    await speakWord(item[lang], lang, rate)
    speakingRef.current = false
    setSpeaking(false)
    setActiveLang(null)
  }

  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-end justify-center px-4 pb-6"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="modal-panel w-full max-w-sm rounded-4xl p-6"
        style={{
          background: '#1A1830',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Emoji */}
        <div
          className="mx-auto mb-5 flex h-28 w-28 items-center justify-center rounded-3xl text-7xl"
          style={{
            background: `${item.color}20`,
            border: `2px solid ${item.color}30`,
          }}
        >
          {item.emoji}
        </div>

        {/* Language rows */}
        <div className="space-y-2.5 mb-5">
          {languages.map((lang) => {
            const isActive = activeLang === lang
            return (
              <button
                key={lang}
                onClick={() => handleSingleLang(lang)}
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-150 active:scale-[0.98]"
                style={{
                  background: isActive ? LANG_BG[lang] : 'rgba(255,255,255,0.04)',
                  border: `1.5px solid ${isActive ? LANG_BORDER[lang] : 'rgba(255,255,255,0.06)'}`,
                  boxShadow: isActive ? `0 0 0 3px ${LANG_BORDER[lang]}` : 'none',
                }}
              >
                <span className="text-2xl">{LANG_FLAGS[lang]}</span>
                <span className="flex-1 text-left text-xl font-black" style={{ color: isActive ? LANG_FG[lang] : '#ffffff' }}>
                  {item[lang]}
                </span>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: isActive ? LANG_FG[lang] : 'rgba(255,255,255,0.3)' }}>
                  {LANG_LABELS[lang]}
                </span>
                {isActive && (
                  <span className="text-base animate-pulse-soft">🔊</span>
                )}
              </button>
            )
          })}
        </div>

        {/* Controls */}
        <div className="flex gap-2.5">
          <button
            onClick={playAll}
            disabled={speaking}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl py-3.5 text-white font-black text-base transition-all active:scale-95 disabled:opacity-50"
            style={{
              background: speaking
                ? 'rgba(255,255,255,0.1)'
                : 'linear-gradient(135deg, #5C4AE4, #8B5CF6)',
              boxShadow: speaking ? 'none' : '0 4px 20px rgba(92,74,228,0.45)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 3l14 9-14 9V3z"/>
            </svg>
            {speaking ? 'Playing…' : 'Play All'}
          </button>
          <button
            onClick={onClose}
            className="rounded-2xl px-4 py-3.5 font-bold transition-all active:scale-95"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {audioSpeed === 'slow' && (
          <p className="mt-3 text-center text-xs font-bold" style={{ color: 'rgba(196,181,253,0.6)' }}>Slow mode on 🐌</p>
        )}
      </div>
    </div>
  )
}
