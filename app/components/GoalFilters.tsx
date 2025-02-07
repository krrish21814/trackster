import { Search } from 'lucide-react'

interface GoalSearchFilterProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function GoalSearchFilter({ searchQuery, onSearchChange }: GoalSearchFilterProps) {
  return (
    <div className="flex items-center space-x-2 bg-gray-50 p-4 rounded-lg">
      <Search className="w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder="Search goals..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="px-3 py-2 border rounded-lg text-sm w-64"/>
    </div>
  )
}