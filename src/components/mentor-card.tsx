"use client";

import { MessageCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BranchBadge } from "@/components/branch-badge";
import { getInitials } from "@/lib/utils";
import type { MockUser } from "@/lib/mock/types";

interface MentorCardProps {
  mentor: MockUser;
  onConnect?: (mentorId: string) => void;
}

export function MentorCard({ mentor, onConnect }: MentorCardProps) {
  return (
    <Card className="card-hover overflow-hidden border-border/60 bg-card/50 backdrop-blur">
      <CardContent className="flex flex-col p-5">
        <div className="mb-3 flex items-start gap-3">
          <Avatar className="h-12 w-12 ring-2 ring-pulse-500/30">
            <AvatarImage
              src={mentor.avatarUrl}
              alt={mentor.fullName}
            />
            <AvatarFallback>{getInitials(mentor.fullName)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-sm font-semibold leading-tight">
              {mentor.fullName}
            </h3>
            <p className="text-xs text-muted-foreground">
              Year {mentor.year} · {mentor.branch}
            </p>
          </div>
        </div>

        <BranchBadge branch={mentor.branch} size="sm" className="mb-3 w-fit" />

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
          className="w-full"
          onClick={() => onConnect?.(mentor.id)}
        >
          <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
          Connect
        </Button>
      </CardContent>
    </Card>
  );
}
