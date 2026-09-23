// Genera los paneles estáticos del README: node scripts/build-assets.mjs
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import {
  W, color, font, ease, esc, frame, sectionLabel, glyph, fontFace,
  suminagashi, ornamentCss, measurer, wrap,
} from './lib.mjs'

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets')
const measure = await measurer()
const save = (name, svg) => {
  writeFileSync(join(out, name), svg)
  console.log(`assets/${name}  ${(svg.length / 1024).toFixed(0)} KB`)
}

// Acento de titulares: la misma grotesca, solo en contorno.
const outline = (size, sw = 1.6) =>
  `style="${font.display};font-size:${size}px;letter-spacing:-.02em" fill="none" stroke="${color.lilac}" stroke-width="${sw}" stroke-linejoin="round"`

// ---------------------------------------------------------------- portada
{
  const H = 480
  const x = 56
  const line3 = 'una sola pieza.'
  const l3size = 78
  const l3w = measure('display', line3, l3size) * 0.98
  const box = { x: x - 12, y: 356 - l3size * 0.8, w: l3w + 26, h: l3size * 1.04 }
  const handles = [[box.x, box.y], [box.x + box.w, box.y], [box.x, box.y + box.h], [box.x + box.w, box.y + box.h]]
    .map(([hx, hy]) => `<rect x="${hx - 4.5}" y="${hy - 4.5}" width="9" height="9" fill="${color.bg}" stroke="${color.lilac}" stroke-width="1.5"/>`).join('')
  const dims = `${Math.round(box.w)} × ${Math.round(box.h)}`
  const dimsW = measure('mono', dims, 14) + 16
  const version = 'v19.0.0-beta'
  const versionW = measure('mono', version, 15) + 28
  const perim = Math.ceil(2 * (box.w + box.h))
  const cx = box.x + box.w + 10
  const cy = box.y + box.h * 0.45

  const body = `
  <radialGradient id="aura" cx="1150" cy="250" r="460" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="${color.brand}" stop-opacity=".55"/>
    <stop offset="1" stop-color="${color.brand}" stop-opacity="0"/>
  </radialGradient>
  <rect width="${W}" height="${H}" fill="url(#aura)"/>

  ${suminagashi([
    { x: 1100, y: 235, drops: 26, r: 52 },
    { x: 985, y: 420, drops: 9, r: 30 },
    { x: 1180, y: 50, drops: 7, r: 28 },
  ], [
    { type: 'swirl', x: 1090, y: 245, s: 1.5, falloff: 170 },
    { type: 'tine', x: 0, y: 310, angle: Math.PI, z: 85, u: 0.993 },
    { type: 'tine', x: 0, y: 130, angle: 0, z: 55, u: 0.993 },
    { type: 'wave', amp: 12, wave: 70 },
  ], 760, 'hero')}

  <text x="${x}" y="64" style="${font.mono};font-size:16px;letter-spacing:.04em" fill="${color.muted}">@JJBeta-Dev</text>
  <g transform="translate(${W - 56 - versionW} 42)">
    <rect width="${versionW}" height="32" rx="16" fill="${color.bg}" stroke="${color.line}"/>
    <text x="${versionW / 2}" y="21" text-anchor="middle" style="${font.mono};font-size:15px" fill="${color.lilac}">${version}</text>
  </g>

  <text x="${x}" y="134" style="${font.mono};font-size:19px" fill="${color.muted}">Hola, soy Jerónimo Jiménez Betancur —</text>
  <text x="${x}" y="208" style="${font.display};font-size:60px;letter-spacing:-.02em" fill="${color.text}">Diseño interfaces</text>
  <text x="${x}" y="274" style="${font.display};font-size:60px;letter-spacing:-.02em" fill="${color.text}">que se sienten como</text>
  <text x="${x}" y="356" ${outline(l3size, 1.8)}>${line3}</text>

  <g>
    <rect class="sel" x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" fill="none" stroke="${color.lilac}" stroke-width="1.5"/>
    <g class="pop" style="animation-delay:1500ms">${handles}</g>
    <g class="pop" style="animation-delay:1700ms" transform="translate(${box.x + box.w / 2 - dimsW / 2} ${box.y + box.h + 12})">
      <rect width="${dimsW}" height="24" rx="5" fill="${color.brand2}"/>
      <text x="${dimsW / 2}" y="17" text-anchor="middle" style="${font.mono};font-size:14px" fill="${color.text}">${dims}</text>
    </g>
  </g>

  <g class="cursor-in">
    <g class="cursor-float">
      <path transform="translate(${cx} ${cy}) scale(1.25)" d="M0 0L0 19L5 14.5L8.6 22.5L11.8 21L8.4 13.4L15 13.4Z" fill="${color.brand2}" stroke="${color.text}" stroke-width="1.3" stroke-linejoin="round"/>
      <g transform="translate(${cx + 20} ${cy + 26})">
        <rect width="58" height="26" rx="13" fill="${color.brand2}"/>
        <text x="29" y="18" text-anchor="middle" style="${font.body};font-size:15px" fill="${color.text}">Jero</text>
      </g>
    </g>
  </g>

  <text x="${x}" y="438" style="${font.mono};font-size:17px" fill="${color.muted}">UX/UI Designer <tspan fill="${color.brand3}">·</tspan> Front-End Developer <tspan fill="${color.brand3}">·</tspan> El Carmen de Viboral, CO</text>
  `

  const css = `${ornamentCss}
.sel{stroke-dasharray:${perim};animation:sel 1s ${ease} 1s both}
@keyframes sel{from{stroke-dashoffset:${perim}}}
.pop{animation:pop .35s ${ease} both}
@keyframes pop{from{opacity:0}}
.cursor-in{animation:cin 1.2s ${ease} .8s both}
@keyframes cin{from{opacity:0;transform:translate(140px,90px)}}
.cursor-float{animation:cfloat 5s ease-in-out 2s infinite alternate}
@keyframes cfloat{to{transform:translate(-8px,-5px)}}`

  save('hero.svg', frame({
    h: H,
    title: 'Jerónimo Jiménez Betancur — UX/UI Designer y Front-End Developer',
    desc: 'Portada: "Diseño interfaces que se sienten como una sola pieza." La frase final aparece seleccionada como en Figma, con el cursor de Jero. A la derecha, anillos de tinta en morado al estilo suminagashi.',
    fonts: ['display', 'body', 'mono'],
    css,
    body,
  }))
}

