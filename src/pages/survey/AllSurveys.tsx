import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function AllSurveys(){

 const [activeTab, setActiveTab] = useState("All Surveys")
 const [searchQuery, setSearchQuery] = useState("")
   const navigate = useNavigate()


  const filters = ["School", "District", "State", "Number of Responses"]
  const surveyTypes = ["All Surveys", "Pulse", "Challenge"]

  const testing = [
    {name: "GreenBelt", type: "Challenge", responses: 4990, lastResponse: "2 hours ago"},
    {name: "Hyattsville", type: "Pulse", responses: 21, lastResponse: "Published"},
    {name: "College Park", type: "Challenge", responses: 1223, lastResponse: "Yesterday"},
    {name: "Duvual", type: "Pulse", responses: 193, lastResponse: "6 mins ago"},
    {name: "Howard", type: "Challenge", responses: 23, lastResponse: "March 67, 2067"},
  ]

  const filteredSurveys = testing.filter((survey) => {
    const matchesType = activeTab === "All Surveys" || survey.type === activeTab
    const matchesSearch = survey.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          survey.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          survey.responses.toString().includes(searchQuery.toLowerCase()) ||
                          survey.lastResponse.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  return (
    <div className="ml-8 mt-8">
      <div className="flex justify-between mb-4">
        <h1 className="text-4xl font-bold">All Surveys</h1>

        <button
        onClick={() => navigate("/surveys/builder")}
        className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-[#269ACF] text-white font-medium rounded-xl">
        <span>{"Create New Survey "}</span>
        </button>
      </div>

      <h1 className="text-4xl mb-3 text-[#2F6CC0]">Filter</h1>


      <div className="flex flex-wrap gap-3 mb-8">
        {filters.map((filter) => (
          <div key={filter} className="flex flex-col">
            <select className="bg-[#E9F9FF] rounded-2xl px-4 py-2 mx-2">
              <option>{filter}</option>
            </select>
          </div>
        ))}



        <div>
          <input 
            type="text" 
            placeholder="Search" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-4 py-2 bg-[#E9F9FF] rounded-2xl"
          />
        </div>


        <div className="border border-[#2F6CC0] rounded-xl px-4 py-2">
          <div className="flex p-1 rounded-lg text-[#269ACF]">
            {surveyTypes.map((type) => (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`px-4 py-1 rounded-lg ${
                  activeTab === type 
                  ? "bg-[#2F6CC0] text-white" 
                  : ""
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>


      <div className="bg-[#EAF8FD] p-8 rounded-xl">
      <div className="rounded-xl shadow-lg bg-white">
        <table className="w-full text-left border-collapse divide-y divide-gray-500">
          <thead>
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Responses</th>
              <th className="px-6 py-4">Last Response</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-500">
            {filteredSurveys.length > 0 ? (
              filteredSurveys.map((survey) => (
                <tr key={survey.name}>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <span>{survey.name}</span>
                    </div>
                  </td>

                  <td className="px-4 py-2">
                    <span>
                      {survey.type}
                    </span>
                  </td>
                  
                  <td className="px-6 py-5">
                    <span>
                      {survey.responses}
                    </span>
                  </td>

                  <td className="px-4 py-2">
                    <span>{survey.lastResponse}</span>
                  </td>
                </tr>
              ))
            ) : ""}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  )
}

