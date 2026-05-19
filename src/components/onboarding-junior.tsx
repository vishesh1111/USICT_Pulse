"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, Rocket, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BRANCHES, YEARS, INTEREST_OPTIONS, BRANCH_LABELS } from "@/lib/constants";
import { toast } from "sonner";

const STEPS = [
  { id: "name", title: "What's your name?", desc: "We'll use this to personalize your experience.", emoji: "👋" },
  { id: "branch", title: "What's your branch?", desc: "This helps us recommend relevant opportunities.", emoji: "🎯" },
  { id: "year", title: "What year are you in?", desc: "So we can tailor recommendations by seniority.", emoji: "📚" },
  { id: "interests", title: "What interests you?", desc: "Pick at least 3 topics you're passionate about.", emoji: "✨" },
  { id: "goals", title: "What are your goals?", desc: "Help us understand what you're working towards.", emoji: "🚀" },
];

interface JuniorData { fullName: string; branch: string; year: number; interests: string[]; goals: string; }

export function JuniorFlow({ onComplete, onBack }: { onComplete: (data: JuniorData) => void; onBack: () => void }) {
  const [step, setStep] = React.useState(0);
  const [dir, setDir] = React.useState(0);
  const [data, setData] = React.useState<JuniorData>({ fullName: "", branch: "", year: 1, interests: [], goals: "" });
  const cur = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  const next = () => {
    if (cur.id === "name" && !data.fullName.trim()) { toast.error("Please enter your name"); return; }
    if (cur.id === "branch" && !data.branch) { toast.error("Please select your branch"); return; }
    if (cur.id === "interests" && data.interests.length < 3) { toast.error("Select at least 3 interests"); return; }
    if (cur.id === "goals" && !data.goals.trim()) { toast.error("Please describe your goals"); return; }
    if (step < STEPS.length - 1) { setDir(1); setStep(step + 1); }
    else onComplete(data);
  };
  const back = () => { if (step > 0) { setDir(-1); setStep(step - 1); } else onBack(); };
  const toggle = (i: string) => setData(p => ({ ...p, interests: p.interests.includes(i) ? p.interests.filter(x => x !== i) : [...p.interests, i] }));

  const renderStep = () => {
    switch (cur.id) {
      case "name": return (
        <div className="space-y-4">
          <Label htmlFor="jname">Full name</Label>
          <Input id="jname" placeholder="Aarav Sharma" value={data.fullName} onChange={e => setData(p => ({ ...p, fullName: e.target.value }))} autoFocus className="h-12 border-border/40 bg-background/50 text-base" />
          {data.fullName && <motion.p className="text-xs text-muted-foreground" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Welcome, <span className="font-semibold text-pulse-400">{data.fullName}</span>! 🎉</motion.p>}
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
      case "year": return (
        <div className="space-y-4">
          <Label>Year of study</Label>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{YEARS.map((y, i) => (
            <motion.button key={y} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} onClick={() => setData(p => ({ ...p, year: y }))}
              className={`rounded-xl border p-5 text-center transition-all ${data.year === y ? "border-pulse-500/50 bg-pulse-500/10 shadow-lg shadow-pulse-500/10" : "border-border/40 bg-background/30 hover:bg-background/50"}`}>
              <div className="font-display text-3xl font-bold">{y}</div>
              <div className="mt-1 text-xs text-muted-foreground">{y === 1 ? "Freshman" : y === 2 ? "Sophomore" : y === 3 ? "Junior" : "Senior"}</div>
            </motion.button>
          ))}</div>
        </div>
      );
      case "interests": return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Select your interests (at least 3)</Label>
            <span className={`text-xs font-medium ${data.interests.length >= 3 ? "text-emerald-400" : "text-muted-foreground"}`}>{data.interests.length} selected</span>
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">{INTEREST_OPTIONS.map((interest, i) => (
            <motion.button key={interest} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }} onClick={() => toggle(interest)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className={`rounded-xl border px-3 py-2.5 text-xs font-medium transition-all md:text-sm ${data.interests.includes(interest) ? "border-pulse-500/50 bg-pulse-500/15 text-pulse-300" : "border-border/40 bg-background/30 text-muted-foreground hover:bg-background/50"}`}>
              <span className="flex items-center justify-center gap-1.5">
                {data.interests.includes(interest) && <Check className="h-3 w-3" />}{interest}
              </span>
            </motion.button>
          ))}</div>
        </div>
      );
      case "goals": return (
        <div className="space-y-4">
          <Label htmlFor="jgoals">What are your goals?</Label>
          <textarea id="jgoals" placeholder={"Get an internship at a big tech company\nLearn machine learning\nBuild a startup"} value={data.goals} onChange={e => setData(p => ({ ...p, goals: e.target.value }))}
            className="min-h-36 w-full rounded-xl border border-border/40 bg-background/50 px-4 py-3 text-sm placeholder-muted-foreground/50 backdrop-blur focus:border-pulse-500/50 focus:outline-none focus:ring-2 focus:ring-pulse-500/20" autoFocus />
          <motion.div className="flex items-center gap-2 rounded-lg bg-pulse-500/5 p-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Rocket className="h-4 w-4 text-pulse-400" /><p className="text-xs text-muted-foreground">One line per goal. We&apos;ll match you with relevant opportunities.</p>
          </motion.div>
        </div>
      );
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div key={`title-${step}`} className="mb-6 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}>
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
          <motion.div key={`step-${step}`} initial={{ x: dir > 0 ? 60 : -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: dir < 0 ? 60 : -60, opacity: 0 }}
            transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.25 } }} className="relative">
            {renderStep()}
          </motion.div>
        </AnimatePresence>
        <div className="mt-8 flex gap-3">
          <Button variant="outline" onClick={back} className="border-border/40"><ChevronLeft className="mr-1.5 h-4 w-4" />Back</Button>
          <Button onClick={next} className="flex-1 bg-gradient-to-r from-pulse-500 to-fuchsia-600 font-semibold shadow-lg shadow-pulse-500/20">
            {step === STEPS.length - 1 ? <><Sparkles className="mr-1.5 h-4 w-4" />Complete setup</> : <>Next<ChevronRight className="ml-1.5 h-4 w-4" /></>}
          </Button>
        </div>
      </motion.div>
    </>
  );
}
