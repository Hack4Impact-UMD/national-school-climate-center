import { useId } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import QuestionSetting from "@/components/survey/QuestionSetting";
import type { Question } from "@/types/surveybuilder";

export function QuestionForm({
  value,
  onChange,
}: {
  value: Question;
  onChange: (q: Question) => void;
}) {
  const baseId = useId();

  function update<K extends keyof Question>(key: K, next: Question[K]) {
    onChange({ ...value, [key]: next });
  }

  const showOptions = value.inputType !== "text" && value.questionType === "multiple-choice";

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor={`${baseId}-qtype`}>Question Type</Label>
          <Select
            value={value.questionType}
            onValueChange={(v) => update("questionType", v as Question["questionType"])}
          >
            <SelectTrigger id={`${baseId}-qtype`}>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
              <SelectItem value="open-ended">Open Ended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search for related questions (UI-only right now) */}
        <div className="grid gap-2">
          <Label htmlFor={`${baseId}-search`}>Search for Related Questions</Label>
          <div className="relative">
            <Input
              id={`${baseId}-search`}
              placeholder="Enter keyword"
              className="pr-9"
            />
            <Search className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Question Settings */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <QuestionSetting label="Question Setting 1" options={["Option 1", "Option 2"]} />
        <QuestionSetting label="Question Setting 2" options={["Option 1", "Option 2"]} />
      </div>

      {/* Prompt */}
      <div className="grid gap-2">
        <Label htmlFor={`${baseId}-prompt`}>Question</Label>
        <Textarea
          id={`${baseId}-prompt`}
          placeholder="Type the question here"
          value={value.prompt}
          onChange={(e) => update("prompt", e.target.value)}
          rows={3}
        />
      </div>

      {/* Answer Options */}
  <div className="grid gap-3">
  <div className="text-sm font-medium">Answer Options</div>

  <div className={cn("grid gap-3", showOptions ? "grid-cols-2 md:grid-cols-4" : "grid-cols-1")}>
    {showOptions ? (
      <>
        {value.options.map((opt, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border">
              <span className="h-2 w-2 rounded-full" />
            </span>
            <Input
              value={opt}
              onChange={(e) => {
                const next = [...value.options];
                next[idx] = e.target.value;
                update("options", next);
              }}
              className="border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 font-body"
            />
            <Button
              variant="ghost"
              size="icon"
              aria-label="Remove option"
              className="shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              onClick={() => update("options", value.options.filter((_, i) => i !== idx))}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          variant="secondary"
          onClick={() =>
            update("options", [...value.options, `Option ${value.options.length + 1}`])
          }
          className="justify-start shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <Plus className="mr-2 h-4 w-4" /> Add option
        </Button>
      </>
    ) : (
      <Input disabled placeholder="Free text (no options)" className="border-none shadow-none" />
    )}
  </div>
</div>

    </div>
  );
}
