import type { Metadata, Viewport } from 'next'
import './globals.css'
import PWARegister from '@/components/PWARegister'
import NavBar from '@/components/NavBar'

export const metadata: Metadata = {
  title: 'TriPlay – Learn 3 Languages',
  description: 'A playful language app for toddlers — German, Dutch & Turkish',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'TriPlay',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#5C4AE4',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="app-bg">
        <div className="app-frame">
          <PWARegister />
          {children}
          <NavBar />
        </div>
      </body>
    </html>
  )
}
