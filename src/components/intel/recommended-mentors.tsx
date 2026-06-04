"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, ArrowRight, MessageCircle } from "lucide-react";
import { getRecommendedMentors } from "@/lib/intel-engine";
import { getInitials } from "@/lib/utils";
import type { UserProfile } from "@/lib/user-store";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export function RecommendedMentors({ profile }: { profile: UserProfile }) {
  const [seniors, setSeniors] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/users?leaderboard=true")
      .then((res) => res.json())
      .then((data) => {
        if (data.seniors) setSeniors(data.seniors);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const mentors = getRecommendedMentors(profile, seniors);

  if (loading) {
    return (
      <div className="flex h-32 items-center justify-center rounded-xl border border-border/60 bg-card/50">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-pulse-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Users className="h-5 w-5 text-pulse-400" />
          <h3 className="text-lg font-semibold tracking-tight">Mentors for you</h3>
        </div>
        <Button variant="ghost" size="sm" asChild className="gap-1 text-muted-foreground hover:text-foreground">
          <Link href="/connect">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      {mentors.length === 0 ? (
        <Card className="border-border/60 bg-card/50 backdrop-blur">
          <CardContent className="flex flex-col items-center justify-center gap-2 py-10 text-center">
            <Users className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No mentor matches yet</p>
            <p className="text-xs text-muted-foreground/60">Add more interests to find mentors</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {mentors.map((m) => (
            <motion.div key={m.mentor.id} variants={item}>
              <Card className="group border-border/60 bg-card/50 backdrop-blur transition-all duration-300 hover:border-pulse-500/30 hover:bg-card/70 hover:shadow-lg hover:shadow-pulse-500/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <Avatar className="h-11 w-11 ring-2 ring-border/40 transition-all group-hover:ring-pulse-500/30">
                      <AvatarImage src={m.mentor.avatarUrl} alt={m.mentor.fullName} />
                      <AvatarFallback className="bg-gradient-to-br from-pulse-500/20 to-fuchsia-500/20 text-xs font-semibold">
                        {getInitials(m.mentor.fullName)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Info */}
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div>
                        <p className="truncate text-sm font-semibold text-foreground">
                          {m.mentor.fullName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {m.mentor.branch} · Year {m.mentor.year}
                        </p>
                      </div>

                      {/* Topic overlap badges */}
                      <div className="flex flex-wrap gap-1">
                        {m.topicOverlap.slice(0, 3).map((topic) => (
                          <Badge
                            key={topic}
                            variant="outline"
                            className="border-border/40 bg-muted/30 text-[10px] text-muted-foreground"
                          >
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Connect button */}
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="shrink-0 gap-1.5 border-border/60 transition-colors group-hover:border-pulse-500/40 group-hover:text-pulse-400"
                    >
                      <Link href="/connect">
                        <MessageCircle className="h-3.5 w-3.5" />
                        Connect
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.section>
  );
}
