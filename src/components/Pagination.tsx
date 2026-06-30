interface PaginationProps {
  page: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  onPageChange: (page: number) => void
  loading?: boolean
}

export const Pagination = ({
  page,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
  loading = false,
}: PaginationProps) => {
  return (
    <div className="flex items-center justify-center gap-4 mt-6 py-4">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPreviousPage || loading}
        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
      >
        ←
      </button>

      {/* Page Information */}
      <div className="text-center min-w-50">
        <p className="text-sm text-gray-600">
          Página <span className="font-semibold">{page}</span> de{' '}
          <span className="font-semibold">{totalPages}</span>
        </p>
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNextPage || loading}
        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
      >
        →
      </button>
    </div>
  )
}
