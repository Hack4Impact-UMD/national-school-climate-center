import { useId } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Question } from "@/types/surveybuilder";


export function QuestionForm({ value, onChange }: { value: Question; onChange: (q: Question) => void }) {
  const baseId = useId();

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor={`${baseId}-qtype`} className="font-body">Question Type</Label>
          <Select
            value={value.questionType}
            onValueChange={(v) => onChange({ ...value, questionType: v as Question["questionType"] })}
          >
            <SelectTrigger id={`${baseId}-qtype`} className="border-secondary">
              <SelectValue placeholder="Select type" className="font-body" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="multiple-choice" className="font-body">Multiple Choice</SelectItem>
              <SelectItem value="open-ended" className="font-body">Open Ended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor={`${baseId}-search`} className="font-body">Search for Related Questions</Label>
          <div className="relative">
            <Input id={`${baseId}-search`} placeholder="Enter keyword" className="pr-9 border-secondary font-body" />
            <Search className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor={`${baseId}-itype`} className="font-body">Input Type</Label>
          <Select
            value={value.inputType}
            onValueChange={(v) => onChange({ ...value, inputType: v as Question["inputType"] })}
          >
            <SelectTrigger id={`${baseId}-itype`} className="border-secondary">
              <SelectValue placeholder="Select input" className="font-body" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single" className="font-body">Single Choice</SelectItem>
              <SelectItem value="multiple" className="font-body">Multiple Choice</SelectItem>
              <SelectItem value="text" className="font-body">Free Text</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor={`${baseId}-prompt`} className="font-body">Question</Label>
        <Textarea
          id={`${baseId}-prompt`}
          placeholder="Type the question here"
          value={value.prompt}
          onChange={(e) => onChange({ ...value, prompt: e.target.value })}
          rows={3}
          className="border-secondary font-body"
        />
      </div>

      <div className="grid gap-3">
        <div className="text-sm font-medium font-body">Answer Types</div>
        <div className={cn("grid gap-3", value.inputType === "text" ? "grid-cols-1" : "grid-cols-2 md:grid-cols-4")}>
          {value.inputType === "text" ? (
            <Input disabled placeholder="Free text (no options)" className="border-secondary font-body" />
          ) : (
            value.options.map((opt, idx) => (
              <Input
                key={idx}
                value={opt}
                onChange={(e) => {
                  const next = [...value.options];
                  next[idx] = e.target.value;
                  onChange({ ...value, options: next });
                }}
                className="border-secondary font-body"
                placeholder={`Option ${idx + 1}`}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}