// ---------------------------------------------------------------- principios
{
  const cols = [
    ['01', ':focus-visible', 'Accesible por defecto', 'Contraste real, foco visible y todo usable con teclado. Si alguien no puede usarlo, no está terminado.'],
    ['02', '<main>', 'Semántica que se entiende', 'HTML con sentido para lectores de pantalla y buscadores. El SEO empieza en el marcado, no al final.'],
    ['03', '@theme', 'Una sola pieza', 'Tokens compartidos y ritmo constante: cada sección conversa con la siguiente. Nada flota suelto.'],
  ]
  const inner = W - 112
  const colW = inner / 3
  const pad = 36
  const textW = colW - pad * 2 + 20
  const titleLines = cols.map((c) => wrap(measure, 'display', c[2], 30, textW))
  const maxTitle = Math.max(...titleLines.map((l) => l.length))
  const descTop = 186 + maxTitle * 38 + 8
  const descLines = cols.map((c) => wrap(measure, 'body', c[3], 20, textW))
  const H = descTop + Math.max(...descLines.map((l) => l.length)) * 30 + 44

  const body = cols.map((c, i) => {
    const x0 = 56 + i * colW + (i === 0 ? 0 : pad)
    const tokW = measure('mono', c[1], 16) + 24
    const divider = i === 0 ? '' : `<line x1="${56 + i * colW}" y1="108" x2="${56 + i * colW}" y2="${H - 40}" stroke="${color.line}"/>`
    return `${divider}
    <g class="rise" style="animation-delay:${i * 120}ms">
      <g transform="translate(${x0} 110)">
        <rect width="${tokW}" height="32" rx="8" fill="${color.bg}" stroke="${color.line}"/>
        <text x="12" y="21" style="${font.mono};font-size:16px" fill="${color.lilac}">${esc(c[1])}</text>
      </g>
      ${titleLines[i].map((l, k) => `<text x="${x0}" y="${192 + k * 38}" style="${font.display};font-size:30px;letter-spacing:-.01em" fill="${color.text}">${esc(l)}</text>`).join('')}
      ${descLines[i].map((l, k) => `<text x="${x0}" y="${descTop + k * 30}" style="${font.body};font-size:20px" fill="${color.muted}">${esc(l)}</text>`).join('')}
    </g>`
  }).join('')

  save('principles.svg', frame({
    h: H,
    title: 'Cómo trabajo',
    desc: cols.map((c) => `${c[2]}: ${c[3]}`).join(' '),
    fonts: ['display', 'body', 'mono'],
    css: `.rise{animation:rise .7s ${ease} both}@keyframes rise{from{opacity:0;transform:translateY(10px)}}`,
    body: `${sectionLabel('01', 'Cómo trabajo')}${body}`,
  }))
}

