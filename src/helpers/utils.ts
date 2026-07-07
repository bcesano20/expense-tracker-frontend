export const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export const formatCurrency = (amount: number, currency = 'ARS') =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency }).format(amount)

export const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    Comida: 'bg-orange-100 text-orange-800',
    Entretenimiento: 'bg-purple-100 text-purple-800',
    Transporte: 'bg-blue-100 text-blue-800',
    Salud: 'bg-green-100 text-green-800',
    Electrónica: 'bg-indigo-100 text-indigo-800',
    Otro: 'bg-gray-100 text-gray-800',
  }
  return colors[category] || 'bg-gray-100 text-gray-800'
}

export const getPaymentMethodIcon = (method: string) => {
  const icons: Record<string, string> = {
    cash: '💵',
    card: '💳',
    transfer: '🏦',
    other: '📱',
  }
  return icons[method] || '❓'
}
