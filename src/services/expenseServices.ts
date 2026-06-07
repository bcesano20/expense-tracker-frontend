import api from './api'

import { BACKEND_API_ENDPOINTS } from '../helpers/constants'
import type { GetExpenseRequestInterface, ExpenseInterface, ApiResponseInterface } from '../types'

export const expensesService = {
  getExpenses: async (data: GetExpenseRequestInterface) => {
    const body = {
      accountId: data.accountId,
      month: data.month,
      year: data.year,
      category: data.category,
    }

    const response = await api.get<ApiResponseInterface<ExpenseInterface[]>>(
      BACKEND_API_ENDPOINTS.EXPENSE_BASIC_API_ROUTE,
      {
        params: body,
      }
    )
    return response.data.data
  },

  getExpenseById: async (id: number) => {
    const response = await api.get<ApiResponseInterface<ExpenseInterface>>(
      `${BACKEND_API_ENDPOINTS.EXPENSE_BASIC_API_ROUTE}/${id}`
    )
    return response.data.data
  },

  createExpense: async (data: Partial<ExpenseInterface>) => {
    const response = await api.post<ApiResponseInterface<ExpenseInterface>>(
      BACKEND_API_ENDPOINTS.EXPENSE_BASIC_API_ROUTE,
      data
    )
    return response.data.data
  },

  updateExpense: async (id: number, data: Partial<ExpenseInterface>) => {
    const response = await api.put<ApiResponseInterface<ExpenseInterface>>(
      `${BACKEND_API_ENDPOINTS.EXPENSE_BASIC_API_ROUTE}/${id}`,
      data
    )
    return response.data.data
  },

  deleteExpense: async (id: number) => {
    await api.delete(`${BACKEND_API_ENDPOINTS.EXPENSE_BASIC_API_ROUTE}/${id}`)
  },
}
