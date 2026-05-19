export const APP_NAME = "USICT PULSE";
export const APP_TAGLINE = "The pulse of USICT — discover, connect, grow.";
export const COLLEGE = "USICT, GGSIPU, New Delhi";

export const BRANCHES = ["CSE", "IT", "ECE", "CSEAI", "CSEDS"] as const;
export type Branch = (typeof BRANCHES)[number];

export const BRANCH_LABELS: Record<Branch, string> = {
  CSE: "Computer Science & Engineering",
  IT: "Information Technology",
  ECE: "Electronics & Communication",
  CSEAI: "CSE — Artificial Intelligence",
  CSEDS: "CSE — Data Science",
};

export const BRANCH_COLORS: Record<Branch, string> = {
  CSE: "from-blue-500 to-cyan-500",
  IT: "from-emerald-500 to-teal-500",
  ECE: "from-orange-500 to-amber-500",
  CSEAI: "from-fuchsia-500 to-purple-500",
  CSEDS: "from-rose-500 to-pink-500",
};

export const YEARS = [1, 2, 3, 4] as const;

export const INTEREST_OPTIONS = [
  "Web Development",
  "Mobile Development",
  "Machine Learning",
  "Data Science",
  "Cyber Security",
  "Cloud Computing",
  "DevOps",
  "Competitive Programming",
  "UI/UX Design",
  "Product Management",
  "Blockchain",
  "IoT & Embedded",
  "Game Development",
  "Robotics",
  "Open Source",
  "Research",
  "Finance / Quant",
  "Startups",
];

export const CLUB_OPTIONS = [
  "ACM",
  "IEEE",
  "Robotics Club",
  "Coding Club",
  "Drama Club",
  "E-Cell",
  "Debate Society",
  "Photography Club",
  "Music Society",
  "None",
] as const;

export const NAV_LINKS = [
  { href: "/dashboard", label: "Home" },
  {
    label: "Opportunities",
    href: "/opportunities",
    children: [
      { href: "/opportunities?tab=internships", label: "Internships" },
      { href: "/opportunities?tab=scholarships", label: "Scholarships" },
      { href: "/opportunities?tab=clubs", label: "Clubs" },
      { href: "/opportunities?tab=local", label: "Local" },
    ],
  },
  { href: "/ask", label: "Ask" },
  { href: "/connect", label: "Connect" },
  { href: "/alumni", label: "Alumni" },
  { href: "/teachers", label: "Teachers" },
  { href: "/resources", label: "Resources" },
  { href: "/notifications", label: "Notifications" },
  { href: "/about", label: "About" },
];
