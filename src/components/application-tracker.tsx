"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  Plus, Briefcase, GraduationCap, Users, MoreHorizontal,
  ChevronDown, X, CheckCircle, Clock, XCircle, Trophy,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useApplicationStore,
  type ApplicationType,
  type ApplicationStatus,
} from "@/lib/application-store";
import { toast } from "sonner";

// ─── Config ────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<ApplicationType, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  internship:  { label: "Internship",  icon: Briefcase,      color: "#a855f7", bg: "bg-purple-500/15" },
  scholarship: { label: "Scholarship", icon: GraduationCap,  color: "#06b6d4", bg: "bg-cyan-500/15" },
  club:        { label: "Club",        icon: Users,           color: "#f59e0b", bg: "bg-amber-500/15" },
  other:       { label: "Other",       icon: MoreHorizontal,  color: "#6b7280", bg: "bg-muted/30" },
};

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; icon: React.ElementType; color: string; badge: string }> = {
  applied:     { label: "Applied",     icon: Clock,         color: "text-blue-400",    badge: "bg-blue-400/15 text-blue-400" },
  shortlisted: { label: "Shortlisted", icon: Trophy,        color: "text-amber-400",   badge: "bg-amber-400/15 text-amber-400" },
  accepted:    { label: "Accepted",    icon: CheckCircle,   color: "text-emerald-400", badge: "bg-emerald-400/15 text-emerald-400" },
  rejected:    { label: "Rejected",    icon: XCircle,       color: "text-red-400",     badge: "bg-red-400/15 text-red-400" },
};

const PIE_COLORS = ["#a855f7", "#06b6d4", "#f59e0b", "#6b7280"];

// ─── Custom Tooltip ─────────────────────────────────────────────────────────

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-background/90 px-4 py-2 text-sm shadow-xl backdrop-blur">
      <p className="font-semibold">{payload[0].name}</p>
      <p className="text-muted-foreground">{payload[0].value} application{payload[0].value !== 1 ? "s" : ""}</p>
    </div>
  );
}

// ─── Add Application Modal ───────────────────────────────────────────────────

function AddApplicationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addApplication = useApplicationStore((s) => s.addApplication);
  const [form, setForm] = React.useState({
    title: "", organization: "", type: "internship" as ApplicationType, status: "applied" as ApplicationStatus,
  });

  const handleSubmit = () => {
    if (!form.title.trim() || !form.organization.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    addApplication(form);
    toast.success("Application tracked! 🎉");
    setForm({ title: "", organization: "", type: "internship", status: "applied" });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/[0.08] bg-card/95 shadow-2xl backdrop-blur-xl"
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="h-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-500" />
            <div className="p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold">Track Application</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Log where you've applied</p>
                </div>
                <button onClick={onClose} className="rounded-lg p-2 hover:bg-muted/50 transition-colors">
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="at">Role / Title</Label>
                  <Input id="at" placeholder="SDE Intern, Research Fellowship..." value={form.title}
                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                    className="mt-1.5 h-11 border-border/40 bg-background/50" />
                </div>
                <div>
                  <Label htmlFor="ao">Company / Organization</Label>
                  <Input id="ao" placeholder="Google, AICTE, ACM..." value={form.organization}
                    onChange={(e) => setForm((p) => ({ ...p, organization: e.target.value }))}
                    className="mt-1.5 h-11 border-border/40 bg-background/50" />
                </div>
                <div>
                  <Label>Type</Label>
                  <div className="mt-1.5 grid grid-cols-2 gap-2">
                    {(Object.entries(TYPE_CONFIG) as [ApplicationType, typeof TYPE_CONFIG[ApplicationType]][]).map(([key, cfg]) => (
                      <button key={key} onClick={() => setForm((p) => ({ ...p, type: key }))}
                        className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                          form.type === key
                            ? "border-purple-500/40 bg-purple-500/15 text-purple-300"
                            : "border-border/40 bg-background/30 text-muted-foreground hover:bg-background/50"
                        }`}>
                        <cfg.icon className="h-3.5 w-3.5" /> {cfg.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="mt-1.5 grid grid-cols-2 gap-2">
                    {(Object.entries(STATUS_CONFIG) as [ApplicationStatus, typeof STATUS_CONFIG[ApplicationStatus]][]).map(([key, cfg]) => (
                      <button key={key} onClick={() => setForm((p) => ({ ...p, status: key }))}
                        className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium transition-all ${
                          form.status === key
                            ? `border-current ${cfg.badge}`
                            : "border-border/40 bg-background/30 text-muted-foreground hover:bg-background/50"
                        }`}>
                        <cfg.icon className="h-3.5 w-3.5" /> {cfg.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={onClose} className="border-border/40">Cancel</Button>
                <Button onClick={handleSubmit} className="flex-1 bg-gradient-to-r from-purple-500 to-fuchsia-600 font-semibold">
                  <Plus className="mr-1.5 h-4 w-4" /> Add Application
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function ApplicationTracker() {
  const applications = useApplicationStore((s) => s.applications);
  const updateStatus = useApplicationStore((s) => s.updateStatus);
  const removeApplication = useApplicationStore((s) => s.removeApplication);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  // Pie chart data by TYPE
  const typeData = React.useMemo(() => {
    const counts: Record<ApplicationType, number> = { internship: 0, scholarship: 0, club: 0, other: 0 };
    applications.forEach((a) => counts[a.type]++);
    return Object.entries(counts)
      .filter(([, v]) => v > 0)
      .map(([key, value]) => ({
        name: TYPE_CONFIG[key as ApplicationType].label,
        value,
        color: TYPE_CONFIG[key as ApplicationType].color,
      }));
  }, [applications]);

  // Status summary
  const statusCounts = React.useMemo(() => {
    const counts: Record<ApplicationStatus, number> = { applied: 0, shortlisted: 0, accepted: 0, rejected: 0 };
    applications.forEach((a) => counts[a.status]++);
    return counts;
  }, [applications]);

  return (
    <>
      <AddApplicationModal open={modalOpen} onClose={() => setModalOpen(false)} />

      <Card className="border-border/60 bg-card/50 backdrop-blur">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="font-display text-lg">
              📊 Application Tracker
            </CardTitle>
            <Button size="sm" onClick={() => setModalOpen(true)}
              className="bg-gradient-to-r from-purple-500 to-fuchsia-600 shadow-lg shadow-purple-500/20 h-8 text-xs">
              <Plus className="mr-1 h-3.5 w-3.5" /> Track
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {applications.length} application{applications.length !== 1 ? "s" : ""} tracked
          </p>
        </CardHeader>

        <CardContent className="pt-0">
          {applications.length === 0 ? (
            <motion.div className="flex flex-col items-center py-8 text-center"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="mb-3 rounded-full bg-purple-500/10 p-4">
                <Briefcase className="h-8 w-8 text-purple-400/50" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">No applications yet</p>
              <p className="mt-1 text-xs text-muted-foreground/60">Start tracking your internships & scholarships</p>
              <Button size="sm" onClick={() => setModalOpen(true)}
                className="mt-4 bg-gradient-to-r from-purple-500 to-fuchsia-600">
                <Plus className="mr-1.5 h-3.5 w-3.5" /> Add First Application
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {/* Pie chart */}
              <motion.div className="h-44" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={72}
                      paddingAngle={3}
                      dataKey="value"
                      animationBegin={0}
                      animationDuration={800}
                    >
                      {typeData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      formatter={(value) => (
                        <span className="text-[11px] text-muted-foreground">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Status summary row */}
              <div className="grid grid-cols-4 gap-1.5">
                {(Object.entries(STATUS_CONFIG) as [ApplicationStatus, typeof STATUS_CONFIG[ApplicationStatus]][]).map(([key, cfg]) => (
                  <div key={key} className={`rounded-xl p-2 text-center ${cfg.badge} bg-opacity-10`}>
                    <p className="text-base font-bold">{statusCounts[key]}</p>
                    <p className="text-[9px] font-medium">{cfg.label}</p>
                  </div>
                ))}
              </div>

              {/* Applications list */}
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                <AnimatePresence>
                  {applications.map((app, idx) => {
                    const typeCfg = TYPE_CONFIG[app.type];
                    const statusCfg = STATUS_CONFIG[app.status];
                    const isExpanded = expandedId === app.id;
                    return (
                      <motion.div key={app.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: idx * 0.04 }}>
                        <div className="rounded-xl border border-border/40 bg-background/30 overflow-hidden">
                          <button className="flex w-full items-center gap-3 p-3 text-left hover:bg-muted/20 transition-colors"
                            onClick={() => setExpandedId(isExpanded ? null : app.id)}>
                            <div className={`rounded-lg p-1.5 ${typeCfg.bg} shrink-0`}>
                              <typeCfg.icon className="h-3.5 w-3.5" style={{ color: typeCfg.color }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold truncate">{app.title}</p>
                              <p className="text-[10px] text-muted-foreground truncate">{app.organization}</p>
                            </div>
                            <Badge className={`text-[9px] py-0 px-1.5 shrink-0 ${statusCfg.badge}`}>
                              {statusCfg.label}
                            </Badge>
                            <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                          </button>

                          {/* Expanded controls */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                className="border-t border-border/30 px-3 py-2.5"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <p className="mb-2 text-[10px] text-muted-foreground">Update status:</p>
                                <div className="flex flex-wrap gap-1.5 mb-2">
                                  {(Object.entries(STATUS_CONFIG) as [ApplicationStatus, typeof STATUS_CONFIG[ApplicationStatus]][]).map(([key, cfg]) => (
                                    <button key={key}
                                      onClick={() => { updateStatus(app.id, key); setExpandedId(null); toast.success(`Status → ${cfg.label}`); }}
                                      className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition-all ${
                                        app.status === key ? cfg.badge : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                                      }`}>
                                      <cfg.icon className="h-2.5 w-2.5" /> {cfg.label}
                                    </button>
                                  ))}
                                </div>
                                <button onClick={() => { removeApplication(app.id); setExpandedId(null); toast("Application removed"); }}
                                  className="text-[10px] text-red-400 hover:text-red-300 transition-colors">
                                  Remove
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
