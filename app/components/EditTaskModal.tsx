'use client'

import { useState } from 'react'
import { Task, Priority } from '@prisma/client'
import { updateTask } from '../actions/goals'

interface EditTaskModalProps {
  task: Task
  onClose: () => void
  onUpdate: (task: Task) => void
}

export function EditTaskModal({ task, onClose, onUpdate }: EditTaskModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const updatedTask = await updateTask(task.id, formData)
    onUpdate(updatedTask)
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-semibold text-[#1F2937] mb-6">Edit Task</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-[#222222] text-sm font-medium">
              Task Title
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 border border-[#E0E0E0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#374151]"
              required />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-[#222222] text-sm font-medium">
              Task Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 border border-[#E0E0E0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#374151]"
              required />
          </div>

          <div className="space-y-2">
            <label htmlFor="priority" className="text-[#222222] text-sm font-medium">
              Priority
            </label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
              className="w-full p-3 border border-[#E0E0E0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#374151]">
              <option value="P1">P1</option>
              <option value="P2">P2</option>
              <option value="P3">P3</option>
            </select>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-[#374151] bg-[#F7F7F7] hover:bg-[#D1D5DB] rounded-md text-sm font-semibold transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              className={`px-6 py-3 bg-[#374151] text-white rounded-md text-sm font-semibold hover:bg-[#1F2937] transition-colors ${loading ? "opacity-50 cursor-not-allowed" : " hover:shadow-lg"}`}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
