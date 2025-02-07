"use server";

import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";

export async function getUserId() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
    throw new Error("User not authenticated");
  }

  return session.user.id;
}
