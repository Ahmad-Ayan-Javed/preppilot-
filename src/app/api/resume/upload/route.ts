import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { extractTextFromFile } from "@/lib/ats/parser";
import { detectResumeSections } from "@/lib/ats/section-detector";
import { computeHybridAtsScore } from "@/lib/ats/scoring";
import { prisma } from "@/lib/prisma";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const targetRole = (formData.get("targetRole") as string) || "";
    const targetJd = (formData.get("targetJd") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 5 MB limit. Please upload a smaller file." },
        { status: 400 }
      );
    }

    const allowedMime = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "text/plain",
    ];

    const fileName = file.name.toLowerCase();
    const isAllowedExt =
      fileName.endsWith(".pdf") ||
      fileName.endsWith(".docx") ||
      fileName.endsWith(".doc") ||
      fileName.endsWith(".txt");

    if (!isAllowedExt && !allowedMime.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF and DOCX files are supported." },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text
    const rawText = await extractTextFromFile(buffer, file.type || fileName);

    if (!rawText || rawText.trim().length < 50) {
      return NextResponse.json(
        {
          error:
            "Unable to extract readable text from this file. Please ensure it is not scanned/image-only.",
        },
        { status: 422 }
      );
    }

    // Detect structural sections
    const sections = detectResumeSections(rawText);

    // Create Resume record in DB
    const resume = await prisma.resume.create({
      data: {
        userId: user.id,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type || "application/pdf",
        rawText,
        parsedSections: JSON.stringify(sections),
        targetRole: targetRole.trim() || undefined,
        targetJd: targetJd.trim() || undefined,
      },
    });

    // Compute ATS Score immediately
    const atsReport = await computeHybridAtsScore(
      rawText,
      targetRole || undefined,
      targetJd || undefined
    );

    // Save report in DB
    const savedReport = await prisma.atsReport.create({
      data: {
        resumeId: resume.id,
        overallScore: atsReport.overallScore,
        breakdown: JSON.stringify(atsReport.breakdown),
        matchedKeywords: JSON.stringify(atsReport.matchedKeywords),
        missingKeywords: JSON.stringify(atsReport.missingKeywords),
        bulletRewrites: JSON.stringify(atsReport.bulletRewrites),
        topFixes: JSON.stringify(atsReport.topFixes),
        rawMetrics: JSON.stringify(atsReport.rawMetrics),
      },
    });

    return NextResponse.json({
      success: true,
      resumeId: resume.id,
      reportId: savedReport.id,
      report: atsReport,
    });
  } catch (error: any) {
    console.error("Resume upload failed:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process resume." },
      { status: 500 }
    );
  }
}
