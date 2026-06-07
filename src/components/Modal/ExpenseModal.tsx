import { useState, useEffect } from 'react'

import type { ExpenseInterface } from '../../types'

interface ExpenseModalProps {
  isOpen: boolean
  expense?: ExpenseInterface | null
  onClose: () => void
  onSubmit: (data: Partial<ExpenseInterface>) => Promise<void>
  loading?: boolean
}

export const ExpenseModal = ({
  isOpen,
  expense,
  onClose,
  onSubmit,
  loading = false,
}: ExpenseModalProps) => {
  const [formData, setFormData] = useState<Partial<ExpenseInterface>>({
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    category: 'Otro',
    paymentMethod: 'cash',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [installmentsCount, setInstallmentsCount] = useState<number>(1)
  const [showInstallments, setShowInstallments] = useState<boolean>(false)

  const categories = ['Comida', 'Entretenimiento', 'Transporte', 'Salud', 'Electrónica', 'Otro']

  const paymentMethods = [
    { value: 'cash', label: '💵 Efectivo' },
    { value: 'card', label: '💳 Tarjeta' },
    { value: 'transfer', label: '🏦 Transferencia' },
    { value: 'other', label: '📱 Otro' },
  ]

  // Load the expense data if is an update
  useEffect(() => {
    if (expense) {
      setFormData({
        description: expense.description,
        amount: expense.amount,
        date: expense.date,
        category: expense.category,
        paymentMethod: expense.paymentMethod,
      })
    } else {
      setFormData({
        description: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        category: 'Otro',
        paymentMethod: 'cash',
      })
    }
    setErrors({})
    setInstallmentsCount(1)
    setShowInstallments(false)
  }, [expense, isOpen])

  // Valid form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.description || formData.description.trim() === '') {
      newErrors.description = 'La descripción es requerida'
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'El monto debe ser mayor a 0'
    }

    if (!formData.date) {
      newErrors.date = 'La fecha es requerida'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle Inout changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name === 'amount') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }))
    }

    // Clean field errors
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const method = e.target.value
    setFormData(prev => ({
      ...prev,
      paymentMethod: method,
    }))
    setShowInstallments(method === 'card')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      const dataToSubmit = {
        ...formData,
        ...(showInstallments && { totalInstallments: installmentsCount }),
      }

      await onSubmit(dataToSubmit)
      onClose()
    } catch (error) {
      setErrors({
        submit: 'Error al guardar el gasto. Intenta de nuevo.',
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {expense ? 'Editar Gasto' : 'Crear Nuevo Gasto'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error general */}
          {errors.submit && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">{errors.submit}</div>
          )}

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
            <input
              type="text"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              placeholder="Ej: Supermercado, Netflix..."
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.description
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Monto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monto ($) *</label>
            <input
              type="number"
              name="amount"
              value={formData.amount || ''}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.amount
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
            <input
              type="date"
              name="date"
              value={formData.date || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.date
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
            <select
              name="category"
              value={formData.category || 'Otro'}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Medio de Pago */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Medio de Pago *</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod || 'cash'}
              onChange={handlePaymentMethodChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {paymentMethods.map(method => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>

          {/* Cuotas (solo si es tarjeta) */}
          {showInstallments && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Cuotas
              </label>
              <select
                value={installmentsCount}
                onChange={e => setInstallmentsCount(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[1, 2, 3, 4, 6, 9, 12].map(num => (
                  <option key={num} value={num}>
                    {num} cuota{num > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
              {installmentsCount > 1 && (
                <p className="text-xs text-gray-500 mt-2">
                  Monto por cuota: ${(formData.amount! / installmentsCount).toFixed(2)}
                </p>
              )}
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
            >
              {loading ? 'Guardando...' : expense ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
