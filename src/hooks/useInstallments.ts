import { useState, useCallback } from 'react'

import type { DueInstallmentsInterface } from '../types'
import { ERROR_MESSAGES } from '../helpers/constants'
import { installmentsService } from '../services/installmentServices'

export const useInstallments = (accountId: number | null) => {
  // null while it is loading (or if the load failed)
  const [dueInstallments, setDueInstallments] = useState<DueInstallmentsInterface | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Get what would be paid today, to show it to the user before they confirm
  const fetchDueInstallments = useCallback(async () => {
    if (!accountId) return
    try {
      setLoading(true)
      setError(null)
      setDueInstallments(null)
      const data = await installmentsService.getDueInstallments(accountId)
      setDueInstallments(data)
    } catch {
      setError(ERROR_MESSAGES.INSTALLMENTS_LOAD_ERROR)
    } finally {
      setLoading(false)
    }
  }, [accountId])

  // Pay the installments the user confirmed. A failure is thrown to the modal, which shows it
  // inline: `error` is only for loading the preview
  const payInstallments = useCallback(
    async (expectedTotal: string) => {
      if (!accountId) return null
      return installmentsService.payInstallments(accountId, expectedTotal)
    },
    [accountId]
  )

  return {
    // States
    dueInstallments,
    loading,
    error,

    // Functions
    fetchDueInstallments,
    payInstallments,
  }
}
