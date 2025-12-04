import { useMemo, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { SurveyHeader } from '@/components/survey/SurveyHeader'
import { QuestionForm } from '@/components/survey/QuestionForm'
import { QuestionList } from '@/components/survey/QuestionList'
import type { Question } from '@/types/surveybuilder'
import WorkflowSection from '@/components/survey/WorkFlowSection'
import { useLocation, useNavigate } from 'react-router-dom'

const DEFAULT_QUESTIONS: Question[] = [
  {
    id: 'q1',
    name: 'Sample Question 1',
    prompt: 'How satisfied are you with your current experience?',
    questionType: 'multiple-choice',
    inputType: 'single',
    options: ['Very satisfied', 'Satisfied', 'Neutral', 'Dissatisfied'],
  },
]

export default function CreateChallengeSurvey() {
  const location = useLocation()
  const incomingState = (location.state ?? {}) as {
    questions?: Question[]
    activeId?: string
    activeTab?: 'question' | 'list' | 'workflow'
    surveyTitle?: string
    surveyType?: 'challenge' | 'pulse'
  }

  const initialQuestions =
    incomingState.questions && incomingState.questions.length
      ? incomingState.questions
      : DEFAULT_QUESTIONS

  const [questions, setQuestions] = useState<Question[]>(initialQuestions)

  const [activeId, setActiveId] = useState<string>(
    incomingState.activeId ?? initialQuestions[0]?.id ?? 'q1'
  )
  const [activeTab, setActiveTab] = useState<'question' | 'list' | 'workflow'>(
    incomingState.activeTab ?? 'question'
  )

  const active = useMemo(
    () => questions.find((q) => q.id === activeId) ?? questions[0],
    [questions, activeId]
  )

  const navigate = useNavigate()

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

  function handleReviewSurvey() {
    navigate('/surveys/create/challenge/review', {
      state: {
        questions,
        surveyTitle: 'Challenge Survey',
        surveyType: 'challenge',
      },
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

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as typeof activeTab)}
        className="mt-4"
      >
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
            <Button
              className="text-sm cursor-pointer"
              onClick={handleReviewSurvey}
            >
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
              optionsType: q.questionType,
              options: q.options,
            }))}
            onEdit={(q) => {
              setActiveId(q.id)
              setActiveTab('question')
            }}
            onReview={handleReviewSurvey}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
