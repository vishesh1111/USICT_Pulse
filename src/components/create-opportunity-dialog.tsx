"use client";

import { useState } from "react";
import { useUserStore } from "@/lib/user-store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export function CreateOpportunityDialog({ onSuccess }: { onSuccess: () => void }) {
  const profile = useUserStore((s) => s.profile);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Only seniors can see this
  if (!profile || (profile.role !== "SENIOR" && profile.role !== "senior")) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      type: formData.get("type") as string,
      organization: formData.get("organization") as string,
      description: formData.get("description") as string,
      applyUrl: formData.get("applyUrl") as string,
      location: formData.get("location") as string,
      stipend: formData.get("stipend") as string,
      deadline: formData.get("deadline") as string,
      authorEmail: profile.email,
    };

    try {
      const res = await fetch("/api/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to post opportunity");
      }

      toast.success("Opportunity posted successfully!");
      setOpen(false);
      onSuccess();
    } catch (error) {
      toast.error("Failed to post opportunity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-24 right-4 sm:bottom-28 sm:right-8 h-14 w-14 rounded-full shadow-2xl z-40 bg-fuchsia-600 hover:bg-fuchsia-700">
          <Plus className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Post a New Opportunity</DialogTitle>
          <DialogDescription>
            Share an internship, scholarship, or club recruitment with the USICT community.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title *</label>
            <Input name="title" required placeholder="e.g. SDE Intern" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type *</label>
              <Select name="type" required defaultValue="INTERNSHIP">
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INTERNSHIP">Internship</SelectItem>
                  <SelectItem value="SCHOLARSHIP">Scholarship</SelectItem>
                  <SelectItem value="CLUB">Club</SelectItem>
                  <SelectItem value="LOCAL">Local</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Organization</label>
              <Input name="organization" placeholder="e.g. Google" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description *</label>
            <Textarea name="description" required placeholder="Details about the opportunity..." rows={4} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Apply Link</label>
            <Input name="applyUrl" type="url" placeholder="https://..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input name="location" placeholder="e.g. Remote, Bangalore" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Stipend</label>
              <Input name="stipend" placeholder="e.g. 50k / month" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Deadline (Optional)</label>
            <Input name="deadline" type="date" />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Post
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
