import type { UserProfile } from "@/lib/user-store";
import { MOCK_OPPORTUNITIES, MOCK_TEACHERS, MOCK_RESOURCES, MOCK_NOTIFICATIONS } from "@/lib/mock";
import { mockAlumni } from "@/lib/mock/alumni";
import { daysUntil } from "@/lib/utils";

// ─── §1 Highest Impact Action ─────────────────────────────────────────────────

export interface HighestImpactAction {
  action: string;
  reason: string;
  source: "opportunity" | "resource" | "mentor" | "event";
  sourceLink: string;
  impact: "High" | "Medium";
  estimatedTime: string;
}

export function getHighestImpactAction(profile: UserProfile): HighestImpactAction {
  // Priority 1: Opportunity with close deadline matching their branch
  const urgentOpp = MOCK_OPPORTUNITIES
    .filter(o => o.status === "OPEN" && o.branches.includes(profile.branch as any))
    .filter(o => { const d = daysUntil(o.deadline); return d > 0 && d <= 7; })
    .sort((a, b) => daysUntil(a.deadline) - daysUntil(b.deadline))[0];

  if (urgentOpp) {
    return {
      action: `Apply for "${urgentOpp.title}" before it closes`,
      reason: `Only ${daysUntil(urgentOpp.deadline)} day(s) left. Matches your ${profile.branch} branch.`,
      source: "opportunity",
      sourceLink: "/opportunities",
      impact: "High",
      estimatedTime: "30 mins",
    };
  }

  // Priority 2: Featured opportunity for their branch
  const featuredOpp = MOCK_OPPORTUNITIES
    .find(o => o.featured && o.status === "OPEN" && o.branches.includes(profile.branch as any));

  if (featuredOpp) {
    return {
      action: `Explore "${featuredOpp.title}" — featured for you`,
      reason: `Curated for ${profile.branch} students interested in ${profile.interests[0] || "your field"}.`,
      source: "opportunity",
      sourceLink: "/opportunities",
      impact: "High",
      estimatedTime: "15 mins",
    };
  }

  // Priority 3: Top resource matching their interests
  const matchedResource = MOCK_RESOURCES.find(r =>
    r.tags.some(tag => profile.interests.some(i => i.toLowerCase().includes(tag.toLowerCase())))
  );

  if (matchedResource) {
    return {
      action: `Study "${matchedResource.title}"`,
      reason: `Top-rated resource recommended by seniors. Aligns with your interest in ${profile.interests[0]}.`,
      source: "resource",
      sourceLink: "/resources",
      impact: "High",
      estimatedTime: "2 hours",
    };
  }

  // Fallback
  return {
    action: "Connect with a mentor in your branch",
    reason: `Getting guidance early in Year ${profile.year} sets the trajectory for your career.`,
    source: "mentor",
    sourceLink: "/connect",
    impact: "Medium",
    estimatedTime: "10 mins",
  };
}

// ─── §2 Personalized Opportunity Match ────────────────────────────────────────

export interface ScoredOpportunity {
  opportunity: typeof MOCK_OPPORTUNITIES[0];
  matchScore: number;
  matchReasons: string[];
}

export function getMatchedOpportunities(profile: UserProfile): ScoredOpportunity[] {
  return MOCK_OPPORTUNITIES
    .filter(o => o.status === "OPEN")
    .map(opp => {
      let score = 0;
      const reasons: string[] = [];

      // Branch match
      if (opp.branches.includes(profile.branch as any)) {
        score += 40;
        reasons.push(profile.branch);
      }

      // Interest/tag overlap
      const tagOverlap = opp.tags.filter(tag =>
        profile.interests.some(i => i.toLowerCase().includes(tag.toLowerCase()) || tag.toLowerCase().includes(i.toLowerCase()))
      );
      if (tagOverlap.length > 0) {
        score += tagOverlap.length * 15;
        reasons.push(...tagOverlap.slice(0, 2));
      }

      // Featured bonus
      if (opp.featured) score += 10;

      // Deadline urgency bonus
      const days = daysUntil(opp.deadline);
      if (days > 0 && days <= 14) score += 10;

      return { opportunity: opp, matchScore: Math.min(score, 100), matchReasons: reasons };
    })
    .filter(s => s.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 4);
}

