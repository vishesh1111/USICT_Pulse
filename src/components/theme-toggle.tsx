"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const toggle = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="group relative flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-all duration-200 hover:bg-amber-500/10 hover:text-amber-500 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 ring-focus"
    >
      {mounted ? (
        theme === "dark" ? (
          <Sun className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110" />
        ) : (
          <Moon className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" />
        )
      ) : (
        <div className="h-4 w-4" />
      )}
    </button>
  );
}
