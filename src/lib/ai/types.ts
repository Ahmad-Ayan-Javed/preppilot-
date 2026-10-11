import {
  AtsReportResult,
  PrepKitResult,
  InterviewFeedbackResult,
} from "@/types";

export interface AtsAnalysisInput {
  resumeText: string;
  targetRole?: string;
  targetJd?: string;
  detectedMetrics: {
    wordCount: number;
    bulletCount: number;
    quantifiedBulletCount: number;
    actionVerbCount: number;
  };
}

export interface PrepKitInput {
  companyName: string;
  targetRole: string;
  level: string;
  interviewType: string;
  targetJd?: string;
  resumeText?: string;
}

export interface InterviewNextQuestionInput {
  targetRole: string;
  level: string;
  interviewType: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  history: Array<{
    role: "INTERVIEWER" | "CANDIDATE";
    content: string;
  }>;
  resumeSummary?: string;
  candidateLastAnswer?: string;
}

export interface InterviewFeedbackInput {
  targetRole: string;
  level: string;
  interviewType: string;
  companyName?: string;
  questionsAndAnswers: Array<{
    questionIndex: number;
    question: string;
    answer: string;
    timeSpentSec?: number;
  }>;
}

export interface AIProvider {
  name: string;
  analyzeResume(input: AtsAnalysisInput): Promise<AtsReportResult>;
  generatePrepKit(input: PrepKitInput): Promise<PrepKitResult>;
  generateNextInterviewQuestion(input: InterviewNextQuestionInput): Promise<{
    question: string;
    isWrapUp: boolean;
    interviewerNote?: string;
  }>;
  evaluateInterview(input: InterviewFeedbackInput): Promise<InterviewFeedbackResult>;
}
