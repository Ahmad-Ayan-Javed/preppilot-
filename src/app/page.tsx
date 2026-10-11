import React from "react";
import Link from "next/link";
import {
  FileText,
  Briefcase,
  Mic,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Zap,
  Target,
  BarChart3,
  Bot,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-600/20 via-violet-600/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="container max-w-6xl mx-auto px-4 pt-20 pb-16 sm:pt-28 sm:pb-24 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse-glow">
          <Sparkles className="h-3.5 w-3.5" />
          <span>AI Interview & ATS Platform 2.0</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.1] mb-6">
          Nail your interview.{" "}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">
            Beat the ATS.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
          Upload your resume for transparent 5-pillar ATS scoring, generate insider prep kits for top companies, and practice live mock interviews with an adaptive AI bar-raiser.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link
            href="/resume"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
          >
            <FileText className="h-4 w-4" />
            Analyze Resume (Free)
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/interview/setup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 border border-border transition-all"
          >
            <Mic className="h-4 w-4 text-violet-400" />
            Launch Mock Interview
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <BarChart3 className="h-4 w-4" />
            View Demo Dashboard
          </Link>
        </div>

        {/* Trust & Proof points */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 text-left max-w-4xl w-full border-t border-border/40 pt-10">
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-bold text-foreground">5 Pillars</span>
            <span className="text-xs text-muted-foreground mt-0.5">Deterministic + AI ATS Score</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-bold text-foreground">STAR Method</span>
            <span className="text-xs text-muted-foreground mt-0.5">Structured Behavioral Rubrics</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-bold text-foreground">Adaptive</span>
            <span className="text-xs text-muted-foreground mt-0.5">Dynamic Follow-up Engine</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-bold text-foreground">100% Free</span>
            <span className="text-xs text-muted-foreground mt-0.5">Zero Paywalls for Job Seekers</span>
          </div>
        </div>
      </section>

      {/* Feature Pillar Showcase */}
      <section className="container max-w-6xl mx-auto px-4 py-16 border-t border-border/40">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-3">
            Everything you need to interview with unstoppable confidence
          </h2>
          <p className="text-sm text-muted-foreground">
            Built by senior engineering managers to replicate the exact bar-raising standards at tier-1 technology firms.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-card border border-border/60 hover:border-primary/40 transition-all flex flex-col justify-between group">
            <div>
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Resume ATS Auditor</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Upload your PDF or DOCX. Get a transparent 0-100 score across 5 categories: formatting, keyword density, completeness, impact quantification, and grammar.
              </p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Missing keyword detection against target JD
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  AI rewritten bullets using Google XYZ format
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Prioritized Top 10 Fixes checklist
                </li>
              </ul>
            </div>
            <Link
              href="/resume"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              Analyze a resume <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-card border border-border/60 hover:border-primary/40 transition-all flex flex-col justify-between group">
            <div>
              <div className="h-12 w-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Company Prep Kits</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Targeting Stripe, Google, Amazon, or a fast-growing startup? Generate tailored kits detailing real interview rounds, company culture principles, and curated question banks.
              </p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Exact round breakdown with typical expectations
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Tailored question bank with interviewer tips
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Skill gap identification and targeted study plan
                </li>
              </ul>
            </div>
            <Link
              href="/prep"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              Generate Prep Kit <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-card border border-border/60 hover:border-primary/40 transition-all flex flex-col justify-between group">
            <div>
              <div className="h-12 w-12 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Live AI Mock Interview Room</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Chat or speak with an AI interviewer persona that asks adaptive follow-up questions based on your resume and past answers, backed by timed rounds.
              </p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Per-question countdown timer & skip controls
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Web Speech API STT and TTS voice support
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Post-session feedback report with ideal answers
                </li>
              </ul>
            </div>
            <Link
              href="/interview/setup"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              Setup an interview <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="container max-w-5xl mx-auto px-4 py-16">
        <div className="rounded-3xl bg-gradient-to-br from-blue-900/40 via-indigo-900/30 to-violet-900/40 border border-primary/30 p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto relative z-10">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-4">
              Ready to transform your interview performance?
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mb-8">
              Join thousands of software engineers, product managers, and data scientists preparing with PrepPilot.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/resume"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all"
              >
                Upload Resume Now
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-card border border-border text-foreground font-semibold hover:bg-muted/80 transition-all"
              >
                Sign In with Demo User
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
