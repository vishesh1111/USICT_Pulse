import type { MockNotification, MockOpportunity } from "@/lib/mock/types";
import { daysUntil } from "@/lib/utils";

// ── Deadline alerts ─────────────────────────────────────────────────────

export function generateDeadlineAlerts(
  opportunities: MockOpportunity[]
): MockNotification[] {
  const alerts: MockNotification[] = [];

  for (const op of opportunities) {
    const days = daysUntil(op.deadline);

    if (days <= 0) {
      // Missed deadline
      alerts.push({
        id: `engine-deadline-missed-${op.id}`,
        type: "DEADLINE",
        title: `⚠️ ${op.title} — Deadline passed!`,
        body: `The deadline for ${op.organization} has already passed. Look for similar opportunities.`,
        link: "/opportunities",
        read: false,
        createdAt: new Date().toISOString(),
      });
    } else if (days <= 2) {
      // Urgent — 1-2 days left
      alerts.push({
        id: `engine-deadline-urgent-${op.id}`,
        type: "DEADLINE",
        title: `🔴 ${op.title} — ${days} day${days === 1 ? "" : "s"} left!`,
        body: `Hurry! ${op.organization} deadline is ${days === 1 ? "tomorrow" : "in 2 days"}. Apply now before it's too late.`,
        link: "/opportunities",
        read: false,
        createdAt: new Date().toISOString(),
      });
    } else if (days <= 5) {
      // Warning — 3-5 days
      alerts.push({
        id: `engine-deadline-warn-${op.id}`,
        type: "DEADLINE",
        title: `🟡 ${op.title} — ${days} days left`,
        body: `${op.organization} deadline is approaching. Don't forget to apply.`,
        link: "/opportunities",
        read: false,
        createdAt: new Date().toISOString(),
      });
    }
  }

  return alerts;
}

// ── Anonymous question alert (seniors only) ─────────────────────────────

const SAMPLE_QUESTIONS = [
  "How to prepare for SDE internships in 2nd year?",
  "Best resources for GATE CSE preparation?",
  "How to start competitive programming from scratch?",
  "What projects should I build for my resume?",
  "How to get research internships at IITs?",
  "Is CGPA important for off-campus placements?",
  "How to transition from web dev to ML?",
  "Tips for cracking Amazon SDE intern interview?",
];

export function generateQuestionAlert(): MockNotification {
  const q = SAMPLE_QUESTIONS[Math.floor(Math.random() * SAMPLE_QUESTIONS.length)];
  return {
    id: `engine-question-${Date.now()}`,
    type: "ANSWER",
    title: "🙋 A junior needs your help!",
    body: `Anonymous question: "${q}" — Share your experience and help them out.`,
    link: "/ask",
    read: false,
    createdAt: new Date().toISOString(),
  };
}

// ── Weekly club digest ──────────────────────────────────────────────────

export function generateWeeklyDigest(
  opportunities: MockOpportunity[]
): MockNotification | null {
  const clubEvents = opportunities.filter(
    (o) => o.type === "CLUB" || o.type === "LOCAL"
  );

  if (clubEvents.length === 0) return null;

  const upcoming = clubEvents
    .filter((e) => daysUntil(e.deadline) > 0)
    .sort((a, b) => daysUntil(a.deadline) - daysUntil(b.deadline));

  const nearest = upcoming[0];
  const nearestDays = nearest ? daysUntil(nearest.deadline) : 0;

  return {
    id: `engine-digest-${new Date().toISOString().split("T")[0]}`,
    type: "SYSTEM",
    title: `📅 Weekly Digest — ${upcoming.length} upcoming events`,
    body: upcoming.length > 0
      ? `${nearest.title} by ${nearest.organization} is in ${nearestDays} days. ${upcoming.length > 1 ? `Plus ${upcoming.length - 1} more events this month.` : ""}`
      : "No upcoming club events this week.",
    link: "/opportunities?tab=clubs",
    read: false,
    createdAt: new Date().toISOString(),
  };
}

// ── Browser Notification API ────────────────────────────────────────────

export async function requestBrowserPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;

  const result = await Notification.requestPermission();
  return result === "granted";
}

export function sendBrowserNotification(title: string, body: string) {
  if (
    typeof window === "undefined" ||
    !("Notification" in window) ||
    Notification.permission !== "granted"
  )
    return;

  new Notification(title, {
    body,
    icon: "/favicon.ico",
    badge: "/favicon.ico",
  });
}

// ── Simulate email toast message ────────────────────────────────────────

export function getEmailPreview(email: string, title: string): string {
  return `📧 Email alert sent to ${email}: "${title}"`;
}