// ---------------------------------------------------------------- stack
{
  const rows = [
    ['Diseño', [['pencil', 'Papel y lápiz'], ['figma', 'Figma'], ['adobephotoshop', 'Photoshop']]],
    ['Código', [['html5', 'HTML'], ['css', 'CSS'], ['javascript', 'JavaScript'], ['typescript', 'TypeScript'], ['react', 'React'], ['tailwindcss', 'Tailwind CSS']]],
    ['Datos y forms', [['reactquery', 'TanStack Query'], ['zustand', 'Zustand'], ['zod', 'Zod'], ['reacthookform', 'React Hook Form']]],
    ['Automatización', [['make', 'Make'], ['n8n', 'n8n'], ['ollama', 'Ollama']]],
    ['Flujo', [['vite', 'Vite'], ['vitest', 'Vitest'], ['git', 'Git'], ['yaak', 'Yaak'], ['zedindustries', 'Zed']]],
  ]
  const x0 = 232
  const maxX = W - 56
  const rowH = 64
  let y = 112
  const parts = []
  rows.forEach(([label, items], r) => {
    const lines = [[]]
    let x = x0
    for (const [slug, name] of items) {
      const w = 22 + 10 + measure('body', name, 20)
      if (x + w > maxX) { lines.push([]); x = x0 }
      lines.at(-1).push({ slug, name, x })
      x += w + 34
    }
    const h = lines.length * 44 + 20
    const cy = y + 32
    parts.push(`<text x="56" y="${cy + 6}" style="${font.mono};font-size:15px;letter-spacing:.1em" fill="${color.muted}">${label.toUpperCase()}</text>`)
    lines.forEach((ln, li) => ln.forEach((it, k) => {
      const iy = cy + li * 44
      parts.push(`<g class="rise" style="animation-delay:${r * 90 + k * 40}ms">
        ${glyph(it.slug, it.x, iy - 11)}
        <text x="${it.x + 32}" y="${iy + 7}" style="${font.body};font-size:20px" fill="${color.text}">${esc(it.name)}</text>
      </g>`)
    }))
    y += Math.max(rowH, h)
    parts.push(`<line x1="56" y1="${y}" x2="${W - 56}" y2="${y}" stroke="${color.lineSoft}"/>`)
  })
  // Lo que viene: Next.js, marcado como en progreso.
  const cy = y + 36
  const nx = x0
  const tag = 'en progreso'
  const tagW = measure('mono', tag, 14) + 36
  const nextW = measure('body', 'Next.js', 20)
  parts.push(`<text x="56" y="${cy + 6}" style="${font.mono};font-size:15px;letter-spacing:.1em" fill="${color.muted}">SIGUIENTE</text>
    ${glyph('nextdotjs', nx, cy - 11, 22, color.lilac, 0.6)}
    <text x="${nx + 32}" y="${cy + 7}" style="${font.body};font-size:20px" fill="${color.muted}">Next.js</text>
    <g transform="translate(${nx + 32 + nextW + 16} ${cy - 14})">
      <rect width="${tagW}" height="28" rx="14" fill="none" stroke="${color.brand2}" stroke-dasharray="4 4"/>
      <circle class="pulse" cx="15" cy="14" r="4" fill="${color.brand3}"/>
      <text x="26" y="19" style="${font.mono};font-size:14px" fill="${color.lilac}">${tag}</text>
    </g>`)
  const H = cy + 56

  save('stack.svg', frame({
    h: H,
    title: 'Herramientas',
    desc: `${rows.map(([l, it]) => `${l}: ${it.map((i) => i[1]).join(', ')}.`).join(' ')} Siguiente: Next.js, en progreso.`,
    fonts: ['body', 'mono'],
    css: `.rise{animation:rise .6s ${ease} both}@keyframes rise{from{opacity:0;transform:translateY(8px)}}
.pulse{transform-box:fill-box;transform-origin:center;animation:pulse 1.8s ease-in-out infinite}
@keyframes pulse{50%{opacity:.35;transform:scale(.7)}}`,
    body: `${sectionLabel('02', 'Herramientas')}${parts.join('')}`,
  }))
}

