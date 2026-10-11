"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Code2,
  Play,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  Loader2,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

// Dynamically import Monaco Editor to avoid SSR window issues
const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

export default function CodingRoundSandboxPage() {
  const [language, setLanguage] = useState("typescript");
  const [code, setCode] = useState(
`// Problem: Design and implement an LRU (Least Recently Used) Cache.
// Support get(key) and put(key, value) in O(1) average time complexity.

class LRUCache {
  private capacity: number;
  private cache: Map<number, number>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key: number): number {
    if (!this.cache.has(key)) return -1;
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key: number, value: number): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Evict oldest item (first key in insertion order)
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
      }
    }
    this.cache.set(key, value);
  }
}`
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [review, setReview] = useState<any>(null);

  const handleReviewCode = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/interview/code-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemTitle: "Design and Implement LRU Cache",
          language,
          code,
        }),
      });
      const data = await res.json();
      setReview(data.review);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 flex-1 flex flex-col space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border/80">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <Code2 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground">
              Technical Coding Round: LRU Cache Implementation
            </h1>
            <p className="text-xs text-muted-foreground">
              Standard Tier-1 Tech Interview Question • Average O(1) Time Target
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-background border border-border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="typescript">TypeScript</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
          </select>

          <button
            onClick={handleReviewCode}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 flex items-center gap-1.5 shadow-md shadow-primary/20 transition-all disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Analyzing Code...
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                Submit for AI Review
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Workspace (Editor + Review Panel) */}
      <div className="grid lg:grid-cols-3 gap-6 flex-1 min-h-[500px]">
        {/* Editor Area (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-card border border-border/80 overflow-hidden flex flex-col">
          <div className="px-4 py-2 border-b border-border/40 text-[11px] font-mono text-muted-foreground flex items-center justify-between bg-muted/20">
            <span>solution.{language === "python" ? "py" : language === "typescript" ? "ts" : "js"}</span>
            <span>Monaco Sandbox</span>
          </div>
          <div className="flex-1 min-h-[450px]">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                scrollBeyondLastLine: false,
                padding: { top: 12 },
              }}
            />
          </div>
        </div>

        {/* AI Evaluation Panel (1 col) */}
        <div className="p-6 rounded-2xl bg-card border border-border/80 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-violet-400" />
              <h2 className="text-sm font-bold">AI Technical Code Evaluation</h2>
            </div>

            {review ? (
              <div className="space-y-4 text-xs">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-between">
                  <span className="font-bold">Code Quality Score</span>
                  <span className="text-base font-black">{review.score}/100</span>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-foreground">Correctness:</span>
                  <p className="text-muted-foreground leading-relaxed">{review.correctness}</p>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-foreground">Complexity Analysis:</span>
                  <p className="text-muted-foreground">
                    <strong>Time:</strong> {review.timeComplexity}
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Space:</strong> {review.spaceComplexity}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-foreground">Style & Clean Code:</span>
                  <p className="text-muted-foreground leading-relaxed">{review.styleAndCleanCode}</p>
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="font-bold text-amber-400">Optimization Suggestions:</span>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {review.suggestedImprovements?.map((s: string, idx: number) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-muted-foreground space-y-2">
                <Code2 className="h-8 w-8 mx-auto text-muted-foreground/60" />
                <p>Click &quot;Submit for AI Review&quot; above to get instant analysis on algorithmic correctness, time/space complexity, and code readability.</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-border/40">
            <Link
              href="/interview/setup"
              className="w-full py-2.5 rounded-xl bg-secondary text-secondary-foreground text-xs font-semibold hover:bg-secondary/80 border border-border flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Back to Mock Interview Setup</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
