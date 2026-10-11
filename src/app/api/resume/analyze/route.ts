import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { computeHybridAtsScore } from "@/lib/ats/scoring";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const AnalyzeInputSchema = z.object({
  resumeId: z.string().optional(),
  resumeText: z.string().optional(),
  targetRole: z.string().optional(),
  targetJd: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = AnalyzeInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { resumeId, resumeText, targetRole, targetJd } = parsed.data;

    let textToAnalyze = resumeText || "";
    let targetResumeId = resumeId;

    if (resumeId) {
      const existing = await prisma.resume.findUnique({
        where: { id: resumeId },
      });
      if (!existing) {
        return NextResponse.json({ error: "Resume not found" }, { status: 404 });
      }
      textToAnalyze = existing.rawText;
      targetResumeId = existing.id;
    }

    if (!textToAnalyze || textToAnalyze.trim().length < 50) {
      return NextResponse.json(
        { error: "Insufficient text provided for resume analysis." },
        { status: 400 }
      );
    }

    const report = await computeHybridAtsScore(
      textToAnalyze,
      targetRole,
      targetJd
    );

    // If attached to a saved resume, persist report
    if (targetResumeId) {
      await prisma.atsReport.create({
        data: {
          resumeId: targetResumeId,
          overallScore: report.overallScore,
          breakdown: JSON.stringify(report.breakdown),
          matchedKeywords: JSON.stringify(report.matchedKeywords),
          missingKeywords: JSON.stringify(report.missingKeywords),
          bulletRewrites: JSON.stringify(report.bulletRewrites),
          topFixes: JSON.stringify(report.topFixes),
          rawMetrics: JSON.stringify(report.rawMetrics),
        },
      });
    }

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error: any) {
    console.error("Analysis failed:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to analyze resume." },
      { status: 500 }
    );
  }
}
