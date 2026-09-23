// Genera los paneles estáticos del README: node scripts/build-assets.mjs
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import {
  W, color, font, ease, esc, frame, sectionLabel, icon, fontFace,
  flower, leafPair, plateRim, ornamentCss, measurer, wrap,
} from './lib.mjs'

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets')
const measure = await measurer()
const save = (name, svg) => {
  writeFileSync(join(out, name), svg)
  console.log(`assets/${name}  ${(svg.length / 1024).toFixed(0)} KB`)
}

// El plato de loza que se repite en portada y contacto.
function plate(cx, cy, r, scale = 1, baseDelay = 0) {
  const s = (v) => v * scale
  const X = (v) => cx + s(v), Y = (v) => cy + s(v)
  return `
  <g>
    ${plateRim(cx, cy, r)}
    <g fill="none" stroke="${color.brand3}" stroke-width="2.2" stroke-linecap="round" class="stem">
      <path d="M${X(-200)} ${Y(190)}C${X(-160)} ${Y(130)} ${X(-140)} ${Y(80)} ${X(-90)} ${Y(0)}"/>
      <path d="M${X(-90)} ${Y(0)}C${X(-50)} ${Y(-50)} ${X(-20)} ${Y(-80)} ${X(15)} ${Y(-120)}"/>
      <path d="M${X(-90)} ${Y(0)}C${X(-50)} ${Y(50)} ${X(-20)} ${Y(100)} ${X(0)} ${Y(135)}"/>
      <path d="M${X(-150)} ${Y(-70)}c${s(-10)} ${s(-2)} ${s(-14)} ${s(8)} ${s(-8)} ${s(13)}c${s(6)} ${s(5)} ${s(14)} ${s(-2)} ${s(10)} ${s(-9)}"/>
    </g>
    ${leafPair(X(-150), Y(80), 2.4, s(44), baseDelay + 500)}
    ${leafPair(X(-40), Y(-60), -2.3, s(36), baseDelay + 650)}
    ${leafPair(X(-55), Y(80), 0.9, s(40), baseDelay + 700)}
    ${flower(X(-90), Y(0), s(64), -0.3, 7, baseDelay + 300)}
    ${flower(X(15), Y(-120), s(44), 0.4, 11, baseDelay + 450)}
    ${flower(X(0), Y(135), s(36), 0.9, 23, baseDelay + 600)}
    <g fill="${color.lilac}" class="paint" style="animation-delay:${baseDelay + 800}ms">
      ${[[-200, -60, 3], [-185, -85, 2.4], [-165, -105, 2], [-140, -120, 2.6], [-112, -128, 2], [-84, -128, 1.6]]
        .map(([x, y, rr]) => `<circle cx="${X(x)}" cy="${Y(y)}" r="${rr}"/>`).join('')}
    </g>
  </g>`
}

const stemCss = `
.stem path{stroke-dasharray:420;animation:stem 1.6s ${ease} both}
@keyframes stem{from{stroke-dashoffset:420}}`

