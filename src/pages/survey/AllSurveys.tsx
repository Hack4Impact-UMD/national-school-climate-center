import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePublishedSurveys } from '@/hooks/useSurveys'
import { useSurveyResponseAggregates } from '@/hooks/useSurveyResponseAggregates'
import jsPDF from "jspdf"

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

const selectPillClass =
  'h-10 rounded-full px-4 text-sm bg-secondary/10 border border-primary/30 text-heading focus:outline-none focus:ring-2 focus:ring-primary/30'

const inputPillClass =
  'h-10 w-full rounded-full px-4 text-sm bg-secondary/10 border border-primary/30 text-heading placeholder:text-body/60 focus:outline-none focus:ring-2 focus:ring-primary/30'

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

  // only published surveys; filter by type via tabs.
  const { surveys, loading, error } = usePublishedSurveys({
    type: (tab === 'all' ? null : tab.charAt(0).toUpperCase() + tab.slice(1)) as "challenge" | "pulse" ,
  })

  const surveyIds = useMemo(() => surveys.map((s) => s.id), [surveys])
  const {
    aggregates,
    loading: aggLoading,
    error: aggError,
  } = useSurveyResponseAggregates({ surveyIds })

  // build dropdown options from "responded-from" evidence in responses.
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

  const [drop, setDrop] = useState(false)
  const handleExportCSV = () => {
    try {
      setDrop(false)
      let csv = "Survey Title, Type, Responses, Last Response\n"

      rows.forEach((row) => {
        csv += `${row.title}", "${row.type}", "${row.responseCount}", "${formatDate(row.lastResponseAt)}"\n`
      })
 
      const encodedCSV = encodeURI(csv)
      const downloadLink = document.createElement("a")
      downloadLink.href = `data:text/csv;charset=utf-8,${encodedCSV}`
      downloadLink.setAttribute("download", "Surveys_Report.csv")
      downloadLink.click()
      console.log("Downloading as CSV")
      
    } catch (error) {
      console.error("Failed to generate the CSV", error)
    }
  }


  const handleExportPDF = () => {
    try {
      const doc = new jsPDF()

      doc.setFontSize(20)
      doc.text("Survey Report", 15, 25)
      
      doc.setFontSize(14)
      let y = 35

      doc.text("Name", 15, y)
      doc.text("Type", 90, y)
      doc.text("Responses", 140, y)
      doc.text("Last Response", 170, y)
      y += 10

      doc.setLineWidth(0.7)
      doc.line(15, y, 195, y)
      y += 7
      rows.map((row) => {
        doc.setFontSize(12)
        doc.text(row.title, 15, y)
        doc.text(row.type, 90, y)
        doc.text(String(row.responseCount), 140, y)
        doc.text(formatDate(row.lastResponseAt), 170, y)
        y += 12 

        if (y > 270) {
          doc.addPage()
          y = 25
        }
      })

      doc.save("Surveys_Report.pdf")
      console.log("Downloading PDF")

    } catch (error) {
      console.error("Failed to generate the PDF", error)
    }
  }

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
          className="bg-primary text-white rounded-lg px-4 py-2 text-sm shadow-sm"
          title="Create a new survey"
        >
          Create New Survey
        </button>
      </div>

      <div>
        <h2 className="font-heading text-2xl font-semibold text-primary mb-3">Filter</h2>

        {/* Filter bar */}
        <div className="flex flex-wrap gap-3 items-center">
          <select
            className={selectPillClass}
            value={filters.school}
            onChange={(e) => setFilters((p) => ({ ...p, school: e.target.value }))}
          >
            <option value="any">School</option>
            {filterOptions.schools.map((s) => (
              <option key={s} value={s} className="text-heading">
                {s}
              </option>
            ))}
          </select>

          <select
            className={selectPillClass}
            value={filters.district}
            onChange={(e) => setFilters((p) => ({ ...p, district: e.target.value }))}
          >
            <option value="any">District</option>
            {filterOptions.districts.map((d) => (
              <option key={d} value={d} className="text-heading">
                {d}
              </option>
            ))}
          </select>

          <select
            className={selectPillClass}
            value={filters.state}
            onChange={(e) => setFilters((p) => ({ ...p, state: e.target.value }))}
          >
            <option value="any">State</option>
            {filterOptions.states.map((st) => (
              <option key={st} value={st} className="text-heading">
                {st}
              </option>
            ))}
          </select>

          <select
            className={selectPillClass}
            value={filters.responses}
            onChange={(e) =>
              setFilters((p) => ({ ...p, responses: e.target.value as Filters['responses'] }))
            }
          >
            <option value="any">Number of Responses</option>
            {RESPONSE_RANGES.filter((r) => r.id !== 'any').map((r) => (
              <option key={r.id} value={r.id} className="text-heading">
                {r.label}
              </option>
            ))}
          </select>

          <div className="flex-1 min-w-[240px]">
            <input
              className={inputPillClass}
              placeholder="Search"
              value={filters.search}
              onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {/* Tabs + actions */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="inline-flex rounded-xl border border-primary bg-white p-1">
          {([
            { key: 'all', label: 'All Surveys' },
            { key: 'challenge', label: 'Challenge' },
            { key: 'pulse', label: 'Pulse' },
          ] as const).map((t) => {
            const active = tab?.toLowerCase() === t.key.toLowerCase()
            return (
              <button
                key={t.key}
                type="button"
                className={
                  'px-4 py-2 text-sm rounded-lg transition-colors ' +
                  (active ? 'bg-primary text-white shadow-sm' : 'text-heading hover:bg-secondary/20')
                }
                onClick={() => setTab(t.key.toLowerCase() as typeof t.key)}
              >
                {t.label}
              </button>
            )
          })}
        </div>

        <div className=" relative flex items-center gap-2">
          {/* Export is present in the design but wiring can be added later */}
          <button
            type="button"
            className="border border-primary rounded-lg px-4 py-2 text-sm bg-white text-heading hover:bg-secondary/10"
            onClick={() => {
              setDrop(!drop)
            }}
            title="Export"
          >
            <span className="inline-flex items-center gap-2">
              Export <span aria-hidden>▾</span>
            </span>
          </button>

        {drop && (
          <div className="absolute right-0 mt-1 w-23 z-10 items-center">
            <div onClick={() => setDrop(false)} />
              <div className=" mt-5 absolute w-full rounded-lg overflow-hidden bg-[#2F6CC0] text-white">
                <button onClick={() => 
                  {handleExportPDF()
                  setDrop(false)}}
                  className="w-full rounded-none">
                  PDF
                </button>

                <button onClick={() => 
                  {handleExportCSV() 
                  setDrop(false)}} 
                  className="w-full rounded-none mt-1">
                  CSV
                </button>
          </div>
        </div>
        )}
        </div>
      </div>

      {/* Light-blue panel wrapper */}
      <div className="rounded-2xl bg-secondary/10 p-5">
        {/* Table */}
        <div className="rounded-2xl border bg-white overflow-hidden shadow-sm">
          <div className="overflow-auto max-h-[520px]">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white">
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
                    <td colSpan={4} className="px-4 py-6 text-red-600 whitespace-pre-wrap break-words">
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
                      <td className="px-4 py-3">{r.type?.charAt(0).toUpperCase() + r.type?.slice(1)}</td>
                      <td className="px-4 py-3">{r.responseCount}</td>
                      <td className="px-4 py-3">{formatDate(r.lastResponseAt)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

