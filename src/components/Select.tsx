import type { ReactNode, SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  labelActions?: ReactNode
}

export const Select = ({ label, id, error, labelActions, children, ...props }: SelectProps) => {
  const selectId = id ?? props.name

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {labelActions}
      </div>
      <select
        id={selectId}
        className={`input ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}