// ---------------------------------------------------------------- automatización
{
  const nodes = [
    ['telegram', 'Telegram', 'Disparador', 'Llega el mensaje o el audio de la reunión'],
    ['groq', 'Groq', 'Transcribe', 'El audio pasa a texto en segundos'],
    ['googlegemini', 'Gemini', 'Planea', 'Pasos, prioridad y responsable según habilidades'],
    ['notion', 'Notion', 'Crea', 'La tarea queda lista y asignada'],
    ['telegram', 'Telegram', 'Avisa', 'Confirma al equipo en el mismo chat'],
  ]
  const gap = 34
  const nw = (W - 112 - gap * (nodes.length - 1)) / nodes.length
  const descs = nodes.map((n) => wrap(measure, 'body', n[3], 17, nw - 36))
  const nh = 104 + Math.max(...descs.map((d) => d.length)) * 23

  const sub = wrap(measure, 'body', 'Le mando a un bot de Telegram lo que salió de una reunión y el flujo planea la tarea, la crea en Notion y sugiere a quién asignarla según las habilidades de cada persona del equipo.', 20, 780)
  const top = 198 + sub.length * 30 + 40
  const H = top + nh + 84
  const madeW = measure('mono', 'hecho en Make', 14) + 50
  const title = 'Automatizo lo'
  const titleW = measure('display', title, 46) * 0.98 + 10
  const portY = top + 46

  const cards = nodes.map((n, i) => {
    const x = 56 + i * (nw + gap)
    const wire = i === nodes.length - 1 ? '' : `
      <path class="wire" d="M${x + nw + 5} ${portY}H${x + nw + gap - 5}" stroke="${color.brand3}" stroke-width="1.6" fill="none"/>`
    return `<g class="rise" style="animation-delay:${i * 140}ms">
      <rect x="${x}" y="${top}" width="${nw}" height="${nh}" rx="16" fill="${color.bg}" stroke="${i === 0 ? color.brand3 : color.line}"/>
      ${glyph(n[0], x + 18, top + 35)}
      <text x="${x + 50}" y="${top + 53}" style="${font.body};font-size:19px" fill="${color.text}">${n[1]}</text>
      <text x="${x + 18}" y="${top + 88}" style="${font.mono};font-size:13px;letter-spacing:.1em" fill="${color.brand3}">${String(i + 1).padStart(2, '0')} ${n[2].toUpperCase()}</text>
      ${descs[i].map((l, k) => `<text x="${x + 18}" y="${top + 116 + k * 23}" style="${font.body};font-size:17px" fill="${color.muted}">${esc(l)}</text>`).join('')}
      <circle cx="${x}" cy="${portY}" r="4.5" fill="${color.bg}" stroke="${color.brand3}" stroke-width="1.5"/>
      ${i === nodes.length - 1 ? '' : `<circle cx="${x + nw}" cy="${portY}" r="4.5" fill="${color.brand3}"/>`}
    </g>${wire}`
  }).join('')

  const body = `${sectionLabel('03', 'Automatización')}
  <g transform="translate(${W - 56 - madeW} 42)">
    <rect width="${madeW}" height="32" rx="16" fill="${color.bg}" stroke="${color.line}"/>
    ${glyph('make', 16, 7, 18)}
    <text x="42" y="21" style="${font.mono};font-size:14px" fill="${color.lilac}">hecho en Make</text>
  </g>
  <text x="56" y="152" style="${font.display};font-size:46px;letter-spacing:-.02em" fill="${color.text}">${title}<tspan x="${56 + titleW}" ${outline(46, 1.4)}>repetitivo.</tspan></text>
  ${sub.map((l, k) => `<text x="56" y="${198 + k * 30}" style="${font.body};font-size:20px" fill="${color.muted}">${esc(l)}</text>`).join('')}
  ${cards}
  <text x="56" y="${H - 40}" style="${font.mono};font-size:14px" fill="${color.muted}">APIs de Telegram, Groq, Gemini y Notion <tspan fill="${color.brand3}">·</tspan> también con n8n y modelos locales en Ollama</text>`

  save('automation.svg', frame({
    h: H,
    title: 'Automatización: automatizo lo repetitivo',
    desc: `Flujo hecho en Make: ${nodes.map((n, i) => `${i + 1}. ${n[1]}, ${n[2].toLowerCase()}: ${n[3]}.`).join(' ')} Usa las APIs de Telegram, Groq, Gemini y Notion. También trabajo con n8n y modelos locales en Ollama.`,
    fonts: ['display', 'body', 'mono'],
    css: `.rise{animation:rise .6s ${ease} both}@keyframes rise{from{opacity:0;transform:translateY(8px)}}
@media (prefers-reduced-motion: no-preference){.wire{stroke-dasharray:5 5;animation:wire 1s linear infinite}}
@keyframes wire{to{stroke-dashoffset:-10}}`,
    body,
  }))
}

