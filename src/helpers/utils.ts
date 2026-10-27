import type { MonthClosingInterface } from '../types'

export const formatDate = (dateString: string) => {
  const [year, month, day] = dateString.split('T')[0].split('-')
  return `${day}/${month}/${year}`
}

export const formatCurrency = (amount: number, currency = 'ARS') =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency }).format(amount)

// Whether the month is over, i.e. it is before the current one. It uses the browser's timezone,
// the same one sent in X-Timezone, so it matches when the backend lets a month be closed
export const hasMonthEnded = (month: number, year: number, now = new Date()) =>
  year * 12 + month < now.getFullYear() * 12 + now.getMonth() + 1

export const isMonthClosed = (closings: MonthClosingInterface[], month: number, year: number) =>
  closings.some(closing => closing.month === month && closing.year === year)

// Business errors of the backend (e.g. INSUFFICIENT_FUNDS: "... Faltan 120.50") come in `message`
export const rethrowWithApiMessage = (err: unknown, fallback: string): never => {
  const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
  throw new Error(message ?? fallback, { cause: err })
}

export const getPaymentMethodIcon = (method: string) => {
  const icons: Record<string, string> = {
    CASH: '💵',
    CREDIT: '💳',
    DEBIT: '💳',
    TRANSFER: '🏦',
    OTHER: '📱',
  }
  return icons[method] || '❓'
}
