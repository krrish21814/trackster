'use client'

import { useEffect } from 'react'
import { FaFire } from 'react-icons/fa'
import { getUserStreakAndMedals } from '../actions/streak'
import { useStreakStore } from '@/store/useStreakStore'

export function StreakDisplay({ userId, isOpen }: { userId: number, isOpen: boolean }) {
  const { streak, setStreak } = useStreakStore() 

  useEffect(() => {
    const fetchStreak = async () => {
      const streakData = await getUserStreakAndMedals(userId)
      if (streakData) {
        setStreak(streakData.overallStreak)
      }
    }

    if (streak === 0) { 
      fetchStreak()
    }
  }, [userId, setStreak, streak])

  if (streak === 0) return null 

  return (
    <div>
      {isOpen && (
        <div className="inline-flex items-center space-x-2 px-3 bg-white rounded-full border border-[#E0E0E0]">
          <FaFire className="text-orange-500 text-xl" />
          <span className="font-bold text-lg text-[#222222]">{streak}</span>
        </div>
      )}
    </div>
  )
}