// ─── §3 Deadline Radar ────────────────────────────────────────────────────────

export interface DeadlineItem {
  id: string;
  title: string;
  organization: string;
  type: string;
  deadline: string;
  daysLeft: number;
  urgency: "critical" | "warning" | "safe";
}

export function getDeadlineRadar(profile: UserProfile): DeadlineItem[] {
  return MOCK_OPPORTUNITIES
    .filter(o => o.status === "OPEN" && o.branches.includes(profile.branch as any))
    .map(o => {
      const daysLeft = daysUntil(o.deadline);
      return {
        id: o.id,
        title: o.title,
        organization: o.organization,
        type: o.type,
        deadline: o.deadline,
        daysLeft,
        urgency: daysLeft <= 3 ? "critical" as const : daysLeft <= 7 ? "warning" as const : "safe" as const,
      };
    })
    .filter(d => d.daysLeft > 0)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 5);
}

// ─── §4 Recommended Mentors ──────────────────────────────────────────────────

export interface ScoredMentor {
  mentor: any;
  topicOverlap: string[];
  matchScore: number;
}

export function getRecommendedMentors(profile: UserProfile, seniors: any[]): ScoredMentor[] {
  return seniors
    .map(mentor => {
      const topicOverlap = (mentor.mentoringTopics || []).filter((topic: string) =>
        profile.interests.some(i =>
          i.toLowerCase().includes(topic.toLowerCase()) || topic.toLowerCase().includes(i.toLowerCase())
        )
      );

      let score = topicOverlap.length * 30;
      // Branch match bonus
      if (mentor.branch === profile.branch) score += 25;
      // Same interest overlap
      const interestOverlap = (mentor.interests || []).filter((mi: string) =>
        profile.interests.some(pi => pi.toLowerCase() === mi.toLowerCase())
      );
      score += interestOverlap.length * 10;

      return { mentor, topicOverlap: [...topicOverlap, ...interestOverlap.slice(0, 1)], matchScore: score };
    })
    .filter(s => s.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);
}

// ─── §5 Teacher Intel ─────────────────────────────────────────────────────────

export interface TeacherIntelItem {
  teacher: typeof MOCK_TEACHERS[0];
  internalsRange: string;
  attendancePolicy: "Strict" | "Moderate" | "Lenient";
  assignmentLoad: "Heavy" | "Medium" | "Light";
  seniorTip: string;
}

export function getTeacherIntel(profile: UserProfile): TeacherIntelItem[] {
  return MOCK_TEACHERS
    .filter(t => t.branch === profile.branch)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4)
    .map(teacher => {
      let internalsRange = "20-25";
      if (teacher.internalsTrend === "Generous") internalsRange = "26-30";
      else if (teacher.internalsTrend === "Average") internalsRange = "24-27";
      else internalsRange = "18-23";

      let attendancePolicy: "Strict" | "Moderate" | "Lenient" = "Moderate";
      if (teacher.difficulty === "Hard") attendancePolicy = "Strict";
      else if (teacher.difficulty === "Easy") attendancePolicy = "Lenient";

      let assignmentLoad: "Heavy" | "Medium" | "Light" = "Medium";
      if (teacher.difficulty === "Hard") assignmentLoad = "Heavy";
      else if (teacher.difficulty === "Easy") assignmentLoad = "Light";

      const seniorTip = teacher.reviews[0]?.behaviorNote || teacher.reviews[0]?.text || "Pay attention in class.";

      return { teacher, internalsRange, attendancePolicy, assignmentLoad, seniorTip };
    });
}

// ─── §6 Upcoming Events ──────────────────────────────────────────────────────

export interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  daysLeft: number;
  type: "event" | "club" | "deadline" | "notification";
  organization?: string;
}

