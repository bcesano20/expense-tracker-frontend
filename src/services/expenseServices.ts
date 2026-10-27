import api from './api'

import { BACKEND_API_ENDPOINTS, ERROR_MESSAGES } from '../helpers/constants'
import { rethrowWithApiMessage } from '../helpers/utils'
import type { GetExpenseRequestInterface, ExpenseInterface, ApiResponseInterface } from '../types'

export const expensesService = {
  getExpenses: async (data: GetExpenseRequestInterface) => {
    const body = {
      accountId: data.accountId,
      month: data.month,
      year: data.year,
      category: data.categoryId,
      orderBy: data.orderBy,
      page: data.pagination.page,
      limit: data.pagination.limit,
    }

    const response = await api.get<ApiResponseInterface<ExpenseInterface[]>>(
      BACKEND_API_ENDPOINTS.EXPENSE_BASIC_API_ROUTE,
      { params: body }
    )
    return {
      data: response.data.data ?? [],
      pagination: response.data.pagination,
    }
  },

  getExpenseById: async (id: number) => {
    const response = await api.get<ApiResponseInterface<ExpenseInterface>>(
      `${BACKEND_API_ENDPOINTS.EXPENSE_BASIC_API_ROUTE}/${id}`
    )
    return response.data.data
  },

  createExpense: async (data: Partial<ExpenseInterface>) => {
    try {
      const response = await api.post<ApiResponseInterface<ExpenseInterface>>(
        BACKEND_API_ENDPOINTS.EXPENSE_BASIC_API_ROUTE,
        data
      )
      return response.data.data
    } catch (err: unknown) {
      return rethrowWithApiMessage(err, ERROR_MESSAGES.CREATE_EXPENSE_ERROR)
    }
  },

  updateExpense: async (id: number, data: Partial<ExpenseInterface>) => {
    try {
      const response = await api.put<ApiResponseInterface<ExpenseInterface>>(
        `${BACKEND_API_ENDPOINTS.EXPENSE_BASIC_API_ROUTE}/${id}`,
        data
      )
      return response.data.data
    } catch (err: unknown) {
      return rethrowWithApiMessage(err, ERROR_MESSAGES.UPDATE_EXPENSE_ERROR)
    }
  },

  deleteExpense: async (id: number) => {
    await api.delete(`${BACKEND_API_ENDPOINTS.EXPENSE_BASIC_API_ROUTE}/${id}`)
  },
}
