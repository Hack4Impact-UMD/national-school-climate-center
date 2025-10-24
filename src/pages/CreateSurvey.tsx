import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SurveyHeader } from "../components/SurveyHeader";
import { QuestionForm } from "../components/QuestionForm";
import { QuestionList } from "../components/QuestionList";
import type { Question } from "../types/surveybuilder";

export default function CreateSurvey() {
  // just for UI preview
  const [questions, setQuestions] = useState<Question[]>([{
    id: "q1",
    name: "Sample Question 1",
    prompt: "How satisfied are you with your current experience?",
    questionType: "multiple-choice",
    inputType: "single",
    options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied"],
  }]);

  const [activeQuestionId, setActiveQuestionId] = useState<string>("q1");

  const activeQuestion = useMemo(
    () => questions.find((q) => q.id === activeQuestionId) ?? questions[0],
    [questions, activeQuestionId]
  );

  const addBlankQuestion = () => {
    const newQ: Question = {
      id: `q${Date.now()}`,
      name: `Question ${questions.length + 1}`,
      prompt: "",
      questionType: "multiple-choice",
      inputType: "single",
      options: ["Option 1", "Option 2"],
    };
    setQuestions((prev) => [...prev, newQ]);
    setActiveQuestionId(newQ.id);
  };

  const updateActiveQuestion = (updated: Question) => {
    setQuestions((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <SurveyHeader title="Pulse Survey" subtitle="Name of School/District" />

      <Tabs defaultValue="question" className="mt-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="question" className="font-body data-[state=active]:text-primary">Question</TabsTrigger>
          <TabsTrigger value="list" className="font-body data-[state=active]:text-primary">List</TabsTrigger>
          <TabsTrigger value="workflow" disabled className="font-body">Workflow</TabsTrigger>
        </TabsList>
        
        <Separator className="mt-4" />

        <TabsContent value="question" className="mt-6">
          <Card className="border-muted-foreground/20">
            <CardHeader>
              <CardTitle className="text-lg">Question</CardTitle>
            </CardHeader>
            <CardContent>
              {activeQuestion ? (
                <QuestionForm
                  key={activeQuestion.id}
                  value={activeQuestion}
                  onChange={updateActiveQuestion}
                />
              ) : (
                <div className="text-sm text-muted-foreground">No question selected.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <div className="space-y-4">
            <QuestionList
              items={questions}
              activeId={activeQuestionId}
              onSelect={(id) => setActiveQuestionId(id)}
              onRename={(id, name) =>
                setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, name } : q)))
              }
              onDelete={(id) => {
                setQuestions((prev) => prev.filter((q) => q.id !== id));
                if (activeQuestionId === id) {
                  const remainingQuestions = questions.filter((q) => q.id !== id);
                  setActiveQuestionId(remainingQuestions[0]?.id || "");
                }
              }}
            />

            <Card className="border-primary shadow-none">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex-1 rounded-md border-primary px-4 py-2 text-sm font-body">Add a Question</div>
                <Button onClick={addBlankQuestion} size="icon" variant="default" aria-label="Add question">
                  <Plus className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workflow" className="mt-6">
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              Workflow UI is intentionally not implemented yet per your request.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}