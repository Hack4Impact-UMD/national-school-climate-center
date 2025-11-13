import {
  RadioGroup,
  RadioButton,
} from '@/components/ui/chart-type-selector-group'
import type { ChartType } from './types'

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
    <div className="p-1 border-primary border-2 rounded-md inline-block">
      <RadioGroup
        value={value}
        onValueChange={(v) => onChange(v as ChartType)}
        className="flex gap-2"
      >
        {options.map((opt) => (
          <RadioButton
            key={opt.value}
            value={opt.value}
            variant={value === opt.value ? 'default' : 'ghost'}
            size="default"
            className={value === opt.value ? 'text-white' : 'text-primary'}
          >
            {opt.label}
          </RadioButton>
        ))}
      </RadioGroup>
    </div>
  )
}
