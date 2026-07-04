import api from './api'

import { BACKEND_API_ENDPOINTS } from '../helpers/constants'
import type {
  GetBudgetRequestInterface,
  BudgetInterface,
  BudgetFormInterface,
  ApiResponseInterface,
} from '../types'

export const budgetService = {
  getBudgets: async (data: GetBudgetRequestInterface) => {
    const response = await api.get<ApiResponseInterface<BudgetInterface[]>>(
      BACKEND_API_ENDPOINTS.BUDGETS_API_ENDPOINT,
      {
        params: {
          accountId: data.accountId,
          month: data.month,
          year: data.year,
          categoryId: data.categoryId,
        },
      }
    )
    return response.data.data ?? []
  },

  getBudgetById: async (id: number) => {
    const response = await api.get<ApiResponseInterface<BudgetInterface>>(
      `${BACKEND_API_ENDPOINTS.BUDGETS_API_ENDPOINT}/${id}`
    )
    return response.data.data
  },

  createBudget: async (data: BudgetFormInterface) => {
    const response = await api.post<ApiResponseInterface<BudgetInterface>>(
      BACKEND_API_ENDPOINTS.BUDGETS_API_ENDPOINT,
      data
    )
    return response.data.data
  },

  updateBudget: async (id: number, data: Partial<BudgetFormInterface>) => {
    const response = await api.put<ApiResponseInterface<BudgetInterface>>(
      `${BACKEND_API_ENDPOINTS.BUDGETS_API_ENDPOINT}/${id}`,
      data
    )
    return response.data.data
  },

  deleteBudget: async (id: number) => {
    await api.delete(`${BACKEND_API_ENDPOINTS.BUDGETS_API_ENDPOINT}/${id}`)
  },
}
