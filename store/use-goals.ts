import { Goal } from '@/app/utils/types'
import { create } from 'zustand'

interface GoalState {
  goals: Goal[]
  selectedGoal: Goal | null
  isTaskModalOpen: boolean
  setGoals: (goals: Goal[]) => void
  setSelectedGoal: (goal: Goal | null) => void
  setTaskModalOpen: (isOpen: boolean) => void
  addGoal: (goal: Goal) => void
  updateGoal: (goal: Goal) => void
  deleteGoal: (goalId: number) => void
  toggleGoalCompletion: (goalId: number, completed: boolean) => void
}

export const useGoalStore = create<GoalState>((set) => ({
  goals: [],
  selectedGoal: null,
  isTaskModalOpen: false,
  setGoals: (goals) => set({ goals }),
  setSelectedGoal: (goal) => set({ selectedGoal: goal }),
  setTaskModalOpen: (isOpen) => set({ isTaskModalOpen: isOpen }),
  
  addGoal: (goal) => set((state) => ({
    goals: [...state.goals, { ...goal, tasks: goal.tasks || [] }] 
  })),
  
  updateGoal: (updatedGoal) =>
    set((state) => ({
      goals: state.goals.map((goal) =>
        goal.id === updatedGoal.id ? { ...updatedGoal, tasks: updatedGoal.tasks || [] } : goal
      ),
    })),
    
  deleteGoal: (goalId) =>
    set((state) => ({
      goals: state.goals.filter((goal) => goal.id !== goalId),
    })),
    
  toggleGoalCompletion: (goalId, completed) =>
    set((state) => ({
      goals: state.goals.map((goal) =>
        goal.id === goalId ? { ...goal, completed } : goal
      ),
    })),
}));
