import { X } from 'lucide-react'
import type { ActiveFilter } from '@/types/analytics'

type FilterChipsProps = {
  activeFilters: ActiveFilter[]
  onRemoveFilter: (key: ActiveFilter['key']) => void
}

export function FilterChips({
  activeFilters,
  onRemoveFilter,
}: FilterChipsProps) {
  if (activeFilters.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2">
      {activeFilters.map((filter) => (
        <div
          key={filter.key}
          className="inline-flex items-center gap-1.5 rounded-lg border border-primary bg-background px-4 py-1.5 text-sm font-body shadow-sm"
        >
          <span className="font-medium" style={{ color: '#2F6CC0' }}>
            {filter.value}
          </span>
          <button
            onClick={() => onRemoveFilter(filter.key)}
            className="rounded-full p-0.5 hover:bg-primary/10 transition-colors"
            aria-label={`Remove ${filter.label} filter`}
          >
            <X className="h-3.5 w-3.5" style={{ color: '#2F6CC0' }} />
          </button>
        </div>
      ))}
    </div>
  )
}
