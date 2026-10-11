"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Shield,
  Key,
  Trash2,
  Cpu,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Sparkles,
} from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [geminiKey, setGeminiKey] = useState("");
  const [savedKey, setSavedKey] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("preppilot_gemini_key", geminiKey);
    setSavedKey(true);
    setTimeout(() => setSavedKey(false), 3000);
  };

  const handleDeleteData = async () => {
    if (
      !window.confirm(
        "Are you sure you want to permanently erase all your uploaded resumes, ATS scores, and mock interview sessions? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch("/api/user/data", { method: "DELETE" });
      const data = await res.json();
      setDeleteMessage(data.message || "All personal data erased.");
    } catch (err: any) {
      setDeleteMessage(err?.message || "Failed to delete data.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-10 flex-1 space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
          <Shield className="h-3.5 w-3.5" />
          <span>Privacy & Configuration</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Account & System Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage AI provider preferences, privacy controls, and data erasure options.
        </p>
      </div>

      {/* Profile Overview */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 space-y-4">
        <h2 className="text-base font-bold tracking-tight">Active User Profile</h2>
        <div className="grid sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-background border border-border/60">
            <span className="text-muted-foreground block mb-1 font-semibold uppercase tracking-wider">
              Display Name
            </span>
            <span className="font-bold text-foreground text-sm">
              {session?.user?.name || "Alex Morgan"}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-background border border-border/60">
            <span className="text-muted-foreground block mb-1 font-semibold uppercase tracking-wider">
              Email Address
            </span>
            <span className="font-bold text-foreground text-sm">
              {session?.user?.email || "alex@example.com"}
            </span>
          </div>
        </div>
      </div>

      {/* AI Provider Configuration */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-primary" />
            <h2 className="text-base font-bold tracking-tight">AI Model & API Provider</h2>
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            PrepPilot is configured with a provider abstraction layer. By default, it operates with Google Gemini 1.5/2.0 Flash, backed by an instant deterministic fallback engine when offline.
          </p>
        </div>

        <form onSubmit={handleSaveKey} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Custom Gemini API Key (Optional Override)
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5">
              Leave blank to use the server environment variable. Keys entered here are kept solely in your browser storage.
            </p>
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-secondary text-secondary-foreground text-xs font-semibold hover:bg-secondary/80 border border-border transition-colors flex items-center gap-2"
          >
            {savedKey ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Key Saved Locally
              </>
            ) : (
              "Save API Key"
            )}
          </button>
        </form>
      </div>

      {/* Danger Zone: Delete My Data */}
      <div className="p-6 sm:p-8 rounded-3xl bg-destructive/5 border border-destructive/20 space-y-4">
        <div>
          <div className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-4 w-4" />
            <h2 className="text-base font-bold tracking-tight">Data Privacy & GDPR Erasure</h2>
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            PrepPilot respects candidate privacy. Under the &quot;Delete My Data&quot; policy, you can permanently erase all your uploaded resumes, parsed texts, ATS reports, and interview transcripts.
          </p>
        </div>

        {deleteMessage && (
          <div className="p-3 rounded-xl bg-background border border-border text-xs text-foreground">
            {deleteMessage}
          </div>
        )}

        <button
          onClick={handleDeleteData}
          disabled={isDeleting}
          className="px-4 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-xs font-semibold hover:bg-destructive/90 flex items-center gap-2 transition-all disabled:opacity-60"
        >
          {isDeleting ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Erasing Data...
            </>
          ) : (
            <>
              <Trash2 className="h-3.5 w-3.5" />
              Delete All My Data
            </>
          )}
        </button>
      </div>
    </div>
  );
}
