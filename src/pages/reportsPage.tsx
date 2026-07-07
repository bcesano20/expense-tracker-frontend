import { useEffect, useState } from 'react'

import { MONTHS, ROUTES } from '../helpers/constants'
import { formatCurrency } from '../helpers/utils'
import { useAuth } from '../hooks/useAuth'
import { useMonthlyReport } from '../hooks/useMonthlyReports'
import { useAccounts } from '../hooks/useAccounts'
import { useCategories } from '../hooks/useCategories'
import { useReports } from '../hooks/useReports'
import {
  EmptyState,
  Navbar,
  MonthSelector,
  CategoryPieChart,
  PaymentMethodBarChart,
  ComparativeChart,
  Select,
  BudgetStatusCard,
  IncomeRatioCard,
} from '../components'

export const ReportsPage = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined)

  const { state } = useAuth()
  const activeAccountId = state.activeAccountId

  const {
    report,
    comparative,
    loading,
    error,
    comparativeError,
    fetchMonthlyReport,
    fetchComparative,
  } = useMonthlyReport(activeAccountId ?? 0)

  const { accounts, fetchAccounts } = useAccounts()
  const activeAccount = accounts.find(a => a.id === state.activeAccountId) ?? accounts[0] ?? null

  const { categories, fetchCategories } = useCategories()
  const {
    budgetStatus,
    incomeRatio,
    loading: budgetLoading,
    fetchBudgetStatus,
    fetchIncomeRatio,
  } = useReports()

  useEffect(() => {
    fetchAccounts()
    fetchCategories()
  }, [fetchAccounts, fetchCategories])

  useEffect(() => {
    if (!activeAccountId) return
    fetchMonthlyReport(month, year)
    fetchComparative(month, year)
    fetchIncomeRatio({ accountId: activeAccountId, month, year })
  }, [month, year, activeAccountId, fetchMonthlyReport, fetchComparative, fetchIncomeRatio])

  useEffect(() => {
    if (!activeAccountId || !selectedCategoryId) return
    fetchBudgetStatus({ accountId: activeAccountId, categoryId: selectedCategoryId, month, year })
  }, [selectedCategoryId, month, year, activeAccountId, fetchBudgetStatus])

  const monthName = MONTHS[month - 1]

  if (!activeAccountId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto p-6">
          <div className="card">
            <EmptyState
              icon="🏦"
              title="No tenés ninguna cuenta"
              description="Creá una cuenta para poder ver los reportes de tus gastos."
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Reportes</h2>
          <p className="text-gray-600">
            Análisis detallado de tus gastos en la cuenta <strong>{activeAccount?.name}</strong>
          </p>
        </div>

        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <MonthSelector
            month={month}
            year={year}
            onMonthChange={setMonth}
            onYearChange={setYear}
          />
        </div>

        {/* Loading/Error */}
        {loading && (
          <div className="bg-blue-100 text-blue-700 p-4 rounded-lg mb-6">Cargando reportes...</div>
        )}

        {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</div>}

        {/* Summary */}
        {report && !loading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {/* Total Expended */}
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-sm text-gray-600 mb-2">Total Gastado</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(report.summary.totalSpent ?? 0, activeAccount?.currency)}
                </p>
                <p className="text-xs text-gray-500 mt-2">{report.summary.expenseCount} gastos</p>
              </div>

              {/* Categories */}
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-sm text-gray-600 mb-2">Categorías</p>
                <p className="text-3xl font-bold text-gray-900">{report.summary.categoryCount}</p>
                <p className="text-xs text-gray-500 mt-2">Tipos de gasto</p>
              </div>

              {/* Cards */}
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-sm text-gray-600 mb-2">Tarjetas Usadas</p>
                <p className="text-3xl font-bold text-gray-900">{report.summary.cardCount}</p>
                <p className="text-xs text-gray-500 mt-2">Con transacciones</p>
              </div>

              {/* To Pay */}
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-sm text-gray-600 mb-2">Total a Pagar</p>
                <p className="text-3xl font-bold text-red-600">
                  {formatCurrency(report.totalCardPayments ?? 0, activeAccount?.currency)}
                </p>
                <p className="text-xs text-gray-500 mt-2">En tarjetas</p>
              </div>
            </div>

            {/* Graphics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {report.expensesByCategory.filter(c => c.category && c.category !== 'undefined')
                .length > 0 && (
                <CategoryPieChart
                  data={report.expensesByCategory.filter(
                    c => c.category && c.category !== 'undefined'
                  )}
                  currency={activeAccount?.currency}
                />
              )}

              {report.expensesByPaymentMethod.length > 0 && (
                <PaymentMethodBarChart
                  data={report.expensesByPaymentMethod}
                  currency={activeAccount?.currency}
                />
              )}
            </div>

            {/* Comparative */}
            {comparativeError && (
              <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{comparativeError}</div>
            )}
            {comparative && (
              <div className="mb-8">
                <ComparativeChart
                  currentMonth={comparative.currentMonth.month}
                  currentYear={comparative.currentMonth.year}
                  currentTotal={comparative.currentMonth.total}
                  previousMonth={comparative.previousMonth.month}
                  previousYear={comparative.previousMonth.year}
                  previousTotal={comparative.previousMonth.total}
                  difference={comparative.comparison?.difference ?? 0}
                  percentageChange={comparative.comparison?.changePercentage ?? 0}
                  trend={comparative.comparison?.trend ?? 'SAME'}
                  currency={activeAccount?.currency}
                />
              </div>
            )}

            {/* Cards to pay table */}
            {report.cardsToPay.filter(c => c.cardType === 'credit').length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Cuotas a Pagar en {monthName}
                </h3>
                <div className="space-y-4">
                  {report.cardsToPay
                    .filter(c => c.cardType === 'credit')
                    .map(card => (
                      <div key={card.cardId} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{card.cardName}</h4>
                            <p className="text-sm text-gray-600">
                              {card.cardBank} • {card.cardType === 'credit' ? 'Crédito' : 'Débito'}
                            </p>
                          </div>
                          <p className="text-2xl font-bold text-blue-600">
                            {formatCurrency(card.totalDue ?? 0, activeAccount?.currency)}
                          </p>
                        </div>

                        {card.installments.length > 0 && (
                          <div className="bg-gray-50 rounded p-3">
                            <p className="text-xs font-semibold text-gray-700 mb-2">Cuotas:</p>
                            <ul className="space-y-1">
                              {card.installments.map((installment, idx) => (
                                <li
                                  key={idx}
                                  className="text-sm text-gray-600 flex justify-between items-center gap-4"
                                >
                                  <span className="flex-1">
                                    {installment.expenseDescription}
                                    <span className="text-gray-400 text-xs ml-1">
                                      ({installment.installmentProgress})
                                    </span>
                                  </span>
                                  <span className="font-medium shrink-0">
                                    {formatCurrency(
                                      installment.amount ?? 0,
                                      activeAccount?.currency
                                    )}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {report.cardsToPay.length === 0 && (
              <div className="bg-green-100 text-green-700 p-4 rounded-lg text-center">
                ✅ No hay cuotas a pagar en {monthName} {year}
              </div>
            )}

            <BudgetStatusCard
              budgetStatus={budgetStatus}
              loading={budgetLoading}
              monthName={monthName}
              year={year}
              selectedCategoryId={selectedCategoryId}
              currency={activeAccount?.currency}
              selector={
                <Select
                  label="Seleccioná una categoría"
                  value={selectedCategoryId ?? ''}
                  onChange={e =>
                    setSelectedCategoryId(e.target.value ? Number(e.target.value) : undefined)
                  }
                >
                  <option value="">— Elegí una categoría —</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Select>
              }
            />

            <IncomeRatioCard
              incomeRatio={incomeRatio}
              loading={budgetLoading}
              monthName={monthName}
              year={year}
              currency={activeAccount?.currency}
            />
          </>
        )}
      </div>
    </div>
  )
}
