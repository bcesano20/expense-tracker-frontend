import { useState, useCallback } from 'react'

import { ERROR_MESSAGES } from '../helpers/constants'
import type {
  IncomeInterface,
  IncomeFormInterface,
  GetIncomeRequestInterface,
  PaginationState,
} from '../types'
import { incomesService } from '../services/incomeServices'

const DEFAULT_PAGINATION_STATE: PaginationState = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
}

export const useIncomes = (_accountId: number) => {
  const [incomes, setIncomes] = useState<IncomeInterface[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationState>(DEFAULT_PAGINATION_STATE)

  const fetchIncomes = useCallback(async (request: GetIncomeRequestInterface) => {
    try {
      setLoading(true)
      setError(null)
      const response = await incomesService.getIncomes(request)
      setIncomes(response?.data || [])
      setPagination(response?.pagination ?? DEFAULT_PAGINATION_STATE)
    } catch {
      setError(ERROR_MESSAGES.INCOMES_LOAD_ERROR)
    } finally {
      setLoading(false)
    }
  }, [])

  const getIncomeById = useCallback(async (id: number) => {
    try {
      setError(null)
      const data = await incomesService.getIncomeById(id)
      return data
    } catch {
      setError(ERROR_MESSAGES.INCOME_GET_ERROR)
      return null
    }
  }, [])

  const createIncome = useCallback(async (data: IncomeFormInterface) => {
    try {
      setLoading(true)
      setError(null)
      const newIncome = await incomesService.createIncome(data)
      if (newIncome) {
        setIncomes(prev => [newIncome, ...prev])
      }
      return newIncome
    } catch (err) {
      setError(ERROR_MESSAGES.CREATE_INCOME_ERROR)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateIncome = useCallback(async (id: number, data: Partial<IncomeFormInterface>) => {
    try {
      setLoading(true)
      setError(null)
      const updatedIncome = await incomesService.updateIncome(id, data)
      if (updatedIncome) {
        setIncomes(prev => prev.map(income => (income.id === id ? updatedIncome : income)))
      }
      return updatedIncome
    } catch (err) {
      setError(ERROR_MESSAGES.UPDATE_INCOME_ERROR)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteIncome = useCallback(async (id: number) => {
    try {
      setLoading(true)
      setError(null)
      await incomesService.deleteIncome(id)
      setIncomes(prev => prev.filter(income => income.id !== id))
    } catch (err) {
      setError(ERROR_MESSAGES.DELETE_INCOME_ERROR)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    // States
    incomes,
    loading,
    error,
    pagination,

    // Functions
    fetchIncomes,
    getIncomeById,
    createIncome,
    updateIncome,
    deleteIncome,
  }
}
