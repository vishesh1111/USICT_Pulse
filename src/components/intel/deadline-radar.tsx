"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Target, ArrowRight, CalendarClock } from "lucide-react";
import { getDeadlineRadar } from "@/lib/intel-engine";
import type { UserProfile } from "@/lib/user-store";

const urgencyStyles = {
  critical: {
    badge: "border-red-500/20 bg-red-500/10 text-red-400 animate-pulse",
    dot: "bg-red-500",
    row: "border-l-2 border-l-red-500/50",
  },
  warning: {
    badge: "border-amber-500/20 bg-amber-500/10 text-amber-400",
    dot: "bg-amber-500",
    row: "border-l-2 border-l-amber-500/50",
  },
  safe: {
    badge: "border-green-500/20 bg-green-500/10 text-green-400",
    dot: "bg-green-500",
    row: "border-l-2 border-l-green-500/50",
  },
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export function DeadlineRadar({ profile }: { profile: UserProfile }) {
  const deadlines = getDeadlineRadar(profile);

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
          <Target className="h-5 w-5 text-fuchsia-400" />
          <h3 className="text-lg font-semibold tracking-tight">Deadline Radar</h3>
        </div>
        <Button variant="ghost" size="sm" asChild className="gap-1 text-muted-foreground hover:text-foreground">
          <Link href="/opportunities">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      {deadlines.length === 0 ? (
        <Card className="border-border/60 bg-card/50 backdrop-blur">
          <CardContent className="flex flex-col items-center justify-center gap-2 py-10 text-center">
            <CalendarClock className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No upcoming deadlines</p>
            <p className="text-xs text-muted-foreground/60">You&apos;re all clear for now!</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/60 bg-card/50 backdrop-blur">
          <CardContent className="divide-y divide-border/40 p-0">
            {deadlines.map((d) => {
              const styles = urgencyStyles[d.urgency];
              return (
                <motion.div
                  key={d.id}
                  variants={item}
                  className={`flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-muted/20 ${styles.row}`}
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="truncate text-sm font-medium text-foreground">{d.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{d.organization}</p>
                  </div>

                  <Badge variant="outline" className={`shrink-0 text-xs ${styles.badge}`}>
                    {d.daysLeft === 1 ? "1 day" : `${d.daysLeft} days`}
                  </Badge>
                </motion.div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </motion.section>
  );
}
