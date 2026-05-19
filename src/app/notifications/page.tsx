"use client";

import * as React from "react";
import { CheckCheck, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationItem } from "@/components/notifications/notification-item";
import { MOCK_NOTIFICATIONS } from "@/lib/mock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
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
           <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
             <CheckCheck className="h-4 w-4 mr-2" />
             Mark all as read
           </Button>
           <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
           </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6 bg-card border-border/60">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-3">
          {notifications.map(notification => (
              <NotificationItem key={notification.id} notification={notification} />
          ))}
        </TabsContent>
        <TabsContent value="unread" className="space-y-3">
          {notifications.filter(n => !n.read).length > 0 ? (
              notifications.filter(n => !n.read).map(notification => (
                  <NotificationItem key={notification.id} notification={notification} />
              ))
          ) : (
             <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg border-border/60 bg-card/10">
                You're all caught up!
             </div>
          )}
        </TabsContent>
        <TabsContent value="opportunities" className="space-y-3">
          {notifications.filter(n => n.type === 'OPPORTUNITY' || n.type === 'DEADLINE').map(notification => (
              <NotificationItem key={notification.id} notification={notification} />
          ))}
        </TabsContent>
      </Tabs>
      
    </div>
  );
}
