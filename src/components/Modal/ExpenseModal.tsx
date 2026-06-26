import { useState } from 'react'

import type { CardInterface, CategoryInterface, ExpenseInterface } from '../../types'
import { Button, Input, Select } from '../index'

interface ExpenseModalProps {
  isOpen: boolean
  expense?: ExpenseInterface | null
  onClose: () => void
  onSubmit: (data: Partial<ExpenseInterface>) => Promise<void>
  loading?: boolean
  categories?: CategoryInterface[]
  cards?: CardInterface[]
  onCreateCategory?: () => void
  onEditCategory?: (category: CategoryInterface) => void
}

export const ExpenseModal = ({
  isOpen,
  expense,
  onClose,
  onSubmit,
  loading = false,
  categories = [],
  cards = [],
  onCreateCategory,
  onEditCategory,
}: ExpenseModalProps) => {
  const normalizedPaymentMethod = expense?.paymentMethod?.startsWith('card')
    ? 'card'
    : (expense?.paymentMethod ?? 'cash')

  const [formData, setFormData] = useState<Partial<ExpenseInterface>>(
    expense
      ? {
          description: expense.description,
          amount: expense.amount,
          date: expense.date,
          categoryId: expense.categoryId,
          paymentMethod: normalizedPaymentMethod,
        }
      : {
          description: '',
          amount: 0,
          date: new Date().toISOString().split('T')[0],
          categoryId: undefined,
          paymentMethod: 'cash',
        }
  )

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedCardId, setSelectedCardId] = useState<number | undefined>(
    expense?.card?.card?.id
  )
  const [installmentsCount, setInstallmentsCount] = useState<number>(
    expense?.installments?.[0]?.totalInstallments ?? 1
  )

  const selectedCard = cards.find(c => c.id === selectedCardId) ?? null
  const showInstallments = formData.paymentMethod === 'card' && selectedCard?.type === 'credit'

  const paymentMethods = [
    { value: 'cash', label: '💵 Efectivo' },
    { value: 'card', label: '💳 Tarjeta' },
    { value: 'transfer', label: '🏦 Transferencia' },
    { value: 'other', label: '📱 Otro' },
  ]

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
    if (!formData.categoryId) {
      newErrors.category = 'La categoría es requerida'
    }
    if (formData.paymentMethod === 'card' && !selectedCardId) {
      newErrors.card = 'Seleccioná una tarjeta'
    }
    if (
      selectedCard?.type === 'debit' &&
      selectedCard.balance !== undefined &&
      formData.amount !== undefined &&
      formData.amount > selectedCard.balance
    ) {
      newErrors.amount = `El monto supera el saldo disponible ($${selectedCard.balance.toFixed(2)})`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === 'amount') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }

    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))
    setSelectedCardId(undefined)
  }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      await onSubmit({
        ...formData,
        cardId: selectedCardId,
        ...(showInstallments && { totalInstallments: installmentsCount }),
      })
      onClose()
    } catch {
      setErrors({ submit: 'Error al guardar el gasto. Intenta de nuevo.' })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.submit && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">{errors.submit}</div>
          )}

          <Input
            label="Descripción *"
            type="text"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            placeholder="Ej: Supermercado, Netflix..."
            error={errors.description}
          />

          <Input
            label="Monto ($) *"
            type="number"
            name="amount"
            value={formData.amount || ''}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            error={errors.amount}
          />

          <Input
            label="Fecha *"
            type="date"
            name="date"
            value={formData.date || ''}
            onChange={handleChange}
            error={errors.date}
          />

          <Select
            label="Categoría *"
            name="categoryId"
            value={formData.categoryId ? String(formData.categoryId) : ''}
            onChange={e => {
              const id = e.target.value ? Number(e.target.value) : undefined
              setFormData(prev => ({ ...prev, categoryId: id }))
              if (errors.category) setErrors(prev => ({ ...prev, category: '' }))
            }}
            error={errors.category}
            labelActions={
              <div className="flex gap-1">
                {onCreateCategory && (
                  <button
                    type="button"
                    onClick={onCreateCategory}
                    title="Nueva categoría"
                    className="text-blue-600 hover:text-blue-800 text-lg leading-none px-1"
                  >
                    +
                  </button>
                )}
                {onEditCategory && formData.categoryId && (
                  <button
                    type="button"
                    onClick={() => {
                      const selected = categories.find(c => c.id === formData.categoryId)
                      if (selected) onEditCategory(selected)
                    }}
                    title="Editar categoría"
                    className="text-gray-500 hover:text-gray-700 text-sm leading-none px-1"
                  >
                    ✏️
                  </button>
                )}
              </div>
            }
          >
            {categories.length === 0 ? (
              <option value="" disabled>
                Sin categorías — crea una con el botón +
              </option>
            ) : (
              categories.map(cat => (
                <option key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </option>
              ))
            )}
          </Select>

          <Select
            label="Medio de Pago *"
            name="paymentMethod"
            value={formData.paymentMethod || 'cash'}
            onChange={handlePaymentMethodChange}
          >
            {paymentMethods.map(method => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </Select>

          {formData.paymentMethod === 'card' && (
            <div className="space-y-1">
              <Select
                label="Tarjeta *"
                value={selectedCardId ? String(selectedCardId) : ''}
                onChange={e => {
                  const id = e.target.value ? Number(e.target.value) : undefined
                  setSelectedCardId(id)
                  if (errors.card) setErrors(prev => ({ ...prev, card: '' }))
                }}
                error={errors.card}
              >
                <option value="">Seleccioná una tarjeta</option>
                {cards.map(card => (
                  <option key={card.id} value={String(card.id)}>
                    {card.name} — {card.bank} ({card.type === 'credit' ? 'Crédito' : 'Débito'})
                  </option>
                ))}
              </Select>
              {selectedCard?.type === 'debit' && selectedCard.balance !== undefined && (
                <p className="text-xs text-gray-500">
                  Saldo disponible: ${selectedCard.balance.toFixed(2)}
                </p>
              )}
            </div>
          )}

          {showInstallments && (
            <>
              <Select
                label="Número de Cuotas"
                value={installmentsCount}
                onChange={e => setInstallmentsCount(parseInt(e.target.value))}
              >
                {[1, 2, 3, 4, 6, 9, 12].map(num => (
                  <option key={num} value={num}>
                    {num} cuota{num > 1 ? 's' : ''}
                  </option>
                ))}
              </Select>
              {installmentsCount > 1 && (
                <p className="text-xs text-gray-500 -mt-2">
                  Monto por cuota: ${(formData.amount! / installmentsCount).toFixed(2)}
                </p>
              )}
            </>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" loading={loading} className="flex-1">
              {expense ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
