"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Shield, Check, X, ArrowLeft, Save, Briefcase, Award, Globe, Link2, Target, Lightbulb, Github, Linkedin
} from "lucide-react";
import { useUserStore } from "@/lib/user-store";
import { getResumeReadiness } from "@/lib/intel-engine";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function ResumeReadinessPage() {
  const router = useRouter();
  const profile = useUserStore((s) => s.profile);
  const setProfile = useUserStore((s) => s.setProfile);
  
  const [saving, setSaving] = React.useState(false);

  // Form State
  const [github, setGithub] = React.useState("");
  const [linkedin, setLinkedin] = React.useState("");
  const [portfolio, setPortfolio] = React.useState("");
  const [cgpa, setCgpa] = React.useState("");
  const [clubsStr, setClubsStr] = React.useState("");
  const [hasInternship, setHasInternship] = React.useState(false);
  const [interestsStr, setInterestsStr] = React.useState("");
  const [goalsStr, setGoalsStr] = React.useState("");

  React.useEffect(() => {
    if (!profile) {
      router.push("/onboarding");
      return;
    }
    setGithub(profile.github || "");
    setLinkedin(profile.linkedin || "");
    setPortfolio(profile.portfolio || "");
    setCgpa(profile.cgpa ? profile.cgpa.toString() : "");
    setClubsStr((profile.clubs || []).join(", "));
    setHasInternship(!!profile.hasInternship);
    setInterestsStr((profile.interests || []).join(", "));
    setGoalsStr((profile.goals || []).join(", "));
  }, [profile, router]);

  if (!profile) return null;

  const readiness = getResumeReadiness(profile);

  const handleSave = async () => {
    setSaving(true);
    
    const parsedCgpa = parseFloat(cgpa);
    const clubs = clubsStr.split(",").map(s => s.trim()).filter(Boolean);
    const interests = interestsStr.split(",").map(s => s.trim()).filter(Boolean);
    const goals = goalsStr.split(",").map(s => s.trim()).filter(Boolean);

    const updates = {
      github,
      linkedin,
      portfolio,
      cgpa: isNaN(parsedCgpa) ? undefined : parsedCgpa,
      clubs,
      hasInternship,
      interests,
      goals,
    };

    // Update Local Store
    setProfile({ ...profile, ...updates } as any);

    // Update DB
    try {
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: profile.email, fullName: profile.fullName, role: profile.role, ...updates }),
      });
      toast.success("Resume data updated!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to sync with server, but updated locally.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="mb-4 -ml-2 text-muted-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-2 font-display text-3xl font-bold tracking-tight">
              <Shield className="h-8 w-8 text-emerald-400" />
              Resume Readiness
            </h1>
            <p className="mt-2 text-muted-foreground">
              Fix missing items to improve your score and get better opportunities.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-sm text-muted-foreground">Current Score</span>
              <span className={`text-2xl font-bold ${readiness.score >= 75 ? "text-emerald-400" : readiness.score >= 50 ? "text-amber-400" : "text-red-400"}`}>
                {readiness.score} / 100
              </span>
            </div>
            <Button onClick={handleSave} disabled={saving} className="bg-pulse-600 hover:bg-pulse-500 text-white shadow-lg shadow-pulse-500/20">
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Missing Action Items Summary */}
        <div className="md:col-span-1 space-y-6">
          <Card className="border-border/60 bg-card/50 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-pulse-400" />
                Action Items
              </CardTitle>
              <CardDescription>Items hurting your score</CardDescription>
            </CardHeader>
            <CardContent>
              {readiness.missing.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mb-3">
                    <Check className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-medium">Perfect Score!</p>
                  <p className="text-xs text-muted-foreground mt-1">Your resume is ready.</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {readiness.missing.map((item) => (
                    <li key={item.label} className="flex items-start gap-2 text-sm">
                      <X className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground/90">{item.label}</p>
                        <p className="text-xs text-muted-foreground">+{item.points} points</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/50 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              {readiness.filled.length === 0 ? (
                <p className="text-sm text-muted-foreground">No items completed yet.</p>
              ) : (
                <ul className="space-y-2">
                  {readiness.filled.map((item) => (
                    <li key={item.label} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="text-emerald-400 font-medium">+{item.points}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Editing Form */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Links & Profiles */}
          <Card className="border-border/60 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Link2 className="h-5 w-5 text-pulse-400" />
                Digital Presence
              </CardTitle>
              <CardDescription>Links to your professional profiles.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="github" className="flex items-center gap-2">
                  <Github className="h-3.5 w-3.5" /> GitHub Username
                </Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">github.com/</span>
                  <Input id="github" value={github} onChange={(e) => setGithub(e.target.value)} className="rounded-l-none" placeholder="username" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="linkedin" className="flex items-center gap-2">
                  <Linkedin className="h-3.5 w-3.5" /> LinkedIn Username
                </Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">linkedin.com/in/</span>
                  <Input id="linkedin" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="rounded-l-none" placeholder="username" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="portfolio" className="flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5" /> Portfolio URL
                </Label>
                <Input id="portfolio" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} placeholder="https://yourwebsite.com" />
              </div>
            </CardContent>
          </Card>

          {/* Experience & Academics */}
          <Card className="border-border/60 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award className="h-5 w-5 text-amber-400" />
                Experience & Academics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="cgpa">Current CGPA</Label>
                <Input id="cgpa" type="number" step="0.01" min="0" max="10" value={cgpa} onChange={(e) => setCgpa(e.target.value)} placeholder="e.g. 8.5" />
                <p className="text-[10px] text-muted-foreground">Needs to be ≥ 8.0 for full points.</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="clubs">Club Memberships (comma-separated)</Label>
                <Input id="clubs" value={clubsStr} onChange={(e) => setClubsStr(e.target.value)} placeholder="e.g. InfoXpression, GDSC" />
              </div>
              <div className="flex flex-row items-center justify-between rounded-lg border border-border p-3">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Internship Experience</Label>
                  <p className="text-xs text-muted-foreground">Have you completed an internship?</p>
                </div>
                <Button 
                  variant={hasInternship ? "default" : "outline"}
                  onClick={() => setHasInternship(!hasInternship)}
                  className={hasInternship ? "bg-emerald-500 hover:bg-emerald-600 text-white" : ""}
                >
                  {hasInternship ? "Yes, I have" : "Not yet"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Interests & Goals */}
          <Card className="border-border/60 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lightbulb className="h-5 w-5 text-purple-400" />
                Interests & Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="interests">Interests (comma-separated)</Label>
                <Input id="interests" value={interestsStr} onChange={(e) => setInterestsStr(e.target.value)} placeholder="e.g. Web Dev, Machine Learning, UI/UX" />
                <p className="text-[10px] text-muted-foreground">List at least 3 interests to get full points.</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="goals">Career Goals (comma-separated)</Label>
                <Input id="goals" value={goalsStr} onChange={(e) => setGoalsStr(e.target.value)} placeholder="e.g. Software Engineer, Data Scientist" />
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
