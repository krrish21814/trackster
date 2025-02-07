import { getUserProfile } from "@/app/actions/profile";
import SettingsForm from "@/app/components/SettingsForm";
import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Not authenticated");

  const userId = Number(session.user.id);
  const user = await getUserProfile(userId);
  if (!user) {
    return <div>User not found</div>;
  }
  return (
    <div className="">
      <h1 className='text-5xl font-semibold'>Settings</h1>
      <SettingsForm initialUser={user} />
    </div>

  )
}
