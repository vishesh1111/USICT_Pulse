"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, ArrowRight, Clock } from "lucide-react";
import { getHighestImpactAction } from "@/lib/intel-engine";
import type { UserProfile } from "@/lib/user-store";

export function HighestImpactAction({ profile }: { profile: UserProfile }) {
  const data = getHighestImpactAction(profile);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Animated border beam wrapper */}
      <div className="relative overflow-hidden rounded-2xl p-[2px]">
        <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_75%,#3a60ff_85%,#d946ef_100%)]" />

        <Card className="relative rounded-[22px] border-0 bg-background/95 backdrop-blur-xl">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              {/* Left: Action content */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pulse-500/20 to-fuchsia-500/20">
                    <Zap className="h-5 w-5 text-pulse-400" />
                  </div>
                  <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    Top action for you
                  </span>
                </div>

                <h2 className="text-xl font-bold leading-snug tracking-tight text-foreground md:text-2xl">
                  {data.action}
                </h2>

                <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                  {data.reason}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Badge
                    variant="outline"
                    className={
                      data.impact === "High"
                        ? "border-green-500/30 bg-green-500/10 text-green-400"
                        : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                    }
                  >
                    {data.impact} Impact
                  </Badge>

                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {data.estimatedTime}
                  </span>
                </div>
              </div>

              {/* Right: CTA button */}
              <div className="shrink-0">
                <Button
                  asChild
                  className="group gap-2 bg-gradient-to-r from-pulse-500 to-fuchsia-500 text-white shadow-lg shadow-pulse-500/20 transition-all hover:shadow-xl hover:shadow-pulse-500/30"
                >
                  <Link href={data.sourceLink}>
                    Go to {data.source}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
