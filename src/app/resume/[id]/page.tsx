"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Briefcase,
  Mic,
  RefreshCw,
  TrendingUp,
  Award,
  Layers,
  Zap,
  Check,
  X,
  BookOpen,
} from "lucide-react";
import { safeJsonParse, formatDate } from "@/lib/utils";

export default function ResumeReportPage() {
  const params = useParams();
  const resumeId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!resumeId) return;

    fetch(`/api/resume/${resumeId}/history`)
      .then((res) => {
        if (!res.ok) throw new Error("Resume report not found");
        return res.json();
      })
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [resumeId]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center animate-spin mb-4">
          <RefreshCw className="h-6 w-6" />
        </div>
        <div className="text-sm font-semibold">Auditing ATS Metrics & Formatting...</div>
        <div className="text-xs text-muted-foreground mt-1">Analyzing sections, keywords, and impact ratios</div>
      </div>
    );
  }

  if (error || !data || !data.reports || data.reports.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <AlertTriangle className="h-10 w-10 text-destructive mb-3" />
        <h2 className="text-lg font-bold">Failed to load ATS Report</h2>
        <p className="text-xs text-muted-foreground mt-1 mb-4">{error || "No report found for this resume."}</p>
        <Link href="/resume" className="px-4 py-2 rounded-xl bg-primary text-xs font-semibold">
          Back to Resumes
        </Link>
      </div>
    );
  }

  const latestReport = data.reports[0];
  const resume = data.resume;
  const breakdown = latestReport.breakdown || {};
  const overall = latestReport.overallScore;

  // Color mapping based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
    if (score >= 65) return "text-amber-400 border-amber-500/30 bg-amber-500/10";
    return "text-rose-400 border-rose-500/30 bg-rose-500/10";
  };

  const getScoreBadgeText = (score: number) => {
    if (score >= 85) return "Excellent (Top 10% ATS Ready)";
    if (score >= 70) return "Competitive (Passes Most ATS)";
    return "Needs Optimization";
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-10 flex-1 space-y-8">
      {/* Top Banner / Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-card border border-border/80 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary">
            <FileText className="h-4 w-4" />
            <span>{resume.fileName}</span>
            <span>•</span>
            <span className="text-muted-foreground">Version {resume.version}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            ATS Analysis: {resume.targetRole || "Software Engineering"}
          </h1>
          <p className="text-xs text-muted-foreground">
            Audited on {formatDate(latestReport.createdAt)}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/interview/setup?resumeId=${resume.id}`}
            className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 flex items-center gap-1.5 shadow-md shadow-primary/20 transition-all"
          >
            <Mic className="h-4 w-4" />
            Practice Mock Interview
          </Link>
          <Link
            href={`/prep?resumeId=${resume.id}`}
            className="px-4 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-xs font-semibold hover:bg-secondary/80 border border-border flex items-center gap-1.5 transition-all"
          >
            <Briefcase className="h-4 w-4 text-indigo-400" />
            Generate Prep Kit
          </Link>
        </div>
      </div>

      {/* Score Overview Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Score Gauge Card */}
        <div className="p-6 rounded-3xl bg-card border border-border/80 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Overall ATS Readiness Score
          </div>

          <div
            className={`w-36 h-36 rounded-full border-4 flex flex-col items-center justify-center my-2 shadow-inner ${getScoreColor(
              overall
            )}`}
          >
            <span className="text-5xl font-black tracking-tight">{overall}</span>
            <span className="text-xs font-semibold text-muted-foreground">/ 100</span>
          </div>

          <div className="mt-4 px-3 py-1 rounded-full text-xs font-bold border ${getScoreColor(overall)}">
            {getScoreBadgeText(overall)}
          </div>

          <p className="text-xs text-muted-foreground mt-3 max-w-xs">
            Synthesized from deterministic parsing heuristics and AI contextual bar evaluation.
          </p>
        </div>

        {/* 5-Pillar Category Breakdown Bars */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-card border border-border/80 space-y-4">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <h2 className="text-sm font-bold tracking-tight flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              Transparent 5-Pillar Score Breakdown
            </h2>
            <span className="text-xs text-muted-foreground">Weighted composite (100 pts)</span>
          </div>

          <div className="space-y-3.5 pt-2">
            {/* Keyword Match (30%) */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-foreground">Keyword Match & Skill Density (30%)</span>
                <span className="font-bold text-primary">{breakdown.keywordMatch || 24} / 30</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${((breakdown.keywordMatch || 24) / 30) * 100}%` }}
                />
              </div>
            </div>

            {/* Formatting (20%) */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-foreground">Formatting & ATS Parseability (20%)</span>
                <span className="font-bold text-emerald-400">{breakdown.formatting || 18} / 20</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${((breakdown.formatting || 18) / 20) * 100}%` }}
                />
              </div>
            </div>

            {/* Impact & Quantification (20%) */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-foreground">Impact & Quantification (20%)</span>
                <span className="font-bold text-amber-400">{breakdown.impact || 15} / 20</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all"
                  style={{ width: `${((breakdown.impact || 15) / 20) * 100}%` }}
                />
              </div>
            </div>

            {/* Section Completeness (15%) */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-foreground">Section Completeness (15%)</span>
                <span className="font-bold text-indigo-400">{breakdown.sectionCompleteness || 14} / 15</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all"
                  style={{ width: `${((breakdown.sectionCompleteness || 14) / 15) * 100}%` }}
                />
              </div>
            </div>

            {/* Grammar & Clarity (15%) */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-foreground">Grammar, Clarity & Brevity (15%)</span>
                <span className="font-bold text-violet-400">{breakdown.grammarClarity || 14} / 15</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-violet-500 rounded-full transition-all"
                  style={{ width: `${((breakdown.grammarClarity || 14) / 15) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Keywords Section: Matched vs Missing */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Matched Keywords */}
        <div className="p-6 rounded-3xl bg-card border border-border/80 space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Check className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Detected Keywords</h3>
              <p className="text-[11px] text-muted-foreground">Found and verified in your resume</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {latestReport.matchedKeywords?.map((kw: string, i: number) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Missing Keywords */}
        <div className="p-6 rounded-3xl bg-card border border-border/80 space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <X className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Missing Target Keywords</h3>
              <p className="text-[11px] text-muted-foreground">
                Incorporate these to pass automated ATS filters
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {latestReport.missingKeywords?.map((kw: string, i: number) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20"
              >
                + {kw}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bullet Point Rewriter Diff View */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Bullet Point Optimizer</span>
          </div>
          <h2 className="text-lg font-bold tracking-tight">
            Before vs. After: High-Impact Bullet Rewrites
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Using the Google XYZ Achievement formula: &quot;Accomplished [X], measured by [Y], by doing [Z]&quot;
          </p>
        </div>

        <div className="space-y-4">
          {latestReport.bulletRewrites?.map((item: any, i: number) => (
            <div key={i} className="p-5 rounded-2xl bg-background border border-border/60 space-y-3">
              {/* Original */}
              <div className="space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  Original Bullet
                </div>
                <div className="text-xs text-muted-foreground pl-3 border-l-2 border-rose-500/40 italic">
                  &quot;{item.original}&quot;
                </div>
              </div>

              {/* Improved */}
              <div className="space-y-1 pt-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  AI High-Impact Version
                </div>
                <div className="text-xs text-foreground font-medium pl-3 border-l-2 border-emerald-500/60 bg-emerald-500/5 py-1.5 pr-2 rounded-r-lg">
                  &quot;{item.improved}&quot;
                </div>
              </div>

              {/* Rationale */}
              <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 pt-1">
                <Zap className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span>
                  <strong>Why this works:</strong> {item.reason}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prioritized Top 10 Fixes */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 space-y-6">
        <div>
          <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
            <Award className="h-5 w-5 text-indigo-400" />
            Prioritized Action Checklist
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Resolve these items in order of priority to boost your ATS score above 90+
          </p>
        </div>

        <div className="space-y-3">
          {latestReport.topFixes?.map((fix: any, i: number) => {
            const priorityColors = {
              HIGH: "bg-rose-500/10 text-rose-400 border-rose-500/20",
              MEDIUM: "bg-amber-500/10 text-amber-400 border-amber-500/20",
              LOW: "bg-blue-500/10 text-blue-400 border-blue-500/20",
            };

            return (
              <div
                key={i}
                className="p-4 rounded-2xl bg-background border border-border/60 flex items-start gap-3.5"
              >
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border shrink-0 mt-0.5 ${
                    priorityColors[fix.priority as keyof typeof priorityColors] || priorityColors.MEDIUM
                  }`}
                >
                  {fix.priority}
                </span>
                <div>
                  <div className="text-xs font-semibold text-foreground">{fix.title}</div>
                  <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {fix.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Raw Metrics Card */}
      {latestReport.rawMetrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-3xl bg-card border border-border/80 text-center">
          <div>
            <div className="text-2xl font-bold">{latestReport.rawMetrics.wordCount}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">Total Words</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{latestReport.rawMetrics.bulletCount}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">Experience Bullets</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400">
              {latestReport.rawMetrics.quantifiedBulletCount}
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">Quantified Bullets (%, $)</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-indigo-400">
              {latestReport.rawMetrics.actionVerbCount}
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">Action Verb Openers</div>
          </div>
        </div>
      )}
    </div>
  );
}
