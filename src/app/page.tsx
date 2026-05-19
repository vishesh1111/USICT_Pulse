"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Users, Briefcase, BookOpen, GraduationCap, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { APP_NAME, APP_TAGLINE, COLLEGE, BRANCHES, BRANCH_LABELS, BRANCH_COLORS } from "@/lib/constants";
import { useUserStore } from "@/lib/user-store";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  AnimatedCounter,
  FloatingParticles,
  GlowPulse,
} from "@/components/motion-primitives";

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
  { value: 500, suffix: "+", label: "Active students" },
  { value: 120, suffix: "+", label: "Mentors" },
  { value: 80, suffix: "+", label: "Live opportunities" },
  { value: 5, suffix: "", label: "Branches" },
];

export default function HomePage() {
  const router = useRouter();
  const profile = useUserStore((s) => s.profile);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (mounted && !profile?.onboardedAt) {
      router.push("/onboarding");
    }
  }, [mounted, profile, router]);

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
        <FloatingParticles count={25} />

        {/* Ambient glow orbs */}
        <GlowPulse className="-left-20 -top-20 h-60 w-60" color="pulse" />
        <GlowPulse className="-right-20 top-40 h-48 w-48" color="fuchsia" />

        <div className="container relative mx-auto px-4 py-20 md:py-28 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Badge variant="default" className="mb-6 px-3 py-1 text-xs">
                <Sparkles className="mr-1.5 h-3 w-3" />
                Built for {COLLEGE}
              </Badge>
            </motion.div>

            <motion.h1
              className="font-display text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              {APP_NAME.split(" ")[0]}{" "}
              <span className="gradient-text">PULSE</span>
            </motion.h1>

            <motion.p
              className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {APP_TAGLINE}
            </motion.p>

            <motion.div
              className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              <Button asChild size="xl">
                <Link href="/onboarding">
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <Link href="/dashboard">Explore dashboard</Link>
              </Button>
            </motion.div>

            {/* Stats with animated counters */}
            <motion.div
              className="mx-auto mt-16 grid max-w-2xl grid-cols-2 gap-6 md:grid-cols-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="font-display text-2xl font-bold md:text-3xl">
                    <AnimatedCounter target={s.value} suffix={s.suffix} duration={1.5} />
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground md:text-sm">
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <FadeIn className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Everything a USICT student needs.
          </h2>
          <p className="mt-3 text-muted-foreground">
            One platform for opportunities, mentorship, resources and community.
          </p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <StaggerItem key={f.title}>
              <Link href={f.href} className="group block h-full">
                <Card className="card-hover h-full">
                  <CardContent className="flex h-full flex-col p-6">
                    <motion.div
                      className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pulse-500/20 to-fuchsia-500/20 text-pulse-500"
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <f.icon className="h-5 w-5" />
                    </motion.div>
                    <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                    <p className="mt-2 flex-1 text-sm text-muted-foreground">{f.desc}</p>
                    <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-pulse-500 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
                      Explore <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Branches */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <FadeIn className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Built for every branch.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Tailored recommendations for all five USICT streams.
          </p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5" staggerDelay={0.1}>
          {BRANCHES.map((b) => (
            <StaggerItem key={b}>
              <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                <Card className="card-hover overflow-hidden">
                  <div className={`h-1.5 w-full bg-gradient-to-r ${BRANCH_COLORS[b]}`} />
                  <CardContent className="p-5">
                    <div className="font-display text-xl font-bold">{b}</div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {BRANCH_LABELS[b]}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 pb-24 pt-8">
        <FadeIn direction="up" delay={0.2}>
          <Card className="relative overflow-hidden border-pulse-500/20 bg-gradient-to-br from-pulse-500/10 via-fuchsia-500/5 to-transparent animate-border-glow">
            <div className="absolute inset-0 bg-mesh opacity-40" />
            <GlowPulse className="left-1/4 top-0 h-40 w-40" color="pulse" />
            <GlowPulse className="right-1/4 bottom-0 h-32 w-32" color="fuchsia" />
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
        </FadeIn>
      </section>
    </div>
  );
}
