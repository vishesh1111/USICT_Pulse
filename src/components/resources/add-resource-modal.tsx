"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Link2, Upload, FileText, Image, Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useResourceStore, type UserResource } from "@/lib/resource-store";
import { useUserStore } from "@/lib/user-store";
import type { ResourceSubject, ResourceType } from "@/lib/mock/types";
import { toast } from "sonner";

const SUBJECTS: { value: ResourceSubject; label: string }[] = [
  { value: "DBMS", label: "DBMS" },
  { value: "OOPS", label: "OOPs" },
  { value: "DSA", label: "DSA" },
  { value: "LLD", label: "LLD" },
  { value: "HLD", label: "HLD" },
  { value: "OS", label: "Operating Systems" },
  { value: "CN", label: "Computer Networks" },
  { value: "SYSTEM_DESIGN", label: "System Design" },
  { value: "AI_ML", label: "AI / ML" },
  { value: "WEB_DEV", label: "Web Development" },
];

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

function detectResourceType(url: string): ResourceType {
  const lower = url.toLowerCase();
  if (lower.includes("youtube.com") || lower.includes("youtu.be")) return "VIDEO";
  if (lower.includes("github.com")) return "GITHUB";
  if (lower.includes("playlist")) return "PLAYLIST";
  return "ARTICLE";
}

export function AddResourceModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addResource = useResourceStore((s) => s.addResource);
  const profile = useUserStore((s) => s.profile);

  const [mode, setMode] = React.useState<"link" | "file">("link");
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [subject, setSubject] = React.useState<ResourceSubject | "">("");
  const [link, setLink] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [fileData, setFileData] = React.useState<string | null>(null);
  const [fileName, setFileName] = React.useState("");
  const [fileType, setFileType] = React.useState("");
  const [dragging, setDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const reset = () => {
    setMode("link"); setTitle(""); setDescription(""); setSubject("");
    setLink(""); setTags(""); setFileData(null); setFileName(""); setFileType("");
  };

  const handleFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File too large. Maximum size is 2MB.");
      return;
    }
    const allowed = ["application/pdf", "image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Unsupported file type. Use PDF, PNG, JPG, or WebP.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFileData(reader.result as string);
      setFileName(file.name);
      setFileType(file.type);
      if (!title) setTitle(file.name.replace(/\.[^.]+$/, ""));
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = () => {
    if (!title.trim()) { toast.error("Please enter a title"); return; }
    if (!subject) { toast.error("Please select a subject"); return; }
    if (mode === "link" && !link.trim()) { toast.error("Please enter a URL"); return; }
    if (mode === "file" && !fileData) { toast.error("Please upload a file"); return; }

    let resType: ResourceType = "ARTICLE";
    if (mode === "link") {
      resType = detectResourceType(link);
    } else {
      resType = fileType === "application/pdf" ? "PDF" : "ARTICLE";
    }

    const resource: UserResource = {
      id: `user-res-${Date.now()}`,
      title: title.trim(),
      subject: subject as ResourceSubject,
      type: resType,
      description: description.trim() || "Shared by a senior",
      link: mode === "link" ? link.trim() : "",
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      recommendedBy: profile?.fullName || "Anonymous",
      recommendedByRole: "SENIOR",
      usefulness: 0,
      votes: 0,
      createdAt: new Date().toISOString(),
      ...(mode === "file" && { fileData: fileData || undefined, fileName, fileType }),
    };

    addResource(resource);
    toast.success("Resource added successfully! 🎉");
    reset();
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.08] bg-card/95 shadow-2xl backdrop-blur-xl"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Gradient top bar */}
            <div className="h-1 bg-gradient-to-r from-pulse-500 via-fuchsia-500 to-pulse-400" />

            <div className="p-6">
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold">Add Resource</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Share knowledge with juniors</p>
                </div>
                <button onClick={onClose} className="rounded-lg p-2 hover:bg-muted/50 transition-colors">
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              {/* Mode toggle */}
              <div className="mb-5 flex rounded-xl bg-muted/30 p-1">
                {[{ id: "link" as const, icon: Link2, label: "Link" }, { id: "file" as const, icon: Upload, label: "File Upload" }].map(m => (
                  <button key={m.id} onClick={() => setMode(m.id)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${mode === m.id ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                    <m.icon className="h-4 w-4" />{m.label}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {/* Subject */}
                <div>
                  <Label>Subject *</Label>
                  <Select value={subject} onValueChange={(v) => setSubject(v as ResourceSubject)}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select subject" /></SelectTrigger>
                    <SelectContent>
                      {SUBJECTS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {/* Title */}
                <div>
                  <Label htmlFor="res-title">Title *</Label>
                  <Input id="res-title" placeholder="e.g., Striver's DSA Sheet" value={title} onChange={e => setTitle(e.target.value)} className="mt-1.5" />
                </div>

                {/* Link or File */}
                {mode === "link" ? (
                  <div>
                    <Label htmlFor="res-link">URL *</Label>
                    <Input id="res-link" placeholder="https://youtube.com/..." value={link} onChange={e => setLink(e.target.value)} className="mt-1.5" />
                    {link && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Detected type: <Badge variant="secondary" className="text-[9px] ml-1">{detectResourceType(link)}</Badge>
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <Label>Upload File *</Label>
                    <div
                      onDragOver={e => { e.preventDefault(); setDragging(true); }}
                      onDragLeave={() => setDragging(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`mt-1.5 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all ${
                        dragging ? "border-pulse-500 bg-pulse-500/5" : fileData ? "border-emerald-500/50 bg-emerald-500/5" : "border-border/50 hover:border-border hover:bg-muted/20"
                      }`}
                    >
                      <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg,.webp"
                        onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
                      {fileData ? (
                        <div className="flex items-center gap-3">
                          {fileType === "application/pdf" ? <FileText className="h-8 w-8 text-amber-500" /> : <Image className="h-8 w-8 text-blue-500" />}
                          <div>
                            <p className="text-sm font-medium">{fileName}</p>
                            <p className="text-xs text-emerald-400 flex items-center gap-1"><Check className="h-3 w-3" />Uploaded</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Drop file here or click to browse</p>
                          <p className="mt-1 text-xs text-muted-foreground/60">PDF, PNG, JPG, WebP · Max 2MB</p>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div>
                  <Label htmlFor="res-desc">Description</Label>
                  <textarea id="res-desc" placeholder="Brief description of this resource..." value={description} onChange={e => setDescription(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-border/40 bg-background/50 px-4 py-3 text-sm placeholder-muted-foreground/50 focus:border-pulse-500/50 focus:outline-none focus:ring-2 focus:ring-pulse-500/20 min-h-20" />
                </div>

                {/* Tags */}
                <div>
                  <Label htmlFor="res-tags">Tags (comma-separated)</Label>
                  <Input id="res-tags" placeholder="DSA, Placements, Interviews" value={tags} onChange={e => setTags(e.target.value)} className="mt-1.5" />
                </div>
              </div>

              {/* Submit */}
              <Button onClick={handleSubmit} className="mt-6 w-full bg-gradient-to-r from-pulse-500 to-fuchsia-600 font-semibold shadow-lg shadow-pulse-500/20">
                <Plus className="mr-2 h-4 w-4" />Add Resource
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
