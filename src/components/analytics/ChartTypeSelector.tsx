import {
  RadioGroup,
  RadioButton,
} from '@/components/ui/chart-type-selector-group'
import * as React from 'react'

export default function ChartTypeSelector() {
  const [value, setValue] = React.useState('bar')

  /* Modify options for chart types */
  const options = [
    { label: 'Bar Chart', value: 'bar' },
    { label: 'Pie Chart', value: 'pie' },
    { label: 'Another', value: 'x' },
  ]

  return (
    <div className="p-1 border-primary border-2 rounded-md inline-block">
      {/* RadioGroup ensures only one selection at a time */}
      <RadioGroup value={value} onValueChange={setValue} className="flex gap-2">
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
