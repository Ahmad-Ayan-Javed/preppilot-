"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Briefcase,
  Mic,
  Clock,
  ArrowRight,
  History,
  Award,
  Sparkles,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function HistoryPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"resumes" | "interviews">("resumes");

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container max-w-5xl mx-auto px-4 py-10 flex-1 space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
          <History className="h-3.5 w-3.5" />
          <span>Activity Timeline</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Your Preparation History</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review past resume audits, score progressions, and completed mock interview evaluations.
        </p>
      </div>

      <div className="flex items-center gap-2 border-b border-border/40 pb-2">
        <button
          onClick={() => setActiveTab("resumes")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "resumes"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          Resumes & ATS Reports ({data?.recentResumes?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("interviews")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "interviews"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          Mock Interviews ({data?.recentInterviews?.length || 0})
        </button>
      </div>

      {activeTab === "resumes" && (
        <div className="space-y-3">
          {data?.recentResumes?.length > 0 ? (
            data.recentResumes.map((r: any) => (
              <div
                key={r.id}
                className="p-5 rounded-2xl bg-card border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                    <FileText className="h-4 w-4 text-blue-400" />
                    <span>{r.fileName}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Target Role: {r.targetRole} • Audited on {formatDate(r.createdAt)}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    ATS Score: {r.score}/100
                  </span>
                  <Link
                    href={`/resume/${r.id}`}
                    className="px-3.5 py-1.5 rounded-xl bg-secondary text-secondary-foreground text-xs font-semibold hover:bg-secondary/80 border border-border flex items-center gap-1.5 transition-colors"
                  >
                    View Report
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-xs text-muted-foreground">
              No resumes uploaded yet.
            </div>
          )}
        </div>
      )}

      {activeTab === "interviews" && (
        <div className="space-y-3">
          {data?.recentInterviews?.length > 0 ? (
            data.recentInterviews.map((i: any) => (
              <div
                key={i.id}
                className="p-5 rounded-2xl bg-card border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                    <Mic className="h-4 w-4 text-violet-400" />
                    <span>{i.company} • {i.targetRole}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Format: {i.type} • Status: {i.status} • {formatDate(i.createdAt)}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    {i.score ? `${i.score}/100` : "In Progress"}
                  </span>
                  <Link
                    href={`/interview/${i.id}/feedback`}
                    className="px-3.5 py-1.5 rounded-xl bg-secondary text-secondary-foreground text-xs font-semibold hover:bg-secondary/80 border border-border flex items-center gap-1.5 transition-colors"
                  >
                    View Feedback
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-xs text-muted-foreground">
              No mock interview sessions recorded yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
