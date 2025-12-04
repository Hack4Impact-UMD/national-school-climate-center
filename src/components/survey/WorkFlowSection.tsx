import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
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
  questions,
  onDelete,
  onReview,
  selectedId: controlledSelectedId,
  setSelectedId: setControlledSelectedId,
  onSelect,
  onRename,
}: {
  questions?: WorkflowQuestion[]
  onEdit?: (q: WorkflowQuestion) => void
  onDelete?: (q: WorkflowQuestion) => void
  onReview?: () => void
  selectedId?: string
  setSelectedId?: (id: string) => void
  onSelect?: (id: string) => void
  onRename?: (id: string, name: string) => void
}) {
  const safeQuestions =
    (questions && questions.length ? questions : defaultQuestions) ?? []
  const [internalSelectedId, setInternalSelectedId] = useState(
    safeQuestions[0]?.id
  )
  const selectedId = controlledSelectedId ?? internalSelectedId
  const setSelectedId = setControlledSelectedId ?? setInternalSelectedId
  const selected = safeQuestions.find((q) => q.id === selectedId)

  return (
    <div className="flex flex-col md:flex-row gap-6 font-body">
      <div className="flex-1 rounded-2xl border-none p-4 md:p-6">
        <div className="relative space-y-6">
          {safeQuestions.map((q, i) => (
            <div key={q.id} className="relative">
              <WorkflowRow
                index={`${i + 1}`}
                label={q.label}
                active={q.id === selectedId}
                onSelect={() => {
                  setSelectedId(q.id)
                  onSelect?.(q.id)
                }}
                onEdit={() => onEdit?.(q)}
                onDelete={() => onDelete?.(q)}
                onRename={onRename ? (name) => onRename(q.id, name) : undefined}
              />
              {i < safeQuestions.length - 1 && (
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
            <Button className="px-6 cursor-pointer" onClick={onReview}>
              Review Survey
            </Button>
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
              <Button
                className="mt-2 w-fit bg-secondary"
                onClick={() => onEdit?.(selected)}
              >
                Edit Question
              </Button>
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
  active,
  onSelect,
  onEdit,
  onDelete,
  onRename,
}: {
  index: string
  label: string
  active?: boolean
  onSelect?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onRename?: (name: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(label)

  useEffect(() => setName(label), [label])

  return (
    <div className="flex items-center gap-3">
      <div className="w-8 text-right text-sm">{index}.</div>
      <Card
        onClick={onSelect}
        className={cn(
          'flex-1 cursor-pointer rounded-2xl border-primary transition-colors',
          active ? 'bg-blue-50 border-primary' : 'hover:bg-muted/40'
        )}
      >
        <CardContent className="flex items-center justify-between p-2 md:p-3">
          <div className="flex-1">
            {editing ? (
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => {
                  onRename?.(name.trim() || label)
                  setEditing(false)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onRename?.(name.trim() || label)
                    setEditing(false)
                  }
                }}
                autoFocus
              />
            ) : (
              <span className="block px-4 py-3 text-left text-base">
                {label}
              </span>
            )}
          </div>
          <div className="ml-3 flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation()
                onDelete?.()
              }}
              aria-label="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation()
                if (onRename) {
                  setEditing(true)
                  return
                }
                onEdit?.()
              }}
              aria-label="Edit Name"
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
