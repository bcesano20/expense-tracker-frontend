import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

import { MONTHS } from '../helpers/constants'
import type { CategoryFilter, PaymentMethodFilterInterface } from '../types'

const CATEGORY_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
]

interface PieChartProps {
  data: Array<CategoryFilter>
  title?: string
}

export const CategoryPieChart = ({ data, title = 'Gastos por Categoría' }: PieChartProps) => {
  const chartData = data.map((item, index) => ({
    name: item.category,
    value: item.total,
    fill: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
  }))

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(1)}%`}
            outerRadius={100}
            dataKey="value"
          />
          <Tooltip
            formatter={value => `$${Number(value).toFixed(2)}`}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

interface BarChartProps {
  data: Array<PaymentMethodFilterInterface>
  title?: string
}

export const PaymentMethodBarChart = ({
  data,
  title = 'Gastos por Medio de Pago',
}: BarChartProps) => {
  const METHOD_LABELS: Record<string, string> = {
    cash: 'Efectivo',
    transfer: 'Transferencia',
    other: 'Otro',
  }

  const grouped = data.reduce<Record<string, { total: number; count: number }>>((acc, item) => {
    const label = item.method.startsWith('card')
      ? 'Tarjeta'
      : (METHOD_LABELS[item.method] ?? 'Otro')
    if (!acc[label]) acc[label] = { total: 0, count: 0 }
    acc[label].total += item.total
    acc[label].count += item.count
    return acc
  }, {})

  const chartData = Object.entries(grouped).map(([name, values]) => ({
    name,
    total: values.total,
    count: values.count,
  }))

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            formatter={value => `$${Number(value).toFixed(2)}`}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <Legend />
          <Bar dataKey="total" fill="#3B82F6" name="Monto Total" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

interface ComparativeProps {
  currentMonth: number
  currentYear: number
  currentTotal: number
  previousMonth: number
  previousYear: number
  previousTotal: number
  difference: number
  percentageChange: number
  trend: 'INCREASE' | 'DECREASE' | 'SAME'
}

export const ComparativeChart = ({
  currentMonth,
  currentYear,
  currentTotal,
  previousMonth,
  previousYear,
  previousTotal,
  difference,
  percentageChange,
  trend,
}: ComparativeProps) => {
  const chartData = [
    {
      name: `${MONTHS[previousMonth - 1]} ${previousYear}`,
      total: previousTotal,
    },
    {
      name: `${MONTHS[currentMonth - 1]} ${currentYear}`,
      total: currentTotal,
    },
  ]

  const trendColor =
    trend === 'INCREASE'
      ? 'text-red-600'
      : trend === 'DECREASE'
        ? 'text-green-600'
        : 'text-gray-600'

  const trendIcon = trend === 'INCREASE' ? '📈' : trend === 'DECREASE' ? '📉' : '➡️'

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparativa Mes a Mes</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            formatter={value => `$${Number(value).toFixed(2)}`}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <Legend />
          <Bar dataKey="total" fill="#10B981" name="Gasto Total" />
        </BarChart>
      </ResponsiveContainer>

      <div
        className={`mt-4 p-4 rounded-lg bg-gray-50 border-l-4 ${
          trend === 'INCREASE'
            ? 'border-red-500'
            : trend === 'DECREASE'
              ? 'border-green-500'
              : 'border-gray-500'
        }`}
      >
        <p className="text-sm text-gray-600 mb-2">Variación</p>
        <p className={`text-2xl font-bold ${trendColor}`}>
          {trendIcon} ${Math.abs(difference ?? 0).toFixed(2)} ({(percentageChange ?? 0).toFixed(1)}
          %)
        </p>
        <p className="text-xs text-gray-500 mt-2">
          {trend === 'INCREASE'
            ? '⚠️ Aumentó tu gasto este mes'
            : trend === 'DECREASE'
              ? '✅ Disminuyó tu gasto este mes'
              : '➡️ Se mantuvo igual'}
        </p>
      </div>
    </div>
  )
}
