import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SurveyHeader } from "../components/SurveyHeader";
import { QuestionForm } from "../components/QuestionForm";
import { QuestionList } from "../components/QuestionList";
import type { Question } from "@/types/surveybuilder";
import WorkflowSection from "@/components/WorkFlowSection";


export default function CreateSurvey() {

  // Default just for UI
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "q1",
      name: "Sample Question 1",
      prompt: "How satisfied are you with your current experience?",
      questionType: "multiple-choice",
      inputType: "single",
      options: ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied"],
    },
  ]);

  const [activeId, setActiveId] = useState<string>("q1");

  const active = useMemo(
    () => questions.find((q) => q.id === activeId) ?? questions[0],
    [questions, activeId]
  );

  function addBlankQuestion() {
    const id = crypto.randomUUID();
    const next: Question = {
      id,
      name: `Question ${questions.length + 1}`,
      prompt: "",
      questionType: "multiple-choice",
      inputType: "single",
      options: ["Option 1", "Option 2"],
    };
    setQuestions((prev) => [...prev, next]);
    setActiveId(id);
  }

  function updateActiveQuestion(updated: Question) {
    setQuestions((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
  }

  function deleteQuestion(id: string) {
    setQuestions((prev) => {
      const filtered = prev.filter((q) => q.id !== id);
      if (activeId === id) setActiveId(filtered[0]?.id ?? "");
      return filtered;
    });
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <img src="/logo.png" alt="National School Climate Center" className="w-40" />
      <SurveyHeader title="Survey – Challenge" subtitle="" />

      <Tabs defaultValue="question" className="mt-4">
        <TabsList className="w-full justify-start bg-transparent">
          <TabsTrigger value="question">Question</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
        </TabsList>

        <TabsContent value="question">
          <Card className="mt-2 border-none shadow-none">
            <CardHeader>
              <CardTitle className="text-lg">Edit Question</CardTitle>
            </CardHeader>
            <CardContent>
              {active ? (
                <QuestionForm key={active.id} value={active} onChange={updateActiveQuestion} />
              ) : (
                <div className="text-sm text-muted-foreground">No question selected.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list">
          <div className="w-full space-y-4">
            <QuestionList
              items={questions}
              activeId={activeId}
              onSelect={setActiveId}
              onRename={(id, name) =>
                setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, name } : q)))
              }
              onDelete={deleteQuestion}
            />

            <Card className="border-primary rounded-2xl">
              <CardContent className="flex items-center gap-3 p-2">
                <div className="flex-1 rounded-md border-none px-4 text-sm">Add a Question</div>
                <Button
                  onClick={addBlankQuestion}
                  size="icon"
                  variant="ghost"
                  aria-label="Add question"
                  className="text-primary hover:bg-transparent"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            <Button className="text-sm">
              Review Survey
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="workflow">
           <WorkflowSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}