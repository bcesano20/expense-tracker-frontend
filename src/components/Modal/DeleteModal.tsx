import { useState } from 'react'

import { Button } from '../index'
import { ERROR_MESSAGES } from '../../helpers/constants'

interface DeleteModalProps {
  isOpen: boolean
  title: string
  description?: string
  onConfirm: () => Promise<void>
  onClose: () => void
}

export const DeleteModal = ({
  isOpen,
  title,
  description,
  onConfirm,
  onClose,
}: DeleteModalProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleConfirm = async () => {
    setError(null)
    setLoading(true)
    try {
      await onConfirm()
      onClose()
    } catch {
      setError(ERROR_MESSAGES.DELETE_GENERIC_ERROR)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (loading) return
    setError(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">{title}</h2>
        {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm mb-4">{error}</div>
        )}

        <div className="flex gap-3 justify-end mt-4">
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="danger" loading={loading} onClick={handleConfirm}>
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  )
}
