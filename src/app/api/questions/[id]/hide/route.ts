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
    const body = await req.json();
    const { hide } = body; // true to hide, false to restore

    const prisma = getPrisma();

    if (prisma) {
      try {
        const question = await prisma.question.update({
          where: { id },
          data: { isHidden: hide },
        });
        return NextResponse.json({ success: true, question });
      } catch (dbError) {
        console.warn("[API /questions/[id]/hide] DB error, using mock fallback");
      }
    }

    // Since we're in mock mode without DB, just mutate the mock array
    const mockQuestion = mockQuestions.find((q) => q.id === id);
    if (!mockQuestion) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    (mockQuestion as any).isHidden = hide;

    return NextResponse.json({ success: true, question: mockQuestion });
  } catch (error: any) {
    console.error("[API /questions/[id]/hide POST]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
