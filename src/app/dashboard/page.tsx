"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Users, Sparkles, Clock } from "lucide-react";
import { useUserStore } from "@/lib/user-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { OpportunityCard } from "@/components/opportunity-card";
import { MOCK_OPPORTUNITIES, MOCK_SENIORS, MOCK_NOTIFICATIONS } from "@/lib/mock";
import { getInitials, daysUntil } from "@/lib/utils";
import { ApplicationTracker } from "@/components/application-tracker";
import { FadeIn, StaggerContainer, StaggerItem, GlowPulse, AnimatedCounter } from "@/components/motion-primitives";

export default function DashboardPage() {
  const router = useRouter();
  const profile = useUserStore((s) => s.profile);

  useEffect(() => {
    if (!profile) {
      router.push("/onboarding");
    }
  }, [profile, router]);

  if (!profile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const featuredOpportunities = MOCK_OPPORTUNITIES.filter((o) => o.featured).slice(0, 3);
  const closingDeadlines = MOCK_OPPORTUNITIES.filter(
    (o) => daysUntil(o.deadline) > 0 && daysUntil(o.deadline) <= 7
  ).slice(0, 3);
  const recommendedMentors = MOCK_SENIORS.slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Hero */}
      <FadeIn direction="up" duration={0.6}>
        <div className="relative mb-12 overflow-hidden rounded-2xl border border-pulse-500/20 bg-gradient-to-br from-pulse-500/10 via-fuchsia-500/5 to-transparent p-8 md:p-12">
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
                Welcome back,
              </motion.p>
              <motion.h1
                className="font-display text-3xl font-bold tracking-tight md:text-4xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {profile.fullName}
              </motion.h1>
              <motion.p
                className="mt-2 text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
              >
                Year {profile.year} · {profile.branch}
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 15 }}
            >
              <Avatar className="h-20 w-20 ring-4 ring-pulse-500/30 transition-all hover:ring-pulse-500/60 hover:shadow-xl hover:shadow-pulse-500/20">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.avatarSeed)}`}
                  alt={profile.fullName}
                />
                <AvatarFallback>{getInitials(profile.fullName)}</AvatarFallback>
              </Avatar>
            </motion.div>
          </div>
        </div>
      </FadeIn>

      {/* Stats */}
      <StaggerContainer className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4" staggerDelay={0.1}>
        {[
          { icon: TrendingUp, label: "Opportunities", value: MOCK_OPPORTUNITIES.length, color: "text-blue-500" },
          { icon: Users, label: "Mentors", value: MOCK_SENIORS.length, color: "text-emerald-500" },
          { icon: Sparkles, label: "Saved", value: 0, color: "text-fuchsia-500" },
          { icon: Clock, label: "Deadlines", value: closingDeadlines.length, color: "text-amber-500" },
        ].map((s, i) => (
          <StaggerItem key={i}>
            <motion.div whileHover={{ y: -3, scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
              <Card className="overflow-hidden">
                <CardContent className="flex items-center gap-3 p-4">
                  <motion.div
                    className="rounded-xl bg-pulse-500/10 p-2.5"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <s.icon className={`h-5 w-5 ${s.color}`} />
                  </motion.div>
                  <div>
                    <p className="text-2xl font-bold">
                      <AnimatedCounter target={s.value} duration={1} />
                    </p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Two columns */}
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-10">
          {/* Featured Opportunities */}
          <FadeIn direction="left" delay={0.1}>
            <section>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold">Featured opportunities</h2>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/opportunities">
                    View all
                    <ArrowRight className="ml-2 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
              <StaggerContainer className="grid gap-4 md:grid-cols-2" staggerDelay={0.1}>
                {featuredOpportunities.map((opp) => (
                  <StaggerItem key={opp.id}>
                    <OpportunityCard opportunity={opp} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </section>
          </FadeIn>

          {/* Closing Deadlines */}
          {closingDeadlines.length > 0 && (
            <FadeIn direction="up" delay={0.2}>
              <section>
                <h2 className="mb-5 font-display text-xl font-bold">
                  Closing soon
                </h2>
                <div className="space-y-2">
                  {closingDeadlines.map((opp, idx) => (
                    <motion.div
                      key={opp.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1, duration: 0.4 }}
                    >
                      <Card className="border-amber-500/20 bg-amber-500/5 transition-all duration-200 hover:bg-amber-500/10 hover:border-amber-500/40 hover:shadow-md hover:shadow-amber-500/10 hover:-translate-y-0.5">
                        <CardContent className="flex items-center justify-between p-4">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">
                              {opp.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {opp.organization}
                            </p>
                          </div>
                          <Badge variant="warning" className="shrink-0 animate-pulse">
                            {daysUntil(opp.deadline)}d left
                          </Badge>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </section>
            </FadeIn>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <FadeIn direction="right" delay={0.2}>
            <ApplicationTracker />
          </FadeIn>

          {/* Notifications */}
          <FadeIn direction="right" delay={0.3}>
            <section>
              <h3 className="mb-3 font-display text-lg font-bold">Notifications</h3>
              <div className="space-y-2">
                {MOCK_NOTIFICATIONS.slice(0, 4).map((n, idx) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + idx * 0.08 }}
                    whileHover={{ x: 2 }}
                  >
                    <Card className="transition-all duration-200 hover:bg-accent/60 hover:border-pulse-500/20 hover:shadow-sm cursor-pointer">
                      <CardContent className="p-3">
                        <p className="text-xs font-semibold line-clamp-1">
                          {n.title}
                        </p>
                        <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">
                          {n.body}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>
          </FadeIn>

          {/* Recommended mentors */}
          <FadeIn direction="right" delay={0.4}>
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-lg font-bold">Mentors for you</h3>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/connect">View all</Link>
                </Button>
              </div>
              <div className="space-y-3">
                {recommendedMentors.map((m, idx) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    whileHover={{ x: -2, scale: 1.01 }}
                  >
                    <Card className="transition-all duration-200 hover:border-pulse-500/20 hover:shadow-md">
                      <CardContent className="flex items-center justify-between p-3 gap-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <Avatar className="h-8 w-8 shrink-0 ring-1 ring-pulse-500/20">
                            <AvatarImage src={m.avatarUrl} alt={m.fullName} />
                            <AvatarFallback>
                              {getInitials(m.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold truncate">
                              {m.fullName}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate">
                              Year {m.year} · {m.branch}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          Chat
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
