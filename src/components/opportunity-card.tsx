import Link from "next/link";
import { Clock, Tag, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BranchBadge } from "@/components/branch-badge";
import { daysUntil, formatDate } from "@/lib/utils";
import type { MockOpportunity } from "@/lib/mock/types";

interface OpportunityCardProps {
  opportunity: MockOpportunity;
  compact?: boolean;
}

export function OpportunityCard({ opportunity, compact }: OpportunityCardProps) {
  const daysLeft = daysUntil(opportunity.deadline);
  const isClosing = daysLeft <= 3 && daysLeft > 0;
  const isClosed = daysLeft <= 0;

  const typeColors: Record<string, string> = {
    INTERNSHIP: "from-blue-500 to-cyan-500",
    SCHOLARSHIP: "from-emerald-500 to-teal-500",
    CLUB: "from-fuchsia-500 to-purple-500",
    LOCAL: "from-amber-500 to-orange-500",
  };

  const typeLabels: Record<string, string> = {
    INTERNSHIP: "Internship",
    SCHOLARSHIP: "Scholarship",
    CLUB: "Club",
    LOCAL: "Local",
  };

  return (
    <Card className="card-hover overflow-hidden border-border/60 bg-card/50 backdrop-blur">
      <CardContent className="flex flex-col p-5">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-display text-base font-semibold leading-tight">
              {opportunity.title}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {opportunity.organization}
            </p>
          </div>
          {opportunity.featured && (
            <Badge variant="default" className="shrink-0 text-[10px]">
              Featured
            </Badge>
          )}
        </div>

        <div className="mb-3 flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-[10px]">
            {typeLabels[opportunity.type]}
          </Badge>
          {opportunity.stipend && (
            <Badge variant="outline" className="text-[10px]">
              {opportunity.stipend}
            </Badge>
          )}
        </div>

        {!compact && (
          <>
            <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">
              {opportunity.description}
            </p>

            <div className="mb-3 space-y-1 text-xs">
              {opportunity.location && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{opportunity.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span
                  className={
                    isClosed
                      ? "text-destructive font-medium"
                      : isClosing
                        ? "text-amber-500 font-medium"
                        : "text-muted-foreground"
                  }
                >
                  {isClosed
                    ? "Applications closed"
                    : isClosing
                      ? `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`
                      : `Closes ${formatDate(opportunity.deadline)}`}
                </span>
              </div>
            </div>

            {opportunity.branches.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1">
                {opportunity.branches.map((b) => (
                  <BranchBadge key={b} branch={b} size="sm" />
                ))}
              </div>
            )}

            {opportunity.tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-1">
                {opportunity.tags.slice(0, 2).map((t) => (
                  <span
                    key={t}
                    className="rounded px-1.5 py-0.5 bg-accent text-[10px] text-accent-foreground"
                  >
                    {t}
                  </span>
                ))}
                {opportunity.tags.length > 2 && (
                  <span className="text-[10px] text-muted-foreground">
                    +{opportunity.tags.length - 2} more
                  </span>
                )}
              </div>
            )}
          </>
        )}

        <Button
          asChild
          size="sm"
          disabled={isClosed}
          className="w-full"
          variant={isClosed ? "secondary" : "default"}
        >
          <a href={isClosed ? "#" : opportunity.applyUrl} target="_blank" rel="noopener noreferrer">
            {isClosed ? "Closed" : "Apply now"}
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
