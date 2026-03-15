'use client'

import { useState, useEffect } from 'react'
import { Progress, DEFAULT_PROGRESS } from '@/types'
import stickers from '@/data/stickers.json'

const KEY = 'triplay_progress'

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(DEFAULT_PROGRESS)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) setProgress({ ...DEFAULT_PROGRESS, ...JSON.parse(raw) })
    } catch {
      // ignore
    }
  }, [])

  function save(next: Progress) {
    setProgress(next)
    try {
      localStorage.setItem(KEY, JSON.stringify(next))
    } catch {
      // ignore
    }
  }

  function addCorrect(): { newSticker: (typeof stickers)[0] | null } {
    const nextTotal = progress.totalCorrect + 1
    const unlocked = [...progress.unlockedStickers]

    // Check if any new sticker should be unlocked
    let newSticker: (typeof stickers)[0] | null = null
    for (const s of stickers) {
      if (nextTotal >= s.requiredScore && !unlocked.includes(s.id)) {
        unlocked.push(s.id)
        newSticker = s
        break // unlock one at a time
      }
    }

    save({ totalCorrect: nextTotal, unlockedStickers: unlocked })
    return { newSticker }
  }

  function reset() {
    save(DEFAULT_PROGRESS)
  }

  return { progress, addCorrect, reset }
}
