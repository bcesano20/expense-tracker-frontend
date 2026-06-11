import { useCallback, useState } from 'react'

import { type ResumeDataInterface } from '../types'
import { reportsService } from '../services/reportServices'
import { ERROR_MESSAGES } from '../helpers/constants'

export const useReports = () => {
  const [data, setData] = useState<ResumeDataInterface | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSummary = useCallback(async (accountId: number) => {
    try {
      setLoading(true)
      setError(null)

      const response = await reportsService.getSummary(accountId)
      setData(response ?? null)
    } catch {
      setError(ERROR_MESSAGES.REPORTS_LOAD_ERROR)
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, loading, error, fetchSummary }
}
