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
  const [showWordCloud, setShowWordCloud] = useState(false)

  const isOpenEnded = chart.questionType === 'text' // direct, no filtering

  // only filter (the more expensive op) when we actually need raw text for the cloud
  const questionResponses = isOpenEnded
    ? filteredResponses.filter((r) => r.questionId === chart.questionId)
    : []

  // --- debug logging ---
  console.log('[ResponseChart]', {
    questionId: chart.questionId,
    question: chart.question,
    questionTypeRaw: chart.questionType,
    questionTypeTypeof: typeof chart.questionType,
    isOpenEnded,
  })

  if (chart.questionType !== 'text' && chart.questionType !== null) {
    // catches whitespace/casing mismatches, e.g. 'Text' or ' text'
    console.log(
      '[ResponseChart] questionType did not match "text" exactly:',
      JSON.stringify(chart.questionType)
    )
  }

  if (isOpenEnded) {
    console.log(
      '[ResponseChart] matched questionResponses count:',
      questionResponses.length,
      questionResponses.slice(0, 3)
    )
  }

  // sanity check: are there responses for this question with a DIFFERENT
  // questionType than what the chart entry claims? (would indicate the
  // grouping in Analytics.tsx picked up questionType from the wrong response)
  const distinctTypesForQuestion = Array.from(
    new Set(
      filteredResponses
        .filter((r) => r.questionId === chart.questionId)
        .map((r) => r.questionType)
    )
  )
  if (distinctTypesForQuestion.length > 1) {
    console.warn(
      '[ResponseChart] inconsistent questionType across responses for',
      chart.questionId,
      distinctTypesForQuestion
    )
  }
  // --- end debug logging ---

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