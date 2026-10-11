import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Cascade clean all user resumes, interviews, prep kits
    await prisma.$transaction([
      prisma.interviewFeedback.deleteMany({
        where: { session: { userId: user.id } },
      }),
      prisma.interviewMessage.deleteMany({
        where: { session: { userId: user.id } },
      }),
      prisma.interviewSession.deleteMany({
        where: { userId: user.id },
      }),
      prisma.atsReport.deleteMany({
        where: { resume: { userId: user.id } },
      }),
      prisma.resume.deleteMany({
        where: { userId: user.id },
      }),
      prisma.prepKit.deleteMany({
        where: { userId: user.id },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "All personal resumes, interview transcripts, and prep kits have been permanently erased.",
    });
  } catch (error: any) {
    console.error("Delete data failed:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to erase data" },
      { status: 500 }
    );
  }
}
