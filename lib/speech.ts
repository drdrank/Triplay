import type { Language } from '@/types'

const LANG_CODES: Record<Language, string[]> = {
  de: ['de-DE', 'de-AT', 'de-CH', 'de'],
  nl: ['nl-NL', 'nl-BE', 'nl'],
  tr: ['tr-TR', 'tr'],
}

let voiceCache: SpeechSynthesisVoice[] | null = null

// Call once early (e.g. on app mount) so voices are ready for the first tap
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
 * Speak a word. Calls speechSynthesis.speak() synchronously so it works
 * within an iOS user-gesture handler. Voices are used from cache if available;
 * on first call they're loaded for subsequent taps.
 */
export function speakWord(text: string, lang: Language, rate = 1): Promise<void> {
  if (typeof window === 'undefined' || !window.speechSynthesis) return Promise.resolve()

  const ss = window.speechSynthesis
  ss.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = LANG_CODES[lang][0]
  utterance.rate = rate

  // Assign voice synchronously from cache (avoids breaking iOS gesture chain)
  if (voiceCache && voiceCache.length > 0) {
    const voice = findVoice(voiceCache, lang)
    if (voice) utterance.voice = voice
  } else {
    // Kick off loading for next time (fire-and-forget)
    preloadVoices()
  }

  return new Promise<void>((resolve) => {
    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      resolve()
    }

    // iOS sometimes never fires onend — resolve after a generous timeout
    const fallback = setTimeout(finish, 7000)

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
