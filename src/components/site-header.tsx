"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Bell, ChevronDown } from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "./theme-toggle";
import { Logo } from "./logo";
import { useUserStore } from "@/lib/user-store";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const profile = useUserStore((s) => s.profile);
  const clearProfile = useUserStore((s) => s.clearProfile);
  const router = useRouter();
  const [resetting, setResetting] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    const base = href.split("?")[0];
    if (base === "/dashboard") return pathname === "/dashboard";
    return pathname === base || pathname.startsWith(base + "/");
  };

  return (
    <>
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/70 backdrop-blur-xl"
          : "border-b border-transparent bg-background/40 backdrop-blur-md"
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              if (link.children) {
                return (
                  <DropdownMenu key={link.href}>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={cn(
                          "inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ring-focus",
                          active
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {link.label}
                        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                        {active && (
                          <span className="absolute -bottom-px left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-pulse-500" />
                        )}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      <DropdownMenuLabel>{link.label}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {link.children.map((c) => (
                        <DropdownMenuItem key={c.href} asChild>
                          <Link href={c.href}>{c.label}</Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative rounded-md px-3 py-2 text-sm font-medium transition-colors ring-focus",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                  {active && (
                    <span className="absolute -bottom-px left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-pulse-500" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/notifications"
            className="relative hidden h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground md:inline-flex ring-focus"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-pulse-500 ring-2 ring-background" />
          </Link>
          <ThemeToggle />

          {profile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ring-focus rounded-full">
                  <Avatar className="h-9 w-9 ring-2 ring-pulse-500/30">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.avatarSeed)}`} alt={profile.fullName} />
                    <AvatarFallback>{getInitials(profile.fullName)}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{profile.fullName}</span>
                    <span className="text-xs text-muted-foreground">
                      {profile.branch} · Year {profile.year}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/connect">Connect</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/onboarding">Edit profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => {
                    setResetting(true);
                    setTimeout(() => {
                      clearProfile();
                      router.push("/onboarding");
                    }, 800);
                  }}
                  className="text-destructive focus:text-destructive"
                >
                  Reset profile
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="hidden md:inline-flex">
              <Link href="/onboarding">Get started</Link>
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-t bg-background/95 backdrop-blur-xl lg:hidden">
          <nav className="container flex flex-col py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            {!profile && (
              <Button asChild size="sm" className="mt-3">
                <Link href="/onboarding">Get started</Link>
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>

      {/* Reset profile animation overlay */}
      <AnimatePresence>
        {resetting && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Gradient backdrop */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-[#0f0a1a] via-[#1a0e2e] to-[#0a0a1a]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            />

            {/* Pulsing rings */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border border-purple-500/30"
                initial={{ width: 0, height: 0, opacity: 0.8 }}
                animate={{
                  width: [0, 600 + i * 200],
                  height: [0, 600 + i * 200],
                  opacity: [0.8, 0],
                }}
                transition={{
                  duration: 1.2,
                  delay: i * 0.2,
                  ease: "easeOut",
                }}
              />
            ))}

            {/* Center content */}
            <motion.div
              className="relative z-10 text-center"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            >
              {/* Glowing orb */}
              <motion.div
                className="mx-auto mb-6 h-20 w-20 rounded-full bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 shadow-[0_0_60px_20px_rgba(168,85,247,0.4)]"
                animate={{
                  scale: [1, 1.2, 1],
                  boxShadow: [
                    "0 0 60px 20px rgba(168,85,247,0.4)",
                    "0 0 80px 30px rgba(168,85,247,0.6)",
                    "0 0 60px 20px rgba(168,85,247,0.4)",
                  ],
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <div className="flex h-full items-center justify-center text-3xl">✨</div>
              </motion.div>

              <motion.h2
                className="font-display text-2xl font-bold text-white"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Starting Fresh
              </motion.h2>
              <motion.p
                className="mt-2 text-sm text-purple-300/80"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Taking you back to choose your path...
              </motion.p>

              {/* Loading dots */}
              <motion.div
                className="mt-6 flex items-center justify-center gap-1.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="h-2 w-2 rounded-full bg-purple-400"
                    animate={{ y: [0, -8, 0], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
