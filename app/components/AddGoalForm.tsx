'use client'

import { useState } from 'react'
import { createGoal } from '../actions/goals'
import { useGoalStore } from '@/store/use-goals'

interface AddGoalFormProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export function AddGoalForm({ isOpen, setIsOpen }: AddGoalFormProps) {
    const addGoal = useGoalStore((state) => state.addGoal)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (formData: FormData) => {

        setLoading(true)
        try {
            const goal = await createGoal(formData)
            addGoal(goal)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="mb-6 bg-[#374151] text-white flex items-center p-3 w-full rounded-lg shadow-md hover:bg-[#1F2937] transition-all"
            >
                Add Goals
            </button>

            {isOpen && (
                <div className="fixed top-6 right-5 h-[48rem] w-[31rem] bg-[#F7F7F7] rounded-2xl shadow-lg p-6 overflow-y-auto">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-4 right-4 text-[#6B7280] hover:text-[#F87171] transition-all text-3xl"
                        disabled={loading}
                    >
                        &times;
                    </button>
                    <h2 className="text-3xl font-bold text-[#222222] mb-8">Add New Goal</h2>

                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.currentTarget;
                        const formData = new FormData(form);

                        handleSubmit(formData).then(() => {
                            form.reset();
                        });
                    }} className="space-y-8">
                        <div className="space-y-3">
                            <label htmlFor="title" className="block text-lg font-semibold text-[#222222]">Goal Title</label>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                placeholder="Enter your goal title"
                                className="w-full p-3 border-2 border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#1F2937] focus:ring-2 focus:ring-[#E0E0E0] transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-3">
                            <label htmlFor="description" className="block text-lg font-semibold text-[#222222]">Description</label>
                            <textarea
                                name="description"
                                id="description"
                                placeholder="Describe your goal"
                                className="w-full p-3 border-2 border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#1F2937] focus:ring-2 focus:ring-[#E0E0E0] transition-all"
                                rows={4}
                                required
                            />
                        </div>

                        <div className="space-y-3">
                            <label htmlFor="tag" className="block text-lg font-semibold text-[#222222]">Tag</label>
                            <select
                                name="tag"
                                id="tag"
                                className="w-full p-3 border-2 border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#1F2937] focus:ring-2 focus:ring-[#E0E0E0] transition-all"
                                required
                            >
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
                                className="w-full p-3 border-2 border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#1F2937] focus:ring-2 focus:ring-[#E0E0E0] transition-all"
                                required
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <button
                            type="submit"
                            className={`w-full bg-[#374151] text-white p-3 rounded-lg hover:bg-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#BFDBFE] transition-all ${loading ? "opacity-50 cursor-not-allowed" : " hover:shadow-lg"}`}
                        >
                            {loading ? 'Adding...' : 'Add Goal'}
                        </button>
                    </form>
                </div>
            )}
        </>
    )
}
