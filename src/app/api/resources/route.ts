import { NextResponse } from "next/server";
import { MOCK_RESOURCES } from "@/lib/mock";

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
        const dbResources = await prisma.resource.findMany({
          include: {
            recommendedBy: {
              select: {
                fullName: true,
                role: true,
                avatarUrl: true,
              }
            }
          },
          orderBy: { createdAt: "desc" }
        });
        
        // Merge mock resources with DB resources, ensuring mock resources aren't fully overridden if DB is empty
        const merged = [...dbResources, ...MOCK_RESOURCES.filter(m => !dbResources.some(d => d.id === m.id))];
        
        return NextResponse.json({ resources: merged });
      } catch (dbError) {
        console.warn("[API /resources GET] Database error, using fallback");
      }
    }

    return NextResponse.json({ resources: MOCK_RESOURCES });
  } catch (error: any) {
    console.error("[API /resources GET]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
