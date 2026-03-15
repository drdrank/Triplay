export type Language = 'de' | 'nl' | 'tr'

export interface VocabItem {
  id: string
  category: 'objects' | 'animals' | 'food' | 'colors' | 'body' | 'numbers' | 'nature' | 'clothes' | 'family' | 'feelings' | 'transport' | 'places'
  emoji: string
  color: string
  de: string
  nl: string
  tr: string
}

export interface StickerItem {
  id: number
  emoji: string
  name: string
  requiredScore: number
}

export interface Settings {
  languages: Language[]
  audioSpeed: 'normal' | 'slow'
}

export interface Progress {
  totalCorrect: number
  unlockedStickers: number[]
}

export const LANG_LABELS: Record<Language, string> = {
  de: 'Deutsch',
  nl: 'Nederlands',
  tr: 'Türkçe',
}

export const LANG_FLAGS: Record<Language, string> = {
  de: '🇩🇪',
  nl: '🇳🇱',
  tr: '🇹🇷',
}

export const LANG_COLORS: Record<Language, string> = {
  de: '#22C55E',
  nl: '#3B82F6',
  tr: '#EF4444',
}

export const LANG_BG: Record<Language, string> = {
  de: 'bg-green-500',
  nl: 'bg-blue-500',
  tr: 'bg-red-500',
}

export const DEFAULT_SETTINGS: Settings = {
  languages: ['de', 'nl', 'tr'],
  audioSpeed: 'normal',
}

export const DEFAULT_PROGRESS: Progress = {
  totalCorrect: 0,
  unlockedStickers: [],
}
