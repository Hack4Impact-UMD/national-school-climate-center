import { useEffect, useMemo, useState } from 'react'
import {
  collectionGroup,
  getDocs,
  query,
  where,
  type Timestamp,
} from 'firebase/firestore'
import { db } from '@/firebase/config'

export type ResponseAggregate = {
  surveyId: string
  responseCount: number
  lastResponseAt: Date | null
  // "responded-from" filters
  schools: Set<string>
  districts: Set<string>
  states: Set<string>
}

type FirestoreResponse = {
  school_id?: string
  district_id?: string
  state?: string
  submittedAt?: Timestamp | Date | string | null
  consent?: boolean
}

function toDate(value: FirestoreResponse['submittedAt']): Date | null {
  if (!value) return null
  if (value instanceof Date) return value
  if (typeof value === 'string') {
    const d = new Date(value)
    return Number.isNaN(d.getTime()) ? null : d
  }
  // timestamp-like
  if (typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') {
    return value.toDate()
  }
  return null
}

/**
 * Hook that produces the per-survery aggregates like:
 *  response count, last response time
 *  schools, districts, states (sets of all of these that responded)
 * 
 *  This allows for the following functionalities:
 *      responses and last response columns in the table
 *      responded-from dropdown (filtering by school/district/state)
 *      number of responses filter (filtering by <100, 100–500, 500+)
 * 
 * IMPORTANT: I think we currently store responses under surveys/{surveyId}/responses based on the Analytics page,
 *  so here I use a collectionGroup('responses') query and filter by survey_id.
 *      -> this collectionGroup query grabs documents from any subcollection named responses in the database
 *      -> RELIES ON EACH RESPONSE HAVING SURVEY ID
 */
export function useSurveyResponseAggregates(params: {
  surveyIds: string[]
}) {
  const { surveyIds } = params

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [aggregates, setAggregates] = useState<Record<string, ResponseAggregate>>({})

  const stableIds = useMemo(() => surveyIds.filter(Boolean).slice().sort(), [surveyIds])
  const key = stableIds.join('|')

  useEffect(() => {
    let mounted = true

    const run = async () => {
      if (stableIds.length === 0) {
        setAggregates({})
        return
      }

      try {
        setLoading(true)
        setError(null)

        // since the firestore 'in' supports up to 10 items, we chunk for a larger list
        const chunks: string[][] = []
        for (let i = 0; i < stableIds.length; i += 10) {
          chunks.push(stableIds.slice(i, i + 10))
        }

        const result: Record<string, ResponseAggregate> = {}

        for (const chunk of chunks) {
          const q = query(
            collectionGroup(db, 'responses'),
            where('survey_id', 'in', chunk)
          )
          const snap = await getDocs(q)

          for (const d of snap.docs) {
            const r = d.data() as FirestoreResponse & { survey_id?: string }
            const surveyId = r.survey_id
            if (!surveyId) continue

            if (!result[surveyId]) {
              result[surveyId] = {
                surveyId,
                responseCount: 0,
                lastResponseAt: null,
                schools: new Set(),
                districts: new Set(),
                states: new Set(),
              }
            }

            const agg = result[surveyId]
            agg.responseCount += 1

            if (r.school_id) agg.schools.add(r.school_id)
            if (r.district_id) agg.districts.add(r.district_id)
            if (r.state) agg.states.add(r.state)

            const dt = toDate(r.submittedAt)
            if (dt) {
              if (!agg.lastResponseAt || dt.getTime() > agg.lastResponseAt.getTime()) {
                agg.lastResponseAt = dt
              }
            }
          }
        }

        if (mounted) setAggregates(result)
      } catch (e) {
        console.error('Error aggregating responses:', e)
        if (mounted) {
          setError(e instanceof Error ? e.message : 'Failed to load response aggregates')
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    run()

    return () => {
      mounted = false
    }
  }, [key])

  return { aggregates, loading, error }
}
