// Sistema visual compartido por todos los paneles del perfil.
// Cada SVG sale de aquí para que el README se lea como una sola pieza.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))

export const W = 1200

export const color = {
  bg: '#07050A',
  line: '#241631',
  lineSoft: '#170F20',
  cell: '#140C1B',
  brand: '#390050',
  brand2: '#5A1A7E',
  brand3: '#8A5FE0',
  lilac: '#C9B6FF',
  text: '#F4EFFA',
  muted: '#A495B3',
}

export const ease = 'cubic-bezier(.2,.7,.2,1)'

const fontFiles = {
  display: ['Bricolage', 700, 'normal', 'bricolage-700.woff'],
  body: ['Bricolage', 500, 'normal', 'bricolage-500.woff'],
  mono: ['JetBrains', 500, 'normal', 'jetbrains-mono-500.woff'],
}

export const font = {
  display: "font-family:Bricolage,system-ui,sans-serif;font-weight:700",
  body: "font-family:Bricolage,system-ui,sans-serif;font-weight:500",
  mono: "font-family:JetBrains,ui-monospace,monospace;font-weight:500",
}

export const fontPath = (key) => join(here, 'fonts', fontFiles[key][3])

export function fontFace(key) {
  const [family, weight, style, file] = fontFiles[key]
  const data = readFileSync(join(here, 'fonts', file)).toString('base64')
  return `@font-face{font-family:${family};font-weight:${weight};font-style:${style};src:url(data:font/woff;base64,${data}) format('woff')}`
}

export function icon(slug) {
  const raw = readFileSync(join(here, 'icons', `${slug}.svg`), 'utf8')
  return raw.match(/<path d="([^"]+)"/)[1]
}

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Grano fino de esmalte: da textura sin caer en degradados de IA.
const grain = `
  <filter id="grain" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
    <feComponentTransfer><feFuncA type="table" tableValues="0 .07"/></feComponentTransfer>
  </filter>`

/**
 * Envuelve el contenido en el marco común: fondo, borde, grano y fuentes.
 * @param {{h:number, title:string, desc:string, fonts:string[], css?:string, defs?:string, body:string, w?:number, r?:number}} o
 */
