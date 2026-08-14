import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getServerUser } from "@/lib/profile";
import NotificationsClient from "./NotificationsClient";

export const metadata = {
  title: "Notifications — Foodi",
  description: "Your latest updates and activity.",
};

export default async function NotificationsPage() {
  const supabase = await createClient();
  const user = await getServerUser(supabase);
  if (!user) {
    redirect("/sign-in?redirectTo=/notifications");
  }

  const { data: notifications } = await supabase
    .from("notifications")
    .select("id, type, title, message, read, created_at, metadata")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <main className="min-h-screen bg-[#FFF9F3] px-4 py-10 md:px-6 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <NotificationsClient
          initialNotifications={(notifications ?? []).map((n) => ({
            id: n.id,
            type: n.type,
            title: n.title,
            body: n.message,
            isRead: n.read,
            createdAt: n.created_at,
          }))}
        />
      </div>
    </main>
  );
}
