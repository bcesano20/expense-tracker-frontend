import { useNavigate } from 'react-router-dom'

import { ROUTES } from '../helpers/constants'
import { useAuth } from '../hooks/useAuth'

export const DashboardPage = () => {
  const { state, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate(ROUTES.DASHBOARD)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Bienvenido, {state.user?.name}!</h2>
          <p className="text-gray-600">Email: {state.user?.email}</p>
          <p className="text-gray-500 text-sm mt-2">
            El dashboard estará disponible próximamente...
          </p>
        </div>
      </div>
    </div>
  )
}
