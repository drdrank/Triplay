# 🌍 TriPlay – Learn 3 Languages

A warm, playful mobile-first web app that teaches **German 🇩🇪**, **Dutch 🇳🇱**, and **Turkish 🇹🇷** to toddlers and young children.

Built for a multilingual family: one Dutch parent, one Turkish parent, living in Germany.

---

## Features

- 📖 **Learn Screen** – 12 vocabulary cards in 3 categories (objects, animals, food)
- 🎮 **Mini-Game** – "Find the object!" with confetti & streaks
- ⭐ **Sticker Rewards** – unlock 10 stickers as you play
- 👨‍👩‍👧 **Parent Mode** – choose languages, order, audio speed
- 🔊 **Text-to-Speech** – uses browser speech synthesis for all 3 languages
- 📱 **PWA** – installable on phones via "Add to Home Screen"

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Run Locally

```bash
cd TriPlay
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) on your phone or browser.

> **Tip:** For the best experience, open on a mobile device or use browser DevTools → toggle device mode.

---

## Deploy to Vercel

### Option 1: Vercel CLI

```bash
npm i -g vercel
vercel
```

### Option 2: Vercel Dashboard

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repo
4. Click **Deploy** — no configuration needed

---

## Project Structure

```
TriPlay/
├── app/                  # Next.js App Router pages
│   ├── page.tsx          # 🏡 Home screen
│   ├── learn/page.tsx    # 📖 Learn screen
│   ├── game/page.tsx     # 🎮 Mini-game
│   ├── stickers/page.tsx # ⭐ Sticker collection
│   └── parent/page.tsx   # 👨‍👩‍👧 Parent settings
├── components/           # Reusable UI components
│   ├── VocabCard.tsx     # Tappable word card
│   ├── CardModal.tsx     # Word detail modal with TTS
│   ├── NavBar.tsx        # Bottom navigation
│   ├── Confetti.tsx      # Celebration confetti
│   └── PWARegister.tsx   # Service worker registration
├── data/
│   ├── vocabulary.json   # 12 words × 3 languages
│   └── stickers.json     # 10 unlockable stickers
├── hooks/
│   ├── useSettings.ts    # Language/speed settings (localStorage)
│   └── useProgress.ts    # Score & stickers (localStorage)
├── lib/
│   └── speech.ts         # Browser TTS utilities
├── types/
│   └── index.ts          # Shared TypeScript types
└── public/
    ├── manifest.json     # PWA manifest
    ├── sw.js             # Service worker
    └── icons/            # App icons
```

---

## Adding More Words

Edit `data/vocabulary.json` — each item follows this structure:

```json
{
  "id": "sun",
  "category": "objects",
  "emoji": "☀️",
  "color": "#F59E0B",
  "de": "Sonne",
  "nl": "Zon",
  "tr": "Güneş"
}
```

Categories: `"objects"` · `"animals"` · `"food"`

---

## PWA Icons

The current icons are SVG placeholders. To create proper PNG icons:

```bash
node scripts/generate-icons.js
# Then convert the SVGs to PNG using any tool, e.g.:
npx sharp-cli resize 192 192 --input public/icons/icon-192.svg --output public/icons/icon-192.png
npx sharp-cli resize 512 512 --input public/icons/icon-512.svg --output public/icons/icon-512.png
```

Or simply replace `public/icons/icon-192.png` and `icon-512.png` with your own images.

---

## Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **Tailwind CSS**
- **TypeScript**
- **Web Speech API** (built-in browser TTS)
- **localStorage** (no backend)
- **PWA** (manifest + service worker)

---

## Roadmap

- [ ] More vocabulary categories (colors, numbers, body parts)
- [ ] Story mode
- [ ] Parent-recorded audio (replace TTS)
- [ ] Real illustrated images per word
- [ ] Multiple "worlds" / themes
- [ ] Achievement badges
- [ ] Offline-first with better caching
