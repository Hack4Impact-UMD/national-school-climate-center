import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import * as React from 'react'

export default function SelectionMenu() {
  const [value, setValue] = React.useState('option1')
  return (
    <RadioGroup value={value} onValueChange={setValue} className="flex gap-4">
      <label className="flex items-center space-x-2">
        <RadioGroupItem value="option1" />
        <span>Bar Chart</span>
      </label>

      <label className="flex items-center space-x-2">
        <RadioGroupItem value="option2" />
        <span>Pie Chart</span>
      </label>

      <label className="flex items-center space-x-2">
        <RadioGroupItem value="option3" />
        <span>Another</span>
      </label>
    </RadioGroup>
  )
}
