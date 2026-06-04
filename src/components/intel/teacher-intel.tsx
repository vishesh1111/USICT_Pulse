"use client";

import { motion } from "framer-motion";
import { GraduationCap, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getTeacherIntel } from "@/lib/intel-engine";
import type { UserProfile } from "@/lib/user-store";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};



const difficultyColor: Record<string, string> = {
  Easy: "text-emerald-400",
  Moderate: "text-amber-400",
  Hard: "text-red-400",
};



export function TeacherIntel({ profile }: { profile: UserProfile }) {
  const items = getTeacherIntel(profile);

  return (
    <section>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-pulse-500/20 to-fuchsia-500/20 ring-1 ring-pulse-500/30">
            <GraduationCap className="h-4 w-4 text-pulse-400" />
          </div>
          <h2 className="text-lg font-semibold tracking-tight">Teacher Intel</h2>
        </div>
        <Link
          href="/teachers"
          className="group flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-pulse-400"
        >
          View all
          <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Cards */}
      <div className="max-h-[380px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted/50 hover:[&::-webkit-scrollbar-thumb]:bg-muted">
        <motion.div
          className="grid gap-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {items.map(({ teacher, internalsRange, attendancePolicy, assignmentLoad, seniorTip }) => (
            <motion.div
              key={teacher.id}
              variants={itemVariants}
              className="group relative overflow-hidden rounded-xl border border-border/60 bg-card/50 p-4 backdrop-blur transition-all duration-300 hover:border-pulse-500/40 hover:shadow-lg hover:shadow-pulse-500/5"
            >
              {/* Hover glow */}
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-pulse-500/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10 ring-2 ring-border/40">
                  <AvatarImage src={teacher.photoUrl} alt={teacher.name} />
                  <AvatarFallback className="text-xs font-semibold">
                    {teacher.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col">
                    <h3 className="text-sm font-semibold leading-tight">
                      {teacher.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {teacher.subjects.join(", ")}
                    </p>
                  </div>

                  {/* Dense Data Grid */}
                  <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-[11px]">
                    <div className="flex items-center justify-between rounded-md bg-muted/20 px-2.5 py-1.5">
                      <span className="text-muted-foreground">Internals</span>
                      <span className="font-medium text-emerald-400">{internalsRange}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-md bg-muted/20 px-2.5 py-1.5">
                      <span className="text-muted-foreground">Attendance</span>
                      <span className={`font-medium ${attendancePolicy === 'Strict' ? 'text-red-400' : 'text-amber-400'}`}>
                        {attendancePolicy}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-md bg-muted/20 px-2.5 py-1.5">
                      <span className="text-muted-foreground">Assignments</span>
                      <span className="font-medium text-amber-400">{assignmentLoad}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-md bg-muted/20 px-2.5 py-1.5">
                      <span className="text-muted-foreground">Exam Diff</span>
                      <span className={`font-medium ${difficultyColor[teacher.difficulty]}`}>
                        {teacher.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Senior Tip */}
                  <div className="mt-3 border-t border-border/40 pt-2">
                    <p className="text-[11px] leading-relaxed">
                      <span className="font-semibold text-pulse-400">Senior Tip: </span>
                      <span className="text-muted-foreground">{seniorTip}</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {items.length === 0 && (
            <div className="rounded-xl border border-border/40 bg-card/30 p-8 text-center">
              <GraduationCap className="mx-auto h-8 w-8 text-muted-foreground/40" />
              <p className="mt-2 text-sm text-muted-foreground">
                No teacher intel for your branch yet.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