// ---------------------------------------------------------------- changelog
{
  const left = 56
  const tx = 584
  const bulletX = tx + 40
  const bulletW = W - 56 - bulletX - 8
  const releases = [
    { v: 'v19.0', meta: 'actual · sep 2026', mark: '+', live: true, items: [
      'Interfaces en React y TypeScript con Tailwind CSS',
      'Accesibilidad, semántica y SEO desde el primer commit',
      'Pruebas con Vitest y código ordenado con ESLint',
    ] },
    { v: 'v20.0', meta: 'roadmap · sep 2027', mark: '→', live: false, items: [
      'Next.js: App Router, Server Components y SSR',
      'Proyectos personales públicos, aquí mismo',
    ] },
  ]
  let y = 128
  const tl = []
  releases.forEach((rel, i) => {
    const dot = rel.live
      ? `<circle class="ring" cx="${tx}" cy="${y - 6}" r="7" fill="none" stroke="${color.brand3}"/><circle cx="${tx}" cy="${y - 6}" r="6" fill="${color.brand3}"/>`
      : `<circle cx="${tx}" cy="${y - 6}" r="6" fill="${color.bg}" stroke="${color.brand3}" stroke-width="1.6"/>`
    tl.push(`${dot}<text x="${bulletX - 12}" y="${y}" style="${font.mono};font-size:17px"><tspan fill="${color.lilac}">${rel.v}</tspan><tspan fill="${color.muted}" dx="12">${rel.meta}</tspan></text>`)
    y += 42
    rel.items.forEach((it) => {
      const lines = wrap(measure, 'body', it, 19, bulletW)
      tl.push(`<text x="${bulletX - 12}" y="${y}" style="${font.mono};font-size:17px" fill="${color.brand3}">${esc(rel.mark)}</text>`)
      lines.forEach((l, k) => tl.push(`<text x="${bulletX + 12}" y="${y + k * 27}" style="${font.body};font-size:19px" fill="${rel.live ? color.text : color.muted}">${esc(l)}</text>`))
      y += lines.length * 27 + 8
    })
    if (i === 0) y += 34
  })
  const H = Math.max(y + 24, 400)
  // Resta el letter-spacing de -.02em que opentype no aplica.
  const titleW = measure('display', 'Siempre en', 54) * 0.98 + 6
  const sub = wrap(measure, 'body', 'Todavía me falta mucho por aprender, y esa es la mejor parte: cada proyecto sale un poco mejor que el anterior.', 20, 480)

  const body = `${sectionLabel('04', 'Changelog')}
  <line x1="${tx}" y1="${128}" x2="${tx}" y2="${H - 40}" stroke="${color.line}"/>
  <text x="${left}" y="170" style="${font.display};font-size:54px;letter-spacing:-.02em" fill="${color.text}">Siempre en<tspan x="${left + titleW}" ${outline(54, 1.5)}>beta.</tspan></text>
  ${sub.map((l, k) => `<text x="${left}" y="${222 + k * 30}" style="${font.body};font-size:20px" fill="${color.muted}">${esc(l)}</text>`).join('')}
  <text x="${left}" y="${H - 44}" style="${font.mono};font-size:15px" fill="${color.muted}"><tspan fill="${color.brand3}">*</tspan> el número de versión es mi edad.</text>
  ${tl.join('')}`

  save('changelog.svg', frame({
    h: H,
    title: 'Changelog: siempre en beta',
    desc: `Todavía me falta mucho por aprender. ${releases.map((r) => `${r.v} (${r.meta}): ${r.items.join('; ')}.`).join(' ')} El número de versión es mi edad.`,
    fonts: ['display', 'body', 'mono'],
    css: `.ring{transform-box:fill-box;transform-origin:center;animation:ring 2.2s ${ease} infinite}
@keyframes ring{from{opacity:.9;transform:scale(1)}to{opacity:0;transform:scale(2.6)}}`,
    body,
  }))
}

