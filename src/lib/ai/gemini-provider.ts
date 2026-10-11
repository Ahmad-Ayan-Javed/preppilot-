import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  AIProvider,
  AtsAnalysisInput,
  PrepKitInput,
  InterviewNextQuestionInput,
  InterviewFeedbackInput,
} from "./types";
import {
  AtsReportResult,
  AtsReportResultSchema,
  PrepKitResult,
  PrepKitResultSchema,
  InterviewFeedbackResult,
  InterviewFeedbackResultSchema,
} from "@/types";
import { buildAtsAnalysisPrompt } from "./prompts/ats-analysis.v1";
import { buildPrepKitPrompt } from "./prompts/prep-kit.v1";
import { buildInterviewPersonaPrompt } from "./prompts/interview-persona.v1";
import { buildInterviewFeedbackPrompt } from "./prompts/interview-feedback.v1";

function cleanJsonString(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/i, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "");
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.replace(/\s*```$/, "");
  }
  return cleaned.trim();
}

export class GeminiProvider implements AIProvider {
  name = "Google Gemini";
  private genAI: GoogleGenerativeAI;
  private modelName: string;

  constructor(apiKey: string, modelName = "gemini-1.5-flash") {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.modelName = modelName;
  }

  private getModel(jsonMode = true) {
    return this.genAI.getGenerativeModel({
      model: this.modelName,
      generationConfig: jsonMode
        ? {
            responseMimeType: "application/json",
            temperature: 0.2,
          }
        : {
            temperature: 0.7,
          },
    });
  }

  async analyzeResume(input: AtsAnalysisInput): Promise<AtsReportResult> {
    const prompt = buildAtsAnalysisPrompt({
      resumeText: input.resumeText,
      targetRole: input.targetRole,
      targetJd: input.targetJd,
      metrics: input.detectedMetrics,
    });

    const model = this.getModel(true);
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(cleanJsonString(text));
    return AtsReportResultSchema.parse(parsed);
  }

  async generatePrepKit(input: PrepKitInput): Promise<PrepKitResult> {
    const prompt = buildPrepKitPrompt(input);
    const model = this.getModel(true);
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(cleanJsonString(text));
    return PrepKitResultSchema.parse(parsed);
  }

  async generateNextInterviewQuestion(input: InterviewNextQuestionInput): Promise<{
    question: string;
    isWrapUp: boolean;
    interviewerNote?: string;
  }> {
    const prompt = buildInterviewPersonaPrompt(input);
    const model = this.getModel(true);
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(cleanJsonString(text));
    return {
      question: parsed.question,
      isWrapUp: Boolean(parsed.isWrapUp),
      interviewerNote: parsed.interviewerNote,
    };
  }

  async evaluateInterview(input: InterviewFeedbackInput): Promise<InterviewFeedbackResult> {
    const prompt = buildInterviewFeedbackPrompt(input);
    const model = this.getModel(true);
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(cleanJsonString(text));
    return InterviewFeedbackResultSchema.parse(parsed);
  }
}
