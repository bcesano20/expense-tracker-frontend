import { BACKEND_API_ENDPOINTS } from '../helpers/constants'
import type {
  ApiResponseInterface,
  ResumeDataInterface,
  MonthlyReportDataInterface,
  CategoryAnalysisDataInterface,
  ComparasionDataInterface,
  CardToPayInterface,
  BudgetStatusReportInterface,
  AccountPeriodRequestInterface,
  IncomeRatioReportInterface,
} from '../types'
import api from './api'

export const reportsService = {
  // Quick dashboard summary
  getSummary: async (accountId: number) => {
    const response = await api.get<ApiResponseInterface<ResumeDataInterface>>(
      `${BACKEND_API_ENDPOINTS.GET_SUMMARY_REPORT}?accountId=${accountId}`
    )
    return response.data.data
  },

  // Full monthly report
  getMonthlyReport: async (accountId: number, month: number, year: number) => {
    const response = await api.get<ApiResponseInterface<MonthlyReportDataInterface>>(
      `${BACKEND_API_ENDPOINTS.GET_MONTHLY_REPORT}?accountId=${accountId}&month=${month}&year=${year}`
    )
    return response.data.data
  },

  // Full category report
  getCategoryAnalysis: async (accountId: number, months: number = 3) => {
    const response = await api.get<ApiResponseInterface<CategoryAnalysisDataInterface>>(
      `${BACKEND_API_ENDPOINTS.GET_CATEGORIES_REPORT}?accountId=${accountId}&months=${months}`
    )
    return response.data.data
  },

  // Get the full cards details
  getCardDetails: async (accountId: number, month: number, year: number) => {
    const response = await api.get<ApiResponseInterface<{ cards: CardToPayInterface[] }>>(
      `${BACKEND_API_ENDPOINTS.GET_CARDS_REPORT}?accountId=${accountId}&month=${month}&year=${year}`
    )
    return response.data.data?.cards || []
  },

  // Comparison with the previous month
  getComparative: async (accountId: number, month: number, year: number) => {
    const response = await api.get<ApiResponseInterface<ComparasionDataInterface>>(
      `${BACKEND_API_ENDPOINTS.GET_COMPARISON_REPORT}?accountId=${accountId}&month=${month}&year=${year}`
    )
    return response.data.data
  },

  // Budget status for a category in a given period
  getBudgetStatus: async (data: AccountPeriodRequestInterface) => {
    const response = await api.get<ApiResponseInterface<BudgetStatusReportInterface>>(
      `${BACKEND_API_ENDPOINTS.GET_BUDGET_STATUS_REPORT}?accountId=${data.accountId}&categoryId=${data.categoryId}&month=${data.month}&year=${data.year}`
    )
    return response.data.data
  },

  // Income vs expenses ratio for a given period
  getIncomeRatio: async (data: AccountPeriodRequestInterface) => {
    const response = await api.get<ApiResponseInterface<IncomeRatioReportInterface>>(
      `${BACKEND_API_ENDPOINTS.GET_INCOME_RATIO_REPORT}?accountId=${data.accountId}&month=${data.month}&year=${data.year}`
    )
    return response.data.data
  },
}
