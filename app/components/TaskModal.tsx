'use client'

import { useState, useEffect } from 'react'
import { Task } from '@prisma/client'
import { createTask, updateTask, deleteTask, getTasksByGoalId } from '../actions/goals'
import { EditTaskModal } from '../components/EditTaskModal'
import { ConfirmationDialog } from '../components/ConfirmationDialog'
import { useGoalStore } from '@/store/use-goals'
import { updateUserStreak } from '../actions/streak'
import { useSession } from 'next-auth/react'
import { useStreakStore } from '@/store/useStreakStore'

export function TaskModal() {
  const { selectedGoal, isTaskModalOpen, setTaskModalOpen } = useGoalStore()
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null)
  const { data: session } = useSession();
  const userId = Number(session?.user?.id);

  useEffect(() => {
    if (selectedGoal && isTaskModalOpen) {
      const fetchTasks = async () => {
        setIsLoading(true)
        try {
          const goalTasks = await getTasksByGoalId(selectedGoal.id)
          setTasks(goalTasks)
        } catch (error) {
          console.error('Failed to fetch tasks:', error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchTasks()
    }
  }, [selectedGoal, isTaskModalOpen])

  const handleSubmit = async (formData: FormData) => {
    const task = await createTask(formData)
    setTasks(prevTasks => [...prevTasks, task])
  }

  const handleTaskComplete = async (taskId: number, completed: boolean) => {
    const updatedTask = await updateTask(taskId, {
      completed,
      completedAt: completed ? new Date() : null
    });

    setTasks(prevTasks => prevTasks.map(task =>
      task.id === taskId ? updatedTask : task
    ));

    if (completed) {
      await updateUserStreak(userId);
      useStreakStore.getState().incrementStreak();
    }
  };


  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(prevTasks => prevTasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    ))
    setEditingTask(null)
  }

  const handleDelete = (taskId: number) => {
    setTaskToDelete(taskId)
    setShowConfirm(true)
  }

  const confirmDeleteTask = async () => {
    if (taskToDelete !== null) {
      await deleteTask(taskToDelete)
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskToDelete))
      setShowConfirm(false)
      setTaskToDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setShowConfirm(false)
    setTaskToDelete(null)
  }

  if (!isTaskModalOpen || !selectedGoal) return null

  return (
    <div className="fixed top-6 right-5 h-[48rem] w-[31rem] bg-[#F7F7F7] rounded-2xl shadow-lg p-6 overflow-y-auto">
      <button
        onClick={() => setTaskModalOpen(false)}
        className="absolute top-4 right-4 text-[#6B7280] hover:text-[#F87171] transition-all text-3xl">
        &times;
      </button>

      <h2 className="text-3xl font-bold text-[#222222] mb-8">
        Tasks for {selectedGoal.title}
      </h2>

      <form action={handleSubmit} className="mb-6">
        <input type="hidden" name="goalId" value={selectedGoal.id} />
        <div className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Task Title"
            className="w-full p-3 border-2 border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#1F2937] focus:ring-2 focus:ring-[#E0E0E0] transition-all"
            required />
          <textarea
            name="description"
            placeholder="Description"
            className="w-full p-3 border-2 border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#1F2937] focus:ring-2 focus:ring-[#E0E0E0] transition-all"
            required />
          <select
            name="priority"
            className="w-full p-3 border-2 border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#1F2937] focus:ring-2 focus:ring-[#E0E0E0] transition-all"
            required>
            <option value="P1">P1</option>
            <option value="P2">P2</option>
            <option value="P3">P3</option>
          </select>
          <button
            type="submit"
            className="w-full bg-[#374151] text-white p-3 rounded-lg hover:bg-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#BFDBFE] transition-all">
            Add Task
          </button>
        </div>
      </form>

      {isLoading ? (
        <div className="text-center py-4">Loading tasks...</div>
      ) : (
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="bg-[#F7F7F7] rounded-xl p-8 text-center">
              <p className="text-[#6B7280] text-lg">No tasks yet</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`bg-[#F7F7F7] rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-[#E0E0E0] ${task.completed ? 'opacity-75' : ''
                  }`}>
                <div className="flex items-start gap-4">
                  <div className="pt-1">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={(e) => handleTaskComplete(task.id, e.target.checked)}
                      className="h-5 w-5 rounded border-[#E0E0E0] text-[#374151] focus:ring-[#374151] transition-all" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className={`text-lg font-medium text-[#1F2937] ${task.completed ? 'line-through text-[#6B7280]' : ''}`}>
                          {task.title}
                        </h4>
                        <p className={`mt-1 text-sm text-[#6B7280] ${task.completed ? 'line-through' : ''}`}>
                          {task.description}
                        </p>
                      </div>

                      <div>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${task.priority === 'P1'
                              ? 'bg-[#FEE2E2] text-[#991B1B]'
                              : task.priority === 'P2'
                                ? 'bg-[#FEF3C7] text-[#92400E]'
                                : 'bg-[#D1FAE5] text-[#065F46]'
                            }`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-4">
                      <button
                        onClick={() => setEditingTask(task)}
                        className="inline-flex items-center text-sm font-medium text-[#374151] hover:text-[#1F2937] transition-colors" >
                        <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(task.id)}
                        className="inline-flex items-center text-sm font-medium text-[#EF4444] hover:text-[#DC2626] transition-colors">
                        <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>

                      <span className="text-sm text-[#6B7280] ml-auto">
                        {task.completed ? 'Completed' : 'In Progress'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      )}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onUpdate={handleTaskUpdate} />
      )}

      <ConfirmationDialog
        isOpen={showConfirm}
        message="Are you sure you want to delete this task?"
        onConfirm={confirmDeleteTask}
        onCancel={handleCancelDelete} />
    </div>
  )
}