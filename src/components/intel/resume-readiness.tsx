"use client";

import { motion } from "framer-motion";
import { Shield, Check, X, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getResumeReadiness } from "@/lib/intel-engine";
import type { UserProfile } from "@/lib/user-store";

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function getScoreColor(score: number) {
  if (score >= 75) return { stroke: "#22c55e", text: "text-emerald-400", glow: "drop-shadow(0 0 12px rgba(34,197,94,0.4))" };
  if (score >= 50) return { stroke: "#f59e0b", text: "text-amber-400", glow: "drop-shadow(0 0 12px rgba(245,158,11,0.4))" };
  return { stroke: "#ef4444", text: "text-red-400", glow: "drop-shadow(0 0 12px rgba(239,68,68,0.4))" };
}

export function ResumeReadiness({ profile }: { profile: UserProfile }) {
  const data = getResumeReadiness(profile);
  const { stroke, text, glow } = getScoreColor(data.score);
  const offset = CIRCUMFERENCE - (data.score / 100) * CIRCUMFERENCE;

  return (
    <section>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-pulse-500/20 ring-1 ring-emerald-500/30">
            <Shield className="h-4 w-4 text-emerald-400" />
          </div>
          <h2 className="text-lg font-semibold tracking-tight">
            Resume Readiness
          </h2>
        </div>
        <Link
          href="/resume-readiness"
          className="group flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-pulse-400"
        >
          View all
          <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Circle + Checklist */}
      <div className="rounded-xl border border-border/60 bg-card/50 p-5 backdrop-blur">
        {/* Circular progress */}
        <div className="flex justify-center">
          <div className="relative h-32 w-32">
            <svg
              className="h-full w-full -rotate-90"
              viewBox="0 0 120 120"
              style={{ filter: glow }}
            >
              {/* Track */}
              <circle
                cx="60"
                cy="60"
                r={RADIUS}
                fill="none"
                stroke="currentColor"
                className="text-muted/20"
                strokeWidth="8"
              />
              {/* Progress */}
              <motion.circle
                cx="60"
                cy="60"
                r={RADIUS}
                fill="none"
                stroke={stroke}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                initial={{ strokeDashoffset: CIRCUMFERENCE }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              />
            </svg>
            {/* Center score */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                className={`text-3xl font-bold ${text}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                {data.score}
              </motion.span>
              <span className="text-[10px] font-medium text-muted-foreground">
                / 100
              </span>
            </div>
          </div>
        </div>

        {/* Checklist */}
        <div className="mt-5 space-y-1.5">
          {/* Filled items */}
          {data.filled.map((item) => (
            <motion.div
              key={item.label}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-muted/20"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.8 }}
            >
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
                <Check className="h-3 w-3 text-emerald-400" />
              </div>
              <span className="flex-1 text-sm text-foreground/90">
                {item.label}
              </span>
              <span className="text-xs font-semibold text-emerald-400">
                +{item.points}
              </span>
            </motion.div>
          ))}

          {/* Missing items */}
          {data.missing.map((item) => (
            <motion.div
              key={item.label}
              className="group flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-muted/20"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 1 }}
            >
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/15">
                <X className="h-3 w-3 text-red-400" />
              </div>
              <span className="flex-1 text-sm text-muted-foreground">
                {item.label}
              </span>
              <span className="mr-1 text-xs font-medium text-muted-foreground/60">
                +{item.points}
              </span>
              <Link
                href={item.link}
                className="flex items-center gap-0.5 text-[10px] font-semibold text-pulse-400 opacity-0 transition-all duration-200 group-hover:opacity-100"
              >
                Fix
                <ArrowRight className="h-2.5 w-2.5" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
