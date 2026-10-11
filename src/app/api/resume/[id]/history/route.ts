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

    const resumeId = params.id;
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
      include: {
        reports: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    const formattedReports = resume.reports.map((r) => ({
      id: r.id,
      overallScore: r.overallScore,
      breakdown: safeJsonParse(r.breakdown, {}),
      matchedKeywords: safeJsonParse<string[]>(r.matchedKeywords, []),
      missingKeywords: safeJsonParse<string[]>(r.missingKeywords, []),
      bulletRewrites: safeJsonParse(r.bulletRewrites, []),
      topFixes: safeJsonParse(r.topFixes, []),
      rawMetrics: safeJsonParse(r.rawMetrics, {}),
      createdAt: r.createdAt,
    }));

    return NextResponse.json({
      resume: {
        id: resume.id,
        fileName: resume.fileName,
        version: resume.version,
        targetRole: resume.targetRole,
        targetJd: resume.targetJd,
        createdAt: resume.createdAt,
      },
      reports: formattedReports,
    });
  } catch (error: any) {
    console.error("Failed to fetch resume history:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch history" },
      { status: 500 }
    );
  }
}
