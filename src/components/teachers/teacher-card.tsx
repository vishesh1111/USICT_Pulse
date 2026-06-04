import { Star, Link as LinkIcon, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";
import type { MockTeacher } from "@/lib/mock/types";
import Link from "next/link";

import { AddTeacherReviewDialog } from "./add-teacher-review-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface TeacherCardProps {
  teacher: any;
  onReviewAdded?: () => void;
}

export function TeacherCard({ teacher, onReviewAdded }: TeacherCardProps) {
  return (
    <Card className="card-hover overflow-hidden border-border/60 bg-card/50 backdrop-blur flex flex-col h-full">
      <CardContent className="flex flex-col p-5 flex-1">
        <div className="mb-4 flex items-start gap-4">
          <Avatar className="h-16 w-16 ring-2 ring-pulse-500/30">
            <AvatarImage src={teacher.photoUrl} alt={teacher.name} />
            <AvatarFallback>{getInitials(teacher.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-lg font-semibold leading-tight truncate">
                {teacher.name}
              </h3>
              {teacher.profileLink && (
                <a 
                  href={teacher.profileLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-pulse-500 transition-colors"
                  title="View Official Profile"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {teacher.designation} · {teacher.branch}
            </p>
            <div className="mt-1 flex items-center gap-1 text-sm font-medium text-amber-500">
              <Star className="h-4 w-4 fill-amber-500" />
              <span>{teacher.rating?.toFixed(1) || "0.0"}</span>
              <span className="text-muted-foreground ml-1 text-xs font-normal">
                ({teacher.reviewsCount || 0} reviews)
              </span>
            </div>
          </div>
        </div>

        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
          {teacher.bio}
        </p>

        <div className="mb-4 space-y-2 text-xs flex-1">
           <div className="flex gap-2">
            <span className="font-semibold w-24 shrink-0 text-muted-foreground">Subjects:</span>
            <span className="truncate">{teacher.subjects?.join(", ")}</span>
          </div>
          {teacher.reviews?.length > 0 && (
            <>
              <div className="flex gap-2">
                <span className="font-semibold w-24 shrink-0 text-muted-foreground">Difficulty:</span>
                <span className={teacher.reviews[0].difficulty === 'Hard' ? 'text-destructive' : 'text-foreground'}>
                  {teacher.reviews[0].difficulty}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold w-24 shrink-0 text-muted-foreground">Marking:</span>
                <span>{teacher.reviews[0].internalsTrend}</span>
              </div>
            </>
          )}
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
            <Badge variant="outline" className="text-[10px]">
              Taught: Year {teacher.yearTaught?.join(", ")}
            </Badge>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" variant="secondary" className="w-full mt-auto">
              View Reviews
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[85vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Reviews for {teacher.name}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {teacher.reviews?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No reviews yet. Be the first to review!
                </div>
              ) : (
                teacher.reviews?.map((review: any) => (
                  <div key={review.id} className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-sm">
                          {review.anonymous ? "Anonymous Student" : review.author?.fullName}
                        </div>
                        {!review.anonymous && review.author && (
                          <div className="text-xs text-muted-foreground">
                            {review.author.branch} · Year {review.author.year}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-0.5 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < review.rating ? "fill-amber-500" : "text-muted-foreground/30"}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-foreground/90 mt-2">{review.reviewText}</p>
                    {review.behaviorNote && (
                      <div className="mt-2 text-xs text-pulse-300 bg-pulse-500/10 p-2 rounded inline-block">
                        <strong>Note:</strong> {review.behaviorNote}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            
            <AddTeacherReviewDialog 
              teacherId={teacher.id} 
              teacherName={teacher.name} 
              onSuccess={onReviewAdded || (() => window.location.reload())}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
