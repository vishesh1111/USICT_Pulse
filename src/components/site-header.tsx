"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Bell,
  ChevronDown,
  Home,
  Briefcase,
  MessageCircle,
  Users,
  GraduationCap,
  BookOpen,
  Trophy,
  Info,
  UserCheck,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
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

// Primary nav — always visible in desktop
const PRIMARY_LINKS = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/opportunities", label: "Opportunities", icon: Briefcase },
  { href: "/ask", label: "Ask", icon: MessageCircle },
  { href: "/connect", label: "Connect", icon: Users },
];

// Secondary nav — grouped inside "More" dropdown on desktop
const MORE_LINKS = [
  { href: "/alumni", label: "Alumni", icon: GraduationCap },
  { href: "/teachers", label: "Teachers", icon: UserCheck },
  { href: "/resources", label: "Resources", icon: BookOpen },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/about", label: "About", icon: Info },
];

// All links for mobile drawer
const ALL_LINKS = [...PRIMARY_LINKS, ...MORE_LINKS];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const profile = useUserStore((s) => s.profile);
  const clearProfile = useUserStore((s) => s.clearProfile);
  const router = useRouter();
  const [resetting, setResetting] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    setMobileOpen(false);
    setResetting(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    const base = href.split("?")[0];
    if (base === "/dashboard") return pathname === "/dashboard";
    return pathname === base || pathname.startsWith(base + "/");
  };

  const isOnboarding = pathname === "/onboarding";

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-500",
          scrolled
            ? "py-2"
            : "py-3"
        )}
      >
        {/* Floating glass bar */}
        <div
          className={cn(
            "container transition-all duration-500",
            scrolled ? "px-4" : "px-4"
          )}
        >
          <div
            className={cn(
              "relative flex h-14 items-center justify-between gap-4 rounded-2xl px-4 transition-all duration-500",
              scrolled
                ? "border border-white/60 bg-white/80 shadow-xl shadow-indigo-500/[0.06] backdrop-blur-2xl dark:border-white/[0.08] dark:bg-background/80 dark:shadow-black/40"
                : "border border-transparent bg-white/50 backdrop-blur-md dark:bg-background/50"
            )}
          >
            {/* Left: Logo + Nav */}
            <div className="flex items-center gap-6">
              <Logo />

              {!isOnboarding && (
                <nav className="hidden items-center gap-0.5 lg:flex">
                  {PRIMARY_LINKS.map((link) => {
                    const active = isActive(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "group relative flex items-center gap-1.5 rounded-xl px-3 py-2 text-[13px] font-medium transition-all duration-200",
                          active
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {/* Animated active background pill */}
                        {active && (
                          <motion.span
                            layoutId="nav-pill"
                            className="absolute inset-0 rounded-xl bg-pulse-500/10 border border-pulse-500/20"
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          />
                        )}
                        {/* Hover bg (only for inactive) */}
                        {!active && (
                          <span className="absolute inset-0 rounded-xl bg-accent/0 transition-all duration-200 group-hover:bg-accent/60" />
                        )}
                        <link.icon className={cn(
                          "relative z-10 h-3.5 w-3.5 transition-colors duration-200",
                          active ? "text-pulse-500" : "text-muted-foreground group-hover:text-foreground"
                        )} />
                        <span className="relative z-10">{link.label}</span>
                      </Link>
                    );
                  })}

                  {/* More dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={cn(
                          "group relative inline-flex items-center gap-1 rounded-xl px-3 py-2 text-[13px] font-medium transition-all duration-200 ring-focus",
                          MORE_LINKS.some((l) => isActive(l.href))
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {/* Active bg if any child is active */}
                        {MORE_LINKS.some((l) => isActive(l.href)) && (
                          <motion.span
                            layoutId="nav-pill"
                            className="absolute inset-0 rounded-xl bg-pulse-500/10 border border-pulse-500/20"
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          />
                        )}
                        {!MORE_LINKS.some((l) => isActive(l.href)) && (
                          <span className="absolute inset-0 rounded-xl bg-accent/0 transition-all duration-200 group-hover:bg-accent/60" />
                        )}
                        <span className="relative z-10">More</span>
                        <ChevronDown className="relative z-10 h-3 w-3 opacity-60 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      sideOffset={8}
                      className="w-52 rounded-xl border-white/60 bg-white/90 p-1.5 shadow-xl shadow-indigo-500/[0.06] backdrop-blur-xl dark:border-white/[0.08] dark:bg-card/95 dark:shadow-2xl"
                    >
                      {MORE_LINKS.map((link) => (
                        <DropdownMenuItem
                          key={link.href}
                          asChild
                          className={cn(
                            "rounded-lg px-3 py-2.5 text-sm transition-all duration-150",
                            isActive(link.href) && "bg-pulse-500/10 text-foreground"
                          )}
                        >
                          <Link href={link.href} className="flex items-center gap-2.5">
                            <link.icon className={cn(
                              "h-4 w-4",
                              isActive(link.href) ? "text-pulse-500" : "text-muted-foreground"
                            )} />
                            {link.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </nav>
              )}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1.5">
              {!isOnboarding && (
                <Link
                  href="/notifications"
                  className="group relative hidden h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-all duration-200 hover:bg-pulse-500/10 hover:text-pulse-400 md:inline-flex ring-focus"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                  <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pulse-500 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-pulse-500" />
                  </span>
                </Link>
              )}

              <ThemeToggle />

              {!isOnboarding && profile ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="ring-focus rounded-full transition-all duration-200 hover:scale-105 ml-1">
                      <Avatar className="h-8 w-8 ring-2 ring-pulse-500/30 transition-all duration-300 hover:ring-pulse-500/60 hover:shadow-lg hover:shadow-pulse-500/25">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.avatarSeed)}`}
                          alt={profile.fullName}
                        />
                        <AvatarFallback className="text-xs">{getInitials(profile.fullName)}</AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="w-56 rounded-xl border-white/60 bg-white/90 p-1.5 shadow-xl shadow-indigo-500/[0.06] backdrop-blur-xl dark:border-white/[0.08] dark:bg-card/95 dark:shadow-2xl"
                  >
                    <DropdownMenuLabel className="px-3 py-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">{profile.fullName}</span>
                        <span className="text-[11px] text-muted-foreground">
                          {profile.branch} · Year {profile.year}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="opacity-50" />
                    <DropdownMenuItem asChild className="rounded-lg px-3 py-2">
                      <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-lg px-3 py-2">
                      <Link href="/profile">My Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-lg px-3 py-2">
                      <Link href="/connect">Connect</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-lg px-3 py-2">
                      <Link href="/onboarding">Edit Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="opacity-50" />
                    <DropdownMenuItem
                      onSelect={() => {
                        setResetting(true);
                        setTimeout(() => {
                          clearProfile();
                          router.push("/onboarding");
                        }, 800);
                      }}
                      className="rounded-lg px-3 py-2 text-destructive focus:text-destructive"
                    >
                      Reset profile
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                !isOnboarding && (
                  <Button asChild size="sm" className="hidden rounded-xl md:inline-flex ml-1">
                    <Link href="/onboarding">Get started</Link>
                  </Button>
                )
              )}

              {/* Mobile hamburger */}
              {!isOnboarding && (
                <button
                  className="relative ml-1 flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground lg:hidden ring-focus"
                  onClick={() => setMobileOpen((v) => !v)}
                  aria-label="Toggle menu"
                >
                  <AnimatePresence mode="wait">
                    {mobileOpen ? (
                      <motion.span
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <X className="h-5 w-5" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Menu className="h-5 w-5" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              className="fixed right-0 top-0 z-50 flex h-full w-[280px] flex-col border-l border-white/60 bg-white/90 backdrop-blur-2xl dark:border-white/[0.08] dark:bg-background/95 lg:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between border-b border-border/50 p-4">
                <span className="font-display text-sm font-bold tracking-tight">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-accent hover:text-foreground hover:scale-110"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
                {ALL_LINKS.map((link, idx) => {
                  const active = isActive(link.href);
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04, duration: 0.2 }}
                    >
                      <Link
                        href={link.href}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                          active
                            ? "bg-pulse-500/10 text-foreground border border-pulse-500/20"
                            : "text-muted-foreground hover:bg-accent/60 hover:text-foreground hover:translate-x-0.5"
                        )}
                      >
                        <link.icon className={cn(
                          "h-4 w-4",
                          active ? "text-pulse-500" : "text-muted-foreground"
                        )} />
                        {link.label}
                        {active && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-pulse-500" />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Drawer footer */}
              <div className="border-t border-border/50 p-4">
                {!profile ? (
                  <Button asChild size="sm" className="w-full rounded-xl">
                    <Link href="/onboarding">Get started</Link>
                  </Button>
                ) : (
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 ring-2 ring-pulse-500/20">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.avatarSeed)}`}
                        alt={profile.fullName}
                      />
                      <AvatarFallback className="text-xs">{getInitials(profile.fullName)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{profile.fullName}</p>
                      <p className="text-[11px] text-muted-foreground">{profile.branch}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Reset profile animation overlay */}
      <AnimatePresence>
        {resetting && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-[#0f0a1a] via-[#1a0e2e] to-[#0a0a1a]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            />
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
                transition={{ duration: 1.2, delay: i * 0.2, ease: "easeOut" }}
              />
            ))}
            <motion.div
              className="relative z-10 text-center"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            >
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
