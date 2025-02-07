'use client'
import { getGoals } from '@/app/actions/goals'
import { AddGoalForm } from '@/app/components/AddGoalForm'
import { GoalList } from '@/app/components/GoalList'
import { TaskModal } from '@/app/components/TaskModal'
import { useGoalStore } from '@/store/use-goals'
import { useState, useEffect } from 'react'

export default function GoalsPage() {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isListOpen, setIsListOpen] = useState(false)
  const { isTaskModalOpen, setTaskModalOpen, setGoals } = useGoalStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadGoals() {
      try {
        const goals = await getGoals()
        setGoals(goals)
      } catch (error) {
        console.error('Failed to load goals:', error)
      } finally {
        setLoading(false)
      }
    }

    loadGoals()
  }, [setGoals])

  return (
    <div className="relative flex">
      <div className={`transition-all duration-300 ${isAddOpen || isTaskModalOpen || isListOpen ? 'mr-[32rem]' : ''} flex-1 container mx-auto`}>
        <h1 className="text-5xl font-bold mb-6">Goals</h1>
        <AddGoalForm setIsOpen={setIsAddOpen} isOpen={isAddOpen} />
        <GoalList loading={loading} setIsOpen={setIsListOpen} isOpen={isListOpen} />
        <TaskModal />
      </div>
    </div>
  )
}