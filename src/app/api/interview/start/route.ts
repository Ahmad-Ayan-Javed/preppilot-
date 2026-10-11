import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { getAIProvider } from "@/lib/ai";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const StartInterviewSchema = z.object({
  targetRole: z.string().min(1, "Target role is required"),
  companyName: z.string().optional(),
  level: z.string().default("MID"),
  interviewType: z.string().default("TECHNICAL"),
  questionCount: z.number().min(2).max(10).default(5),
  timePerQuestion: z.number().default(180),
  resumeId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = StartInterviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid parameters", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      targetRole,
      companyName,
      level,
      interviewType,
      questionCount,
      timePerQuestion,
      resumeId,
    } = parsed.data;

    let resumeSummary: string | undefined;
    if (resumeId) {
      const resume = await prisma.resume.findUnique({ where: { id: resumeId } });
      if (resume) {
        resumeSummary = resume.rawText.slice(0, 1500);
      }
    }

    // Create session record
    const session = await prisma.interviewSession.create({
      data: {
        userId: user.id,
        resumeId: resumeId || undefined,
        companyName: companyName || undefined,
        targetRole,
        level,
        interviewType,
        questionCount,
        timePerQuestion,
        status: "IN_PROGRESS",
        startedAt: new Date(),
      },
    });

    // Generate Question #1
    const ai = getAIProvider();
    const firstQ = await ai.generateNextInterviewQuestion({
      targetRole,
      level,
      interviewType,
      currentQuestionIndex: 1,
      totalQuestions: questionCount,
      history: [],
      resumeSummary,
    });

    // Save initial message
    await prisma.interviewMessage.create({
      data: {
        sessionId: session.id,
        role: "INTERVIEWER",
        content: firstQ.question,
        questionIndex: 1,
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      firstQuestion: firstQ.question,
      questionIndex: 1,
      totalQuestions: questionCount,
      timePerQuestion,
    });
  } catch (error: any) {
    console.error("Start interview failed:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to start interview." },
      { status: 500 }
    );
  }
}
