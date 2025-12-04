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
    <div className="rounded-2xl border bg-transparent p-6 flex-none w-full md:w-80 md:h-56">
      <div className="flex flex-col items-center text-center h-full">
        <h3 className="text-2xl font-normal font-body text-heading">{title}</h3>
        <p className="text-sm font-light font-body my-auto">{description}</p>
        <Button
          type="button"
          onClick={() => onOpen?.()}
          className="bg-primary hover:bg-primary/90 font-body text-sm font-normal"
        >
          Duplicate and Work
        </Button>
      </div>
    </div>
  )
}
