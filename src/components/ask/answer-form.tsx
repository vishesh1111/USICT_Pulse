"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/lib/user-store";
import { toast } from "sonner";

export function AnswerForm({
  questionId,
  onAnswered,
}: {
  questionId: string;
  onAnswered: () => void;
}) {
  const profile = useUserStore((s) => s.profile);
  const [body, setBody] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    if (!body.trim()) {
      toast.error("Please write an answer");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/questions/${questionId}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body,
          authorEmail: profile?.email,
        }),
      });

      if (!res.ok) throw new Error("Failed to post answer");

      toast.success("Answer posted! 🎉");
      setBody("");
      onAnswered();
    } catch (err) {
      toast.error("Failed to post answer. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="mt-4 space-y-3"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.3 }}
    >
      <textarea
        placeholder="Share your experience and advice..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="min-h-24 w-full rounded-xl border border-purple-500/30 bg-purple-500/5 px-4 py-3 text-sm placeholder-muted-foreground/50 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
      />
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={loading}
          size="sm"
          className="bg-gradient-to-r from-purple-500 to-fuchsia-600 shadow-lg shadow-purple-500/20"
        >
          {loading ? (
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Posting...
            </span>
          ) : (
            <>
              <Send className="mr-1.5 h-3.5 w-3.5" />
              Post Answer
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
