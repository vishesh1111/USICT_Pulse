"use client";

import * as React from "react";
import { motion, useInView, type Variants } from "framer-motion";

// ─── Fade-in on scroll (viewport-triggered) ───
interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
  once?: boolean;
}

export function FadeIn({
  children,
  className,
  delay = 0,
  direction = "up",
  duration = 0.5,
  once = true,
}: FadeInProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-60px" });

  const directionOffset = {
    up: { y: 30 },
    down: { y: -30 },
    left: { x: 30 },
    right: { x: -30 },
    none: {},
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...directionOffset[direction] }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Stagger children on scroll ───
interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
}

const containerVariants: Variants = {
  hidden: {},
  visible: (staggerDelay: number) => ({
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: 0.1,
    },
  }),
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.08,
  once = true,
}: StaggerContainerProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      custom={staggerDelay}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}

// ─── Animated counter ───
interface CounterProps {
  target: number;
  suffix?: string;
  className?: string;
  duration?: number;
}

export function AnimatedCounter({ target, suffix = "", className, duration = 1.5 }: CounterProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = target;
    const totalFrames = Math.round(duration * 60);
    const increment = end / totalFrames;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return (
    <span ref={ref} className={className}>
      {count}{suffix}
    </span>
  );
}

// ─── Floating particles background ───
export function FloatingParticles({ count = 20, className }: { count?: number; className?: string }) {
  const particles = React.useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 5,
      })),
    [count]
  );

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className || ""}`}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-pulse-500/20 dark:bg-pulse-400/15"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, -15, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ─── Glow pulse (behind a card/icon) ───
export function GlowPulse({
  className,
  color = "pulse",
}: {
  className?: string;
  color?: "pulse" | "fuchsia" | "purple" | "amber";
}) {
  const colorMap = {
    pulse: "bg-pulse-500/20 dark:bg-pulse-500/30",
    fuchsia: "bg-fuchsia-500/20 dark:bg-fuchsia-500/30",
    purple: "bg-purple-500/20 dark:bg-purple-500/30",
    amber: "bg-amber-500/20 dark:bg-amber-500/30",
  };

  return (
    <motion.div
      className={`absolute rounded-full blur-2xl ${colorMap[color]} ${className || ""}`}
      animate={{
        scale: [1, 1.3, 1],
        opacity: [0.4, 0.7, 0.4],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

// ─── Shimmer line (loading/highlight) ───
export function ShimmerLine({ className }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-full ${className || ""}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-white/10 animate-shimmer" />
    </div>
  );
}

// ─── Scale-on-hover wrapper ───
export function ScaleOnHover({
  children,
  className,
  scale = 1.03,
}: {
  children: React.ReactNode;
  className?: string;
  scale?: number;
}) {
  return (
    <motion.div
      className={className}
      whileHover={{ scale, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}
