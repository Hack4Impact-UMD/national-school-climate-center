import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

type SearchInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search a question',
}: SearchInputProps) {
  return (
    <div className="relative w-[240px]">
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pr-9 font-body bg-background border-0 rounded-lg shadow-sm placeholder:text-[#444444]"
        style={{ color: '#444444' }}
      />
      <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
}
