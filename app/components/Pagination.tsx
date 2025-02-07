interface PaginationProps {
    currentPage: number
    totalItems: number
    itemsPerPage: number
    onPageChange: (page: number) => void
  }
  
  export function Pagination({ currentPage, totalItems, itemsPerPage, onPageChange }: PaginationProps) {
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
  
    return (
      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-gray-600">
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)} of {totalItems} tasks
        </p>
        <div className="flex space-x-4">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            className="bg-gray-600 text-white py-2 px-6 rounded-full hover:bg-gray-700 transition-all text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === 1}>
            Previous
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            className="bg-gray-600 text-white py-2 px-6 rounded-full hover:bg-gray-700 transition-all text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage * itemsPerPage >= totalItems}>
            Next
          </button>
        </div>
      </div>
    )
  }