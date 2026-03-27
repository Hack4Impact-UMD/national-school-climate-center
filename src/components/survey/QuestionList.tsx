import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Trash2, PencilLine, Copy } from 'lucide-react'
import type { Question } from '@/types/surveybuilder'
import { QuestionForm } from '@/components/survey/QuestionForm'

export function QuestionList({
  items,
  activeId,
  onSelect,
  onDelete,
  onDuplicate,
  onChange,
}: {
  items: Question[]
  activeId?: string
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onDuplicate?: (id: string) => void
  onChange: (q: Question) => void
}) {
  return (
    <div className="w-full space-y-3">
      {items.map((q, idx) => (
        <QuestionRow
          key={q.id}
          index={idx + 1}
          question={q}
          active={q.id === activeId}
          onSelect={() => onSelect(q.id)}
          onDelete={() => onDelete(q.id)}
          onDuplicate={() => onDuplicate?.(q.id)}
          onChange={onChange}
        />
      ))}
    </div>
  )
}

function QuestionRow({
  index,
  question,
  active,
  onSelect,
  onDelete,
  onDuplicate,
  onChange,
}: {
  index: number
  question: Question
  active?: boolean
  onSelect: () => void
  onDelete: () => void
  onDuplicate?: () => void
  onChange: (q: Question) => void
}) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(question.name)
  const [expanded, setExpanded] = useState(false)

  function commitRename() {
    const trimmed = name.trim()
    if (trimmed && trimmed !== question.name) {
      onChange({ ...question, name: trimmed })
    } else {
      setName(question.name)
    }
    setEditing(false)
  }

  return (
    <div className="flex min-w-0 w-full items-start gap-4">
      <div className="w-8 shrink-0 text-right text-sm mt-4">{index}.</div>
      <div className="flex-1 min-w-0 space-y-2">
        <Card>
          <CardContent className="flex w-full items-center gap-3 p-2">
            <div className="flex-1 min-w-0">
              {editing ? (
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') commitRename()
                    if (e.key === 'Escape') {
                      setName(question.name)
                      setEditing(false)
                    }
                  }}
                  onBlur={commitRename}
                  onFocus={(e) => e.target.select()}
                  autoFocus
                  className="w-full rounded-md px-6 py-4 text-base md:text-base bg-muted border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 h-auto"
                />
              ) : (
                <button
                  onClick={() => {
                    onSelect()
                    setEditing(true)
                  }}
                  className="w-full rounded-md px-6 py-4 text-left text-base hover:bg-muted cursor-text"
                >
                  {question.name}
                </button>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={onDelete}
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                aria-label="Duplicate"
                onClick={onDuplicate}
                disabled={!onDuplicate}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setExpanded((v) => !v)}
                aria-label="Edit question"
                className={expanded ? 'text-primary' : ''}
              >
                <PencilLine className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {expanded && (
          <Card className="border border-primary/20 rounded-xl">
            <CardContent className="p-4">
              <QuestionForm
                key={question.id}
                value={question}
                onChange={onChange}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
