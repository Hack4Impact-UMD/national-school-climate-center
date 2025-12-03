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

  const mapEditableToQuestion = (eq: EditableQuestion): Question => {
    const ratingMatch = /^rating-(\d+)/.exec(eq.type ?? '')
    const ratingMax = ratingMatch ? Number(ratingMatch[1]) : null

    const optionsFromType =
      eq.options && eq.options.length
        ? eq.options.map(String)
        : ratingMax && ratingMax > 0
          ? Array.from({ length: ratingMax }, (_, idx) => `${idx + 1}`)
          : []

    const questionType: Question['questionType'] =
      optionsFromType.length > 0 ? 'multiple-choice' : 'open-ended'
    const inputType: Question['inputType'] =
      questionType === 'multiple-choice' ? 'single' : 'text'

    const fallbackName = eq.textOverride || eq.text || `Question ${eq.order}`
    const prompt = eq.textOverride || eq.text || fallbackName

    return {
      id: eq.id,
      name: fallbackName,
      prompt,
      questionType,
      inputType,
      options: optionsFromType,
    }
  }

  const createBlankQuestion = (index: number): Question => {
    const name = `Question ${index}`
    return {
      id: crypto.randomUUID(),
      name,
      prompt: name,
      questionType: 'multiple-choice',
      inputType: 'single',
      options: ['Option 1', 'Option 2'],
    }
  }

  // Load questions from location state or create an initial blank entry
  const [questions, setQuestions] = useState<Question[]>(() => {
    if (location.state?.questions && location.state.questions.length > 0) {
      const duplicatedQuestions: EditableQuestion[] = location.state.questions
      return duplicatedQuestions.map(mapEditableToQuestion)
    }

    return [createBlankQuestion(1)]
  })

  const [activeId, setActiveId] = useState<string>(questions[0]?.id ?? '')

  const active = useMemo(
    () => questions.find((q) => q.id === activeId) ?? questions[0],
    [questions, activeId]
  )

  function addBlankQuestion() {
    const next = createBlankQuestion(questions.length + 1)
    const id = next.id
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

  function duplicateQuestion(q: Question) {
    const id = crypto.randomUUID()
    setQuestions((prev) => [...prev, { ...q, id, name: `${q.name} (Copy)` }])
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
              onDuplicate={duplicateQuestion}
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
            onDelete={(q) => deleteQuestion(q.id)}
            setTab={setTab}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
