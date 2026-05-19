"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, TrendingUp, Users, Sparkles, Clock } from "lucide-react";
import { useUserStore } from "@/lib/user-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { OpportunityCard } from "@/components/opportunity-card";
import { MentorCard } from "@/components/mentor-card";
import { QuestionCard } from "@/components/question-card";
import { MOCK_OPPORTUNITIES, MOCK_SENIORS, MOCK_NOTIFICATIONS } from "@/lib/mock";
import { getInitials, daysUntil } from "@/lib/utils";

// NOTE: `metadata` cannot be exported from a client component (this file uses
// "use client"). The page title for /dashboard is set via `app/dashboard/layout.tsx`.

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
      <div className="mb-12 rounded-2xl border border-pulse-500/20 bg-gradient-to-br from-pulse-500/10 via-fuchsia-500/5 to-transparent p-8 md:p-12">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-pulse-400">Welcome back,</p>
            <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              {profile.fullName}
            </h1>
            <p className="mt-2 text-muted-foreground">
              Year {profile.year} · {profile.branch}
            </p>
          </div>
          <Avatar className="h-20 w-20 ring-4 ring-pulse-500/30">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.avatarSeed)}`}
              alt={profile.fullName}
            />
            <AvatarFallback>{getInitials(profile.fullName)}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { icon: TrendingUp, label: "Opportunities", value: MOCK_OPPORTUNITIES.length },
          { icon: Users, label: "Mentors", value: MOCK_SENIORS.length },
          { icon: Sparkles, label: "Saved", value: 0 },
          { icon: Clock, label: "Deadlines", value: closingDeadlines.length },
        ].map((s, i) => (
          <Card key={i} className="border-border/60 bg-card/50 backdrop-blur">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-pulse-500/15 p-2.5">
                <s.icon className="h-5 w-5 text-pulse-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-10">
          {/* Featured Opportunities */}
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
            <div className="grid gap-4 md:grid-cols-2">
              {featuredOpportunities.map((opp) => (
                <OpportunityCard key={opp.id} opportunity={opp} />
              ))}
            </div>
          </section>

          {/* Closing Deadlines */}
          {closingDeadlines.length > 0 && (
            <section>
              <h2 className="mb-5 font-display text-xl font-bold">
                Closing soon
              </h2>
              <div className="space-y-2">
                {closingDeadlines.map((opp) => (
                  <Card
                    key={opp.id}
                    className="border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10"
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {opp.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {opp.organization}
                        </p>
                      </div>
                      <Badge variant="warning" className="shrink-0">
                        {daysUntil(opp.deadline)}d left
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Notifications */}
          <section>
            <h3 className="mb-3 font-display text-lg font-bold">Notifications</h3>
            <div className="space-y-2">
              {MOCK_NOTIFICATIONS.slice(0, 4).map((n) => (
                <Card
                  key={n.id}
                  className="border-border/60 bg-card/50 hover:bg-accent/50 cursor-pointer"
                >
                  <CardContent className="p-3">
                    <p className="text-xs font-semibold line-clamp-1">
                      {n.title}
                    </p>
                    <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">
                      {n.body}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Recommended mentors */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">Mentors for you</h3>
              <Button asChild variant="ghost" size="sm">
                <Link href="/connect">View all</Link>
              </Button>
            </div>
            <div className="space-y-3">
              {recommendedMentors.map((m) => (
                <Card
                  key={m.id}
                  className="border-border/60 bg-card/50 backdrop-blur"
                >
                  <CardContent className="flex items-center justify-between p-3 gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Avatar className="h-8 w-8 shrink-0">
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
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
