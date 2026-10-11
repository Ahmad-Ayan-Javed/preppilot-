import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { getAIProvider } from "@/lib/ai";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const PrepKitInputSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  targetRole: z.string().min(1, "Target role is required"),
  level: z.string().default("MID"),
  interviewType: z.string().default("TECHNICAL"),
  targetJd: z.string().optional(),
  resumeId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = PrepKitInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid parameters", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { companyName, targetRole, level, interviewType, targetJd, resumeId } =
      parsed.data;

    let resumeText: string | undefined;
    if (resumeId) {
      const resume = await prisma.resume.findUnique({
        where: { id: resumeId },
      });
      if (resume) {
        resumeText = resume.rawText;
      }
    }

    const ai = getAIProvider();
    const kit = await ai.generatePrepKit({
      companyName,
      targetRole,
      level,
      interviewType,
      targetJd,
      resumeText,
    });

    const saved = await prisma.prepKit.create({
      data: {
        userId: user.id,
        companyName,
        targetRole,
        level,
        interviewType,
        targetJd,
        companyOverview: JSON.stringify(kit.companyOverview),
        interviewRounds: JSON.stringify(kit.interviewRounds),
        questionBank: JSON.stringify(kit.questionBank),
        skillGaps: JSON.stringify(kit.skillGaps),
        revisionTopics: JSON.stringify(kit.revisionTopics),
      },
    });

    return NextResponse.json({
      success: true,
      id: saved.id,
      kit,
    });
  } catch (error: any) {
    console.error("Prep kit generation failed:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate prep kit." },
      { status: 500 }
    );
  }
}
