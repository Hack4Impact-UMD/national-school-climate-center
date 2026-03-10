import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { WordCloud } from '@/components/analytics/WordCloud'

type ResponseRecord = {
  answerValue: string
  questionType: string | null
  questionId: string
}

type ChartEntry = {
  questionId: string
  question: string
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
  const [showWordCloud, setShowWordCloud] = useState(false)

  const questionResponses = filteredResponses.filter(
    (r) => r.questionId === chart.questionId
  )

  const isOpenEnded = questionResponses[0]?.questionType === 'text'

  console.log(isOpenEnded)
  console.log(questionResponses);

  return (
    <Card className="border-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{`${chart.surveyTitle} • ${chart.question}`}</CardTitle>
        {isOpenEnded && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowWordCloud((prev) => !prev)}
          >
            {showWordCloud ? 'Show Chart' : 'Show Word Cloud'}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isOpenEnded && showWordCloud ? (
          <WordCloud responses={questionResponses} width={500} height={250} />
        ) : (
          <ChartComponent data={chart.chartData} />
        )}
      </CardContent>
    </Card>
  )
}

export default ResponseChart
