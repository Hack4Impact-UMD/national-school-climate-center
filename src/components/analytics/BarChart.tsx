import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

// #region Sample data
interface BarChartProps {
  data: { name: string; value: number }[]
}
// #endregion

const SimpleBarChart: React.FC<BarChartProps> = ({ data }) => {
  return (
    <BarChart
      layout="vertical"
      style={{
        width: '100%',
        maxWidth: '500px',
        maxHeight: '50vh',
        aspectRatio: 1.618,
      }}
      data={data}
      margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis type="number" />
      <YAxis dataKey="name" type="category" />
      <Tooltip />
      <Bar
        dataKey="value"
        fill="#F59E1E"
        activeBar={<Rectangle fill="#269ACF" stroke="#F59E1E" />}
      />
    </BarChart>
  )
}

export default SimpleBarChart
