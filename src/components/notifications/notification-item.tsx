import { Bell, Briefcase, MessageCircle, AlertCircle, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { timeAgo } from "@/lib/utils";
import type { MockNotification } from "@/lib/mock/types";
import Link from "next/link";

interface NotificationItemProps {
  notification: MockNotification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const isUnread = !notification.read;

  const IconMap = {
    DEADLINE: Calendar,
    OPPORTUNITY: Briefcase,
    MESSAGE: MessageCircle,
    ANSWER: MessageCircle,
    REVIEW: StarIcon, // Assuming Star isn't here, fallback to Bell
    SYSTEM: AlertCircle,
  };

  const IconComponent = IconMap[notification.type] || Bell;
  
  const iconColors: Record<string, string> = {
    DEADLINE: "text-amber-500 bg-amber-500/10",
    OPPORTUNITY: "text-emerald-500 bg-emerald-500/10",
    MESSAGE: "text-blue-500 bg-blue-500/10",
    ANSWER: "text-fuchsia-500 bg-fuchsia-500/10",
    SYSTEM: "text-pulse-500 bg-pulse-500/10",
  };

  const content = (
    <Card className={`transition-colors border-border/60 backdrop-blur ${isUnread ? "bg-accent/30 hover:bg-accent/40" : "bg-card/50 hover:bg-card"}`}>
      <CardContent className="flex items-start gap-4 p-4">
        <div className={`mt-1 rounded-full p-2 shrink-0 ${iconColors[notification.type] || "text-muted-foreground bg-accent"}`}>
           <IconComponent className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
             <h4 className={`text-sm ${isUnread ? "font-semibold text-foreground" : "font-medium text-foreground/90"}`}>
               {notification.title}
             </h4>
             <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
               {timeAgo(notification.createdAt)}
             </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {notification.body}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  if (notification.link) {
      return <Link href={notification.link}>{content}</Link>;
  }

  return content;
}

function StarIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
