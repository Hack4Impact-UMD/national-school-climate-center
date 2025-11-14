import React, { useMemo, useState } from 'react'
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  LayersControl,
  Tooltip,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

// ===== Dummy data =====

// /schools docs (id = school_id)
const SCHOOLS = [
  {
    id: 'school-a',
    name: 'Roosevelt HS',
    lat: 38.9369,
    lng: -77.032,
    district_id: 'dc-01',
  },
  {
    id: 'school-b',
    name: 'Jefferson MS',
    lat: 39.2904,
    lng: -76.6122,
    district_id: 'md-01',
  },
  {
    id: 'school-c',
    name: 'Lincoln HS',
    lat: 40.7128,
    lng: -74.006,
    district_id: 'ny-01',
  },
  {
    id: 'school-d',
    name: 'Franklin ES',
    lat: 38.9072,
    lng: -77.0369,
    district_id: 'dc-02',
  },
  {
    id: 'school-e',
    name: 'Madison HS',
    lat: 39.9526,
    lng: -75.1652,
    district_id: 'pa-01',
  },
]

// /responses docs (simplified)
type Answer = { question_id: string; value: number | string }
type Resp = {
  survey_id: string
  uid: string
  school_id: string
  consent: boolean
  answers: Answer[]
  submittedAt: Date
}

// Questions we’ll see in answers:
// - q1_satisfaction (1–5 numeric)
// - q2_safety (Yes/No) — categorical
// - q3_teacher_support (1–5 numeric)
// - q4_facilities (1–5 numeric)
// - q5_belonging (1–5 numeric)

