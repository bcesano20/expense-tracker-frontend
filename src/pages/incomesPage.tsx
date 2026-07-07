import { useEffect, useState } from 'react'

import { MONTHS, ROUTES } from '../helpers/constants'
import type { IncomeInterface, IncomeFormInterface } from '../types'
import { useAuth } from '../hooks/useAuth'
import { useAccounts } from '../hooks/useAccounts'
import { useIncomes } from '../hooks/useIncomes'
import {
  Button,
  EmptyState,
  IncomeModal,
  IncomeTable,
  MonthSelector,
  Navbar,
  Pagination,
} from '../components'

export const IncomePage = () => {
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1)
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [selectedIncome, setSelectedIncome] = useState<IncomeInterface | null>(null)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)

  const { state } = useAuth()
  const { accounts, loading: accountsLoading, error: accountsError, fetchAccounts } = useAccounts()

  useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  const activeAccount = accounts.find(a => a.id === state.activeAccountId) ?? accounts[0] ?? null

  const {
    incomes,
    loading,
    error,
    pagination,
    fetchIncomes,
    createIncome,
    updateIncome,
    deleteIncome,
  } = useIncomes(activeAccount?.id ?? 0)

  useEffect(() => {
    if (!activeAccount) return
    fetchIncomes({
      accountId: activeAccount.id,
      month,
      year,
      pagination: { page, limit: 10 },
    })
  }, [month, year, page, activeAccount, fetchIncomes])

  const monthName = MONTHS[month - 1]

  const handleEdit = (income: IncomeInterface) => {
    setSelectedIncome(income)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    await deleteIncome(id)
  }

  const handleCreateNew = () => {
    setSelectedIncome(null)
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
              description="Creá una cuenta para empezar a registrar tus ingresos."
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
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Mis Ingresos</h2>
              <p className="text-gray-600">
                Cuenta: <span className="font-semibold">{activeAccount.name}</span>
              </p>
            </div>
            <Button onClick={handleCreateNew} className="shrink-0 whitespace-nowrap">
              {' '}
              + Ingreso
            </Button>
          </div>
        </div>

        {/* Month Selector */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <MonthSelector
            month={month}
            year={year}
            onMonthChange={m => {
              setMonth(m)
              setPage(1)
            }}
            onYearChange={y => {
              setYear(y)
              setPage(1)
            }}
          />
        </div>

        {/* Incomes table */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalle de Ingresos</h3>
          <IncomeTable
            incomes={incomes}
            loading={loading}
            error={error}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          {!loading && incomes.length === 0 && !error && (
            <EmptyState
              icon="📭"
              title={`Sin ingresos en ${monthName} ${year}`}
              description="No hay ingresos registrados para este período."
              action={{ label: 'Registrar ingreso', onClick: handleCreateNew }}
            />
          )}
        </div>

        {/* Pagination */}
        {incomes.length > 0 && (
          <Pagination
            page={page}
            totalPages={pagination.totalPages}
            hasNextPage={pagination.hasNextPage}
            hasPreviousPage={pagination.hasPreviousPage}
            onPageChange={setPage}
            loading={loading}
          />
        )}
        {incomes.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-500">
            Mostrando {incomes.length} de {pagination.total} ingresos
          </div>
        )}

        {showForm && (
          <IncomeModal
            key={selectedIncome?.id ?? 'new'}
            isOpen={showForm}
            income={selectedIncome}
            onClose={() => {
              setShowForm(false)
              setSelectedIncome(null)
            }}
            onSubmit={async (data: IncomeFormInterface) => {
              if (selectedIncome) {
                await updateIncome(selectedIncome.id, data)
              } else {
                await createIncome({ ...data, accountId: activeAccount.id })
              }
              await fetchIncomes({
                accountId: activeAccount.id,
                month,
                year,
                pagination: { page, limit: 10 },
              })
            }}
            loading={loading}
          />
        )}
      </div>
    </div>
  )
}

export default IncomePage
