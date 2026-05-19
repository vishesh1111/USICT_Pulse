import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST — Register / upsert a user in DB
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      email, fullName, role, branch, year, interests, goals,
      linkedin, github, clubs, cgpa, hasInternship, internshipDetails, seniorScore,
      avatarSeed,
    } = body;

    const dbRole = role === "senior" ? "SENIOR" : "STUDENT";

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
  } catch (error: any) {
    console.error("[API /users POST]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET — List seniors sorted by score (for leaderboard) or all users
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const leaderboard = searchParams.get("leaderboard");

    if (leaderboard === "true") {
      const seniors = await prisma.user.findMany({
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
          linkedin: true,
          github: true,
          seniorScore: true,
          avatarUrl: true,
          createdAt: true,
          _count: { select: { answers: true } },
        },
      });
      return NextResponse.json({ seniors });
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

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error("[API /users GET]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
