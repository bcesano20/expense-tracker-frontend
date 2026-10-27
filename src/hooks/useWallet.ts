import { useState, useCallback } from 'react'

import type { WalletSummaryInterface } from '../types'
import { ERROR_MESSAGES } from '../helpers/constants'
import { walletService } from '../services/walletServices'

export const useWallet = (accountId: number | null) => {
  // null while it is loading (or if the load failed); `hasWallet` says if the account has one
  const [walletSummary, setWalletSummary] = useState<WalletSummaryInterface | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Get the wallet summary of the account
  const fetchWallet = useCallback(async () => {
    if (!accountId) return
    try {
      setLoading(true)
      setError(null)
      // Avoid showing the wallet of the previous account while the new one is loading
      setWalletSummary(null)
      const data = await walletService.getWalletByAccount(accountId)
      setWalletSummary(data)
    } catch {
      setError(ERROR_MESSAGES.WALLET_LOAD_ERROR)
    } finally {
      setLoading(false)
    }
  }, [accountId])

  // Activate the wallet of the account, with ZERO as the initial balance
  const createWallet = useCallback(async () => {
    if (!accountId) return
    try {
      setLoading(true)
      setError(null)
      const data = await walletService.createWallet(accountId)
      setWalletSummary(data)
    } catch (err) {
      setError(ERROR_MESSAGES.WALLET_CREATE_ERROR)
      throw err
    } finally {
      setLoading(false)
    }
  }, [accountId])

  // Manual edit of the money amount of the wallet (`balance` is a validated decimal string)
  const updateWalletBalance = useCallback(
    async (balance: string) => {
      if (!accountId) return
      try {
        setLoading(true)
        setError(null)
        const data = await walletService.updateWallet(accountId, balance)
        setWalletSummary(data)
      } catch (err) {
        setError(ERROR_MESSAGES.WALLET_UPDATE_ERROR)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [accountId]
  )

  return {
    // States
    walletSummary,
    loading,
    error,

    // Functions
    fetchWallet,
    createWallet,
    updateWalletBalance,
  }
}
