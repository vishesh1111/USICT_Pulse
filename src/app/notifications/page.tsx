import { Bell } from "lucide-react";
import { ComingSoon } from "@/components/coming-soon";

export const metadata = { title: "Notifications — USICT PULSE" };

export default function NotificationsPage() {
  return (
    <ComingSoon
      title="Never miss what matters"
      description="A personalized notification center for deadlines, mentor replies, new opportunities, and Q&A activity."
      icon={Bell}
      features={[
        "Deadline reminders",
        "Mentor reply alerts",
        "New opportunity matches",
        "Weekly digest emails",
        "Granular preferences",
        "Snooze & mark all read",
      ]}
    />
  );
}
