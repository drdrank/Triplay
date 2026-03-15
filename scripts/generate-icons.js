/**
 * Run with: node scripts/generate-icons.js
 * Generates simple placeholder PWA icons using Node.js canvas (if available)
 * or creates SVG-based placeholder icons.
 *
 * For production, replace public/icons/icon-192.png and icon-512.png
 * with proper illustrated icons.
 */

const fs = require('fs')
const path = require('path')

// Create a minimal SVG icon as a placeholder
function createSVG(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#FF6B35"/>
  <text x="${size/2}" y="${size * 0.62}" font-size="${size * 0.5}" text-anchor="middle" font-family="sans-serif">🌍</text>
  <text x="${size/2}" y="${size * 0.88}" font-size="${size * 0.14}" text-anchor="middle" font-family="sans-serif" fill="white" font-weight="bold">TriPlay</text>
</svg>`
}

const iconsDir = path.join(__dirname, '../public/icons')
fs.mkdirSync(iconsDir, { recursive: true })

fs.writeFileSync(path.join(iconsDir, 'icon-192.svg'), createSVG(192))
fs.writeFileSync(path.join(iconsDir, 'icon-512.svg'), createSVG(512))

console.log('SVG icons created in public/icons/')
console.log('For PWA, convert to PNG using: npx sharp-cli or any image tool.')
console.log('Or replace with your own 192x192 and 512x512 PNG files.')
