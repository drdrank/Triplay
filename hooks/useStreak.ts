'use client'

import { useState, useEffect } from 'react'

const KEY = 'triplay_streak'

interface StreakData {
  count: number
  lastDate: string // YYYY-MM-DD
}

const DEFAULT: StreakData = { count: 0, lastDate: '' }

function today() {
  return new Date().toISOString().split('T')[0]
}
function yesterday() {
  return new Date(Date.now() - 86_400_000).toISOString().split('T')[0]
}

export function useStreak() {
  const [streak, setStreak] = useState(0)
  const [playedToday, setPlayedToday] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) {
        const data: StreakData = JSON.parse(raw)
        // If the last play was today, keep the streak; if 2+ days ago, it broke
        if (data.lastDate === today()) {
          setStreak(data.count)
          setPlayedToday(true)
        } else if (data.lastDate === yesterday()) {
          setStreak(data.count) // streak alive, just hasn't played yet today
        } else {
          setStreak(0) // streak broken
        }
      }
    } catch {
      // ignore
    }
  }, [])

  function markPlayed() {
    const t = today()
    try {
      const raw = localStorage.getItem(KEY)
      const data: StreakData = raw ? JSON.parse(raw) : DEFAULT

      if (data.lastDate === t) return // already counted today

      const next: StreakData = {
        count: data.lastDate === yesterday() ? data.count + 1 : 1,
        lastDate: t,
      }
      localStorage.setItem(KEY, JSON.stringify(next))
      setStreak(next.count)
      setPlayedToday(true)
    } catch {
      // ignore
    }
  }

  return { streak, playedToday, markPlayed }
}
