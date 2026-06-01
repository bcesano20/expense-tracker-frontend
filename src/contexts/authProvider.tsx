import { useReducer, type ReactNode } from 'react'

import type { PayloadInterface } from '../types'
import { AuthContext, authReducer, initialState } from './authContext'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  const login = (payloadParam: PayloadInterface) => {
    dispatch({ type: 'LOGIN_SUCCESS', payload: payloadParam })
    localStorage.setItem('token', payloadParam.token)
    localStorage.setItem('user', JSON.stringify(payloadParam.user))
  }

  const logout = () => {
    dispatch({ type: 'LOGOUT' })
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ state, dispatch, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
