import { UserCircle2 } from "lucide-react";
import { ComingSoon } from "@/components/coming-soon";

export const metadata = { title: "Profile — USICT PULSE" };

export default function ProfilePage() {
  return (
    <ComingSoon
      title="Your profile"
      description="Edit your details, manage your interests, control privacy, and customize your PULSE experience."
      icon={UserCircle2}
      features={[
        "Edit name, branch & year",
        "Update interests & goals",
        "Avatar customization",
        "Privacy controls",
        "Connected accounts",
        "Export your data",
      ]}
    />
  );
}
