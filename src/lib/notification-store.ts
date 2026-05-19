"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { MockNotification } from "@/lib/mock/types";

export interface NotificationPreferences {
  deadlineAlerts: boolean;
  questionAlerts: boolean;
  weeklyDigest: boolean;
  browserNotifications: boolean;
}

interface NotificationStore {
  engineNotifications: MockNotification[];
  preferences: NotificationPreferences;
  lastEngineRun: string | null;
  addNotification: (n: MockNotification) => void;
  addNotifications: (ns: MockNotification[]) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
  setPreferences: (p: Partial<NotificationPreferences>) => void;
  setLastEngineRun: (ts: string) => void;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set) => ({
      engineNotifications: [],
      preferences: {
        deadlineAlerts: true,
        questionAlerts: true,
        weeklyDigest: true,
        browserNotifications: false,
      },
      lastEngineRun: null,

      addNotification: (n) =>
        set((s) => ({
          engineNotifications: [n, ...s.engineNotifications],
        })),

      addNotifications: (ns) =>
        set((s) => {
          // Deduplicate by ID
          const existingIds = new Set(s.engineNotifications.map((n) => n.id));
          const fresh = ns.filter((n) => !existingIds.has(n.id));
          return { engineNotifications: [...fresh, ...s.engineNotifications] };
        }),

      markRead: (id) =>
        set((s) => ({
          engineNotifications: s.engineNotifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      markAllRead: () =>
        set((s) => ({
          engineNotifications: s.engineNotifications.map((n) => ({
            ...n,
            read: true,
          })),
        })),

      clearAll: () => set({ engineNotifications: [] }),

      setPreferences: (p) =>
        set((s) => ({
          preferences: { ...s.preferences, ...p },
        })),

      setLastEngineRun: (ts) => set({ lastEngineRun: ts }),
    }),
    {
      name: "usict-pulse-notifications",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
