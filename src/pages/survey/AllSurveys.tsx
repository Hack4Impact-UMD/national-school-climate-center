import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePublishedSurveys } from '@/hooks/useSurveys'
import { useSurveyResponseAggregates } from '@/hooks/useSurveyResponseAggregates'

const RESPONSE_RANGES = [
  { id: 'any', label: 'Any', test: (_n: number) => true },
  { id: 'lt100', label: '<100', test: (n: number) => n < 100 },
  { id: '100_500', label: '100–500', test: (n: number) => n >= 100 && n <= 500 },
  { id: 'gt500', label: '500+', test: (n: number) => n > 500 },
] as const

type TabKey = 'all' | 'challenge' | 'pulse'

type Filters = {
  school: string
  district: string
  state: string
  responses: (typeof RESPONSE_RANGES)[number]['id']
  search: string
}

function formatDate(d: Date | null) {
  if (!d) return '—'
  return d.toISOString().split('T')[0]
}

export default function AllSurveys() {
  const navigate = useNavigate()

  const [tab, setTab] = useState<TabKey>('all')
  const [filters, setFilters] = useState<Filters>({
    school: 'any',
    district: 'any',
    state: 'any',
    responses: 'any',
    search: '',
  })

  // Only published surveys; filter by type via tabs.
  const { surveys, loading, error } = usePublishedSurveys({
    type: tab === 'all' ? null : tab,
  })

  const surveyIds = useMemo(() => surveys.map((s) => s.id), [surveys])
  const {
    aggregates,
    loading: aggLoading,
    error: aggError,
  } = useSurveyResponseAggregates({ surveyIds })

  // Build dropdown options from "responded-from" evidence in responses.
  const filterOptions = useMemo(() => {
    const schools = new Set<string>()
    const districts = new Set<string>()
    const states = new Set<string>()

    Object.values(aggregates).forEach((agg) => {
      agg.schools.forEach((v) => schools.add(v))
      agg.districts.forEach((v) => districts.add(v))
      agg.states.forEach((v) => states.add(v))
    })

    return {
      schools: Array.from(schools).sort(),
      districts: Array.from(districts).sort(),
      states: Array.from(states).sort(),
    }
  }, [aggregates])

  const rows = useMemo(() => {
    const range = RESPONSE_RANGES.find((r) => r.id === filters.responses) ?? RESPONSE_RANGES[0]

    return surveys
      .map((s) => {
        const agg = aggregates[s.id]
        return {
          id: s.id,
          title: (s as any).title ?? 'Untitled Survey',
          type: (s as any).type ?? '—',
          responseCount: agg?.responseCount ?? 0,
          lastResponseAt: agg?.lastResponseAt ?? null,
          schools: agg?.schools ?? new Set<string>(),
          districts: agg?.districts ?? new Set<string>(),
          states: agg?.states ?? new Set<string>(),
        }
      })
      .filter((r) => {
        // responded-from filtering
        if (filters.school !== 'any' && !r.schools.has(filters.school)) return false
        if (filters.district !== 'any' && !r.districts.has(filters.district)) return false
        if (filters.state !== 'any' && !r.states.has(filters.state)) return false

        // response count range filter
        if (!range.test(r.responseCount)) return false

        // search filter (by title)
        if (filters.search.trim()) {
          const q = filters.search.trim().toLowerCase()
          if (!r.title.toLowerCase().includes(q)) return false
        }

        return true
      })
      .sort((a, b) => b.responseCount - a.responseCount)
  }, [surveys, aggregates, filters])

  const isLoading = loading || aggLoading
  const displayError = error ?? aggError

  return (
    <div className="p-6 space-y-5 max-w-6xl mx-auto pb-12">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-heading text-4xl font-bold text-heading mb-1">All Surveys</h1>
          <p className="font-body text-lg text-body">
            Published surveys (NSCC admin only). Filter by where respondents came from.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/surveys/builder')}
          className="bg-primary text-white rounded-full px-5 py-2 text-sm"
          title="Create a new survey"
        >
          Create New Survey
        </button>
      </div>

      <h2 className="font-heading text-2xl font-semibold text-primary">Filter</h2>

      {/* Filter bar (based on Figma, simplified per task requirements) */}
      <div className="flex flex-wrap gap-3 items-center">
        <select
          className="border rounded-full px-3 py-2 text-sm bg-white"
          value={filters.school}
          onChange={(e) => setFilters((p) => ({ ...p, school: e.target.value }))}
        >
          <option value="any">School</option>
          {filterOptions.schools.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          className="border rounded-full px-3 py-2 text-sm bg-white"
          value={filters.district}
          onChange={(e) => setFilters((p) => ({ ...p, district: e.target.value }))}
        >
          <option value="any">District</option>
          {filterOptions.districts.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select
          className="border rounded-full px-3 py-2 text-sm bg-white"
          value={filters.state}
          onChange={(e) => setFilters((p) => ({ ...p, state: e.target.value }))}
        >
          <option value="any">State</option>
          {filterOptions.states.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>

        <select
          className="border rounded-full px-3 py-2 text-sm bg-white"
          value={filters.responses}
          onChange={(e) =>
            setFilters((p) => ({ ...p, responses: e.target.value as Filters['responses'] }))
          }
        >
          <option value="any">Responses</option>
          {RESPONSE_RANGES.filter((r) => r.id !== 'any').map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
            </option>
          ))}
        </select>

        <div className="flex-1 min-w-[220px]">
          <input
            className="w-full border rounded-full px-4 py-2 text-sm"
            placeholder="Search"
            value={filters.search}
            onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
          />
        </div>
      </div>

      {/* Tabs + actions */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="inline-flex rounded-full border bg-white p-1">
          {([
            { key: 'all', label: 'All surveys' },
            { key: 'challenge', label: 'Challenge' },
            { key: 'pulse', label: 'Pulse' },
          ] as const).map((t) => {
            const active = tab === t.key
            return (
              <button
                key={t.key}
                type="button"
                className={
                  'px-4 py-2 text-sm rounded-full ' +
                  (active ? 'bg-primary text-white' : 'text-body hover:bg-secondary/20')
                }
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-2">
          {/* Placeholder buttons to match design; actual behavior can be wired later */}
          <button
            type="button"
            className="border rounded-full px-4 py-2 text-sm bg-white"
            disabled
            title="Export wiring is out of scope for this task"
          >
            Export
          </button>
          <button
            type="button"
            className="bg-primary text-white rounded-full px-4 py-2 text-sm"
            disabled
            title="Report generation wiring is out of scope for this task"
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border bg-white overflow-hidden shadow-sm">
        <div className="overflow-auto max-h-[520px]">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-secondary/10">
              <tr className="text-left">
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Responses</th>
                <th className="px-4 py-3 font-semibold">Last Response</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-body">
                    Loading published surveys...
                  </td>
                </tr>
              )}

              {!isLoading && displayError && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-red-600">
                    {displayError}
                  </td>
                </tr>
              )}

              {!isLoading && !displayError && rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-body">
                    No published surveys match the current filters.
                  </td>
                </tr>
              )}

              {!isLoading &&
                !displayError &&
                rows.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t hover:bg-secondary/10 cursor-pointer"
                    onClick={() => navigate(`/surveys/${r.id}`)}
                    title="Open survey"
                  >
                    <td className="px-4 py-3">{r.title}</td>
                    <td className="px-4 py-3">{r.type}</td>
                    <td className="px-4 py-3">{r.responseCount}</td>
                    <td className="px-4 py-3">{formatDate(r.lastResponseAt)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

