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
import { ResourceCard } from "@/components/resources/resource-card";
import { MOCK_RESOURCES } from "@/lib/mock";

const SUBJECTS = [
  "DBMS", "OOPS", "DSA", "LLD", "HLD", "OS", "CN", "SYSTEM_DESIGN", "AI_ML", "WEB_DEV"
];

export default function ResourcesPage() {
  const [search, setSearch] = React.useState("");
  const [subjectFilter, setSubjectFilter] = React.useState<string>("all");

  const filteredResources = MOCK_RESOURCES.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(search.toLowerCase()) ||
      resource.description.toLowerCase().includes(search.toLowerCase()) ||
      resource.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      
    const matchesSubject =
      subjectFilter === "all" || resource.subject === subjectFilter;
      
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          Resources Library
        </h1>
        <p className="mt-2 text-muted-foreground">
          Curated collection of notes, playlists, and roadmaps by seniors.
        </p>
      </div>

       <div className="mb-8 space-y-4 md:flex md:gap-4 md:space-y-0">
        <div className="flex-1 relative">
           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
           <Input
              placeholder="Search by title, description or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
           />
        </div>
        <Select value={subjectFilter} onValueChange={setSubjectFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {SUBJECTS.map((s) => (
              <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredResources.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredResources.map((resource) => (
               <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
      ) : (
          <Card className="border-border/60 bg-card/50">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <p className="font-semibold">No resources found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your search criteria.
              </p>
            </CardContent>
          </Card>
      )}
    </div>
  );
}
