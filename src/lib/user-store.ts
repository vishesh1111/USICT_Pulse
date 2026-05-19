"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Branch } from "@/lib/constants";

export interface UserProfile {
  fullName: string;
  email: string;
  branch: Branch;
  year: number;
  interests: string[];
  goals: string[];
  avatarSeed: string;
  onboardedAt: string;
  role: "junior" | "senior";
  // Senior-specific fields
  linkedin?: string;
  github?: string;
  clubs?: string[];
  cgpa?: number;
  hasInternship?: boolean;
  internshipDetails?: string;
  seniorScore?: number;
}

interface UserStore {
  profile: UserProfile | null;
  splashShown: boolean;
  setProfile: (p: UserProfile) => void;
  clearProfile: () => void;
  markSplashShown: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      profile: null,
      splashShown: false,
      setProfile: (profile) => set({ profile }),
      clearProfile: () => set({ profile: null }),
      markSplashShown: () => set({ splashShown: true }),
    }),
    {
      name: "usict-pulse-user",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
