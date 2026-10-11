"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Briefcase,
  Mic,
  TrendingUp,
  Award,
  Zap,
  ArrowRight,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const metrics = data?.metrics || {
    totalResumes: 1,
    completedInterviews: 1,
    totalPrepKits: 1,
    avgAtsScore: 84,
    avgInterviewScore: 85,
    streakDays: 4,
  };

  const scoreTrends = data?.scoreTrends || [
    { session: "Prep 1", ats: 68, interview: 65 },
    { session: "Prep 2", ats: 74, interview: 72 },
    { session: "Prep 3", ats: 79, interview: 78 },
    { session: "Prep 4", ats: 84, interview: 85 },
  ];

  const radarData = data?.radarData || [
    { subject: "System Design", score: 88, fullMark: 100 },
    { subject: "Coding & DSA", score: 92, fullMark: 100 },
    { subject: "STAR Method", score: 84, fullMark: 100 },
    { subject: "Technical Depth", score: 90, fullMark: 100 },
    { subject: "Communication", score: 86, fullMark: 100 },
    { subject: "ATS Optimization", score: 84, fullMark: 100 },
  ];

  return (
    <div className="container max-w-6xl mx-auto px-4 py-10 flex-1 space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-violet-900/30 border border-border/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Interview Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, Alex Morgan
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Your performance trajectory is on track for Senior & Staff engineering loops.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/resume"
            className="px-4 py-2.5 rounded-xl bg-card border border-border text-xs font-semibold hover:border-primary/50 transition-all flex items-center gap-1.5"
          >
            <FileText className="h-4 w-4 text-blue-400" />
            Audit Resume
          </Link>
          <Link
            href="/interview/setup"
            className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 flex items-center gap-1.5 shadow-md shadow-primary/20 transition-all"
          >
            <Mic className="h-4 w-4" />
            Start Mock Interview
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              Avg ATS Score
            </span>
            <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground">
            {metrics.avgAtsScore}
            <span className="text-xs font-normal text-muted-foreground ml-1">/ 100</span>
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <TrendingUp className="h-3 w-3" />
            <span>+16 pts over past 3 uploads</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              Interview Readiness
            </span>
            <div className="h-8 w-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Mic className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground">
            {metrics.avgInterviewScore}
            <span className="text-xs font-normal text-muted-foreground ml-1">/ 100</span>
          </div>
          <div className="text-[11px] text-blue-400 flex items-center gap-1 font-medium">
            <CheckCircle2 className="h-3 w-3" />
            <span>Offer tier readiness</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              Practice Streak
            </span>
            <div className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground">
            {metrics.streakDays}
            <span className="text-xs font-normal text-muted-foreground ml-1">Days</span>
          </div>
          <div className="text-[11px] text-amber-400 font-medium">
            Keep it up to build muscle memory!
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              Company Kits
            </span>
            <div className="h-8 w-8 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center">
              <Briefcase className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground">
            {metrics.totalPrepKits}
            <span className="text-xs font-normal text-muted-foreground ml-1">Kits Active</span>
          </div>
          <div className="text-[11px] text-violet-400 font-medium">
            Stripe, Google & custom roles
          </div>
        </div>
      </div>

      {/* Visualizations Grid: Trend Line & Skill Radar */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Score Progression Line Chart */}
        <div className="p-6 rounded-3xl bg-card border border-border/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold tracking-tight">Performance Trajectory</h2>
              <p className="text-[11px] text-muted-foreground">Historical score trajectory across practice sessions</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-blue-400">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                ATS
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Interview
              </span>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scoreTrends}>
                <XAxis dataKey="session" stroke="#888888" fontSize={11} tickLine={false} />
                <YAxis stroke="#888888" fontSize={11} domain={[50, 100]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "0.75rem",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="ats"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="interview"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skills Radar Chart */}
        <div className="p-6 rounded-3xl bg-card border border-border/80 space-y-4">
          <div>
            <h2 className="text-sm font-bold tracking-tight">Competency Radar</h2>
            <p className="text-[11px] text-muted-foreground">Evaluated across 6 technical and leadership dimensions</p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#888888", fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#888888" />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Resumes & Interviews Tables */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Resumes */}
        <div className="p-6 rounded-3xl bg-card border border-border/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm tracking-tight flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-400" />
              Audited Resumes
            </h3>
            <Link href="/resume" className="text-xs font-semibold text-primary hover:underline">
              Upload New
            </Link>
          </div>

          <div className="space-y-2.5">
            {data?.recentResumes?.map((r: any) => (
              <Link
                key={r.id}
                href={`/resume/${r.id}`}
                className="p-3 rounded-2xl bg-background border border-border hover:border-primary/40 flex items-center justify-between transition-all group"
              >
                <div className="min-w-0 pr-2">
                  <div className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                    {r.fileName}
                  </div>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-2 mt-0.5">
                    <span>{r.targetRole}</span>
                    <span>•</span>
                    <span>{formatDate(r.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-500/10">
                    {r.score}/100
                  </span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Mock Interviews */}
        <div className="p-6 rounded-3xl bg-card border border-border/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm tracking-tight flex items-center gap-2">
              <Mic className="h-4 w-4 text-violet-400" />
              Recent Mock Interviews
            </h3>
            <Link href="/interview/setup" className="text-xs font-semibold text-primary hover:underline">
              Start Session
            </Link>
          </div>

          <div className="space-y-2.5">
            {data?.recentInterviews && data.recentInterviews.length > 0 ? (
              data.recentInterviews.map((inv: any) => (
                <Link
                  key={inv.id}
                  href={`/interview/${inv.id}/feedback`}
                  className="p-3 rounded-2xl bg-background border border-border hover:border-primary/40 flex items-center justify-between transition-all group"
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {inv.company} • {inv.targetRole}
                    </div>
                    <div className="text-[10px] text-muted-foreground flex items-center gap-2 mt-0.5">
                      <span>{inv.type}</span>
                      <span>•</span>
                      <span>{formatDate(inv.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-bold text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-500/10">
                      {inv.score ? `${inv.score}/100` : "Active"}
                    </span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-xs text-muted-foreground text-center py-6">
                No mock sessions yet.{" "}
                <Link href="/interview/setup" className="text-primary font-semibold underline">
                  Launch your first mock interview!
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
