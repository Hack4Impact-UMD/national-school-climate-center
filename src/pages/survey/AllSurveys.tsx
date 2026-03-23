import { useState } from "react";

export default function AllSurveys(){

 const [activeTab, setActiveTab] = useState("All Surveys");
  const [searchQuery, setSearchQuery] = useState("");

  const filters = ["Name", "Respondent Group", "Compare By", "Survey Type", "From-To"];
  const surveyTypes = ["All Surveys", "Pulse", "Challenge"];

  const testing = [
    {name: "GreenBelt", type: "Challenge", responses: 4990, lastResponse: "2 hours ago"},
    {name: "Hyattsville", type: "Pulse", responses: 21, lastResponse: "Published"},
    {name: "College Park", type: "Challenge", responses: 1223, lastResponse: "Yesterday"},
    {name: "Duvual", type: "Pulse", responses: 193, lastResponse: "6 mins ago"},
    {name: "Howard", type: "Challenge", responses: 23, lastResponse: "March 67, 2067"},
  ];

  const filteredSurveys = testing.filter((survey) => {
    const matchesType = activeTab === "All Surveys" || survey.type === activeTab;
    const matchesSearch = survey.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="ml-8 mt-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">All Surveys</h1>
      </div>


      <div className="flex flex-wrap gap-3 mb-8">
        {filters.map((filter) => (
          <div key={filter} className="flex flex-col">
            <select className="bg-[#E9F9FF] rounded-lg px-4 py-2">
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
            className="pl-4  py-2 border border-black rounded-lg "
          />
        </div>


        <div className="flex flex-col mr-auto">
          <div className="flex p-1 rounded-lg">
            {surveyTypes.map((type) => (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`px-4 py-1 rounded-lg ${
                  activeTab === type 
                  ? "bg-white text-blue-600 shadow-sm" 
                  : ""
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>



      <div className="rounded-xl shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Responses</th>
              <th className="px-6 py-4">Last Response</th>
            </tr>
          </thead>

          <tbody>
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
  );
};

