import GenerateReport from '@/components/analytics/GenerateReport'
import ResponseChart from '@/components/analytics/ResponseChart'
import SelectionMenu from '@/components/analytics/SelectionMenu'

export default function Analytics() {
  {
    /* Sample chart data */
  }
  const charts = [
    {
      question: 'How safe do you feel at school?',
      data: 'Chart data goes here',
    },
    { question: 'Question 2', data: 'Chart data goes here' },
    { question: 'Question 3', data: 'More chart data' },
    { question: 'Question 4', data: 'Even more data' },
    { question: 'Question 5', data: 'Even more data' },
    { question: 'Question 6', data: 'Even more data' },
    { question: 'Question 7', data: 'Chart data goes here' },
    { question: 'Question 8', data: 'More chart data' },
  ]

  return (
    <div className="p-6">
      <h1 className="font-heading text-4xl font-bold text-heading mb-4">
        Survey Analytics
      </h1>
      <p className="font-body text-lg text-body">
        View data visualizations and insights from survey responses.
      </p>

      {/* Generate Report Button */}
      <GenerateReport />

      {/* Selection Menu */}
      <SelectionMenu />
      
      {/* Response Charts Grid */}
      <div className="h-[400px] overflow-y-auto">
        <div className="grid grid-cols-2 gap-4 bg-background p-4">
          {charts.map((chart, idx) => (
            <ResponseChart
              key={idx}
              question={chart.question}
              data={chart.data}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
