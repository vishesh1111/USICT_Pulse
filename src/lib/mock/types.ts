import type { Branch } from "@/lib/constants";

export type Role = "STUDENT" | "SENIOR" | "ALUMNI" | "ADMIN";

export interface MockUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  role: Role;
  branch: Branch;
  year: number;
  cgpa: number;
  interests: string[];
  skills: string[];
  achievements: string[];
  bio?: string;
  isMentor?: boolean;
  mentoringTopics?: string[];
  graduationYear?: number;
  company?: string;
  position?: string;
  linkedin?: string;
  github?: string;
}

export interface MockTeacher {
  id: string;
  name: string;
  branch: Branch;
  subjects: string[];
  designation: string;
  photoUrl: string;
  bio: string;
  yearTaught: number[];
  rating: number;
  internalsTrend: "Generous" | "Average" | "Strict";
  difficulty: "Easy" | "Moderate" | "Hard";
  teachingNature: string;
  reviews: MockTeacherReview[];
}

export interface MockTeacherReview {
  id: string;
  author: string;
  branch: Branch;
  year: number;
  rating: number;
  text: string;
  behaviorNote: string;
  createdAt: string;
}

export type OpportunityType = "INTERNSHIP" | "SCHOLARSHIP" | "CLUB" | "LOCAL";
export type OpportunityStatus = "OPEN" | "CLOSED" | "UPCOMING";

export interface MockOpportunity {
  id: string;
  title: string;
  organization: string;
  type: OpportunityType;
  status: OpportunityStatus;
  description: string;
  eligibility: string;
  deadline: string;
  applyUrl: string;
  tags: string[];
  branches: Branch[];
  stipend?: string;
  location?: string;
  featured?: boolean;
}

export interface MockQuestion {
  id: string;
  title: string;
  body: string;
  branch?: Branch;
  tags: string[];
  anonymous: boolean;
  authorName?: string;
  helpfulCount: number;
  createdAt: string;
  answers: MockAnswer[];
}

export interface MockAnswer {
  id: string;
  authorName: string;
  authorRole: Role;
  body: string;
  helpfulCount: number;
  createdAt: string;
}

export type ResourceType =
  | "VIDEO"
  | "ARTICLE"
  | "PDF"
  | "GITHUB"
  | "PLAYLIST"
  | "COURSE"
  | "CHEATSHEET";

export type ResourceSubject =
  | "DBMS"
  | "OOPS"
  | "DSA"
  | "LLD"
  | "HLD"
  | "OS"
  | "CN"
  | "SYSTEM_DESIGN"
  | "AI_ML"
  | "WEB_DEV";

export interface MockResource {
  id: string;
  title: string;
  subject: ResourceSubject;
  type: ResourceType;
  description: string;
  link: string;
  recommendedBy: string;
  recommendedByRole: Role;
  usefulness: number;
  votes: number;
  tags: string[];
  createdAt: string;
}

export type NotificationType =
  | "DEADLINE"
  | "OPPORTUNITY"
  | "MESSAGE"
  | "ANSWER"
  | "REVIEW"
  | "SYSTEM";

export interface MockNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  link?: string;
  read: boolean;
  createdAt: string;
}
