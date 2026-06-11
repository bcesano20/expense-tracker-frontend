import { createContext } from 'react'

import type { AuthStateInterface, PayloadInterface } from '../types'

export interface AuthContextType {
  state: AuthStateInterface
  dispatch: React.Dispatch<AuthAction>
  login: (payload: PayloadInterface) => void
  logout: () => void
  setActiveAccount: (id: number) => void
}

export type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: PayloadInterface }
  | { type: 'LOGIN_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'RESTORE_TOKEN'; payload: PayloadInterface }
  | { type: 'SET_ACTIVE_ACCOUNT'; payload: number }

const initialState: AuthStateInterface = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  activeAccountId: null,
}

const authReducer = (state: AuthStateInterface, action: AuthAction): AuthStateInterface => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        error: null,
      }
    case 'LOGIN_ERROR':
      return { ...state, loading: false, error: action.payload }
    case 'LOGOUT':
      return initialState
    case 'RESTORE_TOKEN':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
      }
    case 'SET_ACTIVE_ACCOUNT':
      return { ...state, activeAccountId: action.payload }
    default:
      return state
  }
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export { authReducer, initialState }
