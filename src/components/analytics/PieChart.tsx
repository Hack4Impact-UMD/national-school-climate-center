import React, { type JSX } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import type { PieLabelRenderProps } from 'recharts'

interface PieChartProps {
  data: { name: string; value: number }[]
  isAnimationActive?: boolean
}

const COLORS = ['#269ACF', '#D97706', '#9A2B7A', '#3730A3']
const RADIAN = Math.PI / 180

// Custom label for Pie slices
const renderCustomizedLabel = (
  props: PieLabelRenderProps
): JSX.Element | null => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props

  if (
    cx == null ||
    cy == null ||
    innerRadius == null ||
    outerRadius == null ||
    midAngle == null
  )
    return null

  const cxNum = Number(cx)
  const cyNum = Number(cy)
  const innerR = Number(innerRadius)
  const outerR = Number(outerRadius)
  const angle = Number(midAngle)

  const radius = innerR + (outerR - innerR) * 0.5
  const x = cxNum + radius * Math.cos(-angle * RADIAN)
  const y = cyNum + radius * Math.sin(-angle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cxNum ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${((Number(percent) || 0) * 100).toFixed(0)}%`}
    </text>
  )
}

// ✅ Functional component accepting `data` as prop
const SimplePieChart: React.FC<PieChartProps> = ({
  data,
  isAnimationActive = true,
}) => {
  return (
    <div style={{ width: '100%', maxWidth: 400, height: '50vh' }}>
      <ResponsiveContainer>
        <PieChart>
          <Tooltip />
          <Legend />
          <Pie
            data={data}
            dataKey="value"
            labelLine={false}
            label={renderCustomizedLabel}
            isAnimationActive={isAnimationActive}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${entry.name}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SimplePieChart
