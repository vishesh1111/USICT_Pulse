"use client";

import * as React from "react";
import { Search, GraduationCap, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TeacherCard } from "@/components/teachers/teacher-card";
import { MOCK_TEACHERS } from "@/lib/mock";
import { BRANCHES, BRANCH_LABELS, BRANCH_COLORS } from "@/lib/constants";

export default function TeachersPage() {
  const [selectedBranch, setSelectedBranch] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [teachers, setTeachers] = React.useState<any[]>(MOCK_TEACHERS);
  const [loading, setLoading] = React.useState(true);

  const fetchTeachers = React.useCallback(async () => {
    try {
      const res = await fetch("/api/teachers");
      if (res.ok) {
        const data = await res.json();
        if (data.teachers) setTeachers(data.teachers);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const filteredTeachers = teachers.filter((teacher) => {
    if (!selectedBranch) return false;
    const matchesBranch = teacher.branch === selectedBranch;
    const matchesSearch =
      search === "" ||
      teacher.name.toLowerCase().includes(search.toLowerCase()) ||
      teacher.subjects.some((s: string) => s.toLowerCase().includes(search.toLowerCase()));
    return matchesBranch && matchesSearch;
  });

  // Branch selection screen
  if (!selectedBranch) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GraduationCap className="mx-auto h-12 w-12 text-pulse-400 mb-4" />
          </motion.div>
          <motion.h1
            className="font-display text-3xl font-bold tracking-tight md:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Teacher Reviews
          </motion.h1>
          <motion.p
            className="mt-3 text-muted-foreground max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Select your branch to view honest reviews and subject insights from seniors.
          </motion.p>
        </div>

        <motion.div
          className="mx-auto max-w-3xl grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {BRANCHES.map((branch, index) => {
            const teacherCount = teachers.filter((t: any) => t.branch === branch).length;
            return (
              <motion.div
                key={branch}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + index * 0.08, duration: 0.5 }}
              >
                <button
                  onClick={() => setSelectedBranch(branch)}
                  className="group relative w-full overflow-hidden rounded-2xl p-[2px] transition-all duration-300 hover:scale-[1.03]"
                >
                  {/* Animated border beam */}
                  <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_75%,#3a60ff_85%,#d946ef_100%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <Card className="relative overflow-hidden border-0 bg-card/95 backdrop-blur-xl transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(58,96,255,0.15)]">
                    <div className={`h-1.5 w-full bg-gradient-to-r ${BRANCH_COLORS[branch]}`} />
                    <CardContent className="flex flex-col items-center p-8 text-center">
                      <div className="font-display text-3xl font-bold tracking-tight transition-colors group-hover:text-pulse-400">
                        {branch}
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {BRANCH_LABELS[branch]}
                      </p>
                      <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground/70">
                        <GraduationCap className="h-3.5 w-3.5" />
                        {teacherCount} teacher{teacherCount !== 1 ? "s" : ""}
                      </div>
                      <div className="mt-4 flex items-center gap-1 text-sm font-medium text-pulse-500 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
                        View teachers <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </CardContent>
                  </Card>
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    );
  }

  // Teacher list view (after branch is selected)
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => { setSelectedBranch(null); setSearch(""); }}
            className="text-sm text-pulse-400 hover:text-pulse-300 transition-colors font-medium flex items-center gap-1"
          >
            ← All Branches
          </button>
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          {selectedBranch} — Teacher Reviews
        </h1>
        <p className="mt-2 text-muted-foreground">
          Honest reviews and subject insights from seniors. {filteredTeachers.length} teacher{filteredTeachers.length !== 1 ? "s" : ""} found.
        </p>
      </motion.div>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by teacher name or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {filteredTeachers.length > 0 ? (
          <motion.div
            key="results"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.15 }}
          >
            {filteredTeachers.map((teacher, i) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
              >
                <TeacherCard teacher={teacher} onReviewAdded={fetchTeachers} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card className="border-border/60 bg-card/50">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <p className="font-semibold">No teachers found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try adjusting your search criteria.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
