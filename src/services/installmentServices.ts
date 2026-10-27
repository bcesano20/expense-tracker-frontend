import api from './api'
import type {
  ApiResponseInterface,
  DueInstallmentsInterface,
  PayInstallmentsResultInterface,
} from '../types'
import { BACKEND_API_ENDPOINTS, ERROR_MESSAGES } from '../helpers/constants'
import { rethrowWithApiMessage } from '../helpers/utils'

export const installmentsService = {
  // Preview of what would be paid today. The month is decided by the X-Timezone header
  getDueInstallments: async (accountId: number) => {
    const response = await api.get<ApiResponseInterface<DueInstallmentsInterface>>(
      BACKEND_API_ENDPOINTS.INSTALLMENTS_DUE_ENDPOINT,
      { params: { accountId } }
    )
    if (!response.data.data) throw new Error(ERROR_MESSAGES.INSTALLMENTS_LOAD_ERROR)
    return response.data.data
  },

  // Pays EVERY overdue installment of the account and takes the total from the wallet (if any).
  // `expectedTotal` is the total the user confirmed: if it changed, the backend answers a 409.
  payInstallments: async (accountId: number, expectedTotal: string) => {
    try {
      const response = await api.post<ApiResponseInterface<PayInstallmentsResultInterface>>(
        BACKEND_API_ENDPOINTS.INSTALLMENTS_PAY_ENDPOINT,
        { accountId, expectedTotal }
      )
      return response.data.data
    } catch (err: unknown) {
      return rethrowWithApiMessage(err, ERROR_MESSAGES.PAY_INSTALLMENTS_ERROR)
    }
  },
}
