import { Info } from "lucide-react";
import { ComingSoon } from "@/components/coming-soon";

export const metadata = { title: "About — USICT PULSE" };

export default function AboutPage() {
  return (
    <ComingSoon
      title="About USICT PULSE"
      description="A student-built platform for USICT, GGSIPU — connecting the dots between opportunities, mentors, alumni, and academics."
      icon={Info}
      features={[
        "Our mission & story",
        "The team behind PULSE",
        "Open-source contributions",
        "Partner with us",
        "Privacy & data policy",
        "Contact & feedback",
      ]}
    />
  );
}
