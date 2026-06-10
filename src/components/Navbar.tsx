import { useNavigate } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'
import { HamburgerMenu } from './HamburgerMenu'
import { ROUTES } from '../helpers/constants'

export const Navbar = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Registro de Gastos</h1>
        </div>

        {/* Desktop nav — hidden below 900px */}
        <div className="hidden min-[900px]:flex gap-4 items-center">
          <nav className="flex gap-6">
            <a href={ROUTES.DASHBOARD} className="text-gray-700 hover:text-blue-600">
              Dashboard
            </a>
            <a href={ROUTES.EXPENSES} className="text-gray-700 hover:text-blue-600">
              Gastos
            </a>
            <a href={ROUTES.ACCOUNTS} className="text-gray-700 hover:text-blue-600">
              Cuentas
            </a>
            <a href={ROUTES.REPORTS} className="text-gray-700 hover:text-blue-600">
              Reportes
            </a>
          </nav>

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Cerrar Sesión
          </button>
        </div>

        {/* Mobile nav — visible below 900px */}
        <div className="flex min-[900px]:hidden">
          <HamburgerMenu />
        </div>
      </div>
    </nav>
  )
}
