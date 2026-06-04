import { NextResponse } from "next/server";

function getPrisma() {
  try {
    if (!process.env.DATABASE_URL) return null;
    const { prisma } = require("@/lib/prisma");
    return prisma;
  } catch {
    return null;
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Await params for Next.js 15
    const { id } = await params;
    
    const body = await req.json();
    const { authorEmail, rating, teachingNature, internalsTrend, difficulty, behaviorNote, reviewText, anonymous } = body;

    const prisma = getPrisma();

    if (prisma) {
      try {
        const author = await prisma.user.findUnique({
          where: { email: authorEmail },
        });

        if (!author) {
          return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (author.role !== "SENIOR" && author.role !== "ALUMNI") {
          return NextResponse.json({ error: "Only seniors and alumni can post teacher reviews" }, { status: 403 });
        }

        // Check if teacher exists
        const teacher = await prisma.teacher.findUnique({
          where: { id },
        });

        if (!teacher) {
          return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
        }

        const review = await prisma.teacherReview.create({
          data: {
            teacherId: id,
            authorId: author.id,
            rating: Number(rating),
            teachingNature,
            internalsTrend,
            difficulty,
            behaviorNote,
            reviewText,
            anonymous: anonymous || false,
          },
          include: {
            author: {
              select: {
                fullName: true,
                role: true,
                branch: true,
                year: true,
              }
            }
          }
        });

        return NextResponse.json({ review });
      } catch (dbError) {
        console.warn("[API /teachers/[id]/reviews POST] Database error:", dbError);
        return NextResponse.json({ error: "Failed to post review" }, { status: 500 });
      }
    }

    return NextResponse.json({ error: "Database not connected" }, { status: 500 });
  } catch (error: any) {
    console.error("[API /teachers/[id]/reviews POST]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
