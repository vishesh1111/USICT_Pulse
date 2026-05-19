import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST — Senior answers a question
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: questionId } = await params;
    const body = await req.json();
    const { body: answerBody, authorEmail } = body;

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
  } catch (error: any) {
    console.error("[API /questions/[id]/answers POST]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
