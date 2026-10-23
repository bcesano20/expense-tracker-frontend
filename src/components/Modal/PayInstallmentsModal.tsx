import { useState } from 'react'

import type { DueInstallmentsInterface } from '../../types'
import { ERROR_MESSAGES, MONTHS } from '../../helpers/constants'
import { formatCurrency } from '../../helpers/utils'
import { Button } from '../index'

interface PayInstallmentsModalProps {
  isOpen: boolean
  dueInstallments: DueInstallmentsInterface | null
  onConfirm: (expectedTotal: string) => Promise<void>
  onClose: () => void
  currency?: string
  loading?: boolean
  loadError?: string | null
}

export const PayInstallmentsModal = ({
  isOpen,
  currency,
  dueInstallments,
  onConfirm,
  onClose,
  loading = false,
  loadError = null,
}: PayInstallmentsModalProps) => {
  const [paying, setPaying] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleClose = () => {
    if (paying) return
    setError(null)
    onClose()
  }

  const handleConfirm = async () => {
    if (!dueInstallments) return
    setError(null)
    setPaying(true)
    try {
      await onConfirm(dueInstallments.total)
      onClose()
    } catch (err) {
      // The message comes from the backend (insufficient funds, the installments changed...)
      setError(err instanceof Error ? err.message : ERROR_MESSAGES.PAY_INSTALLMENTS_ERROR)
    } finally {
      setPaying(false)
    }
  }

  const renderContent = () => {
    if (!dueInstallments) {
      return (
        <p className="text-sm text-gray-500 text-center py-4">
          {loadError ?? 'Cargando cuotas...'}
        </p>
      )
    }

    const { count, total, month, year } = dueInstallments

    if (count === 0) {
      // An installment becomes payable once the month of its payment is over
      const nextMonth = month === 12 ? 1 : month + 1
      const nextYear = month === 12 ? year + 1 : year

      return (
        <div className="space-y-2">
          <p className="text-gray-900">No hay cuotas vencidas para pagar.</p>
          <p className="text-sm text-gray-500">
            Las cuotas de {MONTHS[month - 1].toLowerCase()} {year} se pueden pagar a partir de{' '}
            {MONTHS[nextMonth - 1].toLowerCase()} {nextYear}.
          </p>
        </div>
      )
    }

    return (
      <div className="space-y-2">
        <p className="text-gray-900">
          Se pagarán{' '}
          <strong>
            {count} cuota{count > 1 ? 's' : ''}
          </strong>{' '}
          por <strong>{formatCurrency(Number(total), currency)}</strong>.
        </p>
        <p className="text-sm text-gray-500">
          Son todas las cuotas con vencimiento anterior a {MONTHS[month - 1]} {year}, de todas las
          tarjetas de la cuenta. Si la cuenta tiene billetera, el total se descuenta de ella. Esta
          acción no se puede deshacer.
        </p>
      </div>
    )
  }

  const canPay = dueInstallments !== null && dueInstallments.count > 0

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          {canPay ? '¿Pagar las cuotas vencidas?' : 'Pagar cuotas'}
        </h2>

        {renderContent()}

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm mt-4">{error}</div>
        )}

        <div className="flex gap-3 justify-end mt-4">
          <Button variant="secondary" onClick={handleClose} disabled={paying}>
            {canPay ? 'No' : 'Cerrar'}
          </Button>
          {canPay && (
            <Button loading={paying} disabled={loading} onClick={handleConfirm}>
              Sí, pagar
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
