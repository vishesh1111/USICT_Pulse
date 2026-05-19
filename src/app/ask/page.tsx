import { mockQuestions } from "@/lib/mock/ask";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, ThumbsUp, HelpCircle } from "lucide-react";

export default function AskPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl text-purple-500">Ask Anything</h1>
          <p className="mt-2 text-muted-foreground">Anonymous Q&A with seniors, alumni, and teachers.</p>
        </div>
        <Button className="bg-purple-500 hover:bg-purple-600 text-white">
          <HelpCircle className="mr-2 h-4 w-4" /> Ask a Question
        </Button>
      </div>

      <div className="space-y-6">
        {mockQuestions.map((q) => (
          <Card key={q.id} className="hover:border-purple-500/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-purple-500 hover:bg-purple-500/10">
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium">{q.upvotes}</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Badge variant="secondary" className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20">{q.author}</Badge>
                    <span>• {q.timestamp}</span>
                  </div>
                  
                  <h3 className="text-lg font-medium text-foreground">{q.question}</h3>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <MessageCircle className="h-4 w-4" />
                      {q.answers.length} Answers
                    </div>
                    
                    {q.answers.map((ans) => (
                      <div key={ans.id} className="bg-muted/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-sm text-foreground">{ans.author}</span>
                          <span className="text-xs text-muted-foreground">{ans.authorRole}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{ans.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
