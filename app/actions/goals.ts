'use server'

import { revalidatePath } from 'next/cache'
import { Goal, Task, GoalTag, Priority } from '@prisma/client'
import prisma from '@/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../lib/auth'

export async function createGoal(formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const tag = formData.get('tag') as GoalTag
  const deadLine = new Date(formData.get('deadLine') as string)
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Not authenticated");

  const userId = Number(session.user.id);

  const goal = await prisma.goal.create({
    data: {
      title,
      description,
      tag,
      deadLine,
      userId,
      createdAt: new Date(),
    },
  })

  revalidatePath('/goals')
  return goal
}

export async function getGoals() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Not authenticated");

  const userId = Number(session.user.id);

  const goals = await prisma.goal.findMany({
    where: { userId: userId },
    include: { tasks: true },
    orderBy: { createdAt: "desc" }
  });

  return goals;
}

export async function updateGoal(goalId: number, data: Partial<Goal>) {
  const goal = await prisma.goal.update({
    where: { id: goalId },
    data,
  })

  revalidatePath('/goals')
  return goal
}
export async function deleteGoal(goalId: number) {
  try {
    await prisma.task.deleteMany({
      where: { goalId }
    });

    await prisma.goal.delete({
      where: { id: goalId }
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting goal:", error);
    return { success: false, error: "Failed to delete goal." };
  }
}

export async function createTask(formData: FormData) {
  const task = await prisma.task.create({
    data: {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      priority: formData.get('priority') as Priority,
      goalId: parseInt(formData.get('goalId') as string),
      createdAt: new Date(),
    },
  });

  revalidatePath('/goals');
  revalidatePath('/dailies');
  return task;
}

export async function getDailyTasks() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const tasks = await prisma.task.findMany({
    where: {
      createdAt: {
        gte: today,
        lt: tomorrow,
      },
      completed: false,
    },
    include: {
      goal: true,
    },
    orderBy: {
      priority: 'asc',
    },
  })

  return tasks
}

export async function getCompletedTasks() {
  const tasks = await prisma.task.findMany({
    where: {
      completed: true,
    },
    include: {
      goal: true,
    },
    orderBy: {
      priority: 'asc',
    },
  });

  return tasks;
}

export async function getTasksByGoalId(goalId: number) {
  const tasks = await prisma.task.findMany({
    where: {
      goalId: goalId
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return tasks
}

export async function updateTask(taskId: number, data: Partial<Task>) {
  const task = await prisma.task.update({
    where: { id: taskId },
    data,
  })

  revalidatePath('/goals')
  revalidatePath('/dailies')
  return task
}

export async function deleteTask(taskId: number) {
  await prisma.task.delete({
    where: { id: taskId },
  })

  revalidatePath('/goals')
  revalidatePath('/dailies')
}