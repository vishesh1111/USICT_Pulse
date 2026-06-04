import { NextResponse } from "next/server";
import { MOCK_TEACHERS } from "@/lib/mock";
import { Branch } from "@prisma/client";

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
        // Auto-seed if empty
        const count = await prisma.teacher.count();
        if (count === 0) {
          console.log("[API /teachers] DB is empty. Seeding teachers...");
          for (const teacher of MOCK_TEACHERS) {
            await prisma.teacher.create({
              data: {
                id: teacher.id,
                name: teacher.name,
                branch: teacher.branch as Branch,
                subjects: teacher.subjects,
                designation: teacher.designation,
                photoUrl: teacher.photoUrl,
                bio: teacher.bio,
                yearTaught: teacher.yearTaught,
              }
            });
            
            // Optionally seed their mock reviews too? Let's skip mock reviews 
            // since we want real ones tied to real users.
          }
          console.log("[API /teachers] Seed complete!");
        }

        const teachers = await prisma.teacher.findMany({
          include: {
            reviews: {
              include: {
                author: {
                  select: {
                    fullName: true,
                    role: true,
                    branch: true,
                    year: true,
                  }
                }
              },
              orderBy: { createdAt: "desc" }
            }
          },
          orderBy: { name: "asc" }
        });

        // Format for frontend mapping
        const formattedTeachers = teachers.map((t: any) => {
          let rating = 0;
          if (t.reviews.length > 0) {
            rating = t.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / t.reviews.length;
          }
          return {
            ...t,
            rating: Number(rating.toFixed(1)),
            reviewsCount: t.reviews.length,
          };
        });

        return NextResponse.json({ teachers: formattedTeachers });
      } catch (dbError) {
        console.warn("[API /teachers GET] DB error, falling back to mock:", dbError);
      }
    }
    
    // Fallback to mock
    return NextResponse.json({ teachers: MOCK_TEACHERS });
  } catch (error: any) {
    console.error("[API /teachers GET]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
