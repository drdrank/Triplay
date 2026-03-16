'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/',         label: 'Home',    icon: '🏡' },
  { href: '/learn',    label: 'Learn',   icon: '📖' },
  { href: '/game',     label: 'Play',    icon: '🎮' },
  { href: '/memory',   label: 'Memory',  icon: '🃏' },
  { href: '/stickers', label: 'Stars',   icon: '⭐' },
]

export default function NavBar() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40"
      style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(0,0,0,0.06)',
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
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all active:scale-90"
              style={active ? {
                background: 'linear-gradient(135deg,#f97316,#ec4899)',
              } : {}}
            >
              <span className="text-xl leading-none">{icon}</span>
              <span
                className="text-[11px] font-bold"
                style={{ color: active ? '#fff' : '#9CA3AF' }}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
