import { NextResponse } from "next/server";

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

// POST — Senior answers a question
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: questionId } = await params;
    const body = await req.json();
    const { body: answerBody, authorEmail } = body;

    const prisma = getPrisma();

    if (prisma) {
      try {
        // Find the senior by email
        const author = await prisma.user.findUnique({
          where: { email: authorEmail },
        });

        if (!author) {
          return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const answer = await prisma.answer.create({
          data: {
            questionId,
            authorId: author.id,
            body: answerBody,
          },
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
        });

        return NextResponse.json({ answer });
      } catch (dbError) {
        console.warn("[API /questions/[id]/answers POST] Database error, using fallback:", dbError);
        // Fall through to fallback
      }
    }

    // Fallback: mock answer
    const mockAnswer = {
      id: `a-${Date.now()}`,
      questionId,
      body: answerBody,
      authorId: "mock",
      createdAt: new Date().toISOString(),
      author: {
        fullName: "Senior (Mock)",
        seniorScore: 99,
        branch: "CSE",
        avatarUrl: "",
        role: "SENIOR",
      },
    };

    return NextResponse.json({ answer: mockAnswer });
  } catch (error: any) {
    console.error("[API /questions/[id]/answers POST]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
