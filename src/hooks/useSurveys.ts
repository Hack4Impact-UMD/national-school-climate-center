import { useState, useEffect } from 'react'
import { collection, getDocs, doc, getDoc, query, where, orderBy, type QueryConstraint } from 'firebase/firestore'
import { db } from '@/firebase/config'
import type { Survey, SurveyWithId } from '@/firebase/interfaces'

interface UseSurveysReturn {
  surveys: SurveyWithId[]
  loading: boolean
  error: string | null
}

/**
 * Hook to fetch all surveys from Firestore
 */
export function useSurveys(): UseSurveysReturn {
  const [surveys, setSurveys] = useState<SurveyWithId[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        setLoading(true)
        setError(null)

        const surveysRef = collection(db, 'surveys')
        const snapshot = await getDocs(surveysRef)

        const surveysData: SurveyWithId[] = snapshot.docs.map((doc) => {
          const data = doc.data() as Omit<Survey, 'id'>;
          return {
            id: doc.id,
            ...data,
          };
        });

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
  survey: SurveyWithId | null
  loading: boolean
  error: string | null
}

/**
 * Hook to fetch a specific survey by ID from Firestore
 */
export function useSurvey(surveyId: string | null): UseSurveyReturn {
  const [survey, setSurvey] = useState<SurveyWithId | null>(null)
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
          setSurvey(() => {
            const data = snapshot.data() as Omit<Survey, 'id'>;
            return {
              id: snapshot.id,
              ...data,
            };
          });
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

/**
 * Hook to retrieve only the published surverys, used by the NSCC admin in the All Surveys page
 */
export function usePublishedSurveys(params?: {
  type?: 'pulse' | 'challenge' | null
}) {
  const [surveys, setSurveys] = useState<SurveyWithId[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * builds FireStore query with the following constraints:
   *  status is always published
   *  type is the specified parameter type (optional)
   *  ordered by date (newest at top)
   */
  useEffect(() => {
    let mounted = true

    const run = async () => {
      try {
        setLoading(true)
        setError(null)

        const base = collection(db, 'surveys')
        const constraints: QueryConstraint[] = [where('status', '==', 'published')]

        if (params?.type) {
          constraints.push(where('type', '==', params.type))
        }

        // use createdAt if it exists; if some docs don't have it yet, remove the orderBy (or backfill createdAt)
        constraints.push(orderBy('createdAt', 'desc'))

        const q = query(base, ...constraints)
        const snap = await getDocs(q)

        const data: SurveyWithId[] = snap.docs.map((d) => {
          const docData = d.data() as Omit<Survey, 'id'>
          return { id: d.id, ...docData }
        })

        if (mounted) setSurveys(data)
      } catch (err) {
        console.error('Error fetching published surveys:', err)
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to fetch published surveys'
          )
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    run()
    return () => {
      mounted = false
    }
  }, [params?.type])

  return { surveys, loading, error }
}
