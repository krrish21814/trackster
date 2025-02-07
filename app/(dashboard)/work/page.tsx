'use client'

import { getGoals } from '@/app/actions/goals'
import { FilteredGoalList } from '@/app/components/FilteredGoalList'
import { GoalSearchFilter } from '@/app/components/GoalFilters'
import { useGoalStore } from '@/store/use-goals'
import { useEffect, useState } from 'react'

export default function WorkGoalsPage() {
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
      <h1 className='text-5xl font-semibold mb-4'>Work Goals</h1>
      <GoalSearchFilter searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <div className="mt-6">
        <FilteredGoalList loading={loading} tag="WORK" searchQuery={searchQuery} />
      </div>
    </div>
  )
}