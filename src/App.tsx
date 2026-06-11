import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import { ROUTES } from './helpers/constants'
import { useAuth } from './hooks/useAuth'
import { AuthProvider } from './contexts/authProvider'
import { accountService } from './services/accountService'

const LoginPage = lazy(() => import('./pages/loginPage').then(m => ({ default: m.LoginPage })))
const RegisterPage = lazy(() =>
  import('./pages/registerPage').then(m => ({ default: m.RegisterPage }))
)
const DashboardPage = lazy(() =>
  import('./pages/dashboardPage').then(m => ({ default: m.DashboardPage }))
)
const ExpensesPage = lazy(() =>
  import('./pages/expensesPage').then(m => ({ default: m.ExpensesPage }))
)
const ReportsPage = lazy(() =>
  import('./pages/reportsPage').then(m => ({ default: m.ReportsPage }))
)
const AccountsPage = lazy(() =>
  import('./pages/accountsPage').then(m => ({ default: m.AccountsPage }))
)

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { state } = useAuth()

  if (!state.isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} />
  }

  return <>{children}</>
}

function AppContent() {
  const { state, dispatch, setActiveAccount } = useAuth()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')

    if (token && user) {
      try {
        const parsedUser = JSON.parse(user)
        dispatch({ type: 'RESTORE_TOKEN', payload: { user: parsedUser, token } })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error restaurando token:', error)
      }
    }
  }, [dispatch])

  useEffect(() => {
    if (state.isAuthenticated && state.activeAccountId === null) {
      accountService
        .getAccounts()
        .then(accounts => {
          if (accounts && accounts.length > 0) {
            setActiveAccount(accounts[0].id)
          }
        })
        .catch(() => {
          // pages handle the no-account state themselves
        })
    }
  }, [state.isAuthenticated, state.activeAccountId, setActiveAccount])

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">
          Cargando...
        </div>
      }
    >
      <Routes>
        <Route
          path={ROUTES.LOGIN}
          element={state.isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} /> : <LoginPage />}
        />
        <Route
          path={ROUTES.REGISTER}
          element={state.isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} /> : <RegisterPage />}
        />
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.EXPENSES}
          element={
            <ProtectedRoute>
              <ExpensesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.REPORTS}
          element={
            <ProtectedRoute>
              <ReportsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ACCOUNTS}
          element={
            <ProtectedRoute>
              <AccountsPage />
            </ProtectedRoute>
          }
        />
        <Route path={ROUTES.LANDING} element={<Navigate to={ROUTES.DASHBOARD} />} />
      </Routes>
    </Suspense>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App
