import { DetectedSections } from "./section-detector";

export const ACTION_VERBS = new Set([
  "architected", "spearheaded", "engineered", "designed", "implemented", "deployed",
  "optimized", "accelerated", "reduced", "scaled", "boosted", "built", "authored",
  "orchestrated", "automated", "refactored", "migrated", "mentored", "standardized",
  "delivered", "launched", "integrated", "transformed", "pioneered", "championed",
  "streamlined", "formulated", "established", "headed", "modernized", "doubled",
  "tripled", "diminished", "maximized", "minimized", "supervised", "directed"
]);

export const STANDARD_TECH_KEYWORDS = [
  "react", "next.js", "typescript", "javascript", "node.js", "python", "golang",
  "java", "c++", "c#", "rust", "sql", "postgresql", "mysql", "mongodb", "redis",
  "graphql", "rest api", "docker", "kubernetes", "aws", "gcp", "azure", "terraform",
  "ci/cd", "github actions", "microservices", "system design", "distributed systems",
  "kafka", "rabbitmq", "tailwind css", "jest", "playwright", "cypress", "webpack",
  "vite", "git", "linux", "html5", "css3", "redux", "zustand", "prisma", "dynamodb"
];

export interface DeterministicMetrics {
  wordCount: number;
  bulletCount: number;
  quantifiedBulletCount: number;
  actionVerbCount: number;
}

export function extractDeterministicMetrics(rawText: string): DeterministicMetrics {
  const words = rawText
    .split(/\s+/)
    .map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, ""))
    .filter(Boolean);

  const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const bulletLines = lines.filter((l) => /^[-*•·–—]\s+|^\d+\.\s+/.test(l));

  // Regex for quantifiable metrics: percentages, dollar values, multipliers, large numbers
  const metricRegex = /(?:\d+(?:\.\d+)?%|\$\d+(?:\.\d+)?(?:k|m|b)?|\d+x|\b\d{2,}\b|\breduced by\b|\bincreased by\b)/i;

  let quantifiedBulletCount = 0;
  for (const b of bulletLines) {
    if (metricRegex.test(b)) {
      quantifiedBulletCount++;
    }
  }

  // Count action verbs in initial tokens of lines/bullets
  let actionVerbCount = 0;
  for (const b of bulletLines) {
    const firstWord = b
      .replace(/^[-*•·–—\d.]+\s*/, "")
      .trim()
      .split(/\s+/)[0]
      ?.toLowerCase();
    if (firstWord && ACTION_VERBS.has(firstWord)) {
      actionVerbCount++;
    }
  }

  return {
    wordCount: words.length,
    bulletCount: Math.max(bulletLines.length, 1),
    quantifiedBulletCount,
    actionVerbCount,
  };
}

export function extractKeywordsFromText(text: string): Set<string> {
  const lower = text.toLowerCase();
  const matched = new Set<string>();

  for (const kw of STANDARD_TECH_KEYWORDS) {
    // Check whole word boundary
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(?:^|\\W)${escaped}(?:$|\\W)`, "i");
    if (regex.test(lower)) {
      matched.add(kw);
    }
  }

  return matched;
}

export function evaluateDeterministicRules(
  rawText: string,
  sections: DetectedSections,
  targetJd?: string
) {
  const metrics = extractDeterministicMetrics(rawText);

  // 1. Formatting & Parseability (Max 20)
  // Optimal resume length: 450 - 1000 words. Clean sections.
  let formattingScore = 14;
  if (metrics.wordCount >= 400 && metrics.wordCount <= 1100) formattingScore += 4;
  else if (metrics.wordCount >= 250 && metrics.wordCount < 1500) formattingScore += 2;
  if (sections.contact.email && sections.contact.phone) formattingScore += 2;
  formattingScore = Math.min(20, formattingScore);

  // 2. Section Completeness (Max 15)
  let completenessScore = 3; // base
  if (sections.contact.email) completenessScore += 2;
  if (sections.contact.linkedin || sections.contact.github) completenessScore += 2;
  if (sections.experience.length > 0) completenessScore += 3;
  if (sections.education.length > 0) completenessScore += 2;
  if (sections.skills.length > 0) completenessScore += 3;
  completenessScore = Math.min(15, completenessScore);

  // 3. Impact & Quantification (Max 20)
  const quantRatio = metrics.quantifiedBulletCount / metrics.bulletCount;
  let impactScore = Math.round(quantRatio * 15) + (metrics.actionVerbCount > 3 ? 5 : 2);
  impactScore = Math.min(20, Math.max(5, impactScore));

  // 4. Grammar, Clarity, Action Verbs (Max 15)
  const actionRatio = metrics.actionVerbCount / metrics.bulletCount;
  let clarityScore = Math.round(actionRatio * 10) + 4;
  clarityScore = Math.min(15, Math.max(5, clarityScore));

  // 5. Keyword Match (Max 30)
  const resumeKws = extractKeywordsFromText(rawText);
  let matchedKeywords: string[] = [];
  let missingKeywords: string[] = [];

  if (targetJd && targetJd.trim().length > 20) {
    const jdKws = extractKeywordsFromText(targetJd);
    matchedKeywords = Array.from(jdKws).filter((k) => resumeKws.has(k));
    missingKeywords = Array.from(jdKws).filter((k) => !resumeKws.has(k));
  } else {
    // Default against standard top tech keywords
    matchedKeywords = Array.from(resumeKws);
    const standardSet = new Set(STANDARD_TECH_KEYWORDS.slice(0, 15));
    missingKeywords = Array.from(standardSet).filter((k) => !resumeKws.has(k)).slice(0, 5);
  }

  const keywordMatchRatio =
    matchedKeywords.length + missingKeywords.length > 0
      ? matchedKeywords.length / (matchedKeywords.length + missingKeywords.length)
      : 0.6;
  const keywordScore = Math.min(30, Math.max(8, Math.round(keywordMatchRatio * 30)));

  return {
    metrics,
    scores: {
      formatting: formattingScore,
      keywordMatch: keywordScore,
      sectionCompleteness: completenessScore,
      impact: impactScore,
      grammarClarity: clarityScore,
    },
    matchedKeywords,
    missingKeywords,
  };
}
