import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { MOCK_OPPORTUNITIES } from "@/lib/mock/opportunities";
import { MOCK_RESOURCES } from "@/lib/mock/resources";
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

// Set maximum duration for serverless function (10s for Hobby, 60s for Pro)
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages, userProfile } = await req.json();

    // 1. Fetch live DB context or fallback to mock
    let questions: any[] = [];
    const prisma = getPrisma();
    
    if (prisma) {
      try {
        questions = await prisma.question.findMany({
          include: {
            author: { select: { fullName: true, role: true } },
            answers: { include: { author: { select: { fullName: true, role: true } } } }
          },
          take: 15,
          orderBy: { createdAt: 'desc' }
        });
      } catch (dbError) {
        console.warn("[API /chat] Database error, using mock questions");
      }
    }
    
    if (questions.length === 0) {
      questions = mockQuestions;
    }

    const dbContext = questions.map(q => `
Question by ${q.author?.fullName ?? 'Anonymous'}: ${q.title}
${q.body}
Answers:
${q.answers.map((a: any) => `- ${a.author?.fullName ?? 'Anonymous'} (${a.author?.role ?? 'unknown'}): ${a.body}`).join('\n')}
    `).join('\n\n');

    // 2. Format static data
    const oppsContext = MOCK_OPPORTUNITIES.map(o => 
      `- ${o.title} at ${o.organization} (${o.type}). Eligibility: ${o.eligibility}. Apply: ${o.applyUrl}`
    ).join('\n');

    const resContext = MOCK_RESOURCES.map(r =>
      `- ${r.title} (${r.subject}). Recommended by ${r.recommendedBy}. Link: ${r.link}`
    ).join('\n');

    // 3. Build System Prompt
    const systemPrompt = `
You are the USICT PULSE AI Assistant, designed to help students of USICT, GGSIPU.
Your goal is to answer questions using ONLY the context provided below. If the answer is not in the context, politely say you don't have that specific information but offer related advice. Do not hallucinate.

User Profile:
Name: ${userProfile?.fullName || 'Guest'}
Role: ${userProfile?.role || 'student'}
Branch: ${userProfile?.branch || 'Unknown'}
Year: ${userProfile?.year || 'Unknown'}
Interests: ${userProfile?.interests?.join(', ') || 'None'}

---
KNOWLEDGE BASE:

1. RECENT Q&A FROM SENIORS:
${dbContext}

2. CURRENT OPPORTUNITIES (Internships, Scholarships):
${oppsContext}

3. LEARNING RESOURCES:
${resContext}
---

Be concise, friendly, and use markdown formatting (bolding, lists) to make answers readable.
If the user asks for opportunities, match their branch/year if possible based on the opportunity eligibility.
Address the user by name occasionally.
    `;

    // 4. Generate & Stream
    const result = await streamText({
      model: google('gemini-2.5-flash'),
      system: systemPrompt,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to process chat" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
