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
  brand3: '#8E55BD',
  lilac: '#D9C2F5',
  text: '#F4EFFA',
  muted: '#A495B3',
}

export const ease = 'cubic-bezier(.2,.7,.2,1)'

const fontFiles = {
  display: ['Bricolage', 700, 'normal', 'bricolage-700.woff'],
  body: ['Bricolage', 500, 'normal', 'bricolage-500.woff'],
  serif: ['Instrument', 400, 'italic', 'instrument-serif-italic.woff'],
  mono: ['JetBrains', 500, 'normal', 'jetbrains-mono-500.woff'],
}

export const font = {
  display: "font-family:Bricolage,system-ui,sans-serif;font-weight:700",
  body: "font-family:Bricolage,system-ui,sans-serif;font-weight:500",
  serif: "font-family:Instrument,Georgia,serif;font-style:italic;font-weight:400",
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

// ---------- Ornamento: loza pintada a mano de El Carmen de Viboral ----------

// Pseudoaleatorio determinista: el trazo "a mano" sale igual en cada build.
export function rng(seed) {
  let s = seed >>> 0
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296)
}

const pt = (x, y) => `${x.toFixed(1)} ${y.toFixed(1)}`

// Pétalo como una pincelada: ancho en el medio, punta redondeada.
export function petal(cx, cy, angle, len, wid, r0 = 6) {
  const dx = Math.cos(angle), dy = Math.sin(angle)
  const px = -dy, py = dx
  const bx = cx + dx * r0, by = cy + dy * r0
  const tx = cx + dx * len, ty = cy + dy * len
  const c1 = [bx + dx * len * 0.35 + px * wid, by + dy * len * 0.35 + py * wid]
  const c2 = [tx - dx * len * 0.12 + px * wid * 0.75, ty - dy * len * 0.12 + py * wid * 0.75]
  const c3 = [tx - dx * len * 0.12 - px * wid * 0.75, ty - dy * len * 0.12 - py * wid * 0.75]
  const c4 = [bx + dx * len * 0.35 - px * wid, by + dy * len * 0.35 - py * wid]
  return `M${pt(bx, by)}C${pt(...c1)} ${pt(...c2)} ${pt(tx, ty)}C${pt(...c3)} ${pt(...c4)} ${pt(bx, by)}Z`
}

export function leaf(x, y, angle, len, wid) {
  const dx = Math.cos(angle), dy = Math.sin(angle)
  const px = -dy, py = dx
  const tx = x + dx * len, ty = y + dy * len
  const m = [x + dx * len * 0.5, y + dy * len * 0.5]
  return {
    shape: `M${pt(x, y)}Q${pt(m[0] + px * wid, m[1] + py * wid)} ${pt(tx, ty)}Q${pt(m[0] - px * wid, m[1] - py * wid)} ${pt(x, y)}Z`,
    rib: `M${pt(x, y)}L${pt(x + dx * len * 0.82, y + dy * len * 0.82)}`,
  }
}

/**
 * Flor de cinco pétalos con centro punteado.
 * @returns {string} grupo SVG con clase para animar la "pintada".
 */
export function flower(cx, cy, size, rot, seed, delay = 0, cls = 'paint') {
  const rand = rng(seed)
  const petals = Array.from({ length: 5 }, (_, i) => {
    const a = rot + (i * Math.PI * 2) / 5 + (rand() - 0.5) * 0.12
    const len = size * (0.92 + rand() * 0.16)
    return `<path d="${petal(cx, cy, a, len, size * 0.36)}"/>`
  }).join('')
  const dots = Array.from({ length: 5 }, (_, i) => {
    const a = rot + Math.PI / 5 + (i * Math.PI * 2) / 5
    return `<circle cx="${(cx + Math.cos(a) * size * 0.52).toFixed(1)}" cy="${(cy + Math.sin(a) * size * 0.52).toFixed(1)}" r="${(size * 0.035 + 1).toFixed(1)}"/>`
  }).join('')
  return `<g class="${cls}" style="animation-delay:${delay}ms">
    <g fill="${color.brand}" stroke="${color.brand3}" stroke-width="1.6" stroke-linejoin="round">${petals}</g>
    <g fill="${color.brand3}" opacity=".9">${dots}</g>
    <circle cx="${cx}" cy="${cy}" r="${(size * 0.14).toFixed(1)}" fill="${color.bg}" stroke="${color.lilac}" stroke-width="1.6"/>
    <circle cx="${cx}" cy="${cy}" r="${(size * 0.05).toFixed(1)}" fill="${color.lilac}"/>
  </g>`
}

export function leafPair(x, y, angle, len, delay = 0) {
  const a = leaf(x, y, angle - 0.55, len, len * 0.3)
  const b = leaf(x, y, angle + 0.55, len * 0.85, len * 0.28)
  return `<g class="paint" style="animation-delay:${delay}ms">
    <path d="${a.shape}" fill="${color.brand}" stroke="${color.brand3}" stroke-width="1.4"/>
    <path d="${b.shape}" fill="${color.brand}" stroke="${color.brand3}" stroke-width="1.4"/>
    <path d="${a.rib}" stroke="${color.brand3}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <path d="${b.rib}" stroke="${color.brand3}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  </g>`
}

// Borde de plato: dos aros y arcos repetidos, como el ribete de la loza.
export function plateRim(cx, cy, r, count = 40) {
  const arches = Array.from({ length: count }, (_, i) => {
    const a0 = (i / count) * Math.PI * 2
    const a1 = ((i + 1) / count) * Math.PI * 2
    const ri = r - 16
    const x0 = cx + Math.cos(a0) * ri, y0 = cy + Math.sin(a0) * ri
    const x1 = cx + Math.cos(a1) * ri, y1 = cy + Math.sin(a1) * ri
    const am = (a0 + a1) / 2
    const qx = cx + Math.cos(am) * (r - 2), qy = cy + Math.sin(am) * (r - 2)
    const dx = cx + Math.cos(am) * (r - 24), dy = cy + Math.sin(am) * (r - 24)
    return `<path d="M${pt(x0, y0)}Q${pt(qx, qy)} ${pt(x1, y1)}"/><circle cx="${dx.toFixed(1)}" cy="${dy.toFixed(1)}" r="1.8" stroke="none" fill="${color.brand3}"/>`
  }).join('')
  return `<g fill="none" stroke="${color.brand2}" stroke-width="1.4">
    <circle class="rim" cx="${cx}" cy="${cy}" r="${r + 6}" stroke="${color.brand2}"/>
    <circle class="rim" cx="${cx}" cy="${cy}" r="${r - 34}" stroke="${color.line}"/>
    <g class="wheel" style="transform-origin:${cx}px ${cy}px">${arches}</g>
  </g>`
}

// CSS de las animaciones del ornamento; el estado final es el estado base,
// así que con reduced-motion todo queda visible y quieto.
export const ornamentCss = `
.paint{transform-box:fill-box;transform-origin:center;animation:paint .9s ${ease} both}
@keyframes paint{from{opacity:0;transform:scale(.6) rotate(-8deg)}}
.rim{stroke-dasharray:2200;animation:rim 2.4s ${ease} both}
@keyframes rim{from{stroke-dashoffset:2200}}
.wheel{animation:wheel 140s linear infinite}
@keyframes wheel{to{transform:rotate(360deg)}}
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
