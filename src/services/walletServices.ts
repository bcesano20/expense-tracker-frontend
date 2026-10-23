import api from './api'
import type { WalletSummaryInterface, ApiResponseInterface } from '../types'
import { BACKEND_API_ENDPOINTS, ERROR_MESSAGES } from '../helpers/constants'

// The backend sends the Decimal(12,2) amounts as strings (and walletBalance as null without wallet)
type WalletSummaryResponse = Omit<
  WalletSummaryInterface,
  'walletBalance' | 'debitBalance' | 'totalBalance'
> & {
  walletBalance: string | null
  debitBalance: string
  totalBalance: string
}

// Up to 9999999999.99 fits a number without losing precision, and these amounts are only displayed
const toSummary = (
  response: ApiResponseInterface<WalletSummaryResponse>
): WalletSummaryInterface => {
  const data = response.data
  if (!data) throw new Error(ERROR_MESSAGES.WALLET_LOAD_ERROR)

  return {
    ...data,
    walletBalance: data.walletBalance === null ? null : Number(data.walletBalance),
    debitBalance: Number(data.debitBalance),
    totalBalance: Number(data.totalBalance),
  }
}

// `balance` travels as a string so the backend can parse it as an exact Decimal, never a float
export const walletService = {
  // Answers hasWallet: false (not a 404) when the account doesn't have a wallet yet
  getWalletByAccount: async (accountId: number) => {
    const response = await api.get<ApiResponseInterface<WalletSummaryResponse>>(
      `${BACKEND_API_ENDPOINTS.WALLET_API_ENDPOINT}/${accountId}`
    )
    return toSummary(response.data)
  },

  // The backend rejects a request without balance, so the initial one is always sent
  createWallet: async (accountId: number, balance = '0') => {
    const response = await api.post<ApiResponseInterface<WalletSummaryResponse>>(
      `${BACKEND_API_ENDPOINTS.WALLET_API_ENDPOINT}/${accountId}`,
      { balance }
    )
    return toSummary(response.data)
  },

  // Sets the new balance (a correction, not an income). 404 if the account has no wallet
  updateWallet: async (accountId: number, balance: string) => {
    const response = await api.put<ApiResponseInterface<WalletSummaryResponse>>(
      `${BACKEND_API_ENDPOINTS.WALLET_API_ENDPOINT}/${accountId}`,
      { balance }
    )
    return toSummary(response.data)
  },
}
