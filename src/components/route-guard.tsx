"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/lib/user-store";

// Add any public paths here that shouldn't require an onboarding profile
const PUBLIC_PATHS = ["/", "/onboarding", "/about"];

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const profile = useUserStore((s) => s.profile);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Check if the current route is in the public paths list
    const isPublic = PUBLIC_PATHS.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`) && path !== "/"
    );

    // If no profile and route isn't public, enforce onboarding
    if (!profile && !isPublic) {
      router.replace("/onboarding");
    }
  }, [mounted, profile, pathname, router]);

  // Don't flash protected content before mounting/checking
  if (!mounted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-pulse-500 border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
