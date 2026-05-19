"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MessageCircle, ThumbsUp, HelpCircle, Shield, Clock, User, ChevronDown, ChevronUp,
} from "lucide-react";
import { useUserStore } from "@/lib/user-store";
import { AskQuestionModal } from "@/components/ask/ask-question-modal";
import { AnswerForm } from "@/components/ask/answer-form";
import { getInitials, timeAgo } from "@/lib/utils";

interface QuestionData {
  id: string;
  title: string;
  body: string;
  tags: string[];
  anonymous: boolean;
  helpfulCount: number;
  createdAt: string;
  author: { fullName: string; branch: string; avatarUrl: string | null } | null;
  answers: {
    id: string;
    body: string;
    createdAt: string;
    author: {
      fullName: string;
      seniorScore: number | null;
      branch: string;
      avatarUrl: string | null;
      role: string;
    };
  }[];
  _count: { answers: number };
}

export default function AskPage() {
  const profile = useUserStore((s) => s.profile);
  const isSenior = profile?.role === "senior";
  const [questions, setQuestions] = React.useState<QuestionData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [askOpen, setAskOpen] = React.useState(false);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [answeringId, setAnsweringId] = React.useState<string | null>(null);

  const fetchQuestions = React.useCallback(async () => {
    try {
      const res = await fetch("/api/questions");
      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (err) {
      console.error("Failed to fetch questions", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            {isSenior ? (
              <span className="text-purple-500">Answer Portal</span>
            ) : (
              <span className="text-purple-500">Ask Anything</span>
            )}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {isSenior
              ? "Help juniors by answering their questions. Your insights matter!"
              : "Anonymous Q&A with seniors. Ask freely, learn quickly."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isSenior ? (
            <Badge className="bg-purple-500/15 text-purple-400 border-purple-500/30 gap-1.5 py-1.5 px-3">
              <Shield className="h-3.5 w-3.5" />
              Senior Mentor
            </Badge>
          ) : (
            <Button
              onClick={() => setAskOpen(true)}
              className="bg-purple-500 hover:bg-purple-600 text-white shadow-lg shadow-purple-500/20"
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              Ask a Question
            </Button>
          )}
        </div>
      </div>

      {/* Engine info */}
      <motion.div
        className="mb-6 flex items-center gap-3 rounded-xl border border-purple-500/20 bg-purple-500/5 p-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="rounded-full bg-purple-500/10 p-2">
          <MessageCircle className="h-4 w-4 text-purple-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">
            {isSenior ? "Questions from Juniors" : "Real-time Q&A"}
          </p>
          <p className="text-xs text-muted-foreground">
            {isSenior
              ? "When a junior posts a question, you get an email alert. Answer to boost your leaderboard score."
              : "Post a question and all seniors get notified instantly via email."}
          </p>
        </div>
        <Badge variant="secondary" className="text-[10px]">
          {questions.length} questions
        </Badge>
      </motion.div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
        </div>
      )}

      {/* Empty state */}
      {!loading && questions.length === 0 && (
        <motion.div
          className="rounded-2xl border border-dashed border-border/60 bg-card/20 p-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground/40" />
          <p className="mt-4 font-display text-lg font-semibold">No questions yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {isSenior
              ? "When juniors post questions, they'll appear here."
              : "Be the first to ask! All seniors will be notified."}
          </p>
          {!isSenior && (
            <Button
              onClick={() => setAskOpen(true)}
              className="mt-4 bg-purple-500 hover:bg-purple-600"
            >
              Ask the first question
            </Button>
          )}
        </motion.div>
      )}

      {/* Questions list */}
      <div className="space-y-4">
        <AnimatePresence>
          {questions.map((q, idx) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="overflow-hidden border-border/60 bg-card/50 hover:border-purple-500/30 transition-all">
                <CardContent className="p-5">
                  <div className="flex gap-4">
                    {/* Upvotes */}
                    <div className="hidden sm:flex flex-col items-center gap-1 text-muted-foreground pt-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:text-purple-500 hover:bg-purple-500/10"
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-bold">{q.helpfulCount}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Meta */}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 flex-wrap">
                        {q.anonymous ? (
                          <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 text-[10px]">
                            <User className="mr-1 h-3 w-3" />
                            Anonymous
                          </Badge>
                        ) : q.author ? (
                          <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 text-[10px]">
                            {q.author.fullName}
                          </Badge>
                        ) : null}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {timeAgo(q.createdAt)}
                        </span>
                        {q.tags.map((t) => (
                          <Badge key={t} variant="outline" className="text-[10px] py-0">
                            {t}
                          </Badge>
                        ))}
                      </div>

                      {/* Question */}
                      <h3 className="text-base font-semibold">{q.title}</h3>
                      <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                        {q.body}
                      </p>

                      {/* Answer count + expand */}
                      <div className="mt-4 flex items-center justify-between">
                        <button
                          onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
                          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-purple-400 transition-colors"
                        >
                          <MessageCircle className="h-4 w-4" />
                          {q._count.answers} {q._count.answers === 1 ? "Answer" : "Answers"}
                          {expandedId === q.id ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          )}
                        </button>

                        {isSenior && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setAnsweringId(answeringId === q.id ? null : q.id)
                            }
                            className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                          >
                            <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
                            Answer
                          </Button>
                        )}
                      </div>

                      {/* Answer form (seniors) */}
                      {isSenior && answeringId === q.id && (
                        <AnswerForm
                          questionId={q.id}
                          onAnswered={() => {
                            setAnsweringId(null);
                            fetchQuestions();
                          }}
                        />
                      )}

                      {/* Answers list */}
                      <AnimatePresence>
                        {expandedId === q.id && q.answers.length > 0 && (
                          <motion.div
                            className="mt-4 space-y-3"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            {q.answers.map((ans) => (
                              <div
                                key={ans.id}
                                className="rounded-xl bg-muted/30 border border-border/30 p-4"
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <Avatar className="h-6 w-6">
                                    {ans.author.avatarUrl && (
                                      <AvatarImage src={ans.author.avatarUrl} />
                                    )}
                                    <AvatarFallback className="text-[10px]">
                                      {getInitials(ans.author.fullName)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm font-medium">
                                    {ans.author.fullName}
                                  </span>
                                  {ans.author.role === "SENIOR" && (
                                    <Badge
                                      variant="secondary"
                                      className="text-[9px] bg-purple-500/10 text-purple-400 py-0"
                                    >
                                      <Shield className="mr-0.5 h-2.5 w-2.5" />
                                      Senior
                                      {ans.author.seniorScore
                                        ? ` · ${ans.author.seniorScore}pts`
                                        : ""}
                                    </Badge>
                                  )}
                                  <span className="text-[10px] text-muted-foreground ml-auto">
                                    {timeAgo(ans.createdAt)}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {ans.body}
                                </p>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Ask modal (juniors only) */}
      {!isSenior && (
        <AskQuestionModal
          open={askOpen}
          onClose={() => setAskOpen(false)}
          onSubmitted={fetchQuestions}
        />
      )}
    </div>
  );
}
