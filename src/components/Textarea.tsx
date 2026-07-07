import type { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

export const Textarea = ({ label, id, error, ...props }: TextareaProps) => {
  const inputId = id ?? props.name

  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        id={inputId}
        rows={3}
        className={`input resize-none ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}