const RESPONSES: Resp[] = [
  // Roosevelt HS (A) — 4 responses
  {
    survey_id: 'svy-1',
    uid: 'a1',
    school_id: 'school-a',
    consent: true,
    answers: [
      { question_id: 'q1_satisfaction', value: 4 },
      { question_id: 'q2_safety', value: 'Yes' },
      { question_id: 'q3_teacher_support', value: 5 },
      { question_id: 'q4_facilities', value: 4 },
      { question_id: 'q5_belonging', value: 4 },
    ],
    submittedAt: new Date(),
  },
  {
    survey_id: 'svy-1',
    uid: 'a2',
    school_id: 'school-a',
    consent: true,
    answers: [
      { question_id: 'q1_satisfaction', value: 5 },
      { question_id: 'q2_safety', value: 'Yes' },
      { question_id: 'q3_teacher_support', value: 4 },
      { question_id: 'q4_facilities', value: 5 },
      { question_id: 'q5_belonging', value: 5 },
    ],
    submittedAt: new Date(),
  },
  {
    survey_id: 'svy-1',
    uid: 'a3',
    school_id: 'school-a',
    consent: true,
    answers: [
      { question_id: 'q1_satisfaction', value: 3 },
      { question_id: 'q2_safety', value: 'Sometimes' },
      { question_id: 'q3_teacher_support', value: 4 },
      { question_id: 'q4_facilities', value: 3 },
      { question_id: 'q5_belonging', value: 3 },
    ],
    submittedAt: new Date(),
  },
  {
    survey_id: 'svy-1',
    uid: 'a4',
    school_id: 'school-a',
    consent: true,
    answers: [
      { question_id: 'q1_satisfaction', value: 4 },
      { question_id: 'q2_safety', value: 'Yes' },
      { question_id: 'q3_teacher_support', value: 4 },
      { question_id: 'q4_facilities', value: 4 },
      { question_id: 'q5_belonging', value: 4 },
    ],
    submittedAt: new Date(),
  },

  // Jefferson MS (B) — 3 responses
  {
    survey_id: 'svy-1',
    uid: 'b1',
    school_id: 'school-b',
    consent: true,
    answers: [
      { question_id: 'q1_satisfaction', value: 2 },
      { question_id: 'q2_safety', value: 'No' },
      { question_id: 'q3_teacher_support', value: 3 },
      { question_id: 'q4_facilities', value: 2 },
      { question_id: 'q5_belonging', value: 2 },
    ],
    submittedAt: new Date(),
  },
  {
    survey_id: 'svy-1',
    uid: 'b2',
    school_id: 'school-b',
    consent: true,
    answers: [
      { question_id: 'q1_satisfaction', value: 3 },
      { question_id: 'q2_safety', value: 'Sometimes' },
      { question_id: 'q3_teacher_support', value: 3 },
      { question_id: 'q4_facilities', value: 3 },
      { question_id: 'q5_belonging', value: 3 },
    ],
    submittedAt: new Date(),
  },
  {
    survey_id: 'svy-1',
    uid: 'b3',
    school_id: 'school-b',
    consent: true,
    answers: [
      { question_id: 'q1_satisfaction', value: 2 },
      { question_id: 'q2_safety', value: 'No' },
      { question_id: 'q3_teacher_support', value: 2 },
      { question_id: 'q4_facilities', value: 2 },
      { question_id: 'q5_belonging', value: 2 },
    ],
    submittedAt: new Date(),
  },

  // Lincoln HS (C) — 2 responses
  {
    survey_id: 'svy-1',
    uid: 'c1',
    school_id: 'school-c',
    consent: true,
    answers: [
      { question_id: 'q1_satisfaction', value: 3 },
      { question_id: 'q2_safety', value: 'Yes' },
      { question_id: 'q3_teacher_support', value: 3 },
      { question_id: 'q4_facilities', value: 3 },
      { question_id: 'q5_belonging', value: 3 },
    ],
    submittedAt: new Date(),
  },
  {
    survey_id: 'svy-1',
    uid: 'c2',
    school_id: 'school-c',
    consent: true,
    answers: [
      { question_id: 'q1_satisfaction', value: 4 },
      { question_id: 'q2_safety', value: 'Yes' },
      { question_id: 'q3_teacher_support', value: 4 },
      { question_id: 'q4_facilities', value: 4 },
      { question_id: 'q5_belonging', value: 4 },
    ],
    submittedAt: new Date(),
  },

  // Franklin ES (D) — 1 response
  {
    survey_id: 'svy-1',
    uid: 'd1',
    school_id: 'school-d',
    consent: true,
    answers: [
      { question_id: 'q1_satisfaction', value: 5 },
      { question_id: 'q2_safety', value: 'Yes' },
      { question_id: 'q3_teacher_support', value: 5 },
      { question_id: 'q4_facilities', value: 5 },
      { question_id: 'q5_belonging', value: 5 },
    ],
    submittedAt: new Date(),
  },

  // Madison HS (E) — 3 responses
  {
    survey_id: 'svy-1',
    uid: 'e1',
    school_id: 'school-e',
    consent: true,
    answers: [
      { question_id: 'q1_satisfaction', value: 4 },
      { question_id: 'q2_safety', value: 'Yes' },
      { question_id: 'q3_teacher_support', value: 4 },
      { question_id: 'q4_facilities', value: 4 },
      { question_id: 'q5_belonging', value: 4 },
    ],
    submittedAt: new Date(),
  },
  {
    survey_id: 'svy-1',
    uid: 'e2',
    school_id: 'school-e',
    consent: true,
    answers: [
      { question_id: 'q1_satisfaction', value: 3 },
      { question_id: 'q2_safety', value: 'Sometimes' },
      { question_id: 'q3_teacher_support', value: 3 },
      { question_id: 'q4_facilities', value: 3 },
      { question_id: 'q5_belonging', value: 3 },
    ],
    submittedAt: new Date(),
  },
  {
    survey_id: 'svy-1',
    uid: 'e3',
    school_id: 'school-e',
    consent: true,
    answers: [
      { question_id: 'q1_satisfaction', value: 2 },
      { question_id: 'q2_safety', value: 'No' },
      { question_id: 'q3_teacher_support', value: 2 },
      { question_id: 'q4_facilities', value: 2 },
      { question_id: 'q5_belonging', value: 2 },
    ],
    submittedAt: new Date(),
  },
]

// ===== helpers =====

function isNum(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v)
}
// 1..5 => red->yellow->green; null => gray
function scoreToColor(avg: number | null): string {
  if (avg == null) return '#888'
  const t = Math.max(0, Math.min(1, (avg - 1) / 4))
  const r = Math.round(255 * (1 - t))
  const g = Math.round(200 * t + 55 * (1 - t))
  const b = Math.round(80 * (1 - t))
  return `rgb(${r},${g},${b})`
}
// slightly larger defaults
function sizeByCount(n: number): number {
  if (n <= 1) return 14
  if (n <= 5) return 20
  if (n <= 10) return 28
  if (n <= 25) return 36
  return 44
}

const { BaseLayer, Overlay } = LayersControl

