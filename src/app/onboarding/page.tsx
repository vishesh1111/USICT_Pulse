"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Award, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/lib/user-store";
import { AnimatedBackground } from "@/components/onboarding-shared";
import { JuniorFlow } from "@/components/onboarding-junior";
import { SeniorFlow, type SeniorData } from "@/components/onboarding-senior";
import { toast } from "sonner";
import { sendWelcomeEmail, isEmailJSConfigured } from "@/lib/emailjs";

type Phase = "role" | "junior" | "senior";

function RoleSelection({ onSelect }: { onSelect: (role: "junior" | "senior") => void }) {
  const roles = [
    {
      id: "junior" as const,
      icon: GraduationCap,
      title: "I'm a Junior",
      subtitle: "1st or 2nd year? Start here",
      desc: "Set up your profile, discover opportunities, and connect with mentors.",
      gradient: "from-blue-500 to-cyan-500",
      glow: "shadow-blue-500/20",
      emoji: "🎓",
    },
    {
      id: "senior" as const,
      icon: Award,
      title: "I'm a Senior",
      subtitle: "3rd or 4th year? Help juniors grow",
      desc: "Build your credibility score and become a mentor for your juniors.",
      gradient: "from-fuchsia-500 to-purple-500",
      glow: "shadow-fuchsia-500/20",
      emoji: "🎯",
    },
  ];

  return (
    <div className="mx-auto max-w-2xl">
      <motion.div
        className="mb-10 flex flex-col items-center text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        >
          <Badge variant="default" className="mb-5 gap-1.5 px-3 py-1.5 text-xs">
            <Sparkles className="h-3 w-3" />
            Welcome to USICT PULSE
          </Badge>
        </motion.div>
        <motion.h1
          className="font-display text-3xl font-bold tracking-tight md:text-4xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Who are you?
        </motion.h1>
        <motion.p
          className="mt-3 text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Choose your role to get a personalized experience.
        </motion.p>
      </motion.div>

      <div className="grid gap-5 md:grid-cols-2">
        {roles.map((role, i) => (
          <motion.button
            key={role.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.15, type: "spring", stiffness: 200, damping: 20 }}
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(role.id)}
            className={`group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-card/40 p-8 text-left backdrop-blur-xl transition-all hover:shadow-2xl hover:${role.glow}`}
          >
            {/* Gradient top bar */}
            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${role.gradient}`} />

            {/* Background glow on hover */}
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-[0.06]`} />

            <motion.span
              className="mb-4 inline-block text-5xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.15, type: "spring", stiffness: 300, damping: 15 }}
            >
              {role.emoji}
            </motion.span>

            <h2 className="font-display text-xl font-bold">{role.title}</h2>
            <p className={`mt-1 text-sm font-medium bg-gradient-to-r ${role.gradient} bg-clip-text text-transparent`}>
              {role.subtitle}
            </p>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{role.desc}</p>

            <div className={`mt-5 inline-flex items-center gap-1.5 text-sm font-semibold bg-gradient-to-r ${role.gradient} bg-clip-text text-transparent opacity-0 transition-opacity group-hover:opacity-100`}>
              Get started →
            </div>
          </motion.button>
        ))}
      </div>

      <motion.p
        className="mt-8 text-center text-xs text-muted-foreground/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Takes less than a minute · No spam, ever
      </motion.p>
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const setProfile = useUserStore((s) => s.setProfile);
  const profile = useUserStore((s) => s.profile);
  const [phase, setPhase] = React.useState<Phase>("role");
  const [mounted, setMounted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => { setMounted(true); }, []);
  React.useEffect(() => {
    if (mounted && profile?.onboardedAt) router.push("/dashboard");
  }, [mounted, profile, router]);

  const handleJuniorComplete = async (data: { fullName: string; email: string; branch: string; year: number; interests: string[]; goals: string }) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setProfile({
      fullName: data.fullName,
      email: data.email,
      branch: data.branch as any,
      year: data.year,
      interests: data.interests,
      goals: data.goals.split("\n").filter(Boolean),
      avatarSeed: data.fullName,
      onboardedAt: new Date().toISOString(),
      role: "junior",
    });
    toast.success("Profile created! Redirecting to dashboard...");
    // Send welcome email
    sendWelcomeEmail(data.email, data.fullName, "junior").then((sent) => {
      if (sent) toast("📧 Welcome email sent to " + data.email, { duration: 4000 });
      else if (!isEmailJSConfigured()) toast("📧 Email simulation: Welcome email → " + data.email, { duration: 4000 });
    });
    setTimeout(() => router.push("/dashboard"), 800);
  };

  const handleSeniorComplete = async (data: SeniorData, score: number) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setProfile({
      fullName: data.fullName,
      email: data.email,
      branch: data.branch as any,
      year: 3,
      interests: [],
      goals: [],
      avatarSeed: data.fullName,
      onboardedAt: new Date().toISOString(),
      role: "senior",
      linkedin: data.linkedin,
      github: data.github,
      clubs: data.clubs,
      cgpa: data.cgpa,
      hasInternship: data.hasInternship,
      internshipDetails: data.internshipDetails,
      seniorScore: score,
    });
    toast.success("Profile created! Redirecting to dashboard...");
    // Send welcome email
    sendWelcomeEmail(data.email, data.fullName, "senior").then((sent) => {
      if (sent) toast("📧 Welcome email sent to " + data.email, { duration: 4000 });
      else if (!isEmailJSConfigured()) toast("📧 Email simulation: Welcome email → " + data.email, { duration: 4000 });
    });
    setTimeout(() => router.push("/dashboard"), 800);
  };

  if (!mounted) return null;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      <AnimatedBackground />
      <div className="container relative mx-auto px-4 py-10 md:py-16">
        <AnimatePresence mode="wait">
          {phase === "role" && (
            <motion.div key="role" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -80 }} transition={{ duration: 0.4 }}>
              <RoleSelection onSelect={(role) => setPhase(role)} />
            </motion.div>
          )}
          {phase === "junior" && (
            <motion.div key="junior" className="mx-auto max-w-xl" initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              <JuniorFlow onComplete={handleJuniorComplete} onBack={() => setPhase("role")} />
            </motion.div>
          )}
          {phase === "senior" && (
            <motion.div key="senior" className="mx-auto max-w-xl" initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              <SeniorFlow onComplete={handleSeniorComplete} onBack={() => setPhase("role")} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
