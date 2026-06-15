import api from './api'

import { BACKEND_API_ENDPOINTS } from '../helpers/constants'
import type { AccountInterface, AccountServiceInterface, ApiResponseInterface } from '../types'

export const accountService = {
  getAccounts: async () => {
    const response = await api.get<ApiResponseInterface<AccountInterface[]>>(
      BACKEND_API_ENDPOINTS.ACCOUNTS
    )
    return response.data.data
  },

  getAccountById: async (id: number) => {
    const response = await api.get<ApiResponseInterface<AccountInterface>>(
      `${BACKEND_API_ENDPOINTS.ACCOUNTS}/${id}`
    )
    return response.data.data
  },

  createAccount: async (data: AccountServiceInterface) => {
    const response = await api.post<ApiResponseInterface<AccountInterface>>(
      `${BACKEND_API_ENDPOINTS.ACCOUNTS}`,
      data
    )
    return response.data.data
  },

  updateAccount: async (id: number, data: AccountServiceInterface) => {
    const response = await api.put<ApiResponseInterface<AccountInterface>>(
      `${BACKEND_API_ENDPOINTS.ACCOUNTS}/${id}`,
      data
    )
    return response.data.data
  },

  deleteAccount: async (id: number) => {
    await api.delete(`${BACKEND_API_ENDPOINTS.ACCOUNTS}/${id}`)
  },
}
