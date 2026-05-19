import { GraduationCap } from "lucide-react";
import { ComingSoon } from "@/components/coming-soon";

export const metadata = { title: "Alumni — USICT PULSE" };

export default function AlumniPage() {
  return (
    <ComingSoon
      title="The USICT alumni network"
      description="Discover where USICT graduates work, how they got there, and how to reach out for advice or referrals."
      icon={GraduationCap}
      features={[
        "Alumni by company & role",
        "Career trajectory timelines",
        "Referral pathways",
        "AMA sessions",
        "Branch-wise alumni map",
        "Success story interviews",
      ]}
    />
  );
}
