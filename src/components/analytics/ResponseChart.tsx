import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { WordCloud } from '@/components/analytics/WordCloud'

type ResponseRecord = {
  answerValue: string
  questionType: string | null
  questionId: string
}

type ChartEntry = {
  questionId: string
  question: string
  questionType: string | null
  surveyTitle: string
  chartData: { name: string; value: number }[]
}

export interface ResponseChartProps {
  chart: ChartEntry
  filteredResponses: ResponseRecord[]
  ChartComponent: React.FC<{ data: { name: string; value: number }[] }>
}

export const ResponseChart = ({
  chart,
  filteredResponses,
  ChartComponent,
}: ResponseChartProps) => {
  const isOpenEnded = chart.questionType === 'open-ended' // direct, no filtering

  // only filter (the more expensive op) when we actually need raw text for the cloud
  const questionResponses = isOpenEnded
    ? filteredResponses.filter((r) => r.questionId === chart.questionId)
    : []

  return (
    <Card className="border-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{`${chart.surveyTitle} • ${chart.question}`}</CardTitle>
      </CardHeader>
      <CardContent>
        {isOpenEnded ? (
          <WordCloud responses={questionResponses} width={500} height={250} />
        ) : (
          <ChartComponent data={chart.chartData} />
        )}
      </CardContent>
    </Card>
  )
}

export default ResponseChart