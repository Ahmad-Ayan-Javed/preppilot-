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

    const kit = await prisma.prepKit.findUnique({
      where: { id: params.id },
    });

    if (!kit) {
      return NextResponse.json({ error: "Prep kit not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: kit.id,
      companyName: kit.companyName,
      targetRole: kit.targetRole,
      level: kit.level,
      interviewType: kit.interviewType,
      targetJd: kit.targetJd,
      companyOverview: safeJsonParse(kit.companyOverview, {}),
      interviewRounds: safeJsonParse(kit.interviewRounds, []),
      questionBank: safeJsonParse(kit.questionBank, []),
      skillGaps: safeJsonParse(kit.skillGaps, []),
      revisionTopics: safeJsonParse(kit.revisionTopics, []),
      createdAt: kit.createdAt,
    });
  } catch (error: any) {
    console.error("Failed to load prep kit:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to load prep kit" },
      { status: 500 }
    );
  }
}
