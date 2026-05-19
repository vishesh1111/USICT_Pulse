"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

// Floating particle component
export function FloatingParticles() {
  const particles = React.useMemo(
    () =>
      Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        width: Math.random() * 4 + 2,
        color: `hsl(${230 + Math.random() * 60}, 80%, ${60 + Math.random() * 20}%)`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        yOffset: -30 - Math.random() * 50,
        xOffset: (Math.random() - 0.5) * 40,
        duration: 4 + Math.random() * 4,
        delay: Math.random() * 3,
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.width,
            height: p.width,
            background: p.color,
            left: p.left,
            top: p.top,
          }}
          animate={{
            y: [0, p.yOffset, 0],
            x: [0, p.xOffset, 0],
            opacity: [0.2, 0.7, 0.2],
            scale: [1, 1.5, 1],
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

// Animated step indicator
export function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <React.Fragment key={i}>
          <motion.div className="relative flex items-center justify-center">
            <motion.div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors duration-500 ${
                i < currentStep
                  ? "bg-pulse-500 text-white"
                  : i === currentStep
                  ? "bg-pulse-500/20 text-pulse-400 ring-2 ring-pulse-500"
                  : "bg-muted/50 text-muted-foreground"
              }`}
              animate={{ scale: i === currentStep ? 1.15 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {i < currentStep ? (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Check className="h-3.5 w-3.5" />
                </motion.div>
              ) : (
                i + 1
              )}
            </motion.div>
            {i === currentStep && (
              <motion.div
                className="absolute inset-0 rounded-full bg-pulse-500/20"
                animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.div>
          {i < totalSteps - 1 && (
            <motion.div
              className="h-0.5 w-6 rounded-full md:w-8"
              animate={{
                backgroundColor: i < currentStep ? "hsl(230, 95%, 66%)" : "hsl(224, 30%, 14%)",
              }}
              transition={{ duration: 0.5 }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// Animated background
export function AnimatedBackground() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute inset-0 bg-radial-fade" />
      <motion.div
        className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-pulse-500/10 blur-3xl"
        animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl"
        animate={{ x: [0, -40, 0], y: [0, -30, 0], scale: [1.2, 1, 1.2] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-500/5 blur-3xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <FloatingParticles />
    </div>
  );
}
