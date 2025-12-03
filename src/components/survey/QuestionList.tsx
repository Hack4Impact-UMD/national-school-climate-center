import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Trash2, PencilLine, Copy } from 'lucide-react'
import type { Question } from '@/types/surveybuilder'

export function QuestionList({
  items,
  activeId,
  onSelect,
  onRename,
  onDelete,
  onDuplicate,
}: {
  items: Question[]
  activeId?: string
  onSelect: (id: string) => void
  onRename: (id: string, name: string) => void
  onDelete: (id: string) => void
  onDuplicate: (q: Question) => void
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
          onRename={(name) => onRename(q.id, name)}
          onDelete={() => onDelete(q.id)}
          onDuplicate={() => onDuplicate(q)}
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
  onRename,
  onDelete,
  onDuplicate,
}: {
  index: number
  question: Question
  active?: boolean
  onSelect: () => void
  onRename: (name: string) => void
  onDelete: () => void
  onDuplicate: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(question.name)

  return (
    <div className="flex min-w-0 w-full items-center gap-4">
      <div className="w-8 text-right text-sm">{index}.</div>
      <Card
        className={`flex-1 max-w-none ${active ? 'ring-2 ring-primary' : ''}`}
      >
        <CardContent className="flex w-full items-center gap-3 p-2">
          <div className="flex-1">
            {editing ? (
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onRename(name.trim() || question.name)
                    setEditing(false)
                  }
                }}
                onBlur={() => {
                  onRename(name.trim() || question.name)
                  setEditing(false)
                }}
                autoFocus
              />
            ) : (
              <button
                onClick={onSelect}
                className="w-full rounded-md px-6 py-4 text-left text-base hover:bg-muted"
              >
                {question.name}
              </button>
            )}
          </div>
          <div className="flex items-center gap-1">
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
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setEditing((v) => !v)}
              aria-label="Edit"
            >
              <PencilLine className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
