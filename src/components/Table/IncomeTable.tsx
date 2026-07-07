import { useState } from 'react'

import type { IncomeInterface, ColumnInterface } from '../../types'
import { formatCurrency, formatDate } from '../../helpers/utils'
import { Table } from './Table'
import { DeleteModal } from '../index'

interface IncomeTableProps {
  incomes: IncomeInterface[]
  loading?: boolean
  error?: string | null
  onEdit?: (income: IncomeInterface) => void
  onDelete?: (id: number) => void
}

export const IncomeTable = ({
  incomes,
  loading = false,
  error = null,
  onEdit,
  onDelete,
}: IncomeTableProps) => {
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null)
  const columns: ColumnInterface<IncomeInterface>[] = [
    {
      key: 'date',
      label: 'Fecha',
      width: '150px',
      render: value => formatDate(value as string),
    },
    {
      key: 'description',
      label: 'Descripción',
    },
    {
      key: 'amount',
      label: 'Monto',
      width: '120px',
      render: value => (
        <span className="font-semibold text-green-700">{formatCurrency(value as number)}</span>
      ),
    },
    {
      key: 'source',
      label: 'Fuente',
      width: '160px',
      render: value => <span className="text-sm text-gray-700">{value as string}</span>,
    },
  ]

  const actions = (income: IncomeInterface) => (
    <>
      {onEdit && (
        <button
          onClick={() => onEdit(income)}
          className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-sm font-medium"
          title="Editar"
        >
          ✏️
        </button>
      )}
      {onDelete && (
        <button
          onClick={() => setPendingDeleteId(income.id)}
          className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-sm font-medium"
          title="Eliminar"
        >
          🗑️
        </button>
      )}
    </>
  )

  return (
    <>
      <Table<IncomeInterface>
        columns={columns}
        data={incomes}
        loading={loading}
        error={error}
        keyField="id"
        actions={actions}
        emptyMessage="No hay ingresos para mostrar. ¡Registra uno nuevo!"
      />
      <DeleteModal
        isOpen={pendingDeleteId !== null}
        title="¿Eliminar ingreso?"
        description="Esta acción no se puede deshacer."
        onConfirm={async () => {
          await onDelete!(pendingDeleteId!)
        }}
        onClose={() => setPendingDeleteId(null)}
      />
    </>
  )
}
