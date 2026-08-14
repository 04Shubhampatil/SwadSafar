"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Camera, Loader2, Mail, Save, User } from "lucide-react";
import { toast } from "sonner";

const getInitials = (name, email) => {
  const source = name || email || "";
  const parts = source.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (parts[0]?.[0] || email?.[0] || "U").toUpperCase();
};

export default function ProfileClient({ initialProfile, userEmail }) {
  const router = useRouter();
  const [fullName, setFullName] = useState(initialProfile?.full_name ?? "");
  const [username, setUsername] = useState(initialProfile?.username ?? "");
  const [bio, setBio] = useState(initialProfile?.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(initialProfile?.avatar_url ?? "");
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef(null);

  const initials = useMemo(
    () => getInitials(fullName || initialProfile?.full_name, userEmail),
    [fullName, initialProfile?.full_name, userEmail],
  );

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAvatarUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/profile/avatar", { method: "POST", body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || "Could not upload your photo");
        return;
      }
      setAvatarUrl(data.profile?.avatar_url ?? avatarUrl);
      toast.success("Profile photo updated");
      router.refresh();
    } catch {
      toast.error("Network error — please try again");
    } finally {
      setAvatarUploading(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName, username, bio }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || "Could not save your changes");
        return;
      }
      toast.success("Profile updated");
      router.refresh();
    } catch {
      toast.error("Network error — please try again");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col gap-2">
        <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#ea580c]">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#f97316]" />
          Account
        </p>
        <h1 className="font-display text-3xl font-extrabold tracking-[-0.02em] text-[#111827] sm:text-4xl">
          My <span className="fd-text-gradient">Profile</span>
        </h1>
        <p className="text-sm font-medium text-[#7c7267]">
          Manage your personal information, photo and public profile.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile image card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-[24px] border border-white/70 bg-white/70 p-6 shadow-[0_18px_40px_rgba(111,80,50,0.1)] backdrop-blur-xl sm:p-8"
        >
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
            <div className="relative shrink-0">
              {avatarUploading ? (
                <div className="flex h-28 w-28 animate-pulse items-center justify-center rounded-full border-2 border-white bg-orange-100">
                  <Loader2 size={26} className="animate-spin text-orange-500" />
                </div>
              ) : avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt="Profile"
                  referrerPolicy="no-referrer"
                  className="h-28 w-28 rounded-full border-2 border-white object-cover shadow-[0_14px_30px_rgba(249,115,22,0.25)]"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-3xl font-extrabold text-white shadow-[0_14px_30px_rgba(249,115,22,0.25)]">
                  {initials}
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-2 sm:items-start">
              <p className="text-lg font-extrabold text-[#111827]">
                {fullName || userEmail?.split("@")[0] || "Foodie"}
              </p>
              <p className="text-xs font-medium text-[#8c827a]">
                {username ? `@${username}` : userEmail}
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarUploading}
                className="mt-1 inline-flex items-center gap-2 rounded-full border border-[#fed7aa]/80 bg-[#fff7ed] px-4 py-2 text-xs font-bold text-[#ea580c] transition-all duration-300 hover:bg-gradient-to-r hover:from-[#ea580c] hover:to-[#fb923c] hover:text-white disabled:opacity-60"
              >
                <Camera size={13} />
                {avatarUploading ? "Uploading…" : "Change Photo"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                aria-label="Upload profile photo"
                onChange={handleAvatarChange}
              />
              <p className="mt-1 text-[10px] font-medium text-[#b3a798]">
                JPG, PNG or WebP · max 3 MB
              </p>
            </div>
          </div>
        </motion.section>

        {/* Account details */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-[24px] border border-white/70 bg-white/70 p-6 shadow-[0_18px_40px_rgba(111,80,50,0.1)] backdrop-blur-xl sm:p-8"
        >
          <div className="mb-6 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 text-orange-600">
              <User size={16} />
            </span>
            <div>
              <h2 className="text-sm font-extrabold text-[#111827]">Account Information</h2>
              <p className="text-[11px] font-medium text-[#8c827a]">
                These details appear on your public profile
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-[#61564a]">Full Name</span>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                maxLength={80}
                placeholder="Your full name"
                className="w-full rounded-xl border border-white/80 bg-white/80 px-4 py-3 text-sm text-[#111827] outline-none transition-all placeholder:text-[#c0ac98] focus:border-[#fdba74] focus:shadow-[0_0_0_4px_rgba(249,115,22,0.12)]"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-[#61564a]">Username</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/\s+/g, ""))}
                maxLength={30}
                placeholder="letters_numbers_underscores"
                className="w-full rounded-xl border border-white/80 bg-white/80 px-4 py-3 text-sm text-[#111827] outline-none transition-all placeholder:text-[#c0ac98] focus:border-[#fdba74] focus:shadow-[0_0_0_4px_rgba(249,115,22,0.12)]"
              />
            </label>
          </div>

          <label className="mt-5 block">
            <span className="mb-1.5 block text-xs font-bold text-[#61564a]">Bio</span>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={300}
              rows={4}
              placeholder="Tell the community a little about yourself…"
              className="w-full resize-none rounded-xl border border-white/80 bg-white/80 px-4 py-3 text-sm text-[#111827] outline-none transition-all placeholder:text-[#c0ac98] focus:border-[#fdba74] focus:shadow-[0_0_0_4px_rgba(249,115,22,0.12)]"
            />
            <span className="mt-1 block text-right text-[10px] font-medium text-[#b3a798]">
              {bio.length}/300
            </span>
          </label>

          <label className="mt-5 block">
            <span className="mb-1.5 block text-xs font-bold text-[#61564a]">Email</span>
            <div className="flex items-center gap-2 rounded-xl border border-[#f0e8dc] bg-[#fffaf4] px-4 py-3">
              <Mail size={15} className="shrink-0 text-[#b3a798]" />
              <span className="text-sm text-[#8c827a]">{userEmail || "No email"}</span>
            </div>
            <span className="mt-1 block text-[10px] font-medium text-[#b3a798]">
              Email is tied to your account and cannot be changed here.
            </span>
          </label>
        </motion.section>

        {/* Save */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="fd-gradient-btn fd-sheen inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold text-white shadow-[0_14px_30px_rgba(249,115,22,0.35)] transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Save size={15} />
            )}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
