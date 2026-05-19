import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Opportunities",
  description:
    "Discover internships, scholarships, hackathons, and clubs curated for USICT students.",
};

export default function OpportunitiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
