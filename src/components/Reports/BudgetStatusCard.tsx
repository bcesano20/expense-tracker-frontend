import type { ReactNode } from 'react'

import type { BudgetStatusReportInterface } from '../../types'
import { EmptyState } from '../index'

interface BudgetStatusCardProps {
  budgetStatus: BudgetStatusReportInterface | null
  loading: boolean
  monthName: string
  year: number
  selector: ReactNode
  selectedCategoryId: number | undefined
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  UNDER_BUDGET: { label: 'Dentro del presupuesto', bg: 'bg-green-100', text: 'text-green-700' },
  OVER_BUDGET: { label: 'Presupuesto superado', bg: 'bg-red-100', text: 'text-red-700' },
  WITHIN_RANGE: { label: 'Dentro del rango', bg: 'bg-blue-100', text: 'text-blue-700' },
}

export const BudgetStatusCard = ({
  budgetStatus,
  loading,
  monthName,
  year,
  selector,
  selectedCategoryId,
}: BudgetStatusCardProps) => {
  const hasBudget =
    !loading && budgetStatus && budgetStatus.status !== 'NO_BUDGET' && budgetStatus.budget

  const cfg = hasBudget ? (STATUS_CONFIG[budgetStatus!.status] ?? STATUS_CONFIG.UNDER_BUDGET) : null

  const usagePct = hasBudget ? Math.min(budgetStatus!.budget.usagePercentage ?? 0, 100) : 0

  const barColor =
    budgetStatus?.status === 'OVER_BUDGET'
      ? 'bg-red-500'
      : budgetStatus?.status === 'WITHIN_RANGE'
        ? 'bg-blue-500'
        : 'bg-green-500'

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow mt-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado del Presupuesto</h3>

      {selector}

      {loading && <p className="text-sm text-gray-500 mt-4">Cargando estado del presupuesto...</p>}

      {!loading && selectedCategoryId && (!budgetStatus || budgetStatus.status === 'NO_BUDGET') && (
        <EmptyState
          icon="📋"
          title="Sin presupuesto"
          description={`Esta categoría no tiene presupuesto definido para ${monthName} ${year}.`}
        />
      )}

      {hasBudget && (
        <div className="mt-4 border border-gray-200 rounded-lg p-3 sm:p-4 space-y-4">
          {/* Header */}
          <div className="flex flex-wrap gap-2 justify-between items-center">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: budgetStatus!.category.color }}
              />
              <span className="font-semibold text-gray-900 truncate">
                {budgetStatus!.category.name}
              </span>
            </div>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${cfg!.bg} ${cfg!.text}`}
            >
              {cfg!.label}
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Gastado</p>
              <p className="text-xl font-bold text-gray-900">
                ${(budgetStatus!.totalSpent ?? 0).toFixed(2)}
              </p>
              <p className="text-xs text-gray-400">{budgetStatus!.expenseCount ?? 0} gastos</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Presupuesto</p>
              {budgetStatus!.budget.type === 'fixed' ? (
                <p className="text-xl font-bold text-gray-900">
                  ${(budgetStatus!.budget.budgetAmount ?? 0).toFixed(2)}
                </p>
              ) : (
                <p className="text-xl font-bold text-gray-900">
                  ${(budgetStatus!.budget.minAmount ?? 0).toFixed(2)} – $
                  {(budgetStatus!.budget.maxAmount ?? 0).toFixed(2)}
                </p>
              )}
              <p className="text-xs text-gray-400">
                {budgetStatus!.budget.type === 'fixed' ? 'Monto fijo' : 'Rango'}
              </p>
            </div>
            <div>
              {budgetStatus!.budget.type === 'fixed' ? (
                <>
                  <p className="text-xs text-gray-500 mb-1">Restante</p>
                  <p
                    className={`text-xl font-bold ${(budgetStatus!.budget.remaining ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}
                  >
                    ${(budgetStatus!.budget.remaining ?? 0).toFixed(2)}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xs text-gray-500 mb-1">Hasta máximo</p>
                  <p
                    className={`text-xl font-bold ${(budgetStatus!.budget.maxAmount ?? 0) - budgetStatus!.totalSpent >= 0 ? 'text-green-600' : 'text-red-600'}`}
                  >
                    ${((budgetStatus!.budget.maxAmount ?? 0) - budgetStatus!.totalSpent).toFixed(2)}
                  </p>
                </>
              )}
              <p className="text-xs text-gray-400">
                {(budgetStatus!.budget.usagePercentage ?? 0).toFixed(1)}% usado
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${barColor}`}
              style={{ width: `${usagePct}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
