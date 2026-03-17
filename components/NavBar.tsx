'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/',        label: 'Start',   icon: (a: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={a ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={a ? 0 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z"/>
      <path d="M9 21V12h6v9" fill={a ? 'white' : 'none'} strokeWidth={a ? 0 : 1.8}/>
    </svg>
  )},
  { href: '/learn',   label: 'Lernen',  icon: (a: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={a ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={a ? 0 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3L2 8l10 5 10-5-10-5z"/>
      <path d="M2 17l10 5 10-5"/>
      <path d="M2 12l10 5 10-5"/>
    </svg>
  )},
  { href: '/game',    label: 'Spielen', icon: (a: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={a ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={a ? 0 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="4"/>
      <path d="M12 9v6M9 12h6" stroke={a ? 'rgba(255,255,255,0.6)' : 'currentColor'} strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="7" cy="12" r="0.8" fill={a ? 'rgba(255,255,255,0.6)' : 'currentColor'}/>
    </svg>
  )},
  { href: '/memory',  label: 'Memory',  icon: (a: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={a ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={a ? 0 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="9" height="11" rx="2"/>
      <rect x="13" y="3" width="9" height="11" rx="2"/>
      <rect x="2" y="16" width="9" height="5" rx="2"/>
      <rect x="13" y="16" width="9" height="5" rx="2"/>
    </svg>
  )},
  { href: '/stickers',label: 'Sticker', icon: (a: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={a ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={a ? 0 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  )},
]

export default function NavBar() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 glass"
      style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
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
                background: '#5C4AE4',
                color: 'white',
                boxShadow: '0 4px 16px rgba(92,74,228,0.45)',
              } : {
                color: 'rgba(255,255,255,0.40)',
              }}
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
