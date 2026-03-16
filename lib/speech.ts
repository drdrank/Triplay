import type { Language } from '@/types'

const LANG_CODES: Record<Language, string[]> = {
  de: ['de-DE', 'de-AT', 'de-CH', 'de'],
  nl: ['nl-NL', 'nl-BE', 'nl'],
  tr: ['tr-TR', 'tr'],
}

let voiceCache: SpeechSynthesisVoice[] | null = null

export function preloadVoices(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  const voices = window.speechSynthesis.getVoices()
  if (voices.length > 0) {
    voiceCache = voices
  } else {
    window.speechSynthesis.onvoiceschanged = () => {
      voiceCache = window.speechSynthesis.getVoices()
    }
  }
}

function findVoice(
  voices: SpeechSynthesisVoice[],
  lang: Language
): SpeechSynthesisVoice | undefined {
  const codes = LANG_CODES[lang]
  for (const code of codes) {
    const exact = voices.find((v) => v.lang === code)
    if (exact) return exact
    const prefix = voices.find((v) => v.lang.startsWith(code.split('-')[0]))
    if (prefix) return prefix
  }
  return undefined
}

/**
 * Speak a word synchronously (no awaits before speak() — keeps iOS gesture chain intact).
 * Resolves when done, or after a 3s safety timeout.
 */
export function speakWord(text: string, lang: Language, rate = 1): Promise<void> {
  if (typeof window === 'undefined' || !window.speechSynthesis) return Promise.resolve()

  const ss = window.speechSynthesis

  // iOS: resume if the synth got paused (e.g. after lock screen)
  if (ss.paused) ss.resume()

  // Cancel anything playing
  if (ss.speaking || ss.pending) ss.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = LANG_CODES[lang][0]
  utterance.rate = rate

  // Use cached voice synchronously (keeps iOS gesture chain intact)
  if (voiceCache && voiceCache.length > 0) {
    const voice = findVoice(voiceCache, lang)
    if (voice) utterance.voice = voice
  } else {
    preloadVoices() // populate cache for next call
  }

  return new Promise<void>((resolve) => {
    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      resolve()
    }

    // 3s safety — if iOS never fires onend/onerror, don't hang forever
    const fallback = setTimeout(finish, 3000)
    utterance.onend = () => { clearTimeout(fallback); finish() }
    utterance.onerror = () => { clearTimeout(fallback); finish() }

    ss.speak(utterance)
  })
}

export async function speakSequence(
  words: { text: string; lang: Language }[],
  rate = 1,
  pauseMs = 600
): Promise<void> {
  for (const { text, lang } of words) {
    await speakWord(text, lang, rate)
    await delay(pauseMs)
  }
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}
