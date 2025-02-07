'use server'

import prisma from '@/prisma'
import { MedalType } from '@prisma/client'

export async function updateUserStreak(userId: number) {
  console.log("test bro")
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0);
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      lastActivity: true,
      overallStreak: true
    }
  })

  if (!user) return null

  const todayActivity = await checkTodayActivity(userId, today)
  if (!todayActivity) {
    return user
  }

  let newStreak = user.overallStreak

  if (user.lastActivity && user.lastActivity.getTime() === yesterday.getTime()) {
    newStreak += 1
  }

  else if (!user.lastActivity || user.lastActivity.getTime() < yesterday.getTime()) {
    newStreak = 1
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      overallStreak: newStreak,
      lastActivity: today
    }
  });

  await checkAndAwardMedals(userId, newStreak)
  return updatedUser
}

async function checkTodayActivity(userId: number, today: Date) {
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const completedTasksToday = await prisma.task.count({
    where: {
      goal: { userId },
      completed: true,
      completedAt: {
        gte: today,
        lt: tomorrow
      }
    }
  })

  const completedGoalsToday = await prisma.goal.count({
    where: {
      userId,
      completed: true,
      updatedAt: {
        gte: today,
        lt: tomorrow
      }
    }
  })

  return completedTasksToday > 0 || completedGoalsToday > 0
}

async function checkAndAwardMedals(userId: number, streak: number) {
  const medalThresholds = {
    [MedalType.WEEK_STREAK]: 7,
    [MedalType.TWO_WEEK_STREAK]: 14,
    [MedalType.MONTH_STREAK]: 30,
    [MedalType.HALF_YEAR_STREAK]: 180,
    [MedalType.YEAR_STREAK]: 365
  }

  for (const [medalType, threshold] of Object.entries(medalThresholds)) {
    if (streak === threshold) {

      const existingMedal = await prisma.medal.findFirst({
        where: {
          userId,
          type: medalType as MedalType
        }
      })
      if (!existingMedal) {
        await prisma.medal.create({
          data: {
            type: medalType as MedalType,
            userId,
            earnedAt: new Date()
          }
        })
      }
    }
  }
}

export async function getUserStreakAndMedals(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      medals: true
    }
  })
  return user
}