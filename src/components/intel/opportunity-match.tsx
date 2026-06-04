"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Briefcase } from "lucide-react";
import { getMatchedOpportunities } from "@/lib/intel-engine";
import type { UserProfile } from "@/lib/user-store";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export function OpportunityMatch({ profile }: { profile: UserProfile }) {
  const matches = getMatchedOpportunities(profile);

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
          <Sparkles className="h-5 w-5 text-pulse-400" />
          <h3 className="text-lg font-semibold tracking-tight">Opportunities for you</h3>
        </div>
        <Button variant="ghost" size="sm" asChild className="gap-1 text-muted-foreground hover:text-foreground">
          <Link href="/opportunities">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      {matches.length === 0 ? (
        <Card className="border-border/60 bg-card/50 backdrop-blur">
          <CardContent className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <Briefcase className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No matching opportunities right now</p>
            <p className="text-xs text-muted-foreground/60">Check back soon or broaden your interests</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {matches.map((m) => (
            <motion.div key={m.opportunity.id} variants={item}>
              <Card className="group relative border-border/60 bg-card/50 backdrop-blur transition-all duration-300 hover:border-pulse-500/30 hover:bg-card/70 hover:shadow-lg hover:shadow-pulse-500/5">
                <CardContent className="p-5">
                  <div className="space-y-3">
                    {/* Match score badge */}
                    <Badge className="bg-gradient-to-r from-pulse-500/20 to-fuchsia-500/20 text-pulse-300 border-pulse-500/30">
                      {m.matchScore}% match
                    </Badge>

                    {/* Title */}
                    <h4 className="font-semibold leading-tight text-foreground line-clamp-2">
                      {m.opportunity.title}
                    </h4>

                    {/* Organization */}
                    <p className="text-sm text-muted-foreground">{m.opportunity.organization}</p>

                    {/* Match reason pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {m.matchReasons.map((reason) => (
                        <Badge
                          key={reason}
                          variant="outline"
                          className="border-border/40 bg-muted/30 text-xs text-muted-foreground"
                        >
                          {reason}
                        </Badge>
                      ))}
                    </div>

                    {/* Apply button */}
                    {m.opportunity.applyUrl ? (
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="mt-1 w-full gap-1.5 border-border/60 transition-colors group-hover:border-pulse-500/40 group-hover:text-pulse-400"
                      >
                        <a href={m.opportunity.applyUrl} target="_blank" rel="noopener noreferrer">
                          Apply
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </a>
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled
                        className="mt-1 w-full gap-1.5 border-border/60"
                      >
                        Apply Link Unavailable
                      </Button>
                    )}
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
