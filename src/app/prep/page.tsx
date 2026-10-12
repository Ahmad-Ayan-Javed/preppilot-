"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Briefcase,
  Sparkles,
  ArrowRight,
  Loader2,
  Building2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function PrepKitGeneratorPage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("Stripe");
  const [targetRole, setTargetRole] = useState("Senior Frontend Engineer");
  const [level, setLevel] = useState("SENIOR");
  const [interviewType, setInterviewType] = useState("MIXED");
  const [targetJd, setTargetJd] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingKits, setExistingKits] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        // We can fetch prep kits or recent items
      })
      .catch((err) => console.error(err));
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/prep/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          targetRole,
          level,
          interviewType,
          targetJd: targetJd || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate kit");

      router.push(`/prep/${data.id}`);
    } catch (err: any) {
      setError(err?.message || "Generation error");
      setIsGenerating(false);
    }
  };

  const quickPresets = [
    { company: "Stripe", role: "Senior Frontend Engineer", level: "SENIOR", type: "MIXED" },
    { company: "Google", role: "Software Engineer III (L4)", level: "MID", type: "TECHNICAL" },
    { company: "Amazon", role: "Software Development Engineer II", level: "MID", type: "BEHAVIORAL" },
    { company: "Meta", role: "Staff Software Engineer (E6)", level: "LEAD", type: "SYSTEM_DESIGN" },
  ];

  return (
    <div className="container max-w-5xl mx-auto px-4 py-10 flex-1 space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80 dark:bg-indigo-500/10 dark:text-indigo-400 text-xs font-semibold mb-2 shadow-xs">
          <Briefcase className="h-3.5 w-3.5" />
          <span>Company Interview Intelligence</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Generate Company Prep Kit</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Get authentic interview round breakdowns, typical question banks, culture values, and targeted revision plans.
        </p>
      </div>

      {/* Quick Preset Buttons */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Popular Company Presets
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {quickPresets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setCompanyName(p.company);
                setTargetRole(p.role);
                setLevel(p.level);
                setInterviewType(p.type);
              }}
              className="p-3 rounded-xl bg-card border border-border/80 hover:border-primary/50 text-left transition-all hover:bg-muted/40"
            >
              <div className="font-bold text-xs text-foreground">{p.company}</div>
              <div className="text-[11px] text-muted-foreground truncate">{p.role}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form (2 cols) */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleGenerate}
            className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 space-y-6"
          >
            {error && (
              <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Target Company Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Stripe, Google, Datadog"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Target Role
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
                  Experience Level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="ENTRY">Entry Level (0-2 yrs)</option>
                  <option value="MID">Mid Level (2-5 yrs)</option>
                  <option value="SENIOR">Senior Level (5-8 yrs)</option>
                  <option value="LEAD">Staff / Tech Lead (8+ yrs)</option>
                  <option value="EXECUTIVE">Executive / Director</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Interview Round Focus
                </label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="TECHNICAL">Technical Coding & DSA</option>
                  <option value="BEHAVIORAL">Behavioral & Leadership (STAR)</option>
                  <option value="SYSTEM_DESIGN">System Design & Architecture</option>
                  <option value="HR">Recruiter / HR Screen</option>
                  <option value="MIXED">Full Onsite Loop (Mixed)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Target Job Description / Specific Team Notes (Optional)
              </label>
              <textarea
                rows={4}
                value={targetJd}
                onChange={(e) => setTargetJd(e.target.value)}
                placeholder="Paste the job description or hiring manager notes to ground the kit in your specific team..."
                className="w-full p-3 rounded-xl bg-background border border-border text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all disabled:opacity-60"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating Tailored Kit for {companyName}...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Prep Kit
                </>
              )}
            </button>
          </form>
        </div>

        {/* Info Card */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-card border border-border/80 space-y-4">
            <h3 className="font-bold text-sm tracking-tight flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              What You&apos;ll Get
            </h3>
            <ul className="space-y-3 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="font-bold text-foreground">1.</span>
                <span><strong>Company DNA:</strong> Real leadership values, engineering culture, and business models.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-foreground">2.</span>
                <span><strong>Exact Rounds:</strong> Duration and interviewer expectations for each round.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-foreground">3.</span>
                <span><strong>Curated Questions:</strong> Insider questions with tips and sample answer bullets.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-foreground">4.</span>
                <span><strong>Skill Gap & Revision:</strong> Tailored study plan targeting your exact gaps.</span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs leading-relaxed">
            <strong>Transparency Notice:</strong> Company culture and round structures are generated with AI heuristics. For highest fidelity, paste your recruiter email notes or JD in the optional field.
          </div>
        </div>
      </div>
    </div>
  );
}
