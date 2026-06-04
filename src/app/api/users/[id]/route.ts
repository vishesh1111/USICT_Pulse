import { NextResponse } from "next/server";
import { MOCK_ALUMNI } from "@/lib/mock/users";
import { getMockSeniors } from "@/lib/mock/db";
import { MOCK_RESOURCES } from "@/lib/mock/resources";
import { mockQuestions } from "@/lib/mock/ask";

function getPrisma() {
  try {
    if (!process.env.DATABASE_URL) return null;
    const { prisma } = require("@/lib/prisma");
    return prisma;
  } catch {
    return null;
  }
}

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const id = params.id;
    const prisma = getPrisma();

    if (prisma) {
      try {
        const user = await prisma.user.findUnique({
          where: { id },
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
            branch: true,
            year: true,
            cgpa: true,
            bio: true,
            interests: true,
            skills: true,
            achievements: true,
            goals: true,
            linkedin: true,
            github: true,
            clubs: true,
            hasInternship: true,
            internshipDetails: true,
            seniorScore: true,
            avatarUrl: true,
            createdAt: true,
            _count: {
              select: {
                opportunities: true,
                resources: true,
                answers: true,
              }
            }
          },
        });
        if (user) {
          // Format it similar to mock response for frontend
          return NextResponse.json({ 
            user: {
              ...user,
              opportunitiesCount: user._count.opportunities,
              resourcesCount: user._count.resources,
              answersCount: user._count.answers,
              _count: undefined // remove the original object if desired
            } 
          });
        }
      } catch (dbError) {
        console.warn("[API /users/[id] GET] Database error, using fallback:", dbError);
      }
    }

    // Fallback response: Find in mocks
    const allSeniors = getMockSeniors();
    const allMocks = [...allSeniors, ...MOCK_ALUMNI];
    const mockUser = allMocks.find((u) => u.id === id);

    if (mockUser) {
      // Calculate Stats
      const resourcesCount = MOCK_RESOURCES.filter(r => r.recommendedBy === mockUser.fullName).length;
      
      let answersCount = 0;
      mockQuestions.forEach(q => {
        answersCount += q.answers.filter(a => a.author?.fullName === mockUser.fullName).length;
      });

      // We don't have mock opportunities linked to users in the same way, so default to 0 for mock
      const opportunitiesCount = 0;

      // Score Breakdown (only for seniors)
      let scoreBreakdown = null;
      if (mockUser.role === "SENIOR") {
        const score = (mockUser as any).seniorScore || 0;
        scoreBreakdown = [
          { label: "Base Profile Setup", value: 20 },
          { label: "Academics & CGPA", value: (mockUser.cgpa && mockUser.cgpa > 8) ? 20 : 10 },
          { label: "Internship Experience", value: (mockUser as any).hasInternship ? 25 : 0 },
          { label: "Community Answers", value: Math.min(answersCount * 5, 20) },
          { label: "Resources Added", value: Math.min(resourcesCount * 5, 15) },
          { label: "Opportunities Posted", value: Math.min(opportunitiesCount * 10, 20) },
        ];
        // Ensure breakdown matches total exactly (just adjust the last one dynamically)
        const currentSum = scoreBreakdown.reduce((sum, item) => sum + item.value, 0);
        scoreBreakdown.push({ label: "Profile Endorsements", value: Math.max(0, score - currentSum) });
      }

      return NextResponse.json({ 
        user: {
          ...mockUser,
          resourcesCount,
          answersCount,
          opportunitiesCount,
          scoreBreakdown
        }
      }, { status: 200 });
    }

    return NextResponse.json({ error: "User not found" }, { status: 404 });
  } catch (error: any) {
    console.error("[API /users/[id] GET]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