export default function GeoMapDemo() {
  // derive question ids from data
  const questionIds = useMemo(() => {
    const s = new Set<string>()
    for (const r of RESPONSES) {
      if (!r.consent) continue
      for (const a of r.answers) if (a?.question_id) s.add(a.question_id)
    }
    return Array.from(s).sort()
  }, [])

  const [selectedQuestion, setSelectedQuestion] = useState<string>(
    questionIds.includes('q1_satisfaction')
      ? 'q1_satisfaction'
      : questionIds[0] || ''
  )

  // aggregate responses by school_id for the selected question
  const points = useMemo(() => {
    type Agg = { count: number; values: number[] }
    const bySchool: Record<string, Agg> = {}

    for (const r of RESPONSES) {
      if (!r.consent) continue
      const sid = r.school_id
      if (!sid) continue
      if (!bySchool[sid]) bySchool[sid] = { count: 0, values: [] }
      bySchool[sid].count++

      const ans = r.answers.find((a) => a.question_id === selectedQuestion)
      if (ans && typeof ans.value === 'number' && Number.isFinite(ans.value)) {
        bySchool[sid].values.push(ans.value)
      }
    }

    const out: Array<{
      id: string
      name?: string
      lat: number
      lng: number
      count: number
      avg: number | null
    }> = []

    for (const school of SCHOOLS) {
      const agg = bySchool[school.id]
      if (!agg) continue
      const avg = agg.values.length
        ? agg.values.reduce((s, x) => s + x, 0) / agg.values.length
        : null
      out.push({
        id: school.id,
        name: school.name,
        lat: school.lat,
        lng: school.lng,
        count: agg.count,
        avg,
      })
    }
    return out
  }, [selectedQuestion])

  return (
    <div className="grid grid-rows-[auto_1fr] gap-3 w-full h-[80vh]">
      {/* controls */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">
          Question:&nbsp;
          <select
            className="border rounded px-2 py-1"
            value={selectedQuestion}
            onChange={(e) => setSelectedQuestion(e.target.value)}
          >
            {questionIds.length === 0 && <option value="">(none)</option>}
            {questionIds.map((qid) => (
              <option key={qid} value={qid}>
                {qid}
              </option>
            ))}
          </select>
        </label>
        <div className="text-sm">Schools with responses: {points.length}</div>
      </div>

      {/* map */}
      <div className="w-full h-full rounded-xl overflow-hidden border">
        <MapContainer
          center={[39.0, -95.0]}
          zoom={5}
          style={{ width: '100%', height: '100%' }}
        >
          <LayersControl position="topright">
            {/* Base maps */}
            <BaseLayer checked name="OpenStreetMap">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
            </BaseLayer>
            <BaseLayer name="Carto Light">
              <TileLayer
                url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors &copy; CARTO"
              />
            </BaseLayer>

            {/* Overlays */}
            <Overlay checked name="Aggregated Responses">
              <>
                {points.map((p) => {
                  const color = scoreToColor(p.avg)
                  const radius = sizeByCount(p.count)
                  return (
                    <CircleMarker
                      key={`agg-${p.id}`}
                      center={[p.lat, p.lng]}
                      radius={radius}
                      pathOptions={{
                        color,
                        fillColor: color,
                        fillOpacity: 0.7,
                        weight: 1,
                      }}
                    >
                      <Popup>
                        <div style={{ minWidth: 220 }}>
                          <div style={{ fontWeight: 600, marginBottom: 6 }}>
                            {p.name || p.id}
                          </div>
                          <div>
                            <b>School ID:</b> {p.id}
                          </div>
                          <div>
                            <b>Responses:</b> {p.count}
                          </div>
                          <div>
                            <b>Avg ({selectedQuestion}):</b>{' '}
                            {p.avg != null ? p.avg.toFixed(2) : 'n/a'}
                          </div>
                          <div>
                            <b>Location:</b> {p.lat.toFixed(4)},{' '}
                            {p.lng.toFixed(4)}
                          </div>
                        </div>
                      </Popup>
                      <Tooltip
                        direction="top"
                        offset={[0, -radius]}
                        opacity={0.9}
                      >
                        {p.name || p.id}
                      </Tooltip>
                    </CircleMarker>
                  )
                })}
              </>
            </Overlay>

            <Overlay name="School Locations">
              <>
                {SCHOOLS.map((s) => (
                  <CircleMarker
                    key={`loc-${s.id}`}
                    center={[s.lat, s.lng]}
                    radius={6}
                    pathOptions={{
                      color: '#333',
                      fillColor: '#fff',
                      fillOpacity: 1,
                      weight: 1,
                    }}
                  >
                    <Tooltip direction="top" offset={[0, -8]} opacity={0.9}>
                      {s.name}
                    </Tooltip>
                    <Popup>
                      <div style={{ minWidth: 200 }}>
                        <div style={{ fontWeight: 600, marginBottom: 6 }}>
                          {s.name}
                        </div>
                        <div>
                          <b>School ID:</b> {s.id}
                        </div>
                        <div>
                          <b>District:</b> {s.district_id}
                        </div>
                        <div>
                          <b>Location:</b> {s.lat.toFixed(4)},{' '}
                          {s.lng.toFixed(4)}
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </>
            </Overlay>
          </LayersControl>
        </MapContainer>
      </div>
    </div>
  )
}
