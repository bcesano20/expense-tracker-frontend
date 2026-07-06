import type { IncomeRatioReportInterface } from '../../types'
import { EmptyState } from '../index'

interface IncomeRatioCardProps {
  incomeRatio: IncomeRatioReportInterface | null
  loading: boolean
  monthName: string
  year: number
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  SURPLUS: { label: 'Superávit', bg: 'bg-green-100', text: 'text-green-700' },
  DEFICIT: { label: 'Déficit', bg: 'bg-red-100', text: 'text-red-700' },
  BALANCED: { label: 'Equilibrado', bg: 'bg-blue-100', text: 'text-blue-700' },
}

export const IncomeRatioCard = ({
  incomeRatio,
  loading,
  monthName,
  year,
}: IncomeRatioCardProps) => {
  const hasData = !loading && incomeRatio && (incomeRatio.incomeCount ?? 0) > 0

  const cfg = hasData ? (STATUS_CONFIG[incomeRatio!.status] ?? STATUS_CONFIG.BALANCED) : null

  const expensePct = hasData ? Math.min(incomeRatio!.expensePercentage ?? 0, 100) : 0
  const incomePct = 100 - expensePct

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow mt-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Balance Ingresos / Gastos</h3>

      {loading && <p className="text-sm text-gray-500">Cargando balance...</p>}

      {!loading && (!incomeRatio || (incomeRatio.incomeCount ?? 0) === 0) && (
        <EmptyState
          icon="💰"
          title="Sin ingresos registrados"
          description={`No hay ingresos cargados para ${monthName} ${year}.`}
        />
      )}

      {hasData && (
        <div className="border border-gray-200 rounded-lg p-3 sm:p-4 space-y-4">
          {/* Header */}
          <div className="flex flex-wrap gap-2 justify-between items-center">
            <p className="text-sm text-gray-600">
              {monthName} {year}
            </p>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${cfg!.bg} ${cfg!.text}`}
            >
              {cfg!.label}
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Ingresos</p>
              <p className="text-xl font-bold text-green-600">
                ${(incomeRatio!.totalIncome ?? 0).toFixed(2)}
              </p>
              <p className="text-xs text-gray-400">{incomeRatio!.incomeCount ?? 0} ingresos</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Gastos</p>
              <p className="text-xl font-bold text-red-600">
                ${(incomeRatio!.totalExpenses ?? 0).toFixed(2)}
              </p>
              <p className="text-xs text-gray-400">{incomeRatio!.expenseCount ?? 0} gastos</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Balance</p>
              <p
                className={`text-xl font-bold ${(incomeRatio!.balance ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                ${(incomeRatio!.balance ?? 0).toFixed(2)}
              </p>
              <p className="text-xs text-gray-400">
                {(incomeRatio!.expensePercentage ?? 0).toFixed(1)}% en gastos
              </p>
            </div>
          </div>

          {/* Stacked bar */}
          <div>
            <div className="flex h-2 rounded-full overflow-hidden bg-gray-100">
              <div
                className="bg-green-500 h-full transition-all"
                style={{ width: `${incomePct}%` }}
              />
              <div
                className="bg-red-400 h-full transition-all"
                style={{ width: `${expensePct}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-green-600">● Ingresos</span>
              <span className="text-xs text-red-500">● Gastos</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
