import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useAuth } from '@/contexts/AuthContext'
import type { Question as BuilderQuestion } from '@/types/surveybuilder'
import type { Question as FirebaseQuestion } from '@/firebase/interfaces'
import { Button } from '@/components/ui/button'
import { SurveyHeader } from '@/components/survey/SurveyHeader'
import { editSurvey } from '@/functions/firebaseFunctions'
import type { Survey } from '@/types/survey'

type LocationState = {
  questions: BuilderQuestion[]
  surveyTitle?: string
  surveyDescription?: string
  surveyType?: 'Challenge' | 'Pulse'
  surveyId?: string
  school?: string
  district?: string
}

export default function ReviewSurveyPage({
  defaultSurveyType,
}: {
  defaultSurveyType?: 'Challenge' | 'Pulse'
}) {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { user } = useAuth()

  const {
    questions = [],
    surveyTitle,
    surveyDescription,
    surveyType,
    surveyId,
  } = (state || {}) as LocationState

  const [publishing, setPublishing] = useState(false)
  const [saving, setSaving] = useState(false)

  const effectiveDescription = surveyDescription ?? ''
  const [shareLink, setShareLink] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const effectiveSurveyType = surveyType ?? defaultSurveyType ?? 'Challenge'
  const effectiveTitle =
    surveyTitle ??
    (effectiveSurveyType === 'Pulse' ? 'Pulse Survey' : 'Challenge Survey')

  function mapQuestionsToFirebase(
    questions: BuilderQuestion[]
  ): FirebaseQuestion[] {
    return questions.map((q, index) => ({
      question_id: q.id,
      order: index,
      text: q.prompt || q.name,
      questionType: q.questionType,
      required: false, // default to false; you can adjust if builder has a required field
      options: q.options ?? [],
    }))
  }

  async function handlePublish() {
    if (!questions.length) {
      setError('There are no questions to publish.')
      return
    }

    setPublishing(true)
    setError(null)

    try {
      const questionDocs = mapQuestionsToFirebase(questions)

      let docId = surveyId

      if (docId) {
        const surveyRef = doc(db, 'surveys', docId)

        await updateDoc(surveyRef, {
          title: effectiveTitle,
          description: effectiveDescription,
          type: effectiveSurveyType,
          questions: questionDocs,
          updatedAt: serverTimestamp(),
          status: 'Published',
          school_id: state?.school ?? null,
          district_id: state?.district ?? null,
        })
      } else {
        const newSurvey: Survey = {
          title: effectiveTitle,
          description: effectiveDescription,
          type: effectiveSurveyType,
          questions: questionDocs,
          createdBy: user?.uid ?? 'na',
          createdAt: serverTimestamp(),
          status: 'Published',
          school_id: state?.school ?? null,
          district_id: state?.district ?? null,
          updatedAt: serverTimestamp(),
          visibility: 'School',
          questionCount: questionDocs.length,
          responseCount: 0,
          tags: [],
        }
        const docRef = await addDoc(collection(db, 'surveys'), newSurvey)

        docId = docRef.id
      }
      const url = `${window.location.origin}/surveys/respond/${docId}`
      setShareLink(url)

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(url).catch(() => {})
      }
    } catch (err) {
      console.error(err)
      setError('Failed to publish survey. Please try again.')
    } finally {
      setPublishing(false)
    }
  }

  function handleEdit() {
    const targetPath =
      effectiveSurveyType === 'Pulse'
        ? '/surveys/create/pulse'
        : '/surveys/create/challenge'

    navigate(targetPath, {
      state: {
        questions,
        surveyTitle: effectiveTitle,
        surveyDescription: effectiveDescription,
        surveyType: effectiveSurveyType,
        surveyId: state?.surveyId,
        activeTab: 'question',
        activeId: questions[0]?.id,
      },
    })
  }

  async function handleSaveDraft() {
    if (!questions.length) {
      setError('There are no questions to save.')
      return
    }

    if (!surveyId) {
      setError('Cannot save draft: missing survey ID.')
      return
    }

    setSaving(true)
    setError(null)

    try {
      const questionDocs = mapQuestionsToFirebase(questions)
      const surveyRef = doc(db, 'surveys', surveyId)

      await editSurvey(surveyRef, {
        title: effectiveTitle,
        description: effectiveDescription,
        type: effectiveSurveyType,
        questions: questionDocs,
        status: 'Draft',
      })

      // Optional: show a toast or alert
      alert('Draft saved successfully!')
    } catch (err) {
      console.error(err)
      setError('Failed to save draft. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (!questions.length) {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <SurveyHeader
          title={effectiveTitle}
          subtitle={effectiveDescription || 'Name of School/District'}
        />
        <p className="mt-6 font-body text-body text-left">
          No survey questions found. Please return to the builder.
        </p>
        <Button className="mt-4 cursor-pointer" onClick={() => navigate(-1)}>
          Back to Builder
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <img
        src="/logo.png"
        alt="National School Climate Center"
        className="w-40"
      />
      <SurveyHeader
        title={effectiveTitle}
        subtitle={effectiveDescription || 'Name of School/District'}
      />

      <div className="mt-4 border-b border-secondary">
        <button
          type="button"
          className="mr-6 pb-2 font-body text-base text-secondary cursor-pointer"
        >
          Review
        </button>
        <button
          type="button"
          className={
            'pb-2 font-body text-body ' +
            (shareLink ? 'cursor-not-allowed' : 'cursor-pointer')
          }
          onClick={shareLink ? undefined : handleEdit}
          disabled={!!shareLink}
        >
          Edit
        </button>
      </div>

      <div className="mt-8 space-y-10 text-left">
        {questions.map((q, idx) => (
          <div key={`${q.id}-${idx}`} className="space-y-4">
            <p className="font-body">Question {idx + 1}</p>

            <div className="border border-primary rounded-sm px-4 py-3 bg-white text-sm leading-snug">
              {q.prompt || q.name || 'Question Question\nQuestion Question'}
            </div>

            {q.questionType === 'multiple-choice' && (
              <div className="space-y-1">
                <div className="text-sm font-semibold">Choices</div>
                <ul className="space-y-1 text-sm">
                  {q.options.map((opt, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full border" />
                      <span>{opt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}

        <div className="mt-6 flex flex-col md:flex-row items-start gap-3">
          <Button
            className="px-6 cursor-pointer"
            onClick={handlePublish}
            disabled={publishing}
          >
            {publishing ? 'Publishing...' : 'Publish Survey'}
          </Button>
          <Button
            className="px-6 cursor-pointer"
            onClick={handleSaveDraft}
            disabled={publishing}
          >
            {saving ? 'Saving...' : 'Save Draft'}
          </Button>

          {shareLink && (
            <div className="w-full max-w-xl space-y-1">
              <p className="text-sm font-body text-body">
                Survey published! Share this link with respondents:
              </p>
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-md border px-3 py-2 text-sm bg-white"
                  value={shareLink}
                  readOnly
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigator.clipboard.writeText(shareLink)}
                  className="whitespace-nowrap cursor-pointer"
                >
                  Copy Link
                </Button>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-600 font-body">{error}</p>}
        </div>
      </div>
    </div>
  )
}
