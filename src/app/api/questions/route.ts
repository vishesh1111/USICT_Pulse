import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST — Junior asks a question
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, body: questionBody, tags, anonymous, authorEmail } = body;

    // Find author by email (optional — anonymous questions can skip)
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

    // Fetch all senior emails for notification
    const seniors = await prisma.user.findMany({
      where: { role: "SENIOR" },
      select: { email: true, fullName: true },
    });

    return NextResponse.json({
      question,
      seniorEmails: seniors.map((s) => ({ email: s.email, name: s.fullName })),
    });
  } catch (error: any) {
    console.error("[API /questions POST]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET — Fetch all questions with answers
export async function GET() {
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
  } catch (error: any) {
    console.error("[API /questions GET]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
