import { useState, useCallback } from 'react'

import { ERROR_MESSAGES } from '../helpers/constants'
import type { BudgetInterface, BudgetFormInterface, GetBudgetRequestInterface } from '../types'
import { budgetService } from '../services/budgetServices'

export const useBudgets = (_accountId: number) => {
  const [budgets, setBudgets] = useState<BudgetInterface[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBudgets = useCallback(async (request: GetBudgetRequestInterface) => {
    try {
      setLoading(true)
      setError(null)
      const data = await budgetService.getBudgets(request)
      setBudgets(data ?? [])
    } catch {
      setError(ERROR_MESSAGES.BUDGETS_LOAD_ERROR)
    } finally {
      setLoading(false)
    }
  }, [])

  const getBudgetById = useCallback(async (id: number) => {
    try {
      setError(null)
      return await budgetService.getBudgetById(id)
    } catch {
      setError(ERROR_MESSAGES.BUDGET_GET_ERROR)
      return null
    }
  }, [])

  const createBudget = useCallback(async (data: BudgetFormInterface) => {
    try {
      setLoading(true)
      setError(null)
      const newBudget = await budgetService.createBudget(data)
      if (newBudget) {
        setBudgets(prev => [...prev, newBudget])
      }
      return newBudget
    } catch (err) {
      setError(ERROR_MESSAGES.CREATE_BUDGET_ERROR)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateBudget = useCallback(async (id: number, data: Partial<BudgetFormInterface>) => {
    try {
      setLoading(true)
      setError(null)
      const updatedBudget = await budgetService.updateBudget(id, data)
      if (updatedBudget) {
        setBudgets(prev => prev.map(budget => (budget.id === id ? updatedBudget : budget)))
      }
      return updatedBudget
    } catch (err) {
      setError(ERROR_MESSAGES.UPDATE_BUDGET_ERROR)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteBudget = useCallback(async (id: number) => {
    try {
      setLoading(true)
      setError(null)
      await budgetService.deleteBudget(id)
      setBudgets(prev => prev.filter(budget => budget.id !== id))
    } catch (err) {
      setError(ERROR_MESSAGES.DELETE_BUDGET_ERROR)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    // States
    budgets,
    loading,
    error,

    // Functions
    fetchBudgets,
    getBudgetById,
    createBudget,
    updateBudget,
    deleteBudget,
  }
}
