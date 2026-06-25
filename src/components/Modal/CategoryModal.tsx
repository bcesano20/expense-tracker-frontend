import { useState } from 'react'

import type { CategoryFormInterface, CategoryInterface } from '../../types'
import { ERROR_MESSAGES } from '../../helpers/constants'
import { Button, Input } from '../index'

interface CategoryModalProps {
  isOpen: boolean
  category?: CategoryInterface | null
  onClose: () => void
  onSubmit: (data: CategoryFormInterface) => Promise<void>
  loading?: boolean
}

const DEFAULT_CATEGORY: CategoryFormInterface = {
  name: '',
  color: '#22c55e',
}

export const CategoryModal = ({
  isOpen,
  category,
  onClose,
  onSubmit,
  loading = false,
}: CategoryModalProps) => {
  const [formData, setFormData] = useState<CategoryFormInterface>(
    category ? { name: category.name, color: category.color } : DEFAULT_CATEGORY
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = ERROR_MESSAGES.FIELD_REQUIRED
    if (!formData.color) newErrors.color = ERROR_MESSAGES.FIELD_REQUIRED
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validate()) return
    try {
      await onSubmit(formData)
      onClose()
    } catch {
      setErrors({
        submit: category
          ? ERROR_MESSAGES.CATEGORY_UPDATE_ERROR
          : ERROR_MESSAGES.CATEGORY_CREATION_ERROR,
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full">
        <div className="border-b p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {category ? 'Editar Categoría' : 'Nueva Categoría'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.submit && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">{errors.submit}</div>
          )}

          <Input
            label="Nombre *"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ej: Viajes, Mascota..."
            error={errors.name}
          />

          <div>
            <Input
              label="Color *"
              type="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              error={errors.color}
              className="w-12 h-10 cursor-pointer"
            />
            <span className="text-sm text-gray-500 mt-1 block">{formData.color}</span>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" loading={loading} className="flex-1">
              {category ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
