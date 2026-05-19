"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ApplicationStatus = "applied" | "shortlisted" | "rejected" | "accepted";
export type ApplicationType = "internship" | "scholarship" | "club" | "other";

export interface Application {
  id: string;
  title: string;
  organization: string;
  type: ApplicationType;
  status: ApplicationStatus;
  appliedAt: string; // ISO
}

interface ApplicationStore {
  applications: Application[];
  addApplication: (app: Omit<Application, "id" | "appliedAt">) => void;
  updateStatus: (id: string, status: ApplicationStatus) => void;
  removeApplication: (id: string) => void;
}

export const useApplicationStore = create<ApplicationStore>()(
  persist(
    (set) => ({
      applications: [],
      addApplication: (app) =>
        set((s) => ({
          applications: [
            ...s.applications,
            {
              ...app,
              id: crypto.randomUUID(),
              appliedAt: new Date().toISOString(),
            },
          ],
        })),
      updateStatus: (id, status) =>
        set((s) => ({
          applications: s.applications.map((a) =>
            a.id === id ? { ...a, status } : a
          ),
        })),
      removeApplication: (id) =>
        set((s) => ({
          applications: s.applications.filter((a) => a.id !== id),
        })),
    }),
    {
      name: "usict-pulse-applications",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
