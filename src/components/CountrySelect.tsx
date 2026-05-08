import { useState } from 'react'
import { Globe, Search, Check } from 'lucide-react'
import { COUNTRIES, FEATURED_COUNTRIES, getFlagEmoji } from '@/lib/countries'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

interface CountrySelectProps {
  value: string
  onChange: (code: string) => void
}

export function CountrySelect({ value, onChange }: CountrySelectProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [query, setQuery] = useState('')

  const nonFeatured = COUNTRIES.filter((c) => !c.featured)
  const filtered = nonFeatured.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()),
  )

  const selectedNonFeatured = nonFeatured.find((c) => c.code === value)

  function handleNonFeaturedSelect(code: string): void {
    onChange(code)
    setDialogOpen(false)
    setQuery('')
  }

  function handleDialogOpenChange(open: boolean): void {
    setDialogOpen(open)
    if (!open) setQuery('')
  }

  return (
    <div className="space-y-2.5">
      {/* Level 1 — Featured chips (2×4 on mobile, 4×2 on sm+) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {FEATURED_COUNTRIES.map((country) => {
          const isSelected = value === country.code
          return (
            <button
              key={country.code}
              type="button"
              onClick={() => onChange(isSelected ? '' : country.code)}
              className={[
                'flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border transition-all duration-150 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(26,92,42,0.4)]',
                isSelected
                  ? 'bg-[#1A5C2A] text-white border-[#1A5C2A] shadow-sm scale-[0.98]'
                  : 'bg-[#F5F5F5] text-[#374151] border-[#D1D5DB] hover:bg-[#F0FDF4] hover:border-[#3D9A52] hover:scale-[1.02]',
              ].join(' ')}
            >
              <span className="text-[22px] leading-none">{getFlagEmoji(country.code)}</span>
              <span
                className="leading-tight text-center font-body font-medium"
                style={{ fontSize: '10.5px' }}
              >
                {country.name}
              </span>
            </button>
          )
        })}
      </div>

      {/* Selected non-featured indicator */}
      {selectedNonFeatured && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F0FDF4] border border-[#1A5C2A]">
          <span className="text-lg">{getFlagEmoji(selectedNonFeatured.code)}</span>
          <span className="text-sm font-body font-medium text-[#1A5C2A] flex-1">
            {selectedNonFeatured.name}
          </span>
          <Check size={14} className="text-[#1A5C2A]" />
        </div>
      )}

      {/* Level 2 trigger */}
      <button
        type="button"
        onClick={() => setDialogOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-[#D1D5DB] bg-white text-[#374151] text-sm font-body font-medium hover:bg-[#F0FDF4] hover:border-[#3D9A52] hover:text-[#1A5C2A] transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(26,92,42,0.4)]"
      >
        <Globe size={14} />
        <span>+ Ver mais países</span>
      </button>

      {/* Level 2 — Modal */}
      <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="max-w-sm rounded-2xl p-0 gap-0 overflow-hidden [&>button]:text-white [&>button]:opacity-90 [&>button]:hover:opacity-100">
          {/* Modal header */}
          <div className="bg-[#1A5C2A] px-5 py-4">
            <DialogHeader>
              <DialogTitle className="font-display text-xl font-bold text-white uppercase tracking-wide">
                Outros países
              </DialogTitle>
              <DialogDescription className="text-[#7DC48A] text-sm font-body mt-0.5">
                Selecione o seu país de origem
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="px-5 py-4 space-y-3 bg-white">
            {/* Search */}
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar país..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#D1D5DB] text-sm font-body bg-[#F9FAFB] placeholder:text-[#9CA3AF] text-[#111111] focus:outline-none focus:border-[#1A5C2A] focus:ring-2 focus:ring-[rgba(26,92,42,0.1)] transition-all duration-150"
              />
            </div>

            {/* Country list */}
            <div className="max-h-60 overflow-y-auto -mx-1 px-1 space-y-0.5">
              {filtered.length === 0 ? (
                <p className="text-center text-sm text-[#9CA3AF] py-8 font-body">
                  Nenhum país encontrado
                </p>
              ) : (
                filtered.map((country) => {
                  const isSelected = value === country.code
                  return (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleNonFeaturedSelect(country.code)}
                      className={[
                        'w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(26,92,42,0.4)]',
                        isSelected
                          ? 'bg-[#F0FDF4] text-[#1A5C2A] font-semibold'
                          : 'text-[#374151] hover:bg-[#F5F5F5]',
                      ].join(' ')}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="text-lg leading-none">{getFlagEmoji(country.code)}</span>
                        <span className="font-body">{country.name}</span>
                      </span>
                      {isSelected && <Check size={14} className="text-[#1A5C2A] shrink-0" />}
                    </button>
                  )
                })
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
