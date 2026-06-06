import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '../helpers/constants'
import { useAuth } from '../hooks/useAuth'
import { Link } from './Link'

const NAV_LINKS = [
  { label: 'Dashboard', to: ROUTES.DASHBOARD },
  { label: 'Gastos', to: ROUTES.EXPENSES },
  { label: 'Reportes', to: ROUTES.REPORTS },
]

export const HamburgerMenu = () => {
  const navigate = useNavigate()
  const { state, logout } = useAuth()

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleLogout = () => {
    logout()
    navigate(ROUTES.LOGIN)
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(prev => !prev)}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        className="flex flex-col justify-center gap-1.5 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <span
          className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 origin-center ${isOpen ? 'rotate-45 translate-y-2' : ''}`}
        />
        <span
          className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isOpen ? 'opacity-0 scale-x-0' : ''}`}
        />
        <span
          className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 origin-center ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-card-hover border border-gray-100 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-100 mb-1">
            <p className="text-xs text-gray-400">Sesión activa</p>
            <p className="text-sm text-gray-700 font-medium truncate">{state.user?.email}</p>
          </div>

          <nav className="flex flex-col">
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                linkTo={link.to}
                className="px-4 py-2.5 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors text-sm"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-gray-100 mt-1 pt-1">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
