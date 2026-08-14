import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getServerUser, ensureProfile } from "@/lib/profile";
import ProfileClient from "./ProfileClient";

export const metadata = {
  title: "My Profile — Foodi",
  description: "View and update your Foodi profile.",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const user = await getServerUser(supabase);
  if (!user) {
    redirect("/sign-in?redirectTo=/profile");
  }

  const profile = await ensureProfile(supabase, user);

  return (
    <main className="min-h-screen bg-[#FFF9F3] px-4 py-10 md:px-6 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <ProfileClient initialProfile={profile} userEmail={user.email ?? ""} />
      </div>
    </main>
  );
}
