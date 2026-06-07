import { type ReactNode } from 'react'

import type { ColumnInterface } from '../../types'

interface TableProps<T> {
  columns: ColumnInterface<T>[]
  data: T[]
  loading?: boolean
  error?: string | null
  keyField?: keyof T
  actions?: (row: T) => ReactNode
  emptyMessage?: string
}

export const Table = <T extends { id?: number }>({
  columns,
  data,
  loading = false,
  error = null,
  keyField = 'id' as keyof T,
  actions,
  emptyMessage = 'No hay datos para mostrar',
}: TableProps<T>) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="text-gray-500">Cargando...</div>
      </div>
    )
  }

  if (error) {
    return <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="text-gray-500">{emptyMessage}</div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100 border-b">
            {columns.map(column => (
              <th
                key={String(column.key)}
                className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
                style={{ width: column.width }}
              >
                {column.label}
              </th>
            ))}
            {actions && (
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Acciones</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={String(row[keyField]) || index}
              className="border-b hover:bg-gray-50 transition"
            >
              {columns.map(column => (
                <td key={String(column.key)} className="px-6 py-4 text-sm text-gray-700">
                  {column.render ? column.render(row[column.key], row) : String(row[column.key])}
                </td>
              ))}
              {actions && (
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2">{actions(row)}</div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
