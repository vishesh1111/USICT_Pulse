import { ExternalLink, ThumbsUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { timeAgo } from "@/lib/utils";
import type { MockResource } from "@/lib/mock/types";

interface ResourceCardProps {
  resource: MockResource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const typeColors: Record<string, string> = {
    VIDEO: "bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20",
    PLAYLIST: "bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20",
    ARTICLE: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20",
    PDF: "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20",
    GITHUB: "bg-zinc-500/10 text-zinc-500 hover:bg-zinc-500/20 border-zinc-500/20 dark:text-zinc-300",
    COURSE: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20",
    CHEATSHEET: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 border-purple-500/20",
  };

  return (
    <Card className="card-hover overflow-hidden border-border/60 bg-card/50 backdrop-blur">
      <CardContent className="flex flex-col p-5 h-full">
        <div className="mb-3 flex items-start justify-between gap-2">
          <Badge variant="outline" className={`text-[10px] ${typeColors[resource.type] || ""}`}>
            {resource.type}
          </Badge>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <ThumbsUp className="h-3 w-3" />
            <span>{resource.votes}</span>
          </div>
        </div>

        <h3 className="font-display text-base font-semibold leading-tight mb-2 line-clamp-2">
          {resource.title}
        </h3>
        
        <p className="mb-4 text-xs text-muted-foreground line-clamp-2 flex-grow">
          {resource.description}
        </p>

        <div className="mb-4 flex flex-wrap gap-1">
          {resource.tags.slice(0, 3).map((t) => (
            <Badge key={t} variant="secondary" className="text-[9px]">
              {t}
            </Badge>
          ))}
        </div>

        <div className="mt-auto space-y-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/40 pt-3">
                <span className="truncate pr-2">By {resource.recommendedBy}</span>
                <span className="shrink-0">{timeAgo(resource.createdAt)}</span>
            </div>
            
            <Button size="sm" className="w-full" asChild>
                <a href={resource.link} target="_blank" rel="noopener noreferrer">
                    Open Resource <ExternalLink className="ml-2 h-3.5 w-3.5" />
                </a>
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
