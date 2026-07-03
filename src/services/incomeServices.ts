import api from './api'

import { BACKEND_API_ENDPOINTS } from '../helpers/constants'
import type {
  GetIncomeRequestInterface,
  IncomeInterface,
  IncomeFormInterface,
  ApiResponseInterface,
} from '../types'

export const incomesService = {
  getIncomes: async (data: GetIncomeRequestInterface) => {
    const body = {
      accountId: data.accountId,
      month: data.month,
      year: data.year,
      page: data.pagination.page,
      limit: data.pagination.limit,
    }

    const response = await api.get<ApiResponseInterface<IncomeInterface[]>>(
      BACKEND_API_ENDPOINTS.INCOMES_API_ENDPOINT,
      { params: body }
    )

    return {
      data: response.data.data ?? [],
      pagination: response.data.pagination,
    }
  },

  getIncomeById: async (id: number) => {
    const response = await api.get<ApiResponseInterface<IncomeInterface>>(
      `${BACKEND_API_ENDPOINTS.INCOMES_API_ENDPOINT}/${id}`
    )
    return response.data.data
  },

  createIncome: async (data: IncomeFormInterface) => {
    const response = await api.post<ApiResponseInterface<IncomeInterface>>(
      BACKEND_API_ENDPOINTS.INCOMES_API_ENDPOINT,
      data
    )
    return response.data.data
  },

  updateIncome: async (id: number, data: Partial<IncomeFormInterface>) => {
    const response = await api.put<ApiResponseInterface<IncomeInterface>>(
      `${BACKEND_API_ENDPOINTS.INCOMES_API_ENDPOINT}/${id}`,
      data
    )
    return response.data.data
  },

  deleteIncome: async (id: number) => {
    await api.delete(`${BACKEND_API_ENDPOINTS.INCOMES_API_ENDPOINT}/${id}`)
  },
}
