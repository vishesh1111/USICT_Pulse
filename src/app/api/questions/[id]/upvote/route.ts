import { NextResponse } from "next/server";
import { mockQuestions } from "@/lib/mock/ask";

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

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;

    const prisma = getPrisma();

    if (prisma) {
      try {
        const question = await prisma.question.update({
          where: { id },
          data: { helpfulCount: { increment: 1 } },
          select: { helpfulCount: true },
        });
        return NextResponse.json({ success: true, helpfulCount: question.helpfulCount });
      } catch (dbError) {
        console.warn("[API /questions/[id]/upvote] DB error, using mock fallback");
      }
    }

    // Fallback to mock data
    const mockQuestion = mockQuestions.find((q) => q.id === id);
    if (!mockQuestion) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    mockQuestion.helpfulCount += 1;

    return NextResponse.json({ success: true, helpfulCount: mockQuestion.helpfulCount });
  } catch (error: any) {
    console.error("[API /questions/[id]/upvote POST]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
