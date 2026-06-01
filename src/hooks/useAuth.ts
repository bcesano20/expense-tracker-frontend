import { useContext } from 'react'

import { AuthContext, type AuthContextType } from '../contexts/authContext'

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}
