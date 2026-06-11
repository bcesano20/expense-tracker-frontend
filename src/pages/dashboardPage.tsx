import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { MONTHS, ROUTES } from '../helpers/constants'
import { useAuth } from '../hooks/useAuth'
import { useReports } from '../hooks/useReports'
import { EmptyState, Link, MonthSelector, Navbar, StatCard } from '../components'

const ICONS = {
  wallet: '💰',
  trending: '📈',
  chart: '📊',
  creditCard: '💳',
}

export const DashboardPage = () => {
  const { state } = useAuth()
  const { data, loading, error, fetchSummary } = useReports()

  const navigate = useNavigate()

  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())

  useEffect(() => {
    if (state.activeAccountId) {
      fetchSummary(state.activeAccountId)
    }
  }, [state.activeAccountId, fetchSummary])

  const monthName = MONTHS[month - 1]

  const hasNoExpenses = data !== null && data.expenseCountThisMonth === 0
  const hasNoInstallments = data !== null && data.installmentCountThisMonth === 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Tablero de Gastos</h2>
          <p className="text-gray-600">
            Bienvenido, <span className="font-semibold">{state.user?.name}</span>
          </p>
        </div>

        {/* Month Selector */}
        <div className="mb-8">
          <MonthSelector
            month={month}
            year={year}
            onMonthChange={setMonth}
            onYearChange={setYear}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-blue-100 text-blue-700 p-4 rounded-lg">Cargando datos...</div>
        )}

        {/* Error State — no account or API failure */}
        {error && !loading && (
          <div className="card">
            <EmptyState
              icon="🏦"
              title="No se encontró una cuenta"
              description="Parece que aún no tienes una cuenta configurada. Crea una para empezar a registrar tus gastos."
              action={{ label: 'Crear cuenta', onClick: () => navigate(ROUTES.ACCOUNTS) }}
            />
          </div>
        )}

        {/* Stats Cards */}
        {data && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Expended */}
            <StatCard
              label="Total Gastado"
              value={hasNoExpenses ? '—' : `$${(data.totalExpensesThisMonth ?? 0).toFixed(2)}`}
              icon={ICONS.wallet}
              color="blue"
              subtext={
                hasNoExpenses ? 'Sin gastos este mes' : `${data.expenseCountThisMonth ?? 0} gastos`
              }
            />

            {/* Daily Average */}
            <StatCard
              label="Promedio Diario"
              value={hasNoExpenses ? '—' : `$${(data.dailyAverageExpense ?? 0).toFixed(2)}`}
              icon={ICONS.trending}
              color="green"
              subtext={hasNoExpenses ? 'Sin datos aún' : 'Por día en este mes'}
            />

            {/* Projection */}
            <StatCard
              label="Proyección Mensual"
              value={hasNoExpenses ? '—' : `$${(data.monthlyProjection ?? 0).toFixed(2)}`}
              icon={ICONS.chart}
              color="orange"
              subtext={hasNoExpenses ? 'Sin datos aún' : 'Si mantiene la tendencia'}
            />

            {/* Installments to Pay */}
            <StatCard
              label="Cuotas a Pagar"
              value={
                hasNoInstallments ? '—' : `$${(data.totalInstallmentsDueThisMonth ?? 0).toFixed(2)}`
              }
              icon={ICONS.creditCard}
              color="red"
              subtext={
                hasNoInstallments
                  ? 'Sin tarjetas registradas'
                  : `${data.installmentCountThisMonth ?? 0} cuotas`
              }
            />
          </div>
        )}

        {/* No expenses empty state */}
        {hasNoExpenses && !loading && (
          <div className="card mb-8">
            <EmptyState
              icon="📭"
              title={`Sin gastos en ${monthName} ${year}`}
              description="Aún no registraste gastos para este mes. ¡Empezá ahora!"
              action={{ label: 'Agregar gasto', onClick: () => navigate(ROUTES.EXPENSES) }}
            />
          </div>
        )}

        {/* No cards empty state */}
        {hasNoInstallments && !loading && (
          <div className="card mb-8">
            <EmptyState
              icon="💳"
              title="Sin tarjetas registradas"
              description="Agregá una tarjeta para poder registrar cuotas y llevar el control de tus pagos."
              action={{ label: 'Agregar tarjeta', onClick: () => navigate(ROUTES.CARDS) }}
            />
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
          <Link
            linkTo={ROUTES.EXPENSES}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-l-4 border-blue-500"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Mis Gastos</h3>
            <p className="text-gray-600 text-sm">Ver, crear, editar y eliminar gastos del mes</p>
          </Link>

          <Link
            linkTo={ROUTES.REPORTS}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-l-4 border-purple-500"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Reportes</h3>
            <p className="text-gray-600 text-sm">
              Ver análisis detallados y gráficos de tus gastos
            </p>
          </Link>
        </div>

        {/* Info Card — only shown when there is data */}
        {data && hasNoExpenses && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">
              💡 Tip: {monthName} {year}
            </h3>
            <p className="text-blue-800 text-sm">
              {(data.totalExpensesThisMonth ?? 0) > (data.monthlyProjection ?? 0)
                ? `🚨 Cuidado: Ya vas por $${(data.totalExpensesThisMonth ?? 0).toFixed(2)} de los $${(data.monthlyProjection ?? 0).toFixed(2)} estimados.`
                : `✅ Vas bien: Solo $${(data.totalExpensesThisMonth ?? 0).toFixed(2)} de los $${(data.monthlyProjection ?? 0).toFixed(2)} proyectados.`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
