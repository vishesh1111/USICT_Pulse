"use client";

import { MessageCircle, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BranchBadge } from "@/components/branch-badge";
import { getInitials } from "@/lib/utils";
import type { MockUser } from "@/lib/mock/types";
import { useUserStore } from "@/lib/user-store";

interface MentorCardProps {
  mentor: MockUser;
  onConnect?: (mentorId: string) => void;
}

export function MentorCard({ mentor, onConnect }: MentorCardProps) {
  const profile = useUserStore((s) => s.profile);

  let matchScore = 0;
  const matchReasons: string[] = [];

  if (profile) {
    if (profile.branch === mentor.branch) {
      matchScore += 30;
      matchReasons.push("Same Branch");
    }

    const commonInterests = profile.interests?.filter((i) =>
      mentor.interests?.some((mi) => mi.toLowerCase() === i.toLowerCase()) ||
      mentor.mentoringTopics?.some((mt) => mt.toLowerCase() === i.toLowerCase())
    ) || [];

    if (commonInterests.length > 0) {
      matchScore += 30;
      matchReasons.push(`Interested in ${commonInterests[0]}`);
    }

    const commonGoals = profile.goals?.filter((g) =>
      mentor.mentoringTopics?.some((mt) => mt.toLowerCase() === g.toLowerCase()) ||
      mentor.interests?.some((mi) => mi.toLowerCase() === g.toLowerCase()) ||
      mentor.achievements?.some((a) => a.toLowerCase().includes(g.toLowerCase()))
    ) || [];

    if (commonGoals.length > 0) {
      matchScore += 25;
      matchReasons.push(`${commonGoals[0]} Guidance`);
    } else if (profile.goals && profile.goals.length > 0 && mentor.skills && mentor.skills.length > 0) {
      matchScore += 25;
      matchReasons.push("Similar Career Goal");
    }

    const commonTech = profile.interests?.filter((i) =>
      mentor.skills?.some((s) => s.toLowerCase() === i.toLowerCase() || s.toLowerCase().includes(i.toLowerCase()))
    ) || [];

    if (commonTech.length > 0) {
      matchScore += 15;
      matchReasons.push(`Uses ${commonTech[0]}`);
    } else if (matchScore < 100 && mentor.skills && mentor.skills.length > 0) {
      matchScore += 15;
      matchReasons.push(`Expert in ${mentor.skills[0]}`);
    }

    matchScore = Math.min(100, Math.max(matchScore, 45)); 
  } else {
    matchScore = 85; 
    matchReasons.push("Highly Rated Mentor");
    matchReasons.push("Matches your branch");
  }

  const displayReasons = matchReasons.slice(0, 4);

  return (
    <Card className="card-hover overflow-hidden border-border/60 bg-card/50 backdrop-blur">
      <CardContent className="flex flex-col p-5">
        <div className="mb-3 flex items-start gap-3 relative">
          <div className="absolute right-0 top-0 flex items-center gap-1.5 rounded-full bg-purple-500/15 px-2.5 py-1 border border-purple-500/20">
            <span className="text-xs font-bold text-purple-400">🟣 {matchScore}% Match</span>
          </div>

          <Avatar className="h-12 w-12 ring-2 ring-pulse-500/30">
            <AvatarImage
              src={mentor.avatarUrl}
              alt={mentor.fullName}
            />
            <AvatarFallback>{getInitials(mentor.fullName)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 pr-24">
            <h3 className="font-display text-sm font-semibold leading-tight">
              {mentor.fullName}
            </h3>
            <p className="text-xs text-muted-foreground">
              Year {mentor.year} · {mentor.branch}
            </p>
          </div>
        </div>

        <BranchBadge branch={mentor.branch} size="sm" className="mb-3 w-fit" />

        {displayReasons.length > 0 && (
          <div className="mb-4 rounded-lg bg-purple-500/5 border border-purple-500/10 p-3">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-purple-400">
              Why matched with you
            </p>
            <ul className="space-y-1.5">
              {displayReasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2 text-[11px] text-muted-foreground">
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {mentor.bio && (
          <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">
            {mentor.bio}
          </p>
        )}

        {mentor.mentoringTopics && mentor.mentoringTopics.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1">
            {mentor.mentoringTopics.slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded px-1.5 py-0.5 bg-pulse-500/15 text-[10px] text-pulse-300"
              >
                {t}
              </span>
            ))}
            {mentor.mentoringTopics.length > 3 && (
              <span className="text-[10px] text-muted-foreground">
                +{mentor.mentoringTopics.length - 3}
              </span>
            )}
          </div>
        )}

        {mentor.achievements && mentor.achievements.length > 0 && (
          <div className="mb-4 flex items-center gap-1 text-[10px] text-muted-foreground">
            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
            <span className="line-clamp-1">{mentor.achievements[0]}</span>
          </div>
        )}

        <Button
          size="sm"
          variant="outline"
          className="w-full mt-auto"
          onClick={() => onConnect?.(mentor.id)}
        >
          <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
          Connect
        </Button>
      </CardContent>
    </Card>
  );
}
