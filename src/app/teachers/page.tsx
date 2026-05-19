import { BookUser } from "lucide-react";
import { ComingSoon } from "@/components/coming-soon";

export const metadata = { title: "Teachers — USICT PULSE" };

export default function TeachersPage() {
  return (
    <ComingSoon
      title="Faculty directory"
      description="Find USICT professors by subject, view their office hours, research interests, and ratings from past students."
      icon={BookUser}
      features={[
        "Searchable faculty profiles",
        "Subject-wise listing",
        "Office hours at a glance",
        "Anonymous student ratings",
        "Research interest tags",
        "Book consultation slots",
      ]}
    />
  );
}
