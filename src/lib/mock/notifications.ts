import type { MockNotification } from "./types";

const hoursAgo = (n: number) =>
  new Date(Date.now() - n * 60 * 60 * 1000).toISOString();

export const MOCK_NOTIFICATIONS: MockNotification[] = [
  {
    id: "n-1",
    type: "DEADLINE",
    title: "Microsoft SDE Intern — closes in 14 days",
    body: "Don't miss the application deadline. Get your resume reviewed by an alum first.",
    link: "/opportunities",
    read: false,
    createdAt: hoursAgo(2),
  },
  {
    id: "n-2",
    type: "OPPORTUNITY",
    title: "New: Google Generation Scholarship 2026",
    body: "Matches your profile. ₹74,000 + mentorship.",
    link: "/opportunities",
    read: false,
    createdAt: hoursAgo(5),
  },
  {
    id: "n-3",
    type: "ANSWER",
    title: "Aarav Sharma answered your question",
    body: "About 'How to prepare for SDE internships in 2nd year' — view the response.",
    link: "/ask",
    read: false,
    createdAt: hoursAgo(8),
  },
  {
    id: "n-4",
    type: "MESSAGE",
    title: "Ishita Verma accepted your connection request",
    body: "You can now ask her about ML research internships.",
    link: "/connect",
    read: true,
    createdAt: hoursAgo(26),
  },
  {
    id: "n-5",
    type: "SYSTEM",
    title: "Welcome to USICT PULSE 🎉",
    body: "Your profile is 70% complete. Add 2 more skills to improve recommendations.",
    link: "/profile",
    read: true,
    createdAt: hoursAgo(72),
  },
];
