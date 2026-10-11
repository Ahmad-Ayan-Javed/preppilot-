"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Mic,
  Briefcase,
  Building2,
  Clock,
  Sparkles,
  ArrowRight,
  FileText,
  Loader2,
  Sliders,
  CheckCircle2,
} from "lucide-react";

function SetupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [companyName, setCompanyName] = useState(searchParams?.get("company") || "Stripe");
  const [targetRole, setTargetRole] = useState(
    searchParams?.get("role") || "Senior Frontend Engineer"
  );
  const [level, setLevel] = useState(searchParams?.get("level") || "SENIOR");
  const [interviewType, setInterviewType] = useState(
    searchParams?.get("type") || "MIXED"
  );
  const [questionCount, setQuestionCount] = useState(5);
  const [timePerQuestion, setTimePerQuestion] = useState(180);
  const [resumeId, setResumeId] = useState<string>(searchParams?.get("resumeId") || "");
  const [resumes, setResumes] = useState<any[]>([]);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.recentResumes && data.recentResumes.length > 0) {
          setResumes(data.recentResumes);
          if (!resumeId) {
            setResumeId(data.recentResumes[0].id);
          }
        }
      })
      .catch((err) => console.error(err));
  }, [resumeId]);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsStarting(true);
    setError(null);

    try {
      const res = await fetch("/api/interview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: companyName.trim() || undefined,
          targetRole,
          level,
          interviewType,
          questionCount,
          timePerQuestion,
          resumeId: resumeId || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start interview");

      router.push(`/interview/${data.sessionId}/room`);
    } catch (err: any) {
      setError(err?.message || "Failed to start interview");
      setIsStarting(false);
    }
  };

  return (
    <form onSubmit={handleStart} className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 space-y-6">
      {error && (
        <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs">
          {error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
            Target Company (Optional)
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Stripe, Google, Uber"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
            Target Role / Position
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              required
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
            Seniority Level
          </label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="ENTRY">Entry Level (Junior)</option>
            <option value="MID">Mid Level</option>
            <option value="SENIOR">Senior Level</option>
            <option value="LEAD">Staff / Tech Lead</option>
            <option value="EXECUTIVE">Executive / Manager</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
            Interview Format
          </label>
          <select
            value={interviewType}
            onChange={(e) => setInterviewType(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="TECHNICAL">Technical Deep Dive</option>
            <option value="BEHAVIORAL">Behavioral (STAR Method)</option>
            <option value="SYSTEM_DESIGN">System Design & Architecture</option>
            <option value="HR">HR & Cultural Fit</option>
            <option value="MIXED">Mixed Onsite Loop</option>
          </select>
        </div>
      </div>

      {/* Configuration Sliders */}
      <div className="grid sm:grid-cols-2 gap-6 pt-2">
        <div>
          <div className="flex justify-between text-xs font-semibold mb-2">
            <span className="text-muted-foreground uppercase tracking-wider">Number of Questions</span>
            <span className="text-primary font-bold">{questionCount} questions</span>
          </div>
          <input
            type="range"
            min={2}
            max={8}
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>Quick (2)</span>
            <span>Standard (5)</span>
            <span>Comprehensive (8)</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold mb-2">
            <span className="text-muted-foreground uppercase tracking-wider">Time Per Question</span>
            <span className="text-primary font-bold">{Math.round(timePerQuestion / 60)} minutes ({timePerQuestion}s)</span>
          </div>
          <input
            type="range"
            min={60}
            max={300}
            step={30}
            value={timePerQuestion}
            onChange={(e) => setTimePerQuestion(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>1 min (Speed)</span>
            <span>3 min (Standard)</span>
            <span>5 min (Detailed)</span>
          </div>
        </div>
      </div>

      {/* Resume Attachment */}
      {resumes.length > 0 && (
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
            Anchor Interview to Uploaded Resume
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <select
              value={resumeId}
              onChange={(e) => setResumeId(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="">No resume (Generic questions)</option>
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.fileName} (Score: {r.score}/100)
                </option>
              ))}
            </select>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            The AI interviewer will adapt questions specifically around the projects and technologies on your resume.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isStarting}
        className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all disabled:opacity-60"
      >
        {isStarting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Entering Interview Room...
          </>
        ) : (
          <>
            <Mic className="h-4 w-4" />
            Enter Live Mock Interview Room
          </>
        )}
      </button>
    </form>
  );
}

export default function InterviewSetupPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-10 flex-1 space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-xs font-semibold mb-2">
          <Mic className="h-3.5 w-3.5" />
          <span>Live Mock Interview Setup</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Configure Your Mock Interview</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Customize your interviewer persona, difficulty, time constraints, and role focus.
        </p>
      </div>

      <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading setup wizard...</div>}>
        <SetupForm />
      </Suspense>
    </div>
  );
}
