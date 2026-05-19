"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Code2, Github, Linkedin, Globe, Twitter, ExternalLink,
  User, BookOpen, Target, Edit3, CheckCircle
} from "lucide-react";
import { useUserStore } from "@/lib/user-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";

const SOCIAL_FIELDS = [
  { key: "leetcode",    label: "LeetCode",     icon: Code2,    color: "text-amber-400",   bg: "bg-amber-400/10",   border: "border-amber-400/20",   prefix: "leetcode.com/" },
  { key: "github",     label: "GitHub",       icon: Github,   color: "text-slate-300",   bg: "bg-slate-300/10",   border: "border-slate-300/20",   prefix: "github.com/" },
  { key: "linkedin",   label: "LinkedIn",     icon: Linkedin, color: "text-blue-400",    bg: "bg-blue-400/10",    border: "border-blue-400/20",    prefix: "linkedin.com/in/" },
  { key: "huggingface",label: "Hugging Face", icon: Globe,    color: "text-yellow-400",  bg: "bg-yellow-400/10",  border: "border-yellow-400/20",  prefix: "huggingface.co/" },
  { key: "twitter",    label: "Twitter / X",  icon: Twitter,  color: "text-sky-400",     bg: "bg-sky-400/10",     border: "border-sky-400/20",     prefix: "x.com/" },
  { key: "portfolio",  label: "Portfolio",    icon: Globe,    color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20", prefix: "" },
];

export default function ProfilePage() {
  const router = useRouter();
  const profile = useUserStore((s) => s.profile);
  const setProfile = useUserStore((s) => s.setProfile);
  const [editing, setEditing] = React.useState(false);
  const [links, setLinks] = React.useState<Record<string, string>>({});
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!profile) { router.push("/onboarding"); return; }
    setLinks({
      leetcode: profile.leetcode || "",
      github: profile.github || "",
      linkedin: profile.linkedin || "",
      huggingface: profile.huggingface || "",
      twitter: profile.twitter || "",
      portfolio: profile.portfolio || "",
    });
  }, [profile, router]);

  if (!profile) return null;

  const filledLinks = SOCIAL_FIELDS.filter((f) => links[f.key]);
  const isSenior = profile.role === "senior";

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setProfile({ ...profile, ...links } as any);
    // Sync to DB
    fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: profile.email, fullName: profile.fullName, role: profile.role, ...links }),
    }).catch(console.error);
    setSaving(false);
    setEditing(false);
    toast.success("Profile updated!");
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 md:py-12">
      {/* Hero card */}
      <motion.div
        className="mb-8 overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-pulse-500/10 via-fuchsia-500/5 to-transparent p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <Avatar className="h-24 w-24 ring-4 ring-pulse-500/30 shrink-0">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.avatarSeed)}`} />
            <AvatarFallback className="text-xl">{getInitials(profile.fullName)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h1 className="font-display text-2xl font-bold">{profile.fullName}</h1>
              <Badge className={`text-[10px] ${isSenior ? "bg-purple-500/15 text-purple-400" : "bg-cyan-500/15 text-cyan-400"}`}>
                {isSenior ? "Senior Mentor" : "Junior Explorer"}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{profile.branch} · Year {profile.year}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{profile.email}</p>
            <div className="mt-3 flex flex-wrap gap-1.5 justify-center sm:justify-start">
              {profile.interests.slice(0, 4).map((i) => (
                <Badge key={i} variant="secondary" className="text-[10px] py-0">{i}</Badge>
              ))}
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={() => setEditing(!editing)} className="border-border/40 shrink-0">
            <Edit3 className="mr-1.5 h-3.5 w-3.5" />
            {editing ? "Cancel" : "Edit Links"}
          </Button>
        </div>
      </motion.div>

      {/* Social Links */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-border/60 bg-card/50">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-bold flex items-center gap-2">
                  🔗 Social Profiles
                  {!isSenior && <Badge variant="secondary" className="text-[10px] bg-cyan-500/10 text-cyan-400">Visible to seniors</Badge>}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isSenior ? "Your professional links are visible to juniors." : "Seniors can discover and reach out to you based on these."}
                </p>
              </div>
              {filledLinks.length > 0 && !editing && (
                <Badge variant="secondary" className="text-[10px]">{filledLinks.length} connected</Badge>
              )}
            </div>

            {editing ? (
              <div className="space-y-3">
                {SOCIAL_FIELDS.map(({ key, label, icon: Icon, color }) => (
                  <div key={key} className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 shrink-0 ${color}`} />
                    <div className="flex-1">
                      <Input
                        placeholder={`https://${key === "portfolio" ? "yoursite.dev" : key + ".com/username"}`}
                        value={links[key] || ""}
                        onChange={(e) => setLinks((p) => ({ ...p, [key]: e.target.value }))}
                        className="h-10 border-border/40 bg-background/50 text-sm"
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground w-16 shrink-0">{label}</span>
                  </div>
                ))}
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setEditing(false)} className="border-border/40">Cancel</Button>
                  <Button onClick={handleSave} disabled={saving} className="flex-1 bg-gradient-to-r from-pulse-500 to-fuchsia-600">
                    {saving ? (
                      <span className="flex items-center gap-2">
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Saving...
                      </span>
                    ) : (
                      <><CheckCircle className="mr-1.5 h-4 w-4" />Save Changes</>
                    )}
                  </Button>
                </div>
              </div>
            ) : filledLinks.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {filledLinks.map(({ key, label, icon: Icon, color, bg, border }) => (
                  <motion.a
                    key={key}
                    href={links[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 rounded-xl border ${border} ${bg} p-3 transition-all hover:scale-[1.02] hover:shadow-lg`}
                    whileHover={{ y: -2 }}
                  >
                    <Icon className={`h-5 w-5 ${color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold">{label}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{links[key]}</p>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  </motion.a>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-8 text-center">
                <Globe className="h-10 w-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm font-medium text-muted-foreground">No profiles added yet</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Add your profiles to increase visibility among {isSenior ? "juniors" : "seniors"}.</p>
                <Button size="sm" onClick={() => setEditing(true)} className="mt-4 bg-gradient-to-r from-pulse-500 to-fuchsia-600">
                  <Edit3 className="mr-1.5 h-3.5 w-3.5" /> Add Profiles
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Goals */}
      {profile.goals?.length > 0 && (
        <motion.div className="mt-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-border/60 bg-card/50">
            <CardContent className="p-6">
              <h2 className="font-display text-lg font-bold flex items-center gap-2 mb-3">
                <Target className="h-4 w-4 text-pulse-400" /> Goals
              </h2>
              <ul className="space-y-2">
                {profile.goals.map((g, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-pulse-400 shrink-0" />
                    {g}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Interests */}
      {profile.interests?.length > 0 && (
        <motion.div className="mt-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-border/60 bg-card/50">
            <CardContent className="p-6">
              <h2 className="font-display text-lg font-bold flex items-center gap-2 mb-3">
                <BookOpen className="h-4 w-4 text-fuchsia-400" /> Interests
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((i) => (
                  <Badge key={i} variant="secondary" className="bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/20">{i}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
