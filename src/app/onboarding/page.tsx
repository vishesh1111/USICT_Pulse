"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/lib/user-store";
import { BRANCHES, YEARS, INTEREST_OPTIONS } from "@/lib/constants";
import { toast } from "sonner";

// NOTE: `metadata` cannot be exported from a client component. Title is set via
// `app/onboarding/layout.tsx`.

type OnboardingStep = "name" | "branch" | "year" | "interests" | "goals";

const STEPS: { id: OnboardingStep; title: string; description: string }[] = [
  { id: "name", title: "What's your name?", description: "We'll use this to personalize your experience." },
  { id: "branch", title: "What's your branch?", description: "This helps us recommend relevant opportunities." },
  { id: "year", title: "What year are you in?", description: "So we can tailor recommendations by seniority." },
  { id: "interests", title: "What interests you?", description: "Pick at least 3 topics you're passionate about." },
  { id: "goals", title: "What are your goals?", description: "Help us understand what you're working towards." },
];

export default function OnboardingPage() {
  const router = useRouter();
  const setProfile = useUserStore((s) => s.setProfile);
  const [stepIndex, setStepIndex] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  const [formData, setFormData] = React.useState({
    fullName: "",
    branch: "" as any,
    year: 1,
    interests: [] as string[],
    goals: "",
  });

  const currentStep = STEPS[stepIndex];
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  const handleNext = async () => {
    if (currentStep.id === "name" && !formData.fullName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (currentStep.id === "branch" && !formData.branch) {
      toast.error("Please select your branch");
      return;
    }
    if (currentStep.id === "interests" && formData.interests.length < 3) {
      toast.error("Please select at least 3 interests");
      return;
    }
    if (currentStep.id === "goals" && !formData.goals.trim()) {
      toast.error("Please describe your goals");
      return;
    }

    if (stepIndex < STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      // Complete onboarding
      setLoading(true);
      await new Promise((r) => setTimeout(r, 600));

      setProfile({
        fullName: formData.fullName,
        email: `${formData.fullName.toLowerCase().replace(/\s+/g, ".")}@usict.in`,
        branch: formData.branch,
        year: formData.year,
        interests: formData.interests,
        goals: formData.goals.split("\n").filter(Boolean),
        avatarSeed: formData.fullName,
        onboardedAt: new Date().toISOString(),
      });

      toast.success("Profile created! Redirecting to dashboard...");
      setTimeout(() => router.push("/dashboard"), 800);
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  };

  const toggleInterest = (interest: string) => {
    setFormData((p) => ({
      ...p,
      interests: p.interests.includes(interest)
        ? p.interests.filter((i) => i !== interest)
        : [...p.interests, interest],
    }));
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="mx-auto max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between">
            <h1 className="font-display text-2xl font-bold md:text-3xl">
              {currentStep.title}
            </h1>
            <span className="text-xs text-muted-foreground">
              Step {stepIndex + 1} of {STEPS.length}
            </span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>

        {/* Card */}
        <Card className="border-border/60 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardDescription>{currentStep.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name Step */}
            {currentStep.id === "name" && (
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  placeholder="Aarav Sharma"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, fullName: e.target.value }))
                  }
                  autoFocus
                />
              </div>
            )}

            {/* Branch Step */}
            {currentStep.id === "branch" && (
              <div className="space-y-2">
                <Label htmlFor="branch">Select your branch</Label>
                <Select value={formData.branch} onValueChange={(v) =>
                  setFormData((p) => ({ ...p, branch: v }))
                }>
                  <SelectTrigger id="branch">
                    <SelectValue placeholder="Choose branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {BRANCHES.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Year Step */}
            {currentStep.id === "year" && (
              <div className="space-y-2">
                <Label htmlFor="year">Year of study</Label>
                <Select value={formData.year.toString()} onValueChange={(v) =>
                  setFormData((p) => ({ ...p, year: parseInt(v) }))
                }>
                  <SelectTrigger id="year">
                    <SelectValue placeholder="Choose year" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEARS.map((y) => (
                      <SelectItem key={y} value={y.toString()}>
                        Year {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Interests Step */}
            {currentStep.id === "interests" && (
              <div className="space-y-3">
                <Label>Select your interests (at least 3)</Label>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                  {INTEREST_OPTIONS.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                        formData.interests.includes(interest)
                          ? "border-pulse-500 bg-pulse-500/20 text-pulse-300"
                          : "border-border/60 bg-card/50 text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formData.interests.length} selected
                </p>
              </div>
            )}

            {/* Goals Step */}
            {currentStep.id === "goals" && (
              <div className="space-y-2">
                <Label htmlFor="goals">What are your goals?</Label>
                <textarea
                  id="goals"
                  placeholder="E.g., Get an internship at a big tech company&#10;Learn machine learning&#10;Build a startup&#10;Get a scholarship"
                  value={formData.goals}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, goals: e.target.value }))
                  }
                  className="min-h-32 w-full rounded-lg border border-border/60 bg-background/50 px-3 py-2 text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-pulse-500"
                  autoFocus
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={stepIndex === 0 || loading}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={loading}
                className="flex-1"
              >
                {loading ? "Creating profile..." : stepIndex === STEPS.length - 1 ? "Complete setup" : "Next"}
                {!loading && stepIndex < STEPS.length - 1 && (
                  <ChevronRight className="ml-2 h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Step indicators */}
        <div className="mt-8 flex justify-center gap-2">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i <= stepIndex ? "bg-pulse-500" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
