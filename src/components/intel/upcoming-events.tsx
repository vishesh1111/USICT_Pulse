"use client";

import { motion } from "framer-motion";
import { Calendar, ChevronRight, CalendarX } from "lucide-react";
import Link from "next/link";
import { getUpcomingEvents } from "@/lib/intel-engine";
import type { UserProfile } from "@/lib/user-store";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const dotColor: Record<string, string> = {
  event: "bg-pulse-500 shadow-pulse-500/50",
  club: "bg-purple-500 shadow-purple-500/50",
  deadline: "bg-amber-500 shadow-amber-500/50",
  notification: "bg-rose-500 shadow-rose-500/50",
};

const dotRing: Record<string, string> = {
  event: "ring-pulse-500/30",
  club: "ring-purple-500/30",
  deadline: "ring-amber-500/30",
  notification: "ring-rose-500/30",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return {
    day: d.getDate(),
    month: d.toLocaleString("en-US", { month: "short" }).toUpperCase(),
  };
}

export function UpcomingEvents({ profile }: { profile: UserProfile }) {
  const events = getUpcomingEvents(profile);

  return (
    <section>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-pulse-500/20 to-purple-500/20 ring-1 ring-pulse-500/30">
            <Calendar className="h-4 w-4 text-pulse-400" />
          </div>
          <h2 className="text-lg font-semibold tracking-tight">Coming Up</h2>
        </div>
        <Link
          href="/notifications"
          className="group flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-pulse-400"
        >
          View all
          <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="rounded-xl border border-border/40 bg-card/30 p-8 text-center backdrop-blur">
          <CalendarX className="mx-auto h-8 w-8 text-muted-foreground/40" />
          <p className="mt-2 text-sm text-muted-foreground">
            No upcoming events
          </p>
          <p className="text-xs text-muted-foreground/60">
            Check back soon for new events and deadlines.
          </p>
        </div>
      ) : (
        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {events.map((evt, idx) => {
            const { day, month } = formatDate(evt.date);
            const isLast = idx === events.length - 1;

            return (
              <motion.div
                key={evt.id}
                variants={itemVariants}
                className="group relative flex gap-4 pb-5 last:pb-0"
              >
                {/* Timeline spine */}
                <div className="relative flex flex-col items-center">
                  {/* Dot */}
                  <div
                    className={`relative z-10 h-3 w-3 rounded-full ring-4 ${dotColor[evt.type]} ${dotRing[evt.type]} shadow-md transition-transform duration-200 group-hover:scale-125`}
                  />
                  {/* Line */}
                  {!isLast && (
                    <div className="absolute top-3 h-full w-px bg-gradient-to-b from-border/60 to-transparent" />
                  )}
                </div>

                {/* Content */}
                <div className="-mt-0.5 flex flex-1 items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-sm font-medium leading-tight transition-colors group-hover:text-pulse-400">
                      {evt.title}
                    </h3>
                    {evt.organization && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {evt.organization}
                      </p>
                    )}
                  </div>

                  {/* Date badge */}
                  <div className="flex shrink-0 flex-col items-center rounded-lg border border-border/40 bg-card/60 px-2.5 py-1 text-center backdrop-blur">
                    <span className="text-base font-bold leading-none">
                      {day}
                    </span>
                    <span className="text-[9px] font-semibold tracking-widest text-muted-foreground">
                      {month}
                    </span>
                    {evt.daysLeft > 0 && (
                      <span
                        className={`mt-0.5 text-[9px] font-bold ${
                          evt.daysLeft <= 3
                            ? "text-red-400"
                            : evt.daysLeft <= 7
                              ? "text-amber-400"
                              : "text-emerald-400"
                        }`}
                      >
                        {evt.daysLeft}d left
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </section>
  );
}
