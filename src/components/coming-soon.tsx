import Link from "next/link";
import { Sparkles, ArrowLeft, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ComingSoonProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  features?: string[];
  eta?: string;
}

export function ComingSoon({
  title,
  description,
  icon: Icon = Sparkles,
  features = [],
  eta = "In active development",
}: ComingSoonProps) {
  return (
    <div className="relative mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
      <div className="absolute inset-x-0 top-0 h-72 bg-radial-fade" />

      <div className="relative">
        <Badge variant="outline" className="mb-6 gap-1.5 border-pulse-500/40 bg-pulse-500/10 text-pulse-300">
          <Sparkles className="h-3 w-3" />
          {eta}
        </Badge>

        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-pulse-500/20 to-fuchsia-500/20 ring-1 ring-pulse-500/30">
          <Icon className="h-10 w-10 text-pulse-400" />
        </div>

        <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-balance text-muted-foreground">
          {description}
        </p>

        {features.length > 0 && (
          <ul className="mx-auto mt-8 grid max-w-xl gap-2 text-left sm:grid-cols-2">
            {features.map((f) => (
              <li
                key={f}
                className="flex items-start gap-2 rounded-lg border bg-card/50 px-3 py-2 text-sm"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pulse-500" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to dashboard
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/opportunities">Explore opportunities</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
