"use client";

import * as React from "react";
import { Search } from "lucide-react";
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
import { TeacherCard } from "@/components/teachers/teacher-card";
import { MOCK_TEACHERS } from "@/lib/mock";
import { BRANCHES } from "@/lib/constants";

export default function TeachersPage() {
  const [search, setSearch] = React.useState("");
  const [branchFilter, setBranchFilter] = React.useState<string>("all");

  const filteredTeachers = MOCK_TEACHERS.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(search.toLowerCase()) ||
      teacher.subjects.some(s => s.toLowerCase().includes(search.toLowerCase()));
    
    const matchesBranch =
      branchFilter === "all" || teacher.branch === branchFilter;
      
    return matchesSearch && matchesBranch;
  });

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          Teacher Reviews
        </h1>
        <p className="mt-2 text-muted-foreground">
          Honest reviews and subject insights from seniors. Browse {filteredTeachers.length} teachers.
        </p>
      </div>

      <div className="mb-8 space-y-4 md:flex md:gap-4 md:space-y-0">
        <div className="flex-1 relative">
           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
           <Input
              placeholder="Search by teacher name or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
           />
        </div>
        <Select value={branchFilter} onValueChange={setBranchFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Branch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches</SelectItem>
            {BRANCHES.map((b) => (
              <SelectItem key={b} value={b}>{b}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredTeachers.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTeachers.map((teacher) => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))}
          </div>
      ) : (
          <Card className="border-border/60 bg-card/50">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <p className="font-semibold">No teachers found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your search criteria.
              </p>
            </CardContent>
          </Card>
      )}
    </div>
  );
}
