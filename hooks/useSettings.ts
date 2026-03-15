'use client'

import { useState, useEffect } from 'react'
import { Settings, DEFAULT_SETTINGS } from '@/types'

const KEY = 'triplay_settings'

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) })
    } catch {
      // ignore
    }
    setLoaded(true)
  }, [])

  function save(next: Settings) {
    setSettings(next)
    try {
      localStorage.setItem(KEY, JSON.stringify(next))
    } catch {
      // ignore
    }
  }

  return { settings, save, loaded }
}
