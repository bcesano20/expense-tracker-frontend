import { useEffect, useState } from 'react'

import { MONTHS, ROUTES } from '../helpers/constants'
import { formatCurrency } from '../helpers/utils'
import type { BudgetInterface, CategoryInterface, ExpenseInterface } from '../types'
import { useAuth } from '../hooks/useAuth'
import { useAccounts } from '../hooks/useAccounts'
import { useCards } from '../hooks/useCards'
import { useExpenses } from '../hooks/useExpenses'
import { useCategories } from '../hooks/useCategories'
import { useBudgets } from '../hooks/useBudgets'
import { useMonthlyReport } from '../hooks/useMonthlyReports'
import {
  Button,
  BudgetModal,
  BudgetsListModal,
  CategoryModal,
  EmptyState,
  ExpenseModal,
  ExpensesTable,
  MonthSelector,
  Navbar,
  Pagination,
  Select,
} from '../components'

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: 'Efectivo',
  'card-credit': 'Crédito',
  'card-debit': 'Débito',
  transfer: 'Transferencia',
  other: 'Otro',
}

export const ExpensesPage = () => {
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1)
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined)
  const [paymentMethod, setPaymentMethod] = useState<string>('')
  const [selectedExpense, setSelectedExpense] = useState<ExpenseInterface | null>(null)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false)
  const [selectedCategory, setSelectedCategory] = useState<CategoryInterface | null>(null)
  const [showBudgetModal, setShowBudgetModal] = useState<boolean>(false)
  const [selectedBudget, setSelectedBudget] = useState<BudgetInterface | null>(null)
  const [showBudgetsListModal, setShowBudgetsListModal] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)

  const { state } = useAuth()
  const { accounts, loading: accountsLoading, error: accountsError, fetchAccounts } = useAccounts()
  const {
    categories,
    loading: categoriesLoading,
    fetchCategories,
    createCategory,
    updateCategory,
  } = useCategories()

  useEffect(() => {
    fetchAccounts()
    fetchCategories()
  }, [fetchAccounts, fetchCategories])

  const activeAccount = accounts.find(a => a.id === state.activeAccountId) ?? accounts[0] ?? null

  const {
    expenses,
    loading,
    error,
    pagination,
    fetchExpenses,
    deleteExpense,
    createExpense,
    updateExpense,
  } = useExpenses(activeAccount?.id ?? 0)

  const { cards, fetchCards } = useCards(activeAccount?.id ?? 0)

  const { report: monthlyReport, fetchMonthlyReport } = useMonthlyReport(activeAccount?.id ?? 0)

  const {
    budgets,
    loading: budgetsLoading,
    fetchBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
  } = useBudgets(activeAccount?.id ?? 0)

  useEffect(() => {
    if (!activeAccount || !showBudgetsListModal) return
    fetchBudgets({ accountId: activeAccount.id, month, year })
  }, [showBudgetsListModal, month, year, activeAccount, fetchBudgets])

  useEffect(() => {
    if (!activeAccount) return
    fetchExpenses({
      accountId: activeAccount.id,
      month,
      year,
      categoryId,
      pagination: { page, limit: 10 },
    })
    fetchMonthlyReport(month, year)
  }, [month, year, categoryId, page, activeAccount, fetchExpenses, fetchMonthlyReport])

  useEffect(() => {
    if (activeAccount?.id) fetchCards()
  }, [activeAccount, fetchCards])

  const monthName = MONTHS[month - 1]

  const filteredExpenses = expenses.filter(expense => {
    if (!paymentMethod) return true
    if (paymentMethod === 'card-credit') {
      return expense.paymentMethod.startsWith('card') && expense.card?.card?.type === 'credit'
    }
    if (paymentMethod === 'card-debit') {
      return expense.paymentMethod.startsWith('card') && expense.card?.card?.type === 'debit'
    }
    return expense.paymentMethod === paymentMethod
  })

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

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
            <Button className="shrink-0 whitespace-nowrap" onClick={handleCreateNew}>
              {' '}
              + Gasto
            </Button>
          </div>
        </div>
        {/* Month Selector */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
          <div className="flex gap-2 sm:shrink-0">
            <Button variant="secondary" onClick={() => setShowBudgetModal(true)}>
              + Presupuesto
            </Button>
            <Button variant="secondary" onClick={() => setShowBudgetsListModal(true)}>
              Ver Presupuestos
            </Button>
          </div>
        </div>
        {/* Filters */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Filtrar por Categoría"
              value={categoryId ?? ''}
              onChange={e => {
                setCategoryId(e.target.value ? Number(e.target.value) : undefined)
                setPage(1)
              }}
            >
              <option value="">Todas las categorías</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Select>

            <Select
              label="Filtrar por Medio de Pago"
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value)}
            >
              <option value="">Todos los medios de pago</option>
              {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
        </div>
        {/* Quick stats */}
        {(() => {
          const totalSpent = monthlyReport?.summary.totalSpent ?? 0
          const expenseCount = monthlyReport?.summary.expenseCount ?? 0
          const average = expenseCount > 0 ? totalSpent / expenseCount : 0

          return (
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-sm text-gray-600 mb-1">Gastos totales en el mes</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSpent, activeAccount.currency)}</p>
                <p className="text-xs text-gray-500 mt-2">{expenseCount} gastos</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-sm text-gray-600 mb-1">Promedio por Gasto en el mes</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(average, activeAccount.currency)}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {monthName} {year}
                </p>
              </div>
            </div>
          )
        })()}

        {/* Expenses table */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalle de Gastos</h3>
          <ExpensesTable
            expenses={filteredExpenses}
            loading={loading}
            error={error}
            onEdit={handleEdit}
            onDelete={handleDelete}
            currency={activeAccount.currency}
          />
          {!loading && filteredExpenses.length === 0 && !error && (
            <EmptyState
              icon="📭"
              title={`Sin gastos en ${monthName} ${year}`}
              description="No hay gastos registrados para este período."
              action={{ label: 'Agregar gasto', onClick: handleCreateNew }}
            />
          )}
        </div>

        {/* Pagination Information */}
        {filteredExpenses.length > 0 && (
          <Pagination
            page={page}
            totalPages={pagination.totalPages}
            hasNextPage={pagination.hasNextPage}
            hasPreviousPage={pagination.hasPreviousPage}
            onPageChange={handlePageChange}
            loading={loading}
          />
        )}
        {filteredExpenses.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-500">
            Mostrando {filteredExpenses.length} de {pagination.total} gastos
          </div>
        )}
        {showForm && (
          <ExpenseModal
            key={selectedExpense?.id ?? 'new'}
            isOpen={showForm}
            expense={selectedExpense}
            onClose={() => {
              setShowForm(false)
              setSelectedExpense(null)
            }}
            onSubmit={async data => {
              if (selectedExpense) {
                await updateExpense(selectedExpense.id, data)
              } else {
                await createExpense({
                  ...data,
                  accountId: activeAccount.id,
                })
              }
              await fetchExpenses({
                accountId: activeAccount.id,
                month,
                year,
                categoryId,
                pagination: { page, limit: 10 },
              })
            }}
            loading={loading}
            currency={activeAccount.currency}
            categories={categories}
            cards={cards}
            onCreateCategory={() => {
              setSelectedCategory(null)
              setShowCategoryModal(true)
            }}
            onEditCategory={cat => {
              setSelectedCategory(cat)
              setShowCategoryModal(true)
            }}
          />
        )}
        {showBudgetModal && activeAccount && (
          <BudgetModal
            key={selectedBudget?.id ?? 'new-budget'}
            isOpen={showBudgetModal}
            budget={selectedBudget}
            month={month}
            year={year}
            accountId={activeAccount.id}
            onClose={() => {
              setShowBudgetModal(false)
              setSelectedBudget(null)
            }}
            onSubmit={async data => {
              if (selectedBudget) {
                await updateBudget(selectedBudget.id, data)
              } else {
                await createBudget(data)
              }
            }}
            loading={budgetsLoading}
            categories={categories}
            onCreateCategory={() => {
              setSelectedCategory(null)
              setShowCategoryModal(true)
            }}
            onEditCategory={cat => {
              setSelectedCategory(cat)
              setShowCategoryModal(true)
            }}
          />
        )}
        <BudgetsListModal
          isOpen={showBudgetsListModal}
          budgets={budgets}
          loading={budgetsLoading}
          month={month}
          year={year}
          onClose={() => setShowBudgetsListModal(false)}
          onDelete={async id => {
            await deleteBudget(id)
          }}
          onEdit={budget => {
            setSelectedBudget(budget)
            setShowBudgetsListModal(false)
            setShowBudgetModal(true)
          }}
        />
        <CategoryModal
          key={selectedCategory?.id ?? 'new-category'}
          isOpen={showCategoryModal}
          category={selectedCategory}
          onClose={() => {
            setShowCategoryModal(false)
            setSelectedCategory(null)
          }}
          onSubmit={async data => {
            if (selectedCategory) {
              await updateCategory(selectedCategory.id, data)
            } else {
              await createCategory(data)
            }
          }}
          loading={categoriesLoading}
        />
      </div>
    </div>
  )
}
