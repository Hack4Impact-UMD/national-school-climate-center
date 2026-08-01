import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface LineSeries {
  key: string
  color: string
}

interface CompareLineChartProps {
  title: string
  data: Record<string, string | number>[]
  lines: LineSeries[]
}

const CompareLineChart: React.FC<CompareLineChartProps> = ({
  title,
  data,
  lines,
}) => {
  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <LineChart
          style={{
            width: '100%',
            maxWidth: '500px',
            maxHeight: '50vh',
            aspectRatio: 1.618,
          }}
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {lines.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              stroke={line.color}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </CardContent>
    </Card>
  )
}

export default CompareLineChart
