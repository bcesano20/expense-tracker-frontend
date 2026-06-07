import { useState, useEffect } from 'react'

import type { AccountInterface } from '../types'
import { accountService } from '../services/accountService'

export const useAccounts = () => {
  const [accounts, setAccounts] = useState<AccountInterface[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const data = await accountService.getAccounts()
        setAccounts(data ?? [])
      } catch {
        setError('Error al cargar las cuentas')
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [])

  const activeAccount = accounts[0] ?? null

  return { accounts, activeAccount, loading, error }
}
