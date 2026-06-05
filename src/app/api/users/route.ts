import { NextResponse } from "next/server";
import { getMockSeniors, addMockSenior } from "@/lib/mock/db";

// Helper: try to get prisma, return null if DATABASE_URL is missing
function getPrisma() {
  try {
    if (!process.env.DATABASE_URL) return null;
    const { prisma } = require("@/lib/prisma");
    return prisma;
  } catch {
    return null;
  }
}

// POST — Register / upsert a user in DB
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      email, fullName, role, branch, year, interests, goals,
      linkedin, github, clubs, cgpa, hasInternship, internshipDetails, seniorScore,
      avatarSeed,
    } = body;

    const dbRole = role?.toLowerCase() === "senior" ? "SENIOR" : "STUDENT";
    const prisma = getPrisma();

    if (prisma) {
      try {
        const user = await prisma.user.upsert({
          where: { email },
          update: {
            fullName,
            role: dbRole,
            branch: branch || undefined,
            year: year || undefined,
            interests: interests || [],
            goals: goals || [],
            linkedin: linkedin || undefined,
            github: github || undefined,
            clubs: clubs || [],
            cgpa: cgpa || undefined,
            hasInternship: hasInternship || false,
            internshipDetails: internshipDetails || undefined,
            seniorScore: seniorScore || undefined,
            avatarUrl: avatarSeed
              ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(avatarSeed)}`
              : undefined,
          },
          create: {
            email,
            fullName,
            role: dbRole,
            branch: branch || undefined,
            year: year || undefined,
            interests: interests || [],
            goals: goals || [],
            linkedin: linkedin || undefined,
            github: github || undefined,
            clubs: clubs || [],
            cgpa: cgpa || undefined,
            hasInternship: hasInternship || false,
            internshipDetails: internshipDetails || undefined,
            seniorScore: seniorScore || undefined,
            avatarUrl: avatarSeed
              ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(avatarSeed)}`
              : undefined,
          },
        });

        return NextResponse.json({ user }, { status: 200 });
      } catch (dbError) {
        console.warn("[API /users POST] Database error, using fallback:", dbError);
      }
    }

    // Fallback response
    const mockUser = {
      id: "mock-user-" + Date.now(),
      email,
      fullName,
      role: dbRole,
      branch,
      year,
      clubs,
      cgpa,
      hasInternship,
      internshipDetails,
      seniorScore,
      linkedin,
      github,
      avatarUrl: avatarSeed ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(avatarSeed)}` : null,
    };
    if (dbRole === "SENIOR") {
      addMockSenior(mockUser as any);
    }
    return NextResponse.json({ user: mockUser }, { status: 200 });

  } catch (error: any) {
    console.error("[API /users POST]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const leaderboard = searchParams.get("leaderboard");

    const prisma = getPrisma();

    if (prisma) {
      try {
        if (leaderboard === "true") {
          const dbSeniors = await prisma.user.findMany({
            where: { role: "SENIOR", seniorScore: { not: null } },
            orderBy: { seniorScore: "desc" },
            select: {
              id: true,
              fullName: true,
              email: true,
              branch: true,
              year: true,
              cgpa: true,
              clubs: true,
              interests: true,
              linkedin: true,
              github: true,
              seniorScore: true,
              avatarUrl: true,
              createdAt: true,
              _count: { select: { answers: true } },
            },
          });

          // Always merge in the hardcoded mock seniors so they always appear
          const allMockSeniors = getMockSeniors();
          const dbEmails = new Set(dbSeniors.map((s: any) => s.email));
          const mockOnly = allMockSeniors
            .filter(s => (s as any).seniorScore != null && !dbEmails.has(s.email))
            .map(s => ({
              id: s.id,
              fullName: s.fullName,
              email: s.email,
              branch: s.branch,
              year: s.year,
              cgpa: s.cgpa,
              clubs: [] as string[],
              interests: s.interests || [],
              mentoringTopics: s.mentoringTopics || [],
              linkedin: s.linkedin || null,
              github: s.github || null,
              seniorScore: (s as any).seniorScore,
              avatarUrl: s.avatarUrl,
              createdAt: new Date().toISOString(),
              _count: { answers: 0 },
            }));

          const merged = [...dbSeniors.map((s: any) => ({
            ...s,
            interests: s.interests || [],
            mentoringTopics: (s as any).mentoringTopics || [],
          })), ...mockOnly]
            .sort((a, b) => (b.seniorScore || 0) - (a.seniorScore || 0));

          return NextResponse.json({ seniors: merged }, {
            headers: {
              "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
            },
          });
        }

        const where: any = {};
        if (role === "senior") where.role = "SENIOR";
        if (role === "junior") where.role = "STUDENT";

        const users = await prisma.user.findMany({
          where,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            branch: true,
            year: true,
            seniorScore: true,
            avatarUrl: true,
          },
        });

        return NextResponse.json({ users }, {
          headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
          },
        });
      } catch (dbError) {
        console.warn("[API /users GET] Database error, using fallback:", dbError);
      }
    }

    // Fallback response
    if (leaderboard === "true") {
      const allSeniors = getMockSeniors();
      const seniors = [...allSeniors]
        .filter(s => (s as any).seniorScore !== undefined && (s as any).seniorScore !== null)
        .sort((a, b) => ((b as any).seniorScore || 0) - ((a as any).seniorScore || 0))
        .map((senior) => ({
          id: senior.id,
          fullName: senior.fullName,
          email: senior.email,
          branch: senior.branch,
          year: senior.year,
          cgpa: senior.cgpa,
          clubs: [],
          interests: senior.interests || [],
          mentoringTopics: senior.mentoringTopics || [],
          linkedin: senior.linkedin || null,
          github: senior.github || null,
          seniorScore: (senior as any).seniorScore,
          avatarUrl: senior.avatarUrl,
          createdAt: new Date().toISOString(),
          _count: { answers: Math.floor(Math.random() * 10) },
        }));
      return NextResponse.json({ seniors });
    }
    return NextResponse.json({ users: [] });

  } catch (error: any) {
    console.error("[API /users GET]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
