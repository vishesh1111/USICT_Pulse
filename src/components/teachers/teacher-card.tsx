import { Star, Link as LinkIcon, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";
import type { MockTeacher } from "@/lib/mock/types";
import Link from "next/link";

interface TeacherCardProps {
  teacher: MockTeacher;
}

export function TeacherCard({ teacher }: TeacherCardProps) {
  return (
    <Card className="card-hover overflow-hidden border-border/60 bg-card/50 backdrop-blur">
      <CardContent className="flex flex-col p-5">
        <div className="mb-4 flex items-start gap-4">
          <Avatar className="h-16 w-16 ring-2 ring-pulse-500/30">
            <AvatarImage
              src={teacher.photoUrl}
              alt={teacher.name}
            />
            <AvatarFallback>{getInitials(teacher.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-lg font-semibold leading-tight truncate">
                {teacher.name}
              </h3>
              {teacher.profileLink && (
                <Link 
                  href={teacher.profileLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-pulse-500 transition-colors"
                  title="View Official Profile"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {teacher.designation} · {teacher.branch}
            </p>
            <div className="mt-1 flex items-center gap-1 text-sm font-medium text-amber-500">
              <Star className="h-4 w-4 fill-amber-500" />
              <span>{teacher.rating.toFixed(1)}</span>
              <span className="text-muted-foreground ml-1 text-xs font-normal">
                ({teacher.reviews.length} reviews)
              </span>
            </div>
          </div>
        </div>

        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
          {teacher.bio}
        </p>

        <div className="mb-4 space-y-2 text-xs">
           <div className="flex gap-2">
            <span className="font-semibold w-24 shrink-0 text-muted-foreground">Subjects:</span>
            <span className="truncate">{teacher.subjects.join(", ")}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold w-24 shrink-0 text-muted-foreground">Difficulty:</span>
            <span className={teacher.difficulty === 'Hard' ? 'text-destructive' : 'text-foreground'}>{teacher.difficulty}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold w-24 shrink-0 text-muted-foreground">Marking:</span>
            <span>{teacher.internalsTrend}</span>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
            <Badge variant="outline" className="text-[10px]">
              Taught: Year {teacher.yearTaught.join(", ")}
            </Badge>
        </div>

        <Button
          size="sm"
          variant="secondary"
          className="w-full mt-auto"
          asChild
        >
          <Link href={`/teachers/`}>
             View Reviews
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
