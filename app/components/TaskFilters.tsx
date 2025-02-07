import { Search, Filter } from 'lucide-react'

interface TaskFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  filterPriority: string
  onPriorityChange: (priority: string) => void
}

export function TaskFilters({
  searchQuery,
  onSearchChange,
  filterPriority,
  onPriorityChange
}: TaskFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-between bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center space-x-2">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm w-64"/>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filterPriority}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm">
            <option value="all">All Priorities</option>
            <option value="P1">P1</option>
            <option value="P2">P2</option>
            <option value="P3">P3</option>
          </select>
        </div>
      </div>
    </div>
  )
}
