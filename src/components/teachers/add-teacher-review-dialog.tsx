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
import { Loader2, Plus, Star } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

export function AddTeacherReviewDialog({ teacherId, teacherName, onSuccess }: { teacherId: string, teacherName: string, onSuccess: () => void }) {
  const profile = useUserStore((s) => s.profile);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [anonymous, setAnonymous] = useState(false);

  // Only seniors can see this
  if (!profile || !["senior", "alumni"].includes(profile.role?.toLowerCase())) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      rating,
      teachingNature: formData.get("teachingNature") as string,
      internalsTrend: formData.get("internalsTrend") as string,
      difficulty: formData.get("difficulty") as string,
      behaviorNote: formData.get("behaviorNote") as string,
      reviewText: formData.get("reviewText") as string,
      anonymous,
      authorEmail: profile.email,
    };

    try {
      const res = await fetch(`/api/teachers/${teacherId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to post review");
      }

      toast.success("Review posted successfully!");
      setOpen(false);
      onSuccess();
    } catch (error) {
      toast.error("Failed to post review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="w-full mt-4 border-pulse-500/30 hover:bg-pulse-500/10 hover:text-pulse-400">
          <Plus className="mr-2 h-4 w-4" /> Add Review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Review {teacherName}</DialogTitle>
          <DialogDescription>
            Share your honest experience to help juniors prepare for their classes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Overall Rating (1-5)</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                >
                  <Star
                    className={`h-6 w-6 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Exam Difficulty</label>
              <Select name="difficulty" defaultValue="Moderate">
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Internals / Marking</label>
              <Select name="internalsTrend" defaultValue="Average">
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Generous">Generous</SelectItem>
                  <SelectItem value="Average">Average</SelectItem>
                  <SelectItem value="Strict">Strict</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Teaching Style / Nature</label>
            <Input name="teachingNature" placeholder="e.g. Strict but fair, Focuses on PPTs..." />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Detailed Review *</label>
            <Textarea name="reviewText" required placeholder="What should juniors know about this teacher?" rows={4} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Key Behavior / Rule (Optional)</label>
            <Input name="behaviorNote" placeholder="e.g. Mandatory 75% attendance" />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input 
              type="checkbox" 
              id="anonymous" 
              checked={anonymous} 
              onChange={(e) => setAnonymous(e.target.checked)} 
              className="h-4 w-4 rounded border-gray-300 text-pulse-600 focus:ring-pulse-500"
            />
            <Label htmlFor="anonymous">Post anonymously</Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Submit Review
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
