import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import type { ChartType } from './types'

export interface ResponseChartProps {
  question: string
  data: string
  chartType?: ChartType
}

export const ResponseChart: React.FC<ResponseChartProps> = ({
  question,
  data,
  chartType = 'bar',
}) => {
  // For now, just show the type; you can swap actual chart components later.
  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle>{question}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-2 text-sm text-muted-foreground">
          Chart type: <span className="font-mono">{chartType}</span>
        </p>
        <p>{data}</p>
      </CardContent>
    </Card>
  )
}

export default ResponseChart
