import { useState, useEffect } from 'react'
import type { Response, ResponseWithId } from '@/firebase/interfaces'
import { collection, getDocs, collectionGroup } from 'firebase/firestore'
import { db } from '@/firebase/config'

interface UseResponsesReturn {
  responses: ResponseWithId[]
  loading: boolean
  error: string | null
}


//surveyID optional, can either get all responses across surveys or just for one survey.
export function useResponses(surveyId?: string): UseResponsesReturn {
  const [responses, setResponses] = useState<ResponseWithId[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchResponses = async () => {
    try {
      setLoading(true)
      setError(null)

      let responsesData: ResponseWithId[] = []

      if (surveyId) {
        const responsesRef = collection(db, 'surveys', surveyId, 'responses')
        const snapshot = await getDocs(responsesRef)
        responsesData = snapshot.docs.map((doc) => {
          const data = doc.data() as Omit<Response, 'id'>
          return { id: doc.id, ...data }
        })
      } else {
        const responsesRef = collectionGroup(db, 'responses')
        const snapshot = await getDocs(responsesRef)
        responsesData = snapshot.docs.map((doc) => {
          const data = doc.data() as Omit<Response, 'id'>
          return {
            id: doc.id,
            surveyId: doc.ref.parent.parent?.id,
            ...data,
          }
        })
      }

      setResponses(responsesData)
    } catch (err) {
      console.error('Error fetching responses:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch responses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResponses()
  }, [surveyId])

  return { responses, loading, error }
}
