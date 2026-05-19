import { Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/utils";
import type { MockQuestion } from "@/lib/mock/types";

interface QuestionCardProps {
  question: MockQuestion;
  compact?: boolean;
}

export function QuestionCard({ question, compact }: QuestionCardProps) {
  return (
    <Card className="card-hover border-border/60 bg-card/50 backdrop-blur">
      <CardContent className="flex flex-col p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 font-display text-sm font-semibold">
            {question.title}
          </h3>
          {question.answers.length > 0 && (
            <Badge variant="success" className="shrink-0 text-[10px]">
              {question.answers.length} answers
            </Badge>
          )}
        </div>

        {!compact && question.body && (
          <p className="mb-2 line-clamp-2 text-xs text-muted-foreground">
            {question.body}
          </p>
        )}

        <div className="mb-3 flex flex-wrap gap-1">
          {question.tags.slice(0, 2).map((t) => (
            <Badge key={t} variant="outline" className="text-[9px]">
              {t}
            </Badge>
          ))}
          {question.tags.length > 2 && (
            <span className="text-[9px] text-muted-foreground">
              +{question.tags.length - 2}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <Heart className="h-3 w-3" />
            <span>{question.helpfulCount}</span>
            <MessageCircle className="h-3 w-3 ml-1" />
            <span>{question.answers.length}</span>
          </div>
          <span className="text-[11px] text-muted-foreground">
            {timeAgo(question.createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
