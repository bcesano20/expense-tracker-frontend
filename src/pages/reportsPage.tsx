import { useEffect, useState } from 'react'

import { MONTHS, ROUTES } from '../helpers/constants'
import { useAuth } from '../hooks/useAuth'
import { useMonthlyReport } from '../hooks/useMonthlyReports'
import {
  EmptyState,
  Navbar,
  MonthSelector,
  CategoryPieChart,
  PaymentMethodBarChart,
  ComparativeChart,
} from '../components'

export const ReportsPage = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())

  const { state } = useAuth()
  const activeAccountId = state.activeAccountId

  const { report, comparative, loading, error, fetchMonthlyReport, fetchComparative } =
    useMonthlyReport(activeAccountId ?? 0)

  useEffect(() => {
    if (!activeAccountId) return
    fetchMonthlyReport(month, year)
    fetchComparative()
  }, [month, year, activeAccountId, fetchMonthlyReport, fetchComparative])

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
          <p className="text-gray-600">Análisis detallado de tus gastos</p>
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
                  ${report.summary.totalSpent.toFixed(2)}
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
                  ${report.totalCardPayments.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-2">En tarjetas</p>
              </div>
            </div>

            {/* Graphics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {report.expensesByCategory.length > 0 && (
                <CategoryPieChart data={report.expensesByCategory} />
              )}

              {report.expensesByPaymentMethod.length > 0 && (
                <PaymentMethodBarChart data={report.expensesByPaymentMethod} />
              )}
            </div>

            {/* Comparative */}
            {comparative && (
              <div className="mb-8">
                <ComparativeChart
                  currentMonth={comparative.currentMonth.month}
                  currentYear={comparative.currentMonth.year}
                  currentTotal={comparative.currentMonth.total}
                  previousMonth={comparative.previousMonth.month}
                  previousYear={comparative.previousMonth.year}
                  previousTotal={comparative.previousMonth.total}
                  difference={comparative.comparasion.difference}
                  percentageChange={comparative.comparasion.changePercentaje}
                  trend={comparative.comparasion.trend}
                />
              </div>
            )}

            {/* Cards to pay table */}
            {report.cardsToPay.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Cuotas a Pagar en {monthName}
                </h3>
                <div className="space-y-4">
                  {report.cardsToPay.map(card => (
                    <div key={card.cardId} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{card.cardName}</h4>
                          <p className="text-sm text-gray-600">
                            {card.cardBank} • {card.cardType === 'credit' ? 'Crédito' : 'Débito'}
                          </p>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">
                          ${card.totalToPay.toFixed(2)}
                        </p>
                      </div>

                      {card.installmentDetails.length > 0 && (
                        <div className="bg-gray-50 rounded p-3">
                          <p className="text-xs font-semibold text-gray-700 mb-2">Cuotas:</p>
                          <ul className="space-y-1">
                            {card.installmentDetails.map((installment, idx) => (
                              <li key={idx} className="text-sm text-gray-600 flex justify-between">
                                <span>
                                  {installment.expenseDescription} ({installment.installment})
                                </span>
                                <span className="font-medium">
                                  ${installment.amount.toFixed(2)}
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
          </>
        )}
      </div>
    </div>
  )
}
