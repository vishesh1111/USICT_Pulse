"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, Check, Linkedin, Github, Trophy, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BRANCHES, BRANCH_LABELS, CLUB_OPTIONS } from "@/lib/constants";
import { calculateSeniorScore, type ScoreBreakdown } from "@/lib/score";
import { toast } from "sonner";

const STEPS = [
  { id: "name", title: "What's your name?", desc: "We'll use this to personalize your experience.", emoji: "👋" },
  { id: "branch", title: "What's your branch?", desc: "This helps us match you with juniors.", emoji: "🎯" },
  { id: "profiles", title: "Your online presence", desc: "Share your LinkedIn & GitHub profiles.", emoji: "🔗" },
  { id: "clubs", title: "Clubs & academics", desc: "Tell us about your clubs and CGPA.", emoji: "🏆" },
  { id: "internship", title: "Internship experience", desc: "Have you done any internships?", emoji: "💼" },
  { id: "score", title: "Your credibility score", desc: "Here's how you rank based on your profile.", emoji: "⭐" },
];

export interface SeniorData {
  fullName: string; email: string; branch: string; linkedin: string; github: string;
  clubs: string[]; cgpa: number; hasInternship: boolean; internshipDetails: string;
}

function ScoreGauge({ score, breakdown }: { score: number; breakdown: ScoreBreakdown }) {
  const radius = 80, circumference = 2 * Math.PI * radius;
  const color = score >= 80 ? "text-emerald-400" : score >= 50 ? "text-amber-400" : "text-red-400";
  const items = [
    { label: "LinkedIn", pts: breakdown.linkedin, max: 15 },
    { label: "GitHub", pts: breakdown.github, max: 15 },
    { label: "Clubs", pts: breakdown.clubs, max: 10 },
    { label: "Branch", pts: breakdown.branch, max: 5 },
    { label: "CGPA", pts: breakdown.cgpa, max: 25 },
    { label: "Internship", pts: breakdown.internship, max: 30 },
  ];
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <svg width="200" height="200" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r={radius} fill="none" stroke="hsl(224,30%,14%)" strokeWidth="12" />
          <motion.circle cx="100" cy="100" r={radius} fill="none" strokeWidth="12" strokeLinecap="round"
            stroke="url(#scoreGrad)" strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: circumference - (circumference * score) / 100 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            style={{ transform: "rotate(-90deg)", transformOrigin: "center" }} />
          <defs><linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(230,95%,66%)" /><stop offset="100%" stopColor="hsl(292,84%,61%)" />
          </linearGradient></defs>
        </svg>
        <motion.div className="absolute inset-0 flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, type: "spring" }}>
          <span className={`font-display text-5xl font-bold ${color}`}>{score}</span>
          <span className="text-xs text-muted-foreground">out of 100</span>
        </motion.div>
      </div>
      <motion.div className={`rounded-full px-4 py-1.5 text-sm font-semibold ${score >= 80 ? "bg-emerald-500/15 text-emerald-400" : score >= 50 ? "bg-amber-500/15 text-amber-400" : "bg-red-500/15 text-red-400"}`}
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
        {score >= 80 ? "🌟 Excellent Profile" : score >= 50 ? "👍 Good Profile" : "📈 Room to Grow"}
      </motion.div>
      <div className="w-full space-y-2">
        {items.map((it, i) => (
          <motion.div key={it.label} className="flex items-center gap-3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 + i * 0.1 }}>
            <span className="w-20 text-xs text-muted-foreground">{it.label}</span>
            <div className="flex-1 h-2 rounded-full bg-muted/50 overflow-hidden">
              <motion.div className="h-full rounded-full bg-gradient-to-r from-pulse-500 to-fuchsia-500"
                initial={{ width: "0%" }} animate={{ width: `${(it.pts / it.max) * 100}%` }} transition={{ duration: 0.8, delay: 1.2 + i * 0.1 }} />
            </div>
            <span className="w-12 text-right text-xs font-medium">{it.pts}/{it.max}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function SeniorFlow({ onComplete, onBack }: { onComplete: (data: SeniorData, score: number) => void; onBack: () => void }) {
  const [step, setStep] = React.useState(0);
  const [dir, setDir] = React.useState(0);
  const [scoreResult, setScoreResult] = React.useState<ScoreBreakdown | null>(null);
  const [data, setData] = React.useState<SeniorData>({
    fullName: "", email: "", branch: "", linkedin: "", github: "", clubs: [], cgpa: 0, hasInternship: false, internshipDetails: "",
  });
  const cur = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  const toggleClub = (c: string) => {
    setData(p => {
      if (c === "None") return { ...p, clubs: p.clubs.includes("None") ? [] : ["None"] };
      const without = p.clubs.filter(x => x !== "None");
      return { ...p, clubs: without.includes(c) ? without.filter(x => x !== c) : [...without, c] };
    });
  };

  const next = () => {
    if (cur.id === "name" && !data.fullName.trim()) { toast.error("Please enter your name"); return; }
    if (cur.id === "name" && (!data.email.trim() || !data.email.includes("@"))) { toast.error("Please enter a valid email"); return; }
    if (cur.id === "branch" && !data.branch) { toast.error("Please select your branch"); return; }
    if (cur.id === "profiles" && !data.linkedin.trim() && !data.github.trim()) { toast.error("Please provide at least one profile link"); return; }
    if (cur.id === "clubs" && data.cgpa <= 0) { toast.error("Please enter your CGPA"); return; }
    if (cur.id === "internship" && data.hasInternship && !data.internshipDetails.trim()) { toast.error("Please describe your internship"); return; }

    if (cur.id === "internship") {
      // Calculate score and go to score screen
      const breakdown = calculateSeniorScore(data);
      setScoreResult(breakdown);
      setDir(1); setStep(step + 1);
      return;
    }
    if (cur.id === "score") {
      onComplete(data, scoreResult?.total ?? 0);
      return;
    }
    if (step < STEPS.length - 1) { setDir(1); setStep(step + 1); }
  };
  const back = () => { if (step > 0) { setDir(-1); setStep(step - 1); } else onBack(); };

  const renderStep = () => {
    switch (cur.id) {
      case "name": return (
        <div className="space-y-4">
          <Label htmlFor="sname">Full name</Label>
          <Input id="sname" placeholder="Aarav Sharma" value={data.fullName} onChange={e => setData(p => ({ ...p, fullName: e.target.value }))} autoFocus className="h-12 border-border/40 bg-background/50 text-base" />
          <div>
            <Label htmlFor="semail" className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-pulse-400" />Email address</Label>
            <Input id="semail" type="email" placeholder="aarav@gmail.com" value={data.email} onChange={e => setData(p => ({ ...p, email: e.target.value }))} className="mt-1.5 h-12 border-border/40 bg-background/50 text-base" />
            <p className="mt-1 text-[11px] text-muted-foreground">We&apos;ll send deadline alerts and question notifications here.</p>
          </div>
        </div>
      );
      case "branch": return (
        <div className="space-y-4">
          <Label>Select your branch</Label>
          <div className="grid gap-3">{BRANCHES.map((b, i) => (
            <motion.button key={b} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} onClick={() => setData(p => ({ ...p, branch: b }))}
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${data.branch === b ? "border-pulse-500/50 bg-pulse-500/10 shadow-lg shadow-pulse-500/10" : "border-border/40 bg-background/30 hover:bg-background/50"}`}>
              <div className={`h-3 w-3 rounded-full bg-gradient-to-r ${b === "CSE" ? "from-blue-500 to-cyan-500" : b === "IT" ? "from-emerald-500 to-teal-500" : b === "ECE" ? "from-orange-500 to-amber-500" : b === "CSEAI" ? "from-fuchsia-500 to-purple-500" : "from-rose-500 to-pink-500"}`} />
              <div><div className="font-semibold">{b}</div><div className="text-xs text-muted-foreground">{BRANCH_LABELS[b]}</div></div>
              {data.branch === b && <motion.div className="ml-auto" initial={{ scale: 0 }} animate={{ scale: 1 }}><Check className="h-4 w-4 text-pulse-400" /></motion.div>}
            </motion.button>
          ))}</div>
        </div>
      );
      case "profiles": return (
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="linkedin" className="flex items-center gap-2"><Linkedin className="h-4 w-4 text-blue-400" />LinkedIn Profile</Label>
            <Input id="linkedin" placeholder="https://linkedin.com/in/yourname" value={data.linkedin} onChange={e => setData(p => ({ ...p, linkedin: e.target.value }))} className="h-12 border-border/40 bg-background/50" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="github" className="flex items-center gap-2"><Github className="h-4 w-4" />GitHub Profile</Label>
            <Input id="github" placeholder="https://github.com/yourname" value={data.github} onChange={e => setData(p => ({ ...p, github: e.target.value }))} className="h-12 border-border/40 bg-background/50" />
          </div>
          <p className="text-xs text-muted-foreground">These help verify your profile and boost your credibility score.</p>
        </div>
      );
      case "clubs": return (
        <div className="space-y-5">
          <div className="space-y-3">
            <Label>Which clubs are you part of?</Label>
            <div className="grid grid-cols-2 gap-2">{CLUB_OPTIONS.map((c, i) => (
              <motion.button key={c} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }} onClick={() => toggleClub(c)} whileTap={{ scale: 0.97 }}
                className={`rounded-xl border px-3 py-2.5 text-xs font-medium transition-all md:text-sm ${data.clubs.includes(c) ? "border-pulse-500/50 bg-pulse-500/15 text-pulse-300" : "border-border/40 bg-background/30 text-muted-foreground hover:bg-background/50"}`}>
                <span className="flex items-center justify-center gap-1.5">{data.clubs.includes(c) && <Check className="h-3 w-3" />}{c}</span>
              </motion.button>
            ))}</div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cgpa">CGPA (latest semester, 0–10)</Label>
            <Input id="cgpa" type="number" step="0.1" min="0" max="10" placeholder="8.5" value={data.cgpa || ""} onChange={e => setData(p => ({ ...p, cgpa: parseFloat(e.target.value) || 0 }))} className="h-12 border-border/40 bg-background/50 text-base" />
          </div>
        </div>
      );
      case "internship": return (
        <div className="space-y-5">
          <Label>Have you done any internships?</Label>
          <div className="grid grid-cols-2 gap-3">
            {[true, false].map(v => (
              <motion.button key={String(v)} whileTap={{ scale: 0.97 }} onClick={() => setData(p => ({ ...p, hasInternship: v }))}
                className={`rounded-xl border p-5 text-center transition-all ${data.hasInternship === v ? "border-pulse-500/50 bg-pulse-500/10 shadow-lg shadow-pulse-500/10" : "border-border/40 bg-background/30 hover:bg-background/50"}`}>
                <div className="text-3xl mb-2">{v ? "✅" : "❌"}</div>
                <div className="font-semibold">{v ? "Yes" : "Not yet"}</div>
              </motion.button>
            ))}
          </div>
          {data.hasInternship && (
            <motion.div className="space-y-2" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
              <Label htmlFor="interndetails">Tell us about it</Label>
              <textarea id="interndetails" placeholder="E.g., SDE Intern at Microsoft, Summer 2025&#10;Worked on Azure platform services" value={data.internshipDetails} onChange={e => setData(p => ({ ...p, internshipDetails: e.target.value }))}
                className="min-h-28 w-full rounded-xl border border-border/40 bg-background/50 px-4 py-3 text-sm placeholder-muted-foreground/50 focus:border-pulse-500/50 focus:outline-none focus:ring-2 focus:ring-pulse-500/20" />
            </motion.div>
          )}
        </div>
      );
      case "score": return scoreResult ? <ScoreGauge score={scoreResult.total} breakdown={scoreResult} /> : null;
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div key={`stitle-${step}`} className="mb-6 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}>
          <motion.span className="mb-2 inline-block text-4xl" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>{cur.emoji}</motion.span>
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">{cur.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{cur.desc}</p>
        </motion.div>
      </AnimatePresence>
      <div className="mb-6">
        <div className="relative h-1.5 overflow-hidden rounded-full bg-muted/50">
          <motion.div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-pulse-500 via-fuchsia-500 to-pulse-400" animate={{ width: `${progress}%` }} transition={{ duration: 0.6 }} />
        </div>
        <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground"><span>Step {step + 1} of {STEPS.length}</span><span>{Math.round(progress)}%</span></div>
      </div>
      <motion.div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-card/40 p-6 shadow-2xl shadow-pulse-500/5 backdrop-blur-xl md:p-8"
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-pulse-500/5 via-transparent to-fuchsia-500/5" />
        <AnimatePresence mode="wait">
          <motion.div key={`sstep-${step}`} initial={{ x: dir > 0 ? 60 : -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: dir < 0 ? 60 : -60, opacity: 0 }}
            transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.25 } }} className="relative">
            {renderStep()}
          </motion.div>
        </AnimatePresence>
        <div className="mt-8 flex gap-3">
          {cur.id !== "score" && <Button variant="outline" onClick={back} className="border-border/40"><ChevronLeft className="mr-1.5 h-4 w-4" />Back</Button>}
          <Button onClick={next} className="flex-1 bg-gradient-to-r from-pulse-500 to-fuchsia-600 font-semibold shadow-lg shadow-pulse-500/20">
            {cur.id === "score" ? <><Trophy className="mr-1.5 h-4 w-4" />Continue to Dashboard</> : cur.id === "internship" ? <><Sparkles className="mr-1.5 h-4 w-4" />See my score</> : <>Next<ChevronRight className="ml-1.5 h-4 w-4" /></>}
          </Button>
        </div>
      </motion.div>
    </>
  );
}
