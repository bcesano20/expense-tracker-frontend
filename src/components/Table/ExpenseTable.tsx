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
      width: '100px',
      render: value => formatDate(value),
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
      render: value => <span className="font-semibold text-gray-900">{formatCurrency(value)}</span>,
    },
    {
      key: 'category',
      label: 'Categoría',
      width: '140px',
      render: value => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(value)}`}>
          {value}
        </span>
      ),
    },
    {
      key: 'paymentMethod',
      label: 'Medio de Pago',
      width: '140px',
      render: value => (
        <div className="flex items-center gap-2">
          <span>{getPaymentMethodIcon(value)}</span>
          <span className="capitalize">{value === 'card' ? 'Tarjeta' : value}</span>
        </div>
      ),
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
          ✏️ Editar
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
          🗑️ Eliminar
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
