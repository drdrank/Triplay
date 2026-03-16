'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSettings } from '@/hooks/useSettings'
import { useProgress } from '@/hooks/useProgress'
import { Language, LANG_FLAGS, LANG_LABELS } from '@/types'

const ALL_LANGS: Language[] = ['de', 'nl', 'tr']

const LANG_NAMES: Record<Language, string> = {
  de: 'German · Deutsch',
  nl: 'Dutch · Nederlands',
  tr: 'Turkish · Türkçe',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      className="rounded-3xl p-5"
      style={{ background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)' }}
    >
      <h2 className="text-base font-black text-surface-800 mb-4">{title}</h2>
      {children}
    </section>
  )
}

export default function ParentPage() {
  const { settings, save } = useSettings()
  const { progress, reset } = useProgress()
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [saved, setSaved] = useState(false)

  function toggleLang(lang: Language) {
    const current = settings.languages
    if (current.includes(lang)) {
      if (current.length === 1) return
      save({ ...settings, languages: current.filter((l) => l !== lang) })
    } else {
      const next = ALL_LANGS.filter((l) => [...current, lang].includes(l))
      save({ ...settings, languages: next })
    }
    flashSaved()
  }

  function moveLang(lang: Language, dir: -1 | 1) {
    const arr = [...settings.languages]
    const i = arr.indexOf(lang)
    const j = i + dir
    if (j < 0 || j >= arr.length) return
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
    save({ ...settings, languages: arr })
    flashSaved()
  }

  function setSpeed(speed: 'normal' | 'slow') {
    save({ ...settings, audioSpeed: speed })
    flashSaved()
  }

  function flashSaved() {
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <div className="flex flex-col min-h-dvh" style={{ background: '#f4f4f5' }}>

      {/* Header */}
      <div
        className="px-5 pt-12 pb-6"
        style={{ background: 'linear-gradient(145deg, #18181b 0%, #3f3f46 50%, #52525b 100%)' }}
      >
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white active:opacity-60 transition-opacity"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-black text-white">Parent Mode</h1>
            <p className="text-white/50 text-xs font-medium">Customize for your child</p>
          </div>
        </div>
      </div>

      {/* Saved toast */}
      {saved && (
        <div
          className="fixed top-4 right-4 z-50 rounded-full px-4 py-2 text-white text-sm font-bold animate-bounce-in"
          style={{ background: '#16a34a', boxShadow: '0 4px 16px rgba(22,163,74,0.35)' }}
        >
          ✓ Saved
        </div>
      )}

      <div className="px-4 pt-4 space-y-3 pb-28">

        {/* Languages */}
        <Section title="🌍 Active Languages">
          <p className="text-xs text-surface-400 font-medium -mt-2 mb-4">Which languages should the app use?</p>
          <div className="space-y-2.5">
            {ALL_LANGS.map((lang) => {
              const active = settings.languages.includes(lang)
              const idx = settings.languages.indexOf(lang)
              return (
                <div
                  key={lang}
                  className="flex items-center gap-3 rounded-2xl p-3 transition-all"
                  style={{
                    background: active ? '#eef2ff' : '#fafafa',
                    border: `1.5px solid ${active ? '#c7d2fe' : 'transparent'}`,
                  }}
                >
                  <button
                    onClick={() => toggleLang(lang)}
                    className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
                    style={{ background: active ? '#6366f1' : '#d4d4d8' }}
                  >
                    <span
                      className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform"
                      style={{ transform: active ? 'translateX(20px)' : 'translateX(0)' }}
                    />
                  </button>
                  <span className="text-2xl">{LANG_FLAGS[lang]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-surface-700 text-sm">{LANG_NAMES[lang]}</div>
                    {active && (
                      <div className="text-[11px] text-surface-400 font-medium">
                        Position {idx + 1} · {idx === 0 ? 'plays first' : idx === settings.languages.length - 1 ? 'plays last' : `#${idx + 1}`}
                      </div>
                    )}
                  </div>
                  {active && (
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => moveLang(lang, -1)}
                        disabled={idx === 0}
                        className="w-7 h-7 rounded-lg text-surface-500 text-sm font-bold disabled:opacity-25 active:scale-90 transition-all flex items-center justify-center"
                        style={{ background: '#f4f4f5' }}
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveLang(lang, 1)}
                        disabled={idx === settings.languages.length - 1}
                        className="w-7 h-7 rounded-lg text-surface-500 text-sm font-bold disabled:opacity-25 active:scale-90 transition-all flex items-center justify-center"
                        style={{ background: '#f4f4f5' }}
                      >
                        ↓
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          {settings.languages.length > 1 && (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-surface-400 font-medium">Play order:</span>
              {settings.languages.map((lang, i) => (
                <span key={lang} className="flex items-center gap-1 text-sm font-bold text-surface-600">
                  {i > 0 && <span className="text-surface-300 font-normal">→</span>}
                  {LANG_FLAGS[lang]} {LANG_LABELS[lang]}
                </span>
              ))}
            </div>
          )}
        </Section>

        {/* Audio speed */}
        <Section title="🔊 Audio Speed">
          <p className="text-xs text-surface-400 font-medium -mt-2 mb-4">Slow mode helps children hear each sound clearly</p>
          <div className="flex gap-2.5">
            {(['normal', 'slow'] as const).map((speed) => {
              const active = settings.audioSpeed === speed
              return (
                <button
                  key={speed}
                  onClick={() => setSpeed(speed)}
                  className="flex-1 flex flex-col items-center gap-2 rounded-2xl py-4 font-bold transition-all active:scale-95"
                  style={
                    active
                      ? { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }
                      : { background: '#f4f4f5', color: '#71717a' }
                  }
                >
                  <span className="text-3xl">{speed === 'normal' ? '🐇' : '🐌'}</span>
                  <span className="text-sm capitalize">{speed}</span>
                </button>
              )
            })}
          </div>
        </Section>

        {/* Stats */}
        <Section title="📊 Progress">
          <div className="grid grid-cols-2 gap-2.5 -mt-2">
            <div className="rounded-2xl p-4 text-center" style={{ background: '#eef2ff' }}>
              <div className="text-3xl font-black" style={{ color: '#6366f1' }}>{progress.totalCorrect}</div>
              <div className="text-xs font-semibold text-surface-500 mt-1">Correct answers</div>
            </div>
            <div className="rounded-2xl p-4 text-center" style={{ background: '#fffbeb' }}>
              <div className="text-3xl font-black" style={{ color: '#d97706' }}>{progress.unlockedStickers.length}</div>
              <div className="text-xs font-semibold text-surface-500 mt-1">Stickers earned</div>
            </div>
          </div>
        </Section>

        {/* Reset */}
        <Section title="Reset Progress">
          <p className="text-xs text-surface-400 font-medium -mt-2 mb-4">
            Clears all correct answers and stickers. Settings are kept.
          </p>
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full rounded-2xl py-3 text-sm font-bold transition-all active:scale-95"
              style={{ background: '#fef2f2', color: '#dc2626', border: '1.5px solid #fca5a5' }}
            >
              Reset child&apos;s progress
            </button>
          ) : (
            <div className="space-y-2.5">
              <p className="text-sm font-bold text-red-600 text-center">Are you sure?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => { reset(); setShowResetConfirm(false) }}
                  className="flex-1 rounded-2xl py-3 text-white font-bold text-sm active:scale-95"
                  style={{ background: '#dc2626' }}
                >
                  Yes, reset
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 rounded-2xl py-3 text-surface-600 font-bold text-sm active:scale-95"
                  style={{ background: '#f4f4f5' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </Section>

        {/* About */}
        <Section title="ℹ️ About TriPlay">
          <p className="text-sm text-surface-500 leading-relaxed -mt-2">
            TriPlay teaches <strong>German 🇩🇪</strong>, <strong>Dutch 🇳🇱</strong>, and <strong>Turkish 🇹🇷</strong> to young children through interactive play.
          </p>
          <p className="text-sm text-surface-400 mt-2">
            Audio uses your device&apos;s built-in speech synthesis. Voice quality may vary by device.
          </p>
        </Section>

      </div>
    </div>
  )
}
