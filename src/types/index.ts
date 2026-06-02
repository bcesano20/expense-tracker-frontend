export interface UserInterface {
  id: number
  name: string
  lastName: string
  email: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface AccountInterface {
  id: number
  name: string
  currency: string
  userId: number
  createdAt: string
  updatedAt: string
}

export interface CardInterface {
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

export interface ExpenseInterface {
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
    card: CardInterface
  }
  installments?: InstallmentInterface[]
  createdAt: string
  updatedAt: string
}

export interface InstallmentInterface {
  id: number
  installmentNumber: number
  totalInstallments: number
  installmentAmount: number
  paymentMonth: number
  paymentYear: number
}

export interface ApiResponseInterface<T> {
  success: boolean
  data?: T
  error?: string
  message: string
  token?: string
}

export interface AuthStateInterface {
  user: UserInterface | null
  token: string | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
}

export interface PayloadInterface {
  user: UserInterface
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
