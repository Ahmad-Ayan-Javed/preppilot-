"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Building2,
  Briefcase,
  Mic,
  Clock,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function PrepKitDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [kit, setKit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"rounds" | "questions" | "skills" | "revision">("rounds");
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(0);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/prep/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Prep kit not found");
        return res.json();
      })
      .then((data) => {
        setKit(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center animate-spin mb-4">
          <RefreshCw className="h-6 w-6" />
        </div>
        <div className="text-sm font-semibold">Loading Company Prep Kit...</div>
      </div>
    );
  }

  if (error || !kit) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="h-10 w-10 text-destructive mb-3" />
        <h2 className="text-lg font-bold">Failed to load Prep Kit</h2>
        <p className="text-xs text-muted-foreground mt-1 mb-4">{error}</p>
        <Link href="/prep" className="px-4 py-2 rounded-xl bg-primary text-xs font-semibold">
          Back to Prep Generator
        </Link>
      </div>
    );
  }

  const { companyOverview, interviewRounds, questionBank, skillGaps, revisionTopics } = kit;

  return (
    <div className="container max-w-6xl mx-auto px-4 py-10 flex-1 space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary">
            <Building2 className="h-4 w-4" />
            <span className="text-foreground">{kit.companyName}</span>
            <span>•</span>
            <span className="text-muted-foreground">{kit.level} Level</span>
            <span>•</span>
            <span className="text-muted-foreground">{kit.interviewType} Focus</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {kit.companyName}: {kit.targetRole}
          </h1>
          <p className="text-xs text-muted-foreground">
            Kit compiled on {formatDate(kit.createdAt)}
          </p>
        </div>

        <Link
          href={`/interview/setup?company=${encodeURIComponent(kit.companyName)}&role=${encodeURIComponent(
            kit.targetRole
          )}&type=${kit.interviewType}&level=${kit.level}`}
          className="px-5 py-3 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all whitespace-nowrap"
        >
          <Mic className="h-4 w-4" />
          Practice {kit.companyName} Mock Interview
        </Link>
      </div>

      {/* AI Grounding Notice */}
      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary shrink-0" />
          <span>
            <strong>AI-Grounded Intelligence:</strong> Curated based on recent candidate interview debriefs and engineering blogs at {kit.companyName}.
          </span>
        </div>
      </div>

      {/* Company Overview & Culture Principles */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 space-y-6">
        <div>
          <h2 className="text-base font-bold tracking-tight">Company DNA & Engineering Culture</h2>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            {companyOverview?.culture || "High engineering standards and fast-paced delivery."}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          {companyOverview?.values?.map((val: string, idx: number) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-background border border-border/60 text-xs font-semibold text-foreground flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
              <span>{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-border/40 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("rounds")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "rounds"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            Interview Rounds ({interviewRounds?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("questions")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "questions"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            Question Bank ({questionBank?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("skills")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "skills"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            Skill Gaps ({skillGaps?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("revision")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "revision"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            Revision Topics ({revisionTopics?.length || 0})
          </button>
        </div>

        {/* Tab 1: Rounds */}
        {activeTab === "rounds" && (
          <div className="grid gap-4">
            {interviewRounds?.map((round: any, i: number) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-card border border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <h3 className="font-bold text-sm text-foreground">{round.roundName}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground pl-7">{round.focus}</p>
                  {round.expectations && (
                    <div className="text-[11px] text-foreground/80 pl-7 pt-1">
                      <strong>Expectations:</strong> {round.expectations}
                    </div>
                  )}
                </div>
                <div className="sm:self-center shrink-0 pl-7 sm:pl-0">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground flex items-center gap-1.5 w-fit">
                    <Clock className="h-3 w-3" />
                    {round.typicalDuration}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Question Bank */}
        {activeTab === "questions" && (
          <div className="space-y-3">
            {questionBank?.map((q: any, i: number) => {
              const isExpanded = expandedQuestion === i;
              return (
                <div
                  key={i}
                  className="rounded-2xl bg-card border border-border/70 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedQuestion(isExpanded ? null : i)}
                    className="w-full p-5 text-left flex items-start justify-between gap-4 hover:bg-muted/30 transition-colors"
                  >
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 mb-2 inline-block">
                        {q.category}
                      </span>
                      <h4 className="text-sm font-semibold text-foreground">{q.question}</h4>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 space-y-3 border-t border-border/40 bg-background/50 text-xs">
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
                        <strong>Insider Tip:</strong> {q.tip}
                      </div>

                      {q.samplePoints && q.samplePoints.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <div className="font-bold text-foreground">Key Points to Mention:</div>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            {q.samplePoints.map((pt: string, pIdx: number) => (
                              <li key={pIdx}>{pt}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Skill Gaps */}
        {activeTab === "skills" && (
          <div className="grid sm:grid-cols-2 gap-4">
            {skillGaps?.map((gap: any, i: number) => (
              <div key={i} className="p-5 rounded-2xl bg-card border border-border/70 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-foreground">{gap.skill}</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    {gap.importance || "HIGH"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{gap.recommendation}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Revision Topics */}
        {activeTab === "revision" && (
          <div className="grid sm:grid-cols-2 gap-4">
            {revisionTopics?.map((topic: any, i: number) => (
              <div key={i} className="p-5 rounded-2xl bg-card border border-border/70 space-y-3">
                <h4 className="font-bold text-sm text-primary">{topic.topic}</h4>
                <div className="flex flex-wrap gap-1.5">
                  {topic.keyConcepts?.map((concept: string, cIdx: number) => (
                    <span
                      key={cIdx}
                      className="px-2 py-1 rounded-lg text-xs bg-muted text-muted-foreground border border-border"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
