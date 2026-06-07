import { useEffect, useState } from 'react'

import { MONTHS, ROUTES } from '../helpers/constants'
import type { ExpenseInterface } from '../types'
import { useAccounts } from '../hooks/useAccounts'
import { useExpenses } from '../hooks/useExpenses'
import { Button, EmptyState, ExpenseModal, MonthSelector, Navbar } from '../components'

const CATEGORIES = ['Comida', 'Entretenimiento', 'Transporte', 'Salud', 'Electrónica', 'Otro']

export const ExpensesPage = () => {
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1)
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [category, setCategory] = useState<string>('')
  const [search, setSearch] = useState<string>('')
  const [selectedExpense, setSelectedExpense] = useState<ExpenseInterface | null>(null)
  const [showForm, setShowForm] = useState<boolean>(false)

  const { activeAccount, loading: accountsLoading, error: accountsError } = useAccounts()
  const { expenses, loading, error, fetchExpenses, deleteExpense, createExpense, updateExpense } =
    useExpenses(activeAccount?.id ?? 0)

  useEffect(() => {
    if (!activeAccount) return
    fetchExpenses({ accountId: activeAccount.id, month, year, category: category || undefined })
  }, [month, year, category, activeAccount, fetchExpenses])

  const monthName = MONTHS[month - 1]

  const filteredExpenses = expenses.filter(expense =>
    expense.description.toLowerCase().includes(search.toLowerCase())
  )

  const handleEdit = (expense: ExpenseInterface) => {
    setSelectedExpense(expense)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    await deleteExpense(id)
  }

  const handleCreateNew = () => {
    setSelectedExpense(null)
    setShowForm(true)
  }

  if (accountsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-blue-100 text-blue-700 p-4 rounded-lg">Cargando cuenta...</div>
        </div>
      </div>
    )
  }

  if (accountsError || !activeAccount) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto p-6">
          <div className="card">
            <EmptyState
              icon="🏦"
              title="No tenés ninguna cuenta"
              description="Creá una cuenta para empezar a registrar tus gastos."
              action={{
                label: 'Crear cuenta',
                onClick: () => window.location.assign(ROUTES.ACCOUNTS),
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Mis Gastos</h2>
              <p className="text-gray-600">
                Cuenta: <span className="font-semibold">{activeAccount.name}</span>
              </p>
            </div>
            <Button onClick={handleCreateNew}>➕ Crear Gasto</Button>
          </div>
        </div>

        {/* Month Selector */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <MonthSelector
            month={month}
            year={year}
            onMonthChange={setMonth}
            onYearChange={setYear}
          />
        </div>

        {/* Filters */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por Categoría
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="input"
              >
                <option value="">Todas las categorías</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar por Descripción
              </label>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Ej: Supermercado, Netflix..."
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600 mb-1">Total Gastos</p>
            <p className="text-2xl font-bold text-gray-900">
              ${filteredExpenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-2">{filteredExpenses.length} gastos</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600 mb-1">Promedio por Gasto</p>
            <p className="text-2xl font-bold text-gray-900">
              $
              {filteredExpenses.length > 0
                ? (
                    filteredExpenses.reduce((sum, e) => sum + e.amount, 0) / filteredExpenses.length
                  ).toFixed(2)
                : '0.00'}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {monthName} {year}
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600 mb-1">Mayor Gasto</p>
            <p className="text-2xl font-bold text-gray-900">
              $
              {filteredExpenses.length > 0
                ? Math.max(...filteredExpenses.map(e => e.amount)).toFixed(2)
                : '0.00'}
            </p>
            <p className="text-xs text-gray-500 mt-2">En este período</p>
          </div>
        </div>

        {/* Expenses table */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalle de Gastos</h3>

          {loading && (
            <div className="bg-blue-100 text-blue-700 p-4 rounded-lg">Cargando gastos...</div>
          )}

          {error && !loading && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
          )}

          {!loading && !error && filteredExpenses.length === 0 && (
            <EmptyState
              icon="📭"
              title={`Sin gastos en ${monthName} ${year}`}
              description="No hay gastos registrados para este período."
              action={{ label: 'Agregar gasto', onClick: handleCreateNew }}
            />
          )}

          {!loading && filteredExpenses.length > 0 && (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-3">Descripción</th>
                  <th className="pb-3">Categoría</th>
                  <th className="pb-3">Fecha</th>
                  <th className="pb-3 text-right">Monto</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map(expense => (
                  <tr key={expense.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 font-medium text-gray-900">{expense.description}</td>
                    <td className="py-3 text-gray-600">{expense.category}</td>
                    <td className="py-3 text-gray-600">{expense.date}</td>
                    <td className="py-3 text-right font-semibold text-gray-900">
                      ${expense.amount.toFixed(2)}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="text-blue-600 hover:text-blue-800 mr-3 text-xs"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="text-red-600 hover:text-red-800 text-xs"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {filteredExpenses.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-500">
            Mostrando {filteredExpenses.length} de {expenses.length} gastos
          </div>
        )}

        {showForm && (
          <ExpenseModal
            isOpen={showForm}
            expense={selectedExpense}
            onClose={() => {
              setShowForm(false)
              setSelectedExpense(null)
            }}
            onSubmit={async data => {
              try {
                if (selectedExpense) {
                  await updateExpense(selectedExpense.id, data)
                } else {
                  await createExpense({
                    ...data,
                    accountId: activeAccount.id,
                  })
                }
              } catch (error) {
                // eslint-disable-next-line no-console
                console.error('Error:', error)
              }
            }}
            loading={loading}
          />
        )}
      </div>
    </div>
  )
}
