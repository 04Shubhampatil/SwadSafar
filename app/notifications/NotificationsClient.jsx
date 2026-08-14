"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, BellOff, Check, CheckCheck, Clock, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

const TYPE_ICON = {
  welcome: Sparkles,
  comment: Sparkles,
  like: Sparkles,
  recipe: Sparkles,
};

const TYPE_STYLE = {
  welcome: "bg-gradient-to-br from-orange-500 to-amber-500 text-white",
  comment: "bg-gradient-to-br from-orange-500 to-amber-500 text-white",
  like: "bg-gradient-to-br from-orange-500 to-amber-500 text-white",
  recipe: "bg-gradient-to-br from-orange-500 to-amber-500 text-white",
};

const timeAgo = (iso) => {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

export default function NotificationsClient({ initialNotifications }) {
  const [items, setItems] = useState(initialNotifications);
  const [busy, setBusy] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const unreadCount = items.filter((n) => !n.isRead).length;

  const markRead = async (id) => {
    if (busyId === id) return;
    setBusyId(id);
    setItems((current) => current.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    try {
      const res = await fetch("/api/notifications/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Could not update notification");
        setItems((current) => current.map((n) => (n.id === id ? { ...n, isRead: false } : n)));
      }
    } catch {
      toast.error("Network error - please try again");
      setItems((current) => current.map((n) => (n.id === id ? { ...n, isRead: false } : n)));
    } finally {
      setBusyId(null);
    }
  };

  const markAllRead = async () => {
    if (unreadCount === 0) return;
    setBusy(true);
    const ids = items.filter((n) => !n.isRead).map((n) => n.id);
    setItems((current) => current.map((n) => ({ ...n, isRead: true })));
    try {
      const res = await fetch("/api/notifications/read-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds: ids }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Could not mark notifications as read");
        setItems((current) => current.map((n) => (ids.includes(n.id) ? { ...n, isRead: false } : n)));
      } else {
        toast.success("All caught up");
      }
    } catch {
      toast.error("Network error - please try again");
      setItems((current) => current.map((n) => (ids.includes(n.id) ? { ...n, isRead: false } : n)));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2">
        <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#ea580c]">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#f97316]" />
          Activity
        </p>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-[0_10px_24px_rgba(249,115,22,0.3)]">
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-extrabold text-white shadow">
                  {unreadCount}
                </span>
              )}
            </span>
            <div>
              <h1 className="font-display text-3xl font-extrabold tracking-[-0.02em] text-[#111827] sm:text-4xl">
                Notifications
              </h1>
              <p className="text-sm font-medium text-[#7c7267]">
                {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#fed7aa]/80 bg-[#fff7ed] px-4 py-2 text-xs font-bold text-[#ea580c] transition-all duration-300 hover:bg-gradient-to-r hover:from-[#ea580c] hover:to-[#fb923c] hover:text-white disabled:opacity-60"
            >
              {busy ? <Loader2 size={13} className="animate-spin" /> : <CheckCheck size={13} />}
              {busy ? "Working..." : "Mark all read"}
            </button>
          )}
        </div>
      </header>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center gap-3 rounded-[24px] border border-dashed border-[#e8d7c2] bg-white/50 px-6 py-16 text-center backdrop-blur-sm"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-400">
            <BellOff size={26} />
          </span>
          <p className="text-lg font-extrabold text-[#111827]">No notifications yet</p>
          <p className="max-w-sm text-sm font-medium text-[#8c827a]">
            We&apos;ll let you know when something happens on your account.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {items.map((notification) => {
            const Icon = TYPE_ICON[notification.type] || Sparkles;
            const style = TYPE_STYLE[notification.type] || TYPE_STYLE.welcome;
            const isBusy = busyId === notification.id;
            return (
              <motion.button
                key={notification.id}
                type="button"
                onClick={() => !notification.isRead && markRead(notification.id)}
                disabled={isBusy}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex w-full items-start gap-4 rounded-[20px] border p-4 text-left backdrop-blur-xl transition-all duration-300 ${
                  notification.isRead
                    ? "border-white/70 bg-white/60"
                    : "border-[#fed7aa]/80 bg-gradient-to-r from-[#fff7ed] to-[#fffaf4] shadow-[0_14px_34px_rgba(111,80,50,0.09)]"
                } ${!notification.isRead ? "hover:-translate-y-0.5" : ""} ${
                  isBusy ? "cursor-not-allowed opacity-70" : ""
                }`}
              >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style}`}>
                  <Icon size={17} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-sm font-extrabold text-[#111827]">
                      {notification.title}
                    </span>
                    {!notification.isRead && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-[#f97316]" />
                    )}
                  </span>
                  {notification.body && (
                    <span className="mt-0.5 block text-xs font-medium leading-relaxed text-[#7c7267]">
                      {notification.body}
                    </span>
                  )}
                  <span className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-[#b3a798]">
                    <Clock size={10} />
                    {timeAgo(notification.createdAt)}
                  </span>
                </span>
                {isBusy ? (
                  <Loader2 size={14} className="mt-1 shrink-0 animate-spin text-[#c0ac98]" />
                ) : notification.isRead ? (
                  <Check size={14} className="mt-1 shrink-0 text-[#c0ac98]" />
                ) : null}
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}
