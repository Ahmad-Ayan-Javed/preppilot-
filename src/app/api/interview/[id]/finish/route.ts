import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { getAIProvider } from "@/lib/ai";
import { prisma } from "@/lib/prisma";

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
        feedback: true,
      },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Pair up questions and answers
    const questionsAndAnswers: Array<{
      questionIndex: number;
      question: string;
      answer: string;
      timeSpentSec?: number;
    }> = [];

    const messages = session.messages;
    for (let i = 0; i < messages.length; i++) {
      if (messages[i].role === "INTERVIEWER") {
        const qIndex = messages[i].questionIndex || 1;
        const correspondingAnswer = messages.find(
          (m) => m.role === "CANDIDATE" && m.questionIndex === qIndex
        );

        questionsAndAnswers.push({
          questionIndex: qIndex,
          question: messages[i].content,
          answer: correspondingAnswer?.content || "(Skipped or unrecorded answer)",
          timeSpentSec: correspondingAnswer?.timeSpentSec || 120,
        });
      }
    }

    const ai = getAIProvider();
    const evaluation = await ai.evaluateInterview({
      targetRole: session.targetRole,
      level: session.level,
      interviewType: session.interviewType,
      companyName: session.companyName || undefined,
      questionsAndAnswers,
    });

    // Mark session completed
    await prisma.interviewSession.update({
      where: { id: sessionId },
      data: {
        status: "COMPLETED",
        endedAt: new Date(),
      },
    });

    // Save or update feedback
    const feedback = await prisma.interviewFeedback.upsert({
      where: { sessionId: session.id },
      create: {
        sessionId: session.id,
        overallScore: evaluation.overallScore,
        summary: evaluation.summary,
        rubrics: JSON.stringify(evaluation.rubrics),
        questionEvaluations: JSON.stringify(evaluation.questionEvaluations),
        strengths: JSON.stringify(evaluation.strengths),
        weaknesses: JSON.stringify(evaluation.weaknesses),
        actionableTips: JSON.stringify(evaluation.actionableTips),
      },
      update: {
        overallScore: evaluation.overallScore,
        summary: evaluation.summary,
        rubrics: JSON.stringify(evaluation.rubrics),
        questionEvaluations: JSON.stringify(evaluation.questionEvaluations),
        strengths: JSON.stringify(evaluation.strengths),
        weaknesses: JSON.stringify(evaluation.weaknesses),
        actionableTips: JSON.stringify(evaluation.actionableTips),
      },
    });

    return NextResponse.json({
      success: true,
      feedbackId: feedback.id,
      feedback: evaluation,
    });
  } catch (error: any) {
    console.error("Finish interview failed:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate interview report." },
      { status: 500 }
    );
  }
}
