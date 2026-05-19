"use client";

import * as React from "react";
import { CheckCheck, Settings, Zap, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NotificationItem } from "@/components/notifications/notification-item";
import { NotificationPreferences } from "@/components/notifications/notification-preferences";
import { MOCK_NOTIFICATIONS } from "@/lib/mock";
import { MOCK_OPPORTUNITIES } from "@/lib/mock";
import { useNotificationStore } from "@/lib/notification-store";
import { useUserStore } from "@/lib/user-store";
import {
  generateDeadlineAlerts,
  generateQuestionAlert,
  generateWeeklyDigest,
  sendBrowserNotification,
  getEmailPreview,
} from "@/lib/notification-engine";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function NotificationsPage() {
  const profile = useUserStore((s) => s.profile);
  const isSenior = profile?.role === "senior";

  const {
    engineNotifications,
    addNotifications,
    markAllRead,
    preferences,
    lastEngineRun,
    setLastEngineRun,
  } = useNotificationStore();

  const [prefsOpen, setPrefsOpen] = React.useState(false);
  const [mockNotifs, setMockNotifs] = React.useState(MOCK_NOTIFICATIONS);

  // Run notification engine on mount (once per session / every 30 min)
  React.useEffect(() => {
    const now = new Date();
    const lastRun = lastEngineRun ? new Date(lastEngineRun) : null;
    const thirtyMinAgo = new Date(now.getTime() - 30 * 60 * 1000);

    if (lastRun && lastRun > thirtyMinAgo) return; // Already ran recently

    const newAlerts: typeof MOCK_NOTIFICATIONS = [];

    // 1. Deadline alerts
    if (preferences.deadlineAlerts) {
      const deadlines = generateDeadlineAlerts(MOCK_OPPORTUNITIES);
      newAlerts.push(...deadlines);

      // Browser + email simulation for urgent ones
      const urgent = deadlines.filter((d) => d.title.includes("🔴"));
      if (urgent.length > 0 && preferences.browserNotifications) {
        sendBrowserNotification(
          urgent[0].title.replace(/🔴 /, ""),
          urgent[0].body
        );
      }
      if (urgent.length > 0 && profile?.email) {
        toast(getEmailPreview(profile.email, urgent[0].title), {
          duration: 5000,
        });
      }
    }

    // 2. Anonymous question alert (seniors only)
    if (isSenior && preferences.questionAlerts) {
      const qAlert = generateQuestionAlert();
      newAlerts.push(qAlert);

      if (preferences.browserNotifications) {
        sendBrowserNotification(qAlert.title, qAlert.body);
      }
      if (profile?.email) {
        toast(getEmailPreview(profile.email, qAlert.title), {
          duration: 4000,
        });
      }
    }

    // 3. Weekly digest
    if (preferences.weeklyDigest) {
      const digest = generateWeeklyDigest(MOCK_OPPORTUNITIES);
      if (digest) newAlerts.push(digest);
    }

    if (newAlerts.length > 0) {
      addNotifications(newAlerts);
      setLastEngineRun(now.toISOString());
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Merge engine + mock notifications, sorted newest first
  const allNotifications = React.useMemo(() => {
    const merged = [...engineNotifications, ...mockNotifs];
    return merged.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [engineNotifications, mockNotifs]);

  const unreadCount = allNotifications.filter((n) => !n.read).length;
  const deadlineNotifs = allNotifications.filter(
    (n) => n.type === "DEADLINE" || n.type === "OPPORTUNITY"
  );
  const questionNotifs = allNotifications.filter((n) => n.type === "ANSWER");
  const digestNotifs = allNotifications.filter((n) => n.type === "SYSTEM");

  const handleMarkAllRead = () => {
    markAllRead();
    setMockNotifs((ns) => ns.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl flex items-center gap-3">
            Notifications
            {unreadCount > 0 && (
              <span className="bg-pulse-500 text-pulse-50 text-sm py-0.5 px-2 rounded-full font-medium">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="mt-2 text-muted-foreground">
            Stay updated on deadlines, opportunities, and messages.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Engine status badge */}
          <Badge
            variant="outline"
            className="gap-1.5 bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
          >
            <Zap className="h-3 w-3" />
            Engine Active
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark all read
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPrefsOpen(true)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Engine info card */}
      <motion.div
        className="mb-6 flex items-center gap-3 rounded-xl border border-pulse-500/20 bg-pulse-500/5 p-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="rounded-full bg-pulse-500/10 p-2">
          <Bell className="h-4 w-4 text-pulse-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">Notification Engine</p>
          <p className="text-xs text-muted-foreground">
            Auto-scanning deadlines, questions & events.{" "}
            {isSenior
              ? "You receive all 3 alert types."
              : "You receive deadline & digest alerts."}
          </p>
        </div>
        <Badge variant="secondary" className="text-[10px]">
          {engineNotifications.length} generated
        </Badge>
      </motion.div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6 bg-card border-border/60">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="deadlines">
            Deadlines
            {deadlineNotifs.filter((n) => !n.read).length > 0 && (
              <span className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-white">
                {deadlineNotifs.filter((n) => !n.read).length}
              </span>
            )}
          </TabsTrigger>
          {isSenior && (
            <TabsTrigger value="questions">
              Questions
              {questionNotifs.filter((n) => !n.read).length > 0 && (
                <span className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-fuchsia-500 text-[9px] font-bold text-white">
                  {questionNotifs.filter((n) => !n.read).length}
                </span>
              )}
            </TabsTrigger>
          )}
          <TabsTrigger value="digest">Digest</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3">
          {allNotifications.map((n) => (
            <NotificationItem key={n.id} notification={n} />
          ))}
        </TabsContent>

        <TabsContent value="unread" className="space-y-3">
          {allNotifications.filter((n) => !n.read).length > 0 ? (
            allNotifications
              .filter((n) => !n.read)
              .map((n) => <NotificationItem key={n.id} notification={n} />)
          ) : (
            <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg border-border/60 bg-card/10">
              You&apos;re all caught up! 🎉
            </div>
          )}
        </TabsContent>

        <TabsContent value="deadlines" className="space-y-3">
          {deadlineNotifs.length > 0 ? (
            deadlineNotifs.map((n) => (
              <NotificationItem key={n.id} notification={n} />
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg border-border/60 bg-card/10">
              No deadline alerts right now
            </div>
          )}
        </TabsContent>

        {isSenior && (
          <TabsContent value="questions" className="space-y-3">
            {questionNotifs.length > 0 ? (
              questionNotifs.map((n) => (
                <NotificationItem key={n.id} notification={n} />
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg border-border/60 bg-card/10">
                No question alerts yet
              </div>
            )}
          </TabsContent>
        )}

        <TabsContent value="digest" className="space-y-3">
          {digestNotifs.length > 0 ? (
            digestNotifs.map((n) => (
              <NotificationItem key={n.id} notification={n} />
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg border-border/60 bg-card/10">
              No digest updates yet
            </div>
          )}
        </TabsContent>
      </Tabs>

      <NotificationPreferences
        open={prefsOpen}
        onClose={() => setPrefsOpen(false)}
      />
    </div>
  );
}
