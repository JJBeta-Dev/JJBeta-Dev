// Tablero de contribuciones con el mismo sistema visual del perfil.
// Lo ejecuta .github/workflows/contributions.yml cada día.
// Local: GITHUB_TOKEN=$(gh auth token) node scripts/contributions.mjs
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { W, color, font, ease, frame, sectionLabel } from './lib.mjs'

const user = process.env.GH_USER || 'JJBeta-Dev'
const token = process.env.GITHUB_TOKEN
if (!token) throw new Error('Falta GITHUB_TOKEN')

const query = `query($login:String!){user(login:$login){contributionsCollection{
  contributionCalendar{totalContributions weeks{contributionDays{date contributionCount contributionLevel}}}}}}`

const res = await fetch('https://api.github.com/graphql', {
  method: 'POST',
  headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ query, variables: { login: user } }),
})
const json = await res.json()
if (json.errors) throw new Error(JSON.stringify(json.errors))
const cal = json.data.user.contributionsCollection.contributionCalendar

const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
const fmt = (iso) => {
  const [, m, d] = iso.split('-').map(Number)
  return `${d} ${months[m - 1]}`
}

const days = cal.weeks.flatMap((w) => w.contributionDays)

// Rachas: la actual no se rompe si hoy todavía no hay contribuciones.
let longest = 0, run = 0
for (const d of days) {
  run = d.contributionCount > 0 ? run + 1 : 0
  longest = Math.max(longest, run)
}
let current = 0
for (let i = days.length - 1; i >= 0; i--) {
  if (days[i].contributionCount > 0) current++
  else if (i === days.length - 1) continue
  else break
}
const best = days.reduce((a, b) => (b.contributionCount > a.contributionCount ? b : a), days[0])

const levels = {
  NONE: color.cell,
  FIRST_QUARTILE: '#43106A',
  SECOND_QUARTILE: '#62309E',
  THIRD_QUARTILE: '#9068E6',
  FOURTH_QUARTILE: '#D8CCFF',
}

const cell = 15, gap = 4, step = cell + gap
const gx = 104, gy = 262
const H = 470

const cells = cal.weeks.map((w, c) => w.contributionDays.map((d) => {
  const r = new Date(`${d.date}T00:00:00Z`).getUTCDay()
  const ring = d.date === best.date && best.contributionCount > 0
    ? `<rect x="${gx + c * step - 3}" y="${gy + r * step - 3}" width="${cell + 6}" height="${cell + 6}" rx="6" fill="none" stroke="${color.lilac}" stroke-width="1.2"/>`
    : ''
  return `<rect class="c" style="animation-delay:${c * 14}ms" x="${gx + c * step}" y="${gy + r * step}" width="${cell}" height="${cell}" rx="4" fill="${levels[d.contributionLevel]}"><title>${d.contributionCount} · ${fmt(d.date)}</title></rect>${ring}`
}).join('')).join('')

// Etiqueta de mes en la semana que contiene su día 1.
const monthLabels = cal.weeks.map((w, c) => {
  const first = w.contributionDays.find((d) => d.date.endsWith('-01'))
  if (!first || c > cal.weeks.length - 3) return ''
  const m = Number(first.date.split('-')[1]) - 1
  return `<text x="${gx + c * step}" y="${gy - 14}" style="${font.mono};font-size:14px" fill="${color.muted}">${months[m]}</text>`
}).join('')

const dayLabels = [[1, 'lun'], [3, 'mié'], [5, 'vie']]
  .map(([r, l]) => `<text x="56" y="${gy + r * step + 12}" style="${font.mono};font-size:14px" fill="${color.muted}">${l}</text>`).join('')

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`
const stats = [
  [String(cal.totalContributions), 'contribuciones'],
  [plural(current, 'día', 'días'), 'racha actual'],
  [plural(longest, 'día', 'días'), 'racha más larga'],
  [String(best.contributionCount), `mejor día · ${fmt(best.date)}`],
]
const statW = (W - 112) / 4
const statsSvg = stats.map(([v, l], i) => {
  const x = 56 + i * statW
  const div = i === 0 ? '' : `<line x1="${x - 24}" y1="112" x2="${x - 24}" y2="186" stroke="${color.line}"/>`
  return `${div}<text x="${x}" y="156" style="${font.display};font-size:44px;letter-spacing:-.02em" fill="${color.text}">${v}</text>
  <text x="${x}" y="184" style="${font.mono};font-size:15px" fill="${color.muted}">${l}</text>`
}).join('')

const today = new Date().toISOString().slice(0, 10)
const legendX = W - 56 - 5 * step - 44
const legend = `<text x="${legendX - 16}" y="${H - 44}" text-anchor="end" style="${font.mono};font-size:14px" fill="${color.muted}">menos</text>
  ${Object.values(levels).map((f, i) => `<rect x="${legendX + i * step}" y="${H - 56}" width="${cell}" height="${cell}" rx="4" fill="${f}"/>`).join('')}
  <text x="${legendX + 5 * step + 8}" y="${H - 44}" style="${font.mono};font-size:14px" fill="${color.muted}">más</text>`

const body = `${sectionLabel('05', 'Actividad')}
  <text x="${W - 56}" y="64" text-anchor="end" style="${font.mono};font-size:15px" fill="${color.muted}">últimos 12 meses · actualizado ${fmt(today)}</text>
  ${statsSvg}
  ${monthLabels}${dayLabels}${cells}
  <text x="56" y="${H - 44}" style="${font.mono};font-size:14px" fill="${color.muted}">Incluye contribuciones en repositorios privados.</text>
  ${legend}`

const svg = frame({
  h: H,
  title: 'Actividad en GitHub',
  desc: `${cal.totalContributions} contribuciones en los últimos 12 meses. Racha actual: ${current} días. Racha más larga: ${longest} días. Mejor día: ${best.contributionCount} contribuciones el ${fmt(best.date)}.`,
  fonts: ['display', 'mono'],
  css: `.c{transform-box:fill-box;transform-origin:center;animation:c .5s ${ease} both}
@keyframes c{from{opacity:0;transform:scale(.4)}}`,
  body,
})

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'contributions.svg')
writeFileSync(out, svg)
console.log(`contributions.svg: ${cal.totalContributions} contribuciones, racha ${current}/${longest}`)