export function frame({ h, w = W, r = 28, title, desc, fonts, css = '', defs = '', body }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="t d">
<title id="t">${esc(title)}</title>
<desc id="d">${esc(desc)}</desc>
<style>
${fonts.map(fontFace).join('\n')}
${css}
@media (prefers-reduced-motion: reduce){*{animation:none!important}}
</style>
<defs>
  <clipPath id="panel"><rect width="${w}" height="${h}" rx="${r}"/></clipPath>
  ${grain}
  ${defs}
</defs>
<g clip-path="url(#panel)">
  <rect width="${w}" height="${h}" fill="${color.bg}"/>
  ${body}
  <rect width="${w}" height="${h}" filter="url(#grain)"/>
</g>
<rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="${r - 0.5}" fill="none" stroke="${color.line}"/>
</svg>
`
}

// Etiqueta de sección tipo capa de Figma: "01 / Cómo trabajo".
export function sectionLabel(index, label, x = 56, y = 64) {
  return `<text x="${x}" y="${y}" style="${font.mono};font-size:16px;letter-spacing:.04em">
    <tspan fill="${color.brand3}">${index}</tspan><tspan fill="${color.muted}" dx="10">/  ${esc(label)}</tspan>
  </text>`
}

// ---------- Ornamento: suminagashi (marmolado de tinta sobre agua) ----------

const pt = (x, y) => `${x.toFixed(1)} ${y.toFixed(1)}`

// Inserta puntos donde una gota estiró demasiado el anillo, para que no
// aparezcan tramos rectos.
function refine(pts, max = 6) {
  const out = []
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i], q = pts[(i + 1) % pts.length]
    out.push(p)
    const n = Math.floor(Math.hypot(q[0] - p[0], q[1] - p[1]) / max)
    for (let k = 1; k <= n; k++) {
      const t = k / (n + 1)
      out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t])
    }
  }
  return out
}

/**
 * Marmolado con la física real del suminagashi: cada gota nueva de radio r
 * empuja los anillos existentes a c + (p - c) * sqrt(1 + r² / |p - c|²).
 * Después se "sopla" el agua con operaciones que le dan movimiento:
 * - swirl: remolino que gira más cerca del centro.
 * - tine: peine que arrastra la tinta a lo largo de una línea.
 * - wave: ondulación suave de toda la superficie.
 * @param {{x:number,y:number,drops:number,r:number}[]} sources
 * @param {object[]} ops
 * @returns {{ring:number, d:string}[]} anillos del más viejo al más nuevo
 */
export function marble(sources, ops = []) {
  const curves = []
  const N = 180
  for (const s of sources) {
    for (let i = 0; i < s.drops; i++) {
      const r2 = s.r * s.r
      for (const c of curves) {
        for (const p of c.pts) {
          const dx = p[0] - s.x, dy = p[1] - s.y
          const k = Math.sqrt(1 + r2 / (dx * dx + dy * dy))
          p[0] = s.x + dx * k
          p[1] = s.y + dy * k
        }
        c.pts = refine(c.pts)
      }
      const pts = Array.from({ length: N }, (_, j) => {
        const a = (j / N) * Math.PI * 2
        return [s.x + Math.cos(a) * s.r, s.y + Math.sin(a) * s.r]
      })
      curves.push({ ring: i, pts })
    }
  }
  for (const op of ops) {
    for (const c of curves) {
      c.pts = refine(c.pts.map((p) => move(op, p)))
    }
  }
  return curves.map((c) => ({ ring: c.ring, d: toPath(c.pts) }))
}

function move(op, [x, y]) {
  if (op.type === 'swirl') {
    const dx = x - op.x, dy = y - op.y
    const a = op.s * Math.exp(-Math.hypot(dx, dy) / op.falloff)
    const cos = Math.cos(a), sin = Math.sin(a)
    return [op.x + dx * cos - dy * sin, op.y + dx * sin + dy * cos]
  }
  if (op.type === 'tine') {
    const mx = Math.cos(op.angle), my = Math.sin(op.angle)
    const d = Math.abs((x - op.x) * -my + (y - op.y) * mx)
    const k = op.z * op.u ** d
    return [x + k * mx, y + k * my]
  }
  return [x + op.amp * Math.sin(y / op.wave), y + op.amp * 0.6 * Math.sin(x / (op.wave * 1.4))]
}

// Descarta puntos casi pegados para que el SVG no pese de más.
function toPath(pts) {
  const out = [pts[0]]
  for (const p of pts) {
    const q = out.at(-1)
    if (Math.hypot(p[0] - q[0], p[1] - q[1]) >= 3) out.push(p)
  }
  return `M${out.map((p) => pt(...p)).join('L')}Z`
}

// Anillos en outline: alternan tinta fuerte y agua, como el papel real.
// Las bandas pares e impares se deslizan en sentidos opuestos y por las
// líneas de acento corre la tinta.
export function suminagashi(sources, ops, fadeFromX, id) {
  const rings = marble(sources, ops)
  const layer = (parity) => rings.map((c, i) => {
    if (c.ring % 2 !== parity) return ''
    const strong = parity === 0
    const accent = c.ring % 5 === 4
    const stroke = accent ? color.lilac : strong ? color.brand3 : color.brand2
    const op = accent ? 0.6 : strong ? 0.8 : 0.45
    const sw = strong ? 1.5 : 1.1
    return `<path class="${accent ? 'ink run' : 'ink'}" style="animation-delay:${(rings.length - i) * 40}ms" d="${c.d}" fill="none" stroke="${stroke}" stroke-opacity="${op}" stroke-width="${sw}"/>`
  }).join('')
  return `
  <linearGradient id="${id}-fade" x1="${fadeFromX}" x2="${fadeFromX + 240}" y1="0" y2="0" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff"/>
  </linearGradient>
  <mask id="${id}-mask"><rect width="100%" height="100%" fill="url(#${id}-fade)"/></mask>
  <g mask="url(#${id}-mask)">
    <g class="flow-a">${layer(0)}</g>
    <g class="flow-b">${layer(1)}</g>
  </g>`
}

// El estado final es el base: con reduced-motion todo queda visible y quieto.
export const ornamentCss = `
.ink{animation:ink 1.4s ${ease} both}
@media (prefers-reduced-motion: no-preference){.run{stroke-dasharray:120 70;animation:ink 1.4s ${ease} both,run 16s linear infinite}}
@keyframes ink{from{opacity:0}}
@keyframes run{to{stroke-dashoffset:-760}}
.flow-a{animation:flowa 9s ease-in-out infinite alternate}
.flow-b{animation:flowb 12s ease-in-out infinite alternate}
@keyframes flowa{to{transform:translate(-16px,7px)}}
@keyframes flowb{to{transform:translate(12px,-6px)}}
`

// ---------- Medición de texto (solo en build local) ----------
let opentype
const loaded = {}
export async function measurer() {
  opentype ??= (await import('opentype.js')).default
  return (key, text, size) => {
    loaded[key] ??= opentype.loadSync(fontPath(key))
    return loaded[key].getAdvanceWidth(text, size, { kerning: true })
  }
}

// Parte un texto en líneas que caben en maxWidth.
export function wrap(measure, key, text, size, maxWidth) {
  const words = text.split(' ')
  const lines = []
  let cur = ''
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w
    if (measure(key, next, size) > maxWidth && cur) {
      lines.push(cur)
      cur = w
    } else cur = next
  }
  if (cur) lines.push(cur)
  return lines
}
