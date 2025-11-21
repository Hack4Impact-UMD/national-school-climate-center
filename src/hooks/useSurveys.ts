import { useState, useEffect } from 'react'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'
import type { Survey } from '@/firebase/interfaces'

interface UseSurveysReturn {
  surveys: Survey[]
  loading: boolean
  error: string | null
}

/**
 * Hook to fetch all surveys from Firestore
 */
export function useSurveys(): UseSurveysReturn {
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        setLoading(true)
        setError(null)

        const surveysRef = collection(db, 'surveys')
        const snapshot = await getDocs(surveysRef)

        const surveysData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Survey[]

        setSurveys(surveysData)
      } catch (err) {
        console.error('Error fetching surveys:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch surveys')
      } finally {
        setLoading(false)
      }
    }

    fetchSurveys()
  }, [])

  return { surveys, loading, error }
}

interface UseSurveyReturn {
  survey: Survey | null
  loading: boolean
  error: string | null
}

/**
 * Hook to fetch a specific survey by ID from Firestore
 */
export function useSurvey(surveyId: string | null): UseSurveyReturn {
  const [survey, setSurvey] = useState<Survey | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!surveyId) {
      setLoading(false)
      return
    }

    const fetchSurvey = async () => {
      try {
        setLoading(true)
        setError(null)

        const surveyRef = doc(db, 'surveys', surveyId)
        const snapshot = await getDoc(surveyRef)

        if (snapshot.exists()) {
          setSurvey({
            id: snapshot.id,
            ...snapshot.data(),
          } as Survey)
        } else {
          setError('Survey not found')
        }
      } catch (err) {
        console.error('Error fetching survey:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch survey')
      } finally {
        setLoading(false)
      }
    }

    fetchSurvey()
  }, [surveyId])

  return { survey, loading, error }
}