export function getUpcomingEvents(_profile: UserProfile): UpcomingEvent[] {
  const events: UpcomingEvent[] = [];

  // From LOCAL/CLUB opportunities
  MOCK_OPPORTUNITIES
    .filter(o => (o.type === "LOCAL" || o.type === "CLUB") && o.status === "OPEN")
    .forEach(o => {
      const daysLeft = daysUntil(o.deadline);
      if (daysLeft > 0) {
        events.push({
          id: o.id,
          title: o.title,
          date: o.deadline,
          daysLeft,
          type: o.type === "CLUB" ? "club" : "event",
          organization: o.organization,
        });
      }
    });

  // From deadline notifications
  MOCK_NOTIFICATIONS
    .filter(n => n.type === "DEADLINE")
    .forEach(n => {
      events.push({
        id: n.id,
        title: n.title,
        date: n.createdAt,
        daysLeft: 0,
        type: "notification",
      });
    });

  return events.sort((a, b) => a.daysLeft - b.daysLeft).slice(0, 6);
}

// ─── §7 What's Happening at USICT ────────────────────────────────────────────

export interface HappeningItem {
  id: string;
  type: "question" | "resource" | "opportunity" | "notification";
  title: string;
  subtitle: string;
  timeAgo: string;
  link: string;
}

export function getWhatsHappening(profile: UserProfile): HappeningItem[] {
  const items: HappeningItem[] = [];

  // Recent resources
  MOCK_RESOURCES.forEach(r => {
    items.push({
      id: r.id,
      type: "resource",
      title: r.title,
      subtitle: `Recommended by ${r.recommendedBy} · ${r.votes} votes`,
      timeAgo: getRelativeTime(r.createdAt),
      link: "/resources",
    });
  });

  // Recent opportunities
  MOCK_OPPORTUNITIES.filter(o => o.status === "OPEN").slice(0, 3).forEach(o => {
    items.push({
      id: o.id,
      type: "opportunity",
      title: o.title,
      subtitle: `${o.organization} · ${o.type.toLowerCase()}`,
      timeAgo: `${daysUntil(o.deadline)}d left`,
      link: "/opportunities",
    });
  });

  // Recent notifications as activity
  MOCK_NOTIFICATIONS.slice(0, 2).forEach(n => {
    items.push({
      id: n.id,
      type: "notification",
      title: n.title,
      subtitle: n.body,
      timeAgo: getRelativeTime(n.createdAt),
      link: n.link || "/notifications",
    });
  });

  return items.slice(0, 8);
}

function getRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

// ─── §8 Resume Readiness ──────────────────────────────────────────────────────

export interface ResumeReadiness {
  score: number;
  filled: { label: string; points: number }[];
  missing: { label: string; points: number; action: string; link: string }[];
}

export function getResumeReadiness(profile: UserProfile): ResumeReadiness {
  const checks: { label: string; points: number; filled: boolean; action: string; link: string }[] = [
    { label: "GitHub Profile", points: 15, filled: !!profile.github, action: "Add your GitHub link", link: "/resume-readiness" },
    { label: "LinkedIn Profile", points: 10, filled: !!profile.linkedin, action: "Connect your LinkedIn", link: "/resume-readiness" },
    { label: "Portfolio Website", points: 10, filled: !!profile.portfolio, action: "Build a portfolio site", link: "/resume-readiness" },
    { label: "CGPA ≥ 8.0", points: 15, filled: (profile.cgpa || 0) >= 8, action: "Focus on academics this sem", link: "/resume-readiness" },
    { label: "Club Membership", points: 10, filled: (profile.clubs?.length || 0) > 0, action: "Join a club at USICT", link: "/resume-readiness" },
    { label: "Internship Experience", points: 20, filled: !!profile.hasInternship, action: "Apply for internships", link: "/resume-readiness" },
    { label: "3+ Interests Listed", points: 10, filled: profile.interests.length >= 3, action: "Expand your interests", link: "/resume-readiness" },
    { label: "Career Goal Set", points: 10, filled: profile.goals.length > 0, action: "Define your career goal", link: "/resume-readiness" },
  ];

  const filled = checks.filter(c => c.filled).map(c => ({ label: c.label, points: c.points }));
  const missing = checks.filter(c => !c.filled).map(c => ({ label: c.label, points: c.points, action: c.action, link: c.link }));
  const score = filled.reduce((sum, c) => sum + c.points, 0);

  return { score, filled, missing };
}
