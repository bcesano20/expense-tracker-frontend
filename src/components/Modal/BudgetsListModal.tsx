import { useState } from 'react'

import type { BudgetInterface } from '../../types'
import { EmptyState, DeleteModal } from '../index'
import { formatCurrency } from '../../helpers/utils'

interface BudgetsListModalProps {
  isOpen: boolean
  budgets: BudgetInterface[]
  loading: boolean
  month: number
  year: number
  onClose: () => void
  onDelete: (id: number) => void
  onEdit: (budget: BudgetInterface) => void
}

export const BudgetsListModal = ({
  isOpen,
  budgets,
  loading,
  month,
  year,
  onClose,
  onDelete,
  onEdit,
}: BudgetsListModalProps) => {
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null)

  if (!isOpen) return null

  const periodLabel = new Date(year, month - 1).toLocaleString('es', {
    month: 'long',
    year: 'numeric',
  })

  const budgetSummary = (budget: BudgetInterface) => {
    if (budget.amount != null) {
      return formatCurrency(budget.amount)
    }
    if (budget.minAmount != null && budget.maxAmount != null) {
      return `${formatCurrency(budget.minAmount)} – ${formatCurrency(budget.maxAmount)}`
    }
    return '—'
  }

  const budgetTypeLabel = (budget: BudgetInterface) => {
    if (budget.amount != null) return 'Fijo'
    return 'Rango'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full h-140 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b p-6 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Presupuestos</h2>
            <p className="text-sm text-gray-500 mt-0.5 capitalize">{periodLabel}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6">
          {loading ? (
            <p className="text-center text-gray-500 py-8">Cargando presupuestos...</p>
          ) : budgets.length === 0 ? (
            <EmptyState
              icon="📋"
              title="Sin presupuestos"
              description={`No hay presupuestos definidos para ${periodLabel}.`}
            />
          ) : (
            <ul className="divide-y divide-gray-100">
              {budgets.map(budget => (
                <li key={budget.id} className="flex items-center justify-between py-3 gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {budget.category?.name ?? `Categoría ${budget.categoryId}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="text-xs bg-gray-100 text-gray-600 rounded px-1.5 py-0.5 mr-2">
                        {budgetTypeLabel(budget)}
                      </span>
                      {budgetSummary(budget)}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => onEdit(budget)}
                      className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition"
                      title="Editar presupuesto"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => setPendingDeleteId(budget.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition"
                      title="Eliminar presupuesto"
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <DeleteModal
        isOpen={pendingDeleteId !== null}
        title="¿Eliminar presupuesto?"
        description="Esta acción no se puede deshacer."
        onConfirm={async () => {
          await onDelete(pendingDeleteId!)
        }}
        onClose={() => setPendingDeleteId(null)}
      />
    </div>
  )
}
