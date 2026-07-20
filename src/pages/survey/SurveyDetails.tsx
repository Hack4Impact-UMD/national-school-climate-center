import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSurvey } from '@/hooks/useSurveys'
import { useResponses } from '@/hooks/useResponses'
import { Button } from '@/components/ui/button'
import { BsDownload } from "react-icons/bs"

function formatSubmittedAt(v: unknown): string {
  if (!v) return '—'
  if (v instanceof Date) return v.toISOString().split('T')[0]
  if (typeof v === 'string') {
    const d = new Date(v)
    return Number.isNaN(d.getTime()) ? v : d.toISOString().split('T')[0]
  }
  if (typeof v === 'object' && v && 'toDate' in v && typeof (v as any).toDate === 'function') {
    const d = (v as any).toDate()
    return d instanceof Date ? d.toISOString().split('T')[0] : '—'
  }
  return '—'
}


export default function SurveyDetails() {
  const { surveyId } = useParams()
  const navigate = useNavigate()

  const { survey, loading: surveyLoading, error: surveyError } = useSurvey(surveyId ?? null)
  const { responses, loading: responsesLoading, error: responsesError } = useResponses(surveyId)

  const loading = surveyLoading || responsesLoading
  const error = surveyError ?? responsesError

  const surveyTitle = (survey as any)?.title ?? 'Survey'
  const surveyType = (survey as any)?.type ?? null

  const isPulse = String(surveyType).toLowerCase() === 'pulse' || String(surveyType).toLowerCase() === 'pulse_survey'

  const questionRows = useMemo(() => {
    const qs = ((survey as any)?.questions ?? []) as Array<any>
    return qs
      .slice()
      .sort((a, b) => (Number(a?.order ?? 0) || 0) - (Number(b?.order ?? 0) || 0))
      .map((q, idx) => ({
        key: q?.question_id ?? String(idx),
        id: q?.question_id ?? '—',
        text: q?.text ?? q?.prompt ?? '—',
        questionType: q?.questionType ?? q?.type ?? '—',
        order: q?.order ?? idx + 1,
      }))
  }, [survey])

    const handleExportCSV = () => {
      try {
        let csv: string
        if (isPulse){
          csv = "Submitted, School, District, Responses, Respondent, Email, "
          questionRows.forEach((q: any) => {
            csv += `"${q.text}",`
          })
          csv += "\n"
    
          responses.forEach((row : any) => {
            const submitted = formatSubmittedAt(row.submittedAt) ?? "—"
            const school = row.school_id ?? "—"
            const district = row.district_id ?? "—"
            const responseCount = Array.isArray(row.answers) ? row.answers.length : 0
            const respondent = row.respondentName ?? "—"
            const email = row.respondentEmail ?? "—"
            csv += `"${submitted}", "${school}", "${district}","${responseCount}", "${respondent}", "${email}",`

            row.answers?.forEach((a : any) => {
              const value = a.value ?? "—"
              csv += `"${String(value)}",`
            })
            csv += "\n"
          })
          
      }
        else {
          csv = "Submitted, School, District, Responses,"
          questionRows.forEach((q: any) => {
            csv += `"${q.text}",`
          })
          csv += "\n"

          responses.forEach((row) => {
            const submitted = formatSubmittedAt(row.submittedAt) ?? "—"
            const school = row.school_id ?? "—"
            const district = row.district_id ?? "—"
            const responseCount = Array.isArray(row.answers) ? row.answers.length : 0
            csv += `"${submitted}", "${school}", "${district}","${responseCount}",`
            row.answers?.forEach((a : any) => {
              const value = a.value ?? "—"
              csv += `"${String(value)}",`
            })
            csv += "\n"

        })
      }

  
        const encodedCSV = encodeURI(csv)
        const downloadLink = document.createElement("a")
        downloadLink.href = `data:text/csv;charset=utf-8,${encodedCSV}`
        downloadLink.setAttribute("download", `${surveyTitle} responses.csv`)
        downloadLink.click()
  
      } catch (error) {
        console.error("Failed to generate the CSV", error)
      }
    }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-heading text-4xl font-bold text-heading mb-1">{surveyTitle}</h1>
          <p className="font-body text-lg text-body">
            Survey details and responses (NSCC admin only)
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/surveys')}
          className="border border-primary rounded-lg px-4 py-2 text-sm bg-white text-heading hover:bg-secondary/10"
        >
          Back to All Surveys
        </button>
      </div>

      {loading && (
        <div className="rounded-2xl border bg-white p-5 text-body">Loading…</div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border bg-white p-5 text-red-600 whitespace-pre-wrap break-words">
          {error}
          <div className="mt-3 text-sm text-body">
            If this is a permissions error, Firestore rules likely need a nested match for
            <code className="mx-1">/surveys/&lt;surveyId&gt;/responses</code>.
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Survey metadata */}
          <div className="rounded-2xl bg-secondary/10 p-5">
            <div className="rounded-2xl border bg-white p-5 space-y-2">
              <div className="text-sm text-body">
                <span className="font-semibold text-heading">Survey ID:</span> {survey?.id}
              </div>
              <div className="text-sm text-body"> 
                <span className="font-semibold text-heading">Type:</span> {String(surveyType ?? '—')}
              </div>
              {'status' in (survey as any) && (
                <div className="text-sm text-body">
                  <span className="font-semibold text-heading">Status:</span> {(survey as any).status ?? '—'}
                </div>
              )}
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-3">
            <h2 className="font-heading text-2xl font-semibold text-primary">Questions</h2>
            <div className="rounded-2xl border bg-white overflow-hidden">
              {questionRows.length === 0 ? (
                <div className="p-5 text-body">No questions found on this survey document.</div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-white">
                    <tr className="text-left border-b">
                      <th className="px-4 py-3 font-semibold">Order</th>
                      <th className="px-4 py-3 font-semibold">Question ID</th>
                      <th className="px-4 py-3 font-semibold">Text</th>
                      <th className="px-4 py-3 font-semibold">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questionRows.map((q) => (
                      <tr key={q.key} className="border-b last:border-b-0">
                        <td className="px-4 py-3">{q.order}</td>
                        <td className="px-4 py-3 font-mono text-xs">{q.id}</td>
                        <td className="px-4 py-3">{q.text}</td>
                        <td className="px-4 py-3">{q.questionType}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Responses */}
          <div className="space-y-3">
            <h2 className="font-heading text-2xl font-semibold text-primary">Responses</h2>
            <div className="rounded-2xl border bg-white overflow-hidden">
              <div className="relative flex items-center gap-2">

            <Button onClick={handleExportCSV} className="ml-auto mr-5 mt-5" >
              <BsDownload />
            </Button>
        </div>
              {responses.length === 0 ? (
                <div className="p-5 text-body">No responses found.</div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-white">
                    <tr className="text-left border-b">
                      <th className="px-4 py-3 font-semibold">Submitted</th>
                      <th className="px-4 py-3 font-semibold">School</th>
                      <th className="px-4 py-3 font-semibold">District</th>
                      <th className="px-4 py-3 font-semibold">State</th>
                      <th className="px-4 py-3 font-semibold">Responses</th>
                    </tr>
                  </thead>
                  <tbody>
                    {responses.map((r) => {
                      const rr: any = r
                      return (
                        <tr key={r.id} className="border-b last:border-b-0 align-top">
                          <td className="px-4 py-3 whitespace-nowrap">
                            {formatSubmittedAt(rr.submittedAt)}
                          </td>
                          <td className="px-4 py-3">{rr.school_id ?? '—'}</td>
                          <td className="px-4 py-3">{rr.district_id ?? '—'}</td>
                          <td className="px-4 py-3">{rr.state ?? '—'}</td>
                          <td className="px-4 py-3">{Array.isArray(rr.answers) ? rr.answers.length : '—'}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
