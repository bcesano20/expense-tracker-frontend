import { MONTHS } from '../helpers/constants'

const YEARS_SAMPLE = [2024, 2025, 2026, 2027]

interface MonthSelectorProps {
  month: number
  year: number
  onMonthChange: (month: number) => void
  onYearChange: (year: number) => void
}

export const MonthSelector = ({ month, year, onMonthChange, onYearChange }: MonthSelectorProps) => {
  return (
    <div className="flex gap-4 items-center">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mes</label>
        <select
          value={month}
          onChange={e => onMonthChange(parseInt(e.target.value))}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {MONTHS.map((nombre, index) => (
            <option key={index} value={index + 1}>
              {nombre}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
        <select
          value={year}
          onChange={e => onYearChange(parseInt(e.target.value))}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {YEARS_SAMPLE.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
