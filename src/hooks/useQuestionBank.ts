import { useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'
import type { QuestionBankItem } from '@/firebase/interfaces'

interface UseQuestionBankReturn {
  questions: QuestionBankItem[]
  loading: boolean
  error: string | null
}

/**
 * Hook to fetch multiple questions from questionBank by their IDs
 * @param questionIds - Array of question IDs to fetch
 */
export function useQuestionBank(
  questionIds: string[] | null
): UseQuestionBankReturn {
  const [questions, setQuestions] = useState<QuestionBankItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!questionIds || questionIds.length === 0) {
      setLoading(false)
      setQuestions([])
      return
    }

    const fetchQuestions = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch each question document by ID
        const questionPromises = questionIds.map(async (id) => {
          const questionRef = doc(db, 'questionBank', id)
          const snapshot = await getDoc(questionRef)

          if (snapshot.exists()) {
            return {
              id: snapshot.id,
              ...snapshot.data(),
            } as QuestionBankItem
          }
          return null
        })

        const results = await Promise.all(questionPromises)
        const validQuestions = results.filter(
          (q): q is QuestionBankItem => q !== null
        )

        setQuestions(validQuestions)
      } catch (err) {
        console.error('Error fetching questions from questionBank:', err)
        setError(
          err instanceof Error ? err.message : 'Failed to fetch questions'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionIds?.join(',')])  // Using join to create stable dependency string from array

  return { questions, loading, error }
}
