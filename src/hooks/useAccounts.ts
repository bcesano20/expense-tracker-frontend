import { useState, useCallback } from 'react'

import { ERROR_MESSAGES } from '../helpers/constants'
import type { AccountInterface, AccountServiceInterface } from '../types'
import { accountService } from '../services/accountService'

export const useAccounts = () => {
  const [accounts, setAccounts] = useState<AccountInterface[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await accountService.getAccounts()
      setAccounts(data ?? [])
    } catch (err) {
      setError(ERROR_MESSAGES.ACCOUNTS_LOAD_ERROR)
    } finally {
      setLoading(false)
    }
  }, [])

  const createAccount = useCallback(async (data: AccountServiceInterface) => {
    try {
      setLoading(true)
      setError(null)
      const newAccount = await accountService.createAccount({
        name: data.name,
        currency: data.currency,
      })
      if (newAccount) {
        setAccounts(prev => [newAccount, ...prev])
      }
      return newAccount
    } catch (err) {
      setError(ERROR_MESSAGES.CREATE_ACCOUNT_ERROR)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateAccount = useCallback(async (id: number, data: AccountServiceInterface) => {
    try {
      setLoading(true)
      setError(null)
      const updated = await accountService.updateAccount(id, data)
      if (updated) {
        setAccounts(prev => prev.map(acc => (acc.id === id ? updated : acc)))
      }
      return updated
    } catch (err) {
      setError(ERROR_MESSAGES.UPDATE_ACCOUNT_ERROR)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteAccount = useCallback(async (id: number) => {
    try {
      setLoading(true)
      setError(null)
      await accountService.deleteAccount(id)
      setAccounts(prev => prev.filter(acc => acc.id !== id))
    } catch (err) {
      setError(ERROR_MESSAGES.DELETE_ACCOUNT_ERROR)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    accounts,
    loading,
    error,
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
  }
}
