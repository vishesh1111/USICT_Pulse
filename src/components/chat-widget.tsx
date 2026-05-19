"use client";

import * as React from "react";
import { useChat } from "@ai-sdk/react";
import { Bot, X, MessageSquare, Send, Sparkles, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { useUserStore } from "@/lib/user-store";
import { Button } from "@/components/ui/button";

export function ChatWidget() {
  const [isOpen, setIsOpen] = React.useState(false);
  const profile = useUserStore((s) => s.profile);
  
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: { userProfile: profile },
    initialMessages: [
      {
        id: '1',
        role: 'assistant',
        content: `Hi ${profile?.fullName?.split(' ')[0] || 'there'}! 👋 I'm the USICT PULSE AI. I can help you find internships, answer queries, or guide you through USICT. What's on your mind?`
      }
    ]
  });

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-20 right-4 z-50 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-card/95 shadow-2xl backdrop-blur-xl sm:right-8 sm:w-[400px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] bg-gradient-to-r from-pulse-500/10 to-fuchsia-500/10 p-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pulse-500 to-fuchsia-600 shadow-lg shadow-pulse-500/30">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm">PULSE Assistant</h3>
                  <p className="text-[10px] text-pulse-400 flex items-center gap-1">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pulse-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-pulse-500"></span>
                    </span>
                    Online — RAG Powered
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${m.role === 'user' ? 'bg-muted' : 'bg-gradient-to-br from-pulse-500/20 to-fuchsia-500/20 border border-pulse-500/30'}`}>
                    {m.role === 'user' ? <User className="h-3.5 w-3.5 text-muted-foreground" /> : <Sparkles className="h-3.5 w-3.5 text-pulse-400" />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.role === 'user' 
                      ? 'bg-pulse-500 text-white rounded-tr-sm' 
                      : 'bg-muted/50 border border-white/[0.05] rounded-tl-sm text-foreground/90'
                  }`}>
                    {m.role === 'assistant' ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-a:text-pulse-400">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                <div className="flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pulse-500/20 to-fuchsia-500/20 border border-pulse-500/30">
                    <Sparkles className="h-3.5 w-3.5 text-pulse-400" />
                  </div>
                  <div className="rounded-2xl rounded-tl-sm bg-muted/50 border border-white/[0.05] px-4 py-3">
                    <Loader2 className="h-4 w-4 animate-spin text-pulse-400" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/[0.08] bg-background/50">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!input.trim() || isLoading) return;
                  handleSubmit(e);
                }}
                className="relative flex items-center"
              >
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask about internships, resources..."
                  className="w-full rounded-xl border border-border/50 bg-background/50 py-3 pl-4 pr-12 text-sm placeholder:text-muted-foreground/60 focus:border-pulse-500/50 focus:outline-none focus:ring-1 focus:ring-pulse-500/50"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-pulse-500 text-white transition-transform hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5 -ml-0.5" />
                </button>
              </form>
              <div className="mt-2 text-center text-[9px] text-muted-foreground/60">
                PULSE AI may display inaccurate info, so double-check its answers.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="fixed bottom-4 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-pulse-500 to-fuchsia-600 shadow-xl shadow-pulse-500/30 transition-transform hover:scale-105 active:scale-95 sm:bottom-8 sm:right-8 group"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageSquare className="h-6 w-6 text-white group-hover:hidden" />
        <Bot className="h-6 w-6 text-white hidden group-hover:block" />
        {/* Unread dot */}
        {!isOpen && (
          <span className="absolute top-0 right-0 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 border-2 border-background">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
          </span>
        )}
      </motion.button>
    </>
  );
}
