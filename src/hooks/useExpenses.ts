import { useState, useCallback } from 'react'

import type { ExpenseInterface, GetExpenseRequestInterface } from '../types'
import { expensesService } from '../services/expenseServices'
import { ERROR_MESSAGES } from '../helpers/constants'

export const useExpenses = (_accountId: number) => {
  const [expenses, setExpenses] = useState<ExpenseInterface[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Get Expenses with filters (date period and category)
  const fetchExpenses = useCallback(async (request: GetExpenseRequestInterface) => {
    try {
      setLoading(true)
      setError(null)
      const data = await expensesService.getExpenses(request)
      setExpenses(data || [])
    } catch (err) {
      setError(ERROR_MESSAGES.EXPENSES_LOAD_ERROR)
      // eslint-disable-next-line no-console
      console.error(err)
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

  const createExpense = useCallback(async (data: Partial<ExpenseInterface>) => {
    try {
      setLoading(true)
      setError(null)
      const newExpense = await expensesService.createExpense(data)
      if (newExpense) {
        setExpenses(prev => [newExpense, ...prev])
      }
      return newExpense
    } catch (err) {
      setError(ERROR_MESSAGES.CREATE_EXPENSE_ERROR)
      // eslint-disable-next-line no-console
      console.error(err)
      throw err
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
    } catch (err) {
      setError(ERROR_MESSAGES.UPDATE_EXPENSE_ERROR)
      // eslint-disable-next-line no-console
      console.error(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteExpense = useCallback(async (id: number) => {
    try {
      setLoading(true)
      setError(null)
      await expensesService.deleteExpense(id)

      setExpenses(prev => prev.filter(expense => expense.id !== id))
    } catch (err) {
      setError(ERROR_MESSAGES.DELETE_EXPENSE_ERROR)
      // eslint-disable-next-line no-console
      console.error(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    // States
    expenses,
    loading,
    error,

    // Functions
    fetchExpenses,
    getExpenseById,
    createExpense,
    updateExpense,
    deleteExpense,
  }
}
