import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface SurveyQuestion {
  question_id: string
  order: number
  required: boolean
  text?: string
  questionType?: string
  options?: string[]
}

interface SurveyData {
  title: string
  description?: string
  type?: 'Pulse' | 'Challenge' | 'Custom'
  school_id?: string
  district_id?: string
  questions?: SurveyQuestion[]
}

type Screen = 'welcome' | 'identity' | 'questions' | 'thankyou'

/**
 * Renders the page header containing the site logo.
 *
 * @returns A header element with the National School Climate Center logo image.
 */
function Logo() {
  return (
    <header className="px-8 py-5">
      <img
        src="/logo.png"
        alt="National School Climate Center"
        className="h-8"
      />
    </header>
  )
}

/**
 * Render a multi-step survey UI that loads a survey by route parameter, collects responses, and saves them to Firestore.
 *
 * This component handles loading the survey document, presenting a welcome/identity/questions/thankyou flow, managing local answer state and navigation, detecting question input types (open-ended, rating/scale, or multiple-choice), and writing a response document to the survey's "responses" subcollection.
 *
 * @returns The rendered survey UI element
 */
export default function TakeSurvey() {
  const { surveyId } = useParams()
  const { user } = useAuth()

  const [survey, setSurvey] = useState<SurveyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [screen, setScreen] = useState<Screen>('welcome')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [respondentName, setRespondentName] = useState('')
  const [respondentEmail, setRespondentEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSurvey() {
      if (!surveyId) return
      try {
        const snap = await getDoc(doc(db, 'surveys', surveyId))
        if (snap.exists()) setSurvey(snap.data() as SurveyData)
      } catch (err) {
        console.error('Error fetching survey:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSurvey()
  }, [surveyId])

  const questions = survey?.questions ?? []
  const totalQuestions = questions.length
  const currentQuestion = questions[currentIndex]
  const isPulse = survey?.type === 'Pulse'

  // Progress: percentage of questions completed so far
  const progress =
    totalQuestions > 0 ? (currentIndex / totalQuestions) * 100 : 0

  const handleStartSurvey = () => {
    if (isPulse) {
      setScreen('identity')
    } else {
      setScreen('questions')
    }
  }

  const handleContinueIdentity = () => {
    setScreen('questions')
  }

  const handleSelect = (value: string) => {
    if (!currentQuestion) return
    setAnswers((prev) => ({ ...prev, [currentQuestion.question_id]: value }))
  }

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((i) => i + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1)
  }

  const handleSubmit = async () => {
    if (!surveyId || !survey) return
    setSubmitting(true)
    setError(null)
    try {
      const rawType = survey.type?.toLowerCase()
      const surveyType: 'pulse' | 'challenge' =
        rawType === 'pulse' ? 'pulse' : 'challenge'

      const responseData: Record<string, unknown> = {
        survey_id: surveyId,
        surveyTitle: survey.title,
        surveyType,
        school_id: survey.school_id ?? '',
        district_id: survey.district_id ?? '',
        consent: true,
        submittedAt: serverTimestamp(),
        answers: questions.map((q) => ({
          question_id: q.question_id,
          value: answers[q.question_id] ?? null,
        })),
      }

      if (surveyType === 'pulse' && user) {
        responseData.uid = user.uid
      }
      if (surveyType === 'pulse' && respondentName) {
        responseData.respondentName = respondentName
        responseData.respondentEmail = respondentEmail
      }

      await addDoc(
        collection(db, 'surveys', surveyId, 'responses'),
        responseData
      )
      setScreen('thankyou')
    } catch (err) {
      console.error('Error submitting response:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Loading / not found ──────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="font-body text-gray-500">Loading survey…</p>
      </div>
    )
  }

  if (!survey || totalQuestions === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="font-body text-gray-500">
          Survey not found or has no questions.
        </p>
      </div>
    )
  }

  // ── Welcome screen ───────────────────────────────────────────────────────────

  if (screen === 'welcome') {
    const pulseText = (
      <>
        <p>
          We want to hear about your experience. Your responses will be kept
          private and only used to better understand student experiences and
          improve your school environment.
        </p>
        <p>
          There are no right or wrong answers — just answer honestly based on
          your own experience.
        </p>
        <p>
          If you have any questions or need support, you can contact us anytime
          at email@email.com.
        </p>
      </>
    )
    const challengeText = (
      <>
        <p>
          We want to hear about your experience. This survey is completely
          anonymous, so no one will know which responses are yours.
        </p>
        <p>
          Your feedback helps us understand what's working, what isn't, and how
          we can improve your school environment.
        </p>
        <p>There are no right or wrong answers — just answer honestly.</p>
        <p>
          If you have any questions or need support, you can contact us anytime
          at email@email.com.
        </p>
      </>
    )

    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Logo />
        <main className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="max-w-[30vw] w-full text-center space-y-4">
            <h1 className="font-heading text-2xl font-bold text-primary mb-12">
              {survey.title}
            </h1>
            <p className="font-body text-md text-gray-500">
              Share your experience at [School/District]
            </p>
            <div className="font-body text-md text-gray-600 space-y-3 text-center mt-4">
              {isPulse ? pulseText : challengeText}
            </div>
            <div className="pt-4">
              <Button onClick={handleStartSurvey} className="px-8">
                Start Survey
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // ── Identity screen (Pulse only) ─────────────────────────────────────────────

  if (screen === 'identity') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Logo />
        <main className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="max-w-[30vw] w-full text-center space-y-4">
            <h1 className="font-heading text-2xl font-bold text-primary mb-12">
              Welcome, let's get you set up.
            </h1>
            <div className="font-body text-md text-gray-600 space-y-4 text-center">
              <p>
                To begin, enter your name and school email so we can make sure
                each student only submits one response.
              </p>
              <p>
                Your information will not be shared with teachers or staff in a
                way that identifies your individual responses.
              </p>
            </div>
            <div className="space-y-4 text-left">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="font-body text-md">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Please enter your full name..."
                  value={respondentName}
                  onChange={(e) => setRespondentName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="font-body text-md">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Please enter your email address..."
                  value={respondentEmail}
                  onChange={(e) => setRespondentEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-center pt-2">
              <Button
                onClick={handleContinueIdentity}
                disabled={!respondentName.trim() || !respondentEmail.trim()}
                className="px-10"
              >
                Continue
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // ── Thank you screen ─────────────────────────────────────────────────────────

  if (screen === 'thankyou') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Logo />
        <main className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="max-w-md w-full text-center space-y-4">
            <div className="text-6xl">🙌</div>
            <h1 className="font-heading text-2xl font-bold text-primary">
              Thanks for completing the survey!
            </h1>
            <p className="font-body text-sm text-gray-600">
              We appreciate you taking the time to share your thoughts.
            </p>
            <p className="font-body text-sm text-gray-600">
              Your feedback helps us better understand student experiences and
              improve your school environment.
            </p>
          </div>
        </main>
      </div>
    )
  }

  // ── Questions screen ─────────────────────────────────────────────────────────

  const isLastQuestion = currentIndex === totalQuestions - 1
  const currentAnswer = answers[currentQuestion?.question_id ?? '']
  const qType = currentQuestion?.questionType ?? ''
  const options = currentQuestion?.options ?? []

  // Detect if this is a rating/scale question (numeric options or no options)
  const isRating =
    qType === 'rating' ||
    (!qType && options.length === 0) ||
    (options.length > 0 && options.every((o) => !isNaN(Number(o))))

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Logo />

      {/* Progress bar */}
      <div className="px-8">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-purple transition-all duration-300 ease-in-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-body text-xs text-gray-400 w-8 text-right">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Question area */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        <div className="w-3/4 min-h-[50vh] flex flex-col justify-between space-y-6 px-12 py-10 border border-gray-200 rounded-xl shadow-md">
          {/* Question */}
          <div className="space-y-2">
            <h2 className="font-heading text-2xl font-bold text-primary">
              Question {currentIndex + 1}
            </h2>
            <p className="font-body text-lg text-gray-700">
              {currentQuestion?.text ?? 'Untitled question'}
            </p>
          </div>

          {/* Answer input */}
          <div className="flex-1 flex flex-col py-4">
            {qType === 'open-ended' ? (
              <Textarea
                placeholder="Type your answer in max characters..."
                value={currentAnswer ?? ''}
                onChange={(e) => handleSelect(e.target.value)}
                className="font-body text-base flex-1 resize-none"
              />
            ) : isRating ? (
              <RatingScale
                options={
                  options.length > 0 ? options : ['1', '2', '3', '4', '5']
                }
                value={currentAnswer ?? ''}
                onChange={handleSelect}
              />
            ) : (
              <RadioGroup
                value={currentAnswer ?? ''}
                onValueChange={handleSelect}
                className="space-y-3"
              >
                {options.map((option, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <RadioGroupItem value={option} id={`option-${idx}`} />
                    <Label
                      htmlFor={`option-${idx}`}
                      className="font-body text-lg text-gray-700 cursor-pointer"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-2">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="gap-1 font-body"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            {isLastQuestion ? (
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-8"
              >
                {submitting ? 'Submitting…' : 'Submit'}
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={handleNext}
                className="gap-1 font-body"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>

          {error && (
            <p className="text-center text-destructive font-body text-sm">
              {error}
            </p>
          )}
        </div>
      </main>
    </div>
  )
}

/**
 * Render a horizontal rating scale composed of selectable option buttons.
 *
 * @param options - Ordered list of option labels to render as scale steps
 * @param value - Currently selected option value
 * @param onChange - Callback invoked with the selected option value when a button is clicked
 * @returns A JSX element containing the rating buttons and first/last labels
 */

function RatingScale({
  options,
  value,
  onChange,
}: {
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  const first = options[0]
  const last = options[options.length - 1]

  return (
    <div className="space-y-2">
      <div className="flex justify-between gap-1">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`flex-1 py-2 rounded font-body text-sm font-medium border transition-colors ${
              value === opt
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-600 border-gray-300 hover:border-primary hover:text-primary'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      <div className="flex justify-between font-body text-xs text-gray-400 px-0.5">
        <span>{first}</span>
        <span>{last}</span>
      </div>
    </div>
  )
}
