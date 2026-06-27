import type { ExpenseInterface, ColumnInterface } from '../../types'
import {
  formatCurrency,
  formatDate,
  getCategoryColor,
  getPaymentMethodIcon,
} from '../../helpers/utils'
import { Table } from './Table'

interface ExpensesTableProps {
  expenses: ExpenseInterface[]
  loading?: boolean
  error?: string | null
  onEdit?: (expense: ExpenseInterface) => void
  onDelete?: (id: number) => void
}

export const ExpensesTable = ({
  expenses,
  loading = false,
  error = null,
  onEdit,
  onDelete,
}: ExpensesTableProps) => {
  // Table Columns
  const columns: ColumnInterface<ExpenseInterface>[] = [
    {
      key: 'date',
      label: 'Fecha',
      width: '150px',
      render: value => formatDate(value as string),
    },
    {
      key: 'description',
      label: 'Descripción',
      width: '200px',
    },
    {
      key: 'amount',
      label: 'Monto',
      width: '120px',
      render: value => (
        <span className="font-semibold text-gray-900">{formatCurrency(value as number)}</span>
      ),
    },
    {
      key: 'category',
      label: 'Categoría',
      width: '140px',
      render: value => {
        const name =
          typeof value === 'object' && value !== null
            ? (value as { name: string }).name
            : (value as string)
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(name)}`}>
            {name}
          </span>
        )
      },
    },
    {
      key: 'paymentMethod',
      label: 'Medio de Pago',
      width: '140px',
      render: (value, row) => {
        const method = value as string
        const isCard = method.startsWith('card')
        const cardType = row.card?.card?.type
        const LABELS: Record<string, string> = {
          cash: 'Efectivo',
          transfer: 'Transferencia',
          other: 'Otro',
        }
        let label: string
        if (isCard) {
          label = cardType === 'credit' ? 'Crédito' : cardType === 'debit' ? 'Débito' : 'Tarjeta'
        } else {
          label = LABELS[method] ?? method
        }
        return (
          <div className="flex items-center gap-2">
            <span>{getPaymentMethodIcon(isCard ? 'card' : method)}</span>
            <span>{label}</span>
          </div>
        )
      },
    },
    {
      key: 'installments',
      label: 'Observaciones',
      width: '160px',
      render: (_, row) => {
        const installments = row.installments
        if (!installments || installments.length === 0 || installments[0].totalInstallments <= 1) {
          return <span className="text-gray-400">—</span>
        }
        const { installmentNumber, totalInstallments, installmentAmount } = installments[0]
        return (
          <span className="text-sm text-gray-700">
            Cuota {installmentNumber}/{totalInstallments} · ${installmentAmount.toFixed(2)}
          </span>
        )
      },
    },
  ]

  // Actions for the Table
  const actions = (expense: ExpenseInterface) => (
    <>
      {onEdit && (
        <button
          onClick={() => onEdit(expense)}
          className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-sm font-medium"
          title="Editar"
        >
          ✏️
        </button>
      )}
      {onDelete && (
        <button
          onClick={() => {
            if (window.confirm('¿Estás seguro de que quieres eliminar este gasto?')) {
              onDelete(expense.id)
            }
          }}
          className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-sm font-medium"
          title="Eliminar"
        >
          🗑️
        </button>
      )}
    </>
  )

  return (
    <Table<ExpenseInterface>
      columns={columns}
      data={expenses}
      loading={loading}
      error={error}
      keyField="id"
      actions={actions}
      emptyMessage="No hay gastos para mostrar. ¡Crea uno nuevo!"
    />
  )
}
