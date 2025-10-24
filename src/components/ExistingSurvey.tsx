import { Button } from "@/components/ui/button"

interface Props {
  title?: string
  description?: string
  onOpen?: () => void
}

export default function ExistingSurvey({
  title = "Survey Title",
  description = "Short description of the survey goes here.",
  onOpen,
}: Props) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="rounded-md border bg-transparent p-6">
        <div className="flex flex-col items-center text-center gap-4">
          <h3 className="text-2xl font-normal font-body text-heading">{title}</h3>
          <p className="text-sm font-light font-body">{description}</p>
          <Button
            type="button"
            onClick={() => onOpen?.()}
            className="bg-primary hover:bg-primary/90 font-body text-sm font-normal"
      
          >
            Duplicate and Work
          </Button>
        </div>
      </div>
    </div>
  )
}
