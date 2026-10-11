import {
  AIProvider,
  AtsAnalysisInput,
  PrepKitInput,
  InterviewNextQuestionInput,
  InterviewFeedbackInput,
} from "./types";
import {
  AtsReportResult,
  PrepKitResult,
  InterviewFeedbackResult,
} from "@/types";

export class MockProvider implements AIProvider {
  name = "Deterministic Mock AI (Local Fallback)";

  async analyzeResume(input: AtsAnalysisInput): Promise<AtsReportResult> {
    const { wordCount, bulletCount, quantifiedBulletCount, actionVerbCount } =
      input.detectedMetrics;

    const formattingScore = Math.min(20, Math.max(12, wordCount > 300 && wordCount < 1200 ? 18 : 13));
    const keywordScore = input.targetJd ? 24 : 22;
    const completenessScore = 14;
    const impactScore = Math.min(20, Math.max(10, Math.round((quantifiedBulletCount / Math.max(1, bulletCount)) * 20) + 4));
    const clarityScore = Math.min(15, Math.max(10, Math.round((actionVerbCount / Math.max(1, bulletCount)) * 15) + 3));

    const overallScore = Math.min(
      98,
      formattingScore + keywordScore + completenessScore + impactScore + clarityScore
    );

    return {
      overallScore,
      breakdown: {
        formatting: formattingScore,
        keywordMatch: keywordScore,
        sectionCompleteness: completenessScore,
        impact: impactScore,
        grammarClarity: clarityScore,
      },
      matchedKeywords: [
        "React",
        "TypeScript",
        "Next.js",
        "Tailwind CSS",
        "REST APIs",
        "Git",
        "CI/CD",
      ],
      missingKeywords: [
        "System Architecture",
        "Performance Benchmarking",
        "Distributed Caching",
        "Micro-Frontends",
        "Automated E2E Testing",
      ],
      bulletRewrites: [
        {
          original: "Built features and collaborated with backend team to deliver web pages.",
          improved:
            "Engineered modular frontend architecture for core customer dashboard using React and TypeScript, boosting page speed by 34% and supporting 150K DAU.",
          reason: "Transformed passive duty listing into high-impact Google XYZ achievement format with quantifiable metrics.",
        },
        {
          original: "Responsible for fixing bugs and improving UI styles across the app.",
          improved:
            "Resolved 45+ critical rendering bottlenecks and unified design system tokens with Tailwind CSS, reducing regression bug tickets by 28%.",
          reason: "Added specific scale numbers and eliminated weak passive verbs ('responsible for').",
        },
      ],
      topFixes: [
        {
          priority: "HIGH",
          title: "Include Measurable Business Outcomes",
          description:
            "Only 30% of your experience bullets cite concrete business metrics (ARR, latency, conversion, DAU). Recalibrate each bullet with exact numbers.",
        },
        {
          priority: "HIGH",
          title: "Target Missing Keyword Clusters",
          description:
            "Add explicit mentions of distributed systems, performance profiling, and testing frameworks to pass corporate ATS screens.",
        },
        {
          priority: "MEDIUM",
          title: "Strengthen Action Verb Openers",
          description:
            "Replace generic verbs like 'helped', 'worked on', and 'handled' with high-leverage verbs like 'Architected', 'Spearheaded', 'Optimized'.",
        },
        {
          priority: "LOW",
          title: "Ensure One-Page Brevity",
          description:
            "Trim narrative descriptions in older roles to ensure your resume fits compactly within industry reading limits.",
        },
      ],
      rawMetrics: {
        wordCount,
        bulletCount,
        quantifiedBulletCount,
        actionVerbCount,
      },
    };
  }

