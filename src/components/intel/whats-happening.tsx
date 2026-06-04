"use client";

import { motion } from "framer-motion";
import { Activity, BookOpen, Briefcase, Bell, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getWhatsHappening } from "@/lib/intel-engine";
import type { UserProfile } from "@/lib/user-store";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const typeConfig: Record<
  string,
  { icon: typeof BookOpen; color: string; bg: string; glow: string }
> = {
  resource: {
    icon: BookOpen,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    glow: "group-hover:shadow-emerald-500/10",
  },
  opportunity: {
    icon: Briefcase,
    color: "text-pulse-400",
    bg: "bg-pulse-500/10",
    glow: "group-hover:shadow-pulse-500/10",
  },
  notification: {
    icon: Bell,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    glow: "group-hover:shadow-amber-500/10",
  },
  question: {
    icon: Activity,
    color: "text-fuchsia-400",
    bg: "bg-fuchsia-500/10",
    glow: "group-hover:shadow-fuchsia-500/10",
  },
};

export function WhatsHappening({ profile }: { profile: UserProfile }) {
  const items = getWhatsHappening(profile);

  return (
    <section>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-500/20 to-pulse-500/20 ring-1 ring-fuchsia-500/30">
            <Activity className="h-4 w-4 text-fuchsia-400" />
          </div>
          <h2 className="text-lg font-semibold tracking-tight">
            What&apos;s Happening at USICT
          </h2>
        </div>
      </div>

      {/* Scrollable feed */}
      <motion.div
        className="custom-scrollbar flex max-h-[420px] flex-col gap-2 overflow-y-auto pr-1"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {items.map((item) => {
          const config = typeConfig[item.type] || typeConfig.notification;
          const Icon = config.icon;

          return (
            <motion.div key={item.id} variants={itemVariants}>
              <Link href={item.link} className="block">
                <div
                  className={`group relative flex items-start gap-3 rounded-xl border border-border/50 bg-card/40 p-3 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-pulse-500/30 hover:shadow-lg ${config.glow}`}
                >
                  {/* Hover glow */}
                  <div className="pointer-events-none absolute -left-4 -top-4 h-16 w-16 rounded-full bg-pulse-500/5 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Icon */}
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${config.bg} transition-transform duration-200 group-hover:scale-110`}
                  >
                    <Icon className={`h-4 w-4 ${config.color}`} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold leading-tight line-clamp-1 transition-colors group-hover:text-foreground">
                        {item.title}
                      </h3>
                      <Badge
                        variant="outline"
                        className="shrink-0 border-border/40 bg-muted/30 text-[10px] font-medium text-muted-foreground"
                      >
                        {item.timeAgo}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs leading-snug text-muted-foreground line-clamp-1">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}

        {items.length === 0 && (
          <div className="rounded-xl border border-border/40 bg-card/30 p-8 text-center">
            <Activity className="mx-auto h-8 w-8 text-muted-foreground/40" />
            <p className="mt-2 text-sm text-muted-foreground">
              Nothing happening right now.
            </p>
          </div>
        )}
      </motion.div>
    </section>
  );
}
