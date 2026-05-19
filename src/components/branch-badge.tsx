import { cn } from "@/lib/utils";
import { BRANCH_COLORS, type Branch } from "@/lib/constants";

interface BranchBadgeProps {
  branch: Branch;
  className?: string;
  size?: "sm" | "md";
}

export function BranchBadge({ branch, className, size = "sm" }: BranchBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md bg-gradient-to-r font-semibold uppercase tracking-wide text-white shadow-sm",
        BRANCH_COLORS[branch],
        size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-xs",
        className
      )}
    >
      {branch}
    </span>
  );
}
