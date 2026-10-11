import { z } from "zod";

// --- ATS & Resume Schemas ---

export const AtsBreakdownSchema = z.object({
  formatting: z.number().min(0).max(20),
  keywordMatch: z.number().min(0).max(30),
  sectionCompleteness: z.number().min(0).max(15),
  impact: z.number().min(0).max(20),
  grammarClarity: z.number().min(0).max(15),
});

export const BulletRewriteSchema = z.object({
  original: z.string(),
  improved: z.string(),
  reason: z.string(),
});

export const TopFixSchema = z.object({
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]),
  title: z.string(),
  description: z.string(),
});

export const AtsReportResultSchema = z.object({
  overallScore: z.number().min(0).max(100),
  breakdown: AtsBreakdownSchema,
  matchedKeywords: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  bulletRewrites: z.array(BulletRewriteSchema),
  topFixes: z.array(TopFixSchema),
  rawMetrics: z.object({
    wordCount: z.number(),
    bulletCount: z.number(),
    quantifiedBulletCount: z.number(),
    actionVerbCount: z.number(),
  }),
});

export type AtsReportResult = z.infer<typeof AtsReportResultSchema>;

export const ResumeParsedSectionsSchema = z.object({
  contact: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
  }),
  summary: z.string().optional(),
  skills: z.array(z.string()),
  experience: z.array(
    z.object({
      company: z.string().optional(),
      role: z.string().optional(),
      period: z.string().optional(),
      bullets: z.array(z.string()).optional(),
    })
  ),
  education: z.array(
    z.object({
      institution: z.string().optional(),
      degree: z.string().optional(),
      year: z.string().optional(),
    })
  ),
  projects: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
});

export type ResumeParsedSections = z.infer<typeof ResumeParsedSectionsSchema>;

// --- Company Prep Kit Schemas ---

export const PrepKitRoundSchema = z.object({
  roundName: z.string(),
  focus: z.string(),
  typicalDuration: z.string(),
  expectations: z.string().optional(),
});

export const PrepKitQuestionSchema = z.object({
  category: z.string(),
  question: z.string(),
  tip: z.string(),
  samplePoints: z.array(z.string()).optional(),
});

export const SkillGapSchema = z.object({
  skill: z.string(),
  importance: z.enum(["CRITICAL", "RECOMMENDED", "NICE_TO_HAVE"]).optional(),
  recommendation: z.string(),
  studyLinks: z.array(z.string()).optional(),
});

export const RevisionTopicSchema = z.object({
  topic: z.string(),
  keyConcepts: z.array(z.string()),
  subtopics: z.array(z.string()).optional(),
});

export const PrepKitResultSchema = z.object({
  companyOverview: z.object({
    culture: z.string(),
    values: z.array(z.string()),
    businessModel: z.string(),
    recentDevelopments: z.string().optional(),
  }),
  interviewRounds: z.array(PrepKitRoundSchema),
  questionBank: z.array(PrepKitQuestionSchema),
  skillGaps: z.array(SkillGapSchema),
  revisionTopics: z.array(RevisionTopicSchema),
});

export type PrepKitResult = z.infer<typeof PrepKitResultSchema>;

// --- Mock Interview Schemas ---

export const InterviewRubricsSchema = z.object({
  starMethod: z.number().min(0).max(100),
  technicalAccuracy: z.number().min(0).max(100),
  clarity: z.number().min(0).max(100),
  confidence: z.number().min(0).max(100),
  relevance: z.number().min(0).max(100),
});

export const QuestionEvaluationSchema = z.object({
  questionIndex: z.number(),
  question: z.string(),
  answer: z.string(),
  score: z.number().min(0).max(100),
  rubricScores: z.record(z.string(), z.number()),
  feedback: z.string(),
  idealAnswer: z.string(),
});

export const InterviewFeedbackResultSchema = z.object({
  overallScore: z.number().min(0).max(100),
  summary: z.string(),
  rubrics: InterviewRubricsSchema,
  questionEvaluations: z.array(QuestionEvaluationSchema),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  actionableTips: z.array(z.string()),
});

export type InterviewFeedbackResult = z.infer<typeof InterviewFeedbackResultSchema>;
