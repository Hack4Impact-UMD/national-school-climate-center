import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export interface ResponseChartProps<T> {
  question: string
  ChartComponent: React.FC<{ data: T }>
  chartData: T
}

export const ResponseChart = <T,>({
  question,
  ChartComponent,
  chartData,
}: ResponseChartProps<T>) => {
  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle>{question}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartComponent data={chartData} />
      </CardContent>
    </Card>
  )
}

export default ResponseChart
