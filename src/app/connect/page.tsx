"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MentorCard } from "@/components/mentor-card";
import { ConnectModal } from "@/components/connect-modal";
import { MOCK_SENIORS } from "@/lib/mock";
import { BRANCHES, YEARS } from "@/lib/constants";

// NOTE: `metadata` cannot be exported from a client component (this file uses
// "use client"). The page title for /connect is set via `app/connect/layout.tsx`.

export default function ConnectPage() {
  const [search, setSearch] = React.useState("");
  const [branchFilter, setBranchFilter] = React.useState<string>("all");
  const [yearFilter, setYearFilter] = React.useState<string>("all");
  const [selectedMentor, setSelectedMentor] = React.useState<{
    id: string;
    name: string;
  } | null>(null);

  const filteredMentors = MOCK_SENIORS.filter((mentor) => {
    const matchesSearch =
      mentor.fullName.toLowerCase().includes(search.toLowerCase()) ||
      mentor.bio?.toLowerCase().includes(search.toLowerCase()) ||
      mentor.mentoringTopics?.some((t) =>
        t.toLowerCase().includes(search.toLowerCase())
      );
    const matchesBranch =
      branchFilter === "all" || mentor.branch === branchFilter;
    const matchesYear = yearFilter === "all" || mentor.year === parseInt(yearFilter);
    return matchesSearch && matchesBranch && matchesYear;
  });

  const hasActiveFilters = search || branchFilter !== "all" || yearFilter !== "all";

  return (
    <>
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Find your mentor
          </h1>
          <p className="mt-2 text-muted-foreground">
            Real USICT seniors ready to guide you. {filteredMentors.length} mentors match your search.
          </p>
        </div>

        {/* Search + Filters */}
        <div className="mb-8 space-y-4 lg:flex lg:gap-4 lg:space-y-0">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, interest, or topic..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <Select value={branchFilter} onValueChange={setBranchFilter}>
            <SelectTrigger className="w-40">
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

          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All years</SelectItem>
              {YEARS.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  Year {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch("");
                setBranchFilter("all");
                setYearFilter("all");
              }}
            >
              Clear filters
            </Button>
          )}
        </div>

        {/* Results */}
        {filteredMentors.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredMentors.map((mentor) => (
              <MentorCard
                key={mentor.id}
                mentor={mentor}
                onConnect={(id) =>
                  setSelectedMentor({
                    id,
                    name: mentor.fullName,
                  })
                }
              />
            ))}
          </div>
        ) : (
          <Card className="border-border/60 bg-card/50">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <p className="font-semibold">No mentors found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your search or filters.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Connect Modal */}
      <ConnectModal
        mentorName={selectedMentor?.name || ""}
        isOpen={!!selectedMentor}
        onOpenChange={(open) => {
          if (!open) setSelectedMentor(null);
        }}
      />
    </>
  );
}
