import { BookOpen } from "lucide-react";
import { ComingSoon } from "@/components/coming-soon";

export const metadata = { title: "Resources — USICT PULSE" };

export default function ResourcesPage() {
  return (
    <ComingSoon
      title="The resources hub"
      description="Subject-wise notes, PYQs, video playlists, and roadmaps — curated by USICT toppers and verified by faculty."
      icon={BookOpen}
      features={[
        "Branch & semester filtering",
        "Notes, PYQs & cheat-sheets",
        "Curated YouTube playlists",
        "Roadmaps for DSA, web, ML",
        "Crowd-sourced contributions",
        "Bookmark & download offline",
      ]}
    />
  );
}
