import { useState, useCallback } from 'react'

import type { ClosingPreviewInterface, MonthClosingInterface } from '../types'
import { ERROR_MESSAGES } from '../helpers/constants'
import { monthClosingService } from '../services/monthClosingServices'

export const useMonthClosing = (accountId: number | null) => {
  const [closings, setClosings] = useState<MonthClosingInterface[]>([])
  // null while it is loading (or if the load failed)
  const [preview, setPreview] = useState<ClosingPreviewInterface | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // The closed months, to know which ones can't be closed again
  const fetchClosings = useCallback(async () => {
    if (!accountId) return
    try {
      setError(null)
      const data = await monthClosingService.getMonthClosings(accountId)
      setClosings(data)
    } catch {
      setError(ERROR_MESSAGES.MONTH_CLOSINGS_LOAD_ERROR)
    }
  }, [accountId])

  // Whether the month can be closed (and why not) and its savings, to show before confirming
  const fetchPreview = useCallback(
    async (month: number, year: number) => {
      if (!accountId) return
      try {
        setLoading(true)
        setError(null)
        setPreview(null)
        const data = await monthClosingService.getClosingPreview({ accountId, month, year })
        setPreview(data)
      } catch {
        setError(ERROR_MESSAGES.CLOSING_PREVIEW_ERROR)
      } finally {
        setLoading(false)
      }
    },
    [accountId]
  )

  // A failure is thrown to the modal, which shows it inline: `error` is only for loading
  const closeMonth = useCallback(
    async (month: number, year: number) => {
      if (!accountId) return null
      return monthClosingService.closeMonth({ accountId, month, year })
    },
    [accountId]
  )

  return {
    // States
    closings,
    preview,
    loading,
    error,

    // Functions
    fetchClosings,
    fetchPreview,
    closeMonth,
  }
}
