import {
  PieChart,
  Pie,
  Cell,
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
import { formatCurrency } from '../helpers/utils'
import type { CategoryFilter, PaymentMethodFilterInterface } from '../types'


interface PieChartProps {
  data: Array<CategoryFilter>
  title?: string
  currency?: string
}

export const CategoryPieChart = ({ data, title = 'Gastos por Categoría', currency }: PieChartProps) => {
  const chartData = data.map(item => ({
    name: item.category,
    value: item.total,
    fill: item.color,
  }))

  const total = chartData.reduce((sum, entry) => sum + entry.value, 0)

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" outerRadius={100} dataKey="value">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            formatter={value => formatCurrency(Number(value), currency)}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <ul className="mt-4 space-y-2">
        {chartData.map((entry, index) => (
          <li key={index} className="flex items-center justify-between text-sm gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: entry.fill }}
              />
              <span className="text-gray-700 truncate">{entry.name}</span>
            </div>
            <span className="font-medium text-gray-900 shrink-0">
              {total > 0 ? ((entry.value / total) * 100).toFixed(1) : '0.0'}%
              <span className="text-gray-400 font-normal ml-1">{formatCurrency(entry.value, currency)}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

interface BarChartProps {
  data: Array<PaymentMethodFilterInterface>
  title?: string
  currency?: string
}

export const PaymentMethodBarChart = ({
  data,
  title = 'Gastos por Medio de Pago',
  currency,
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
            formatter={value => formatCurrency(Number(value), currency)}
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
  currency?: string
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
  currency,
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
            formatter={value => formatCurrency(Number(value), currency)}
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
          {trendIcon} {formatCurrency(Math.abs(difference ?? 0), currency)} ({(percentageChange ?? 0).toFixed(1)}%)
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
