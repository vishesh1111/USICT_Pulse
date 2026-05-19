"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ResourceSubject, ResourceType, Role } from "@/lib/mock/types";

export interface UserResource {
  id: string;
  title: string;
  subject: ResourceSubject;
  type: ResourceType;
  description: string;
  link: string;
  tags: string[];
  recommendedBy: string;
  recommendedByRole: Role;
  usefulness: number;
  votes: number;
  createdAt: string;
  // File upload fields
  fileData?: string;   // base64 data URI
  fileName?: string;
  fileType?: string;   // MIME type
}

interface ResourceStore {
  resources: UserResource[];
  addResource: (r: UserResource) => void;
  removeResource: (id: string) => void;
}

export const useResourceStore = create<ResourceStore>()(
  persist(
    (set) => ({
      resources: [],
      addResource: (resource) =>
        set((state) => ({ resources: [resource, ...state.resources] })),
      removeResource: (id) =>
        set((state) => ({
          resources: state.resources.filter((r) => r.id !== id),
        })),
    }),
    {
      name: "usict-pulse-resources",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
