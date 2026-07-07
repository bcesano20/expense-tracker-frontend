import type { ReactNode } from 'react'

// ENTITIES INTERFACES
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

export interface CardFormInterface {
  name: string
  bank: string
  type: 'credit' | 'debit'
  network: 'visa' | 'mastercard' | 'american express' | 'naranja x' | 'cabal'
  balance?: number
  closeDay?: number
  accountId: number
}

export interface ExpenseInterface {
  id: number
  description: string
  amount: number
  date: string
  category: string | CategoryInterface
  categoryId?: number
  cardId?: number
  paymentMethod: string
  billingMonth: number
  billingYear: number
  accountId: number
  notes?: string | null
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

export interface IncomeInterface {
  id: number
  accountId: number
  description: string
  amount: number
  source: string
  date: string
  createdAt: string
  updatedAt: string
}

export interface BudgetInterface {
  id: number
  accountId: number
  categoryId: number
  category?: CategoryInterface
  month: number
  year: number
  amount?: number
  minAmount?: number
  maxAmount?: number
  createdAt: string
  updatedAt: string
}

// API AND CONTEXT INTERFACES
export interface ApiResponseInterface<T> {
  success: boolean
  data?: T
  error?: string
  message: string
  token?: string
  pagination?: PaginationState
}

export interface AuthStateInterface {
  user: UserInterface | null
  token: string | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  activeAccountId: number | null
}

export interface PayloadInterface {
  user: UserInterface
  token: string
}

export interface ColumnInterface<T> {
  key: keyof T
  label: string
  render?: (value: unknown, row: T) => ReactNode
  width?: string
}

export interface PaginationState {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface PaginatedResponseInterface<T> {
  data: T[]
  pagination: PaginationState
}

export interface PaginatedRequestInterface {
  page: number
  limit: number
}

// AUTH INTERFACES
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

// REPORTS INTERFACES
export interface ResumeDataInterface {
  month: number
  year: number
  totalExpensesThisMonth: number
  expenseCountThisMonth: number
  totalInstallmentsDueThisMonth: number
  installmentCountThisMonth: number
  dailyAverageExpense: number
  monthlyProjection: number
}

export interface PeriodInterface {
  month: number
  year: number
  reportDate: string
}

export interface SummaryInterface {
  totalSpent: number
  expenseCount: number
  categoryCount: number
  cardCount: number
}

export interface CategoryFilter {
  category: string
  total: number
  percentage: number
}

export interface PaymentMethodFilterInterface {
  method: string
  total: number
  count: number
}

export interface ExpenseDetailInterface {
  id: number
  description: string
  amount: number
  date: string
  category: string
  paymentMethod: string
  card: string | null
}

export interface InstallmentDetailInterface {
  id: number
  expenseDescription: string
  expenseAmount: number
  installmentProgress: string
  amount: number
}

export interface CardToPayInterface {
  cardId: number
  cardName: string
  cardBank: string
  cardType: 'credit' | 'debit'
  network: string
  currentBalnce?: number
  totalDue: number
  installmentsCount: number
  installments: InstallmentDetailInterface[]
}

export interface MonthlyReportDataInterface {
  period: PeriodInterface
  summary: SummaryInterface
  expensesByCategory: CategoryFilter[]
  expensesByPaymentMethod: PaymentMethodFilterInterface[]
  expenseDetails: ExpenseDetailInterface[]
  cardsToPay: CardToPayInterface[]
  totalCardPayments: number
}

// For budget status report
export type BudgetStatus = 'UNDER_BUDGET' | 'OVER_BUDGET' | 'WITHIN_RANGE' | 'NO_BUDGET'

export interface BudgetStatusDetailInterface {
  type: 'fixed' | 'range'
  budgetAmount?: number
  minAmount?: number
  maxAmount?: number
  remaining: number
  usagePercentage: number
}

export interface AccountPeriodRequestInterface {
  accountId: number
  month: number
  year: number
  categoryId?: number
}

export interface BudgetStatusReportInterface {
  period: PeriodInterface
  category: Pick<CategoryInterface, 'id' | 'name' | 'color'>
  totalSpent: number
  expenseCount: number
  budget: BudgetStatusDetailInterface
  status: BudgetStatus
}

// For income ratio report
export type IncomeRatioStatus = 'SURPLUS' | 'DEFICIT' | 'BALANCED'

export interface IncomeRatioReportInterface {
  period: Pick<PeriodInterface, 'month' | 'year'>
  totalIncome: number
  totalExpenses: number
  balance: number
  expensePercentage: number
  incomeCount: number
  expenseCount: number
  status: IncomeRatioStatus
}

// For analitics by category
export interface CategoryAnalysisInterface {
  category: string
  totalPeriod: number
  monthAverage: number
  months: Record<string, number>
}

export interface CategoryAnalysisDataInterface {
  period: string
  totalSpent: number
  categories: CategoryAnalysisInterface[]
}

// For Comparasion
interface MonthInterface {
  month: number
  year: number
  total: number
  count: number
}

interface ComparasionInterface {
  difference: number
  changePercentage: number
  trend: 'INCREASE' | 'DECREASE' | 'SAME'
}

export interface ComparasionDataInterface {
  currentMonth: MonthInterface
  previousMonth: MonthInterface
  comparison: ComparasionInterface
}

// EXPENSES INTERFACES
export interface GetExpenseRequestInterface {
  accountId?: number
  month?: number
  year?: number
  categoryId?: number
  orderBy?: string
  pagination: PaginatedRequestInterface
}

// ACCOUNTS INTERFACES
export interface AccountServiceInterface {
  name: string
  currency: string
}

// CATEGORY INTERFACES
export interface CategoryInterface {
  id: number
  name: string
  color: string
  userId: number
  createdAt: string
  updatedAt: string
}

export interface CategoryFormInterface {
  name: string
  color: string
}

// INCOME INTERFACES
export interface GetIncomeRequestInterface {
  accountId?: number
  month?: number
  year?: number
  pagination: PaginatedRequestInterface
}

export interface IncomeFormInterface {
  description: string
  amount: number
  source: string
  date: string
  accountId: number
}

// BUDGET INTERFACES
export interface GetBudgetRequestInterface {
  accountId: number
  month: number
  year: number
  categoryId?: number
}

export interface BudgetFormInterface {
  accountId: number
  categoryId: number
  month: number
  year: number
  amount?: number
  minAmount?: number
  maxAmount?: number
}
