import { useState, useCallback } from 'react'

import { ERROR_MESSAGES } from '../helpers/constants'
import type {
  MonthlyReportDataInterface,
  ComparasionDataInterface,
  CardToPayInterface,
} from '../types'
import { reportsService } from '../services/reportServices'

export const useMonthlyReport = (accountId: number) => {
  const [report, setReport] = useState<MonthlyReportDataInterface | null>(null)
  const [comparative, setComparative] = useState<ComparasionDataInterface | null>(null)
  const [creditCardDetails, SetCreditCardDetails] = useState<CardToPayInterface[] | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [comparativeError, setComparativeError] = useState<string | null>(null)
  const [creditCardDetailError, setCreditCardDetailError] = useState<string | null>(null)

  const fetchMonthlyReport = useCallback(
    async (month: number, year: number) => {
      try {
        setLoading(true)
        setError(null)
        const data = await reportsService.getMonthlyReport(accountId, month, year)
        setReport(data ?? null)
      } catch {
        setError(ERROR_MESSAGES.MONTHLY_REPORT_ERROR)
      } finally {
        setLoading(false)
      }
    },
    [accountId]
  )

  const fetchComparative = useCallback(
    async (month: number, year: number) => {
      try {
        setComparativeError(null)
        const data = await reportsService.getComparative(accountId, month, year)
        setComparative(data ?? null)
      } catch {
        setComparativeError(ERROR_MESSAGES.COMPARISION_ERROR)
      }
    },
    [accountId]
  )

  const fetchCreditCardAmountToPay = useCallback(
    async (month: number, year: number) => {
      try {
        setLoading(false)
        setCreditCardDetailError(null)
        const data = await reportsService.getCardDetails(accountId, month, year)
        SetCreditCardDetails(data ?? null)
      } catch {
        setComparativeError(ERROR_MESSAGES.CARD_DETAIL_ERROR)
      }
    },
    [accountId]
  )

  return {
    report,
    comparative,
    creditCardDetails,
    loading,
    error,
    comparativeError,
    creditCardDetailError,
    fetchMonthlyReport,
    fetchComparative,
    fetchCreditCardAmountToPay,
  }
}
