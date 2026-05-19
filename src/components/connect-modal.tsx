"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ConnectModalProps {
  mentorName: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConnectModal({
  mentorName,
  isOpen,
  onOpenChange,
}: ConnectModalProps) {
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate submission
    await new Promise((r) => setTimeout(r, 800));
    
    toast.success(`Connection request sent to ${mentorName}!`);
    setMessage("");
    setLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect with {mentorName}</DialogTitle>
          <DialogDescription>
            Send a message and request 1-on-1 mentorship.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm">
              Your message
            </Label>
            <Textarea
              id="message"
              placeholder="Tell them why you'd like to connect and what you're interested in learning..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-24 resize-none"
              required
            />
            <p className="text-xs text-muted-foreground">
              Keep it brief and genuine. Mentors respond to thoughtful messages.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !message.trim()}>
              {loading ? "Sending..." : "Send request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
