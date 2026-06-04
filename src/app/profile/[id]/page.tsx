"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Code2, Github, Linkedin, Globe, Twitter, ArrowLeft, Shield, CheckCircle, GraduationCap,
  BookOpen, MessageCircle, Star, Trophy
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getInitials } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const SOCIAL_FIELDS = [
  { key: "leetcode",    label: "LeetCode",     icon: Code2,    color: "text-amber-400" },
  { key: "github",     label: "GitHub",       icon: Github,   color: "text-slate-300" },
  { key: "linkedin",   label: "LinkedIn",     icon: Linkedin, color: "text-blue-400" },
  { key: "huggingface",label: "Hugging Face", icon: Globe,    color: "text-yellow-400" },
  { key: "twitter",    label: "Twitter / X",  icon: Twitter,  color: "text-sky-400" },
  { key: "portfolio",  label: "Portfolio",    icon: Globe,    color: "text-emerald-400" },
];

export default function PublicProfilePage() {
  const { id } = useParams() as { id: string };
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch(`/api/users/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-pulse-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold font-display">User Not Found</h1>
        <p className="mt-2 text-muted-foreground">This profile may have been removed.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/leaderboard"><ArrowLeft className="mr-2 h-4 w-4"/> Back to Leaderboard</Link>
        </Button>
      </div>
    );
  }

  const isSenior = user.role === "SENIOR" || user.role === "senior";
  const filledLinks = SOCIAL_FIELDS.filter((f) => user[f.key]);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 md:py-12">
      <Link href="/leaderboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-white transition-colors mb-6">
        <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Leaderboard
      </Link>

      {/* Hero card */}
      <motion.div
        className="mb-8 overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-pulse-500/10 via-fuchsia-500/5 to-transparent p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <Avatar className="h-24 w-24 ring-4 ring-pulse-500/30 shrink-0">
            {user.avatarUrl && <AvatarImage src={user.avatarUrl} />}
            <AvatarFallback className="text-xl">{getInitials(user.fullName)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h1 className="font-display text-2xl font-bold">{user.fullName}</h1>
              <Badge className={`text-[10px] ${isSenior ? "bg-purple-500/15 text-purple-400" : "bg-cyan-500/15 text-cyan-400"}`}>
                {isSenior && <Shield className="mr-1 h-3 w-3" />}
                {isSenior ? "Senior Mentor" : "Explorer"}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {user.branch} {user.year && `· Year ${user.year}`}
            </p>
            {user.cgpa && (
              <p className="mt-0.5 text-xs text-muted-foreground flex items-center justify-center sm:justify-start gap-1">
                <GraduationCap className="h-3 w-3" /> CGPA: {user.cgpa}
              </p>
            )}
            
            {user.bio && (
              <p className="mt-3 text-sm italic text-muted-foreground max-w-md mx-auto sm:mx-0">
                "{user.bio}"
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-1.5 justify-center sm:justify-start">
              {(user.interests || []).map((i: string) => (
                <Badge key={i} variant="secondary" className="text-[10px] py-0">{i}</Badge>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Details Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* About / Experience */}
        <motion.div className="md:col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-border/60 bg-card/50 h-full">
            <CardContent className="p-6">
              <h2 className="font-display text-lg font-bold mb-4">Background</h2>
              
              <div className="space-y-4 text-sm">
                {user.skills && user.skills.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-muted-foreground mb-1.5 text-xs uppercase tracking-wider">Top Skills</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {user.skills.map((s: string) => (
                        <span key={s} className="bg-white/5 border border-white/10 rounded px-2 py-0.5 text-xs">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {user.achievements && user.achievements.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-muted-foreground mb-1.5 text-xs uppercase tracking-wider">Achievements</h3>
                    <ul className="space-y-1">
                      {user.achievements.map((a: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-3.5 w-3.5 text-pulse-400 mt-0.5 shrink-0" />
                          <span className="text-muted-foreground">{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {user.clubs && user.clubs.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-muted-foreground mb-1.5 text-xs uppercase tracking-wider">Societies</h3>
                    <p className="text-muted-foreground">{user.clubs.join(", ")}</p>
                  </div>
                )}

                {user.hasInternship && user.internshipDetails && (
                  <div>
                    <h3 className="font-semibold text-emerald-400 mb-1.5 text-xs uppercase tracking-wider">Internship Experience</h3>
                    <p className="text-muted-foreground">{user.internshipDetails}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Column: Social & Activity */}
        <div className="space-y-6">
          {/* Social Links */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-border/60 bg-card/50">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-display text-lg font-bold">Social Profiles</h2>
                  <Badge variant="secondary" className="text-[10px]">{filledLinks.length} connected</Badge>
                </div>

                {filledLinks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-white/10 rounded-xl">
                    <Globe className="h-8 w-8 text-muted-foreground/30 mb-2" />
                    <p className="text-sm text-muted-foreground">No links provided</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filledLinks.map(({ key, label, icon: Icon, color }) => {
                      let url = user[key];
                      if (!url.startsWith('http')) {
                        url = `https://${url}`;
                      }
                      return (
                        <a
                          key={key}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-3 rounded-lg border border-white/5 bg-white/5 p-3 transition-colors hover:bg-white/10"
                        >
                          <Icon className={`h-5 w-5 shrink-0 ${color}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{label}</p>
                            <p className="text-xs text-muted-foreground truncate group-hover:text-white/70 transition-colors">
                              {user[key]}
                            </p>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Activity Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-border/60 bg-card/50 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pulse-500/5 to-transparent pointer-events-none" />
              <CardContent className="p-6 relative">
                <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-400" /> Platform Impact
                </h2>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white/5 rounded-xl p-2 flex flex-col items-center justify-center text-center">
                    <BookOpen className="h-5 w-5 text-pulse-400 mb-1" />
                    <span className="font-display text-lg font-bold">{user.resourcesCount || 0}</span>
                    <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Resources<br/>Added</span>
                  </div>
                  <div className="bg-white/5 rounded-xl p-2 flex flex-col items-center justify-center text-center">
                    <MessageCircle className="h-5 w-5 text-cyan-400 mb-1" />
                    <span className="font-display text-lg font-bold">{user.answersCount || 0}</span>
                    <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Questions<br/>Answered</span>
                  </div>
                  <div className="bg-white/5 rounded-xl p-2 flex flex-col items-center justify-center text-center">
                    <Trophy className="h-5 w-5 text-fuchsia-400 mb-1" />
                    <span className="font-display text-lg font-bold">{user.opportunitiesCount || 0}</span>
                    <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Opportunities<br/>Posted</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Credibility Breakdown (if senior) */}
      {user.scoreBreakdown && (
        <motion.div className="mt-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-pulse-500/30 bg-card/50 overflow-hidden relative border">
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-pulse-500/20 rounded-full blur-3xl pointer-events-none" />
            <CardContent className="p-6 relative">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div>
                  <h2 className="font-display text-xl font-bold flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-400" /> Credibility Score Breakdown
                  </h2>
                  <p className="text-sm text-muted-foreground">How {user.fullName.split(' ')[0]} secured their leaderboard rank.</p>
                </div>
                <div className="flex items-center gap-2 bg-pulse-500/10 px-4 py-2 rounded-full border border-pulse-500/20">
                  <span className="text-sm font-medium">Total Score</span>
                  <span className="font-display text-2xl font-bold text-pulse-400">{user.seniorScore}</span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {user.scoreBreakdown.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/5">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="font-bold text-emerald-400">+{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
