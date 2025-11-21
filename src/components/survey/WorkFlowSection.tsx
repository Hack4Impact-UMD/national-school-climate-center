import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, PencilLine, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export type WorkflowQuestion = {
  id: string
  label: string
  prompt: string
  inputType: string
  optionsType: string
  options: string[]
}

export default function WorkflowSection({
  questions = defaultQuestions,
  onEdit,
  onDelete,
}: {
  questions?: WorkflowQuestion[]
  onEdit?: (q: WorkflowQuestion) => void
  onDelete?: (q: WorkflowQuestion) => void
}) {
  const [selectedId, setSelectedId] = useState(questions[0]?.id)
  const selected = questions.find((q) => q.id === selectedId)

  return (
    <div className="flex flex-col md:flex-row gap-6 font-body">
      <div className="flex-1 rounded-2xl border-none p-4 md:p-6">
        <div className="relative space-y-6">
          {questions.map((q, i) => (
            <div key={q.id} className="relative">
              <WorkflowRow
                index={`${i + 1}.`}
                label={q.label}
                active={q.id === selectedId}
                onClick={() => setSelectedId(q.id)}
                onEdit={() => onEdit?.(q)}
                onDelete={() => onDelete?.(q)}
              />
              {i < questions.length - 1 && (
                <ConnectorVertical className="left-6 md:left-7 top-full h-8" />
              )}
            </div>
          ))}

          <Card className="rounded-2xl border-primary">
            <CardContent className="flex items-center justify-between p-3 md:p-4">
              <div className="text-sm md:text-base text-primary">
                Add a Schedule Workflow
              </div>
              <Button
                size="icon"
                variant="ghost"
                aria-label="Add schedule workflow"
                className="shadow-none hover:bg-transparent"
              >
                <Plus className="h-5 w-5 text-primary" />
              </Button>
            </CardContent>
          </Card>

          <div className="mt-8 flex justify-center">
            <Button className="px-6">Publish Survey</Button>
          </div>
        </div>
      </div>

      <div className="w-full md:w-[420px] shrink-0">
        {selected ? (
          <Card className="rounded-2xl border-primary h-full">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl font-body">
                {selected.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="whitespace-pre-wrap">{selected.prompt}</p>
              <div className="font-semibold">
                Input Type:{' '}
                <span className="font-normal">{selected.inputType}</span>
              </div>
              <div className="font-semibold">
                Options Type:{' '}
                <span className="font-normal">{selected.optionsType}</span>
              </div>
              {selected.options.length > 0 && (
                <>
                  <div className="font-semibold">Options:</div>
                  <ol className="ml-5 list-decimal space-y-1">
                    {selected.options.map((o, idx) => (
                      <li key={idx}>{o}</li>
                    ))}
                  </ol>
                </>
              )}
              <Button className="mt-2 w-fit bg-secondary">Edit Question</Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="rounded-2xl border-2 flex items-center justify-center text-muted-foreground text-sm h-full">
            Select a question to preview
          </Card>
        )}
      </div>
    </div>
  )
}

/* ---------------- helpers ---------------- */

function WorkflowRow({
  index,
  label,
  active,
  onClick,
  onEdit,
  onDelete,
}: {
  index: string
  label: string
  active?: boolean
  onClick?: () => void
  onEdit?: () => void
  onDelete?: () => void
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 select-none text-right text-sm">{index}</div>
      <Card
        onClick={onClick}
        className={cn(
          'flex-1 cursor-pointer rounded-2xl border-primary transition-colors',
          active ? 'bg-blue-50 border-primary' : 'hover:bg-muted/40'
        )}
      >
        <CardContent className="flex items-center justify-between p-2 md:p-3">
          <div className="w-full rounded-2xl px-4 text-left text-base py-3">
            {label}
          </div>
          <div className="ml-3 flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              aria-label="Delete"
              onClick={(e) => {
                e.stopPropagation()
                onDelete?.()
              }}
              className="shadow-none hover:bg-transparent"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              aria-label="Edit"
              onClick={(e) => {
                e.stopPropagation()
                onEdit?.()
              }}
              className="shadow-none hover:bg-transparent"
            >
              <PencilLine className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ConnectorVertical({ className }: { className?: string }) {
  return (
    <div className={cn('pointer-events-none absolute -z-10', className)}>
      <div className="h-full border-l-2 border-dashed border-muted-foreground/50" />
      <div className="mx-[1px] h-0 w-0 border-x-4 border-t-8 border-x-transparent border-t-muted-foreground/50" />
    </div>
  )
}

/// sample data
const defaultQuestions: WorkflowQuestion[] = [
  {
    id: 'q1',
    label: 'Question Name 1',
    prompt: 'What is your favorite color?',
    inputType: 'Single Choice',
    optionsType: 'Multiple Choice',
    options: ['Red', 'Blue', 'Green', 'Yellow'],
  },
  {
    id: 'q2',
    label: 'Question Name 2',
    prompt: 'How many hours do you work per day?',
    inputType: 'Number',
    optionsType: 'N/A',
    options: [],
  },
  {
    id: 'q3',
    label: 'Question Name 3',
    prompt: 'Select your preferred working style:',
    inputType: 'Multiple Choice',
    optionsType: 'Dropdown',
    options: ['Remote', 'Hybrid', 'On-site'],
  },
]
