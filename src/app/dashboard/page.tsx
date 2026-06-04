"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useUserStore } from "@/lib/user-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";
import { GlowPulse } from "@/components/motion-primitives";

// Intel widgets
import { HighestImpactAction } from "@/components/intel/highest-impact-action";
import { OpportunityMatch } from "@/components/intel/opportunity-match";
import { DeadlineRadar } from "@/components/intel/deadline-radar";
import { RecommendedMentors } from "@/components/intel/recommended-mentors";
import { TeacherIntel } from "@/components/intel/teacher-intel";
import { UpcomingEvents } from "@/components/intel/upcoming-events";
import { WhatsHappening } from "@/components/intel/whats-happening";
import { ResumeReadiness } from "@/components/intel/resume-readiness";

export default function DashboardPage() {
  const router = useRouter();
  const profile = useUserStore((s) => s.profile);

  if (!profile) return null;

  const isSenior = profile.role === "senior";

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <motion.div
        className="relative mb-10 overflow-hidden rounded-2xl border border-pulse-500/20 bg-gradient-to-br from-pulse-500/10 via-fuchsia-500/5 to-transparent p-8 md:p-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <GlowPulse className="-right-10 -top-10 h-40 w-40" color="pulse" />
        <GlowPulse className="-left-10 bottom-0 h-32 w-32" color="fuchsia" />
        <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <motion.p
              className="text-sm text-pulse-400"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Welcome back {isSenior ? "senior" : "junior"},
            </motion.p>
            <motion.h1
              className="font-display text-3xl font-bold tracking-tight md:text-4xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {profile.fullName}
            </motion.h1>
            <motion.div
              className="mt-2 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              <span className="text-muted-foreground">
                Year {profile.year} · {profile.branch}
              </span>
              <Badge
                className={`text-[10px] ${
                  isSenior
                    ? "bg-purple-500/15 text-purple-400"
                    : "bg-cyan-500/15 text-cyan-400"
                }`}
              >
                {isSenior ? "Senior Mentor" : "Explorer"}
              </Badge>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.4,
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
          >
            <Avatar className="h-20 w-20 ring-4 ring-pulse-500/30 transition-all hover:ring-pulse-500/60 hover:shadow-xl hover:shadow-pulse-500/20">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                  profile.avatarSeed
                )}`}
                alt={profile.fullName}
              />
              <AvatarFallback>{getInitials(profile.fullName)}</AvatarFallback>
            </Avatar>
          </motion.div>
        </div>
      </motion.div>

      {/* ── §1 Highest Impact Action (full-width hero) ───────────────── */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <HighestImpactAction profile={profile} />
      </motion.div>

      {/* ── §2 + §3: Opportunities + Deadline Radar ──────────────────── */}
      <div className="mb-8 grid gap-8 lg:grid-cols-5">
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <OpportunityMatch profile={profile} />
        </motion.div>
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.65, duration: 0.5 }}
        >
          <DeadlineRadar profile={profile} />
        </motion.div>
      </div>

      {/* ── §4 + §5: Mentors + Teacher Intel ─────────────────────────── */}
      <div className="mb-8 grid gap-8 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <RecommendedMentors profile={profile} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.5 }}
        >
          <TeacherIntel profile={profile} />
        </motion.div>
      </div>

      {/* ── §6 Upcoming Events (full-width) ──────────────────────────── */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <UpcomingEvents profile={profile} />
      </motion.div>

      {/* ── §7 + §8: What's Happening + Resume Readiness ─────────────── */}
      <div className="grid gap-8 lg:grid-cols-5">
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.85, duration: 0.5 }}
        >
          <WhatsHappening profile={profile} />
        </motion.div>
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <ResumeReadiness profile={profile} />
        </motion.div>
      </div>
    </div>
  );
}
