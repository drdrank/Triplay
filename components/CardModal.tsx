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
  de: '#f0fdf4',
  nl: '#eff6ff',
  tr: '#fef2f2',
}
const LANG_BORDER: Record<Language, string> = {
  de: '#86efac',
  nl: '#93c5fd',
  tr: '#fca5a5',
}
const LANG_FG: Record<Language, string> = {
  de: '#15803d',
  nl: '#1d4ed8',
  tr: '#b91c1c',
}

export default function CardModal({ item, languages, audioSpeed, onClose }: Props) {
  const [speaking, setSpeaking] = useState(false)
  const [activeLang, setActiveLang] = useState<Language | null>(null)
  const speakingRef = useRef(false)

  const rate = audioSpeed === 'slow' ? 0.6 : 1

  const stopAll = useCallback(() => {
    speakingRef.current = false
    setSpeaking(false)
    setActiveLang(null)
    window.speechSynthesis?.cancel()
  }, [])

  // Cancel on close
  useEffect(() => {
    return () => { stopAll() }
  }, [stopAll])

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

  // Tap a single language row — stays synchronous to keep iOS gesture chain intact
  function handleSingleLang(lang: Language) {
    // Stop anything in progress
    speakingRef.current = false
    window.speechSynthesis?.cancel()

    // Start new utterance (speakWord calls ss.speak() synchronously)
    speakingRef.current = true
    setSpeaking(true)
    setActiveLang(lang)

    speakWord(item[lang], lang, rate).then(() => {
      // Only reset if this utterance is still the active one
      if (speakingRef.current) {
        speakingRef.current = false
        setSpeaking(false)
        setActiveLang(null)
      }
    })
  }

  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-end justify-center px-4 pb-6"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="modal-panel w-full max-w-sm rounded-4xl bg-white p-6"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Emoji */}
        <div
          className="mx-auto mb-5 flex h-28 w-28 items-center justify-center rounded-3xl text-7xl"
          style={{ background: `${item.color}14`, border: `2px solid ${item.color}20` }}
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
                  background: isActive ? LANG_BG[lang] : '#fafafa',
                  border: `1.5px solid ${isActive ? LANG_BORDER[lang] : 'transparent'}`,
                  boxShadow: isActive ? `0 0 0 3px ${LANG_BORDER[lang]}40` : 'none',
                }}
              >
                <span className="text-2xl">{LANG_FLAGS[lang]}</span>
                <span className="flex-1 text-left text-xl font-black" style={{ color: isActive ? LANG_FG[lang] : '#1a1a2e' }}>
                  {item[lang]}
                </span>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: isActive ? LANG_FG[lang] : '#a1a1aa' }}>
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
            onClick={speaking ? stopAll : playAll}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl py-3.5 text-white font-bold text-base transition-all active:scale-95"
            style={{
              background: speaking
                ? '#a1a1aa'
                : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              boxShadow: speaking ? 'none' : '0 4px 16px rgba(99,102,241,0.35)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              {speaking
                ? <path d="M6 4h4v16H6zm8 0h4v16h-4z"/>
                : <path d="M5 3l14 9-14 9V3z"/>}
            </svg>
            {speaking ? 'Stop' : 'Play All'}
          </button>
          <button
            onClick={onClose}
            className="rounded-2xl px-4 py-3.5 font-bold transition-all active:scale-95"
            style={{ background: '#f4f4f5', color: '#71717a' }}
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {audioSpeed === 'slow' && (
          <p className="mt-3 text-center text-xs font-medium" style={{ color: '#a1a1aa' }}>Slow mode on 🐌</p>
        )}
      </div>
    </div>
  )
}
