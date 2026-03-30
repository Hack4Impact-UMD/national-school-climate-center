import { useEffect, useMemo, useRef, useState } from 'react'
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
import { createSurvey } from '@/functions/firebaseFunctions'
import { useAuth } from '@/contexts/AuthContext'
import type { Survey } from '@/types/survey'

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

type IncomingQuestion = Partial<Question> & {
  id?: string
  text?: string
  textOverride?: string
  order?: number
  type?: string
}

export default function CreateChallengeSurvey() {
  const location = useLocation()
  const { user } = useAuth() // used for survey createdBy
  const incomingState = (location.state ?? {}) as {
    questions?: IncomingQuestion[]
    activeId?: string
    activeTab?: 'question' | 'list' | 'workflow'
    defaultTab?: 'question' | 'list' | 'workflow'
    surveyTitle?: string
    surveyDescription?: string
    surveyType?: 'challenge' | 'pulse'
  }

  function normalizeQuestion(q: IncomingQuestion, index: number): Question {
    const ratingMatch = q.type ? /^rating-(\d+)/.exec(q.type) : null
    const ratingMax = ratingMatch ? Number(ratingMatch[1]) : null

    const normalizedOptions =
      q.options && q.options.length
        ? q.options.map(String)
        : ratingMax && ratingMax > 0
          ? Array.from({ length: ratingMax }, (_, idx) => `${idx + 1}`)
          : []

    const questionType: Question['questionType'] =
      q.questionType ?? (normalizedOptions.length ? 'multiple-choice' : 'open-ended')
    const inputType: Question['inputType'] =
      q.inputType ??
      (questionType === 'multiple-choice'
        ? 'single'
        : 'text')

    const fallbackName = q.textOverride || q.text || q.prompt || q.name || `Question ${index}`
    const prompt = q.prompt || q.textOverride || q.text || fallbackName

    return {
      id: q.id ?? crypto.randomUUID(),
      name: q.name ?? fallbackName,
      prompt,
      questionType,
      inputType,
      options: normalizedOptions,
    }
  }

  const initialQuestions =
    incomingState.questions && incomingState.questions.length
      ? incomingState.questions.map((q, idx) => normalizeQuestion(q, idx + 1))
      : DEFAULT_QUESTIONS

  const [questions, setQuestions] = useState<Question[]>(initialQuestions)

  const [surveyTitle, setSurveyTitle] = useState<string>(
    incomingState.surveyTitle ?? 'Challenge Survey'
  )
  const [surveyDescription, setSurveyDescription] = useState<string>(
    incomingState.surveyDescription ?? 'This is a challenge survey.'
  )

  const [activeId, setActiveId] = useState<string>(
    incomingState.activeId ?? initialQuestions[0]?.id ?? 'q1'
  )
  const [tab, setTab] = useState<'question' | 'list' | 'workflow'>(
    incomingState.activeTab ?? incomingState.defaultTab ?? 'question'
  )
  const [createdSurveyId, setCreatedSurveyId] = useState<string | null>(null)
  const hasCreatedDraftRef = useRef(false) // prevents duplicate creations from effect reruns


  const active = useMemo(
    () => questions.find((q) => q.id === activeId) ?? questions[0],
    [questions, activeId]
  )

  const navigate = useNavigate()

  useEffect(() => {
    // checks if a draft already exists in this session or mismatched auth
    if (hasCreatedDraftRef.current || !user) { 
      return
    }

    // createSurvey will be called using a skeleton object so that it exists in db
    hasCreatedDraftRef.current = true
    const skeletonSurvey = {
      title: surveyTitle,
      description: surveyDescription,
      createdBy: user.uid,
      createdAt: null, // unable to access timestamp till after creation in firestore
      updatedAt: null, // which sets it
      status: 'Draft',
      visibility: 'School',
      questionCount: initialQuestions.length,
      responseCount: 0,
      school_id: '',
      district_id: '',
      tags: [],
      type: 'Challenge',
    } as unknown as Survey // to bypass type checks on the timestamp

    createSurvey(skeletonSurvey)
      .then((docRef) => {
        setCreatedSurveyId(docRef.id)
      })
      .catch((error) => {
        hasCreatedDraftRef.current = false // so that draft retry is allowed
        console.error('Failed to create challenge survey draft', error)
      })
  }, [user, initialQuestions.length])

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

  //need to add school_name here after the page is created
  function handleReviewSurvey() {
    navigate('/surveys/create/challenge/review', {
      state: {
        questions,
        surveyTitle,
        surveyDescription,
        surveyType: 'challenge',
        activeId,
        activeTab: tab,
        surveyId: createdSurveyId, // using to keep track of surveys
      },
    })
  }

  function duplicateQuestion(id: string) {
    const original = questions.find((q) => q.id === id)
    if (!original) return
    const nextId = crypto.randomUUID()
    const next: Question = {
      ...original,
      id: nextId,
      name: `${original.name} (Copy)`,
    }
    setQuestions((prev) => [...prev, next])
    setActiveId(nextId)
    setTab('question')
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <img
        src="/logo.png"
        alt="National School Climate Center"
        className="w-40"
      />
      <SurveyHeader title="Survey – Challenge" subtitle="" />

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="mt-4">
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
              optionsType:
                q.questionType === 'multiple-choice'
                  ? 'Multiple Choice'
                  : 'Open-ended',
              options: q.options,
            }))}
            onEdit={(q) => {
              setActiveId(q.id)
              setTab('question')
            }}
            onReview={handleReviewSurvey}
            selectedId={activeId}
            setSelectedId={setActiveId}
            onSelect={(id) => setActiveId(id)}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
