import { useState, useCallback } from 'react'

import type { ExpenseInterface, GetExpenseRequestInterface, PaginationState } from '../types'
import { expensesService } from '../services/expenseServices'
import { ERROR_MESSAGES } from '../helpers/constants'

const DEFAULT_PAGINATION_STATE: PaginationState = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
}

export const useExpenses = (_accountId: number) => {
  const [expenses, setExpenses] = useState<ExpenseInterface[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const [pagination, setPagination] = useState<PaginationState>(DEFAULT_PAGINATION_STATE)

  // Get Expenses with filters (date period and category)
  const fetchExpenses = useCallback(async (request: GetExpenseRequestInterface) => {
    try {
      setLoading(true)
      setError(null)
      const response = await expensesService.getExpenses(request)

      setExpenses(response?.data || [])
      setPagination(response?.pagination ?? DEFAULT_PAGINATION_STATE)
    } catch {
      setError(ERROR_MESSAGES.EXPENSES_LOAD_ERROR)
    } finally {
      setLoading(false)
    }
  }, [])

  // The useCallback avoid the un-necessary re-render
  const getExpenseById = useCallback(async (id: number) => {
    try {
      setError(null)
      const data = await expensesService.getExpenseById(id)
      return data
    } catch (err) {
      setError(ERROR_MESSAGES.EXPENSE_GET_ERROR)
      // eslint-disable-next-line no-console
      console.error(err)
      return null
    }
  }, [])

  // A failure is thrown to the modal, which shows it inline. `error` is only for the list itself
  const createExpense = useCallback(async (data: Partial<ExpenseInterface>) => {
    try {
      setLoading(true)
      setError(null)
      const newExpense = await expensesService.createExpense(data)
      if (newExpense) {
        setExpenses(prev => [newExpense, ...prev])
      }
      return newExpense
    } finally {
      setLoading(false)
    }
  }, [])

  const updateExpense = useCallback(async (id: number, data: Partial<ExpenseInterface>) => {
    try {
      setLoading(true)
      setError(null)
      const updatedExpense = await expensesService.updateExpense(id, data)
      if (updatedExpense) {
        setExpenses(prev => prev.map(expense => (expense.id === id ? updatedExpense : expense)))
      }
      return updatedExpense
    } finally {
      setLoading(false)
    }
  }, [])

  // A failure is thrown to the DeleteModal, which shows it inline
  const deleteExpense = useCallback(async (id: number) => {
    try {
      setLoading(true)
      setError(null)
      await expensesService.deleteExpense(id)

      setExpenses(prev => prev.filter(expense => expense.id !== id))
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    // States
    expenses,
    loading,
    error,
    pagination,

    // Functions
    fetchExpenses,
    getExpenseById,
    createExpense,
    updateExpense,
    deleteExpense,
  }
}
