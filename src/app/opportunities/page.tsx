"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { OpportunityCard } from "@/components/opportunity-card";
import { MOCK_OPPORTUNITIES } from "@/lib/mock";
import { BRANCHES } from "@/lib/constants";

// NOTE: `metadata` cannot be exported from a client component. Title is set via
// `app/opportunities/layout.tsx`.

function OpportunitiesContent() {
  const searchParams = useSearchParams();
  const [typeFilter, setTypeFilter] = React.useState<string | "all">("all");
  const [branchFilter, setBranchFilter] = React.useState<string | "all">("all");
  const [statusFilter, setStatusFilter] = React.useState<string | "all">("OPEN");

  // Get initial tab from query param
  React.useEffect(() => {
    const tab = searchParams?.get("tab");
    if (tab) {
      const mapping: Record<string, string> = {
        internships: "INTERNSHIP",
        scholarships: "SCHOLARSHIP",
        clubs: "CLUB",
        local: "LOCAL",
      };
      setTypeFilter(mapping[tab] || "all");
    }
  }, [searchParams]);

  const filteredOpportunities = MOCK_OPPORTUNITIES.filter((opp) => {
    if (typeFilter !== "all" && opp.type !== typeFilter) return false;
    if (branchFilter !== "all" && !opp.branches.includes(branchFilter as any)) return false;
    if (statusFilter !== "all" && opp.status !== statusFilter) return false;
    return true;
  });

  const hasActiveFilters = typeFilter !== "all" || branchFilter !== "all" || statusFilter !== "all";

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          Opportunities
        </h1>
        <p className="mt-2 text-muted-foreground">
          Curated for USICT. {filteredOpportunities.length} matching your criteria.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Filters */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20 border-border/60 bg-card/50 backdrop-blur">
            <CardContent className="space-y-4 p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={() => {
                      setTypeFilter("all");
                      setBranchFilter("all");
                      setStatusFilter("OPEN");
                    }}
                    className="text-xs text-pulse-500 hover:text-pulse-400"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">
                  Type
                </label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="INTERNSHIP">Internships</SelectItem>
                    <SelectItem value="SCHOLARSHIP">Scholarships</SelectItem>
                    <SelectItem value="CLUB">Clubs</SelectItem>
                    <SelectItem value="LOCAL">Local</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">
                  Branch
                </label>
                <Select value={branchFilter} onValueChange={setBranchFilter}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All branches</SelectItem>
                    {BRANCHES.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">
                  Status
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All status</SelectItem>
                    <SelectItem value="OPEN">Open now</SelectItem>
                    <SelectItem value="UPCOMING">Upcoming</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          {filteredOpportunities.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredOpportunities.map((opp) => (
                <OpportunityCard key={opp.id} opportunity={opp} />
              ))}
            </div>
          ) : (
            <Card className="border-border/60 bg-card/50">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <p className="font-semibold">No opportunities found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try adjusting your filters to find more options.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}


export default function OpportunitiesPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8 md:py-12"><div className="animate-pulse">Loading opportunities...</div></div>}>
      <OpportunitiesContent />
    </Suspense>
  );
}
