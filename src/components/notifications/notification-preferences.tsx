"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, Clock, MessageCircle, CalendarDays, Mail } from "lucide-react";
import { useNotificationStore } from "@/lib/notification-store";
import { useUserStore } from "@/lib/user-store";
import { requestBrowserPermission } from "@/lib/notification-engine";
import { toast } from "sonner";

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
        checked ? "bg-pulse-500" : "bg-muted/50"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transform transition-transform duration-200 mt-0.5 ${
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export function NotificationPreferences({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { preferences, setPreferences } = useNotificationStore();
  const profile = useUserStore((s) => s.profile);
  const isSenior = profile?.role === "senior";

  const handleBrowserToggle = async (v: boolean) => {
    if (v) {
      const granted = await requestBrowserPermission();
      if (!granted) {
        toast.error("Browser notifications were denied. Please enable them in your browser settings.");
        return;
      }
      toast.success("Browser notifications enabled! 🔔");
    }
    setPreferences({ browserNotifications: v });
  };

  if (!open) return null;

  const items = [
    {
      icon: Clock,
      color: "text-amber-500 bg-amber-500/10",
      title: "Deadline Alerts",
      desc: "Get notified when opportunity deadlines are 1-2 days away or missed.",
      key: "deadlineAlerts" as const,
      show: true,
    },
    {
      icon: MessageCircle,
      color: "text-fuchsia-500 bg-fuchsia-500/10",
      title: "Anonymous Question Alerts",
      desc: "Get notified when a junior posts a question and needs help.",
      key: "questionAlerts" as const,
      show: isSenior,
    },
    {
      icon: CalendarDays,
      color: "text-emerald-500 bg-emerald-500/10",
      title: "Weekly Club Digest",
      desc: "Weekly summary of upcoming club and society events.",
      key: "weeklyDigest" as const,
      show: true,
    },
    {
      icon: Bell,
      color: "text-blue-500 bg-blue-500/10",
      title: "Browser Notifications",
      desc: "Receive desktop push notifications for urgent alerts.",
      key: "browserNotifications" as const,
      show: true,
      customHandler: handleBrowserToggle,
    },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/[0.08] bg-card/95 shadow-2xl backdrop-blur-xl"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="h-1 bg-gradient-to-r from-pulse-500 via-fuchsia-500 to-pulse-400" />
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold">
                    Notification Preferences
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Choose what alerts you want to receive
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 hover:bg-muted/50 transition-colors"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              {/* Email display */}
              {profile && (
                <div className="mb-5 flex items-center gap-3 rounded-xl border border-border/40 bg-muted/20 p-3">
                  <div className="rounded-full bg-pulse-500/10 p-2">
                    <Mail className="h-4 w-4 text-pulse-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Alerts will be sent to
                    </p>
                    <p className="text-sm font-medium">{profile.email}</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {items
                  .filter((i) => i.show)
                  .map((item, idx) => (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      className="flex items-start gap-3 rounded-xl border border-border/40 bg-background/30 p-4"
                    >
                      <div className={`mt-0.5 rounded-full p-2 ${item.color}`}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">{item.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {item.desc}
                        </p>
                      </div>
                      <Toggle
                        checked={preferences[item.key]}
                        onChange={
                          item.customHandler ||
                          ((v) => setPreferences({ [item.key]: v }))
                        }
                      />
                    </motion.div>
                  ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