// ---------------------------------------------------------------- contacto
{
  const H = 300
  const body = `
  <radialGradient id="aura" cx="1110" cy="290" r="420" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="${color.brand}" stop-opacity=".5"/>
    <stop offset="1" stop-color="${color.brand}" stop-opacity="0"/>
  </radialGradient>
  <rect width="${W}" height="${H}" fill="url(#aura)"/>
  ${suminagashi([
    { x: 1110, y: 250, drops: 22, r: 44 },
    { x: 1000, y: 300, drops: 7, r: 26 },
  ], [
    { type: 'swirl', x: 1100, y: 255, s: 1.4, falloff: 150 },
    { type: 'tine', x: 0, y: 280, angle: Math.PI, z: 75, u: 0.993 },
    { type: 'tine', x: 0, y: 130, angle: 0, z: 45, u: 0.993 },
    { type: 'wave', amp: 12, wave: 70 },
  ], 780, 'contact')}
  ${sectionLabel('06', 'Contacto')}
  <text x="56" y="150" style="${font.display};font-size:46px;letter-spacing:-.02em" fill="${color.text}">¿Una vacante, un proyecto</text>
  <text x="56" y="206" style="${font.display};font-size:46px;letter-spacing:-.02em" fill="${color.text}">o ganas de hablar de <tspan ${outline(46, 1.4)}>diseño?</tspan></text>
  <text x="56" y="252" style="${font.body};font-size:20px" fill="${color.muted}">Escríbeme, respondo rápido. Los enlaces están justo debajo.</text>`

  save('contact.svg', frame({
    h: H,
    title: 'Contacto',
    desc: '¿Una vacante, un proyecto o ganas de hablar de diseño? Escríbeme, respondo rápido.',
    fonts: ['display', 'body', 'mono'],
    css: ornamentCss,
    body,
  }))
}

// ---------------------------------------------------------------- botones
function button(file, label, glyph, filled, title) {
  const h = 56
  const w = Math.ceil(56 + 12 + measure('body', label, 19) + 28)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}">
<title>${esc(title)}</title>
<style>${frame({ h: 1, fonts: ['body'], body: '', title: '', desc: '' }).match(/@font-face[^\n]+/)[0]}</style>
<rect x=".75" y=".75" width="${w - 1.5}" height="${h - 1.5}" rx="${h / 2 - 0.75}" fill="${filled ? color.brand : color.bg}" stroke="${filled ? color.brand3 : color.line}" stroke-width="1.5"/>
<g transform="translate(26 17)">${glyph}</g>
<text x="62" y="35" style="${font.body};font-size:19px" fill="${color.text}">${esc(label)}</text>
</svg>
`
  save(file, svg)
}

button('btn-email.svg', 'jjbetacode@gmail.com',
  `<rect x="0" y="2" width="22" height="17" rx="3" fill="none" stroke="${color.lilac}" stroke-width="1.7"/><path d="M1.5 4.5L11 11.5L20.5 4.5" fill="none" stroke="${color.lilac}" stroke-width="1.7" stroke-linejoin="round"/>`,
  true, 'Escribir a jjbetacode@gmail.com')
button('btn-instagram.svg', '@jnz_jero',
  glyph('instagram', 0, 0),
  false, 'Instagram @jnz_jero')
