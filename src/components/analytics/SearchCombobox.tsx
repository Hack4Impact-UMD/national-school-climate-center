import { useEffect, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type Option = { id: string; name: string }

type SearchComboboxProps = {
  value: string | null
  onChange: (id: string | null) => void
  options: Option[]
  placeholder?: string
  className?: string
}

export function SearchCombobox({
  value,
  onChange,
  options,
  placeholder = 'Search...',
  className,
}: SearchComboboxProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState<number>(-1)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedName = value ? (options.find((o) => o.id === value)?.name ?? value) : ''

  const filtered = options.filter((o) =>
    o.name.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
        setHighlighted(-1)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [])

  const handleFocus = () => {
    setQuery(selectedName)
    setOpen(true)
    setHighlighted(-1)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setOpen(true)
    setHighlighted(-1)
    if (e.target.value === '') {
      onChange(null)
    }
  }

  const handleSelect = (option: Option) => {
    onChange(option.id)
    setOpen(false)
    setQuery('')
    setHighlighted(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted((h) => Math.max(h - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (highlighted >= 0 && filtered[highlighted]) {
        handleSelect(filtered[highlighted])
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
      setQuery('')
      setHighlighted(-1)
    }
  }

  const displayValue = open ? query : selectedName

  return (
    <div ref={containerRef} className={cn('relative', className ?? 'w-[181px]')}>
      <Input
        type="text"
        value={displayValue}
        onFocus={handleFocus}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="pr-9 font-body bg-background border-0 rounded-lg shadow-sm placeholder:text-[#444444]"
        style={{ color: '#444444' }}
      />
      <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      {open && filtered.length > 0 && (
        <ul className="absolute z-[1001] mt-1 w-full bg-card rounded-lg shadow-lg border max-h-60 overflow-auto">
          {filtered.map((option, i) => (
            <li
              key={option.id}
              onMouseDown={(e) => {
                e.preventDefault()
                handleSelect(option)
              }}
              className={cn(
                'px-3 py-2 text-sm font-body cursor-pointer',
                i === highlighted ? 'bg-muted' : 'hover:bg-muted'
              )}
              style={{ color: '#444444' }}
            >
              {option.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
