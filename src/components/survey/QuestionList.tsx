import { useState } from 'react'
import type { DragEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Trash2, PencilLine, Copy, ArrowDown, ArrowUp, GripVertical } from 'lucide-react'
import type { Question } from '@/types/surveybuilder'
import { QuestionForm } from '@/components/survey/QuestionForm'
import { cn } from '@/lib/utils'

export function QuestionList({
  items,
  activeId,
  onSelect,
  onDelete,
  onDuplicate,
  onMove,
  onChange,
}: {
  items: Question[]
  activeId?: string
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onDuplicate?: (id: string) => void
  onMove: (fromIndex: number, toIndex: number) => void
  onChange: (q: Question) => void
}) {
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dropTargetId, setDropTargetId] = useState<string | null>(null)

  function moveById(id: string, toIndex: number) {
    const fromIndex = items.findIndex((q) => q.id === id)
    if (fromIndex === -1 || toIndex < 0 || toIndex >= items.length) return
    onMove(fromIndex, toIndex)
  }

  return (
    <div className="w-full space-y-3">
      {items.map((q, idx) => (
        <QuestionRow
          key={q.id}
          index={idx + 1}
          itemIndex={idx}
          totalItems={items.length}
          question={q}
          active={q.id === activeId}
          dragging={q.id === draggingId}
          dropTarget={q.id === dropTargetId && q.id !== draggingId}
          onSelect={() => onSelect(q.id)}
          onDelete={() => onDelete(q.id)}
          onDuplicate={() => onDuplicate?.(q.id)}
          onMoveUp={() => moveById(q.id, idx - 1)}
          onMoveDown={() => moveById(q.id, idx + 1)}
          onDragStart={() => setDraggingId(q.id)}
          onDragEnter={() => {
            if (draggingId && draggingId !== q.id) setDropTargetId(q.id)
          }}
          onDragOver={(event) => event.preventDefault()}
          onDrop={() => {
            if (draggingId) moveById(draggingId, idx)
            setDraggingId(null)
            setDropTargetId(null)
          }}
          onDragEnd={() => {
            setDraggingId(null)
            setDropTargetId(null)
          }}
          onChange={onChange}
        />
      ))}
    </div>
  )
}

function QuestionRow({
  index,
  itemIndex,
  totalItems,
  question,
  active,
  dragging,
  dropTarget,
  onSelect,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onDragStart,
  onDragEnter,
  onDragOver,
  onDrop,
  onDragEnd,
  onChange,
}: {
  index: number
  itemIndex: number
  totalItems: number
  question: Question
  active?: boolean
  dragging?: boolean
  dropTarget?: boolean
  onSelect: () => void
  onDelete: () => void
  onDuplicate?: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onDragStart: () => void
  onDragEnter: () => void
  onDragOver: (event: DragEvent<HTMLDivElement>) => void
  onDrop: () => void
  onDragEnd: () => void
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
    <div
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={cn(
        'flex min-w-0 w-full items-start gap-4 rounded-md transition-opacity',
        dragging && 'opacity-50',
        dropTarget && 'outline outline-2 outline-primary/50 outline-offset-2'
      )}
    >
      <div className="w-8 shrink-0 text-right text-sm mt-4">{index}.</div>
      <div className="flex-1 min-w-0 space-y-2">
        <Card className={active ? 'border-primary/50' : undefined}>
          <CardContent className="flex w-full items-center gap-3 p-2">
            <button
              type="button"
              draggable
              onDragStart={(event) => {
                event.dataTransfer.effectAllowed = 'move'
                event.dataTransfer.setData('text/plain', question.id)
                onDragStart()
              }}
              onDragEnd={onDragEnd}
              className="shrink-0 cursor-grab rounded-sm text-muted-foreground active:cursor-grabbing"
              aria-label={`Drag question ${index} to reorder`}
            >
              <GripVertical className="h-5 w-5" aria-hidden="true" />
            </button>
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
                onClick={onMoveUp}
                aria-label="Move question up"
                disabled={itemIndex === 0}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={onMoveDown}
                aria-label="Move question down"
                disabled={itemIndex === totalItems - 1}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
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
