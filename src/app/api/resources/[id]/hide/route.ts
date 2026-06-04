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

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;
    const body = await req.json();
    const { hide } = body; // true to hide, false to restore

    const prisma = getPrisma();

    if (prisma) {
      try {
        const resource = await prisma.resource.update({
          where: { id },
          data: { isHidden: hide },
        });
        return NextResponse.json({ success: true, resource });
      } catch (dbError) {
        console.warn("[API /resources/[id]/hide] DB error, using mock fallback");
      }
    }

    const mockResource = MOCK_RESOURCES.find((r) => r.id === id);
    if (!mockResource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    (mockResource as any).isHidden = hide;

    return NextResponse.json({ success: true, resource: mockResource });
  } catch (error: any) {
    console.error("[API /resources/[id]/hide POST]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
