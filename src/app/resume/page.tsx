"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  UploadCloud,
  FileText,
  Briefcase,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
  History,
} from "lucide-react";
import { formatBytes, formatDate } from "@/lib/utils";

export default function ResumeUploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState("Senior Frontend Engineer");
  const [targetJd, setTargetJd] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentResumes, setRecentResumes] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.recentResumes) {
          setRecentResumes(data.recentResumes);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoadingHistory(false));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > 5 * 1024 * 1024) {
        setError("File exceeds 5 MB limit.");
        return;
      }
      setFile(selected);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const dropped = e.dataTransfer.files[0];
      if (dropped.size > 5 * 1024 * 1024) {
        setError("File exceeds 5 MB limit.");
        return;
      }
      setFile(dropped);
      setError(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a PDF or DOCX resume to upload.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("targetRole", targetRole);
      formData.append("targetJd", targetJd);

      const res = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze resume.");
      }

      router.push(`/resume/${data.resumeId}`);
    } catch (err: any) {
      setError(err?.message || "Failed to process resume.");
      setIsUploading(false);
    }
  };

  const handleLoadSampleResume = async () => {
    setIsUploading(true);
    setError(null);

    try {
      const sampleText = `SARAH CHEN
San Francisco, CA • sarah.chen@example.com • (555) 345-6789 • linkedin.com/in/sarahchen-dev • github.com/sarahchen

SUMMARY
Results-oriented Senior Frontend & Full Stack Engineer with 6+ years building performant web applications using React, TypeScript, Next.js, and Node.js. Specializing in high-traffic checkout flows and design system architectures.

EXPERIENCE
Lead Frontend Engineer | ScaleCommerce Inc. | 2022 – Present
- Re-architected core checkout web app in Next.js 14 and TypeScript, improving web vitals (LCP from 3.8s to 1.4s) and increasing checkout completion by 22% ($4.5M ARR impact).
- Built real-time inventory telemetry dashboard streaming 40K websocket messages/sec with sub-50ms latency.
- Mentored team of 8 frontend engineers and introduced automated end-to-end testing with Playwright, elevating test coverage from 42% to 89%.

Frontend Engineer | CloudBridge | 2019 – 2022
- Developed customer self-service analytics portal using React, Redux, and Tailwind CSS.
- Automated CI/CD deployment pipeline using GitHub Actions and Docker, reducing release deployment cycle time by 45%.
- Collaborated with design team to author accessible WCAG 2.1 AA UI component library adopted by 6 squad teams.

EDUCATION
B.S. in Computer Science | University of Washington | 2015 – 2019

SKILLS
Languages: TypeScript, JavaScript, HTML5, CSS3, SQL, Python
Frameworks: React, Next.js, Tailwind CSS, Redux, Express, Node.js
Tools & DevOps: Git, Docker, Jest, Playwright, Webpack, Vite, PostgreSQL, Redis`;

      const blob = new Blob([sampleText], { type: "text/plain" });
      const sampleFile = new File([blob], "Sarah_Chen_Senior_Staff_Resume.txt", {
        type: "text/plain",
      });

      const formData = new FormData();
      formData.append("file", sampleFile);
      formData.append("targetRole", "Senior Frontend Engineer");
      formData.append(
        "targetJd",
        "We are looking for a Senior Frontend Engineer proficient in React, Next.js, TypeScript, and modern web vitals. Experience in automated testing and high-scale systems is required."
      );

      const res = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      router.push(`/resume/${data.resumeId}`);
    } catch (err: any) {
      setError(err?.message || "Failed to analyze sample resume");
      setIsUploading(false);
    }
  };

  return (
    <div className="container max-w-5xl mx-auto px-4 py-10 flex-1">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold mb-2">
          <Sparkles className="h-3.5 w-3.5" />
          <span>ATS Resume Intelligence</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Upload & Audit Your Resume</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Get an immediate 0-100 ATS score breakdown, missing keywords, and AI-rewritten high-impact bullets.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Upload Form (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleUpload} className="p-6 rounded-2xl bg-card border border-border/70 space-y-6">
            {error && (
              <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Dropzone */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Resume File (PDF or DOCX, max 5 MB)
              </label>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                  file
                    ? "border-primary/60 bg-primary/5"
                    : "border-border hover:border-primary/40 hover:bg-muted/30"
                }`}
              >
                <input
                  type="file"
                  id="resume-file"
                  accept=".pdf,.docx,.doc,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="resume-file"
                  className="cursor-pointer flex flex-col items-center justify-center gap-3"
                >
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                    <UploadCloud className="h-7 w-7" />
                  </div>
                  {file ? (
                    <div>
                      <div className="font-semibold text-sm text-foreground flex items-center justify-center gap-1.5">
                        <FileText className="h-4 w-4 text-primary" />
                        {file.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {formatBytes(file.size)} • Click or drop to replace
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        Click to select or drag and drop your resume
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Supports PDF, DOCX, and TXT up to 5 MB
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Target Role & JD Inputs */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Target Role / Job Title
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g. Senior Frontend Engineer, Full Stack Tech Lead"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Target Job Description (Optional, for precise keyword matching)
                </label>
                <textarea
                  rows={4}
                  value={targetJd}
                  onChange={(e) => setTargetJd(e.target.value)}
                  placeholder="Paste the job description or role requirements here to get accurate keyword match scoring..."
                  className="w-full p-3 rounded-xl bg-background border border-border text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 leading-relaxed"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isUploading}
                className="w-full sm:flex-1 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all disabled:opacity-60"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Auditing ATS & Scoring...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Analyze & Score Resume
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleLoadSampleResume}
                disabled={isUploading}
                className="w-full sm:w-auto px-4 py-3.5 rounded-xl bg-secondary text-secondary-foreground text-xs font-semibold hover:bg-secondary/80 border border-border transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <FileText className="h-3.5 w-3.5 text-blue-400" />
                Try Sample Resume
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Info & Recent Resumes */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-card border border-border/70 space-y-4">
            <h3 className="font-bold text-sm tracking-tight flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              How ATS Scoring Works
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We combine <strong>deterministic rule engines</strong> (metrics, action verbs, word counts) with <strong>Gemini semantic AI</strong> to give you a genuine 0-100 score:
            </p>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start justify-between">
                <span className="text-muted-foreground">Keyword Match</span>
                <span className="font-semibold text-foreground">30%</span>
              </li>
              <li className="flex items-start justify-between">
                <span className="text-muted-foreground">Impact & Metrics</span>
                <span className="font-semibold text-foreground">20%</span>
              </li>
              <li className="flex items-start justify-between">
                <span className="text-muted-foreground">Formatting & Layout</span>
                <span className="font-semibold text-foreground">20%</span>
              </li>
              <li className="flex items-start justify-between">
                <span className="text-muted-foreground">Section Completeness</span>
                <span className="font-semibold text-foreground">15%</span>
              </li>
              <li className="flex items-start justify-between">
                <span className="text-muted-foreground">Grammar & Action Verbs</span>
                <span className="font-semibold text-foreground">15%</span>
              </li>
            </ul>
          </div>

          {/* Recent Resumes */}
          <div className="p-6 rounded-2xl bg-card border border-border/70">
            <h3 className="font-bold text-sm tracking-tight flex items-center gap-2 mb-4">
              <History className="h-4 w-4 text-indigo-400" />
              Past Resumes
            </h3>
            {isLoadingHistory ? (
              <div className="py-4 text-center text-xs text-muted-foreground">Loading history...</div>
            ) : recentResumes.length > 0 ? (
              <div className="space-y-2.5">
                {recentResumes.map((r) => (
                  <Link
                    key={r.id}
                    href={`/resume/${r.id}`}
                    className="p-2.5 rounded-xl bg-background border border-border hover:border-primary/40 flex items-center justify-between transition-all group"
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
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-xs font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10">
                        {r.score}/100
                      </span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground text-center py-4">
                No past resumes yet. Upload your first resume above!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
