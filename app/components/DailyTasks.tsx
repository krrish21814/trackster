'use client'

import { useEffect, useState } from 'react'
import { Task, Goal } from '@prisma/client'
import { updateTask, getDailyTasks, deleteTask } from '../actions/goals'
import { EditTaskModal } from '../components/EditTaskModal'
import { TaskCard } from '../components/TaskCard'
import { ProgressBar } from '../components/ProgressBar'
import { TaskFilters } from '../components/TaskFilters'
import { Pagination } from '../components/Pagination'
import { updateUserStreak } from '../actions/streak'
import { useSession } from 'next-auth/react'
import { useStreakStore } from '@/store/useStreakStore'

type TaskWithGoal = Task & { goal: Goal }

export function DailyTasks() {
  const [tasks, setTasks] = useState<TaskWithGoal[]>([])
  const [loading, setLoading] = useState(true) // Loading state
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const tasksPerPage = 3;
  const { data: session } = useSession();
  const userId = Number(session?.user?.id);

  useEffect(() => {
    const fetchTasks = async () => {
      const dailyTasks = await getDailyTasks()
      setTasks(dailyTasks)
      setLoading(false)
    }
    fetchTasks()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filterPriority])

  const filteredAndSortedTasks = tasks
    .filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.goal.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority
      return matchesSearch && matchesPriority
    })
    .sort((a, b) => (a.completed !== b.completed ? (a.completed ? 1 : -1) : 0))

  useEffect(() => {
    const maxPage = Math.ceil(filteredAndSortedTasks.length / tasksPerPage)
    if (currentPage > maxPage && maxPage > 0) {
      setCurrentPage(maxPage)
    }
  }, [filteredAndSortedTasks.length, currentPage, tasksPerPage])

  const currentTasks = filteredAndSortedTasks.slice(
    (currentPage - 1) * tasksPerPage,
    currentPage * tasksPerPage
  )

  const handleTaskComplete = async (taskId: number, completed: boolean) => {
    if (!userId) return;
    if (completed) {
      await updateUserStreak(userId);
      useStreakStore.getState().incrementStreak()
    }

    const updatedTask = await updateTask(taskId, {
      completed,
      completedAt: completed ? new Date() : null,
    });

    setTasks(tasks.map(task => (
      task.id === taskId ? { ...task, ...updatedTask } : task
    )));

    if (completed) {
      const updatedFilteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.goal.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
        return matchesSearch && matchesPriority && !task.completed;
      });

      const remainingTasksOnCurrentPage = updatedFilteredTasks.slice(
        (currentPage - 1) * tasksPerPage,
        currentPage * tasksPerPage
      );

      if (remainingTasksOnCurrentPage.length === 0 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
    }
  };

  const handleTaskUpdate = async (updatedTask: Task) => {

    setTasks(tasks.map(task => (task.id === updatedTask.id ? { ...task, ...updatedTask } : task)))
    setEditingTask(null)
  }

  const handleDeleteTask = async (taskId: number) => {
    await deleteTask(taskId)
    setTasks(tasks.filter(task => task.id !== taskId))
  }
  const handleEdit = (task: Task) => {
    setEditingTask(task)
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 space-y-6 px-4">
      <ProgressBar
        total={tasks.length}
        completed={tasks.filter(task => task.completed).length}
      />

      <TaskFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterPriority={filterPriority}
        onPriorityChange={setFilterPriority}
      />

      {loading ? (
        <p className="text-gray-500 text-center text-lg">Loading tasks...</p>
      ) : filteredAndSortedTasks.length === 0 ? (
        <p className="text-gray-500 text-center text-lg">No tasks found 🔍</p>
      ) : (
        <div className="space-y-4">
          {currentTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={handleTaskComplete}
              onEdit={handleEdit}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}

      {filteredAndSortedTasks.length > tasksPerPage && (
        <Pagination
          currentPage={currentPage}
          totalItems={filteredAndSortedTasks.length}
          itemsPerPage={tasksPerPage}
          onPageChange={setCurrentPage}
        />
      )}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onUpdate={handleTaskUpdate}
        />
      )}
    </div>
  )
}