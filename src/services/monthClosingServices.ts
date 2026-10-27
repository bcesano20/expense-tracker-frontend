import type {
  AccountPeriodRequestInterface,
  ApiResponseInterface,
  ClosingPreviewInterface,
  MonthClosingInterface,
  MonthSavingsInterface,
} from '../types'
import { BACKEND_API_ENDPOINTS, ERROR_MESSAGES } from '../helpers/constants'
import { rethrowWithApiMessage } from '../helpers/utils'
import api from './api'

// The backend sends the Decimal(12,2) amounts as strings
type MonthSavingsResponse = Omit<MonthSavingsInterface, 'amount'> & { amount: string }

type ClosingPreviewResponse = Omit<ClosingPreviewInterface, 'savings'> & {
  savings: MonthSavingsResponse
}

type MonthClosingResponse = Omit<MonthClosingInterface, 'savings'> & { savings: string }

// Up to 9999999999.99 fits a number without losing precision, and these amounts are only displayed
const toClosing = (closing: MonthClosingResponse): MonthClosingInterface => ({
  ...closing,
  savings: Number(closing.savings),
})

const toPreview = (preview: ClosingPreviewResponse): ClosingPreviewInterface => ({
  ...preview,
  savings: { ...preview.savings, amount: Number(preview.savings.amount) },
})

export const monthClosingService = {
  // The closed months of the account, newest first
  getMonthClosings: async (accountId: number) => {
    const response = await api.get<ApiResponseInterface<MonthClosingResponse[]>>(
      BACKEND_API_ENDPOINTS.MONTH_CLOSINGS_API_ENDPOINT,
      { params: { accountId } }
    )
    return (response.data.data ?? []).map(toClosing)
  },

  // Can the month be closed (and why not), and what are its savings. Evaluated in the timezone
  // sent in the X-Timezone header
  getClosingPreview: async ({ accountId, month, year }: AccountPeriodRequestInterface) => {
    const response = await api.get<ApiResponseInterface<ClosingPreviewResponse>>(
      BACKEND_API_ENDPOINTS.MONTH_CLOSINGS_PREVIEW_ENDPOINT,
      { params: { accountId, month, year } }
    )
    if (!response.data.data) throw new Error(ERROR_MESSAGES.CLOSING_PREVIEW_ERROR)
    return toPreview(response.data.data)
  },

  // Irreversible: stores the savings and locks the month. The wallet is not touched
  closeMonth: async ({ accountId, month, year }: AccountPeriodRequestInterface) => {
    try {
      const response = await api.post<ApiResponseInterface<MonthClosingResponse>>(
        BACKEND_API_ENDPOINTS.MONTH_CLOSINGS_API_ENDPOINT,
        { accountId, month, year }
      )
      return response.data.data ? toClosing(response.data.data) : null
    } catch (err: unknown) {
      return rethrowWithApiMessage(err, ERROR_MESSAGES.CLOSE_MONTH_ERROR)
    }
  },
}
