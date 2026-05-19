import { mockAlumni } from "@/lib/mock/alumni";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ExternalLink, Briefcase, GraduationCap } from "lucide-react";
import Link from "next/link";

export default function AlumniPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl text-orange-500">Alumni Directory</h1>
        <p className="mt-2 text-muted-foreground">Connect with USICT graduates working in top companies.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockAlumni.map((alumnus) => (
          <Card key={alumnus.id} className="hover:border-orange-500/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <Avatar className="h-16 w-16 border bg-muted">
                  <AvatarImage src={alumnus.image} />
                  <AvatarFallback>{alumnus.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <Badge variant="outline" className="text-orange-500 border-orange-500/20">{alumnus.batch}</Badge>
              </div>
              
              <div className="mt-4">
                <h3 className="font-display text-xl font-bold">{alumnus.name}</h3>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                  <Briefcase className="h-4 w-4" />
                  {alumnus.role} @ {alumnus.company}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                  <GraduationCap className="h-4 w-4" />
                  {alumnus.branch}
                </div>
              </div>
              
              <p className="mt-4 text-sm line-clamp-2 text-muted-foreground">{alumnus.bio}</p>
              
              <div className="mt-6 flex gap-3">
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white" asChild>
                  <Link href={alumnus.linkedin} target="_blank">
                    Connect <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
