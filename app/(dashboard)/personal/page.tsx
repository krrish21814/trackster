'use client'

import { getGoals } from '@/app/actions/goals'
import { FilteredGoalList } from '@/app/components/FilteredGoalList'
import { GoalSearchFilter } from '@/app/components/GoalFilters'
import { TaskModal } from '@/app/components/TaskModal'
import { useGoalStore } from '@/store/use-goals'
import { useEffect, useState } from 'react'

export default function PersonalGoalsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const { setGoals } = useGoalStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGoals() {
      try {
        const goals = await getGoals();
        setGoals(goals);
      } catch (error) {
        console.error("Failed to load goals:", error);
      } finally {
        setLoading(false);
      }
    }

    loadGoals();
  }, [setGoals]);
  return (
    <div >
      <h1 className='text-5xl font-semibold mb-4'>Personal Goals</h1>
      <GoalSearchFilter searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <div className="mt-2">
        <FilteredGoalList loading={loading} tag="PERSONAL" searchQuery={searchQuery} />
      </div>
      <TaskModal />
    </div>
  )
}
