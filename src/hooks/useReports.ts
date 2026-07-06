import { useCallback, useState } from 'react'

import { ERROR_MESSAGES } from '../helpers/constants'
import type {
  ResumeDataInterface,
  BudgetStatusReportInterface,
  IncomeRatioReportInterface,
  AccountPeriodRequestInterface,
} from '../types'
import { reportsService } from '../services/reportServices'

export const useReports = () => {
  const [data, setData] = useState<ResumeDataInterface | null>(null)
  const [budgetStatus, setBudgetStatus] = useState<BudgetStatusReportInterface | null>(null)
  const [incomeRatio, setIncomeRatio] = useState<IncomeRatioReportInterface | null>(null)
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

  const fetchBudgetStatus = useCallback(async (request: AccountPeriodRequestInterface) => {
    try {
      setLoading(true)
      setError(null)
      setBudgetStatus(null)
      const response = await reportsService.getBudgetStatus(request)
      setBudgetStatus(response ?? null)
    } catch {
      setError(ERROR_MESSAGES.REPORTS_LOAD_ERROR)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchIncomeRatio = useCallback(async (request: AccountPeriodRequestInterface) => {
    try {
      setLoading(true)
      setError(null)
      const response = await reportsService.getIncomeRatio(request)
      setIncomeRatio(response ?? null)
    } catch {
      setError(ERROR_MESSAGES.REPORTS_LOAD_ERROR)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    data,
    budgetStatus,
    incomeRatio,
    loading,
    error,
    fetchSummary,
    fetchBudgetStatus,
    fetchIncomeRatio,
  }
}
