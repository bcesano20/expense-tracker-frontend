export const formatDate = (dateString: string) => {
  const [year, month, day] = dateString.split('T')[0].split('-')
  return `${day}/${month}/${year}`
}

export const formatCurrency = (amount: number, currency = 'ARS') =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency }).format(amount)

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
