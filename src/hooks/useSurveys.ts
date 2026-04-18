import { useState, useEffect } from 'react'
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  type QueryConstraint,
} from 'firebase/firestore'
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
 * Hook to retrieve published surveys for the NSCC admin in the All Surveys page.
 *
 * NOTE: Firestore doesn't support OR queries across different fields easily.
 * In the Firestore as of 3/26/26, there two types of survey docs:
 *  - newer docs: { status: 'published', type: 'challenge'|'pulse' }
 *  - older/seeded docs: may have no `status` and use other `type` values (ex. 'school_climate')
 *
 * For the All Surveys tab we include everything.
 * For Challenge/Pulse tabs, we filter client-side so the older docs with no status can still show up under All.
 */
export function usePublishedSurveys(params?: { type?: 'pulse' | 'challenge' | null }) {
  const [surveys, setSurveys] = useState<SurveyWithId[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const run = async () => {
      try {
        setLoading(true)
        setError(null)

        const base = collection(db, 'surveys')

        // removed server-side `where('status' == 'published')` because some older docs
        // have no `status` field but should still appear in "All Surveys".
        const constraints: QueryConstraint[] = []

        // also removed orderBy('createdAt') for the same reason
        const q = query(base, ...constraints)
        const snap = await getDocs(q)

        const all: SurveyWithId[] = snap.docs.map((d) => {
          const docData = d.data() as Omit<Survey, 'id'>
          return { id: d.id, ...docData }
        })

        // only include surveys that are intended to be visible in the admin list.
        // if `status` exists, require it to be published. if it doesn't exist, include it.
        const publishedOrLegacy = all.filter((s) => {
          const status = (s as any).status
          if (typeof status === 'string') return status.toLowerCase() === 'published'
          return true
        })

        const requestedType = params?.type ?? null
        const filtered = requestedType
          ? publishedOrLegacy.filter((s) => (s as any).type?.toLowerCase() === requestedType)
          : publishedOrLegacy

        // prefer sorting by createdAt if it exists, but don't require it.
        filtered.sort((a, b) => {
          const aDate = (a as any).createdAt?.toDate?.() ?? (a as any).createdAt
          const bDate = (b as any).createdAt?.toDate?.() ?? (b as any).createdAt
          const aMs = aDate instanceof Date ? aDate.getTime() : 0
          const bMs = bDate instanceof Date ? bDate.getTime() : 0
          return bMs - aMs
        })

        if (mounted) setSurveys(filtered)
      } catch (err) {
        console.error('Error fetching published surveys:', err)
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch published surveys')
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
