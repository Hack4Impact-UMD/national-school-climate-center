import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Mock data – replace with real hooks/fetches as needed
const MOCK_SCHOOLS = [
  'Lincoln Elementary School',
  'Roosevelt Middle School',
  'Jefferson High School',
  'Washington Academy',
]

const MOCK_DISTRICTS = [
  'North Shore Unified School District',
  'Eastside Community School District',
  'Westfield Public Schools',
  'Central Valley School District',
]

export default function CreatePulseSurvey() {
  const navigate = useNavigate()
  const [selectedSchool, setSelectedSchool] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')

  const handleCreateSurvey = () => {
    if (!selectedSchool && !selectedDistrict) {
      alert('Please select a school or district before creating a survey.')
      return
    }
    //need to fix this later - but challenge survey code basically controls the whole adding question process
    navigate('/surveys/create/challenge', {
      state: {
        defaultTab: 'list',
        surveyType: 'Pulse',
        school: selectedSchool || null,
        district: selectedDistrict || null,
      },
    })
  }

  const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSchool(e.target.value)
    if (e.target.value) setSelectedDistrict('')
  }

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDistrict(e.target.value)
    if (e.target.value) setSelectedSchool('')
  }

  return (
    <div className="mx-auto max-w-3xl p-6 md:p-10">
      {/* Header */}
      <h1 className="font-body text-4xl font-semibold text-[#2563EB] mb-2">
        Pulse Survey
      </h1>
      <h2 className="font-body text-xl font-semibold text-foreground mb-8">
        Create a Survey
      </h2>

      {/* School Selector */}
      <div className="mb-6">
        <label
          htmlFor="school-select"
          className="block font-body text-sm font-medium text-[#2563EB] mb-2"
        >
          Select School
        </label>
        <div className="relative">
          <select
            id="school-select"
            value={selectedSchool}
            onChange={handleSchoolChange}
            className="w-full appearance-none rounded-2xl border border-gray-300 bg-white px-5 py-4 pr-12 font-body text-base text-gray-700 shadow-sm focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition-colors"
          >
            <option value="" disabled>
              Name of School XXXXXX
            </option>
            {MOCK_SCHOOLS.map((school) => (
              <option key={school} value={school}>
                {school}
              </option>
            ))}
          </select>
          {/* Custom chevron */}
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>
      </div>

      {/* OR Divider */}
      <div className="flex items-center gap-4 my-6">
        <span className="font-body text-lg font-semibold text-gray-800">
          OR
        </span>
      </div>

      {/* District Selector */}
      <div className="mb-10">
        <label
          htmlFor="district-select"
          className="block font-body text-sm font-medium text-[#2563EB] mb-2"
        >
          Select District
        </label>
        <div className="relative">
          <select
            id="district-select"
            value={selectedDistrict}
            onChange={handleDistrictChange}
            className="w-full appearance-none rounded-2xl border border-gray-300 bg-white px-5 py-4 pr-12 font-body text-base text-gray-700 shadow-sm focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition-colors"
          >
            <option value="" disabled>
              Name of District XXXXXX
            </option>
            {MOCK_DISTRICTS.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
          {/* Custom chevron */}
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>
      </div>

      {/* Create Survey Button */}
      <div className="flex justify-center">
        <button
          onClick={handleCreateSurvey}
          className="rounded-xl bg-[#2563EB] px-12 py-4 font-body text-base font-medium text-white shadow-md hover:bg-[#1d4ed8] active:bg-[#1e40af] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50 focus:ring-offset-2"
        >
          Create Survey
        </button>
      </div>
    </div>
  )
}