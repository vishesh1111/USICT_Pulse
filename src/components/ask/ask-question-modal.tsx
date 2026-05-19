"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Tag, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useUserStore } from "@/lib/user-store";
import emailjs from "@emailjs/browser";

const SUGGESTED_TAGS = [
  "Placements", "Internships", "GATE", "CAT", "DSA",
  "Web Dev", "AI/ML", "College Life", "Academics", "Projects",
];

export function AskQuestionModal({
  open,
  onClose,
  onSubmitted,
}: {
  open: boolean;
  onClose: () => void;
  onSubmitted: () => void;
}) {
  const profile = useUserStore((s) => s.profile);
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [tags, setTags] = React.useState<string[]>([]);
  const [anonymous, setAnonymous] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  const toggleTag = (t: string) =>
    setTags((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));

  const handleSubmit = async () => {
    if (!title.trim()) { toast.error("Please enter a question title"); return; }
    if (!body.trim()) { toast.error("Please add some details"); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          body,
          tags,
          anonymous,
          authorEmail: profile?.email,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit question");

      const data = await res.json();

      // Send email notifications to all seniors
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (serviceId && templateId && publicKey && data.seniorEmails?.length > 0) {
        // Send to first 5 seniors (EmailJS free tier limit)
        const emailPromises = data.seniorEmails.slice(0, 5).map((senior: { email: string; name: string }) =>
          emailjs.send(serviceId, templateId, {
            user_email: senior.email,
            name: senior.name,
            subject: `🙋 New Question: "${title}"`,
            message: `
              <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #a855f7, #6366f1); padding: 24px; border-radius: 16px 16px 0 0; text-align: center;">
                  <h2 style="color: white; margin: 0;">A Junior Needs Your Help! 🙋</h2>
                </div>
                <div style="background: #1a1a2e; padding: 24px; border-radius: 0 0 16px 16px; color: #e0e0e0;">
                  <p>Hey <strong style="color: #a78bfa;">${senior.name}</strong>,</p>
                  <p>A junior just asked a question on USICT PULSE:</p>
                  <div style="background: #2a2a4a; padding: 16px; border-radius: 12px; margin: 16px 0; border-left: 4px solid #a855f7;">
                    <h3 style="color: white; margin: 0 0 8px;">${title}</h3>
                    <p style="color: #ccc; margin: 0;">${body.substring(0, 200)}${body.length > 200 ? "..." : ""}</p>
                  </div>
                  <div style="text-align: center; margin-top: 20px;">
                    <a href="https://usict-pulse.vercel.app/ask" style="display: inline-block; background: linear-gradient(135deg, #a855f7, #6366f1); color: white; padding: 12px 28px; border-radius: 12px; text-decoration: none; font-weight: 600;">Answer Now →</a>
                  </div>
                </div>
              </div>
            `,
          }, publicKey).catch(() => {})
        );
        await Promise.allSettled(emailPromises);
        toast("📧 Seniors notified via email!", { duration: 3000 });
      }

      // Browser notification
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        new Notification("Question Posted! ✅", {
          body: `Your question "${title}" is now live. Seniors will be notified.`,
          icon: "/favicon.ico",
        });
      }

      toast.success("Question posted successfully!");
      setTitle("");
      setBody("");
      setTags([]);
      onSubmitted();
      onClose();
    } catch (err) {
      toast.error("Failed to post question. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.08] bg-card/95 shadow-2xl backdrop-blur-xl"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="h-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pulse-400" />
            <div className="p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold">Ask a Question</h2>
                  <p className="mt-0.5 text-sm text-muted-foreground">All seniors will be notified</p>
                </div>
                <button onClick={onClose} className="rounded-lg p-2 hover:bg-muted/50 transition-colors">
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="qtitle">Question</Label>
                  <Input
                    id="qtitle"
                    placeholder="E.g., How to prepare for placement season?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1.5 h-12 border-border/40 bg-background/50"
                  />
                </div>
                <div>
                  <Label htmlFor="qbody">Details</Label>
                  <textarea
                    id="qbody"
                    placeholder="Add context, what you've tried, or specific aspects you'd like help with..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="mt-1.5 min-h-28 w-full rounded-xl border border-border/40 bg-background/50 px-4 py-3 text-sm placeholder-muted-foreground/50 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                {/* Tags */}
                <div>
                  <Label className="flex items-center gap-1.5"><Tag className="h-3.5 w-3.5" />Tags</Label>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {SUGGESTED_TAGS.map((t) => (
                      <button
                        key={t}
                        onClick={() => toggleTag(t)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                          tags.includes(t)
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                            : "bg-muted/30 text-muted-foreground border border-transparent hover:bg-muted/50"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Anonymous toggle */}
                <button
                  onClick={() => setAnonymous(!anonymous)}
                  className="flex w-full items-center gap-3 rounded-xl border border-border/40 bg-background/30 p-3 text-left transition-all hover:bg-background/50"
                >
                  {anonymous ? (
                    <EyeOff className="h-4 w-4 text-purple-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-emerald-400" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {anonymous ? "Anonymous" : "Show my name"}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {anonymous ? "Seniors won't see your identity" : "Your name will be visible"}
                    </p>
                  </div>
                  <Badge variant={anonymous ? "secondary" : "outline"} className="text-[10px]">
                    {anonymous ? "Hidden" : "Visible"}
                  </Badge>
                </button>
              </div>

              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={onClose} className="border-border/40">
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-fuchsia-600 font-semibold shadow-lg shadow-purple-500/20"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Posting...
                    </span>
                  ) : (
                    <>
                      <Send className="mr-1.5 h-4 w-4" />
                      Post Question
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
