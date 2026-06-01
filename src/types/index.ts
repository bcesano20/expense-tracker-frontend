export interface User {
  id: number
  name: string
  lastName: string
  email: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface Account {
  id: number
  name: string
  currency: string
  userId: number
  createdAt: string
  updatedAt: string
}

export interface Card {
  id: number
  name: string
  bank: string
  type: 'credit' | 'debit'
  network: 'visa' | 'mastercard' | 'american express' | 'naranja x' | 'cabal'
  balance?: number
  closeDay?: number
  accountId: number
  createdAt: string
  updatedAt: string
}

export interface Expense {
  id: number
  description: string
  amount: number
  date: string
  category: string
  paymentMethod: string
  billingMonth: number
  billingYear: number
  accountId: number
  card?: {
    card: Card
  }
  installments?: Installment[]
  createdAt: string
  updatedAt: string
}

export interface Installment {
  id: number
  installmentNumber: number
  totalInstallments: number
  installmentAmount: number
  paymentMonth: number
  paymentYear: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message: string
  token?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
}

export interface PayloadInterface {
  user: User
  token: string
}

export interface RegisterRequestInterface {
  name: string
  lastName: string
  email: string
  password: string
}

export interface LoginRequestInterface {
  email: string
  password: string
}
