import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { safeJsonParse } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(
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
        feedback: true,
        messages: { orderBy: { createdAt: "asc" } },
      },
    });

    if (!session) {
      return NextResponse.json({ error: "Interview session not found" }, { status: 404 });
    }

    if (!session.feedback) {
      return NextResponse.json({
        sessionId: session.id,
        status: session.status,
        targetRole: session.targetRole,
        companyName: session.companyName,
        feedback: null,
      });
    }

    const fb = session.feedback;

    return NextResponse.json({
      sessionId: session.id,
      targetRole: session.targetRole,
      companyName: session.companyName,
      interviewType: session.interviewType,
      level: session.level,
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      feedback: {
        id: fb.id,
        overallScore: fb.overallScore,
        summary: fb.summary,
        rubrics: safeJsonParse(fb.rubrics, {}),
        questionEvaluations: safeJsonParse(fb.questionEvaluations, []),
        strengths: safeJsonParse(fb.strengths, []),
        weaknesses: safeJsonParse(fb.weaknesses, []),
        actionableTips: safeJsonParse(fb.actionableTips, []),
        createdAt: fb.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Failed to load interview feedback:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to load report" },
      { status: 500 }
    );
  }
}
