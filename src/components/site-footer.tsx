"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Github, Linkedin, Mail, Heart } from "lucide-react";
import { Logo } from "./logo";
import { APP_TAGLINE, COLLEGE } from "@/lib/constants";

const FOOTER_SECTIONS = [
  {
    title: "Explore",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Opportunities", href: "/opportunities" },
      { label: "Ask", href: "/ask" },
      { label: "Connect", href: "/connect" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Alumni", href: "/alumni" },
      { label: "Teachers", href: "/teachers" },
      { label: "Resources", href: "/resources" },
      { label: "Notifications", href: "/notifications" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Our story", href: "/about" },
      { label: "Privacy", href: "/about#privacy" },
      { label: "Contact", href: "/about#contact" },
    ],
  },
];

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname === "/onboarding") return null;

  return (
    <footer className="relative mt-24 border-t bg-card/30 backdrop-blur-sm">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pulse-500/40 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-pulse-500/[0.03] to-transparent dark:from-pulse-500/[0.05]" />
      <div className="container py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              {APP_TAGLINE}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">{COLLEGE}</p>
            <div className="mt-5 flex items-center gap-3">
              <Link
                href="#"
                aria-label="GitHub"
                className="text-muted-foreground transition-all duration-200 hover:text-foreground hover:scale-125 hover:-translate-y-0.5"
              >
                <Github className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                aria-label="LinkedIn"
                className="text-muted-foreground transition-all duration-200 hover:text-blue-500 hover:scale-125 hover:-translate-y-0.5"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
              <Link
                href="mailto:hello@usict.pulse"
                aria-label="Email"
                className="text-muted-foreground transition-all duration-200 hover:text-pulse-500 hover:scale-125 hover:-translate-y-0.5"
              >
                <Mail className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {FOOTER_SECTIONS.map((sec) => (
            <div key={sec.title}>
              <h4 className="mb-3 text-sm font-semibold">{sec.title}</h4>
              <ul className="space-y-2">
                {sec.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="inline-block text-sm text-muted-foreground transition-all duration-200 hover:text-foreground hover:translate-x-1"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} USICT PULSE. Built by students, for students.
          </p>
          <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            Made with <Heart className="h-3 w-3 fill-pulse-500 text-pulse-500" /> at USICT
          </p>
        </div>
      </div>
    </footer>
  );
}
