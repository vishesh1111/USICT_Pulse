import { NextResponse } from "next/server";
import { MOCK_OPPORTUNITIES } from "@/lib/mock";
import { OpportunityType } from "@prisma/client";

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

export async function GET() {
  try {
    const prisma = getPrisma();
    if (prisma) {
      try {
        const dbOpportunities = await prisma.opportunity.findMany({
          include: {
            author: {
              select: {
                fullName: true,
                role: true,
                avatarUrl: true,
              }
            }
          },
          orderBy: { createdAt: "desc" }
        });
        
        // Merge mock opportunities with DB opportunities, ensuring mock aren't fully overridden if DB is empty
        const merged = [...dbOpportunities, ...MOCK_OPPORTUNITIES.filter((m: any) => !dbOpportunities.some((d: any) => d.id === m.id))];
        
        return NextResponse.json({ opportunities: merged });
      } catch (dbError) {
        console.warn("[API /opportunities GET] Database error, using fallback");
      }
    }

    return NextResponse.json({ opportunities: MOCK_OPPORTUNITIES });
  } catch (error: any) {
    console.error("[API /opportunities GET]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("[API /opportunities POST] Received body:", body);
    const { title, type, organization, description, applyUrl, deadline, stipend, location, authorEmail } = body;

    const prisma = getPrisma();

    if (prisma) {
      try {
        console.log(`[API /opportunities POST] Looking up user with email: ${authorEmail}`);
        const author = await prisma.user.findUnique({
          where: { email: authorEmail },
        });

        if (!author) {
          return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (author.role !== "SENIOR") {
          return NextResponse.json({ error: "Only seniors can post opportunities" }, { status: 403 });
        }

        const opportunity = await prisma.opportunity.create({
          data: {
            title,
            type: type as OpportunityType,
            organization,
            description,
            applyUrl,
            deadline: deadline ? new Date(deadline) : null,
            stipend,
            location,
            authorId: author.id,
          },
          include: {
            author: {
              select: {
                fullName: true,
                role: true,
                avatarUrl: true,
              },
            },
          },
        });

        return NextResponse.json({ opportunity });
      } catch (dbError) {
        console.warn("[API /opportunities POST] Database error:", dbError);
        return NextResponse.json({ error: "Failed to create opportunity in database" }, { status: 500 });
      }
    }

    return NextResponse.json({ error: "Database not connected" }, { status: 500 });
  } catch (error: any) {
    console.error("[API /opportunities POST]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
