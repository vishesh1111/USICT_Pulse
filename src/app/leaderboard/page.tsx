"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Crown, Star, Shield, MessageCircle, Github, Linkedin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

interface LeaderboardSenior {
  id: string;
  fullName: string;
  email: string;
  branch: string | null;
  year: number | null;
  cgpa: number | null;
  clubs: string[];
  linkedin: string | null;
  github: string | null;
  seniorScore: number | null;
  avatarUrl: string | null;
  createdAt: string;
  _count: { answers: number };
}

const RANK_STYLES = [
  {
    bg: "from-amber-500/20 via-yellow-500/10 to-amber-500/5",
    border: "border-amber-500/40",
    icon: Crown,
    color: "text-amber-400",
    badge: "bg-amber-500/20 text-amber-300",
    glow: "shadow-amber-500/20",
    label: "🥇 1st",
  },
  {
    bg: "from-slate-300/15 via-slate-400/5 to-slate-300/5",
    border: "border-slate-400/40",
    icon: Medal,
    color: "text-slate-300",
    badge: "bg-slate-400/20 text-slate-300",
    glow: "shadow-slate-400/15",
    label: "🥈 2nd",
  },
  {
    bg: "from-orange-600/15 via-orange-500/5 to-orange-600/5",
    border: "border-orange-500/40",
    icon: Medal,
    color: "text-orange-400",
    badge: "bg-orange-500/20 text-orange-300",
    glow: "shadow-orange-500/15",
    label: "🥉 3rd",
  },
];

export default function LeaderboardPage() {
  const [seniors, setSeniors] = React.useState<LeaderboardSenior[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/users?leaderboard=true")
      .then((r) => r.json())
      .then((data) => setSeniors(data.seniors || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      <div className="mb-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-1.5 text-amber-400 mb-4"
        >
          <Trophy className="h-4 w-4" />
          <span className="text-sm font-semibold">Senior Leaderboard</span>
        </motion.div>
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          Top Senior Mentors
        </h1>
        <p className="mt-2 text-muted-foreground">
          Ranked by credibility score based on profile, academics, and experience.
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
        </div>
      )}

      {!loading && seniors.length === 0 && (
        <motion.div
          className="rounded-2xl border border-dashed border-border/60 bg-card/20 p-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Trophy className="mx-auto h-12 w-12 text-muted-foreground/40" />
          <p className="mt-4 font-display text-lg font-semibold">No seniors yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            When seniors sign up, they&apos;ll appear on the leaderboard.
          </p>
        </motion.div>
      )}

      <div className="space-y-4">
        {seniors.map((senior, idx) => {
          const rank = idx + 1;
          const isTop3 = rank <= 3;
          const style = isTop3 ? RANK_STYLES[idx] : null;
          const scorePercent = ((senior.seniorScore || 0) / 100) * 100;

          return (
            <motion.div
              key={senior.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
            >
              <Card
                className={`overflow-hidden transition-all ${
                  isTop3
                    ? `border ${style!.border} bg-gradient-to-r ${style!.bg} shadow-lg ${style!.glow}`
                    : "border-border/60 bg-card/50 hover:border-purple-500/30"
                }`}
              >
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="flex flex-col items-center w-12 shrink-0">
                      {isTop3 ? (
                        <motion.div
                          initial={{ scale: 0, rotate: -20 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.3 + idx * 0.1, type: "spring" }}
                        >
                          {React.createElement(style!.icon, {
                            className: `h-7 w-7 ${style!.color}`,
                          })}
                        </motion.div>
                      ) : (
                        <span className="font-display text-2xl font-bold text-muted-foreground">
                          {rank}
                        </span>
                      )}
                      {isTop3 && (
                        <span className="text-[10px] font-bold mt-0.5">{style!.label}</span>
                      )}
                    </div>

                    {/* Avatar */}
                    <Avatar className={`h-12 w-12 shrink-0 ${isTop3 ? "ring-2 ring-offset-2 ring-offset-background" : ""} ${isTop3 ? `ring-${idx === 0 ? "amber" : idx === 1 ? "slate" : "orange"}-500/50` : ""}`}>
                      {senior.avatarUrl && <AvatarImage src={senior.avatarUrl} />}
                      <AvatarFallback>{getInitials(senior.fullName)}</AvatarFallback>
                    </Avatar>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold truncate">{senior.fullName}</h3>
                        <Badge variant="secondary" className="text-[10px] bg-purple-500/10 text-purple-400 py-0">
                          <Shield className="mr-0.5 h-2.5 w-2.5" />
                          Senior
                        </Badge>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                        {senior.branch && <span>{senior.branch}</span>}
                        {senior.cgpa && <span>CGPA: {senior.cgpa}</span>}
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {senior._count.answers} answers
                        </span>
                        {senior.clubs.length > 0 && (
                          <span>{senior.clubs.slice(0, 2).join(", ")}</span>
                        )}
                      </div>
                      {/* Links */}
                      <div className="mt-1.5 flex items-center gap-2">
                        {senior.linkedin && (
                          <a
                            href={senior.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Linkedin className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {senior.github && (
                          <a
                            href={senior.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-white"
                          >
                            <Github className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Score */}
                    <div className="text-right shrink-0">
                      <motion.div
                        className={`font-display text-2xl font-bold ${
                          (senior.seniorScore || 0) >= 80
                            ? "text-emerald-400"
                            : (senior.seniorScore || 0) >= 50
                            ? "text-amber-400"
                            : "text-red-400"
                        }`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + idx * 0.08 }}
                      >
                        {senior.seniorScore || 0}
                      </motion.div>
                      <p className="text-[10px] text-muted-foreground">points</p>
                      {/* Mini bar */}
                      <div className="mt-1.5 h-1.5 w-16 rounded-full bg-muted/50 overflow-hidden ml-auto">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500"
                          initial={{ width: "0%" }}
                          animate={{ width: `${scorePercent}%` }}
                          transition={{ duration: 1, delay: 0.8 + idx * 0.08 }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
