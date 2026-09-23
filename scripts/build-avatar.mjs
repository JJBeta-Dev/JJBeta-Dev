// Avatar gráfico alternativo (monograma JJ sobre suminagashi): node scripts/build-avatar.mjs
// Para PNG: abrir assets/avatar-mark.svg en el navegador a 1024×1024 y exportar.
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { color, font, fontFace, suminagashi, measurer } from './lib.mjs'

const S = 1024
const measure = await measurer()
const size = 720
const text = 'JJ'
const w = measure('display', text, size) * 0.96

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}" role="img" aria-label="JJBeta">
<style>${fontFace('display')}</style>
<defs>
  <radialGradient id="aura" cx="700" cy="760" r="620" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="${color.brand}" stop-opacity=".7"/>
    <stop offset="1" stop-color="${color.brand}" stop-opacity="0"/>
  </radialGradient>
</defs>
<rect width="${S}" height="${S}" fill="${color.bg}"/>
<rect width="${S}" height="${S}" fill="url(#aura)"/>
${suminagashi([
  { x: 700, y: 700, drops: 32, r: 84 },
  { x: 420, y: 930, drops: 10, r: 44 },
], [
  { type: 'swirl', x: 690, y: 700, s: 1.5, falloff: 260 },
  { type: 'tine', x: 0, y: 820, angle: Math.PI, z: 120, u: 0.994 },
  { type: 'tine', x: 0, y: 560, angle: 0, z: 70, u: 0.994 },
  { type: 'wave', amp: 16, wave: 90 },
], 120, 'av').replace(/class="[^"]*"/g, '')}
<text x="${(S - w) / 2}" y="${S / 2 + size * 0.34}" style="${font.display};font-size:${size}px;letter-spacing:-.04em" fill="${color.bg}" fill-opacity=".55" stroke="${color.lilac}" stroke-width="11" stroke-linejoin="round">${text}</text>
</svg>
`

writeFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'avatar-mark.svg'), svg)
console.log('assets/avatar-mark.svg')
