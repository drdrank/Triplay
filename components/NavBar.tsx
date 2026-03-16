'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { preloadVoices } from '@/lib/speech'

const NAV = [
  { href: '/',         label: 'Home',   icon: (a: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={a ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={a ? 0 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z"/>
      <path d="M9 21V12h6v9" fill={a ? 'white' : 'none'} strokeWidth={a ? 0 : 1.8}/>
    </svg>
  )},
  { href: '/learn',    label: 'Learn',  icon: (a: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={a ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={a ? 0 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3L2 8l10 5 10-5-10-5z"/>
      <path d="M2 17l10 5 10-5"/>
      <path d="M2 12l10 5 10-5"/>
    </svg>
  )},
  { href: '/game',     label: 'Play',   icon: (a: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={a ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={a ? 0 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="4"/>
      <path d="M8 12h4m-2-2v4" stroke={a ? 'white' : 'currentColor'} strokeWidth="1.8"/>
      <circle cx="16" cy="11" r="0.8" fill={a ? 'white' : 'currentColor'}/>
      <circle cx="18" cy="13" r="0.8" fill={a ? 'white' : 'currentColor'}/>
    </svg>
  )},
  { href: '/memory',   label: 'Memory', icon: (a: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={a ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={a ? 0 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="8" height="11" rx="2"/>
      <rect x="13" y="3" width="8" height="11" rx="2"/>
      <rect x="3" y="16" width="8" height="5" rx="2"/>
      <rect x="13" y="16" width="8" height="5" rx="2"/>
    </svg>
  )},
  { href: '/stickers', label: 'Stars',  icon: (a: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={a ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={a ? 0 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  )},
]

export default function NavBar() {
  const pathname = usePathname()

  useEffect(() => { preloadVoices() }, [])

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 glass"
      style={{
        borderTop: '1px solid rgba(0,0,0,0.07)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex justify-around px-2 py-2">
        {NAV.map(({ href, label, icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all active:scale-90"
              style={active ? {
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                color: 'white',
              } : { color: '#a1a1aa' }}
            >
              <span className="leading-none">{icon(active)}</span>
              <span className="text-[10px] font-bold tracking-wide">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
