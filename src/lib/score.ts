/**
 * Calculate a senior credibility score (0-100) based on profile completeness.
 *
 * Breakdown:
 *  - LinkedIn URL provided & valid:  15 pts
 *  - GitHub URL provided & valid:    15 pts
 *  - Club membership (≥1 real club): 10 pts
 *  - Branch selected:                 5 pts
 *  - CGPA (scaled):                  25 pts  →  (cgpa / 10) * 25
 *  - Internship experience:          30 pts  →  yes+details=30, yes-only=20, none=0
 */

export interface SeniorScoreInput {
  linkedin: string;
  github: string;
  clubs: string[];
  branch: string;
  cgpa: number;
  hasInternship: boolean;
  internshipDetails: string;
}

export interface ScoreBreakdown {
  linkedin: number;
  github: number;
  clubs: number;
  branch: number;
  cgpa: number;
  internship: number;
  total: number;
}

function isValidUrl(str: string): boolean {
  if (!str.trim()) return false;
  try {
    const url = new URL(str.startsWith("http") ? str : `https://${str}`);
    return !!url.hostname;
  } catch {
    return false;
  }
}

export function calculateSeniorScore(input: SeniorScoreInput): ScoreBreakdown {
  const linkedin = isValidUrl(input.linkedin) ? 15 : 0;
  const github = isValidUrl(input.github) ? 15 : 0;

  // "None" doesn't count as a real club
  const realClubs = input.clubs.filter((c) => c !== "None");
  const clubs = realClubs.length > 0 ? 10 : 0;

  const branch = input.branch ? 5 : 0;

  // CGPA clamped 0-10, scaled to 25
  const clampedCgpa = Math.max(0, Math.min(10, input.cgpa || 0));
  const cgpa = Math.round((clampedCgpa / 10) * 25 * 10) / 10; // one decimal

  let internship = 0;
  if (input.hasInternship) {
    internship = input.internshipDetails.trim().length > 0 ? 30 : 20;
  }

  const total = Math.round(linkedin + github + clubs + branch + cgpa + internship);

  return { linkedin, github, clubs, branch, cgpa, internship, total };
}
