'use client'

import { useState } from 'react'
import { updateGoal } from '../actions/goals'
import { Goal } from '../utils/types'
import { GoalTag } from '@prisma/client'

interface EditGoalModalProps {
  goal: Goal
  onClose: () => void
  onUpdate: (goal: Goal) => void
}

export function EditGoalModal({ goal, onClose, onUpdate }: EditGoalModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: goal.title,
    description: goal.description,
    tag: goal.tag,
    deadLine: new Date(goal.deadLine).toISOString().split('T')[0],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true)
    e.preventDefault()
    const updatedGoal = await updateGoal(goal.id, {
      ...formData,
      deadLine: new Date(formData.deadLine),

    })
    onUpdate(updatedGoal)
    setLoading(false)
  }

  return (
    <div className="fixed top-0 right-5 h-[48rem] w-[31rem] bg-[#F7F7F7] rounded-2xl shadow-lg p-6 overflow-y-auto">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-[#6B7280] hover:text-[#F87171] transition-all text-3xl">
        &times;
      </button>

      <h2 className="text-3xl font-bold text-[#222222] mb-8">Edit Goal</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-3">
          <label htmlFor="title" className="block text-lg font-semibold text-[#222222]">Goal Title</label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-3 border-2 border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#1F2937] focus:ring-2 focus:ring-[#E0E0E0] transition-all"
            required />
        </div>

        <div className="space-y-3">
          <label htmlFor="description" className="block text-lg font-semibold text-[#222222]">Description</label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-3 border-2 border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#1F2937] focus:ring-2 focus:ring-[#E0E0E0] transition-all"
            rows={4}
            required />
        </div>

        <div className="space-y-3">
          <label htmlFor="tag" className="block text-lg font-semibold text-[#222222]">Tag</label>
          <select
            name="tag"
            id="tag"
            value={formData.tag}
            onChange={(e) => setFormData({ ...formData, tag: e.target.value as GoalTag })}
            className="w-full p-3 border-2 border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#1F2937] focus:ring-2 focus:ring-[#E0E0E0] transition-all"
            required>
            <option value="PERSONAL">Personal</option>
            <option value="WORK">Work</option>
          </select>
        </div>

        <div className="space-y-3">
          <label htmlFor="deadLine" className="block text-lg font-semibold text-[#222222]">Deadline</label>
          <input
            type="date"
            name="deadLine"
            id="deadLine"
            value={formData.deadLine}
            onChange={(e) => setFormData({ ...formData, deadLine: e.target.value })}
            className="w-full p-3 border-2 border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#1F2937] focus:ring-2 focus:ring-[#E0E0E0] transition-all"
            required
            min={new Date().toISOString().split('T')[0]} />
        </div>

        <button
          type="submit"
          className={`w-full bg-[#374151] text-white p-3 rounded-lg hover:bg-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#BFDBFE] transition-all ${loading ? "opacity-50 cursor-not-allowed" : " hover:shadow-lg"}`}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
