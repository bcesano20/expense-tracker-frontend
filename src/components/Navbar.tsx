import { useNavigate } from 'react-router-dom'

import { ROUTES } from '../helpers/constants'
import { useAuth } from '../hooks/useAuth'
import { HamburgerMenu } from './HamburgerMenu'
import { Link } from './Link'

export const Navbar = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate(ROUTES.LOGIN)
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
            <Link linkTo={ROUTES.DASHBOARD} className="text-gray-700 hover:text-blue-600">
              Tablero
            </Link>
            <Link linkTo={ROUTES.EXPENSES} className="text-gray-700 hover:text-blue-600">
              Gastos
            </Link>
            <Link linkTo={ROUTES.ACCOUNTS} className="text-gray-700 hover:text-blue-600">
              Cuentas
            </Link>
            <Link linkTo={ROUTES.REPORTS} className="text-gray-700 hover:text-blue-600">
              Reportes
            </Link>
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