  async generatePrepKit(input: PrepKitInput): Promise<PrepKitResult> {
    const company = input.companyName || "Target Company";
    const role = input.targetRole || "Software Engineer";

    return {
      companyOverview: {
        culture: `High-velocity engineering environment with heavy emphasis on technical ownership, customer empathy, and autonomous problem-solving at ${company}.`,
        values: [
          "Customer Obsession & Empathy",
          "Ownership & Bias for Action",
          "Invent and Simplify",
          "High Bar for Engineering Quality",
        ],
        businessModel: `Scalable technology platform delivering world-class software solutions and enterprise developer workflows for ${company}.`,
        recentDevelopments:
          "Heavy investments in AI-assisted workflows, real-time edge computing, and global infrastructure expansion.",
      },
      interviewRounds: [
        {
          roundName: "Round 1: Recruiter & Behavioral Screen",
          focus: "Background walkthrough, core values alignment, salary expectations, role fit",
          typicalDuration: "30-45 mins",
          expectations: "Clear 2-minute elevator pitch, STAR stories highlighting leadership and resilience.",
        },
        {
          roundName: "Round 2: Technical Deep Dive & Coding",
          focus: "Data structures, algorithms, modular system implementation, clean code",
          typicalDuration: "60 mins",
          expectations: "Strong time/space complexity analysis, proactive edge-case testing, readable production code.",
        },
        {
          roundName: "Round 3: System Design & Architecture",
          focus: "Scalability, caching, database partitioning, reliability, trade-offs",
          typicalDuration: "60 mins",
          expectations: "Structured requirements gathering, back-of-the-envelope calculations, clear API contracts.",
        },
        {
          roundName: "Round 4: Bar Raiser & Values Interview",
          focus: "Handling technical conflict, prioritization dilemmas, ownership under pressure",
          typicalDuration: "45 mins",
          expectations: "Demonstrated maturity, admitting mistakes, and data-driven cross-functional decision making.",
        },
      ],
      questionBank: [
        {
          category: "System Design",
          question: `How would you design a fault-tolerant, low-latency notification and event system for ${company} that delivers 10M messages/day?`,
          tip: "Clarify delivery guarantees (at-least-once vs exactly-once), use message queues (Kafka/SQS) with dead-letter topics, and discuss mobile push vs webhooks.",
          samplePoints: [
            "Decoupled ingestion and worker pools",
            "Rate limiting per merchant/tenant",
            "Idempotency keys on notifications",
          ],
        },
        {
          category: "Technical / Architecture",
          question: `Explain how you would optimize Core Web Vitals (specifically INP and LCP) in a complex SPA / SSR ${role} application.`,
          tip: "Discuss server components, streaming SSR, code splitting, image optimization, and avoiding long tasks on the main thread.",
          samplePoints: [
            "Tree shaking and bundle budget analysis",
            "Yielding to the main thread with scheduler.yield()",
            "Critical CSS inlining",
          ],
        },
        {
          category: "Behavioral (STAR)",
          question:
            "Tell me about a time you strongly disagreed with a product manager or senior engineer on an architectural decision. How did you resolve it?",
          tip: "Focus on using objective data/benchmarks rather than emotional arguments, and emphasize mutual respect.",
          samplePoints: [
            "Framing around customer and business outcomes",
            "Running an empirical POC or benchmark",
            "Disagree and commit principle",
          ],
        },
      ],
      skillGaps: [
        {
          skill: "Distributed Caching & Invalidation",
          importance: "CRITICAL",
          recommendation:
            "Review Cache-Aside, Write-Through patterns and Redis cluster eviction algorithms.",
          studyLinks: ["https://martinfowler.com", "https://aws.amazon.com/caching/"],
        },
        {
          skill: "Web Performance & Core Vitals",
          importance: "RECOMMENDED",
          recommendation:
            "Practice diagnosing Interaction to Next Paint (INP) bottlenecks using Chrome DevTools Performance panel.",
          studyLinks: ["https://web.dev/explore/metrics"],
        },
      ],
      revisionTopics: [
        {
          topic: "Core Algorithms & Concurrency",
          keyConcepts: ["Sliding Window", "BFS/DFS Graphs", "Race condition mitigation", "Promise concurrency"],
          subtopics: ["Worker threads", "Event loop execution phases"],
        },
        {
          topic: "Production Reliability",
          keyConcepts: ["Graceful degradation", "Circuit breakers", "Exponential backoff with jitter"],
          subtopics: ["Health checks", "Observability (OpenTelemetry)"],
        },
      ],
    };
  }

