import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  href?: string;
  showWordmark?: boolean;
}

export function Logo({ className, href = "/", showWordmark = true }: LogoProps) {
  const inner = (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="relative inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-pulse-500 via-pulse-600 to-fuchsia-600 shadow-lg shadow-pulse-500/30">
        {/* heartbeat / pulse glyph */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M2 12h4l2-6 4 12 2-6 2 3h6" />
        </svg>
        <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20" />
      </span>
      {showWordmark && (
        <span className="font-display text-base font-bold tracking-tight">
          USICT{" "}
          <span className="bg-gradient-to-r from-pulse-500 to-fuchsia-500 bg-clip-text text-transparent">
            PULSE
          </span>
        </span>
      )}
    </span>
  );

  if (!href) return inner;
  return (
    <Link href={href} className="ring-focus rounded-md">
      {inner}
    </Link>
  );
}
