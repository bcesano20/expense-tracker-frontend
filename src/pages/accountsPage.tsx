import { useEffect, useState } from 'react'

import type { AccountInterface } from '../types'
import { useAccounts } from '../hooks/useAccounts'
import { Navbar, AccountModal } from '../components'

export const AccountsPage = () => {
  const [activeAccountId, setActiveAccountId] = useState<number | null>(null)
  const [showAccountModal, setShowAccountModal] = useState<boolean>(false)
  const [selectedAccount, setSelectedAccount] = useState<AccountInterface | null>(null)

  // TODO: Add the corresponding states for cards handlers

  const {
    accounts,
    loading: accountsLoading,
    error: accountsError,
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
  } = useAccounts()

  // Load accounts on mount
  useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  // TODO: Add an useEffect to Load the cards when the account change

  const handleCreateAccount = () => {
    setSelectedAccount(null)
    setShowAccountModal(true)
  }

  const handleEditAccount = (account: AccountInterface) => {
    setSelectedAccount(account)
    setShowAccountModal(true)
  }

  const handleDeleteAccount = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta cuenta?')) {
      try {
        await deleteAccount(id)
      } catch {
        // error is set in useAccounts and displayed via accountsError
      }
    }
  }

  // TODO: Add the create, delete and edit cards handler

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Cuentas y Tarjetas</h2>
              <p className="text-gray-600">Gestiona tus cuentas y métodos de pago</p>
            </div>
            <button
              onClick={handleCreateAccount}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              ➕ Nueva Cuenta
            </button>
          </div>
        </div>

        {/* Cuentas */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Mis Cuentas</h3>

          {accountsError && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">{accountsError}</div>
          )}

          {accountsLoading ? (
            <div className="text-gray-500">Cargando cuentas...</div>
          ) : accounts.length === 0 ? (
            <div className="bg-gray-100 p-6 rounded-lg text-center text-gray-600">
              No tienes cuentas. ¡Crea una nueva!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accounts.map(account => (
                <div
                  key={account.id}
                  onClick={() => {
                    setActiveAccountId(account.id)
                  }}
                  className={`p-6 rounded-lg border-2 cursor-pointer transition ${
                    activeAccountId === account.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{account.name}</h4>
                      <p className="text-sm text-gray-500">{account.currency}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          handleEditAccount(account)
                        }}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          handleDeleteAccount(account.id)
                        }}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TODO: Add the cards section for the page */}
      </div>

      {/* Modales */}
      <AccountModal
        isOpen={showAccountModal}
        account={selectedAccount}
        onClose={() => {
          setShowAccountModal(false)
          setSelectedAccount(null)
        }}
        onSubmit={async data => {
          if (selectedAccount) {
            await updateAccount(selectedAccount.id, data)
          } else {
            await createAccount(data)
          }
        }}
        loading={accountsLoading}
      />

      {/* TODO: Add card modal */}
    </div>
  )
}