  async generateNextInterviewQuestion(input: InterviewNextQuestionInput): Promise<{
    question: string;
    isWrapUp: boolean;
    interviewerNote?: string;
  }> {
    const isFirst = input.currentQuestionIndex === 1;
    const isLast = input.currentQuestionIndex >= input.totalQuestions;

    if (isFirst) {
      return {
        question: `Hi there! I'm your interviewer today. We'll be conducting a ${input.level} ${input.interviewType.toLowerCase()} interview for the ${input.targetRole} position. Let's start with a foundational question: Could you walk me through an end-to-end technical project you architected recently, highlighting the key technical decisions and tradeoffs you made?`,
        isWrapUp: false,
        interviewerNote: "Assessing architectural communication, ownership scope, and clarity.",
      };
    }

    if (isLast) {
      return {
        question: `Thank you for sharing that insight. For our final question: Looking back at your proudest technical achievement, what was the most difficult unexpected failure mode or production outage you encountered, and what long-term preventive measures did you put in place?`,
        isWrapUp: true,
        interviewerNote: "Evaluating resilience, debugging depth, and post-mortem culture.",
      };
    }

    const adaptiveBank = [
      `That's an interesting approach. Digging a bit deeper into your previous response: If this service were to experience a sudden 10x surge in concurrent traffic, where would the primary bottleneck emerge, and how would you protect the upstream systems?`,
      `Great. Let's shift gears toward system reliability: How do you handle schema migrations or breaking API changes across multiple client versions without downtime?`,
      `Understood. Now, tell me about a time you had to balance code quality and extensive test coverage against a hard production deadline. What did you prioritize and how did you manage the technical debt afterward?`,
      `Excellent points. How do you approach observability and alerting in your applications so that your team discovers production anomalies before your end customers do?`,
    ];

    const questionText =
      adaptiveBank[(input.currentQuestionIndex - 2) % adaptiveBank.length];

    return {
      question: questionText,
      isWrapUp: false,
      interviewerNote: "Evaluating operational excellence and failure isolation.",
    };
  }

  async evaluateInterview(input: InterviewFeedbackInput): Promise<InterviewFeedbackResult> {
    const qCount = Math.max(1, input.questionsAndAnswers.length);
    const overallScore = 86;

    const evaluations = input.questionsAndAnswers.map((qa) => ({
      questionIndex: qa.questionIndex,
      question: qa.question,
      answer: qa.answer,
      score: 85,
      rubricScores: {
        starMethod: 82,
        technicalAccuracy: 88,
        clarity: 85,
      },
      feedback:
        "Strong structured thoughts. You clearly articulated the engineering requirements and demonstrated solid familiarity with trade-offs. To elevate your score to 95+, bring in more quantitative metrics regarding performance and cost implications.",
      idealAnswer:
        "A standout response follows the STAR framework: (1) Situation: Outline the problem scope and business constraints. (2) Task: State your specific technical ownership. (3) Action: Detail the design patterns (e.g. idempotency, event streams), data models, and resilience measures. (4) Result: Quantify the latency drop, uptime SLA achieved, or engineering hours saved.",
    }));

    return {
      overallScore,
      summary: `The candidate demonstrated strong senior-level technical judgment for the ${input.level} ${input.targetRole} role. Explanations were coherent, confident, and well-grounded in production engineering realities. Incorporating sharper metrics and explicitly naming architectural trade-offs will make future interviews virtually unbeatable.`,
      rubrics: {
        starMethod: 83,
        technicalAccuracy: 89,
        clarity: 86,
        confidence: 88,
        relevance: 91,
      },
      questionEvaluations: evaluations,
      strengths: [
        "Articulate communication with clean logical progression",
        "Pragmatic approach to engineering trade-offs and tech debt",
        "Clear familiarity with modern production architectures and edge cases",
      ],
      weaknesses: [
        "Could include more specific numbers (e.g. p99 latencies, operational cost, error rates)",
        "Occasionally focused on the 'what' instead of the 'why' behind architectural choices",
      ],
      actionableTips: [
        "Always structure behavioral stories around concrete business metrics and percentages.",
        "Proactively state 2 alternative solutions and why you discarded them before settling on your chosen design.",
        "Emphasize post-launch observability: explain how you monitored success using telemetry dashboards.",
      ],
    };
  }
}
