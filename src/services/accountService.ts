import api from './api'

import { BACKEND_API_ENDPOINTS } from '../helpers/constants'
import type { AccountInterface, ApiResponseInterface } from '../types'

export const accountService = {
  getAccounts: async () => {
    const response = await api.get<ApiResponseInterface<AccountInterface[]>>(
      BACKEND_API_ENDPOINTS.ACCOUNTS
    )
    return response.data.data
  },
}
