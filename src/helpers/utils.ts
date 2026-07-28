export const formatDate = (dateString: string) => {
  const [year, month, day] = dateString.split('T')[0].split('-')
  return `${day}/${month}/${year}`
}

export const formatCurrency = (amount: number, currency = 'ARS') =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency }).format(amount)


export const getPaymentMethodIcon = (method: string) => {
  const icons: Record<string, string> = {
    cash: '💵',
    card: '💳',
    transfer: '🏦',
    other: '📱',
  }
  return icons[method] || '❓'
}
