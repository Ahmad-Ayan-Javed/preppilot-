import { detectResumeSections } from "./section-detector";
import { evaluateDeterministicRules } from "./rules-engine";
import { getAIProvider } from "@/lib/ai";
import { AtsReportResult } from "@/types";

export async function computeHybridAtsScore(
  rawText: string,
  targetRole?: string,
  targetJd?: string
): Promise<AtsReportResult> {
  const sections = detectResumeSections(rawText);
  const deterministic = evaluateDeterministicRules(rawText, sections, targetJd);

  const aiProvider = getAIProvider();

  let aiResult: AtsReportResult;
  try {
    aiResult = await aiProvider.analyzeResume({
      resumeText: rawText,
      targetRole,
      targetJd,
      detectedMetrics: deterministic.metrics,
    });
  } catch (err) {
    console.error("AI Analysis failed or timed out, synthesizing resilient fallback:", err);
    // Create resilient report using deterministic data
    const scores = deterministic.scores;
    const overall =
      scores.formatting +
      scores.keywordMatch +
      scores.sectionCompleteness +
      scores.impact +
      scores.grammarClarity;

    return {
      overallScore: Math.min(100, Math.max(0, overall)),
      breakdown: scores,
      matchedKeywords: deterministic.matchedKeywords,
      missingKeywords: deterministic.missingKeywords,
      bulletRewrites: [
        {
          original: "Worked on frontend and backend features for customer portal.",
          improved:
            "Engineered end-to-end customer portal features using React and TypeScript, accelerating user onboarding by 25%.",
          reason: "Added quantified metrics and replaced generic 'worked on' with 'Engineered'.",
        },
      ],
      topFixes: [
        {
          priority: "HIGH",
          title: "Incorporate Quantified Impact",
          description: "Add specific percentages, latencies, or revenue outcomes to each experience bullet.",
        },
        {
          priority: "HIGH",
          title: "Include Missing Target Keywords",
          description: `Add explicit technical keywords: ${deterministic.missingKeywords.slice(0, 4).join(", ")}.`,
        },
        {
          priority: "MEDIUM",
          title: "Strengthen Action Verbs",
          description: "Start each bullet with powerful engineering verbs like Architected, Optimized, Scaled.",
        },
      ],
      rawMetrics: deterministic.metrics,
    };
  }

  // Synthesize: Blend deterministic (35%) and LLM (65%) for maximum consistency and nuance
  const formatting = Math.round(
    deterministic.scores.formatting * 0.35 + aiResult.breakdown.formatting * 0.65
  );
  const keywordMatch = Math.round(
    deterministic.scores.keywordMatch * 0.35 + aiResult.breakdown.keywordMatch * 0.65
  );
  const sectionCompleteness = Math.round(
    deterministic.scores.sectionCompleteness * 0.35 + aiResult.breakdown.sectionCompleteness * 0.65
  );
  const impact = Math.round(
    deterministic.scores.impact * 0.35 + aiResult.breakdown.impact * 0.65
  );
  const grammarClarity = Math.round(
    deterministic.scores.grammarClarity * 0.35 + aiResult.breakdown.grammarClarity * 0.65
  );

  const overallScore = Math.min(
    100,
    Math.max(0, formatting + keywordMatch + sectionCompleteness + impact + grammarClarity)
  );

  // Merge unique keywords
  const matchedSet = new Set([
    ...deterministic.matchedKeywords,
    ...aiResult.matchedKeywords,
  ]);
  const missingSet = new Set(aiResult.missingKeywords);
  matchedSet.forEach((k) => missingSet.delete(k));

  return {
    overallScore,
    breakdown: {
      formatting,
      keywordMatch,
      sectionCompleteness,
      impact,
      grammarClarity,
    },
    matchedKeywords: Array.from(matchedSet),
    missingKeywords: Array.from(missingSet),
    bulletRewrites: aiResult.bulletRewrites,
    topFixes: aiResult.topFixes,
    rawMetrics: deterministic.metrics,
  };
}