// ---------------------------------------------------------------- portada
{
  const H = 480
  const x = 56
  const line3 = 'una sola pieza.'
  const l3size = 84
  const l3w = measure('serif', line3, l3size)
  const box = { x: x - 10, y: 356 - l3size * 0.74, w: l3w + 24, h: l3size * 0.98 }
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

  ${plate(1160, 250, 270)}

  <text x="${x}" y="64" style="${font.mono};font-size:16px;letter-spacing:.04em" fill="${color.muted}">@JJBeta-Dev</text>
  <g transform="translate(${W - 56 - versionW} 42)">
    <rect width="${versionW}" height="32" rx="16" fill="${color.bg}" stroke="${color.line}"/>
    <text x="${versionW / 2}" y="21" text-anchor="middle" style="${font.mono};font-size:15px" fill="${color.lilac}">${version}</text>
  </g>

  <text x="${x}" y="134" style="${font.mono};font-size:19px" fill="${color.muted}">Hola, soy Jerónimo Jiménez Betancur —</text>
  <text x="${x}" y="208" style="${font.display};font-size:60px;letter-spacing:-.02em" fill="${color.text}">Diseño interfaces</text>
  <text x="${x}" y="274" style="${font.display};font-size:60px;letter-spacing:-.02em" fill="${color.text}">que se sienten como</text>
  <text x="${x}" y="356" style="${font.serif};font-size:${l3size}px" fill="${color.lilac}">${line3}</text>

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

  const css = `${ornamentCss}${stemCss}
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
    desc: 'Portada: "Diseño interfaces que se sienten como una sola pieza." La frase final aparece seleccionada como en Figma, con el cursor de Jero. A la derecha, un plato de loza pintada a mano de El Carmen de Viboral en morado.',
    fonts: ['display', 'body', 'serif', 'mono'],
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
    ['Diseño', [['figma', 'Figma'], ['adobephotoshop', 'Photoshop'], ['affinity', 'Affinity']]],
    ['Código', [['html5', 'HTML'], ['css', 'CSS'], ['javascript', 'JavaScript'], ['typescript', 'TypeScript'], ['react', 'React'], ['tailwindcss', 'Tailwind CSS']]],
    ['Build y test', [['vite', 'Vite'], ['vitest', 'Vitest'], ['eslint', 'ESLint'], ['npm', 'npm']]],
    ['Flujo', [['git', 'Git'], ['github', 'GitHub'], ['postman', 'Postman'], ['yaak', 'Yaak'], ['warp', 'Warp'], ['zedindustries', 'Zed']]],
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
        <path transform="translate(${it.x} ${iy - 11}) scale(${22 / 24})" d="${icon(it.slug)}" fill="${color.lilac}"/>
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
    <path transform="translate(${nx} ${cy - 11}) scale(${22 / 24})" d="${icon('nextdotjs')}" fill="${color.lilac}" opacity=".6"/>
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
  const titleW = measure('display', 'Siempre en', 54) * 0.98 + 14
  const sub = wrap(measure, 'body', 'Todavía me falta mucho por aprender, y esa es la mejor parte: cada proyecto sale un poco mejor que el anterior.', 20, 480)

  const body = `${sectionLabel('03', 'Changelog')}
  <line x1="${tx}" y1="${128}" x2="${tx}" y2="${H - 40}" stroke="${color.line}"/>
  <text x="${left}" y="170" style="${font.display};font-size:54px;letter-spacing:-.02em" fill="${color.text}">Siempre en<tspan x="${left + titleW}" style="${font.serif};font-size:68px" fill="${color.lilac}">beta.</tspan></text>
  ${sub.map((l, k) => `<text x="${left}" y="${222 + k * 30}" style="${font.body};font-size:20px" fill="${color.muted}">${esc(l)}</text>`).join('')}
  <text x="${left}" y="${H - 44}" style="${font.mono};font-size:15px" fill="${color.muted}"><tspan fill="${color.brand3}">*</tspan> el número de versión es mi edad.</text>
  ${tl.join('')}`

  save('changelog.svg', frame({
    h: H,
    title: 'Changelog: siempre en beta',
    desc: `Todavía me falta mucho por aprender. ${releases.map((r) => `${r.v} (${r.meta}): ${r.items.join('; ')}.`).join(' ')} El número de versión es mi edad.`,
    fonts: ['display', 'body', 'serif', 'mono'],
    css: `.ring{transform-box:fill-box;transform-origin:center;animation:ring 2.2s ${ease} infinite}
@keyframes ring{from{opacity:.9;transform:scale(1)}to{opacity:0;transform:scale(2.6)}}`,
    body,
  }))
}

// ---------------------------------------------------------------- contacto
{
  const H = 340
  const body = `
  <radialGradient id="aura" cx="1120" cy="290" r="420" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="${color.brand}" stop-opacity=".5"/>
    <stop offset="1" stop-color="${color.brand}" stop-opacity="0"/>
  </radialGradient>
  <rect width="${W}" height="${H}" fill="url(#aura)"/>
  ${plate(1120, 290, 230, 0.8)}
  ${sectionLabel('05', 'Contacto')}
  <text x="56" y="150" style="${font.display};font-size:46px;letter-spacing:-.02em" fill="${color.text}">¿Una vacante, un proyecto</text>
  <text x="56" y="206" style="${font.display};font-size:46px;letter-spacing:-.02em" fill="${color.text}">o ganas de hablar de <tspan style="${font.serif};font-size:58px" fill="${color.lilac}">diseño?</tspan></text>
  <text x="56" y="252" style="${font.body};font-size:20px" fill="${color.muted}">Escríbeme, respondo rápido. Los enlaces están justo debajo.</text>
  <text x="56" y="${H - 44}" style="${font.mono};font-size:15px" fill="${color.muted}">Hecho a mano en El Carmen de Viboral, tierra de la loza pintada.</text>`

  save('contact.svg', frame({
    h: H,
    title: 'Contacto',
    desc: '¿Una vacante, un proyecto o ganas de hablar de diseño? Escríbeme, respondo rápido. Hecho a mano en El Carmen de Viboral, tierra de la loza pintada.',
    fonts: ['display', 'body', 'serif', 'mono'],
    css: `${ornamentCss}${stemCss}`,
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
  `<path transform="scale(${22 / 24})" d="${icon('instagram')}" fill="${color.lilac}"/>`,
  false, 'Instagram @jnz_jero')
