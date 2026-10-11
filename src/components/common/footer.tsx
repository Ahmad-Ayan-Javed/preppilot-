import React from "react";
import Link from "next/link";
import { Sparkles, Shield, Cpu, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-card/40 py-8 mt-auto">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <span className="font-semibold text-sm">PrepPilot</span>
          <span className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} • AI ATS Auditor & Mock Interviewer
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-emerald-400" />
            <span>Prompt Injection Guarded</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-blue-400" />
            <span>Powered by Gemini & Deterministic Heuristics</span>
          </div>
          <Link href="/settings" className="hover:text-foreground transition-colors">
            Privacy & Settings
          </Link>
        </div>
      </div>
    </footer>
  );
}
