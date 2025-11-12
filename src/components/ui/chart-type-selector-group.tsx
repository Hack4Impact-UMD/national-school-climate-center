import * as React from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { type ButtonVariants } from './button-variants'

/* RadioGroup wrapper */
const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn('flex gap-2', className)} // make horizontal by default
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

/* RadioGroupItem as a button */
interface RadioButtonProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
    ButtonVariants {
  asChild?: boolean
}

{
  /* Refactored RadioButton component that uses Button inside RadioGroup.Item */
}
const RadioButton = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioButtonProps
>(({ className, variant, size, asChild = true, children, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item ref={ref} asChild {...props}>
      <Button
        className={cn('h-7 rounded-md px-4', className)}
        variant={variant}
      >
        {children} {/* <-- This ensures the label shows */}
      </Button>
    </RadioGroupPrimitive.Item>
  )
})

export { RadioGroup, RadioButton }
