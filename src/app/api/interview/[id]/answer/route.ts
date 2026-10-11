import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { getAIProvider } from "@/lib/ai";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const AnswerSchema = z.object({
  answer: z.string().min(1, "Answer cannot be empty"),
  questionIndex: z.number().min(1),
  timeSpentSec: z.number().default(0),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionId = params.id;
    const session = await prisma.interviewSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
        resume: true,
      },
    });

    if (!session) {
      return NextResponse.json({ error: "Interview session not found" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = AnswerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { answer, questionIndex, timeSpentSec } = parsed.data;

    // Save candidate's response
    await prisma.interviewMessage.create({
      data: {
        sessionId: session.id,
        role: "CANDIDATE",
        content: answer,
        questionIndex,
        timeSpentSec,
      },
    });

    // Check if this was the final question
    if (questionIndex >= session.questionCount) {
      return NextResponse.json({
        success: true,
        isCompleted: true,
        message: "You have completed all questions in this session. Ready for evaluation!",
      });
    }

    // Generate next question
    const nextQuestionIndex = questionIndex + 1;
    const history = session.messages.map((m) => ({
      role: m.role as "INTERVIEWER" | "CANDIDATE",
      content: m.content,
    }));
    // include current candidate answer
    history.push({ role: "CANDIDATE", content: answer });

    const ai = getAIProvider();
    const nextQ = await ai.generateNextInterviewQuestion({
      targetRole: session.targetRole,
      level: session.level,
      interviewType: session.interviewType,
      currentQuestionIndex: nextQuestionIndex,
      totalQuestions: session.questionCount,
      history,
      resumeSummary: session.resume?.rawText?.slice(0, 1000),
      candidateLastAnswer: answer,
    });

    // Save next interviewer question
    await prisma.interviewMessage.create({
      data: {
        sessionId: session.id,
        role: "INTERVIEWER",
        content: nextQ.question,
        questionIndex: nextQuestionIndex,
      },
    });

    return NextResponse.json({
      success: true,
      isCompleted: false,
      nextQuestion: nextQ.question,
      questionIndex: nextQuestionIndex,
      totalQuestions: session.questionCount,
      interviewerNote: nextQ.interviewerNote,
    });
  } catch (error: any) {
    console.error("Submit answer failed:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to submit answer." },
      { status: 500 }
    );
  }
}
