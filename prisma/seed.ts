import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing seed data
  await prisma.interviewFeedback.deleteMany();
  await prisma.interviewMessage.deleteMany();
  await prisma.interviewSession.deleteMany();
  await prisma.prepKit.deleteMany();
  await prisma.atsReport.deleteMany();
  await prisma.resume.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Create demo user
  const hashedPassword = await bcrypt.hash("password123", 10);
  const demoUser = await prisma.user.create({
    data: {
      name: "Alex Morgan",
      email: "alex@example.com",
      passwordHash: hashedPassword,
      role: "USER",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
    },
  });

  console.log(`Created demo user: ${demoUser.email} (Password: password123)`);

  // Create sample resume
  const sampleResume = await prisma.resume.create({
    data: {
      userId: demoUser.id,
      fileName: "Alex_Morgan_Senior_Frontend_Resume.pdf",
      fileSize: 1048576,
      fileType: "application/pdf",
      version: 1,
      targetRole: "Senior Frontend Engineer",
      targetJd: "Seeking a Senior Frontend Engineer proficient in React, Next.js, TypeScript, Tailwind CSS, performance optimization, and testing with Jest/Playwright. Experience with distributed state and system design is a strong plus.",
      rawText: `ALEX MORGAN
San Francisco, CA • alex@example.com • (555) 123-4567 • linkedin.com/in/alexmorgan • github.com/alexmorgan

SUMMARY
Results-oriented Senior Frontend Engineer with 6+ years of experience architecting high-performance web applications in React, TypeScript, and Next.js. Spearheaded frontend performance initiatives reducing LCP by 42% across 2M+ monthly active users.

EXPERIENCE
Staff / Senior Frontend Engineer | TechCorp Inc. | 2021 – Present
- Architected and delivered customer checkout flow using Next.js 14, improving page conversion by 18% and generating $3.2M in incremental ARR.
- Reduced initial bundle size by 38% through route code-splitting, tree shaking, and dynamic component imports.
- Mentored 6 junior/mid engineers and standardized testing across frontend squads, elevating code coverage from 54% to 88%.
- Implemented real-time dashboard analytics processing 50K websocket events/sec using React and Web Workers.

Frontend Engineer | InnovateSoft | 2018 – 2021
- Built responsive customer portals using React, Redux Toolkit, and Tailwind CSS.
- Automated CI/CD pipeline test runs with GitHub Actions and Playwright, cutting deployment cycle times by 30%.
- Collaborated with UI/UX designers to implement design system tokens adopted across 14 internal product teams.

EDUCATION
B.S. in Computer Science | University of California, Berkeley | 2014 – 2018

SKILLS
Languages: TypeScript, JavaScript, HTML5, CSS3, SQL, Python
Frameworks & Libraries: React, Next.js, Tailwind CSS, Redux, Zustand, Framer Motion
Testing & Tools: Jest, React Testing Library, Playwright, Git, Docker, Webpack, Vite`,
      parsedSections: JSON.stringify({
        contact: {
          name: "Alex Morgan",
          email: "alex@example.com",
          phone: "(555) 123-4567",
          location: "San Francisco, CA",
          linkedin: "linkedin.com/in/alexmorgan",
          github: "github.com/alexmorgan",
        },
        summary: "Results-oriented Senior Frontend Engineer with 6+ years of experience architecting high-performance web applications...",
        skills: ["TypeScript", "React", "Next.js", "Tailwind CSS", "Redux", "Jest", "Playwright", "Docker"],
        experience: [
          { company: "TechCorp Inc.", role: "Staff / Senior Frontend Engineer", period: "2021 – Present" },
          { company: "InnovateSoft", role: "Frontend Engineer", period: "2018 – 2021" },
        ],
        education: [{ institution: "University of California, Berkeley", degree: "B.S. in Computer Science", year: "2018" }],
      }),
    },
  });

  // Create ATS Report
  await prisma.atsReport.create({
    data: {
      resumeId: sampleResume.id,
      overallScore: 84,
      breakdown: JSON.stringify({
        formatting: 18,
        keywordMatch: 25,
        sectionCompleteness: 15,
        impact: 16,
        grammarClarity: 14,
      }),
      matchedKeywords: JSON.stringify(["React", "Next.js", "TypeScript", "Tailwind CSS", "Playwright", "Jest", "Git"]),
      missingKeywords: JSON.stringify(["System Design", "Distributed State", "Web Vitals", "GraphQL", "CI/CD Pipeline Security"]),
      bulletRewrites: JSON.stringify([
        {
          original: "Built responsive customer portals using React, Redux Toolkit, and Tailwind CSS.",
          improved: "Engineered responsive customer web applications using React and Tailwind CSS, increasing user session duration by 24% across 450K monthly active users.",
          reason: "Added quantified user impact and scale metrics.",
        },
        {
          original: "Collaborated with UI/UX designers to implement design system tokens adopted across 14 internal product teams.",
          improved: "Co-authored and unified an enterprise design system across 14 product squads, accelerating feature delivery velocity by 35% and ensuring 100% WCAG 2.1 AA accessibility compliance.",
          reason: "Emphasized velocity gains and accessibility compliance.",
        },
      ]),
      topFixes: JSON.stringify([
        {
          priority: "HIGH",
          title: "Include System Design & Distributed Architecture",
          description: "Target job description heavily emphasizes system design. Add a bullet under TechCorp describing how you handled distributed state or caching layers.",
        },
        {
          priority: "MEDIUM",
          title: "Quantify InnovateSoft Achievements",
          description: "Two bullets in your early role describe responsibilities instead of measurable business or technical outcomes.",
        },
        {
          priority: "LOW",
          title: "Standardize Date Formats",
          description: "Use consistent en-dash spacing across all experience ranges.",
        },
      ]),
      rawMetrics: JSON.stringify({
        wordCount: 312,
        bulletCount: 7,
        quantifiedBulletCount: 5,
        actionVerbCount: 8,
      }),
    },
  });

  // Create Sample Prep Kit
  await prisma.prepKit.create({
    data: {
      userId: demoUser.id,
      companyName: "Stripe",
      targetRole: "Senior Frontend Engineer",
      level: "SENIOR",
      interviewType: "MIXED",
      companyOverview: JSON.stringify({
        culture: "High engineering rigor, user obsession, long-term craft, and clear written documentation.",
        values: ["Think rigorously", "Move with urgency", "Macro optimism, micro paranoia", "Details matter"],
        businessModel: "Global economic infrastructure for the internet, developer-first APIs, high-reliability billing platforms.",
      }),
      interviewRounds: JSON.stringify([
        { roundName: "Recruiter Screen", focus: "Background, role alignment, expectations", typicalDuration: "30 mins" },
        { roundName: "Technical Screen", focus: "Live coding in React & JavaScript with real API integration", typicalDuration: "60 mins" },
        { roundName: "Frontend System Design", focus: "Architecture of an enterprise component library or checkout SDK", typicalDuration: "60 mins" },
        { roundName: "Debugging & Craft", focus: "Investigating bug reports in an unfamiliar codebase", typicalDuration: "60 mins" },
        { roundName: "Culture & Leadership", focus: "Handling tradeoffs, feedback, and cross-functional disagreements", typicalDuration: "45 mins" },
      ]),
      questionBank: JSON.stringify([
        {
          category: "System Design",
          question: "How would you design an embedded checkout widget SDK that loads securely and performantly on third-party merchant sites?",
          tip: "Focus on iframe isolation, cross-domain postMessage protocols, and sub-100ms cold start bundle optimization.",
        },
        {
          category: "Technical / Coding",
          question: "Implement a robust auto-retry mechanism with exponential backoff and jitter for transient network failures.",
          tip: "Mention idempotency keys and cancellation tokens using AbortController.",
        },
        {
          category: "Behavioral",
          question: "Describe a situation where you had to push back on a product requirement due to technical debt or performance risks.",
          tip: "Use the STAR method and demonstrate how you reached a pragmatic consensus without stalling delivery.",
        },
      ]),
      skillGaps: JSON.stringify([
        { skill: "Cross-Origin Security", recommendation: "Revise iframe sandboxing, Content Security Policy, and Web Crypto APIs." },
        { skill: "SDK Performance Budgeting", recommendation: "Study Tree-shaking, Rollup bundle analysis, and polyfill minimization." },
      ]),
      revisionTopics: JSON.stringify([
        { topic: "Frontend Performance", keyConcepts: ["INP (Interaction to Next Paint)", "Hydration boundaries", "Resource hints"] },
        { topic: "API Reliability", keyConcepts: ["Idempotency", "Rate limiting algorithms (Token bucket)", "SSE vs WebSockets"] },
      ]),
    },
  });

  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
