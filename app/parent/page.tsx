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

export default function ParentPage() {
  const { settings, save } = useSettings()
  const { progress, reset } = useProgress()
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [saved, setSaved] = useState(false)

  function toggleLang(lang: Language) {
    const current = settings.languages
    let next: Language[]

    if (current.includes(lang)) {
      // Don't allow removing the last language
      if (current.length === 1) return
      next = current.filter((l) => l !== lang)
    } else {
      next = [...current, lang]
      // Maintain original order
      next = ALL_LANGS.filter((l) => next.includes(l))
    }

    save({ ...settings, languages: next })
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

  function handleReset() {
    reset()
    setShowResetConfirm(false)
  }

  return (
    <div className="flex flex-col min-h-dvh" style={{ background: '#f8f7ff' }}>
      {/* Header */}
      <div
        className="px-5 pt-12 pb-6"
        style={{ background: 'linear-gradient(160deg,#475569,#334155)' }}
      >
        <div className="flex items-center gap-3">
          <Link href="/" className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-lg active:opacity-60">
            ←
          </Link>
          <div>
            <h1 className="text-xl font-black text-white">Parent Mode</h1>
            <p className="text-white/60 text-xs font-semibold">Customize for your child</p>
          </div>
        </div>
      </div>

      {/* Saved badge */}
      {saved && (
        <div className="fixed top-4 right-4 z-50 rounded-full bg-green-500 px-4 py-1.5 text-white text-sm font-bold shadow-lg animate-bounce-in">
          ✓ Saved!
        </div>
      )}

      <div className="px-4 pt-4 space-y-4 pb-12">

        {/* Languages */}
        <section className="bg-white rounded-3xl p-5 shadow-card">
          <h2 className="text-lg font-black text-gray-700 mb-1">🌍 Active Languages</h2>
          <p className="text-xs text-gray-400 mb-4">Which languages should the app use?</p>

          <div className="space-y-3">
            {ALL_LANGS.map((lang) => {
              const active = settings.languages.includes(lang)
              const idx = settings.languages.indexOf(lang)
              return (
                <div
                  key={lang}
                  className={`flex items-center gap-3 rounded-2xl p-3 transition-all
                    ${active ? 'bg-orange-50 ring-2 ring-orange-200' : 'bg-gray-50'}`}
                >
                  {/* Toggle */}
                  <button
                    onClick={() => toggleLang(lang)}
                    className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0
                      ${active ? 'bg-orange-400' : 'bg-gray-300'}`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform
                        ${active ? 'translate-x-6' : 'translate-x-0'}`}
                    />
                  </button>

                  <span className="text-2xl">{LANG_FLAGS[lang]}</span>
                  <div className="flex-1">
                    <div className="font-bold text-gray-700">{LANG_NAMES[lang]}</div>
                    {active && (
                      <div className="text-xs text-gray-400">Position {idx + 1} · plays {idx === 0 ? 'first' : idx === settings.languages.length - 1 ? 'last' : `#${idx + 1}`}</div>
                    )}
                  </div>

                  {/* Reorder buttons */}
                  {active && (
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => moveLang(lang, -1)}
                        disabled={idx === 0}
                        className="w-7 h-7 rounded-lg bg-gray-100 text-gray-500 text-sm font-bold disabled:opacity-30 active:scale-90"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveLang(lang, 1)}
                        disabled={idx === settings.languages.length - 1}
                        className="w-7 h-7 rounded-lg bg-gray-100 text-gray-500 text-sm font-bold disabled:opacity-30 active:scale-90"
                      >
                        ↓
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Order preview */}
          {settings.languages.length > 1 && (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-400">Play order:</span>
              {settings.languages.map((lang, i) => (
                <span key={lang} className="flex items-center gap-1 text-sm font-bold text-gray-600">
                  {i > 0 && <span className="text-gray-300">→</span>}
                  {LANG_FLAGS[lang]} {LANG_LABELS[lang]}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Audio speed */}
        <section className="bg-white rounded-3xl p-5 shadow-card">
          <h2 className="text-lg font-black text-gray-700 mb-1">🔊 Audio Speed</h2>
          <p className="text-xs text-gray-400 mb-4">Slow mode helps children hear each sound clearly</p>

          <div className="flex gap-3">
            {(['normal', 'slow'] as const).map((speed) => (
              <button
                key={speed}
                onClick={() => setSpeed(speed)}
                className={`flex-1 flex flex-col items-center gap-1.5 rounded-2xl py-4 font-bold transition-all active:scale-95
                  ${settings.audioSpeed === speed
                    ? 'text-white shadow-btn'
                    : 'bg-gray-100 text-gray-500'
                  }`}
                style={
                  settings.audioSpeed === speed
                    ? { background: 'linear-gradient(to bottom, #FF8C61, #FF6B35)' }
                    : {}
                }
              >
                <span className="text-3xl">{speed === 'normal' ? '🐇' : '🐌'}</span>
                <span className="text-sm capitalize">{speed}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="bg-white rounded-3xl p-5 shadow-card">
          <h2 className="text-lg font-black text-gray-700 mb-4">📊 Progress</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-orange-50 p-4 text-center">
              <div className="text-3xl font-black text-orange-500">{progress.totalCorrect}</div>
              <div className="text-xs font-semibold text-gray-500 mt-1">Correct answers</div>
            </div>
            <div className="rounded-2xl bg-yellow-50 p-4 text-center">
              <div className="text-3xl font-black text-yellow-600">{progress.unlockedStickers.length}</div>
              <div className="text-xs font-semibold text-gray-500 mt-1">Stickers earned</div>
            </div>
          </div>
        </section>

        {/* Reset */}
        <section className="bg-white rounded-3xl p-5 shadow-card">
          <h2 className="text-lg font-black text-gray-700 mb-1">🗑️ Reset Progress</h2>
          <p className="text-xs text-gray-400 mb-4">
            This will clear all correct answers and stickers. Settings will be kept.
          </p>

          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full rounded-2xl bg-red-50 py-3 text-red-500 font-bold text-sm border-2 border-red-100 transition-all active:scale-95"
            >
              Reset child&apos;s progress
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-sm font-bold text-red-600 text-center">Are you sure?</p>
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="flex-1 rounded-2xl bg-red-500 py-3 text-white font-bold text-sm active:scale-95"
                >
                  Yes, reset
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 rounded-2xl bg-gray-100 py-3 text-gray-600 font-bold text-sm active:scale-95"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>

        {/* About */}
        <section className="bg-white rounded-3xl p-5 shadow-card">
          <h2 className="text-lg font-black text-gray-700 mb-2">ℹ️ About TriPlay</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            TriPlay teaches <strong>German 🇩🇪</strong>, <strong>Dutch 🇳🇱</strong>, and <strong>Turkish 🇹🇷</strong> to young children through play.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Audio uses your device&apos;s built-in speech synthesis. Voice quality may vary by device.
          </p>
        </section>

      </div>
    </div>
  )
}
