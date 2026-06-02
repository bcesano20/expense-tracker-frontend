import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import { ROUTES } from './helpers/constants'
import type { UserInterface } from './types'
import { useAuth } from './hooks/useAuth'
import { AuthProvider } from './contexts/authProvider'
import { DashboardPage } from './pages/dashboardPage'
import { LoginPage } from './pages/loginPage'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { state } = useAuth()

  if (!state.isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} />
  }

  return <>{children}</>
}

function AppContent() {
  const { state, dispatch } = useAuth()

  // Restore the session if the token exists in the LocalStorage
  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')

    if (token && user) {
      try {
        const parsedUser = JSON.parse(user) as UserInterface
        if (parsedUser?.id && parsedUser?.email) {
          dispatch({ type: 'RESTORE_TOKEN', payload: { user: parsedUser, token } })
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error restaurando token:', error)
      }
    }
  }, [dispatch])

  return (
    <Routes>
      <Route
        path={ROUTES.LOGIN}
        element={state.isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} /> : <LoginPage />}
      />
      <Route
        path={ROUTES.DASHBOARD}
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path={ROUTES.LANDING} element={<Navigate to={ROUTES.DASHBOARD} />} />
    </Routes>
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
