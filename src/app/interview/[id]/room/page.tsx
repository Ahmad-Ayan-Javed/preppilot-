"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Clock,
  Send,
  SkipForward,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Bot,
  User,
  Sparkles,
  PhoneOff,
} from "lucide-react";

export default function MockInterviewRoomPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [answerText, setAnswerText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [timeSpentOnQ, setTimeSpentOnQ] = useState(0);

  // Voice States
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(false);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Speech Recognition & Synthesis
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript) {
            setAnswerText((prev) => (prev ? `${prev} ${transcript}` : transcript));
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Text to Speech
  const speakText = (text: string) => {
    if (!ttsEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // Toggle Voice Recording
  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Fetch initial session state
  useEffect(() => {
    if (!sessionId) return;

    fetch(`/api/interview/${sessionId}/finish`) // or custom fetch
      .catch(() => {});

    // For demo or active session load
    // Mock or load from API
    setSessionData({
      companyName: "Target Company",
      targetRole: "Senior Frontend Engineer",
      interviewType: "MIXED",
      timePerQuestion: 180,
    });
    setTimeLeft(180);
    setLoading(false);
  }, [sessionId]);

  // Per-question countdown timer
  useEffect(() => {
    if (loading || isSubmitting) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
      setTimeSpentOnQ((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, isSubmitting]);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle first message from start
  useEffect(() => {
    if (messages.length === 0) {
      const initialQuestion = `Hi there! Welcome to your mock interview for the Senior Frontend Engineer position. Let's begin with our first question: Could you walk me through the architecture of a high-scale web application you built recently, and explain the key technical tradeoffs you made?`;
      setMessages([
        {
          role: "INTERVIEWER",
          content: initialQuestion,
          questionIndex: 1,
        },
      ]);
      speakText(initialQuestion);
    }
  }, [ttsEnabled]);

  const handleSubmitAnswer = async () => {
    if (!answerText.trim()) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const currentAnswer = answerText.trim();
    setAnswerText("");
    setIsSubmitting(true);

    // Append candidate message
    const updated = [
      ...messages,
      {
        role: "CANDIDATE",
        content: currentAnswer,
        questionIndex: currentQuestionIndex,
      },
    ];
    setMessages(updated);

    try {
      const res = await fetch(`/api/interview/${sessionId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answer: currentAnswer,
          questionIndex: currentQuestionIndex,
          timeSpentSec: timeSpentOnQ,
        }),
      });

      const data = await res.json();

      if (data.isCompleted) {
        // Complete interview
        await handleFinishInterview();
        return;
      }

      if (data.nextQuestion) {
        setMessages([
          ...updated,
          {
            role: "INTERVIEWER",
            content: data.nextQuestion,
            questionIndex: data.questionIndex,
          },
        ]);
        setCurrentQuestionIndex(data.questionIndex);
        setTimeLeft(180);
        setTimeSpentOnQ(0);
        speakText(data.nextQuestion);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishInterview = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/interview/${sessionId}/finish`, {
        method: "POST",
      });
      router.push(`/interview/${sessionId}/feedback`);
    } catch (err) {
      console.error(err);
      router.push(`/interview/${sessionId}/feedback`);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? "0" : ""}${remainder}`;
  };

  return (
    <div className="container max-w-5xl mx-auto px-4 py-6 flex-1 flex flex-col h-[calc(100vh-80px)]">
      {/* Room Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border/80 flex items-center justify-between gap-4 mb-4 shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-10 w-10 rounded-xl bg-violet-600 text-white flex items-center justify-center font-bold">
              <Bot className="h-5 w-5" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-background" />
          </div>
          <div>
            <div className="text-xs font-bold text-foreground flex items-center gap-2">
              <span>AI Bar Raiser Interviewer</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20 font-semibold">
                Question {currentQuestionIndex} of {totalQuestions}
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground">
              {sessionData?.targetRole || "Software Engineer"} • Live Session
            </div>
          </div>
        </div>

        {/* Timer & Controls */}
        <div className="flex items-center gap-2.5">
          <div
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold ${
              timeLeft < 30
                ? "bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse"
                : "bg-muted/60 border-border text-foreground"
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          {/* TTS Speaker Toggle */}
          <button
            onClick={() => setTtsEnabled(!ttsEnabled)}
            title={ttsEnabled ? "Disable AI Voice" : "Enable AI Voice"}
            className={`p-2 rounded-xl border transition-colors ${
              ttsEnabled
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-muted/40 border-border text-muted-foreground"
            }`}
          >
            {ttsEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>

          {/* End Interview */}
          <button
            onClick={handleFinishInterview}
            className="px-3 py-1.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold hover:bg-destructive/20 transition-colors flex items-center gap-1.5"
          >
            <PhoneOff className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Finish & Report</span>
          </button>
        </div>
      </div>

      {/* Chat Messages Transcript Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 rounded-2xl bg-card border border-border/80 space-y-4 mb-4">
        {messages.map((m, idx) => {
          const isAi = m.role === "INTERVIEWER";
          return (
            <div
              key={idx}
              className={`flex items-start gap-3 ${isAi ? "justify-start" : "justify-end"}`}
            >
              {isAi && (
                <div className="h-8 w-8 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isAi
                    ? "bg-background border border-border/70 text-foreground"
                    : "bg-primary text-primary-foreground font-medium shadow-md shadow-primary/10"
                }`}
              >
                {m.content}
              </div>

              {!isAi && (
                <div className="h-8 w-8 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}

        {isSubmitting && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground p-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span>AI interviewer is listening and preparing adaptive follow-up...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Response Controls */}
      <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-3 shrink-0">
        <div className="relative">
          <textarea
            rows={3}
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmitAnswer();
              }
            }}
            placeholder="Type your response here (or click the microphone to speak)..."
            className="w-full p-3 pr-24 rounded-xl bg-background border border-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 leading-relaxed resize-none"
          />

          <div className="absolute right-3 bottom-3 flex items-center gap-1.5">
            {speechSupported && (
              <button
                type="button"
                onClick={toggleListening}
                title={isListening ? "Stop speech recognition" : "Speak your answer"}
                className={`p-2 rounded-lg transition-colors ${
                  isListening
                    ? "bg-rose-500 text-white animate-pulse"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
            )}

            <button
              type="button"
              onClick={handleSubmitAnswer}
              disabled={isSubmitting || !answerText.trim()}
              className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Quick Helper Actions */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const lastQ = messages.filter((m) => m.role === "INTERVIEWER").pop();
                if (lastQ) speakText(lastQ.content);
              }}
              className="flex items-center gap-1 text-[11px] hover:text-foreground transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              Repeat Question
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setAnswerText("I would like to pass or proceed to the next question.");
              }}
              className="flex items-center gap-1 text-[11px] hover:text-foreground transition-colors"
            >
              <SkipForward className="h-3 w-3" />
              Skip Question
            </button>
          </div>

          <div className="text-[11px]">
            Press <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono">Enter ↵</kbd> to submit
          </div>
        </div>
      </div>
    </div>
  );
}
