import { useState } from 'react'
import GenerateReport from '@/components/analytics/GenerateReport'
import ResponseChart from '@/components/analytics/ResponseChart'
import ChartTypeSelector from '@/components/analytics/ChartTypeSelector'
import SimpleBarChart from '@/components/analytics/BarChart'
import SimplePieChart from '@/components/analytics/PieChart'
import type { ChartType } from '@/types/chartTypes'

export default function Analytics() {
  const [chartType, setChartType] = useState<ChartType>('bar')

  const charts = [
    {
      question: 'Do you feel safe at school?',
      chartData: [
        { name: 'Yes', value: 40 },
        { name: 'No', value: 20 },
        { name: 'Sometimes', value: 10 },
      ],
    },
    {
      question: 'How satisfied are you with the school environment?',
      chartData: [
        { name: '1', value: 120 },
        { name: '2', value: 50 },
        { name: '3', value: 80 },
        { name: '4', value: 50 },
        { name: '5', value: 10 },
      ],
    },
    {
      question: 'Do you feel safe at school?',
      chartData: [
        { name: 'Yes', value: 40 },
        { name: 'No', value: 20 },
        { name: 'Sometimes', value: 10 },
      ],
    },
    {
      question: 'How satisfied are you with the school environment?',
      chartData: [
        { name: '1', value: 120 },
        { name: '2', value: 50 },
        { name: '3', value: 80 },
        { name: '4', value: 50 },
        { name: '5', value: 10 },
      ],
    },
  ]

  return (
    <div className="p-6">
      <h1 className="font-heading text-4xl font-bold text-heading mb-4">
        Survey Analytics
      </h1>
      <p className="font-body text-lg text-body mb-4">
        View data visualizations and insights from survey responses.
      </p>

      {/* Chart type selector */}
      <ChartTypeSelector value={chartType} onChange={setChartType} />

      {/* Generate report button */}
      <GenerateReport />

      {/* Response charts grid */}
      <div className="h-[500px] overflow-y-auto mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-background p-4">
          {charts.map((chart, idx) => {
            const ChartComponent =
              chartType === 'bar' ? SimpleBarChart : SimplePieChart

            return (
              <ResponseChart
                key={idx}
                question={chart.question}
                ChartComponent={ChartComponent}
                chartData={chart.chartData} // pass the data here
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
