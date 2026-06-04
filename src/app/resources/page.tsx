"use client";

import * as React from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ResourceCard } from "@/components/resources/resource-card";
import { AddResourceModal } from "@/components/resources/add-resource-modal";
import { useResourceStore } from "@/lib/resource-store";
import { useUserStore } from "@/lib/user-store";

const SUBJECTS = [
  "DBMS", "OOPS", "DSA", "LLD", "HLD", "OS", "CN", "SYSTEM_DESIGN", "AI_ML", "WEB_DEV"
];

export default function ResourcesPage() {
  const [search, setSearch] = React.useState("");
  const [subjectFilter, setSubjectFilter] = React.useState<string>("all");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [apiResources, setApiResources] = React.useState<any[]>([]);
  const [showHidden, setShowHidden] = React.useState(false);

  const fetchResources = React.useCallback(async () => {
    try {
      const res = await fetch("/api/resources");
      const data = await res.json();
      setApiResources(data.resources || []);
    } catch (err) {
      console.error("Failed to fetch resources", err);
    }
  }, []);

  React.useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const profile = useUserStore((s) => s.profile);
  const userResources = useResourceStore((s) => s.resources);
  const isSenior = profile?.role === "senior";

  // Merge mock + user-added resources, newest first
  const allResources = React.useMemo(() => {
    const merged = [...userResources, ...apiResources];
    return merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [userResources, apiResources]);

  const filteredResources = allResources.filter((resource) => {
    const isHidden = resource.isHidden;
    if (isSenior && showHidden) {
      if (!isHidden) return false;
    } else {
      if (isHidden) return false;
    }

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
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Resources Library
          </h1>
          <p className="mt-2 text-muted-foreground">
            Curated collection of notes, playlists, and roadmaps by seniors.
          </p>
        </div>
        {isSenior && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowHidden(!showHidden)}
              className={`shrink-0 border-purple-500/30 text-purple-400 hover:bg-purple-500/10 ${showHidden ? 'bg-purple-500/10' : ''}`}
            >
              {showHidden ? "Back to Library" : `View Hidden (${allResources.filter((r: any) => r.isHidden).length})`}
            </Button>
            <Button
              onClick={() => setModalOpen(true)}
              className="shrink-0 bg-gradient-to-r from-pulse-500 to-fuchsia-600 font-semibold shadow-lg shadow-pulse-500/20"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Resource
            </Button>
          </div>
        )}
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
               <ResourceCard
                 key={resource.id}
                 resource={resource as any}
                 isSenior={isSenior}
                 isHidden={resource.isHidden}
                 onHide={async (id) => {
                   setApiResources(prev => prev.map(r => r.id === id ? { ...r, isHidden: true } : r));
                   await fetch(`/api/resources/${id}/hide`, { method: "POST", body: JSON.stringify({ hide: true }) });
                 }}
                 onRestore={async (id) => {
                   setApiResources(prev => prev.map(r => r.id === id ? { ...r, isHidden: false } : r));
                   await fetch(`/api/resources/${id}/hide`, { method: "POST", body: JSON.stringify({ hide: false }) });
                 }}
               />
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

      {/* Add Resource Modal — only renders for seniors */}
      {isSenior && <AddResourceModal open={modalOpen} onClose={() => setModalOpen(false)} />}
    </div>
  );
}
