import type { ChartType } from '../../types/chartTypes'
import { Button } from '@/components/ui/button'

type Props = {
  value: ChartType
  onChange: (next: ChartType) => void
}

export default function ChartTypeSelector({ value, onChange }: Props) {
  // options you support
  const options: { label: string; value: ChartType }[] = [
    { label: 'Bar Chart', value: 'bar' },
    { label: 'Pie Chart', value: 'pie' },
    { label: 'Another', value: 'x' },
  ]

  return (
    <div className="inline-flex rounded-2xl border border-primary p-1">
      {options.map((opt) => {
        const active = value === opt.value

        return (
          <Button
            key={opt.value}
            type="button"
            variant={'ghost'}
            onClick={() => onChange(opt.value)}
            className={
              'px-4 py-2 text-sm rounded-lg transition-colors ' +
              (active
                ? 'bg-primary text-white shadow-sm'
                : 'text-heading hover:bg-secondary/20')
            }
          >
            {opt.label}
          </Button>
        )
      })}
    </div>
  )
}
