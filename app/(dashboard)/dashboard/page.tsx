import { getGoals } from '@/app/actions/goals'
import { getUserId } from '@/app/actions/user'
import { getUserStreakAndMedals } from '@/app/actions/streak'

import { redirect } from 'next/navigation'
import { Dashboard } from '@/app/components/Dashboard'

export default async function DashboardPage() {
  const userId = await getUserId()

  const [goals, userStreakData] = await Promise.all([
    getGoals(),
    getUserStreakAndMedals(Number(userId))
  ])

  if (!userStreakData) {
    redirect('/auth/signin')
  }

  const { overallStreak: streak, medals } = userStreakData

  const handleNewGoal = async () => {
    'use server'
    redirect('/goals')
  }
  return (
    <Dashboard
      goals={goals}
      medals={medals}
      initialStreak={streak}
      onNewGoal={handleNewGoal}
    />
  )
}