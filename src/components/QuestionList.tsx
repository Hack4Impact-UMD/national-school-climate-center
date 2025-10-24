// File: src/components/pulse-survey/QuestionList.tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import type { Question } from "@/types/surveybuilder";

export function QuestionList({
  items,
  activeId,
  onSelect,
  onRename,
  onDelete,
}: {
  items: Question[];
  activeId?: string;
  onSelect: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      {items.map((q, idx) => (
        <QuestionRow
          key={q.id}
          index={idx + 1}
          question={q}
          active={q.id === activeId}
          onSelect={() => onSelect(q.id)}
          onRename={(name) => onRename(q.id, name)}
          onDelete={() => onDelete(q.id)}
        />
      ))}
    </div>
  );
}

function QuestionRow({
  index,
  question,
  active,
  onSelect,
  onRename,
  onDelete,
}: {
  index: number;
  question: Question;
  active?: boolean;
  onSelect: () => void;
  onRename: (name: string) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(question.name);

  return (
    <div className="flex items-center gap-4">
      <div className="w-8 text-right text-sm font-body">{index}.</div>
      <Card className={`flex-1 border-primary ${active ? "ring-2 ring-primary" : ""}`}>
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex-1">
            {editing ? (
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onRename(name.trim() || question.name);
                    setEditing(false);
                  }
                }}
                onBlur={() => {
                  onRename(name.trim() || question.name);
                  setEditing(false);
                }}
                autoFocus
                className="border-secondary font-body"
              />
            ) : (
              <button onClick={onSelect} className="w-full rounded-md px-6 py-3 text-left text-base font-body hover:bg-muted">
                {question.name}
              </button>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button size="icon" variant="ghost" onClick={() => setEditing((v) => !v)} aria-label="Rename">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={onDelete} aria-label="Delete">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
