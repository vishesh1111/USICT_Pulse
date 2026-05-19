import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connect",
  description:
    "Find your mentor — connect with real USICT seniors ready to guide you.",
};

export default function ConnectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
