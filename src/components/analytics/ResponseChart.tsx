import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface ResponseChartProps {
  question: string
  data: string
}

export const ResponseChart: React.FC<ResponseChartProps> = ({
  question,
  data,
}) => {
  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle>{question}</CardTitle>
      </CardHeader>

      <CardContent>
        <p>{data}</p>
      </CardContent>
    </Card>
  )
}

export default ResponseChart
