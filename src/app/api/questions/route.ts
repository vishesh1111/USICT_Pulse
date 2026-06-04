import { NextResponse } from "next/server";
import { mockQuestions } from "@/lib/mock/ask";

// Helper: try to get prisma, return null if DATABASE_URL is missing
function getPrisma() {
  try {
    if (!process.env.DATABASE_URL) return null;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { prisma } = require("@/lib/prisma");
    return prisma;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, body: questionBody, tags, anonymous, authorEmail } = body;

    const prisma = getPrisma();

    if (prisma) {
      try {
        // Real DB path
        let authorId: string | null = null;
        if (authorEmail) {
          const user = await prisma.user.findUnique({ where: { email: authorEmail } });
          if (user) authorId = user.id;
        }

        const question = await prisma.question.create({
          data: {
            title,
            body: questionBody,
            tags: tags || [],
            anonymous: anonymous ?? true,
            authorId,
          },
          include: {
            author: { select: { fullName: true, email: true, branch: true } },
            answers: {
              include: { author: { select: { fullName: true, seniorScore: true, branch: true } } },
              orderBy: { createdAt: "desc" },
            },
          },
        });

        const seniors = await prisma.user.findMany({
          where: { role: "SENIOR" },
          select: { email: true, fullName: true },
        });

        return NextResponse.json({
          question,
          seniorEmails: seniors.map((s: any) => ({ email: s.email, name: s.fullName })),
        });
      } catch (dbError) {
        console.warn("[API /questions POST] Database error, using fallback:", dbError);
        // Fall through to fallback
      }
    }

    // Fallback: no database — return a mock response so the UI still works
    const mockQuestion = {
      id: `q-${Date.now()}`,
      title,
      body: questionBody,
      tags: tags || [],
      anonymous: anonymous ?? true,
      author: null,
      helpfulCount: 0,
      createdAt: new Date().toISOString(),
      answers: [],
      _count: { answers: 0 },
    };

    mockQuestions.unshift(mockQuestion);

    return NextResponse.json({ question: mockQuestion, seniorEmails: [] });
  } catch (error: any) {
    console.error("[API /questions POST]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const prisma = getPrisma();

    if (prisma) {
      try {
        const questions = await prisma.question.findMany({
          orderBy: { createdAt: "desc" },
          include: {
            author: { select: { fullName: true, email: true, branch: true, avatarUrl: true } },
            answers: {
              include: {
                author: {
                  select: {
                    fullName: true,
                    seniorScore: true,
                    branch: true,
                    avatarUrl: true,
                    role: true,
                  },
                },
              },
              orderBy: { createdAt: "desc" },
            },
            _count: { select: { answers: true } },
          },
        });

        return NextResponse.json({ questions });
      } catch (dbError) {
        console.warn("[API /questions GET] Database error, using fallback:", dbError);
        // Fall through to fallback
      }
    }

    // Fallback: return mock data when no database
    return NextResponse.json({ questions: mockQuestions });
  } catch (error: any) {
    console.error("[API /questions GET]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
