"use client";

import * as React from "react";
import { useUserStore } from "@/lib/user-store";
import { Logo } from "./logo";
import { APP_TAGLINE } from "@/lib/constants";

export function Splash() {
  const splashShown = useUserStore((s) => s.splashShown);
  const markSplashShown = useUserStore((s) => s.markSplashShown);

  const [mounted, setMounted] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [exiting, setExiting] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;
    if (splashShown) return;
    setVisible(true);
    const t1 = setTimeout(() => setExiting(true), 1800);
    const t2 = setTimeout(() => {
      setVisible(false);
      markSplashShown();
    }, 2300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [mounted, splashShown, markSplashShown]);

  if (!mounted || !visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background ${
        exiting ? "splash-exit" : "splash-enter"
      }`}
    >
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="absolute inset-0 bg-radial-fade" />
      <div className="absolute inset-0 bg-mesh opacity-40" />

      {/* Floating ambient dots */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-pulse-500/30 animate-float"
          style={{
            left: `${15 + Math.random() * 70}%`,
            top: `${15 + Math.random() * 70}%`,
            animationDelay: `${i * 0.3}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
          }}
        />
      ))}

      <div className="relative flex flex-col items-center gap-6">
        <div className="relative">
          <span className="absolute inset-0 -m-4 rounded-full bg-pulse-500/30 blur-2xl animate-pulse-ring" />
          <span className="absolute inset-0 -m-2 rounded-full bg-fuchsia-500/20 blur-xl animate-pulse-ring [animation-delay:0.4s]" />
          <Logo showWordmark={false} className="relative scale-[2.2]" href="" />
        </div>

        <div className="text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            USICT{" "}
            <span className="gradient-text">PULSE</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            {APP_TAGLINE}
          </p>
        </div>

        <div className="mt-2 h-1 w-40 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/3 animate-[shimmer_1.4s_linear_infinite] rounded-full bg-gradient-to-r from-transparent via-pulse-500 to-transparent bg-[length:200%_100%]" />
        </div>
      </div>
    </div>
  );
}
