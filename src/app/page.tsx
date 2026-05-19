"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, Users, Briefcase, BookOpen, GraduationCap, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { APP_NAME, APP_TAGLINE, COLLEGE, BRANCHES, BRANCH_LABELS, BRANCH_COLORS } from "@/lib/constants";
import { useUserStore } from "@/lib/user-store";

const FEATURES = [
  {
    icon: Briefcase,
    title: "Curated Opportunities",
    desc: "Internships, scholarships, clubs & local gigs — filtered for USICT students.",
    href: "/opportunities",
  },
  {
    icon: Users,
    title: "Connect with Seniors",
    desc: "Real mentors from your branch. Get answers, referrals, and roadmaps.",
    href: "/connect",
  },
  {
    icon: GraduationCap,
    title: "Alumni Network",
    desc: "Discover where USICT alumni work and how they got there.",
    href: "/alumni",
  },
  {
    icon: BookOpen,
    title: "Resources Hub",
    desc: "Subject-wise notes, videos, and roadmaps curated by toppers.",
    href: "/resources",
  },
  {
    icon: Sparkles,
    title: "Ask Anything",
    desc: "Anonymous Q&A with seniors, alumni, and teachers — answered fast.",
    href: "/ask",
  },
  {
    icon: Bell,
    title: "Deadline Radar",
    desc: "Never miss a scholarship or internship — personalized alerts.",
    href: "/notifications",
  },
];

const STATS = [
  { value: "500+", label: "Active students" },
  { value: "120+", label: "Mentors" },
  { value: "80+", label: "Live opportunities" },
  { value: "5", label: "Branches" },
];

export default function HomePage() {
  const router = useRouter();
  const profile = useUserStore((s) => s.profile);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-redirect to onboarding if user hasn't set up their profile
  React.useEffect(() => {
    if (mounted && !profile?.onboardedAt) {
      router.push("/onboarding");
    }
  }, [mounted, profile, router]);

  // Show nothing while checking / redirecting
  if (!mounted || !profile?.onboardedAt) {
    return null;
  }

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute inset-0 bg-radial-fade" />
        <div className="absolute inset-0 bg-mesh opacity-60" />

        <div className="container relative mx-auto px-4 py-20 md:py-28 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="default" className="mb-6 px-3 py-1 text-xs">
              <Sparkles className="mr-1.5 h-3 w-3" />
              Built for {COLLEGE}
            </Badge>

            <h1 className="font-display text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              {APP_NAME.split(" ")[0]}{" "}
              <span className="gradient-text">PULSE</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
              {APP_TAGLINE}
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="xl">
                <Link href="/onboarding">
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <Link href="/dashboard">Explore dashboard</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-2 gap-6 md:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="font-display text-2xl font-bold md:text-3xl">
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground md:text-sm">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Everything a USICT student needs.
          </h2>
          <p className="mt-3 text-muted-foreground">
            One platform for opportunities, mentorship, resources and community.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Link key={f.title} href={f.href} className="group">
              <Card className="card-hover h-full border-border/60 bg-card/50 backdrop-blur">
                <CardContent className="flex h-full flex-col p-6">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-pulse-500/20 to-fuchsia-500/20 text-pulse-500">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{f.desc}</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-pulse-500 opacity-0 transition-opacity group-hover:opacity-100">
                    Explore <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Branches */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Built for every branch.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Tailored recommendations for all five USICT streams.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {BRANCHES.map((b) => (
            <Card
              key={b}
              className="card-hover overflow-hidden border-border/60 bg-card/50 backdrop-blur"
            >
              <div className={`h-1.5 w-full bg-gradient-to-r ${BRANCH_COLORS[b]}`} />
              <CardContent className="p-5">
                <div className="font-display text-xl font-bold">{b}</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {BRANCH_LABELS[b]}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 pb-24 pt-8">
        <Card className="relative overflow-hidden border-pulse-500/20 bg-gradient-to-br from-pulse-500/10 via-fuchsia-500/5 to-transparent">
          <div className="absolute inset-0 bg-mesh opacity-40" />
          <CardContent className="relative flex flex-col items-center justify-between gap-6 p-10 text-center md:flex-row md:text-left">
            <div>
              <h3 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
                Ready to feel the pulse?
              </h3>
              <p className="mt-2 text-sm text-muted-foreground md:text-base">
                Set up your profile in under a minute. No spam, no ads — just signal.
              </p>
            </div>
            <Button asChild size="xl">
              <Link href="/onboarding">
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
