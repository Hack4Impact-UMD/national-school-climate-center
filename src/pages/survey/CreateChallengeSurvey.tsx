import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { SurveyHeader } from '@/components/survey/SurveyHeader'
import { QuestionForm } from '@/components/survey/QuestionForm'
import { QuestionList } from '@/components/survey/QuestionList'
import type { Question, EditableQuestion } from '@/types/surveybuilder'
import WorkflowSection from '@/components/survey/WorkFlowSection'

export default function CreateChallengeSurvey() {
  const location = useLocation()

  // Initialize tab from location state or default to "question"
  const initialTab = location.state?.defaultTab || 'question'
  const [tab, setTab] = useState(initialTab)

  // Load questions from location state or use default sample
  const initialQuestions = useMemo(() => {
    if (location.state?.questions) {
      const duplicatedQuestions: EditableQuestion[] = location.state.questions

      // Convert EditableQuestion[] to Question[] format for compatibility
      const convertedQuestions: Question[] = duplicatedQuestions.map((eq) => ({
        id: eq.id,
        name: `Question ${eq.order}`,
        prompt: eq.textOverride || eq.text,
        questionType: (eq.type === 'multiple-choice'
          ? 'multiple-choice'
          : 'open-ended') as 'multiple-choice' | 'open-ended',
        inputType: (eq.type === 'multiple-choice' ? 'single' : 'text') as
          | 'single'
          | 'multi'
          | 'text',
        options: eq.options || [],
      }))

      return convertedQuestions
    }

    // Default sample question
    return [
      {
        id: 'q1',
        name: 'How satisfied are you with your current experience?',
        prompt: 'How satisfied are you with your current experience?',
        questionType: 'multiple-choice' as const,
        inputType: 'single' as const,
        options: ['Very satisfied', 'Satisfied', 'Neutral', 'Dissatisfied'],
      },
    ]
  }, [location.state])

  const [questions, setQuestions] = useState<Question[]>(initialQuestions)
  const [activeId, setActiveId] = useState<string>(
    initialQuestions[0]?.id || 'q1'
  )

  const active = useMemo(
    () => questions.find((q) => q.id === activeId) ?? questions[0],
    [questions, activeId]
  )

  function addBlankQuestion() {
    const id = crypto.randomUUID()
    const next: Question = {
      id,
      name: `Question ${questions.length + 1}`,
      prompt: '',
      questionType: 'multiple-choice',
      inputType: 'single',
      options: ['Option 1', 'Option 2'],
    }
    setQuestions((prev) => [...prev, next])
    setActiveId(id)
  }

  function updateActiveQuestion(updated: Question) {
    setQuestions((prev) => prev.map((q) => (q.id === updated.id ? updated : q)))
  }

  function deleteQuestion(id: string) {
    setQuestions((prev) => {
      const filtered = prev.filter((q) => q.id !== id)
      if (activeId === id) setActiveId(filtered[0]?.id ?? '')
      return filtered
    })
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <img
        src="/logo.png"
        alt="National School Climate Center"
        className="w-40"
      />
      <SurveyHeader title="Survey – Challenge" subtitle="" />

      <Tabs value={tab} onValueChange={setTab} className="mt-4">
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
                <QuestionForm
                  key={active.id}
                  value={active}
                  onChange={updateActiveQuestion}
                />
              ) : (
                <div className="text-sm text-muted-foreground">
                  No question selected.
                </div>
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
                setQuestions((prev) =>
                  prev.map((q) => (q.id === id ? { ...q, name } : q))
                )
              }
              onDelete={deleteQuestion}
            />

            <Card className="border-primary rounded-2xl">
              <CardContent className="flex items-center gap-3 p-2">
                <div className="flex-1 rounded-md border-none px-4 text-sm">
                  Add a Question
                </div>
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
            <Button onClick={() => setTab('workflow')} className="text-sm">
              Review Survey
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="workflow">
          <WorkflowSection
            questions={questions.map((q) => ({
              id: q.id,
              label: q.name,
              prompt: q.prompt,
              inputType: q.inputType,
              optionsType:
                q.questionType === 'multiple-choice'
                  ? 'Multiple Choice'
                  : 'Open-ended',
              options: q.options,
            }))}
            selectedId={activeId}
            setSelectedId={setActiveId}
            onSelect={(id) => setActiveId(id)}
            onRename={(id, newLabel) => {
              setQuestions((prev) =>
                prev.map((q) => (q.id === id ? { ...q, name: newLabel } : q))
              )
            }}
            onEdit={(q) => {}}
            onDelete={(q) =>
              setQuestions((prev) => prev.filter((p) => p.id !== q.id))
            }
            setTab={setTab}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
