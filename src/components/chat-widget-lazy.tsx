"use client";

import dynamic from "next/dynamic";

// Lazy-load ChatWidget — it includes ReactMarkdown + framer-motion (~200KB)
// and is only needed when the user clicks the chat button.
const ChatWidget = dynamic(
  () => import("@/components/chat-widget").then((m) => ({ default: m.ChatWidget })),
  { ssr: false, loading: () => null }
);

export function ChatWidgetLazy() {
  return <ChatWidget />;
}
