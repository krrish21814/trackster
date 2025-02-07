'use server'

import prisma from '@/prisma'
import { revalidatePath } from 'next/cache'

interface UpdateProfileData {
  name: string
  email: string
}

export async function updateUserProfile(userId: number, data: UpdateProfileData) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email
      }
    })

    revalidatePath('/settings')
    return { success: true }
  } catch (error) {
    console.error('Failed to update profile:', error)
    return { success: false, error: 'Failed to update profile' }
  }
}

export async function getUserProfile(userId: number) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      medals: true,
      goals: {
        select: { completed: true },
      },
    },
  });
}
