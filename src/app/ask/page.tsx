import { MessageCircleQuestion } from "lucide-react";
import { ComingSoon } from "@/components/coming-soon";

export const metadata = { title: "Ask — USICT PULSE" };

export default function AskPage() {
  return (
    <ComingSoon
      title="Ask anything, anonymously"
      description="Post a question and get answers from seniors, alumni, and teachers — fast, judgement-free, and searchable for everyone."
      icon={MessageCircleQuestion}
      features={[
        "Anonymous posting",
        "Tag by subject & branch",
        "Verified-mentor answers",
        "Upvote the best replies",
        "Search a growing knowledge base",
        "Get notified on replies",
      ]}
    />
  );
}
