"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Sparkles,
  Award,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileText,
  Briefcase,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Zap,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function InterviewFeedbackReportPage() {
  const params = useParams();
  const sessionId = params?.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(0);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (!sessionId) return;

    fetch(`/api/interview/${sessionId}/feedback`)
      .then((res) => {
        if (!res.ok) throw new Error("Feedback report not found");
        return res.json();
      })
      .then((result) => {
        if (!result.feedback) {
          // Trigger finish generation
          return fetch(`/api/interview/${sessionId}/finish`, { method: "POST" })
            .then((r) => r.json())
            .then((fData) => {
              setData({ ...result, feedback: fData.feedback });
              setLoading(false);
            });
        }
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [sessionId]);

  const handleExportPdf = () => {
    setIsExporting(true);
    // Client-side print-to-PDF standard
    setTimeout(() => {
      window.print();
      setIsExporting(false);
    }, 300);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center animate-spin mb-4">
          <RefreshCw className="h-6 w-6" />
        </div>
        <div className="text-sm font-semibold">Synthesizing Bar-Raiser Feedback...</div>
        <div className="text-xs text-muted-foreground mt-1">
          Evaluating STAR method structure, technical accuracy, and ideal answers
        </div>
      </div>
    );
  }

  if (error || !data || !data.feedback) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <AlertTriangle className="h-10 w-10 text-destructive mb-3" />
        <h2 className="text-lg font-bold">Feedback Report Not Found</h2>
        <p className="text-xs text-muted-foreground mt-1 mb-4">{error}</p>
        <Link href="/dashboard" className="px-4 py-2 rounded-xl bg-primary text-xs font-semibold">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const { feedback, targetRole, companyName } = data;
  const rubrics = feedback.rubrics || {};

  return (
    <div className="container max-w-5xl mx-auto px-4 py-10 flex-1 space-y-8 print:p-0">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm print:border-none print:shadow-none">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary">
            <Award className="h-4 w-4" />
            <span>Mock Interview Evaluation</span>
            {companyName && (
              <>
                <span>•</span>
                <span className="text-muted-foreground">{companyName}</span>
              </>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Performance Report: {targetRole}
          </h1>
          <p className="text-xs text-muted-foreground">
            Evaluated on {formatDate(feedback.createdAt || new Date())}
          </p>
        </div>

        <div className="flex items-center gap-3 print:hidden">
          <button
            onClick={handleExportPdf}
            disabled={isExporting}
            className="px-4 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-xs font-semibold hover:bg-secondary/80 border border-border flex items-center gap-1.5 transition-all"
          >
            <Download className="h-4 w-4 text-primary" />
            Export PDF
          </button>
          <Link
            href="/interview/setup"
            className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 flex items-center gap-1.5 shadow-md shadow-primary/20 transition-all"
          >
            <RotateCcw className="h-4 w-4" />
            Practice Again
          </Link>
        </div>
      </div>

      {/* Score Overview & Rubrics Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Score Gauge */}
        <div className="p-6 rounded-3xl bg-card border border-border/80 flex flex-col items-center justify-center text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Overall Interview Readiness
          </div>
          <div className="w-36 h-36 rounded-full border-4 border-emerald-500/30 bg-emerald-500/10 text-emerald-400 flex flex-col items-center justify-center my-2 shadow-inner">
            <span className="text-5xl font-black">{feedback.overallScore}</span>
            <span className="text-xs font-semibold text-muted-foreground">/ 100</span>
          </div>
          <div className="mt-3 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {feedback.overallScore >= 80 ? "Offer Recommended" : "Competitive Candidate"}
          </div>
        </div>

        {/* 5 Evaluated Rubrics */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-card border border-border/80 space-y-3.5">
          <h2 className="text-sm font-bold tracking-tight border-b border-border/40 pb-2">
            Core Evaluation Rubrics
          </h2>

          <div className="space-y-3 pt-1">
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span>STAR Method Structure</span>
                <span className="font-bold text-primary">{rubrics.starMethod || 82}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${rubrics.starMethod || 82}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span>Technical Accuracy & Depth</span>
                <span className="font-bold text-emerald-400">{rubrics.technicalAccuracy || 88}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${rubrics.technicalAccuracy || 88}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span>Communication Clarity</span>
                <span className="font-bold text-amber-400">{rubrics.clarity || 84}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${rubrics.clarity || 84}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span>Confidence & Decisiveness</span>
                <span className="font-bold text-violet-400">{rubrics.confidence || 85}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-violet-500 rounded-full"
                  style={{ width: `${rubrics.confidence || 85}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 space-y-3">
        <h2 className="text-sm font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Bar Raiser Executive Summary
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {feedback.summary}
        </p>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-card border border-border/80 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" />
            Key Strengths Observed
          </h3>
          <ul className="space-y-2 text-xs text-muted-foreground">
            {feedback.strengths?.map((str: string, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 rounded-3xl bg-card border border-border/80 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Lightbulb className="h-4 w-4" />
            Target Growth Areas
          </h3>
          <ul className="space-y-2 text-xs text-muted-foreground">
            {feedback.weaknesses?.map((w: string, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actionable Top 3 Improvement Tips */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 space-y-4">
        <h2 className="text-sm font-bold tracking-tight flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-400" />
          3 Actionable Fixes for Next Session
        </h2>
        <div className="grid sm:grid-cols-3 gap-4 pt-1">
          {feedback.actionableTips?.map((tip: string, i: number) => (
            <div key={i} className="p-4 rounded-2xl bg-background border border-border/60 text-xs text-muted-foreground leading-relaxed">
              <span className="font-bold text-foreground block mb-1">Tip #{i + 1}</span>
              {tip}
            </div>
          ))}
        </div>
      </div>

      {/* Per-Question Evaluations & Ideal Answers */}
      <div className="space-y-4">
        <h2 className="text-base font-bold tracking-tight">
          Per-Question Deep Dive & Model 10/10 Answers
        </h2>

        {feedback.questionEvaluations?.map((qEval: any, i: number) => {
          const isExpanded = expandedQuestion === i;
          return (
            <div
              key={i}
              className="rounded-3xl bg-card border border-border/80 overflow-hidden transition-all"
            >
              <button
                onClick={() => setExpandedQuestion(isExpanded ? null : i)}
                className="w-full p-6 text-left flex items-start justify-between gap-4 hover:bg-muted/20 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                      Question #{qEval.questionIndex || i + 1}
                    </span>
                    <span className="text-xs font-bold text-emerald-400">
                      Score: {qEval.score}/100
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">{qEval.question}</h3>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                )}
              </button>

              {isExpanded && (
                <div className="p-6 pt-0 space-y-4 border-t border-border/40 text-xs">
                  {/* Candidate Answer */}
                  <div className="p-4 rounded-2xl bg-background border border-border/60 space-y-1">
                    <div className="font-bold text-muted-foreground">Your Response:</div>
                    <p className="text-foreground italic leading-relaxed">
                      &quot;{qEval.answer}&quot;
                    </p>
                  </div>

                  {/* Feedback Critique */}
                  <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 text-blue-300 leading-relaxed">
                    <strong>Interviewer Critique:</strong> {qEval.feedback}
                  </div>

                  {/* Ideal Model Answer */}
                  <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                    <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      Ideal 10/10 Model Response (What top performers say):
                    </div>
                    <p className="text-foreground leading-relaxed whitespace-pre-line">
                      {qEval.idealAnswer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
