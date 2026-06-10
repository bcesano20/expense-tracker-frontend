import { useState, useCallback } from 'react'

import { ERROR_MESSAGES } from '../helpers/constants'
import type { MonthlyReportDataInterface, ComparasionDataInterface } from '../types'
import { reportsService } from '../services/reportServices'

export const useMonthlyReport = (accountId: number) => {
  const [report, setReport] = useState<MonthlyReportDataInterface | null>(null)
  const [comparative, setComparative] = useState<ComparasionDataInterface | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Get the monthly report
  const fetchMonthlyReport = useCallback(
    async (month: number, year: number) => {
      try {
        setLoading(true)
        setError(null)
        const data = await reportsService.getMonthlyReport(accountId, month, year)
        setReport(data ?? null)
      } catch (err) {
        setError(ERROR_MESSAGES.MONTHLY_REPORT_ERROR)
        // eslint-disable-next-line no-console
        console.error(err)
      } finally {
        setLoading(false)
      }
    },
    [accountId]
  )

  // Get the comparision or comparative
  const fetchComparative = useCallback(async () => {
    try {
      setError(null)
      const data = await reportsService.getComparative(accountId)
      setComparative(data ?? null)
    } catch (err) {
      setError(ERROR_MESSAGES.COMPARISION_ERROR)
      // eslint-disable-next-line no-console
      console.error(err)
    }
  }, [accountId])

  return {
    report,
    comparative,
    loading,
    error,
    fetchMonthlyReport,
    fetchComparative,
  }
}
