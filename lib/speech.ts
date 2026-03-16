import type { Language } from '@/types'

// Preferred BCP-47 tags per language (first match wins)
const LANG_CODES: Record<Language, string[]> = {
  de: ['de-DE', 'de-AT', 'de-CH', 'de'],
  nl: ['nl-NL', 'nl-BE', 'nl'],
  tr: ['tr-TR', 'tr'],
}

let voiceCache: SpeechSynthesisVoice[] | null = null

function getVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (voiceCache) return resolve(voiceCache)
    const voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) {
      voiceCache = voices
      return resolve(voices)
    }
    window.speechSynthesis.onvoiceschanged = () => {
      voiceCache = window.speechSynthesis.getVoices()
      resolve(voiceCache)
    }
  })
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

export async function speakWord(
  text: string,
  lang: Language,
  rate = 1
): Promise<void> {
  if (typeof window === 'undefined' || !window.speechSynthesis) return

  const voices = await getVoices()
  const voice = findVoice(voices, lang)

  window.speechSynthesis.cancel()

  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = LANG_CODES[lang][0]
    utterance.rate = rate
    if (voice) utterance.voice = voice
    utterance.onend = () => resolve()
    utterance.onerror = () => resolve()
    window.speechSynthesis.speak(utterance)
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
