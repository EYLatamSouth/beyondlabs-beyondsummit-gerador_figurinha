import type { Country } from '@/types/stamp'

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
