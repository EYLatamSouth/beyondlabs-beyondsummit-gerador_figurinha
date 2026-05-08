import type { Country } from '@/types/stamp'

// ── Country colour palettes for dynamic template tinting ──────────────────────
// Each entry is [primary, secondary]:
//   primary   → replaces the green  (#449845) in the BS silhouette
//   secondary → replaces the yellow (#FAE64D) in the BS silhouette
// Brasil is the identity/no-op (uses the template's original colours).
export const COUNTRY_PALETTE: Record<string, [string, string]> = {
  br: ['#449845', '#FAE64D'], // Brasil      — Verde + Amarelo (original, no-op)
  ar: ['#74ACDF', '#FFFFFF'], // Argentina   — Azul celeste + Branco
  mx: ['#006847', '#CE1126'], // México      — Verde + Vermelho
  cl: ['#D52B1E', '#FFFFFF'], // Chile       — Vermelho + Branco
  co: ['#FCD116', '#003893'], // Colômbia    — Amarelo (banda superior) + Azul
  uy: ['#001489', '#FFFFFF'], // Uruguai     — Azul + Branco
  pe: ['#D91023', '#FFFFFF'], // Peru        — Vermelho + Branco
  ec: ['#FFD100', '#003580'], // Equador     — Amarelo + Azul
  bo: ['#D52B1E', '#F4C430'], // Bolívia     — Vermelho + Amarelo
  cr: ['#002B7F', '#C8102E'], // Costa Rica  — Azul + Vermelho
  cu: ['#002A8F', '#CC0001'], // Cuba        — Azul + Vermelho
  sv: ['#0F47AF', '#FFFFFF'], // El Salvador — Azul + Branco
  gt: ['#4997D0', '#FFFFFF'], // Guatemala   — Azul celeste + Branco
  hn: ['#0073CF', '#FFFFFF'], // Honduras    — Azul + Branco
  ni: ['#3A75C4', '#FFFFFF'], // Nicarágua   — Azul + Branco
  pa: ['#003893', '#D21034'], // Panamá      — Azul + Vermelho
  py: ['#D52B1E', '#002B7F'], // Paraguai    — Vermelho + Azul
  pr: ['#EF3340', '#002D62'], // Porto Rico  — Vermelho + Azul (triângulo)
  do: ['#002D62', '#CF142B'], // Rep. Dom.   — Azul + Vermelho
  ve: ['#CF142B', '#FFD700'], // Venezuela   — Vermelho + Amarelo
  pt: ['#006600', '#FF0000'], // Portugal    — Verde escuro + Vermelho
  es: ['#AA151B', '#F1BF00'], // Espanha     — Vermelho + Amarelo
}

// Returns the [primary, secondary] palette for a country, defaulting to Brasil.
export function getCountryPalette(code: string): [string, string] {
  return COUNTRY_PALETTE[code.toLowerCase()] ?? COUNTRY_PALETTE['br']
}

export function getFlagEmoji(code: string): string {
  return code
    .toUpperCase()
    .replace(/./g, (ch) => String.fromCodePoint(0x1f1e6 - 65 + ch.charCodeAt(0)))
}

export const COUNTRIES: Country[] = [
  // Featured — visible as chips in Level 1
  { code: 'br', codeDisplay: 'BRA', name: 'Brasil',    featured: true },
  { code: 'ar', codeDisplay: 'ARG', name: 'Argentina', featured: true },
  { code: 'mx', codeDisplay: 'MEX', name: 'México',    featured: true },
  { code: 'cl', codeDisplay: 'CHL', name: 'Chile',     featured: true },
  { code: 'co', codeDisplay: 'COL', name: 'Colômbia',  featured: true },
  { code: 'uy', codeDisplay: 'URU', name: 'Uruguai',   featured: true },
  { code: 'pe', codeDisplay: 'PER', name: 'Peru',      featured: true },
  { code: 'ec', codeDisplay: 'ECU', name: 'Equador',   featured: true },

  // Non-featured — searchable via Level 2 modal
  { code: 'bo', codeDisplay: 'BOL', name: 'Bolívia',             featured: false },
  { code: 'cr', codeDisplay: 'CRI', name: 'Costa Rica',          featured: false },
  { code: 'cu', codeDisplay: 'CUB', name: 'Cuba',                featured: false },
  { code: 'sv', codeDisplay: 'SLV', name: 'El Salvador',         featured: false },
  { code: 'gt', codeDisplay: 'GTM', name: 'Guatemala',           featured: false },
  { code: 'hn', codeDisplay: 'HND', name: 'Honduras',            featured: false },
  { code: 'ni', codeDisplay: 'NIC', name: 'Nicarágua',           featured: false },
  { code: 'pa', codeDisplay: 'PAN', name: 'Panamá',              featured: false },
  { code: 'py', codeDisplay: 'PRY', name: 'Paraguai',            featured: false },
  { code: 'pr', codeDisplay: 'PRI', name: 'Porto Rico',          featured: false },
  { code: 'do', codeDisplay: 'DOM', name: 'República Dominicana', featured: false },
  { code: 've', codeDisplay: 'VEN', name: 'Venezuela',           featured: false },
  { code: 'pt', codeDisplay: 'POR', name: 'Portugal',            featured: false },
  { code: 'es', codeDisplay: 'ESP', name: 'Espanha',             featured: false },
]

export const FEATURED_COUNTRIES = COUNTRIES.filter((c) => c.featured)

export function getCountryByCode(code: string): Country | undefined {
  return COUNTRIES.find((c) => c.code === code.toLowerCase())
}
