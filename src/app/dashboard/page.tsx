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
    { session: "Prep 5", ats: 86, interview: 88 },
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
    <div className="container max-w-6xl mx-auto px-4 py-10 flex-1 space-y-8 bg-slate-50/50">
      {/* Welcome Banner - Luminous Bright Gradient */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-50 via-indigo-50/70 to-violet-50 border border-blue-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-blue-700 text-xs font-bold border border-blue-200/80 shadow-xs mb-2">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span>Interview Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, Alex Morgan
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Your performance trajectory is on track for Senior & Staff engineering loops.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Link
            href="/resume"
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-blue-600 hover:border-blue-300 shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5"
          >
            <FileText className="h-4 w-4 text-blue-600" />
            Audit Resume
          </Link>
          <Link
            href="/interview/setup"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold hover:from-blue-700 hover:to-indigo-700 flex items-center gap-1.5 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all hover:scale-[1.01]"
          >
            <Mic className="h-4 w-4" />
            Start Mock Interview
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards - Crisp Pure White with Colorful Accents */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Avg ATS Score
            </span>
            <div className="h-9 w-9 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {metrics.avgAtsScore}
            <span className="text-xs font-semibold text-slate-400 ml-1">/ 100</span>
          </div>
          <div className="text-[11px] text-emerald-600 flex items-center gap-1 font-bold">
            <TrendingUp className="h-3 w-3" />
            <span>+16 pts over past 3 uploads</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Interview Readiness
            </span>
            <div className="h-9 w-9 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
              <Mic className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {metrics.avgInterviewScore}
            <span className="text-xs font-semibold text-slate-400 ml-1">/ 100</span>
          </div>
          <div className="text-[11px] text-blue-600 flex items-center gap-1 font-bold">
            <CheckCircle2 className="h-3 w-3" />
            <span>Offer tier readiness</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Practice Streak
            </span>
            <div className="h-9 w-9 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
              <Zap className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {metrics.streakDays}
            <span className="text-xs font-semibold text-slate-400 ml-1">Days</span>
          </div>
          <div className="text-[11px] text-amber-600 font-bold">
            Keep it up to build muscle memory!
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Company Kits
            </span>
            <div className="h-9 w-9 rounded-2xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center">
              <Briefcase className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {metrics.totalPrepKits}
            <span className="text-xs font-semibold text-slate-400 ml-1">Kits Active</span>
          </div>
          <div className="text-[11px] text-violet-600 font-bold">
            Stripe, Google & custom roles
          </div>
        </div>
      </div>

      {/* Visualizations Grid: Trend Line & Skill Radar */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Score Progression Line Chart */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">Performance Trajectory</h2>
              <p className="text-[11px] text-slate-500 font-medium">Historical score trajectory across practice sessions</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-blue-600">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                ATS
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                Interview
              </span>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scoreTrends}>
                <XAxis dataKey="session" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} domain={[50, 100]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "#E2E8F0",
                    borderRadius: "0.75rem",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    fontSize: "12px",
                    color: "#0F172A",
                    fontWeight: 600,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="ats"
                  stroke="#2563EB"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#2563EB" }}
                />
                <Line
                  type="monotone"
                  dataKey="interview"
                  stroke="#059669"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#059669" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skills Radar Chart */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">Competency Radar</h2>
            <p className="text-[11px] text-slate-500 font-medium">Evaluated across 6 technical and leadership dimensions</p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#475569", fontSize: 11, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#CBD5E1" />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#6366F1"
                  strokeWidth={2}
                  fill="#818CF8"
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
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 tracking-tight flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              Audited Resumes
            </h3>
            <Link href="/resume" className="text-xs font-bold text-blue-600 hover:underline">
              Upload New
            </Link>
          </div>

          <div className="space-y-2.5">
            {data?.recentResumes?.map((r: any) => (
              <Link
                key={r.id}
                href={`/resume/${r.id}`}
                className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/30 flex items-center justify-between transition-all group"
              >
                <div className="min-w-0 pr-2">
                  <div className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                    {r.fileName}
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5 font-medium">
                    <span>{r.targetRole}</span>
                    <span>•</span>
                    <span>{formatDate(r.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-emerald-700 px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-200">
                    {r.score}/100
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Mock Interviews */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 tracking-tight flex items-center gap-2">
              <Mic className="h-4 w-4 text-violet-600" />
              Recent Mock Interviews
            </h3>
            <Link href="/interview/setup" className="text-xs font-bold text-blue-600 hover:underline">
              Start Session
            </Link>
          </div>

          <div className="space-y-2.5">
            {data?.recentInterviews && data.recentInterviews.length > 0 ? (
              data.recentInterviews.map((inv: any) => (
                <Link
                  key={inv.id}
                  href={`/interview/${inv.id}/feedback`}
                  className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-violet-300 hover:bg-violet-50/30 flex items-center justify-between transition-all group"
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-xs font-bold text-slate-900 truncate group-hover:text-violet-600 transition-colors">
                      {inv.company} • {inv.targetRole}
                    </div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5 font-medium">
                      <span>{inv.type}</span>
                      <span>•</span>
                      <span>{formatDate(inv.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-bold text-emerald-700 px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-200">
                      {inv.score ? `${inv.score}/100` : "Active"}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-violet-600 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-xs text-slate-500 text-center py-6 font-medium">
                No mock sessions yet.{" "}
                <Link href="/interview/setup" className="text-blue-600 font-bold underline">
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
